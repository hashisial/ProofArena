import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Layers3,
  ShieldCheck,
  Sparkles,
  Trophy,
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

const proofRecords = [
  {
    category: "Lead Generation",
    icon: ClipboardCheck,
    milestone: "Final lead delivery",
    outcome: "42 qualified seller leads reviewed",
    proofScoreImpact: "+8",
    proofType: "CRM sheet + appointment confirmations",
    provider: "Growth Systems Provider",
    status: "Verified",
    title: "Real Estate Lead Challenge",
  },
  {
    category: "Software Delivery",
    icon: FileText,
    milestone: "Launch milestone",
    outcome: "Landing page launched with auth-ready demo",
    proofScoreImpact: "+6",
    proofType: "Live URL + Git commits + walkthrough",
    provider: "SaaS Delivery Specialist",
    status: "Verified",
    title: "SaaS Launch Sprint",
  },
  {
    category: "Customer Support",
    icon: BarChart3,
    milestone: "Performance review",
    outcome: "Response time reduced under 2 minutes",
    proofScoreImpact: "+5",
    proofType: "Ticket reports + response dashboard",
    provider: "Support Operations Team",
    status: "Verified",
    title: "Support Workflow Improvement",
  },
];

const proofWorkflow = [
  {
    description: "Provider uploads evidence tied to a milestone.",
    icon: FileCheck2,
    title: "Proof submitted",
  },
  {
    description: "Proof is checked against the challenge requirements.",
    icon: ShieldCheck,
    title: "Proof reviewed",
  },
  {
    description: "Approved proof strengthens score, outcomes, and visibility.",
    icon: Trophy,
    title: "Reputation updated",
  },
  {
    description: "Verified outcomes become public trust signals when allowed.",
    icon: Layers3,
    title: "Ledger record created",
  },
];

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

