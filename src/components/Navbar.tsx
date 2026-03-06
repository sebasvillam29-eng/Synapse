import { useState, useEffect } from "react";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Demo", href: "#demo" },
  { label: "Pricing", href: "#pricing" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-[#0B0F1A]/80 backdrop-blur-xl"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className={`flex items-center gap-2 font-bold text-xl ${scrolled ? "text-foreground" : "text-white"}`}>
          <Zap className="w-6 h-6 text-[#7C3AED]" />
          Synapse
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors ${
                scrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="#demo"
            className={`text-sm transition-colors ${
              scrolled ? "text-muted-foreground hover:text-foreground" : "text-[#94A3B8] hover:text-white"
            }`}
          >
            Try Demo
          </a>
          <a
            href="#pricing"
            className="px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-sm font-medium hover:bg-[#6D28D9] transition-all duration-300"
          >
            Get Started
          </a>
        </div>

        <button
          className={`md:hidden ${scrolled ? "text-foreground" : "text-white"}`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className={`md:hidden px-6 pb-6 space-y-4 ${
          scrolled
            ? "bg-background/95 backdrop-blur-xl border-b border-border"
            : "bg-[#0B0F1A]/95 backdrop-blur-xl"
        }`}>
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className={`block transition-colors ${scrolled ? "text-muted-foreground hover:text-foreground" : "text-[#94A3B8] hover:text-white"}`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#pricing"
            onClick={() => setMobileOpen(false)}
            className="block w-full text-center px-4 py-2 rounded-lg bg-[#7C3AED] text-white font-medium"
          >
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
