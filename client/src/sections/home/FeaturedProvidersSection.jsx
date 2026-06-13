import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileCheck2,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRoundCheck,
} from "lucide-react";
import { Button } from "../../components/Button.jsx";
import { Container } from "../../components/Container.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { getRevealMotionProps } from "../../utils/motion.js";

const MotionDiv = motion.div;
const MotionArticle = motion.article;

const filterChips = ["Growth", "Software", "Support", "Automation"];

const providers = [
  {
    approvedProofs: 41,
    badges: ["Verified profile", "Top proof score"],
    category: "Growth Operations",
    completedOutcomes: 28,
    headline: "Lead generation and CRM automation specialist",
    initials: "GS",
    label: "Growth Systems Provider",
    onTimeRate: "96%",
    proofScore: 96,
    skills: ["Lead Generation", "CRM Automation", "Outreach Systems"],
  },
  {
    approvedProofs: 26,
    badges: ["Launch expert", "Verified outcomes"],
    category: "Software Delivery",
    completedOutcomes: 17,
    headline: "Frontend, backend, dashboards, and launch systems",
    initials: "SD",
    label: "SaaS Delivery Specialist",
    onTimeRate: "92%",
    proofScore: 91,
    skills: ["React", "Node.js", "Product Delivery"],
  },
  {
    approvedProofs: 34,
    badges: ["Reliable delivery", "Verified proof"],
    category: "Support Operations",
    completedOutcomes: 21,
    headline: "Customer support workflows, moderation, and response systems",
    initials: "SO",
    label: "Support Operations Team",
    onTimeRate: "94%",
    proofScore: 93,
    skills: ["Support Ops", "Community Moderation", "Ticket Systems"],
  },
  {
    approvedProofs: 22,
    badges: ["Automation focused", "Proof-backed"],
    category: "Automation",
    completedOutcomes: 14,
    headline: "CRM, outreach automation, dashboards, and reporting workflows",
    initials: "AW",
    label: "Automation Workflow Builder",
    onTimeRate: "91%",
    proofScore: 88,
    skills: ["CRM Workflows", "Automation Logs", "Reporting Dashboards"],
  },
];

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

function ProviderStat({ icon, label, tone = "olive", value }) {
  const Icon = icon;
  const iconColor = tone === "bronze" ? "text-[#A16207]" : "text-[#3F6212]";
  const labelColor = tone === "bronze" ? "text-[#A16207]" : "text-[#78716C]";

  return (
    <div className="min-w-0 rounded-2xl border border-[#E7E5E4] bg-white p-3">
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className={`h-4 w-4 shrink-0 ${iconColor}`} />
        <p className={`text-[0.68rem] font-black uppercase tracking-[0.12em] ${labelColor}`}>
          {label}
        </p>
      </div>
      <p className="mt-2 break-words text-xl font-black leading-7 text-[#1C1917]">
        {value}
      </p>
    </div>
  );
}

