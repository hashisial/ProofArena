import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  Layers3,
  ShieldCheck,
  Target,
  Timer,
  UsersRound,
} from "lucide-react";
import { Button } from "../../components/Button.jsx";
import { Container } from "../../components/Container.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { BackgroundVideo } from "../../components/ui/BackgroundVideo.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { getRevealMotionProps, scaleIn, slideInRight } from "../../utils/motion.js";

const MotionDiv = motion.div;

const designedFor = [
  "Real estate teams",
  "SaaS operators",
  "Crypto support teams",
  "Service providers",
];

const challengeDetails = [
  {
    icon: Timer,
    label: "Timeline",
    value: "30 days",
  },
  {
    icon: Target,
    label: "Budget",
    value: "Fixed outcome",
  },
  {
    icon: FileCheck2,
    label: "Proof required",
    value: "CRM sheet + appointment confirmations",
  },
];

const previewStats = [
  {
    label: "Milestones",
    value: "3/5 completed",
  },
  {
    label: "Provider plans",
    value: "12 submitted",
  },
  {
    label: "Proof score",
    value: "92",
  },
];

const workflowRows = [
  {
    icon: ClipboardCheck,
    label: "Execution Plan Submitted",
    text: "Provider strategy, channels, and proof checklist received.",
  },
  {
    icon: Layers3,
    label: "Milestone Tracking Active",
    text: "Work is moving through visible checkpoints.",
  },
  {
    icon: ShieldCheck,
    label: "Proof Review Pending",
    text: "Evidence will be checked before reputation updates.",
  },
];

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

function ChallengeDetail({ detail }) {
  const Icon = detail.icon;

  return (
    <div className="premium-motion-row rounded-2xl border border-[#E9E2F3] bg-white p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#F5F3FF] text-[#5B21B6]">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6F657C]">
            {detail.label}
          </p>
          <p className="mt-1 break-words text-sm font-black leading-6 text-[#07030D]">
            {detail.value}
          </p>
        </div>
      </div>
    </div>
  );
}

