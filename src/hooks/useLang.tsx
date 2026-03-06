import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "en" | "es";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.features": { en: "Features", es: "Funciones" },
  "nav.howItWorks": { en: "How It Works", es: "Cómo Funciona" },
  "nav.demo": { en: "Demo", es: "Demo" },
  "nav.pricing": { en: "Pricing", es: "Precios" },
  "nav.tryDemo": { en: "Try Demo", es: "Probar Demo" },
  "nav.getStarted": { en: "Get Started", es: "Comenzar" },

  // Hero
  "hero.badge": { en: "AI-Powered Study Companion", es: "Compañero de Estudio con IA" },
  "hero.title1": { en: "Stop re-reading your notes.", es: "Deja de releer tus apuntes." },
  "hero.title2": { en: "Start actually learning.", es: "Empieza a aprender de verdad." },
  "hero.subtitle": { en: "Upload your notes and watch AI transform them into summaries, flashcards, and quizzes — in seconds.", es: "Sube tus apuntes y observa cómo la IA los transforma en resúmenes, flashcards y quizzes — en segundos." },
  "hero.cta1": { en: "Start Studying Free", es: "Empieza Gratis" },
  "hero.cta2": { en: "Try Demo", es: "Probar Demo" },
  "hero.phase1": { en: "Upload PDF", es: "Subir PDF" },
  "hero.phase2": { en: "AI Processing", es: "Procesando con IA" },
  "hero.phase3": { en: "Study Tools Ready", es: "Material de Estudio Listo" },
  "hero.analyzing": { en: "Analyzing content...", es: "Analizando contenido..." },
  "hero.generating": { en: "Generating study tools...", es: "Generando material de estudio..." },
  "hero.optimizing": { en: "Optimizing for retention...", es: "Optimizando para retención..." },
  "hero.summariesReady": { en: "Summary generated", es: "Resumen generado" },
  "hero.flashcardsReady": { en: "24 flashcards created", es: "24 flashcards creadas" },
  "hero.quizReady": { en: "Quiz with 10 questions", es: "Quiz con 10 preguntas" },

  // Value Strip
  "value.save": { en: "Save hours of study time", es: "Ahorra horas de estudio" },
  "value.retain": { en: "Retain more from every session", es: "Retén más de cada sesión" },
  "value.anywhere": { en: "Study anywhere, anytime", es: "Estudia donde sea, cuando sea" },

  // Interactive Demo
  "demo.title1": { en: "See it in", es: "Míralo en" },
  "demo.title2": { en: "action", es: "acción" },
  "demo.subtitle": { en: "Try the interactive demo — no signup required.", es: "Prueba la demo interactiva — sin registrarte." },
  "demo.summaries": { en: "Summaries", es: "Resúmenes" },
  "demo.flashcards": { en: "Flashcards", es: "Flashcards" },
  "demo.quiz": { en: "Quiz", es: "Quiz" },
  "demo.yourNotes": { en: "Your Notes", es: "Tus Apuntes" },
  "demo.generateSummary": { en: "Generate Summary", es: "Generar Resumen" },
  "demo.aiGenerating": { en: "AI is generating your summary…", es: "La IA está generando tu resumen…" },
  "demo.aiSummary": { en: "AI Summary", es: "Resumen IA" },
  "demo.reset": { en: "↺ Reset", es: "↺ Reiniciar" },
  "demo.cardOf": { en: "of", es: "de" },
  "demo.clickToFlip": { en: "click to flip", es: "clic para voltear" },
  "demo.question": { en: "Question", es: "Pregunta" },
  "demo.correct": { en: "Correct! 🎉", es: "¡Correcto! 🎉" },
  "demo.incorrect": { en: "Incorrect — the answer is A.", es: "Incorrecto — la respuesta es A." },
  "demo.tryAgain": { en: "↺ Try again", es: "↺ Intentar de nuevo" },

  // How It Works
  "how.title1": { en: "How it", es: "Cómo" },
  "how.title2": { en: "works", es: "funciona" },
  "how.subtitle": { en: "Three simple steps to smarter studying.", es: "Tres pasos simples para estudiar mejor." },
  "how.step1.title": { en: "Upload your notes", es: "Sube tus apuntes" },
  "how.step1.desc": { en: "Drag and drop any document, PDF, or typed notes.", es: "Arrastra y suelta cualquier documento, PDF o apuntes escritos." },
  "how.step2.title": { en: "AI generates study tools", es: "La IA genera tu material" },
  "how.step2.desc": { en: "Summaries, flashcards and quizzes created in seconds.", es: "Resúmenes, flashcards y quizzes creados en segundos." },
  "how.step3.title": { en: "Study & retain more", es: "Estudia y retén más" },
  "how.step3.desc": { en: "Interactive study sessions designed for long-term memory.", es: "Sesiones de estudio interactivas para memoria a largo plazo." },

  // Features
  "feat.title1": { en: "Everything you need to", es: "Todo lo que necesitas para" },
  "feat.title2": { en: "study smarter", es: "estudiar mejor" },
  "feat.subtitle": { en: "Powerful AI tools designed for real learning.", es: "Herramientas de IA diseñadas para aprendizaje real." },
  "feat.summaries.title": { en: "AI Summaries", es: "Resúmenes IA" },
  "feat.summaries.desc": { en: "Condense pages of notes into key concepts instantly.", es: "Condensa páginas de apuntes en conceptos clave al instante." },
  "feat.flashcards.title": { en: "Flashcard Generator", es: "Generador de Flashcards" },
  "feat.flashcards.desc": { en: "Auto-create flashcards from any study material.", es: "Crea flashcards automáticamente de cualquier material." },
  "feat.quiz.title": { en: "AI Quiz Creator", es: "Creador de Quizzes IA" },
  "feat.quiz.desc": { en: "Generate practice quizzes to test your knowledge.", es: "Genera quizzes de práctica para evaluar tu conocimiento." },
  "feat.ask.title": { en: "AI Tutor", es: "Tutor IA" },
  "feat.ask.desc": { en: "Chat with your notes and get sourced answers.", es: "Chatea con tus apuntes y obtén respuestas con fuentes." },
  "feat.dashboard.title": { en: "Study Dashboard", es: "Panel de Estudio" },
  "feat.dashboard.desc": { en: "Track all your study materials in one place.", es: "Organiza todo tu material de estudio en un solo lugar." },
  "feat.progress.title": { en: "Progress Tracking", es: "Seguimiento de Progreso" },
  "feat.progress.desc": { en: "Visualize your learning streaks and retention.", es: "Visualiza tus rachas de aprendizaje y retención." },

  // Use Cases
  "use.title1": { en: "Designed for", es: "Diseñado para" },
  "use.title2": { en: "every student", es: "todo estudiante" },
  "use.subtitle": { en: "No matter what you study, Synapse adapts to your material.", es: "Sin importar lo que estudies, Synapse se adapta a tu material." },
  "use.premed.title": { en: "Pre-Med Students", es: "Estudiantes de Medicina" },
  "use.premed.desc": { en: "Turn dense biology and anatomy notes into bite-sized flashcards and quizzes.", es: "Convierte apuntes densos de biología y anatomía en flashcards y quizzes." },
  "use.law.title": { en: "Law Students", es: "Estudiantes de Derecho" },
  "use.law.desc": { en: "Summarize case briefs and statutes in seconds — spend more time analyzing.", es: "Resume casos y estatutos en segundos — dedica más tiempo al análisis." },
  "use.eng.title": { en: "Engineering Students", es: "Estudiantes de Ingeniería" },
  "use.eng.desc": { en: "Generate practice problems from lecture notes and textbook chapters.", es: "Genera problemas de práctica de tus apuntes y libros de texto." },
  "use.lang.title": { en: "Language Learners", es: "Aprendices de Idiomas" },
  "use.lang.desc": { en: "Create vocabulary flashcards automatically from reading passages.", es: "Crea flashcards de vocabulario automáticamente de textos de lectura." },

  // Pricing
  "price.title1": { en: "Simple, honest", es: "Precios simples y" },
  "price.title2": { en: "pricing", es: "honestos" },
  "price.subtitle": { en: "Start free. Upgrade when you're ready.", es: "Empieza gratis. Mejora cuando quieras." },
  "price.free": { en: "Free", es: "Gratis" },
  "price.pro": { en: "Pro", es: "Pro" },
  "price.forever": { en: "forever", es: "para siempre" },
  "price.month": { en: "/month", es: "/mes" },
  "price.mostPopular": { en: "Most Popular", es: "Más Popular" },
  "price.getStartedFree": { en: "Get Started Free", es: "Comenzar Gratis" },
  "price.upgradePro": { en: "Upgrade to Pro", es: "Mejorar a Pro" },
  "price.f1": { en: "5 summaries per month", es: "5 resúmenes al mes" },
  "price.f2": { en: "Basic flashcards", es: "Flashcards básicas" },
  "price.f3": { en: "Limited quizzes", es: "Quizzes limitados" },
  "price.f4": { en: "Community support", es: "Soporte comunitario" },
  "price.p1": { en: "Unlimited summaries", es: "Resúmenes ilimitados" },
  "price.p2": { en: "Unlimited flashcards", es: "Flashcards ilimitadas" },
  "price.p3": { en: "Unlimited quizzes", es: "Quizzes ilimitados" },
  "price.p4": { en: "Chat with your notes", es: "Chatea con tus apuntes" },
  "price.p5": { en: "Priority AI processing", es: "Procesamiento IA prioritario" },
  "price.p6": { en: "Progress analytics", es: "Analíticas de progreso" },

  // AI Tutor
  "tutor.title1": { en: "Your personal", es: "Tu" },
  "tutor.title2": { en: "AI Tutor", es: "Tutor IA personal" },
  "tutor.subtitle": { en: "Ask anything about your notes and get instant, sourced answers.", es: "Pregunta cualquier cosa sobre tus apuntes y obtén respuestas con fuentes al instante." },
  "tutor.question": { en: "Explain the Calvin cycle and how it relates to the light reactions", es: "Explica el ciclo de Calvin y cómo se relaciona con las reacciones lumínicas" },
  "tutor.answer": { en: "The **Calvin cycle** (also called the light-independent reactions) takes place in the **stroma** of chloroplasts. It uses the ATP and NADPH produced during the light reactions to fix CO₂ into organic molecules through a process called **carbon fixation**.\n\nThe cycle has three main stages:\n1. **Carbon fixation** — CO₂ is attached to RuBP by the enzyme RuBisCO\n2. **Reduction** — 3-PGA is converted to G3P using ATP and NADPH\n3. **Regeneration** — RuBP is regenerated to continue the cycle", es: "El **ciclo de Calvin** (también llamado reacciones independientes de la luz) ocurre en el **estroma** de los cloroplastos. Utiliza el ATP y NADPH producidos durante las reacciones lumínicas para fijar CO₂ en moléculas orgánicas mediante un proceso llamado **fijación de carbono**.\n\nEl ciclo tiene tres etapas principales:\n1. **Fijación de carbono** — el CO₂ se une al RuBP por la enzima RuBisCO\n2. **Reducción** — el 3-PGA se convierte en G3P usando ATP y NADPH\n3. **Regeneración** — el RuBP se regenera para continuar el ciclo" },
  "tutor.source1": { en: "Campbell Biology, Ch. 10.3", es: "Campbell Biology, Cap. 10.3" },
  "tutor.source2": { en: "Lecture Notes — Week 4", es: "Apuntes de Clase — Semana 4" },
  "tutor.source3": { en: "Khan Academy — Photosynthesis", es: "Khan Academy — Fotosíntesis" },
  "tutor.sources": { en: "Sources", es: "Fuentes" },
  "tutor.askPlaceholder": { en: "Ask about your notes...", es: "Pregunta sobre tus apuntes..." },

  // Final CTA
  "cta.title1": { en: "Start studying", es: "Empieza a estudiar" },
  "cta.title2": { en: "smarter", es: "más inteligente" },
  "cta.title3": { en: "today", es: "hoy" },
  "cta.subtitle": { en: "Join students who are learning faster with AI-powered study tools.", es: "Únete a estudiantes que aprenden más rápido con herramientas de estudio con IA." },
  "cta.button": { en: "Get Started Free", es: "Comenzar Gratis" },

  // Footer
  "footer.rights": { en: "All rights reserved.", es: "Todos los derechos reservados." },
};

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export const useLang = () => useContext(LangContext);

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("synapse-lang");
    return (saved === "es" ? "es" : "en") as Lang;
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("synapse-lang", l);
  };

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
};
