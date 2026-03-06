import { useLang } from "@/hooks/useLang";

const DiamondIcon = () => (
  <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
    <defs><linearGradient id="gem-foot" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse"><stop stopColor="#9d7fe0" /><stop offset="1" stopColor="#2dd4bf" /></linearGradient></defs>
    <path d="M14 2L26 14L14 26L2 14L14 2Z" fill="url(#gem-foot)" />
  </svg>
);

const Footer = () => {
  const { t } = useLang();
  return (
    <footer className="py-12 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="#" className="flex items-center gap-2 text-white font-bold text-lg"><DiamondIcon /> Synapse</a>
        <div className="flex items-center gap-6 text-sm" style={{ color: "rgba(232,232,240,0.45)" }}>
          <a href="#features" className="hover:text-white transition-colors">{t("nav.features")}</a>
          <a href="#pricing" className="hover:text-white transition-colors">{t("nav.pricing")}</a>
          <a href="#tutor" className="hover:text-white transition-colors">{t("tutor.label")}</a>
        </div>
        <p className="text-xs" style={{ color: "rgba(232,232,240,0.3)" }}>© {new Date().getFullYear()} Synapse. {t("footer.rights")}</p>
      </div>
    </footer>
  );
};

export default Footer;