function WorkflowRow({ item }) {
  const Icon = item.icon;

  return (
    <div className="premium-motion-row group rounded-2xl border border-[#E9E2F3] bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#A78BFA] hover:shadow-[0_18px_42px_rgba(124, 58, 237, 0.12)]">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#F5F3FF] text-[#5B21B6] transition group-hover:bg-[#7C3AED] group-hover:text-white">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-black text-[#07030D]">{item.label}</p>
          <p className="mt-1 text-xs leading-5 text-[#6F657C]">{item.text}</p>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden border-b border-[#E9E2F3] bg-[#FBF9FF]">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#FFFFFF_0%,#F5F3FF_44%,#F5F3FF_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_18%_8%,rgba(124, 58, 237, 0.24),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(10,10,10,0.1),transparent_24%),radial-gradient(circle_at_65%_78%,rgba(167, 139, 250, 0.24),transparent_32%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.09] [background-image:linear-gradient(rgba(124, 58, 237, .24)_1px,transparent_1px),linear-gradient(90deg,rgba(124, 58, 237, .18)_1px,transparent_1px)] [background-size:72px_72px]" />

      <Container className="grid gap-10 py-14 sm:gap-12 sm:py-20 lg:min-h-[720px] lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:items-center lg:gap-14 lg:py-24 xl:gap-18">
        <div className="min-w-0">
          <MotionDiv {...getMotionProps(reduceMotion, 0)}>
            <Badge variant="primary">Outcome-based work platform</Badge>
          </MotionDiv>

          <MotionDiv {...getMotionProps(reduceMotion, 0.06)}>
            <h1 className="mt-6 max-w-4xl break-words text-[2.35rem] font-black leading-[1.03] text-[#07030D] [text-wrap:balance] min-[390px]:text-5xl sm:text-6xl lg:text-7xl">
              Launch measurable outcomes. Pay for verified execution.
            </h1>
          </MotionDiv>

          <MotionDiv {...getMotionProps(reduceMotion, 0.12)}>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#493C5E] sm:text-lg lg:text-xl">
              ProofArena helps businesses turn goals into outcome challenges,
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
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.PROOF_LEDGER} variant="secondary">
              Explore Proof Ledger
            </Button>
            <a
              className="inline-flex min-h-12 w-full max-w-full items-center justify-center rounded-full px-4 text-center text-sm font-black text-[#5B21B6] transition hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70 sm:w-auto sm:justify-start"
              href={ROUTES.REGISTER}
            >
              Become a Provider
            </a>
          </MotionDiv>

          <MotionDiv {...getMotionProps(reduceMotion, 0.24)}>
            <p className="mt-6 max-w-xl text-sm font-bold leading-7 text-[#6F657C]">
              Built for clients, providers, and teams who want proof before
              reputation.
            </p>

            <div className="mt-6 rounded-3xl border border-[#E9E2F3] bg-white/80 p-4 shadow-[0_18px_54px_rgba(31, 14, 54, 0.06)] backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 text-sm font-black text-[#07030D]">
                  <Gauge aria-hidden="true" className="h-5 w-5 text-[#7C3AED]" />
                  Designed for:
                </div>
                <div className="flex flex-wrap gap-2">
                  {designedFor.map((item) => (
                    <span className="rounded-full border border-[#E9E2F3] bg-[#FCFAFF] px-3 py-2 text-xs font-bold text-[#493C5E]" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>

        <MotionDiv
          className="min-w-0 pb-2 sm:pb-8"
          {...getRevealMotionProps(reduceMotion, { delay: 0.16, variant: slideInRight })}
        >
          <div className="relative mx-auto w-full max-w-2xl">
            <div
              aria-hidden="true"
              className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-[#7C3AED]/10 blur-2xl"
            />

            <Card className="premium-tilt premium-motion-card relative overflow-hidden rounded-[2rem] sm:overflow-visible" padding="none" variant="elevated">
              <BackgroundVideo
                className="rounded-[2rem]"
                fallbackClassName="bg-[radial-gradient(circle_at_20%_10%,rgba(124, 58, 237, 0.2),transparent_32%),radial-gradient(circle_at_92%_20%,rgba(167, 139, 250, 0.2),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(243,232,255,0.82))]"
                overlayClassName="bg-white/58"
              />
              <div className="relative z-10 rounded-[2rem] border border-white/70 bg-white/84 p-4 backdrop-blur-sm sm:p-5">
                <div className="rounded-[1.5rem] border border-[#EDE9FE] bg-[#F8F4FF] p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="primary">Verified proof workflow</Badge>
                        <Badge variant="green">In progress</Badge>
                      </div>
                      <p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-[#7C3AED]">
                        Outcome Challenge
                      </p>
                      <h2 className="mt-2 max-w-lg text-2xl font-black leading-tight text-[#07030D] sm:text-3xl">
                        Generate 30 qualified real estate seller leads
                      </h2>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 md:grid-cols-3">
                    {challengeDetails.map((detail) => (
                      <ChallengeDetail detail={detail} key={detail.label} />
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3 rounded-3xl border border-[#E9E2F3] bg-white p-4 sm:grid-cols-3">
                    {previewStats.map((stat) => (
                      <div className="min-w-0 rounded-2xl bg-[#FCFAFF] px-4 py-4" key={stat.label}>
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6F657C]">
                          {stat.label}
                        </p>
                        <p className="mt-2 break-words text-xl font-black text-[#07030D]">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3">
                    {workflowRows.map((item) => (
                      <WorkflowRow item={item} key={item.label} />
                    ))}
                  </div>
                </div>
              </div>

              <MotionDiv
                className="float-soft premium-motion-card mx-4 mb-4 rounded-2xl border border-[#7C3AED]/20 bg-white p-4 shadow-[0_24px_68px_rgba(124, 58, 237, 0.18)] sm:absolute sm:-bottom-5 sm:left-auto sm:right-8 sm:mx-0 sm:mb-0 sm:w-80"
                {...getRevealMotionProps(reduceMotion, { delay: 0.3, variant: scaleIn })}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#F5F3FF] text-[#5B21B6]">
                    <UsersRound aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-[#07030D]">12 provider plans submitted</p>
                    <p className="text-xs leading-5 text-[#6F657C]">
                      Compare execution before work begins.
                    </p>
                  </div>
                </div>
              </MotionDiv>

              <div className="absolute right-3 top-10 hidden rounded-2xl border border-[#E9E2F3] bg-white px-4 py-3 shadow-[0_18px_50px_rgba(31, 14, 54, 0.1)] lg:-right-3 lg:block xl:-right-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-[#7C3AED]" />
                  <span className="text-sm font-black text-[#07030D]">Proof score 92</span>
                </div>
              </div>
            </Card>
          </div>
        </MotionDiv>
      </Container>
    </section>
  );
}
