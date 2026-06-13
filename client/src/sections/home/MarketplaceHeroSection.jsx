import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  Layers3,
  ShieldCheck,
  Target,
  Timer,
} from "lucide-react";
import { Button } from "../../components/Button.jsx";
import { Container } from "../../components/Container.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { getRevealMotionProps, slideInRight } from "../../utils/motion.js";

const MotionDiv = motion.div;

const challengeDetails = [
  { label: "Timeline", value: "30 days", icon: Timer },
  { label: "Budget", value: "Fixed outcome", icon: Target },
  { label: "Proof", value: "CRM sheet + appointment confirmations", icon: FileCheck2 },
  { label: "Execution plans", value: "12 submitted", icon: ClipboardCheck },
  { label: "Milestones", value: "3/5 completed", icon: Layers3 },
  { label: "Proof score impact", value: "+8", icon: Gauge },
];

const statusRows = [
  { complete: true, label: "Outcome defined" },
  { complete: true, label: "Execution plans received" },
  { complete: true, label: "Milestones active" },
  { complete: false, label: "Proof review pending" },
];

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

function ProductPreview() {
  return (
    <Card
      className="premium-tilt premium-motion-card relative overflow-hidden rounded-[2rem] border-[#ECFCCB] shadow-[0_30px_90px_rgba(63, 98, 18, 0.16)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_100px_rgba(63, 98, 18, 0.2)]"
      padding="none"
      variant="elevated"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(63, 98, 18, 0.14),transparent_30%),linear-gradient(135deg,#FFFFFF_0%,#FEFCE8_52%,#F7FEE7_100%)]" />
      <div className="absolute inset-y-6 left-0 w-1 rounded-r-full bg-[#3F6212]" />
      <div className="relative z-10 p-4 sm:p-5">
        <div className="rounded-[1.5rem] border border-[#ECFCCB] bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">Verified proof workflow</Badge>
                <Badge variant="gray">Preview workflow</Badge>
              </div>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
                Outcome Challenge
              </p>
              <h2 className="mt-2 max-w-xl break-words text-2xl font-black leading-tight text-[#1C1917] sm:text-3xl">
                Generate 30 qualified real estate seller leads
              </h2>
            </div>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314]">
              <Target aria-hidden="true" className="h-6 w-6" />
            </span>
          </div>

          <div className="mt-6 rounded-3xl border border-[#ECFCCB] bg-[#FEFCE8] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
                  Challenge progress
                </p>
                <p className="mt-1 text-sm font-bold text-[#44403C]">Plan selected, milestones moving, proof pending.</p>
              </div>
              <Badge variant="green">3/5 completed</Badge>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#ECFCCB]">
              <div className="h-full w-[60%] rounded-full bg-[#3F6212]" />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {challengeDetails.map((metric) => {
              const Icon = metric.icon;

              return (
                <div
                  className="flex min-w-0 items-start gap-3 rounded-2xl border border-[#E7E5E4] bg-white p-4"
                  key={metric.label}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314]">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[#78716C]">
                      {metric.label}
                    </p>
                    <p className="mt-1 break-words text-lg font-black text-[#1C1917]">
                      {metric.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-3xl border border-[#ECFCCB] bg-[#FEFCE8] p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
              Status rows
            </p>
            <div className="mt-4 grid gap-3">
              {statusRows.map((item, index) => (
                <div className="flex items-center gap-3 rounded-2xl bg-white p-3" key={item.label}>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#F7FEE7] text-xs font-black text-[#365314]">
                    {index + 1}
                  </span>
                  <span className="min-w-0 text-sm font-black text-[#1C1917]">{item.label}</span>
                  {item.complete ? (
                    <CheckCircle2 aria-hidden="true" className="ml-auto h-4 w-4 shrink-0 text-[#65A30D]" />
                  ) : (
                    <BadgeCheck aria-hidden="true" className="ml-auto h-4 w-4 shrink-0 text-[#3F6212]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function MarketplaceHeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden border-b border-[#E7E5E4] bg-[#FEFCE8]">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#FFFFFF_0%,#FEFCE8_46%,#F7FEE7_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(circle_at_18%_12%,rgba(63, 98, 18, 0.18),transparent_34%),radial-gradient(circle_at_92%_24%,rgba(101, 163, 13, 0.18),transparent_28%)]" />
      <Container className="grid gap-10 py-14 sm:py-20 lg:min-h-[720px] lg:grid-cols-[minmax(0,0.98fr)_minmax(0,1.02fr)] lg:items-center lg:gap-14 lg:py-24">
        <div className="min-w-0">
          <MotionDiv {...getMotionProps(reduceMotion, 0)}>
            <Badge variant="primary">Outcome-based work platform</Badge>
          </MotionDiv>

          <MotionDiv {...getMotionProps(reduceMotion, 0.06)}>
            <h1 className="mt-6 max-w-5xl break-words text-[2.35rem] font-black leading-[1.03] text-[#1C1917] [text-wrap:balance] min-[390px]:text-5xl sm:text-6xl lg:text-7xl">
              Launch measurable outcomes. Pay for verified execution.
            </h1>
          </MotionDiv>

          <MotionDiv {...getMotionProps(reduceMotion, 0.12)}>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#44403C] sm:text-lg lg:text-xl">
              ProofArena helps clients create measurable outcome challenges,
              compare execution plans, track milestones, and verify proof before
              reputation is earned.
            </p>
          </MotionDiv>

          <MotionDiv
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            {...getMotionProps(reduceMotion, 0.18)}
          >
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.REGISTER}>
              Create a Challenge
              <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
            </Button>
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.REGISTER} variant="secondary">
              Become a Provider
            </Button>
            <a
              className="inline-flex min-h-12 w-full max-w-full items-center justify-center rounded-full px-4 text-center text-sm font-black text-[#365314] transition hover:bg-white/80 hover:text-[#3F6212] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70 sm:w-auto"
              href={ROUTES.PROOF_LEDGER}
            >
              See how proof works
            </a>
          </MotionDiv>

          <MotionDiv {...getMotionProps(reduceMotion, 0.24)}>
            <div className="mt-7 flex max-w-2xl items-start gap-3 rounded-3xl border border-[#E7E5E4] bg-white/82 p-4 shadow-[0_18px_54px_rgba(28, 25, 23, 0.06)] backdrop-blur">
              <ShieldCheck aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#3F6212]" />
              <p className="text-sm font-bold leading-7 text-[#57534E]">
                No empty claims. No proposal noise. Outcomes verified through proof.
              </p>
            </div>
          </MotionDiv>
        </div>

        <MotionDiv
          className="min-w-0"
          {...getRevealMotionProps(reduceMotion, { delay: 0.16, variant: slideInRight })}
        >
          <ProductPreview />
        </MotionDiv>
      </Container>
    </section>
  );
}
