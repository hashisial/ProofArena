import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, MinusCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "../../components/Button.jsx";
import { Container } from "../../components/Container.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { getRevealMotionProps } from "../../utils/motion.js";
import { SectionHeader } from "./SectionHeader.jsx";

const MotionDiv = motion.div;

const traditionalBullets = [
  "Browse profiles before defining clear outcomes",
  "Compare proposals that are hard to verify",
  "Manage progress across scattered tools",
  "Rely on ratings without proof context",
  "Hope the final result matches the promise",
];

const proofArenaBullets = [
  "Start with a measurable business outcome",
  "Review execution plans against the same goal",
  "Track milestones in a structured workflow",
  "Verify proof before reputation increases",
  "Build trust from evidence, not empty claims",
];

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

function ComparisonCard({ accent = false, bullets, icon, title }) {
  const IconComponent = icon;

  return (
    <Card
      className={`h-full transition duration-300 ${
        accent
          ? "border-[#3F6212]/25 shadow-[0_24px_80px_rgba(63, 98, 18, 0.14)] hover:border-[#3F6212]/50"
          : "bg-[#FAFAF9] hover:border-[#D4D4D8]"
      } premium-motion-card`}
      padding="lg"
      variant={accent ? "elevated" : "bordered"}
    >
      <div className="flex items-start gap-4">
        <span
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
            accent ? "bg-[#3F6212] text-white" : "bg-white text-[#78716C]"
          }`}
        >
          <IconComponent aria-hidden="true" className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <h3 className="text-xl font-black text-[#1C1917]">{title}</h3>
          {accent ? (
            <Badge className="mt-3" variant="primary">
              Evidence-first workflow
            </Badge>
          ) : (
            <Badge className="mt-3" variant="gray">
              Common workflow
            </Badge>
          )}
        </div>
      </div>

      <ul className="mt-7 grid gap-3">
        {bullets.map((bullet) => (
          <li className="flex items-start gap-3" key={bullet}>
            {accent ? (
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#3F6212]" />
            ) : (
              <MinusCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#78716C]" />
            )}
            <span className="text-sm font-semibold leading-7 text-[#44403C]">
              {bullet}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function MarketplacePositioningSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFBEB_0%,#F7FEE7_52%,#FFFFFF_100%)] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 -z-0 h-96 bg-[radial-gradient(circle_at_80%_20%,rgba(63, 98, 18, 0.16),transparent_32%),radial-gradient(circle_at_12%_80%,rgba(10,10,10,0.05),transparent_28%)]" />
      <Container className="relative z-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
          <SectionHeader
            badge="Beyond traditional hiring"
            description="ProofArena is designed for businesses that need outcomes, not profile browsing. Every challenge is structured around goals, milestones, and verified proof."
            title="Don't choose promises. Choose measurable execution."
          />

          <MotionDiv
            className="premium-motion-card rounded-3xl border border-[#65A30D]/30 bg-[#151B0D] p-5 text-white shadow-[0_28px_90px_rgba(18,10,34,0.22)] sm:p-6"
            {...getMotionProps(reduceMotion, 0.08)}
          >
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314]">
                <Sparkles aria-hidden="true" className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                  <p className="text-sm font-black text-white">
                  Outcome-first positioning
                </p>
                  <p className="mt-2 text-sm leading-7 text-white/72">
                  The platform starts with the result, then compares plans,
                  tracks proof, and updates reputation only when execution is
                  verified.
                </p>
              </div>
            </div>
          </MotionDiv>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <MotionDiv {...getMotionProps(reduceMotion, 0.12)}>
            <ComparisonCard
              bullets={traditionalBullets}
              icon={MinusCircle}
              title="Traditional service platforms"
            />
          </MotionDiv>

          <MotionDiv {...getMotionProps(reduceMotion, 0.18)}>
            <ComparisonCard
              accent
              bullets={proofArenaBullets}
              icon={ShieldCheck}
              title="ProofArena"
            />
          </MotionDiv>
        </div>

        <MotionDiv
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          {...getMotionProps(reduceMotion, 0.24)}
        >
          <Button as="a" className="w-full sm:w-auto" href={ROUTES.HOW_IT_WORKS}>
            See how it works
            <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
          </Button>
          <Button as="a" className="w-full sm:w-auto" href={ROUTES.PROOF_LEDGER} variant="secondary">
            Explore proof ledger
          </Button>
        </MotionDiv>
      </Container>
    </section>
  );
}
