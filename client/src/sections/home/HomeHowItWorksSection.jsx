import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  Layers3,
  ListChecks,
  ShieldCheck,
  Target,
  UsersRound,
  Workflow,
} from "lucide-react";
import { Button } from "../../components/Button.jsx";
import { Container } from "../../components/Container.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { getRevealMotionProps } from "../../utils/motion.js";

const MotionDiv = motion.div;
const MotionLi = motion.li;

const workflowSteps = [
  {
    description: "Clients turn goals into measurable challenges.",
    details: ["Target metric", "Timeline", "Proof requirements"],
    example: "30 qualified seller leads in 30 days",
    icon: Target,
    label: "Step 01",
    title: "Define the outcome",
  },
  {
    description: "Providers compete with clear plans, not generic proposals.",
    details: ["Execution strategy", "Milestone plan", "Provider profile"],
    example: "12 execution plans submitted",
    icon: ClipboardList,
    label: "Step 02",
    title: "Compare execution plans",
  },
  {
    description: "Progress is visible through checkpoints.",
    details: ["Active milestone", "Delivery progress", "Timeline visibility"],
    example: "3 of 5 milestones completed",
    icon: ListChecks,
    label: "Step 03",
    title: "Track milestones",
  },
  {
    description: "Approved proof builds provider reputation.",
    details: ["Proof submitted", "Review status", "Proof score impact"],
    example: "+8 proof score impact",
    icon: ShieldCheck,
    label: "Step 04",
    title: "Verify proof",
  },
];

const previewRows = [
  {
    icon: Target,
    label: "Challenge created",
    status: "Complete",
    tone: "complete",
  },
  {
    icon: UsersRound,
    label: "Plans submitted",
    status: "Complete",
    tone: "complete",
  },
  {
    icon: Workflow,
    label: "Milestones active",
    status: "Active",
    tone: "active",
  },
  {
    icon: FileCheck2,
    label: "Proof reviewed",
    status: "Pending",
    tone: "pending",
  },
  {
    icon: BadgeCheck,
    label: "Reputation updated",
    status: "Verified",
    tone: "verified",
  },
];

const statusToneClasses = {
  active: "border-[#65A30D]/25 bg-[#F7FEE7] text-[#3F6212]",
  complete: "border-[#3F6212]/20 bg-[#ECFCCB] text-[#3F6212]",
  pending: "border-[#A16207]/25 bg-[#FEF3C7] text-[#A16207]",
  verified: "border-[#65A30D]/25 bg-[#F7FEE7] text-[#3F6212]",
};

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

