import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ShieldCheck,
  Target,
  UserCheck,
  Users,
  Workflow,
} from "lucide-react";
import { Button } from "../../components/Button.jsx";
import { Container } from "../../components/Container.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { BackgroundVideo } from "../../components/ui/BackgroundVideo.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { getRevealMotionProps, scaleIn } from "../../utils/motion.js";
import { SectionHeader } from "./SectionHeader.jsx";

const MotionDiv = motion.div;

const modelCards = [
  {
    badge: "Launch outcomes",
    cta: "Start as Client",
    description:
      "Create measurable challenges with clear goals, milestones, and proof requirements.",
    href: ROUTES.REGISTER,
    icon: Target,
    includes: [
      "Outcome challenge creation",
      "Execution plan comparison",
      "Milestone tracking",
      "Proof review workflow",
    ],
    title: "Clients",
  },
  {
    badge: "Prove execution",
    cta: "Join as Provider",
    description:
      "Compete with execution plans, deliver milestones, upload proof, and build proof-based reputation.",
    href: ROUTES.REGISTER,
    icon: BadgeCheck,
    includes: [
      "Provider profile",
      "Challenge applications",
      "Proof submissions",
      "Proof score foundation",
    ],
    title: "Providers",
  },
  {
    badge: "Managed delivery",
    cta: "Contact ScaleOps",
    description:
      "Use ProofArena as a structured workspace for business outcomes, delivery tracking, and verified results.",
    href: ROUTES.CONTACT,
    icon: Users,
    includes: [
      "Team workflows",
      "Admin oversight",
      "Outcome dashboards",
      "Trust & safety controls",
    ],
    title: "Teams",
  },
];

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

