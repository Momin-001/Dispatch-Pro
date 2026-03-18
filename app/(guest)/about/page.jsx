import { AboutHero } from "@/components/guest/About/About-Hero";
import { AboutStat } from "@/components/guest/About/About-Stat";
import { AboutMission } from "@/components/guest/About/About-Mission";
import { AboutValues } from "@/components/guest/About/About-Values";
import { AboutTimeline } from "@/components/guest/About/About-Timeline";
import { AboutTeam } from "@/components/guest/About/About-Team";
import { AboutWhyDispatch } from "@/components/guest/About/About-Why-Dispatch";
import { AboutReadToJoin } from "@/components/guest/About/About-Read-To-Join";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStat />
      <AboutMission />
      <AboutValues />
      <AboutTimeline />
      <AboutTeam />
      <AboutWhyDispatch />
      <AboutReadToJoin />
    </>
  );
}
