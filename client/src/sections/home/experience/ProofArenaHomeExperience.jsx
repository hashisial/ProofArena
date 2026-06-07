import { useEffect } from "react";
import { HomeExperienceMotion } from "./HomeExperienceMotion.jsx";
import { ProofArenaFinalCTA } from "./ProofArenaFinalCTA.jsx";
import { ProofArenaHero } from "./ProofArenaHero.jsx";
import { ProofArenaLeaderboard } from "./ProofArenaLeaderboard.jsx";
import { ProofArenaStory } from "./ProofArenaStory.jsx";
import { ProofArenaTrustFlywheel } from "./ProofArenaTrustFlywheel.jsx";

export function ProofArenaHomeExperience() {
  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content");

    document.title = "ProofArena by ScaleOps - Hire Outcomes. Verify Execution.";
    description?.setAttribute(
      "content",
      "Hire measurable outcomes, compare execution plans, and build trust through verified proof with ProofArena by ScaleOps.",
    );

    return () => {
      document.title = previousTitle;
      if (description && previousDescription) {
        description.setAttribute("content", previousDescription);
      }
    };
  }, []);

  return (
    <HomeExperienceMotion>
      <ProofArenaHero />
      <ProofArenaStory />
      <ProofArenaLeaderboard />
      <ProofArenaTrustFlywheel />
      <ProofArenaFinalCTA />
    </HomeExperienceMotion>
  );
}
