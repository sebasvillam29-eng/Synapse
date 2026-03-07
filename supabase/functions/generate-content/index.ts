import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("authorization");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader! } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { session_id, type } = await req.json();
    if (!session_id || !type) {
      return new Response(JSON.stringify({ error: "session_id and type are required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Fetch the study session
    const { data: session, error: sessionError } = await supabase
      .from("study_sessions")
      .select("*")
      .eq("id", session_id)
      .maybeSingle();

    if (sessionError || !session) {
      return new Response(JSON.stringify({ error: "Study session not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const notesText = session.notes_text;
    if (!notesText || notesText.trim() === "") {
      return new Response(JSON.stringify({ error: "No notes to generate from" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let tools: any[] = [];
    let toolChoice: any = undefined;
    let systemPrompt = "";

    if (type === "summary") {
      systemPrompt = "You are a study assistant. Generate a structured summary of the provided notes. Break it into clear sections with headings and body text.";
      tools = [{
        type: "function",
        function: {
          name: "create_summary",
          description: "Create a structured summary with sections",
          parameters: {
            type: "object",
            properties: {
              sections: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    heading: { type: "string", description: "Section heading" },
                    body: { type: "string", description: "Section body text, 2-3 sentences" },
                  },
                  required: ["heading", "body"],
                  additionalProperties: false,
                },
              },
            },
            required: ["sections"],
            additionalProperties: false,
          },
        },
      }];
      toolChoice = { type: "function", function: { name: "create_summary" } };
    } else if (type === "flashcards") {
      systemPrompt = "You are a study assistant. Generate flashcards from the provided notes. Each card should test a key concept.";
      tools = [{
        type: "function",
        function: {
          name: "create_flashcards",
          description: "Create flashcards with questions, answers, and explanations",
          parameters: {
            type: "object",
            properties: {
              cards: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    question: { type: "string" },
                    answer: { type: "string" },
                    why: { type: "string", description: "Why this concept matters, one sentence" },
                  },
                  required: ["question", "answer", "why"],
                  additionalProperties: false,
                },
              },
            },
            required: ["cards"],
            additionalProperties: false,
          },
        },
      }];
      toolChoice = { type: "function", function: { name: "create_flashcards" } };
    } else if (type === "quiz") {
      systemPrompt = "You are a study assistant. Generate 5 multiple-choice quiz questions from the provided notes. Each question should have 4 options with exactly one correct answer.";
      tools = [{
        type: "function",
        function: {
          name: "create_quiz",
          description: "Create quiz questions with options and explanations",
          parameters: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    question: { type: "string" },
                    options: { type: "array", items: { type: "string" }, description: "Exactly 4 options" },
                    correct_index: { type: "integer", description: "0-based index of the correct option" },
                    explanation: { type: "string", description: "Why the correct answer is right" },
                  },
                  required: ["question", "options", "correct_index", "explanation"],
                  additionalProperties: false,
                },
              },
            },
            required: ["questions"],
            additionalProperties: false,
          },
        },
      }];
      toolChoice = { type: "function", function: { name: "create_quiz" } };
    } else {
      return new Response(JSON.stringify({ error: "Invalid type. Use: summary, flashcards, quiz" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Here are my study notes:\n\n${notesText}` },
        ],
        tools,
        tool_choice: toolChoice,
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const errText = await aiResponse.text();
      console.error("AI error:", status, errText);
      throw new Error("AI generation failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const parsed = JSON.parse(toolCall.function.arguments);

    // Save to database
    if (type === "summary") {
      const summaryContent = JSON.stringify(parsed.sections);
      // Upsert: delete old, insert new
      await supabase.from("summaries").delete().eq("session_id", session_id);
      await supabase.from("summaries").insert({
        session_id,
        user_id: user.id,
        content: summaryContent,
      });
    } else if (type === "flashcards") {
      // Delete old set and cards, create new
      const { data: oldSets } = await supabase.from("flashcard_sets").select("id").eq("session_id", session_id);
      if (oldSets && oldSets.length > 0) {
        for (const s of oldSets) {
          await supabase.from("flashcards").delete().eq("set_id", s.id);
        }
        await supabase.from("flashcard_sets").delete().eq("session_id", session_id);
      }
      const { data: newSet } = await supabase.from("flashcard_sets").insert({
        session_id,
        user_id: user.id,
        title: session.title + " Flashcards",
      }).select().single();

      if (newSet) {
        const cards = parsed.cards.map((c: any) => ({
          set_id: newSet.id,
          question: c.question,
          answer: `${c.answer}\n---\n${c.why}`,
        }));
        await supabase.from("flashcards").insert(cards);
      }
    } else if (type === "quiz") {
      // Delete old quiz and questions, create new
      const { data: oldQuizzes } = await supabase.from("quizzes").select("id").eq("session_id", session_id);
      if (oldQuizzes && oldQuizzes.length > 0) {
        for (const q of oldQuizzes) {
          await supabase.from("quiz_questions").delete().eq("quiz_id", q.id);
        }
        await supabase.from("quizzes").delete().eq("session_id", session_id);
      }
      const { data: newQuiz } = await supabase.from("quizzes").insert({
        session_id,
        user_id: user.id,
        title: session.title + " Quiz",
        total_questions: parsed.questions.length,
      }).select().single();

      if (newQuiz) {
        const questions = parsed.questions.map((q: any) => ({
          quiz_id: newQuiz.id,
          question: q.question,
          options: q.options,
          correct_answer: q.options[q.correct_index],
        }));
        await supabase.from("quiz_questions").insert(questions);
      }
    }

    return new Response(JSON.stringify({ success: true, data: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("generate-content error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