function WorkflowPreview() {
  return (
    <Card
      className="premium-motion-card relative overflow-hidden rounded-[2rem] border-[#ECFCCB] bg-white shadow-[0_24px_80px_rgba(63,98,18,0.12)]"
      padding="lg"
      variant="elevated"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#3F6212,#65A30D,#A16207)]" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <Badge variant="primary">Preview workflow</Badge>
          <h3 className="mt-4 text-2xl font-black leading-tight text-[#1C1917]">
            Outcome workflow preview
          </h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#78716C]">
            CRM automation challenge
          </p>
        </div>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314]">
          <Layers3 aria-hidden="true" className="h-6 w-6" />
        </span>
      </div>

      <div className="mt-6 rounded-3xl border border-[#E7E5E4] bg-[#FFFBEB] p-4">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">
          Proof requirement
        </p>
        <p className="mt-2 text-sm font-black leading-6 text-[#1C1917]">
          Dashboard link + workflow logs
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        {previewRows.map((row) => {
          const Icon = row.icon;

          return (
            <div
              className="premium-motion-row flex items-center gap-3 rounded-2xl border border-[#E7E5E4] bg-white p-3"
              key={row.label}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314]">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1 text-sm font-black leading-6 text-[#1C1917]">
                {row.label}
              </span>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.1em] ${
                  statusToneClasses[row.tone]
                }`}
              >
                {row.status}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function WorkflowStepCard({ index, isLast, reduceMotion, step }) {
  const Icon = step.icon;

  return (
    <MotionLi
      className="relative min-w-0"
      {...getMotionProps(reduceMotion, 0.1 + index * 0.06)}
    >
      <div
        aria-hidden="true"
        className="absolute left-6 top-12 h-[calc(100%+1.25rem)] w-px bg-[#ECFCCB] md:hidden"
        hidden={isLast}
      />
      <div className="grid min-w-0 grid-cols-[3rem_minmax(0,1fr)] gap-4 md:block">
        <div className="relative z-10 grid h-12 w-12 place-items-center rounded-2xl border border-[#3F6212]/20 bg-[#ECFCCB] text-sm font-black text-[#3F6212] shadow-[0_14px_38px_rgba(63,98,18,0.12)] md:mx-auto md:mb-4">
          {index + 1}
        </div>

        <Card
          className="premium-motion-card h-full rounded-[1.6rem] transition duration-300 hover:-translate-y-1 hover:border-[#65A30D] hover:shadow-[0_24px_76px_rgba(63,98,18,0.14)]"
          padding="lg"
          variant="default"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314] transition group-hover:bg-[#3F6212] group-hover:text-white">
              <Icon aria-hidden="true" className="h-6 w-6" />
            </span>
            <Badge variant={index === 3 ? "green" : "primary"}>{step.label}</Badge>
          </div>

          <h3 className="mt-6 text-2xl font-black leading-tight text-[#1C1917]">
            {step.title}
          </h3>
          <p className="mt-4 text-sm font-semibold leading-7 text-[#57534E]">
            {step.description}
          </p>

          <div className="mt-6 grid gap-2">
            {step.details.map((detail) => (
              <div
                className="flex items-center gap-2 rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] px-3 py-2"
                key={detail}
              >
                <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0 text-[#3F6212]" />
                <span className="min-w-0 text-sm font-bold text-[#44403C]">{detail}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-[#ECFCCB] bg-[#FFFBEB] p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#A16207]">
              Example
            </p>
            <p className="mt-2 text-sm font-black leading-6 text-[#1C1917]">
              {step.example}
            </p>
          </div>
        </Card>
      </div>
    </MotionLi>
  );
}

export function HomeHowItWorksSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FEFCE8_0%,#FFFFFF_46%,#FFFBEB_100%)] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_14%_10%,rgba(63,98,18,0.14),transparent_32%),radial-gradient(circle_at_88%_58%,rgba(161,98,7,0.1),transparent_26%)]" />
      <Container className="relative z-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)] lg:items-end">
          <MotionDiv {...getMotionProps(reduceMotion, 0)}>
            <Badge variant="primary">How ProofArena works</Badge>
            <h2 className="mt-4 max-w-4xl break-words text-3xl font-black leading-tight text-[#1C1917] [text-wrap:balance] sm:text-4xl lg:text-5xl">
              From business goal to verified outcome.
            </h2>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-[#57534E] sm:text-lg">
              Every challenge moves through a structured workflow: define the outcome,
              compare execution plans, track milestones, and verify proof before
              reputation is earned.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button as="a" className="w-full sm:w-auto" href={ROUTES.REGISTER}>
                Create a Challenge
                <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
              </Button>
              <Button as="a" className="w-full sm:w-auto" href={ROUTES.PROVIDERS} variant="secondary">
                Explore Providers
              </Button>
              <a
                className="inline-flex min-h-12 w-full max-w-full items-center justify-center rounded-full px-4 text-center text-sm font-black text-[#365314] transition hover:bg-white/80 hover:text-[#3F6212] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70 sm:w-auto"
                href={ROUTES.PROOF_LEDGER}
              >
                View Proof Ledger
              </a>
            </div>
          </MotionDiv>

          <MotionDiv {...getMotionProps(reduceMotion, 0.08)}>
            <WorkflowPreview />
          </MotionDiv>
        </div>

        <div className="relative mt-12">
          <div
            aria-hidden="true"
            className="absolute left-[12.5%] right-[12.5%] top-6 hidden h-px bg-[linear-gradient(90deg,#3F6212,#65A30D,#A16207)] xl:block"
          />
          <ol className="relative grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <WorkflowStepCard
                index={index}
                isLast={index === workflowSteps.length - 1}
                key={step.title}
                reduceMotion={reduceMotion}
                step={step}
              />
            ))}
          </ol>
        </div>

        <MotionDiv
          className="mt-8 flex items-start gap-3 rounded-3xl border border-[#E7E5E4] bg-white p-5 shadow-[0_16px_50px_rgba(28,25,23,0.04)]"
          {...getMotionProps(reduceMotion, 0.28)}
        >
          <CalendarCheck aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#3F6212]" />
          <p className="text-sm font-semibold leading-7 text-[#57534E]">
            This is preview workflow content for the homepage foundation. Live challenge,
            milestone, and proof review data will connect through later ProofArena modules.
          </p>
        </MotionDiv>
      </Container>
    </section>
  );
}
