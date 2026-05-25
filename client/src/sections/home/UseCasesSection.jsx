import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Code2,
  Globe2,
  Headphones,
  ShieldCheck,
  UserCheck,
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

const categoryPills = ["Growth", "Support", "Development", "Operations", "Automation"];

const useCases = [
  {
    badge: "Growth",
    cta: "Launch real estate outcome",
    description:
      "Launch challenges for qualified seller leads, buyer leads, appointment setting, and CRM-ready pipelines.",
    exampleOutcome: "30 qualified seller leads in 30 days",
    icon: Building2,
    proofExamples: ["Lead sheet", "CRM screenshots", "Appointment confirmations"],
    title: "Real Estate Lead Generation",
  },
  {
    badge: "Support",
    cta: "Launch support outcome",
    description:
      "Build support workflows for exchanges, wallets, communities, crypto cards, and Web3 products.",
    exampleOutcome: "Reduce support response time under 2 minutes",
    icon: Headphones,
    proofExamples: ["Ticket reports", "Moderation logs", "Response-time dashboard"],
    title: "Crypto Customer Support",
  },
  {
    badge: "Development",
    cta: "Launch SaaS outcome",
    description:
      "Turn product ideas into measurable delivery challenges with milestones, demos, and technical proof.",
    exampleOutcome: "Launch MVP dashboard with auth and admin panel",
    icon: Code2,
    proofExamples: ["Live demo", "Git commits", "Feature walkthrough"],
    title: "SaaS & Software Development",
  },
  {
    badge: "Operations",
    cta: "Launch VA outcome",
    description:
      "Create operational workflows for inbox handling, CRM updates, scheduling, reporting, and daily execution.",
    exampleOutcome: "Process 500 leads and update CRM pipeline weekly",
    icon: UserCheck,
    proofExamples: ["Work logs", "CRM updates", "Daily reports"],
    title: "Virtual Assistant Operations",
  },
  {
    badge: "Development",
    cta: "Launch development outcome",
    description:
      "Launch website, app, landing page, and automation builds with clear deliverables and proof.",
    exampleOutcome: "Build a premium landing page with contact flow",
    icon: Globe2,
    proofExamples: ["Live URL", "Screenshots", "Deployment report"],
    title: "Website & App Development",
  },
  {
    badge: "Automation",
    cta: "Launch automation outcome",
    description:
      "Build automation pipelines, outreach systems, dashboards, and CRM workflows with measurable delivery.",
    exampleOutcome: "Create automated outreach workflow with reporting dashboard",
    icon: Workflow,
    proofExamples: ["Automation logs", "CRM screenshots", "Dashboard link"],
    title: "Automation & CRM Systems",
  },
];

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

function UseCaseCard({ index, reduceMotion, useCase }) {
  const Icon = useCase.icon;

  return (
    <MotionDiv {...getMotionProps(reduceMotion, index * 0.05)}>
      <Card
        className="premium-motion-card group flex h-full flex-col transition duration-300 hover:-translate-y-1 hover:border-[#65A30D] hover:shadow-[0_24px_76px_rgba(63, 98, 18, 0.14)]"
        padding="lg"
        variant="default"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314] transition duration-300 group-hover:bg-[#3F6212] group-hover:text-white">
            <Icon aria-hidden="true" className="h-6 w-6" />
          </span>
          <Badge variant="primary">{useCase.badge}</Badge>
        </div>

        <h3 className="mt-6 text-xl font-black leading-tight text-[#1C1917]">
          {useCase.title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-[#57534E]">
          {useCase.description}
        </p>

        <div className="mt-5 rounded-2xl border border-[#ECFCCB] bg-[#FFFBEB] p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
            Example outcome
          </p>
          <p className="mt-2 text-sm font-black leading-6 text-[#27272A]">
            {useCase.exampleOutcome}
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-[#E7E5E4] bg-[#FAFAF9] p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">
            Proof examples
          </p>
          <ul className="mt-3 grid gap-2">
            {useCase.proofExamples.map((proof) => (
              <li className="flex items-start gap-2 text-sm font-semibold leading-6 text-[#44403C]" key={proof}>
                <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#3F6212]" />
                <span>{proof}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-6">
          <Button as="a" className="w-full" href={ROUTES.REGISTER} variant="secondary">
            {useCase.cta}
          </Button>
        </div>
      </Card>
    </MotionDiv>
  );
}

export function UseCasesSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F4FF_44%,#F0E7FF_100%)] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_12%_10%,rgba(63, 98, 18, 0.15),transparent_34%),radial-gradient(circle_at_90%_72%,rgba(101, 163, 13, 0.14),transparent_28%)]" />
      <Container className="relative z-10">
        <MotionDiv {...getMotionProps(reduceMotion, 0)}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end">
            <SectionHeader
              badge="Use cases"
              description="From lead generation to customer support, SaaS delivery, and automation, ProofArena helps teams structure work around measurable results and verified proof."
              title="Built for business outcomes across industries."
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
              <Button as="a" className="w-full sm:w-auto" href={ROUTES.CHALLENGES}>
                Explore Challenges
                <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
              </Button>
              <Button as="a" className="w-full sm:w-auto" href={ROUTES.REGISTER} variant="secondary">
                Create Your First Outcome
              </Button>
            </div>
          </div>
        </MotionDiv>

        <MotionDiv
          className="mt-8 flex flex-wrap gap-2"
          {...getMotionProps(reduceMotion, 0.08)}
        >
          {categoryPills.map((category) => (
            <span
              className="premium-motion-row rounded-full border border-[#E7E5E4] bg-[#FAFAF9] px-4 py-2 text-xs font-black text-[#44403C]"
              key={category}
            >
              {category}
            </span>
          ))}
        </MotionDiv>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {useCases.map((useCase, index) => (
            <UseCaseCard
              index={index}
              key={useCase.title}
              reduceMotion={reduceMotion}
              useCase={useCase}
            />
          ))}
        </div>

        <MotionDiv
          className="premium-motion-card mt-8 rounded-3xl border border-[#E7E5E4] bg-[#FAFAF9] p-5 sm:p-6"
          {...getMotionProps(reduceMotion, 0.18)}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314]">
              <ShieldCheck aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="text-base font-black text-[#1C1917]">
                Every use case is structured around goals, milestones, and proof.
              </p>
              <p className="mt-2 text-sm leading-7 text-[#57534E]">
                ProofArena keeps business outcomes grounded in measurable
                targets, delivery checkpoints, and reviewed evidence instead of
                vague task descriptions.
              </p>
            </div>
          </div>
        </MotionDiv>
      </Container>
    </section>
  );
}