function ProofRecordCard({ index, record, reduceMotion }) {
  const Icon = record.icon;

  return (
    <MotionArticle
      {...getMotionProps(reduceMotion, 0.08 + index * 0.06)}
      className="min-w-0"
    >
      <Card
        as="div"
        className="premium-motion-card group h-full rounded-[1.7rem] transition duration-300 hover:-translate-y-1 hover:border-[#65A30D] hover:shadow-[0_24px_76px_rgba(63,98,18,0.14)]"
        padding="lg"
        variant="default"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314] transition group-hover:bg-[#3F6212] group-hover:text-white">
              <Icon aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <Badge variant="secondary">Preview example</Badge>
              <h3 className="mt-4 break-words text-2xl font-black leading-tight text-[#1C1917]">
                {record.title}
              </h3>
            </div>
          </div>
          <Badge variant="primary">{record.category}</Badge>
        </div>

        <div className="mt-6 rounded-3xl border border-[#ECFCCB] bg-[#FFFBEB] p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">
            Outcome
          </p>
          <p className="mt-2 text-base font-black leading-7 text-[#1C1917]">
            {record.outcome}
          </p>
        </div>

        <div className="mt-4 grid gap-3">
          <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-[#E7E5E4] bg-white p-4">
            <FileText aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#A16207]" />
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#A16207]">
                Proof type
              </p>
              <p className="mt-1 break-words text-sm font-bold leading-6 text-[#44403C]">
                {record.proofType}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-[#E7E5E4] bg-white p-4">
            <Layers3 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#3F6212]" />
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">
                Milestone
              </p>
              <p className="mt-1 break-words text-sm font-bold leading-6 text-[#44403C]">
                {record.milestone}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4">
          <Badge leftIcon={<BadgeCheck className="h-4 w-4" />} variant="green">
            {record.status}
          </Badge>
          <div className="flex items-center gap-2 rounded-full border border-[#3F6212]/20 bg-[#ECFCCB] px-3 py-2">
            <Sparkles aria-hidden="true" className="h-4 w-4 text-[#3F6212]" />
            <span className="text-sm font-black text-[#3F6212]">
              {record.proofScoreImpact} proof score impact
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#E7E5E4] bg-white p-4">
          <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#3F6212]" />
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">
              Provider label
            </p>
            <p className="mt-1 text-sm font-black leading-6 text-[#1C1917]">
              {record.provider}
            </p>
          </div>
        </div>
      </Card>
    </MotionArticle>
  );
}

function ProofWorkflowPanel({ reduceMotion }) {
  return (
    <MotionDiv {...getMotionProps(reduceMotion, 0.16)}>
      <Card
        className="premium-motion-card h-full rounded-[2rem] border-[#ECFCCB] bg-white shadow-[0_24px_80px_rgba(63,98,18,0.12)]"
        padding="lg"
        variant="elevated"
      >
        <Badge variant="primary">Proof workflow</Badge>
        <h3 className="mt-4 text-2xl font-black leading-tight text-[#1C1917]">
          How proof becomes trust
        </h3>
        <p className="mt-3 text-sm font-semibold leading-7 text-[#57534E]">
          Reviewed proof creates a stronger trust signal than profile claims,
          testimonials, or unverified ratings.
        </p>

        <ol className="mt-6 grid gap-3">
          {proofWorkflow.map((step, index) => {
            const Icon = step.icon;

            return (
              <MotionLi
                className="premium-motion-row flex min-w-0 items-start gap-3 rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4"
                key={step.title}
                {...getMotionProps(reduceMotion, 0.2 + index * 0.04)}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-[#365314]">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#A16207]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h4 className="mt-1 text-sm font-black text-[#1C1917]">
                    {step.title}
                  </h4>
                  <p className="mt-1 text-sm font-semibold leading-6 text-[#78716C]">
                    {step.description}
                  </p>
                </div>
              </MotionLi>
            );
          })}
        </ol>
      </Card>
    </MotionDiv>
  );
}

function ScoreImpactPanel({ reduceMotion }) {
  return (
    <MotionDiv {...getMotionProps(reduceMotion, 0.22)}>
      <Card
        className="premium-motion-card h-full rounded-[2rem] overflow-hidden border-[#E7E5E4] bg-[linear-gradient(135deg,#FFFFFF_0%,#FFFBEB_58%,#F7FEE7_100%)]"
        padding="lg"
        variant="elevated"
      >
        <Badge variant="secondary">Preview score movement</Badge>
        <h3 className="mt-4 text-2xl font-black leading-tight text-[#1C1917]">
          Proof Score Impact
        </h3>

        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="rounded-3xl border border-[#E7E5E4] bg-white p-4 text-center">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">
              Before
            </p>
            <p className="mt-2 text-4xl font-black text-[#1C1917]">84</p>
          </div>
          <ArrowRight aria-hidden="true" className="h-5 w-5 text-[#3F6212]" />
          <div className="rounded-3xl border border-[#3F6212]/20 bg-[#ECFCCB] p-4 text-center">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
              After
            </p>
            <p className="mt-2 text-4xl font-black text-[#3F6212]">92</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-[#A16207]/20 bg-[#FEF3C7] p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#A16207]">
            Reason
          </p>
          <p className="mt-2 text-sm font-black leading-6 text-[#1C1917]">
            Approved CRM proof + milestone completion
          </p>
        </div>

        <p className="mt-4 text-sm font-semibold leading-7 text-[#78716C]">
          Preview only. Final proof scoring should come from connected product
          rules and reviewed submissions.
        </p>
      </Card>
    </MotionDiv>
  );
}

export function ProofLedgerShowcase() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFBEB_0%,#FEFCE8_46%,#FFFFFF_100%)] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_15%_12%,rgba(63,98,18,0.14),transparent_32%),radial-gradient(circle_at_88%_64%,rgba(161,98,7,0.1),transparent_28%)]" />
      <Container className="relative z-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <MotionDiv {...getMotionProps(reduceMotion, 0)}>
            <Badge variant="primary">Proof Ledger</Badge>
            <h2 className="mt-4 max-w-4xl break-words text-3xl font-black leading-tight text-[#1C1917] [text-wrap:balance] sm:text-4xl lg:text-5xl">
              Proof Ledger turns evidence into reusable reputation.
            </h2>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-[#57534E] sm:text-lg">
              Every verified outcome can help providers get future clients
              because it shows what was delivered, what proof was reviewed, and
              which skills were used.
            </p>
            <div className="mt-6 flex items-start gap-3 rounded-3xl border border-[#E7E5E4] bg-white p-5 shadow-[0_16px_50px_rgba(28,25,23,0.04)]">
              <FileCheck2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#3F6212]" />
              <p className="text-sm font-semibold leading-7 text-[#57534E]">
                These are example proof record previews showing how verified
                outcomes will appear inside ProofArena.
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
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.REGISTER} variant="secondary">
              Create a Challenge
            </Button>
          </MotionDiv>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Badge variant="secondary">Preview examples</Badge>
          <p className="text-sm font-semibold leading-6 text-[#78716C]">
            ProofArena reputation is built from reviewed proof, not empty claims.
          </p>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {proofRecords.map((record, index) => (
            <ProofRecordCard
              index={index}
              key={record.title}
              record={record}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.46fr)]">
          <ProofWorkflowPanel reduceMotion={reduceMotion} />
          <ScoreImpactPanel reduceMotion={reduceMotion} />
        </div>

        <MotionDiv
          className="mt-8 flex items-start gap-3 rounded-3xl border border-[#E7E5E4] bg-[#FFFBEB] p-5"
          {...getMotionProps(reduceMotion, 0.28)}
        >
          <CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#3F6212]" />
          <p className="text-sm font-semibold leading-7 text-[#57534E]">
            These records are preview examples. Live proof records should come
            from reviewed submissions, not marketing claims or fake production data.
          </p>
        </MotionDiv>
      </Container>
    </section>
  );
}
