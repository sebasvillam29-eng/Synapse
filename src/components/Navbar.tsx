import { useState, useEffect } from "react";
import { Menu, X, Zap, Globe } from "lucide-react";
import { useLang } from "@/hooks/useLang";

const Navbar = () => {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t("nav.features"), href: "#features" },
    { label: t("nav.howItWorks"), href: "#how-it-works" },
    { label: t("nav.demo"), href: "#demo" },
    { label: t("nav.pricing"), href: "#pricing" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-foreground font-bold text-xl">
          <Zap className="w-6 h-6 text-primary" />
          Synapse
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
            title={lang === "en" ? "Cambiar a Español" : "Switch to English"}
          >
            <Globe className="w-4 h-4" />
            {lang === "en" ? "ES" : "EN"}
          </button>
          <a href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t("nav.tryDemo")}
          </a>
          <a
            href="#pricing"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all duration-300"
          >
            {t("nav.getStarted")}
          </a>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Globe className="w-5 h-5" />
          </button>
          <button className="text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 pb-6 space-y-4 animate-fade-in">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#pricing"
            onClick={() => setMobileOpen(false)}
            className="block w-full text-center px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium"
          >
            {t("nav.getStarted")}
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