function ModelCard({ card, index, reduceMotion }) {
  const Icon = card.icon;

  return (
    <MotionDiv {...getMotionProps(reduceMotion, index * 0.06)}>
      <Card
        className="premium-motion-card group flex h-full flex-col transition duration-300 hover:-translate-y-1 hover:border-[#A78BFA] hover:shadow-[0_24px_76px_rgba(124, 58, 237, 0.14)]"
        padding="lg"
        variant={index === 1 ? "elevated" : "default"}
      >
        <div className="flex items-start justify-between gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F5F3FF] text-[#5B21B6] transition duration-300 group-hover:bg-[#7C3AED] group-hover:text-white">
            <Icon aria-hidden="true" className="h-6 w-6" />
          </span>
          <Badge variant={index === 1 ? "primary" : "gray"}>{card.badge}</Badge>
        </div>

        <h3 className="mt-6 text-2xl font-black text-[#07030D]">{card.title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#6F657C]">{card.description}</p>

        <div className="mt-6 rounded-2xl border border-[#E9E2F3] bg-[#FCFAFF] p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">
            Includes
          </p>
          <ul className="mt-3 grid gap-2">
            {card.includes.map((item) => (
              <li className="flex items-start gap-2 text-sm font-semibold leading-6 text-[#493C5E]" key={item}>
                <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#7C3AED]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-6">
          <Button as="a" className="w-full" href={card.href} variant={index === 1 ? "primary" : "secondary"}>
            {card.cta}
          </Button>
        </div>
      </Card>
    </MotionDiv>
  );
}

export function FinalCTASection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FBF9FF_0%,#F5F3FF_52%,#FFFFFF_100%)] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_50%_0%,rgba(124, 58, 237, 0.18),transparent_36%),radial-gradient(circle_at_90%_80%,rgba(10,10,10,0.06),transparent_30%)]" />
      <Container className="relative z-10">
        <MotionDiv {...getMotionProps(reduceMotion, 0)}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end">
            <SectionHeader
              badge="Start with ProofArena"
              description="Create measurable challenges, compare execution plans, track milestones, and verify proof before reputation is earned."
              title="Stop hiring promises. Start verifying outcomes."
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
              <Button as="a" className="w-full sm:w-auto" href={ROUTES.REGISTER}>
                Create a Challenge
                <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
              </Button>
              <Button as="a" className="w-full sm:w-auto" href={ROUTES.REGISTER} variant="secondary">
                Become a Provider
              </Button>
              <a
                className="inline-flex min-h-12 w-full max-w-full items-center justify-center rounded-full px-4 text-center text-sm font-black text-[#5B21B6] transition hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70 sm:w-auto"
                href={ROUTES.PROOF_LEDGER}
              >
                Explore Proof Ledger
              </a>
            </div>
          </div>
        </MotionDiv>

        <MotionDiv
          className="premium-motion-card mt-10 rounded-3xl border border-[#EDE9FE] bg-[#F8F4FF] p-5 sm:p-6"
          {...getMotionProps(reduceMotion, 0.08)}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F5F3FF] text-[#5B21B6]">
              <Workflow aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="text-base font-black text-[#07030D]">
                Built for flexible outcome-based work
              </p>
              <p className="mt-2 text-sm leading-7 text-[#6F657C]">
                Pricing will be structured around platform access, outcome
                challenge workflows, and provider delivery tools. Final paid
                plans can be activated once payments and billing are connected.
              </p>
            </div>
          </div>
        </MotionDiv>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {modelCards.map((card, index) => (
            <ModelCard
              card={card}
              index={index}
              key={card.title}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        <MotionDiv
          className="premium-tilt premium-motion-card relative mt-12 overflow-hidden rounded-[2rem] border border-[#C4B5FD]/70 bg-[#5B21B6] p-6 text-white shadow-[0_34px_100px_rgba(124, 58, 237, 0.34)] sm:p-8 lg:p-12"
          {...getRevealMotionProps(reduceMotion, { delay: 0.18, variant: scaleIn })}
        >
          <BackgroundVideo
            className="rounded-[2rem]"
            fallbackClassName="bg-[radial-gradient(circle_at_18%_4%,rgba(255,255,255,0.34),transparent_28%),radial-gradient(circle_at_86%_72%,rgba(167, 139, 250, 0.46),transparent_30%),linear-gradient(135deg,#7C3AED_0%,#5B21B6_46%,#12091F_100%)]"
            overlayClassName="bg-[#12091F]/8"
          />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-[#A78BFA]">
                  <ShieldCheck aria-hidden="true" className="h-5 w-5" />
                </span>
                <p className="text-sm font-black uppercase text-[#A78BFA]">
                  ProofArena by ScaleOps
                </p>
              </div>
              <h2 className="mt-5 break-words text-3xl font-black leading-tight [text-wrap:balance] sm:text-5xl">
                Ready to build trust from verified execution?
              </h2>
              <p className="mt-5 text-base leading-8 text-white/72 sm:text-lg">
                Whether you need results or want to prove your work, ProofArena
                gives you a structured path from goal to proof.
              </p>
              <p className="mt-5 text-sm font-bold leading-7 text-white/62">
                No profile noise. No empty claims. Just measurable outcomes and
                proof-backed reputation.
              </p>
            </div>

            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-col">
              <Button as="a" className="w-full bg-white text-[#07030D] sm:w-auto lg:w-full" href={ROUTES.REGISTER} variant="secondary">
                Create a Challenge
                <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
              </Button>
              <Button as="a" className="w-full sm:w-auto lg:w-full" href={ROUTES.REGISTER}>
                Become a Provider
              </Button>
              <Button
                as="a"
                className="w-full border-white/20 bg-white/10 text-white hover:bg-white hover:text-[#07030D] sm:w-auto lg:w-full"
                href={ROUTES.CONTACT}
                variant="outline"
              >
                Contact ScaleOps
              </Button>
            </div>
          </div>
        </MotionDiv>

        <MotionDiv
          className="mt-8 flex items-start gap-3 rounded-3xl border border-[#E9E2F3] bg-[#FCFAFF] p-5"
          {...getMotionProps(reduceMotion, 0.22)}
        >
          <UserCheck aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#7C3AED]" />
          <p className="text-sm font-semibold leading-7 text-[#6F657C]">
            Payments and billing modules will be added in a later stage. This
            preview explains the product model without presenting live paid
            plans.
          </p>
        </MotionDiv>
      </Container>
    </section>
  );
}
