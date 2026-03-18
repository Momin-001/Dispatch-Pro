import { Hero } from "@/components/guest/Homepage/Hero";
import { FeatureCards } from "@/components/guest/Homepage/Feature-Cards";
import { AboutSection } from "@/components/guest/Homepage/About-Section";
import { ServicesSection } from "@/components/guest/Homepage/Services-Section";
import { StatsSection } from "@/components/guest/Homepage/Stats-Section";
import { WhyChooseSection } from "@/components/guest/Homepage/Why-Choose-Section";
import { TrainingSection } from "@/components/guest/Homepage/Training-Section";
import { NewsSection } from "@/components/guest/Homepage/News-Section";

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureCards />
      <AboutSection />
      <ServicesSection />
      <StatsSection />
      <WhyChooseSection />
      <TrainingSection />
      <NewsSection />
    </>
  );
}
