import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  ListChecks,
  ShieldCheck,
  Target,
  Workflow,
} from "lucide-react";
import { Button } from "../../components/Button.jsx";
import { Container } from "../../components/Container.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { getRevealMotionProps } from "../../utils/motion.js";
import { SectionHeader } from "./SectionHeader.jsx";

const MotionDiv = motion.div;

const workflowSteps = [
  {
    description:
      "Clients turn a business goal into a measurable challenge with targets, timeline, budget, and proof requirements.",
    example: "Generate 30 qualified seller leads in 30 days.",
    icon: Target,
    title: "Define the outcome",
  },
  {
    description:
      "Providers submit structured plans explaining how they will deliver the outcome, what milestones they will follow, and what proof they will provide.",
    example: "Outreach channels, CRM workflow, appointment criteria, reporting plan.",
    icon: ClipboardCheck,
    title: "Compare execution plans",
  },
  {
    description:
      "Progress is broken into clear checkpoints so clients can follow delivery without chasing updates across scattered tools.",
    example: "Lead list prepared, campaign launched, appointments confirmed.",
    icon: ListChecks,
    title: "Track milestones",
  },
  {
    description:
      "Results are reviewed through proof submissions before outcomes increase provider reputation and proof score.",
    example: "CRM records, appointment confirmations, analytics screenshots, delivery reports.",
    icon: ShieldCheck,
    title: "Verify proof",
  },
];

const previewRows = [
  {
    icon: Target,
    label: "Outcome defined",
  },
  {
    icon: ClipboardCheck,
    label: "12 execution plans submitted",
  },
  {
    icon: Workflow,
    label: "3 milestones active",
  },
  {
    icon: FileCheck2,
    label: "Proof review pending",
  },
];

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

function WorkflowStep({ index, isLast, step }) {
  const Icon = step.icon;

  return (
    <div className="relative flex gap-4 sm:gap-5">
      <div className="flex shrink-0 flex-col items-center">
        <span className="relative z-10 grid h-12 w-12 place-items-center rounded-2xl border border-[#3F6212]/20 bg-[#F7FEE7] text-sm font-black text-[#365314] shadow-[0_14px_38px_rgba(63, 98, 18, 0.12)]">
          {index + 1}
        </span>
        {!isLast ? (
          <span className="mt-3 h-full min-h-12 w-px bg-gradient-to-b from-[#65A30D] via-[#E7E5E4] to-[#E7E5E4]" />
        ) : null}
      </div>

      <Card
        className="premium-motion-card mb-4 flex-1 transition duration-300 hover:-translate-y-0.5 hover:border-[#65A30D] hover:shadow-[0_22px_64px_rgba(63, 98, 18, 0.12)]"
        padding="lg"
        variant="default"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#1C1917] text-white">
            <Icon aria-hidden="true" className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
              Step {index + 1}
            </p>
            <h3 className="mt-2 text-xl font-black text-[#1C1917]">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#57534E]">
              {step.description}
            </p>
            <div className="mt-5 rounded-2xl border border-[#E7E5E4] bg-[#FAFAF9] p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">
                Example
              </p>
              <p className="mt-2 text-sm font-bold leading-6 text-[#27272A]">
                {step.example}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function HowItWorksSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#FCFAFF_48%,#F7FEE7_100%)] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_14%_8%,rgba(63, 98, 18, 0.14),transparent_32%),radial-gradient(circle_at_92%_70%,rgba(101, 163, 13, 0.16),transparent_26%)]" />
      <Container className="relative z-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-start">
          <MotionDiv {...getMotionProps(reduceMotion, 0)}>
            <SectionHeader
              badge="How ProofArena works"
              description="ProofArena replaces unclear hiring with a structured workflow built around measurable goals, execution plans, milestone tracking, and verified proof."
              title="From business goal to verified outcome."
            />

            <Card className="premium-motion-card mt-8" padding="lg" variant="elevated">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-[#1C1917]">
                    Challenge workflow
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#78716C]">
                    A lightweight preview of structured delivery.
                  </p>
                </div>
                <Badge variant="primary">Structured delivery</Badge>
              </div>

              <div className="mt-6 grid gap-3">
                {previewRows.map((row) => {
                  const Icon = row.icon;

                  return (
                    <div
                      className="flex items-center gap-3 rounded-2xl border border-[#E7E5E4] bg-[#FAFAF9] p-4"
                      key={row.label}
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-[#365314]">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 text-sm font-black leading-6 text-[#27272A]">
                        {row.label}
                      </span>
                      <CheckCircle2
                        aria-hidden="true"
                        className="ml-auto h-5 w-5 shrink-0 text-[#3F6212]"
                      />
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button as="a" className="w-full sm:w-auto" href={ROUTES.REGISTER}>
                Create a Challenge
                <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
              </Button>
              <Button as="a" className="w-full sm:w-auto" href={ROUTES.PROOF_LEDGER} variant="secondary">
                View Proof Ledger
              </Button>
            </div>
          </MotionDiv>

          <div className="min-w-0">
            {workflowSteps.map((step, index) => (
              <MotionDiv
                key={step.title}
                {...getMotionProps(reduceMotion, 0.08 + index * 0.06)}
              >
                <WorkflowStep
                  index={index}
                  isLast={index === workflowSteps.length - 1}
                  step={step}
                />
              </MotionDiv>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
