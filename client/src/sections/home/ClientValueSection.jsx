import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Headphones,
  MinusCircle,
  Rocket,
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

const frictionBullets = [
  "Too many profiles to browse",
  "Proposals are hard to compare",
  "Results are difficult to verify",
  "Progress gets scattered across tools",
  "Clients still have to manage everything manually",
];

const proofArenaBullets = [
  "Define the measurable result",
  "Set proof requirements upfront",
  "Compare providers by execution plan",
  "Track milestones in one workspace",
  "Verify proof before reputation grows",
];

const workspaceRows = [
  "Define goal",
  "Review execution plans",
  "Track milestones",
  "Approve verified proof",
];

const outcomePackages = [
  {
    badge: "Growth operations",
    description: "Generate qualified seller or buyer leads",
    icon: Building2,
    includes: [
      "Target lead count",
      "CRM-ready delivery",
      "Appointment confirmation proof",
      "Weekly progress reports",
    ],
    proof: "Lead sheet + CRM screenshots + appointment confirmations",
    timeline: "30 day challenge",
    title: "Real Estate Lead Challenge",
  },
  {
    badge: "Support operations",
    description: "Launch reliable customer support operations",
    icon: Headphones,
    includes: [
      "Support agents",
      "Ticket workflow",
      "Community moderation",
      "Escalation process",
    ],
    proof: "Ticket reports + response time metrics + moderation logs",
    timeline: "Setup sprint",
    title: "Crypto Support Workflow",
  },
  {
    badge: "Product delivery",
    description: "Ship a landing page, MVP module, or product workflow",
    icon: Rocket,
    includes: [
      "UI build",
      "Backend integration",
      "Live demo",
      "Delivery milestones",
    ],
    proof: "Live URL + Git commits + demo walkthrough",
    timeline: "Milestone-based sprint",
    title: "SaaS Launch Sprint",
  },
  {
    badge: "Systems buildout",
    description: "Build a repeatable growth or operations system",
    icon: Workflow,
    includes: [
      "CRM pipeline",
      "Outreach automation",
      "Reporting dashboard",
      "Workflow documentation",
    ],
    proof: "CRM screenshots + automation logs + dashboard link",
    timeline: "Structured setup",
    title: "Automation & CRM Setup",
  },
];

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

