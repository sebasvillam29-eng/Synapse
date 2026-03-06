import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLang } from "@/hooks/useLang";

const DiamondIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <defs>
      <linearGradient id="gem-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#9d7fe0" />
        <stop offset="1" stopColor="#2dd4bf" />
      </linearGradient>
    </defs>
    <path d="M14 2L26 14L14 26L2 14L14 2Z" fill="url(#gem-grad)" />
    <path d="M14 2L26 14L14 26L2 14L14 2Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
  </svg>
);

const Navbar = () => {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: t("nav.features"), href: "#features" },
    { label: t("nav.howItWorks"), href: "#process" },
    { label: t("nav.pricing"), href: "#pricing" },
    { label: t("nav.useCases"), href: "#tutor" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl border-b"
          : "bg-transparent"
      }`}
      style={{
        backgroundColor: scrolled ? "rgba(10,10,15,0.8)" : "transparent",
        borderColor: scrolled ? "rgba(255,255,255,0.07)" : "transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <DiamondIcon />
          <span className="text-white font-bold text-lg">Synapse</span>
        </a>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm transition-colors duration-300"
              style={{ color: "rgba(232,232,240,0.55)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,232,240,0.55)")}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language toggle */}
          <div
            className="flex items-center rounded-lg overflow-hidden"
            style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          >
            <button
              onClick={() => setLang("en")}
              className="px-3 py-1.5 text-xs font-medium transition-all duration-300"
              style={{
                backgroundColor: lang === "en" ? "rgba(255,255,255,0.15)" : "transparent",
                color: lang === "en" ? "#fff" : "rgba(232,232,240,0.45)",
              }}
            >
              EN
            </button>
            <button
              onClick={() => setLang("es")}
              className="px-3 py-1.5 text-xs font-medium transition-all duration-300"
              style={{
                backgroundColor: lang === "es" ? "rgba(255,255,255,0.15)" : "transparent",
                color: lang === "es" ? "#fff" : "rgba(232,232,240,0.45)",
              }}
            >
              ES
            </button>
          </div>

          <a
            href="/auth"
            className="text-sm transition-colors duration-300"
            style={{ color: "rgba(232,232,240,0.55)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,232,240,0.55)")}
          >
            {t("nav.login")}
          </a>

          <a
            href="/auth"
            className="px-5 py-2 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #7c5cbf, #9d7fe0)",
              boxShadow: "0 4px 24px rgba(124,92,191,0.35)",
            }}
          >
            {t("nav.getStarted")}
          </a>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <div className="flex items-center rounded-lg overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
            <button onClick={() => setLang("en")} className="px-2 py-1 text-xs" style={{ color: lang === "en" ? "#fff" : "rgba(232,232,240,0.45)", backgroundColor: lang === "en" ? "rgba(255,255,255,0.15)" : "transparent" }}>EN</button>
            <button onClick={() => setLang("es")} className="px-2 py-1 text-xs" style={{ color: lang === "es" ? "#fff" : "rgba(232,232,240,0.45)", backgroundColor: lang === "es" ? "rgba(255,255,255,0.15)" : "transparent" }}>ES</button>
          </div>
          <button className="text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-6 pb-6 space-y-4 animate-fade-in" style={{ backgroundColor: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)" }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block text-sm" style={{ color: "rgba(232,232,240,0.55)" }}>{l.label}</a>
          ))}
          <a href="/auth" onClick={() => setMobileOpen(false)} className="block w-full text-center px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: "linear-gradient(135deg, #7c5cbf, #9d7fe0)" }}>{t("nav.getStarted")}</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
