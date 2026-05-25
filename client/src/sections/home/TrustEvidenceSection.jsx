import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Award,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  ListChecks,
  ShieldAlert,
  ShieldCheck,
  Target,
  TrendingUp,
  UploadCloud,
} from "lucide-react";
import { Button } from "../../components/Button.jsx";
import { Container } from "../../components/Container.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { getRevealMotionProps } from "../../utils/motion.js";

const MotionDiv = motion.div;
const MotionArticle = motion.article;
const MotionLi = motion.li;

const trustPillars = [
  {
    badge: "Challenge",
    description:
      "Clients define the result, success criteria, timeline, and proof requirements before work starts.",
    evidence: "Outcome first, scope second.",
    icon: Target,
    title: "Outcome challenges",
  },
  {
    badge: "Plan",
    description:
      "Providers explain approach, milestones, proof, risks, and timeline before clients choose.",
    evidence: "Plans replace generic proposals.",
    icon: ClipboardCheck,
    title: "Structured execution plans",
  },
  {
    badge: "Workflow",
    description:
      "Work progress is visible before final delivery, so clients do not approve blind.",
    evidence: "Outcome -> plan -> milestone -> proof.",
    icon: ListChecks,
    title: "Milestone tracking",
  },
  {
    badge: "Evidence",
    description:
      "Providers submit evidence tied to milestones before outcomes are accepted.",
    evidence: "Proof type, milestone, status, and score impact.",
    icon: ShieldCheck,
    title: "Verified proof",
  },
  {
    badge: "Reputation",
    description:
      "Reputation grows from approved outcomes, delivery reliability, and proof-backed records.",
    evidence: "Proof score replaces profile noise.",
    icon: TrendingUp,
    title: "Proof score",
  },
  {
    badge: "Safety",
    description:
      "Public data, verification, reports, and admin review support safer participation.",
    evidence: "Visibility is controlled by trust rules.",
    icon: ShieldAlert,
    title: "Privacy and moderation",
  },
];

const trustLoopSteps = [
  { icon: Target, label: "Define outcome" },
  { icon: ClipboardCheck, label: "Submit execution plan" },
  { icon: CalendarCheck, label: "Complete milestones" },
  { icon: UploadCloud, label: "Upload proof" },
  { icon: ShieldAlert, label: "Review evidence" },
  { icon: Award, label: "Earn reputation" },
];

const foundationMetrics = [
  {
    label: "Reputation model",
    value: "Proof-first",
  },
  {
    label: "Delivery workflow",
    value: "Milestone-based",
  },
  {
    label: "Public profile controls",
    value: "Privacy-aware",
  },
  {
    label: "Challenge structure",
    value: "Outcome-focused",
  },
];

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

function TrustPillarCard({ index, pillar, reduceMotion }) {
  const Icon = pillar.icon;

  return (
    <MotionArticle
      {...getMotionProps(reduceMotion, 0.12 + index * 0.05)}
      className="min-w-0"
    >
      <Card
        as="article"
        className="premium-motion-card group h-full rounded-[1.7rem] transition duration-300 hover:-translate-y-1 hover:border-[#65A30D] hover:shadow-[0_24px_76px_rgba(63,98,18,0.14)]"
        padding="lg"
        variant="default"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314] transition group-hover:bg-[#3F6212] group-hover:text-white">
            <Icon aria-hidden="true" className="h-6 w-6" />
          </span>
          <Badge variant="gray">{pillar.badge}</Badge>
        </div>

        <h3 className="mt-6 break-words text-xl font-black leading-tight text-[#1C1917]">
          {pillar.title}
        </h3>
        <p className="mt-3 text-sm font-semibold leading-7 text-[#57534E]">
          {pillar.description}
        </p>

        <div className="mt-5 rounded-2xl border border-[#A16207]/20 bg-[#FEF3C7] p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#A16207]">
            Evidence point
          </p>
          <p className="mt-2 text-sm font-black leading-6 text-[#1C1917]">
            {pillar.evidence}
          </p>
        </div>
      </Card>
    </MotionArticle>
  );
}

