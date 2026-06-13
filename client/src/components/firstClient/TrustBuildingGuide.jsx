import { FileCheck2, ListChecks, ShieldCheck, Target, Trophy, UserRoundCheck } from "lucide-react";
import { ROUTES } from "../../constants/index.js";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";

const guideItems = Object.freeze([
  {
    ctaLabel: "Complete Profile",
    description: "Make your headline specific, keep your bio outcome-focused, and add skills clients can match to challenges.",
    href: ROUTES.PROFILE,
    icon: UserRoundCheck,
    title: "Build profile trust",
  },
  {
    ctaLabel: "Open Proof Vault",
    description: "Add reviewable proof assets with clear titles, context, and safe visibility. Avoid vague portfolio dumps.",
    href: `${ROUTES.PROOF_VAULT}?new=1`,
    icon: ShieldCheck,
    title: "Build proof trust",
  },
  {
    ctaLabel: "Create Offer",
    description: "Package one measurable outcome so clients can understand the result, timeline, and proof expectations.",
    href: ROUTES.NEW_OUTCOME_OFFER,
    icon: Target,
    title: "Build offer trust",
  },
  {
    ctaLabel: "Explore Challenges",
    description: "Write execution plans around milestones, risks, proof checkpoints, and a realistic first outcome.",
    href: ROUTES.CHALLENGES,
    icon: ListChecks,
    title: "Build execution plan trust",
  },
  {
    ctaLabel: "Open Pipeline",
    description: "Treat shortlist signals as active opportunities. Follow up through the available workflow, not fake messaging.",
    href: ROUTES.OPPORTUNITY_PIPELINE,
    icon: FileCheck2,
    title: "Get shortlisted",
  },
  {
    ctaLabel: "Starter Challenges",
    description: "Focus on smaller challenges where you can deliver quickly, attach proof, and create your first verified history.",
    href: ROUTES.STARTER_CHALLENGES,
    icon: Trophy,
    title: "Win first client",
  },
]);

export function TrustBuildingGuide() {
  return (
    <Card as="section" aria-labelledby="trust-building-guide-title" variant="bordered">
      <CardHeader>
        <CardTitle id="trust-building-guide-title">Trust Building Guide</CardTitle>
        <CardDescription>
          Practical steps for earning trust before reviews and verified outcomes exist.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {guideItems.map((item) => {
          const Icon = item.icon;

          return (
            <article className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4" key={item.title}>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-[#3F6212]">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-black text-[#1C1917]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#78716C]">{item.description}</p>
              <Button as="a" className="mt-4 w-full min-h-10 px-4 py-2 text-xs" href={item.href} variant="outline">
                {item.ctaLabel}
              </Button>
            </article>
          );
        })}
      </CardContent>
    </Card>
  );
}
