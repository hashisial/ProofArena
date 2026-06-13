import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  FileCheck2,
  ListChecks,
  MinusCircle,
  ShieldCheck,
  Star,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { Button } from "../../components/Button.jsx";
import { Container } from "../../components/Container.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { getRevealMotionProps, slideInRight } from "../../utils/motion.js";
import { SectionHeader } from "./SectionHeader.jsx";

const MotionDiv = motion.div;

const providerProblems = [
  "Profiles can look similar",
  "New providers struggle to earn trust",
  "Reviews do not always explain real results",
  "Clients compare claims instead of proof",
  "Strong execution is hard to showcase",
];

const proofArenaApproach = [
  "Submit structured execution plans",
  "Complete milestone-based delivery",
  "Upload proof for completed work",
  "Build a proof score over time",
  "Get discovered through verified outcomes",
];

const reputationCards = [
  {
    description: "Show clients exactly how you will deliver the outcome before work starts.",
    highlights: ["Strategy", "Timeline", "Milestones", "Proof requirements"],
    icon: ListChecks,
    title: "Execution Plans",
  },
  {
    description: "Break work into clear checkpoints so clients can see real progress.",
    highlights: ["Progress tracking", "Client visibility", "Structured updates", "Delivery accountability"],
    icon: Target,
    title: "Milestone Delivery",
  },
  {
    description: "Upload evidence that proves the outcome was completed properly.",
    highlights: ["Screenshots", "Reports", "Links", "Delivery records"],
    icon: FileCheck2,
    title: "Verified Proof",
  },
  {
    description: "Grow your reputation with approved proof, completed outcomes, and reliable delivery.",
    highlights: ["Completed outcomes", "Approval rate", "On-time delivery", "Trust signals"],
    icon: Trophy,
    title: "Proof Score",
  },
];

const providerStats = [
  { label: "Proof Score", value: "92" },
  { label: "Outcomes Completed", value: "18" },
  { label: "Approval Rate", value: "96%" },
  { label: "On-time Rate", value: "94%" },
];

const providerBadges = ["Verified proof", "Milestone delivery", "Outcome specialist"];

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

