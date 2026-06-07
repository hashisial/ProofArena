import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BarChart3, Medal, ShieldCheck, Timer, Trophy } from "lucide-react";
import { Button } from "../../components/Button.jsx";
import { Container } from "../../components/Container.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { getRevealMotionProps } from "../../utils/motion.js";
import { SectionHeader } from "./SectionHeader.jsx";

const MotionDiv = motion.div;

const leaderboardRows = [
  {
    approvalRate: "98%",
    category: "Lead Generation",
    completedOutcomes: 28,
    provider: "Growth Systems Provider",
    proofScore: 96,
  },
  {
    approvalRate: "95%",
    category: "Customer Support",
    completedOutcomes: 21,
    provider: "Support Operations Team",
    proofScore: 93,
  },
  {
    approvalRate: "94%",
    category: "Web Development",
    completedOutcomes: 17,
    provider: "SaaS Delivery Specialist",
    proofScore: 91,
  },
  {
    approvalRate: "92%",
    category: "CRM & Automation",
    completedOutcomes: 14,
    provider: "Automation Builder",
    proofScore: 88,
  },
  {
    approvalRate: "90%",
    category: "Virtual Assistance",
    completedOutcomes: 11,
    provider: "Virtual Ops Assistant",
    proofScore: 84,
  },
];

const rankingBadges = [
  { icon: Trophy, label: "Top Proof Score" },
  { icon: ShieldCheck, label: "Verified Outcomes" },
  { icon: Timer, label: "On-time Delivery" },
];

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

function LeaderboardRow({ index, reduceMotion, row }) {
  const scoreWidth = `${row.proofScore}%`;

  return (
    <MotionDiv {...getMotionProps(reduceMotion, index * 0.04)}>
      <div className="premium-motion-row grid gap-4 rounded-2xl border border-[#E9E2F3] bg-[#FCFAFF] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#A78BFA] hover:bg-white hover:shadow-[0_18px_54px_rgba(124, 58, 237, 0.1)] xl:grid-cols-[auto_minmax(0,1fr)_110px_100px_90px] xl:items-center">
        <div className="flex items-center gap-3">
          <span
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-sm font-black ${
              index === 0 ? "bg-[#7C3AED] text-white" : "bg-white text-[#5B21B6]"
            }`}
          >
            {index + 1}
          </span>
          <div className="min-w-0 xl:hidden">
            <p className="font-black leading-6 text-[#07030D]">{row.provider}</p>
            <p className="text-sm leading-6 text-[#6F657C]">{row.category}</p>
          </div>
        </div>

        <div className="hidden min-w-0 xl:block">
          <p className="truncate font-black leading-6 text-[#07030D]">{row.provider}</p>
          <p className="text-sm leading-6 text-[#6F657C]">{row.category}</p>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3 xl:block">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6F657C]">
              Proof Score
            </p>
            <p className="text-lg font-black text-[#07030D] xl:mt-1">{row.proofScore}</p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EDE9FE]">
            <div
              className="motion-score-fill h-full rounded-full bg-[#7C3AED]"
              style={{ width: scoreWidth }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 xl:block">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6F657C]">
            Outcomes
          </p>
          <p className="text-base font-black text-[#07030D] xl:mt-1">
            {row.completedOutcomes}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 xl:block">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6F657C]">
            Approval
          </p>
          <p className="text-base font-black text-[#07030D] xl:mt-1">
            {row.approvalRate}
          </p>
        </div>
      </div>
    </MotionDiv>
  );
}

export function LeaderboardPreview() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#F5F3FF_0%,#F5F3FF_48%,#FFFFFF_100%)] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_86%_16%,rgba(124, 58, 237, 0.18),transparent_34%),radial-gradient(circle_at_12%_76%,rgba(10,10,10,0.05),transparent_30%)]" />
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-start">
          <MotionDiv {...getMotionProps(reduceMotion, 0)}>
            <SectionHeader
              badge="Proof-based ranking"
              description="ProofArena can rank providers using proof score, completed outcomes, approval rate, and on-time delivery so strong operators are easier to discover."
              title="Rank providers by execution, not noise."
            />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button as="a" className="w-full sm:w-auto" href={ROUTES.LEADERBOARD}>
                View Leaderboard
                <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
              </Button>
              <Button as="a" className="w-full sm:w-auto" href={ROUTES.REGISTER} variant="secondary">
                Become a Provider
              </Button>
            </div>

            <div className="mt-8 grid gap-3">
              {rankingBadges.map((item) => {
                const Icon = item.icon;

                return (
                  <div className="premium-motion-row flex items-center gap-3 rounded-2xl border border-[#E9E2F3] bg-white px-4 py-3" key={item.label}>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#F5F3FF] text-[#5B21B6]">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-black text-[#27272A]">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </MotionDiv>

          <MotionDiv {...getMotionProps(reduceMotion, 0.08)}>
            <Card className="premium-tilt premium-motion-card overflow-hidden xl:overflow-visible" padding="lg" variant="elevated">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F5F3FF] text-[#5B21B6]">
                    <BarChart3 aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-black text-[#07030D]">Provider leaderboard</p>
                    <p className="text-sm leading-6 text-[#6F657C]">
                      Generic preview data for proof ranking.
                    </p>
                  </div>
                </div>
                <Badge leftIcon={<Medal className="h-4 w-4" />} variant="primary">
                  Leaderboard preview
                </Badge>
              </div>

              <div className="mt-6 hidden rounded-2xl border border-[#E9E2F3] bg-[#07030D] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-white/68 xl:grid xl:grid-cols-[auto_minmax(0,1fr)_110px_100px_90px]">
                <span>Rank</span>
                <span>Provider</span>
                <span>Proof Score</span>
                <span>Outcomes</span>
                <span>Approval</span>
              </div>

              <div className="mt-4 grid gap-3">
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
          </MotionDiv>
        </div>
      </Container>
    </section>
  );
}
