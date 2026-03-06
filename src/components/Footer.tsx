import { Zap } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-12 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <a href="#" className="flex items-center gap-2 text-foreground font-bold text-lg">
        <Zap className="w-5 h-5 text-primary" />
        Synapse
      </a>
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
        <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
        <a href="#demo" className="hover:text-foreground transition-colors">Demo</a>
      </div>
      <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Synapse. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
