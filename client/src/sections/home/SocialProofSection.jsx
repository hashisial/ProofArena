import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  Eye,
  FileCheck2,
  ListChecks,
  ShieldCheck,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { Button } from "../../components/Button.jsx";
import { Container } from "../../components/Container.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { getRevealMotionProps } from "../../utils/motion.js";
import { SectionHeader } from "./SectionHeader.jsx";

const MotionDiv = motion.div;

const trustMetrics = [
  {
    description: "Define, plan, track, and verify every challenge.",
    icon: ListChecks,
    label: "Outcome workflow",
    value: "4-step",
  },
  {
    description: "Provider credibility grows from approved evidence.",
    icon: BadgeCheck,
    label: "Reputation model",
    value: "Proof-first",
  },
  {
    description: "Built for businesses, operators, teams, and service providers.",
    icon: UsersRound,
    label: "Client + provider system",
    value: "Multi-role",
  },
  {
    description: "Designed for growth, support, SaaS, real estate, operations, and automation.",
    icon: BarChart3,
    label: "Use case coverage",
    value: "Industry-ready",
  },
];

const trustPillars = [
  {
    description:
      "Every challenge begins with measurable goals, timeline, budget, and proof requirements.",
    icon: Target,
    title: "Structured before work starts",
  },
  {
    description:
      "Milestones make progress easier to follow without chasing updates across scattered tools.",
    icon: Eye,
    title: "Visible while work happens",
  },
  {
    description:
      "Proof submissions are reviewed before they impact provider credibility.",
    icon: ShieldCheck,
    title: "Verified before reputation grows",
  },
];

const trustStatements = [
  "Claims are not enough.",
  "Progress should be visible.",
  "Proof should be reviewable.",
  "Reputation should be earned.",
];

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

function MetricCard({ index, metric, reduceMotion }) {
  const Icon = metric.icon;

  return (
    <MotionDiv {...getMotionProps(reduceMotion, index * 0.05)}>
      <Card
        className="premium-motion-card group h-full transition duration-300 hover:-translate-y-1 hover:border-[#A78BFA] hover:shadow-[0_24px_76px_rgba(124, 58, 237, 0.14)]"
        padding="lg"
        variant="default"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F5F3FF] text-[#5B21B6] transition duration-300 group-hover:bg-[#7C3AED] group-hover:text-white">
            <Icon aria-hidden="true" className="h-6 w-6" />
          </span>
          <Badge variant="gray">Foundation</Badge>
        </div>
        <p className="mt-6 break-words text-3xl font-black leading-tight text-[#07030D]">
          {metric.value}
        </p>
        <p className="mt-2 text-base font-black text-[#07030D]">
          {metric.label}
        </p>
        <p className="mt-3 text-sm leading-7 text-[#6F657C]">
          {metric.description}
        </p>
      </Card>
    </MotionDiv>
  );
}

function TrustPillarCard({ index, pillar, reduceMotion }) {
  const Icon = pillar.icon;

  return (
    <MotionDiv {...getMotionProps(reduceMotion, 0.12 + index * 0.05)}>
      <Card className="premium-motion-card h-full" padding="lg" variant="bordered">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F5F3FF] text-[#5B21B6]">
            <Icon aria-hidden="true" className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h3 className="text-xl font-black leading-tight text-[#07030D]">
              {pillar.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#6F657C]">
              {pillar.description}
            </p>
          </div>
        </div>
      </Card>
    </MotionDiv>
  );
}

export function SocialProofSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F4FF_46%,#F5F3FF_100%)] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_82%_12%,rgba(124, 58, 237, 0.14),transparent_34%),radial-gradient(circle_at_10%_76%,rgba(167, 139, 250, 0.12),transparent_28%)]" />
      <Container className="relative z-10">
        <MotionDiv {...getMotionProps(reduceMotion, 0)}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end">
            <SectionHeader
              badge="Built for trust"
              description="ProofArena is designed to replace vague claims with structured outcomes, milestone visibility, proof review, and evidence-backed reputation."
              title="Credibility should come from proof, not noise."
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
              <Button as="a" className="w-full sm:w-auto" href={ROUTES.PROOF_LEDGER}>
                Explore Proof Ledger
                <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
              </Button>
              <Button as="a" className="w-full sm:w-auto" href={ROUTES.REGISTER} variant="secondary">
                Start Your First Outcome
              </Button>
            </div>
          </div>
        </MotionDiv>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {trustMetrics.map((metric, index) => (
            <MetricCard
              index={index}
              key={metric.label}
              metric={metric}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {trustPillars.map((pillar, index) => (
            <TrustPillarCard
              index={index}
              key={pillar.title}
              pillar={pillar}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        <MotionDiv
          className="premium-motion-card mt-12 rounded-[2rem] border border-[#E9E2F3] bg-white p-6 shadow-[0_24px_80px_rgba(31, 14, 54, 0.08)] sm:p-8 lg:p-10"
          {...getMotionProps(reduceMotion, 0.18)}
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
            <div>
              <Badge variant="primary">Proof-based trust model</Badge>
              <h3 className="mt-4 text-3xl font-black leading-tight text-[#07030D]">
                What ProofArena believes
              </h3>
              <p className="mt-4 text-base leading-8 text-[#6F657C]">
                A professional work platform should make outcomes measurable,
                progress visible, and trust evidence-based.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {trustStatements.map((statement) => (
                <div
                  className="flex items-start gap-3 rounded-2xl border border-[#E9E2F3] bg-[#FCFAFF] p-4"
                  key={statement}
                >
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#7C3AED]" />
                  <p className="text-sm font-black leading-6 text-[#27272A]">
                    {statement}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-3xl border border-[#EDE9FE] bg-[#F8F4FF] p-5">
            <FileCheck2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#7C3AED]" />
            <p className="text-sm font-semibold leading-7 text-[#6F657C]">
              This section uses foundation metrics and trust principles only.
              External customer proof assets and usage numbers should be added
              only when they are real and verifiable.
            </p>
          </div>
        </MotionDiv>

        <MotionDiv
          className="mt-8 flex items-center gap-3 text-sm font-bold text-[#6F657C]"
          {...getMotionProps(reduceMotion, 0.22)}
        >
          <TrendingUp aria-hidden="true" className="h-5 w-5 shrink-0 text-[#7C3AED]" />
          Built for measurable outcomes, milestone visibility, and evidence-backed reputation.
        </MotionDiv>
      </Container>
    </section>
  );
}
