import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { LogTypesSection } from "@/components/LogTypesSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { CliShowcaseSection } from "@/components/CliShowcaseSection";
import { ProvidersSection } from "@/components/ProvidersSection";
import { PrivacySection } from "@/components/PrivacySection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#121212] text-[#ededed]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <LogTypesSection />
        <HowItWorksSection />
        <CliShowcaseSection />
        <ProvidersSection />
        <PrivacySection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
