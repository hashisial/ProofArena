import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  DollarSign,
  FileCheck2,
  Layers3,
  ListChecks,
  Target,
} from "lucide-react";
import { Button } from "../../components/Button.jsx";
import { Container } from "../../components/Container.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { getRevealMotionProps } from "../../utils/motion.js";

const MotionDiv = motion.div;
const MotionArticle = motion.article;

const filterChips = [
  "Lead Generation",
  "Automation",
  "Software Delivery",
  "Customer Support",
];

const challenges = [
  {
    budget: "Fixed outcome",
    category: "Lead Generation",
    icon: Target,
    milestones: "5 milestones",
    plans: "12 plans submitted",
    proofRequired: ["CRM sheet", "Appointment confirmations", "Lead qualification notes"],
    status: "Open preview",
    successCriteria: "Qualified seller lead, CRM-ready record, and confirmation proof.",
    summary:
      "Build a verified seller lead pipeline with CRM-ready records and appointment confirmation proof.",
    timeline: "30 days",
    title: "Generate 30 qualified real estate seller leads",
  },
  {
    budget: "Milestone-based",
    category: "Automation",
    icon: Layers3,
    milestones: "4 milestones",
    plans: "8 plans submitted",
    proofRequired: ["Dashboard link", "Automation logs", "Workflow documentation"],
    status: "Open preview",
    successCriteria: "Working automation, reporting dashboard, and workflow documentation.",
    summary:
      "Create an automated outreach workflow with reporting dashboard and visible workflow logs.",
    timeline: "21 days",
    title: "Build CRM automation dashboard",
  },
  {
    budget: "Fixed scope",
    category: "Software Delivery",
    icon: FileCheck2,
    milestones: "4 milestones",
    plans: "15 plans submitted",
    proofRequired: ["Live URL", "Git commits", "Demo walkthrough"],
    status: "Open preview",
    successCriteria: "Live responsive page, auth-ready flow, and deployment walkthrough.",
    summary:
      "Deliver a production-ready landing page with login/register flow, responsive UI, and deployment proof.",
    timeline: "14 days",
    title: "Launch SaaS landing page with auth",
  },
  {
    budget: "Managed outcome",
    category: "Customer Support",
    icon: ClipboardCheck,
    milestones: "3 milestones",
    plans: "6 plans submitted",
    proofRequired: ["Ticket reports", "Response dashboard", "Process documentation"],
    status: "Open preview",
    successCriteria: "Tracked response-time improvement with ticket and process evidence.",
    summary:
      "Improve support workflow with tracked ticket performance and response-time proof.",
    timeline: "30 days",
    title: "Reduce support response time under 2 minutes",
  },
];

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