function TrustLoopPanel({ reduceMotion }) {
  return (
    <MotionDiv {...getMotionProps(reduceMotion, 0.08)}>
      <Card
        className="premium-motion-card rounded-[2rem] border-[#ECFCCB] bg-white shadow-[0_24px_80px_rgba(63,98,18,0.1)]"
        padding="lg"
        variant="elevated"
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-center">
          <div className="min-w-0">
            <Badge variant="secondary">Trust workflow preview</Badge>
            <h3 className="mt-4 text-2xl font-black leading-tight text-[#1C1917] sm:text-3xl">
              ProofArena trust loop
            </h3>
            <p className="mt-4 text-sm font-semibold leading-7 text-[#57534E]">
              The platform is structured so credibility comes from a repeatable
              path: define outcomes, show work, review evidence, and earn
              reputation only after proof is accepted.
            </p>
          </div>

          <ol className="grid gap-3 lg:grid-cols-6">
            {trustLoopSteps.map((step, index) => {
              const Icon = step.icon;
              const isReviewStep = step.label === "Review evidence";

              return (
                <MotionLi
                  {...getMotionProps(reduceMotion, 0.14 + index * 0.04)}
                  className="relative min-w-0"
                  key={step.label}
                >
                  <div className="premium-motion-row flex min-w-0 items-start gap-3 rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4 lg:block lg:text-center">
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl lg:mx-auto ${
                        isReviewStep
                          ? "bg-[#FEF3C7] text-[#A16207]"
                          : "bg-[#F7FEE7] text-[#365314]"
                      }`}
                    >
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 lg:mt-3">
                      <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#78716C]">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-1 break-words text-sm font-black leading-6 text-[#1C1917]">
                        {step.label}
                      </p>
                    </div>
                  </div>
                </MotionLi>
              );
            })}
          </ol>
        </div>
      </Card>
    </MotionDiv>
  );
}

function MetricCard({ index, metric, reduceMotion }) {
  return (
    <MotionDiv {...getMotionProps(reduceMotion, 0.18 + index * 0.04)}>
      <Card
        className="premium-motion-card h-full rounded-[1.5rem] transition duration-300 hover:-translate-y-1 hover:border-[#65A30D] hover:shadow-[0_18px_54px_rgba(63,98,18,0.12)]"
        padding="md"
        variant="default"
      >
        <p className="break-words text-2xl font-black leading-tight text-[#3F6212]">
          {metric.value}
        </p>
        <p className="mt-2 text-sm font-black uppercase tracking-[0.12em] text-[#78716C]">
          {metric.label}
        </p>
      </Card>
    </MotionDiv>
  );
}

export function TrustEvidenceSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFBEB_0%,#FEFCE8_48%,#FFFFFF_100%)] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_14%_18%,rgba(63,98,18,0.12),transparent_32%),radial-gradient(circle_at_86%_44%,rgba(161,98,7,0.09),transparent_28%)]" />
      <Container className="relative z-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <MotionDiv {...getMotionProps(reduceMotion, 0)}>
            <Badge variant="primary">Trust evidence</Badge>
            <h2 className="mt-4 max-w-4xl break-words text-3xl font-black leading-tight text-[#1C1917] [text-wrap:balance] sm:text-4xl lg:text-5xl">
              Trust built from evidence.
            </h2>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-[#57534E] sm:text-lg">
              ProofArena trust is built from outcome challenges, structured
              execution plans, milestone tracking, verified proof, proof score,
              privacy controls, and moderation foundations.
            </p>
            <div className="mt-6 flex items-start gap-3 rounded-3xl border border-[#E7E5E4] bg-white p-5 shadow-[0_16px_50px_rgba(28,25,23,0.04)]">
              <CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#3F6212]" />
              <p className="text-sm font-semibold leading-7 text-[#57534E]">
                No fake testimonials. No empty claims. ProofArena credibility is
                built around outcomes, proof, and controlled public visibility.
              </p>
            </div>
          </MotionDiv>

          <MotionDiv
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end"
            {...getMotionProps(reduceMotion, 0.08)}
          >
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.PROOF_LEDGER}>
              Explore Proof Ledger
              <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
            </Button>
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.PROVIDERS} variant="secondary">
              View Providers
            </Button>
          </MotionDiv>
        </div>

        <div className="mt-12">
          <TrustLoopPanel reduceMotion={reduceMotion} />
        </div>

        <MotionDiv
          className="mt-10 flex flex-wrap items-center gap-3"
          {...getMotionProps(reduceMotion, 0.1)}
        >
          <Badge variant="secondary">Platform trust model</Badge>
          <p className="text-sm font-semibold leading-6 text-[#78716C]">
            Trust comes from evidence, structure, and reviewed proof.
          </p>
        </MotionDiv>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {foundationMetrics.map((metric, index) => (
            <MetricCard
              index={index}
              key={metric.label}
              metric={metric}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
          className="mt-8 grid gap-4 rounded-3xl border border-[#E7E5E4] bg-[#FFFBEB] p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start"
          {...getMotionProps(reduceMotion, 0.34)}
        >
          <Eye aria-hidden="true" className="h-6 w-6 shrink-0 text-[#3F6212]" />
          <p className="text-sm font-semibold leading-7 text-[#57534E]">
            This section uses platform design principles only. Usage numbers,
            customer logos, revenue metrics, and testimonials should be added
            only when they are real, current, and verifiable.
          </p>
        </MotionDiv>
      </Container>
    </section>
  );
}
