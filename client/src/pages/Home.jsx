import { ClientProviderSplitSection } from "../sections/home/ClientProviderSplitSection.jsx";
import { FeaturedChallengesSection } from "../sections/home/FeaturedChallengesSection.jsx";
import { FeaturedProvidersSection } from "../sections/home/FeaturedProvidersSection.jsx";
import { HomeFinalCTA } from "../sections/home/HomeFinalCTA.jsx";
import { HomeHowItWorksSection } from "../sections/home/HomeHowItWorksSection.jsx";
import { HomeSearchDiscovery } from "../sections/home/HomeSearchDiscovery.jsx";
import { LeaderboardShowcase } from "../sections/home/LeaderboardShowcase.jsx";
import { MarketplaceDifferenceSection } from "../sections/home/MarketplaceDifferenceSection.jsx";
import { MarketplaceHeroSection } from "../sections/home/MarketplaceHeroSection.jsx";
import { OutcomeCategoriesSection } from "../sections/home/OutcomeCategoriesSection.jsx";
import { ProofLedgerShowcase } from "../sections/home/ProofLedgerShowcase.jsx";
import { TrustEvidenceSection } from "../sections/home/TrustEvidenceSection.jsx";

export function Home() {
  return (
    <div className="home-page min-w-0 overflow-x-clip text-[#1C1917]">
      <MarketplaceHeroSection />
      <HomeSearchDiscovery />
      <OutcomeCategoriesSection />
      <ClientProviderSplitSection />
      <MarketplaceDifferenceSection />
      <HomeHowItWorksSection />
      <ProofLedgerShowcase />
      <LeaderboardShowcase />
      <FeaturedChallengesSection />
      <FeaturedProvidersSection />
      <TrustEvidenceSection />
      <HomeFinalCTA />
    </div>
  );
}