function ChallengeStat({ icon, label, value, tone = "olive" }) {
  const Icon = icon;
  const iconColor = tone === "bronze" ? "text-[#A16207]" : "text-[#3F6212]";
  const labelColor = tone === "bronze" ? "text-[#A16207]" : "text-[#78716C]";

  return (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-[#E7E5E4] bg-white p-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#FEFCE8]">
        <Icon aria-hidden="true" className={`h-4 w-4 ${iconColor}`} />
      </span>
      <div className="min-w-0">
        <p className={`text-[0.68rem] font-black uppercase tracking-[0.12em] ${labelColor}`}>
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-black leading-6 text-[#1C1917]">
          {value}
        </p>
      </div>
    </div>
  );
}

function ChallengeCard({ challenge, index, reduceMotion }) {
  const Icon = challenge.icon;

  return (
    <MotionArticle
      {...getMotionProps(reduceMotion, 0.08 + index * 0.05)}
      className="min-w-0"
    >
      <Card
        as="article"
        className="premium-motion-card group flex h-full flex-col rounded-[1.7rem] transition duration-300 hover:-translate-y-1 hover:border-[#65A30D] hover:shadow-[0_24px_76px_rgba(63,98,18,0.14)]"
        padding="lg"
        variant="default"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314] transition group-hover:bg-[#3F6212] group-hover:text-white">
              <Icon aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <Badge variant="gray">Example challenge</Badge>
              <h3 className="mt-4 break-words text-xl font-black leading-tight text-[#1C1917]">
                {challenge.title}
              </h3>
            </div>
          </div>
          <Badge variant="primary">{challenge.category}</Badge>
        </div>

        <p className="mt-5 text-sm font-semibold leading-7 text-[#57534E]">
          {challenge.summary}
        </p>

        <div className="mt-5 rounded-3xl border border-[#ECFCCB] bg-[#FEFCE8] p-4">
          <div className="flex items-center gap-2">
            <Target aria-hidden="true" className="h-5 w-5 shrink-0 text-[#3F6212]" />
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
              Success criteria
            </p>
          </div>
          <p className="mt-2 text-sm font-black leading-6 text-[#1C1917]">
            {challenge.successCriteria}
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <ChallengeStat icon={CalendarDays} label="Timeline" value={challenge.timeline} />
          <ChallengeStat icon={DollarSign} label="Budget" tone="bronze" value={challenge.budget} />
          <ChallengeStat icon={ListChecks} label="Plans" value={challenge.plans} />
          <ChallengeStat icon={Layers3} label="Milestones" tone="bronze" value={challenge.milestones} />
        </div>

        <div className="mt-5 rounded-3xl border border-[#E7E5E4] bg-[#FEFCE8] p-4">
          <div className="flex items-center gap-2">
            <FileCheck2 aria-hidden="true" className="h-5 w-5 shrink-0 text-[#A16207]" />
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#A16207]">
              Proof required
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {challenge.proofRequired.map((item) => (
              <span
                className="rounded-full border border-[#ECFCCB] bg-white px-3 py-1.5 text-xs font-black leading-5 text-[#365314] transition hover:border-[#65A30D] hover:bg-[#F7FEE7]"
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4">
            <Badge leftIcon={<CheckCircle2 className="h-4 w-4" />} variant="green">
              {challenge.status}
            </Badge>
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.CHALLENGES} variant="secondary">
              View Challenge
              <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </MotionArticle>
  );
}

export function FeaturedChallengesSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FEFCE8_0%,#FFFFFF_52%,#FFFFFF_100%)] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_16%_18%,rgba(63,98,18,0.12),transparent_32%),radial-gradient(circle_at_86%_44%,rgba(161,98,7,0.09),transparent_28%)]" />
      <Container className="relative z-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <MotionDiv {...getMotionProps(reduceMotion, 0)}>
            <Badge variant="primary">Featured challenges</Badge>
            <h2 className="mt-4 max-w-4xl break-words text-3xl font-black leading-tight text-[#1C1917] [text-wrap:balance] sm:text-4xl lg:text-5xl">
              Featured outcome challenges
            </h2>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-[#57534E] sm:text-lg">
              Real work should start with a clear result, success criteria,
              timeline, and proof requirements.
            </p>
            <div className="mt-6 flex items-start gap-3 rounded-3xl border border-[#E7E5E4] bg-white p-5 shadow-[0_16px_50px_rgba(28,25,23,0.04)]">
              <ClipboardCheck aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#3F6212]" />
              <p className="text-sm font-semibold leading-7 text-[#57534E]">
                Every challenge should include target outcome, timeline, proof
                requirements, and success criteria so providers can submit
                better plans. Preview examples show how outcome challenges will
                appear inside ProofArena.
              </p>
            </div>
          </MotionDiv>

          <MotionDiv
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end"
            {...getMotionProps(reduceMotion, 0.08)}
          >
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.CHALLENGES}>
              Explore Challenges
              <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
            </Button>
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.REGISTER} variant="secondary">
              Create a Challenge
            </Button>
          </MotionDiv>
        </div>

        <MotionDiv
          className="mt-10 flex flex-wrap items-center gap-3"
          {...getMotionProps(reduceMotion, 0.1)}
        >
          <Badge variant="secondary">Challenge previews</Badge>
          {filterChips.map((chip) => (
            <span
              className="rounded-full border border-[#E7E5E4] bg-white px-4 py-2 text-sm font-black leading-5 text-[#44403C] shadow-[0_10px_28px_rgba(28,25,23,0.04)] transition hover:border-[#65A30D] hover:bg-[#F7FEE7] hover:text-[#365314]"
              key={chip}
            >
              {chip}
            </span>
          ))}
        </MotionDiv>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {challenges.map((challenge, index) => (
            <ChallengeCard
              challenge={challenge}
              index={index}
              key={challenge.title}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        <MotionDiv
          className="mt-8 flex items-start gap-3 rounded-3xl border border-[#E7E5E4] bg-[#FEFCE8] p-5"
          {...getMotionProps(reduceMotion, 0.28)}
        >
          <CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#3F6212]" />
          <p className="text-sm font-semibold leading-7 text-[#57534E]">
            These challenge cards are preview examples. Live challenges should
            come from connected product data, not fabricated clients or fake
            production activity.
          </p>
        </MotionDiv>
      </Container>
    </section>
  );
}