function BulletList({ accent = false, items }) {
  return (
    <ul className="mt-5 grid gap-3">
      {items.map((item) => (
        <li className="flex items-start gap-3" key={item}>
          {accent ? (
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#7C3AED]" />
          ) : (
            <MinusCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#6F657C]" />
          )}
          <span className="text-sm font-semibold leading-7 text-[#493C5E]">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function OutcomePackageCard({ index, pkg, reduceMotion }) {
  const Icon = pkg.icon;

  return (
    <MotionDiv {...getMotionProps(reduceMotion, index * 0.05)}>
      <Card
        className="premium-motion-card group flex h-full flex-col transition duration-300 hover:-translate-y-1 hover:border-[#A78BFA] hover:shadow-[0_24px_76px_rgba(124, 58, 237, 0.14)]"
        padding="lg"
        variant="default"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F5F3FF] text-[#5B21B6] transition duration-300 group-hover:bg-[#7C3AED] group-hover:text-white">
            <Icon aria-hidden="true" className="h-6 w-6" />
          </span>
          <Badge variant="primary">{pkg.badge}</Badge>
        </div>

        <h3 className="mt-6 text-xl font-black leading-tight text-[#07030D]">
          {pkg.title}
        </h3>
        <p className="mt-3 text-sm font-bold leading-7 text-[#6F657C]">
          {pkg.description}
        </p>

        <div className="mt-5 rounded-2xl border border-[#E9E2F3] bg-[#FCFAFF] p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">
            Includes
          </p>
          <ul className="mt-3 grid gap-2">
            {pkg.includes.map((item) => (
              <li className="flex items-start gap-2 text-sm font-semibold leading-6 text-[#493C5E]" key={item}>
                <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#7C3AED]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 grid gap-3">
          <div className="rounded-2xl border border-[#EDE9FE] bg-[#F8F4FF] p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED]">
              Proof required
            </p>
            <p className="mt-2 text-sm font-bold leading-6 text-[#27272A]">
              {pkg.proof}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E9E2F3] px-4 py-3">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">
              Timeline
            </span>
            <span className="text-sm font-black text-[#07030D]">{pkg.timeline}</span>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <Button as="a" className="w-full" href={ROUTES.REGISTER} variant="secondary">
            Launch this outcome
          </Button>
        </div>
      </Card>
    </MotionDiv>
  );
}

export function ClientValueSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F4FF_48%,#FBF9FF_100%)] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 -z-0 h-96 bg-[radial-gradient(circle_at_15%_8%,rgba(124, 58, 237, 0.13),transparent_34%),radial-gradient(circle_at_85%_86%,rgba(167, 139, 250, 0.12),transparent_30%)]" />
      <Container className="relative z-10">
        <MotionDiv {...getMotionProps(reduceMotion, 0)}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end">
            <SectionHeader
              badge="For clients"
              description="Create structured challenges with clear targets, execution plans, milestones, and proof requirements so your team can buy outcomes instead of managing promises."
              title="Turn business goals into outcome challenges."
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
              <Button as="a" className="w-full sm:w-auto" href={ROUTES.REGISTER}>
                Create a Challenge
                <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
              </Button>
              <Button as="a" className="w-full sm:w-auto" href={ROUTES.CHALLENGES} variant="secondary">
                See Example Challenges
              </Button>
            </div>
          </div>
        </MotionDiv>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-[minmax(0,0.72fr)_minmax(0,0.72fr)_minmax(280px,0.56fr)]">
          <MotionDiv {...getMotionProps(reduceMotion, 0.08)}>
            <Card className="premium-motion-card h-full bg-[#FCFAFF]" padding="lg" variant="bordered">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[#6F657C]">
                  <MinusCircle aria-hidden="true" className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-xl font-black text-[#07030D]">
                    Traditional hiring creates too much friction.
                  </h3>
                  <BulletList items={frictionBullets} />
                </div>
              </div>
            </Card>
          </MotionDiv>

          <MotionDiv {...getMotionProps(reduceMotion, 0.14)}>
            <Card
              className="premium-motion-card h-full border-[#7C3AED]/25 shadow-[0_24px_80px_rgba(124, 58, 237, 0.12)]"
              padding="lg"
              variant="elevated"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#7C3AED] text-white">
                  <ShieldCheck aria-hidden="true" className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-xl font-black text-[#07030D]">
                    ProofArena structures the work before it starts.
                  </h3>
                  <BulletList accent items={proofArenaBullets} />
                </div>
              </div>
            </Card>
          </MotionDiv>

          <MotionDiv {...getMotionProps(reduceMotion, 0.2)}>
            <Card className="premium-motion-card h-full" padding="lg" variant="default">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-[#07030D]">
                    Client workspace flow
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#6F657C]">
                    Clear steps from goal to proof approval.
                  </p>
                </div>
                <Badge variant="primary">Built for measurable delivery</Badge>
              </div>

              <div className="mt-6 grid gap-3">
                {workspaceRows.map((row, index) => (
                  <div className="flex items-center gap-3 rounded-2xl border border-[#E9E2F3] bg-[#FCFAFF] p-4" key={row}>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-sm font-black text-[#5B21B6]">
                      {index + 1}
                    </span>
                    <span className="text-sm font-black text-[#27272A]">{row}</span>
                  </div>
                ))}
              </div>
            </Card>
          </MotionDiv>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {outcomePackages.map((pkg, index) => (
            <OutcomePackageCard
              index={index}
              key={pkg.title}
              pkg={pkg}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-3xl border border-[#E9E2F3] bg-[#FCFAFF] p-5">
          <Target aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#7C3AED]" />
          <p className="text-sm font-semibold leading-7 text-[#6F657C]">
            Outcome packages are challenge templates, not performance claims.
            Providers still submit execution plans and proof is reviewed before
            reputation grows.
          </p>
        </div>
      </Container>
    </section>
  );
}
