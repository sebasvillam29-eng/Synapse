import { LangProvider } from "@/hooks/useLang";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ValueStrip from "@/components/ValueStrip";
import InteractiveDemo from "@/components/InteractiveDemo";
import HowItWorks from "@/components/HowItWorks";
import FeaturesGrid from "@/components/FeaturesGrid";
import AiTutorShowcase from "@/components/AiTutorShowcase";
import UseCases from "@/components/UseCases";
import PricingSection from "@/components/PricingSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => (
  <LangProvider>
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <ValueStrip />
      <InteractiveDemo />
      <HowItWorks />
      <FeaturesGrid />
      <AiTutorShowcase />
      <UseCases />
      <PricingSection />
      <FinalCTA />
      <Footer />
    </div>
  </LangProvider>
);

export default Index;