function ProofScorePreview({ score }) {
  return (
    <div className="rounded-3xl border border-[#65A30D]/20 bg-[#F7FEE7] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#3F6212]">
            Proof Score
          </p>
          <p className="mt-2 text-4xl font-black leading-none text-[#3F6212]">
            {score}
            <span className="text-lg text-[#78716C]">/100</span>
          </p>
        </div>
        <Badge variant="green">Preview metric</Badge>
      </div>
      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white">
        <div
          className="motion-score-fill h-full rounded-full bg-[#3F6212]"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function FeaturedProviderCard({ index, provider, reduceMotion }) {
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
          <div className="flex min-w-0 items-start gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#1C1917,#3F6212)] text-lg font-black text-white ring-4 ring-[#F7FEE7]">
              {provider.initials}
            </span>
            <div className="min-w-0">
              <Badge variant="gray">Provider preview</Badge>
              <div className="mt-4 flex min-w-0 flex-wrap items-center gap-2">
                <h3 className="break-words text-xl font-black leading-tight text-[#1C1917]">
                  {provider.label}
                </h3>
                <ShieldCheck aria-hidden="true" className="h-5 w-5 shrink-0 text-[#3F6212]" />
              </div>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#57534E]">
                {provider.headline}
              </p>
            </div>
          </div>
          <Badge variant="secondary">{provider.category}</Badge>
        </div>

        <div className="mt-6">
          <ProofScorePreview score={provider.proofScore} />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <ProviderStat
            icon={Trophy}
            label="Outcomes"
            value={provider.completedOutcomes}
          />
          <ProviderStat
            icon={FileCheck2}
            label="Proofs"
            tone="bronze"
            value={provider.approvedProofs}
          />
          <ProviderStat
            icon={Clock3}
            label="On time"
            value={provider.onTimeRate}
          />
        </div>

        <div className="mt-5 rounded-3xl border border-[#E7E5E4] bg-[#FEFCE8] p-4">
          <div className="flex items-center gap-2">
            <UserRoundCheck aria-hidden="true" className="h-5 w-5 shrink-0 text-[#3F6212]" />
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
              Skills and outcomes
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {provider.skills.map((skill) => (
              <span
                className="rounded-full border border-[#ECFCCB] bg-white px-3 py-1.5 text-xs font-black leading-5 text-[#365314] transition hover:border-[#65A30D] hover:bg-[#F7FEE7]"
                key={skill}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {provider.badges.map((badge, badgeIndex) => (
            <Badge
              key={badge}
              leftIcon={
                badgeIndex === 0 ? (
                  <BadgeCheck className="h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )
              }
              variant={badgeIndex === 0 ? "green" : "secondary"}
            >
              {badge}
            </Badge>
          ))}
        </div>

        <div className="mt-auto grid gap-2 pt-5">
          <Button as="a" className="w-full" href={ROUTES.PROVIDERS} variant="secondary">
            View providers
            <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
          </Button>
          <Button as="a" className="w-full" href={ROUTES.PROVIDER_COMPARE} variant="outline">
            Compare providers
          </Button>
        </div>
      </Card>
    </MotionArticle>
  );
}

export function FeaturedProvidersSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_48%,#FEFCE8_100%)] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_14%_18%,rgba(63,98,18,0.12),transparent_32%),radial-gradient(circle_at_86%_50%,rgba(161,98,7,0.09),transparent_28%)]" />
      <Container className="relative z-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <MotionDiv {...getMotionProps(reduceMotion, 0)}>
            <Badge variant="primary">Featured providers</Badge>
            <h2 className="mt-4 max-w-4xl break-words text-3xl font-black leading-tight text-[#1C1917] [text-wrap:balance] sm:text-4xl lg:text-5xl">
              Providers with proof-backed reputation
            </h2>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-[#57534E] sm:text-lg">
              Compare providers by proof score, completed outcomes, skills, and
              similar delivery history.
            </p>
            <div className="mt-6 flex items-start gap-3 rounded-3xl border border-[#E7E5E4] bg-white p-5 shadow-[0_16px_50px_rgba(28,25,23,0.04)]">
              <CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#3F6212]" />
              <p className="text-sm font-semibold leading-7 text-[#57534E]">
                Provider cards are designed around proof score, completed
                outcomes, similar delivery history, and skills - not only
                reviews. Preview cards use generic provider labels until live
                provider data is connected.
              </p>
            </div>
          </MotionDiv>

          <MotionDiv
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end"
            {...getMotionProps(reduceMotion, 0.08)}
          >
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.PROVIDERS}>
              View all providers
              <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
            </Button>
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.REGISTER} variant="secondary">
              Become a Provider
            </Button>
          </MotionDiv>
        </div>

        <MotionDiv
          className="mt-10 flex flex-wrap items-center gap-3"
          {...getMotionProps(reduceMotion, 0.1)}
        >
          <Badge variant="secondary">Provider previews</Badge>
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
          {providers.map((provider, index) => (
            <FeaturedProviderCard
              index={index}
              key={provider.label}
              provider={provider}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        <MotionDiv
          className="mt-8 flex items-start gap-3 rounded-3xl border border-[#E7E5E4] bg-[#FEFCE8] p-5"
          {...getMotionProps(reduceMotion, 0.28)}
        >
          <BarChart3 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#3F6212]" />
          <p className="text-sm font-semibold leading-7 text-[#57534E]">
            These provider cards are preview examples. They do not use fake real
            identities, fake profile photos, testimonials, or live production
            ranking data.
          </p>
        </MotionDiv>
      </Container>
    </section>
  );
}
