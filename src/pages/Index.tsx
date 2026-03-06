import { LangProvider } from "@/hooks/useLang";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturesGrid from "@/components/FeaturesGrid";
import HowItWorks from "@/components/HowItWorks";
import AiTutorShowcase from "@/components/AiTutorShowcase";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

const Index = () => (
  <LangProvider>
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0f", color: "#e8e8f0" }}>
      <Navbar />
      <Hero />
      <FeaturesGrid />
      <HowItWorks />
      <AiTutorShowcase />
      <PricingSection />
      <Footer />
    </div>
  </LangProvider>
);

export default Index;
