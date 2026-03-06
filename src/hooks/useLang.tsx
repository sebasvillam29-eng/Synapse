import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "es";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const T: Record<Lang, Record<string, string>> = {
  en: {
    // Nav
    "nav.features": "Features",
    "nav.howItWorks": "How It Works",
    "nav.pricing": "Pricing",
    "nav.useCases": "Use Cases",
    "nav.login": "Log in",
    "nav.getStarted": "Get Started →",

    // Hero
    "hero.badge": "✦ Currently in early access · Free while we grow",
    "hero.h1.1": "Stop re-reading",
    "hero.h1.2": "your notes.",
    "hero.h1.3": "Start actually",
    "hero.h1.4": "learning.",
    "hero.sub": "Paste your notes → Synapse builds summaries, flashcards, quizzes and an AI tutor in seconds. Try it right now — no signup needed.",
    "hero.cta1": "Try the demo — it's free →",
    "hero.cta2": "See how it works ↓",
    "hero.trust": "No credit card. No account needed to try the demo.",
    "hero.workspace": "Synapse Workspace",
    "hero.drop": "Drop your PDF here",
    "hero.pdfDetected": "PDF detected",
    "hero.status1": "Reading your document...",
    "hero.status2": "Identifying key concepts...",
    "hero.status3": "Extracting sections...",
    "hero.status4": "Almost ready...",
    "hero.out1": "Summary generated",
    "hero.out2": "24 flashcards created",
    "hero.out3": "10-question quiz ready",
    "hero.out4": "AI Tutor available",

    // Features
    "feat.label": "FEATURES",
    "feat.title": "Everything you need to ",
    "feat.titleGrad": "study smarter",
    "feat.1.title": "AI-Generated Flashcards",
    "feat.1.desc": "Upload any document and get perfectly structured flashcards in seconds. Our AI identifies key concepts, definitions, and relationships automatically.",
    "feat.1.badge": "24 cards in 3s",
    "feat.2.title": "Spaced Repetition Engine",
    "feat.2.desc": "Scientifically proven review scheduling that adapts to your memory patterns. Focus on what you're about to forget.",
    "feat.2.badge": "Optimal review",
    "feat.3.title": "Performance Analytics",
    "feat.3.desc": "Track your mastery across subjects with detailed insights. See which topics need more attention and celebrate your progress.",
    "feat.3.badge": "87% mastery",
    "feat.4.title": "Smart PDF & Note Import",
    "feat.4.desc": "Drop in PDFs, paste notes, or link Google Docs. Synapse reads and understands any format you throw at it.",
    "feat.4.badge": "Any format",
    "feat.5.title": "Instant Quiz Generator",
    "feat.5.desc": "Generate practice quizzes from any study material. Multiple choice, true/false, and short answer — all auto-graded.",
    "feat.5.badge": "10 questions in 2s",
    "feat.6.title": "Study Scheduling",
    "feat.6.desc": "AI creates a personalized study plan based on your exam dates, topic difficulty, and available time.",
    "feat.6.badge": "Personal plan",

    // Process
    "proc.label": "PROCESS",
    "proc.title": "How Synapse works",
    "proc.sub": "Four steps from raw notes to exam confidence.",
    "proc.1.title": "Upload your content",
    "proc.1.desc": "Drop in PDFs, paste notes, or link Google Docs. Synapse reads everything.",
    "proc.2.title": "AI builds your study pack",
    "proc.2.desc": "Within seconds, get flashcards, summaries, quizzes, and a custom study schedule.",
    "proc.3.title": "Study & track progress",
    "proc.3.desc": "Work through sessions, review weak points, and watch your knowledge graph grow.",
    "proc.4.title": "Ace your exams",
    "proc.4.desc": "Go into exams knowing you've covered everything and retained what matters.",
    "proc.cta": "Start for free →",

    // Tutor
    "tutor.label": "AI TUTOR",
    "tutor.title1": "Ask the ",
    "tutor.titleGrad": "AI Tutor",
    "tutor.sub": "Real AI-powered answers — try it right now",
    "tutor.chip1": "Explain photosynthesis simply",
    "tutor.chip2": "Create a biology quiz question",
    "tutor.chip3": "Summarize key points of evolution",
    "tutor.chip4": "Help me study for my chemistry exam",
    "tutor.greeting": "Hi! I'm your Synapse AI Tutor 👋 Ask me anything — I can explain concepts, create quiz questions, summarize topics, or help you study any subject. What shall we learn today?",
    "tutor.placeholder": "Ask anything...",
    "tutor.send": "Send",
    "tutor.name": "Synapse AI Tutor",
    "tutor.online": "Online",

    // Pricing
    "price.label": "PRICING",
    "price.title1": "Simple, ",
    "price.titleGrad": "transparent",
    "price.title2": " pricing",
    "price.sub": "No hidden fees. Upgrade or downgrade anytime.",
    "price.free.label": "FREE",
    "price.free.price": "$0",
    "price.free.period": "forever",
    "price.free.sub": "Perfect to get started",
    "price.free.f1": "50 AI flashcards / month",
    "price.free.f2": "3 document imports",
    "price.free.f3": "Basic quiz generator",
    "price.free.f4": "7-day streak tracking",
    "price.free.cta": "Get started free",
    "price.pro.label": "PRO",
    "price.pro.badge": "MOST POPULAR",
    "price.pro.price": "$12",
    "price.pro.period": "/ month",
    "price.pro.sub": "For serious students",
    "price.pro.f1": "Unlimited flashcards",
    "price.pro.f2": "Unlimited imports",
    "price.pro.f3": "Advanced analytics",
    "price.pro.f4": "Spaced repetition engine",
    "price.pro.f5": "Custom study schedules",
    "price.pro.f6": "Export to Anki",
    "price.pro.cta": "Choose Pro",
    "price.team.label": "TEAM",
    "price.team.price": "$29",
    "price.team.period": "/ month",
    "price.team.sub": "For study groups",
    "price.team.f1": "Everything in Pro",
    "price.team.f2": "5 team members",
    "price.team.f3": "Shared decks & notes",
    "price.team.f4": "Group progress dashboard",
    "price.team.f5": "Priority support",
    "price.team.cta": "Choose Team",

    // Footer
    "footer.rights": "All rights reserved.",
  },
  es: {
    // Nav
    "nav.features": "Funciones",
    "nav.howItWorks": "Cómo Funciona",
    "nav.pricing": "Precios",
    "nav.useCases": "Casos de Uso",
    "nav.login": "Iniciar sesión",
    "nav.getStarted": "Comenzar →",

    // Hero
    "hero.badge": "✦ En acceso temprano · Gratis mientras crecemos",
    "hero.h1.1": "Deja de releer",
    "hero.h1.2": "tus apuntes.",
    "hero.h1.3": "Empieza a",
    "hero.h1.4": "aprender de verdad.",
    "hero.sub": "Pega tus apuntes → Synapse genera resúmenes, flashcards, quizzes y un tutor IA en segundos. Pruébalo ahora — sin registro.",
    "hero.cta1": "Prueba el demo — es gratis →",
    "hero.cta2": "Ver cómo funciona ↓",
    "hero.trust": "Sin tarjeta. Sin cuenta para probar el demo.",
    "hero.workspace": "Synapse Workspace",
    "hero.drop": "Suelta tu PDF aquí",
    "hero.pdfDetected": "PDF detectado",
    "hero.status1": "Leyendo tu documento...",
    "hero.status2": "Identificando conceptos clave...",
    "hero.status3": "Extrayendo secciones...",
    "hero.status4": "Casi listo...",
    "hero.out1": "Resumen generado",
    "hero.out2": "24 flashcards creadas",
    "hero.out3": "Quiz de 10 preguntas listo",
    "hero.out4": "Tutor IA disponible",

    // Features
    "feat.label": "FUNCIONES",
    "feat.title": "Todo lo que necesitas para ",
    "feat.titleGrad": "estudiar mejor",
    "feat.1.title": "Flashcards con IA",
    "feat.1.desc": "Sube cualquier documento y obtén flashcards perfectamente estructuradas en segundos. Nuestra IA identifica conceptos clave automáticamente.",
    "feat.1.badge": "24 cards en 3s",
    "feat.2.title": "Motor de Repetición Espaciada",
    "feat.2.desc": "Programación de repaso científicamente probada que se adapta a tus patrones de memoria.",
    "feat.2.badge": "Repaso óptimo",
    "feat.3.title": "Analíticas de Rendimiento",
    "feat.3.desc": "Rastrea tu dominio por materia con información detallada. Ve qué temas necesitan más atención.",
    "feat.3.badge": "87% dominio",
    "feat.4.title": "Importación de PDF y Notas",
    "feat.4.desc": "Sube PDFs, pega notas o enlaza Google Docs. Synapse lee y entiende cualquier formato.",
    "feat.4.badge": "Cualquier formato",
    "feat.5.title": "Generador de Quizzes",
    "feat.5.desc": "Genera quizzes de práctica de cualquier material. Opción múltiple, verdadero/falso — todo auto-calificado.",
    "feat.5.badge": "10 preguntas en 2s",
    "feat.6.title": "Planificación de Estudio",
    "feat.6.desc": "La IA crea un plan personalizado según tus fechas de examen, dificultad y tiempo disponible.",
    "feat.6.badge": "Plan personal",

    // Process
    "proc.label": "PROCESO",
    "proc.title": "Cómo funciona Synapse",
    "proc.sub": "Cuatro pasos de apuntes crudos a confianza en el examen.",
    "proc.1.title": "Sube tu contenido",
    "proc.1.desc": "Sube PDFs, pega notas o enlaza Google Docs. Synapse lee todo.",
    "proc.2.title": "La IA crea tu material",
    "proc.2.desc": "En segundos, obtén flashcards, resúmenes, quizzes y un horario de estudio.",
    "proc.3.title": "Estudia y sigue tu progreso",
    "proc.3.desc": "Trabaja en sesiones, repasa puntos débiles y observa crecer tu gráfico de conocimiento.",
    "proc.4.title": "Aprueba tus exámenes",
    "proc.4.desc": "Entra a tus exámenes sabiendo que cubriste todo y retuviste lo importante.",
    "proc.cta": "Empieza gratis →",

    // Tutor
    "tutor.label": "TUTOR IA",
    "tutor.title1": "Pregunta al ",
    "tutor.titleGrad": "Tutor IA",
    "tutor.sub": "Respuestas reales con IA — pruébalo ahora mismo",
    "tutor.chip1": "Explica la fotosíntesis de forma simple",
    "tutor.chip2": "Crea una pregunta de quiz de biología",
    "tutor.chip3": "Resume los puntos clave de la evolución",
    "tutor.chip4": "Ayúdame a estudiar para mi examen de química",
    "tutor.greeting": "¡Hola! Soy tu Tutor IA Synapse 👋 Pregúntame lo que quieras — puedo explicar conceptos, crear preguntas de quiz, resumir temas o ayudarte a estudiar cualquier materia. ¿Qué aprendemos hoy?",
    "tutor.placeholder": "Pregunta lo que sea...",
    "tutor.send": "Enviar",
    "tutor.name": "Tutor IA Synapse",
    "tutor.online": "En línea",

    // Pricing
    "price.label": "PRECIOS",
    "price.title1": "Precios simples y ",
    "price.titleGrad": "transparentes",
    "price.title2": "",
    "price.sub": "Sin costos ocultos. Mejora o baja de plan cuando quieras.",
    "price.free.label": "GRATIS",
    "price.free.price": "$0",
    "price.free.period": "para siempre",
    "price.free.sub": "Perfecto para empezar",
    "price.free.f1": "50 flashcards IA / mes",
    "price.free.f2": "3 documentos importados",
    "price.free.f3": "Generador de quiz básico",
    "price.free.f4": "Racha de 7 días",
    "price.free.cta": "Empieza gratis",
    "price.pro.label": "PRO",
    "price.pro.badge": "MÁS POPULAR",
    "price.pro.price": "$12",
    "price.pro.period": "/ mes",
    "price.pro.sub": "Para estudiantes serios",
    "price.pro.f1": "Flashcards ilimitadas",
    "price.pro.f2": "Importaciones ilimitadas",
    "price.pro.f3": "Analíticas avanzadas",
    "price.pro.f4": "Motor de repetición espaciada",
    "price.pro.f5": "Horarios de estudio personalizados",
    "price.pro.f6": "Exportar a Anki",
    "price.pro.cta": "Elegir Pro",
    "price.team.label": "EQUIPO",
    "price.team.price": "$29",
    "price.team.period": "/ mes",
    "price.team.sub": "Para grupos de estudio",
    "price.team.f1": "Todo en Pro",
    "price.team.f2": "5 miembros del equipo",
    "price.team.f3": "Mazos y notas compartidas",
    "price.team.f4": "Panel de progreso grupal",
    "price.team.f5": "Soporte prioritario",
    "price.team.cta": "Elegir Equipo",

    // Footer
    "footer.rights": "Todos los derechos reservados.",
  },
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

  const t = (key: string): string => T[lang]?.[key] ?? key;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
};
