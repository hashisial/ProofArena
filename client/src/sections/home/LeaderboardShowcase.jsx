import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  Gauge,
  Medal,
  ShieldCheck,
  Timer,
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

const leaderboardRows = [
  {
    approvalRate: "98%",
    badge: "Top proof score",
    completedOutcomes: 28,
    onTimeRate: "96%",
    provider: "Growth Systems Provider",
    proofScore: 96,
    specialty: "Lead Generation + CRM Automation",
  },
  {
    approvalRate: "95%",
    badge: "Reliable delivery",
    completedOutcomes: 21,
    onTimeRate: "94%",
    provider: "Support Operations Team",
    proofScore: 93,
    specialty: "Customer Support + Workflow Ops",
  },
  {
    approvalRate: "94%",
    badge: "Launch expert",
    completedOutcomes: 17,
    onTimeRate: "92%",
    provider: "CRM Automation Specialist",
    proofScore: 91,
    specialty: "CRM Automation + Outreach Systems",
  },
  {
    approvalRate: "92%",
    badge: "Automation focused",
    completedOutcomes: 14,
    onTimeRate: "91%",
    provider: "Automation Workflow Builder",
    proofScore: 88,
    specialty: "CRM + Outreach Automation",
  },
];

const reputationSignals = [
  {
    description: "Proof accepted against challenge requirements.",
    icon: BadgeCheck,
    title: "Approved proof",
  },
  {
    description: "Measurable results delivered and recorded.",
    icon: Trophy,
    title: "Completed outcomes",
  },
  {
    description: "Milestones completed within agreed timelines.",
    icon: Timer,
    title: "On-time delivery",
  },
  {
    description: "Future review signals can support reputation quality.",
    icon: BarChart3,
    title: "Client review signals",
  },
  {
    description: "Verified profiles can strengthen trust signals.",
    icon: ShieldCheck,
    title: "Verification status",
  },
];

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

function StatBlock({ label, value }) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#E7E5E4] bg-white px-3 py-3">
      <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#78716C]">
        {label}
      </p>
      <p className="mt-1 text-base font-black leading-6 text-[#1C1917]">{value}</p>
    </div>
  );
}