function BulletList({ accent = false, items }) {
  return (
    <ul className="mt-5 grid gap-3">
      {items.map((item) => (
        <li className="flex items-start gap-3" key={item}>
          {accent ? (
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#3F6212]" />
          ) : (
            <MinusCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#78716C]" />
          )}
          <span className="text-sm font-semibold leading-7 text-[#44403C]">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ReputationCard({ card, index, reduceMotion }) {
  const Icon = card.icon;

  return (
    <MotionDiv {...getMotionProps(reduceMotion, index * 0.05)}>
      <Card
        className="premium-motion-card group h-full transition duration-300 hover:-translate-y-1 hover:border-[#65A30D] hover:shadow-[0_24px_76px_rgba(63, 98, 18, 0.14)]"
        padding="lg"
        variant="default"
      >
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314] transition duration-300 group-hover:bg-[#3F6212] group-hover:text-white">
            <Icon aria-hidden="true" className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h3 className="text-xl font-black leading-tight text-[#1C1917]">
              {card.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#57534E]">
              {card.description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {card.highlights.map((highlight) => (
            <span
              className="rounded-full border border-[#E7E5E4] bg-[#FAFAF9] px-3 py-2 text-xs font-black text-[#44403C]"
              key={highlight}
            >
              {highlight}
            </span>
          ))}
        </div>
      </Card>
    </MotionDiv>
  );
}

function ProviderPreviewPanel() {
  return (
    <Card
      className="premium-tilt premium-motion-card relative overflow-hidden border-[#3F6212]/20 shadow-[0_28px_90px_rgba(63, 98, 18, 0.14)] lg:overflow-visible"
      padding="none"
      variant="elevated"
    >
      <div className="rounded-[2rem] border border-white bg-white p-4 sm:p-5">
        <div className="rounded-[1.5rem] bg-[#1C1917] p-5 text-white">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white text-lg font-black text-[#365314]">
                VP
              </span>
              <div className="min-w-0">
                <p className="text-lg font-black leading-6">Verified Provider</p>
                <p className="mt-1 text-sm leading-6 text-white/68">
                  Real Estate Lead Generation Specialist
                </p>
              </div>
            </div>
            <Badge variant="primary">Generic preview</Badge>
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/15">
            <div className="motion-score-fill h-full w-[92%] rounded-full bg-[#65A30D]" />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-sm">
            <span className="font-bold text-white/70">Proof score</span>
            <span className="font-black text-white">92</span>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {providerStats.map((stat) => (
            <div className="rounded-2xl border border-[#E7E5E4] bg-[#FAFAF9] p-4" key={stat.label}>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#78716C]">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-black text-[#1C1917]">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {providerBadges.map((badge) => (
            <span
              className="inline-flex items-center gap-2 rounded-full border border-[#3F6212]/20 bg-[#F7FEE7] px-3 py-2 text-xs font-black text-[#365314]"
              key={badge}
            >
              <BadgeCheck aria-hidden="true" className="h-4 w-4" />
              {badge}
            </span>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[#ECFCCB] bg-[#FEFCE8] p-4">
          <div className="flex items-start gap-3">
            <Star aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#3F6212]" />
            <p className="text-sm font-semibold leading-7 text-[#57534E]">
              Provider visibility is framed around proof signals: completed
              outcomes, approved proof, and reliable milestone delivery.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Button as="a" className="w-full" href={ROUTES.PROVIDERS} variant="secondary">
            View Provider Path
          </Button>
        </div>
      </div>

      <div className="absolute -right-3 top-8 hidden rounded-2xl border border-[#E7E5E4] bg-white px-4 py-3 shadow-[0_18px_50px_rgba(28, 25, 23, 0.1)] lg:block">
        <div className="flex items-center gap-2">
          <TrendingUp aria-hidden="true" className="h-5 w-5 text-[#3F6212]" />
          <span className="text-sm font-black text-[#1C1917]">Proof rising</span>
        </div>
      </div>
    </Card>
  );
}

export function ProviderValueSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#F7FEE7] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_82%_8%,rgba(63, 98, 18, 0.18),transparent_34%),radial-gradient(circle_at_10%_74%,rgba(10,10,10,0.05),transparent_28%)]" />
      <Container className="relative z-10">
        <MotionDiv {...getMotionProps(reduceMotion, 0)}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end">
            <SectionHeader
              badge="For providers"
              description="ProofArena helps providers win outcome challenges, submit execution plans, complete milestones, upload proof, and build a reputation that is backed by verified results."
              title="Build reputation from proof, not promises."
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
              <Button as="a" className="w-full sm:w-auto" href={ROUTES.REGISTER}>
                Become a Provider
                <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
              </Button>
              <Button as="a" className="w-full sm:w-auto" href={ROUTES.CHALLENGES} variant="secondary">
                Explore Challenges
              </Button>
            </div>
          </div>
        </MotionDiv>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-start">
          <div className="min-w-0">
            <div className="grid gap-5 md:grid-cols-2">
              <MotionDiv {...getMotionProps(reduceMotion, 0.08)}>
                <Card className="premium-motion-card h-full bg-white" padding="lg" variant="bordered">
                  <div className="flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#FAFAF9] text-[#78716C]">
                      <MinusCircle aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="text-xl font-black text-[#1C1917]">
                        Great providers often get buried.
                      </h3>
                      <BulletList items={providerProblems} />
                    </div>
                  </div>
                </Card>
              </MotionDiv>

              <MotionDiv {...getMotionProps(reduceMotion, 0.14)}>
                <Card
                  className="premium-motion-card h-full border-[#3F6212]/25 shadow-[0_24px_80px_rgba(63, 98, 18, 0.12)]"
                  padding="lg"
                  variant="elevated"
                >
                  <div className="flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#3F6212] text-white">
                      <ShieldCheck aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="text-xl font-black text-[#1C1917]">
                        ProofArena turns execution into reputation.
                      </h3>
                      <BulletList accent items={proofArenaApproach} />
                    </div>
                  </div>
                </Card>
              </MotionDiv>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {reputationCards.map((card, index) => (
                <ReputationCard
                  card={card}
                  index={index}
                  key={card.title}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
          </div>

          <MotionDiv {...getRevealMotionProps(reduceMotion, { delay: 0.2, variant: slideInRight })}>
            <ProviderPreviewPanel />
          </MotionDiv>
        </div>
      </Container>
    </section>
  );
}