function LeaderboardRow({ index, reduceMotion, row }) {
  const rank = `#${index + 1}`;

  return (
    <MotionArticle
      {...getMotionProps(reduceMotion, 0.1 + index * 0.05)}
      className="premium-motion-row group min-w-0 rounded-3xl border border-[#E7E5E4] bg-white p-4 shadow-[0_14px_42px_rgba(28,25,23,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#65A30D] hover:bg-[#FEFCE8] hover:shadow-[0_24px_70px_rgba(63,98,18,0.13)]"
    >
      <div className="grid min-w-0 gap-4 lg:grid-cols-[72px_minmax(0,1fr)_104px_112px_92px_92px_minmax(112px,auto)] lg:items-center">
        <div className="flex min-w-0 items-center gap-3 lg:block">
          <span
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-sm font-black shadow-[0_12px_26px_rgba(63,98,18,0.12)] ${
              index === 0
                ? "bg-[#3F6212] text-white"
                : "border border-[#ECFCCB] bg-[#F7FEE7] text-[#365314]"
            }`}
          >
            {rank}
          </span>
          <div className="min-w-0 lg:hidden">
            <h3 className="break-words text-base font-black leading-6 text-[#1C1917]">
              {row.provider}
            </h3>
            <p className="mt-1 break-words text-sm font-semibold leading-6 text-[#78716C]">
              {row.specialty}
            </p>
          </div>
        </div>

        <div className="hidden min-w-0 lg:block">
          <h3 className="truncate text-base font-black leading-6 text-[#1C1917]">
            {row.provider}
          </h3>
          <p className="mt-1 truncate text-sm font-semibold leading-6 text-[#78716C]">
            {row.specialty}
          </p>
        </div>

        <div className="rounded-2xl border border-[#65A30D]/20 bg-[#F7FEE7] px-3 py-3">
          <div className="flex items-center justify-between gap-3 lg:block">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#3F6212]">
              Proof Score
            </p>
            <p className="text-xl font-black leading-7 text-[#3F6212] lg:mt-1">
              {row.proofScore}
            </p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
            <div
              className="motion-score-fill h-full rounded-full bg-[#3F6212]"
              style={{ width: `${row.proofScore}%` }}
            />
          </div>
        </div>

        <StatBlock label="Outcomes" value={row.completedOutcomes} />
        <StatBlock label="Approval" value={row.approvalRate} />
        <StatBlock label="On time" value={row.onTimeRate} />

        <div className="flex min-w-0 justify-start lg:justify-end">
          <Badge className="w-full justify-center lg:w-auto" variant="secondary">
            {row.badge}
          </Badge>
        </div>
      </div>
    </MotionArticle>
  );
}

function ReputationPanel({ reduceMotion }) {
  return (
    <MotionDiv {...getMotionProps(reduceMotion, 0.16)}>
      <Card
        className="premium-motion-card h-full rounded-[2rem] border-[#ECFCCB] bg-white shadow-[0_24px_80px_rgba(63,98,18,0.1)]"
        padding="lg"
        variant="elevated"
      >
        <Badge variant="primary">Ranking signals</Badge>
        <h3 className="mt-4 text-2xl font-black leading-tight text-[#1C1917]">
          What affects leaderboard visibility?
        </h3>
        <p className="mt-3 text-sm font-semibold leading-7 text-[#57534E]">
          Visibility is designed around proof-backed execution signals, not paid
          boosts, profile polish, or empty popularity.
        </p>

        <ul className="mt-6 grid gap-3">
          {reputationSignals.map((item, index) => {
            const Icon = item.icon;

            return (
              <MotionLi
                {...getMotionProps(reduceMotion, 0.2 + index * 0.04)}
                className="premium-motion-row flex min-w-0 items-start gap-3 rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4"
                key={item.title}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-[#365314]">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h4 className="text-sm font-black leading-6 text-[#1C1917]">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-sm font-semibold leading-6 text-[#78716C]">
                    {item.description}
                  </p>
                </div>
              </MotionLi>
            );
          })}
        </ul>
      </Card>
    </MotionDiv>
  );
}

function ProofScorePanel({ reduceMotion }) {
  return (
    <MotionDiv {...getMotionProps(reduceMotion, 0.22)}>
      <Card
        className="premium-motion-card h-full rounded-[2rem] bg-[linear-gradient(135deg,#FFFFFF_0%,#FEFCE8_58%,#F7FEE7_100%)]"
        padding="lg"
        variant="elevated"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="secondary">Preview metric</Badge>
            <h3 className="mt-4 text-2xl font-black leading-tight text-[#1C1917]">
              Proof Score
            </h3>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#ECFCCB] text-[#3F6212]">
            <Gauge aria-hidden="true" className="h-6 w-6" />
          </span>
        </div>

        <div className="mt-7 rounded-[2rem] border border-[#3F6212]/20 bg-white p-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">
                Example score
              </p>
              <p className="mt-2 text-5xl font-black leading-none text-[#3F6212]">
                96
                <span className="text-xl text-[#78716C]">/100</span>
              </p>
            </div>
            <Medal aria-hidden="true" className="h-10 w-10 text-[#A16207]" />
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#ECFCCB]">
            <div className="motion-score-fill h-full w-[96%] rounded-full bg-[#3F6212]" />
          </div>
        </div>

        <p className="mt-5 text-sm font-semibold leading-7 text-[#57534E]">
          Proof Score is designed to reflect verified execution, approved proof,
          and delivery reliability. This is preview data, not a final scoring
          formula.
        </p>
      </Card>
    </MotionDiv>
  );
}

export function LeaderboardShowcase() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_45%,#FEFCE8_100%)] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_12%_12%,rgba(63,98,18,0.14),transparent_32%),radial-gradient(circle_at_88%_48%,rgba(161,98,7,0.1),transparent_30%)]" />
      <Container className="relative z-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <MotionDiv {...getMotionProps(reduceMotion, 0)}>
            <Badge variant="primary">Proof-based leaderboard</Badge>
            <h2 className="mt-4 max-w-4xl break-words text-3xl font-black leading-tight text-[#1C1917] [text-wrap:balance] sm:text-4xl lg:text-5xl">
              Ranked by execution, not noise.
            </h2>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-[#57534E] sm:text-lg">
              Leaderboards are designed to reward delivery quality, not paid
              boosts. Providers can rise through proof score, completed
              outcomes, approval rate, and on-time delivery.
            </p>
            <div className="mt-6 flex items-start gap-3 rounded-3xl border border-[#E7E5E4] bg-white p-5 shadow-[0_16px_50px_rgba(28,25,23,0.04)]">
              <CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#3F6212]" />
              <p className="text-sm font-semibold leading-7 text-[#57534E]">
                Preview rows use generic provider labels until live ranking data
                is connected.
              </p>
            </div>
          </MotionDiv>

          <MotionDiv
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end"
            {...getMotionProps(reduceMotion, 0.08)}
          >
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.LEADERBOARD}>
              View Leaderboard
              <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
            </Button>
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.PROVIDERS} variant="secondary">
              Explore Providers
            </Button>
          </MotionDiv>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Badge leftIcon={<Medal className="h-4 w-4" />} variant="secondary">
            Leaderboard preview
          </Badge>
          <p className="text-sm font-semibold leading-6 text-[#78716C]">
            Providers grow visibility by delivering verified outcomes.
          </p>
        </div>

        <Card
          className="mt-6 rounded-[2rem] border-[#ECFCCB] bg-white shadow-[0_24px_80px_rgba(63,98,18,0.1)]"
          padding="lg"
          variant="elevated"
        >
          <div className="hidden rounded-2xl border border-[#E7E5E4] bg-[#1C1917] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-white/75 lg:grid lg:grid-cols-[72px_minmax(0,1fr)_104px_112px_92px_92px_minmax(112px,auto)]">
            <span>Rank</span>
            <span>Provider</span>
            <span>Proof Score</span>
            <span>Outcomes</span>
            <span>Approval</span>
            <span>On Time</span>
            <span className="text-right">Badge</span>
          </div>

          <div className="mt-0 grid gap-3 lg:mt-4">
            {leaderboardRows.map((row, index) => (
              <LeaderboardRow
                index={index}
                key={row.provider}
                reduceMotion={reduceMotion}
                row={row}
              />
            ))}
          </div>
        </Card>

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.46fr)]">
          <ReputationPanel reduceMotion={reduceMotion} />
          <ProofScorePanel reduceMotion={reduceMotion} />
        </div>
      </Container>
    </section>
  );
}
