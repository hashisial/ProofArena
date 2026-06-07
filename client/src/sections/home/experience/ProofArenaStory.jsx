import { createElement } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  GitCompareArrows,
  Network,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  Trophy,
  UsersRound,
  Workflow,
  X,
} from "lucide-react";
import { Badge } from "../../../components/ui/Badge.jsx";
import { Button } from "../../../components/Button.jsx";
import { Container } from "../../../components/Container.jsx";
import { ROUTES } from "../../../constants/index.js";
import { getRevealMotionProps } from "../../../utils/motion.js";

const MotionArticle = motion.article;

const brokenSignals = [
  ["Proposal volume", "More noise, less clarity"],
  ["Unverified reviews", "Trust detached from outcomes"],
  ["Bidding pressure", "Price wins before execution"],
  ["Scattered delivery", "Proof disappears across tools"],
];

const shiftSteps = [
  { icon: Target, title: "Define outcome", copy: "Start with the measurable result." },
  { icon: ClipboardCheck, title: "Compare plans", copy: "Review execution before selection." },
  { icon: FileCheck2, title: "Verify proof", copy: "Check evidence against requirements." },
  { icon: Trophy, title: "Earn reputation", copy: "Let approved outcomes compound." },
];

const proofFlow = [
  { label: "Evidence submitted", state: "Captured", icon: FileCheck2 },
  { label: "Requirements checked", state: "Reviewed", icon: ShieldCheck },
  { label: "Outcome approved", state: "Verified", icon: BadgeCheck },
  { label: "Reputation updated", state: "Compounding", icon: Trophy },
];

const trustSignals = [
  { label: "Proof quality", value: "Verified evidence" },
  { label: "Outcome history", value: "Completed work" },
  { label: "Reliability", value: "On-time execution" },
  { label: "Visibility", value: "Privacy-aware" },
];

function SectionIntro({ badge, children, copy, dark = false }) {
  return (
    <div data-story-reveal>
      <p className={`text-xs font-black uppercase ${dark ? "text-[#C4B5FD]" : "text-[#7C3AED]"}`}>
        {badge}
      </p>
      <h2
        className={`mt-4 max-w-4xl text-4xl font-black leading-[1.03] [text-wrap:balance] sm:text-5xl lg:text-6xl ${
          dark ? "text-white" : "text-[#07030D]"
        }`}
      >
        {children}
      </h2>
      {copy ? (
        <p className={`mt-5 max-w-2xl text-base font-semibold leading-8 ${dark ? "text-white/62" : "text-[#6F657C]"}`}>
          {copy}
        </p>
      ) : null}
    </div>
  );
}

function ProductLabel({ children, icon, tone = "olive" }) {
  return (
    <div
      className={`flex items-center gap-2 text-xs font-black uppercase ${
        tone === "bronze" ? "text-[#6D28D9]" : "text-[#7C3AED]"
      }`}
    >
      {createElement(icon, { "aria-hidden": "true", className: "h-4 w-4" })}
      {children}
    </div>
  );
}

function OutcomeChallengeVisual() {
  return (
    <div className="experience-product-panel" data-story-reveal>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ProductLabel icon={Target}>Outcome challenge</ProductLabel>
        <Badge variant="primary">Ready for plans</Badge>
      </div>
      <h3 className="mt-8 max-w-xl text-3xl font-black leading-tight text-[#07030D]">
        Increase qualified pipeline by 30% in 45 days.
      </h3>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          ["Success metric", "+30% qualified pipeline"],
          ["Timeline", "45 days"],
          ["Proof required", "CRM report + source log"],
        ].map(([label, value]) => (
          <div className="border-t border-[#DDD6E8] pt-4" key={label}>
            <p className="text-xs font-black uppercase text-[#6F657C]">{label}</p>
            <p className="mt-2 text-sm font-black leading-6 text-[#07030D]">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center gap-3 border-t border-[#E9E2F3] pt-5">
        <ShieldCheck aria-hidden="true" className="h-5 w-5 text-[#7C3AED]" />
        <p className="text-sm font-bold text-[#6F657C]">Outcome, acceptance criteria, and proof are defined before work starts.</p>
      </div>
    </div>
  );
}

function ExecutionPlanVisual() {
  const plans = [
    { label: "Plan A", match: "94%", proof: "Strong", risk: "Low", timeline: "42d" },
    { label: "Plan B", match: "87%", proof: "Medium", risk: "Medium", timeline: "38d" },
    { label: "Plan C", match: "81%", proof: "Strong", risk: "Medium", timeline: "45d" },
  ];

  return (
    <div className="experience-product-panel" data-story-reveal>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ProductLabel icon={GitCompareArrows}>Execution comparison</ProductLabel>
        <Badge variant="secondary">3 structured plans</Badge>
      </div>
      <div className="mt-7 grid gap-3">
        {plans.map((plan, index) => (
          <div
            className={`grid gap-3 border p-4 sm:grid-cols-[minmax(0,1fr)_repeat(4,minmax(0,0.7fr))] sm:items-center ${
              index === 0 ? "border-[#A78BFA] bg-[#F5F3FF]" : "border-[#E9E2F3] bg-white"
            }`}
            key={plan.label}
          >
            <div>
              <p className="text-sm font-black text-[#07030D]">{plan.label}</p>
              <p className="mt-1 text-xs font-bold text-[#6F657C]">{index === 0 ? "Best visible fit" : "Execution option"}</p>
            </div>
            {[
              ["Match", plan.match],
              ["Proof", plan.proof],
              ["Risk", plan.risk],
              ["Timeline", plan.timeline],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[0.64rem] font-black uppercase text-[#6F657C]">{label}</p>
                <p className="mt-1 text-sm font-black text-[#07030D]">{value}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProofSystemVisual() {
  return (
    <div className="border border-white/12 bg-white/[0.045] p-5 backdrop-blur sm:p-7" data-story-reveal>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ProductLabel icon={ShieldCheck}>Proof verification flow</ProductLabel>
        <span className="text-xs font-black uppercase text-white/44">Evidence pipeline</span>
      </div>
      <div className="mt-8 grid gap-3">
        {proofFlow.map((item, index) => {
          const Icon = item.icon;
          return (
            <div className="relative flex items-center gap-4 border border-white/10 bg-white/[0.045] p-4" key={item.label}>
              <span className="grid h-11 w-11 shrink-0 place-items-center border border-[#C4B5FD]/25 bg-[#C4B5FD]/10 text-[#C4B5FD]">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-white">{item.label}</p>
                <p className="mt-1 text-xs font-bold text-white/42">{item.state}</p>
              </div>
              <span className="text-xs font-black text-[#C4B5FD]">0{index + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrustEngineVisual() {
  return (
    <div className="experience-product-panel grid gap-8 lg:grid-cols-[0.66fr_1.34fr] lg:items-center" data-story-reveal>
      <div className="mx-auto grid aspect-square w-full max-w-[16rem] place-items-center border border-[#A78BFA]/30 bg-[#F5F3FF]">
        <div className="grid h-[72%] w-[72%] place-items-center border border-[#7C3AED]/30 bg-white text-center shadow-[0_22px_60px_rgba(124,58,237,0.12)]">
          <Gauge aria-hidden="true" className="h-7 w-7 text-[#7C3AED]" />
          <div>
            <p className="text-5xl font-black text-[#7C3AED]">92</p>
            <p className="mt-1 text-xs font-black uppercase text-[#6F657C]">Proof Score</p>
          </div>
        </div>
      </div>
      <div className="grid gap-2">
        {trustSignals.map((signal) => (
          <div className="flex items-center justify-between gap-4 border-b border-[#E9E2F3] py-4" key={signal.label}>
            <p className="text-sm font-bold text-[#6F657C]">{signal.label}</p>
            <p className="text-right text-sm font-black text-[#07030D]">{signal.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchingVisual() {
  const nodes = [
    { icon: Target, label: "Challenge", position: "left-[4%] top-[14%]" },
    { icon: UsersRound, label: "Provider", position: "right-[4%] top-[14%]" },
    { icon: ClipboardCheck, label: "Execution plan", position: "left-[4%] bottom-[12%]" },
    { icon: FileCheck2, label: "Proof", position: "right-[4%] bottom-[12%]" },
  ];

  return (
    <div className="matching-visual" data-story-reveal>
      <div className="matching-core">
        <Sparkles aria-hidden="true" className="h-6 w-6 text-[#C4B5FD]" />
        <p className="mt-3 text-3xl font-black text-white">94%</p>
        <p className="mt-1 text-xs font-black uppercase text-white/45">Outcome fit</p>
      </div>
      {nodes.map((node) => {
        const Icon = node.icon;
        return (
          <div className={`matching-node ${node.position}`} key={node.label}>
            <Icon aria-hidden="true" className="h-5 w-5 text-[#7C3AED]" />
            <span>{node.label}</span>
          </div>
        );
      })}
      <span className="matching-line matching-line-a" />
      <span className="matching-line matching-line-b" />
      <span className="matching-line matching-line-c" />
      <span className="matching-line matching-line-d" />
    </div>
  );
}

function MarketplacePreview() {
  return (
    <div className="grid gap-4 lg:grid-cols-2" data-story-reveal>
      <article className="experience-market-card">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="primary">Challenge preview</Badge>
          <span className="text-xs font-black text-[#7C3AED]">Open</span>
        </div>
        <h3 className="mt-6 text-2xl font-black leading-tight text-[#07030D]">Build a measurable customer acquisition engine</h3>
        <p className="mt-3 text-sm font-semibold leading-7 text-[#6F657C]">Clear result, structured proof requirements, and a decision-ready execution plan workflow.</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="border-t border-[#E9E2F3] pt-3"><p className="text-xs font-black uppercase text-[#6F657C]">Timeline</p><p className="mt-2 text-sm font-black">45 days</p></div>
          <div className="border-t border-[#E9E2F3] pt-3"><p className="text-xs font-black uppercase text-[#6F657C]">Proof</p><p className="mt-2 text-sm font-black">Required</p></div>
        </div>
        <Button as="a" className="mt-7 w-full" href={ROUTES.CHALLENGES} variant="secondary">Explore challenges</Button>
      </article>
      <article className="experience-market-card bg-[#07030D] text-white">
        <div className="flex items-center justify-between gap-3">
          <Badge className="border-white/15 bg-white/10 text-[#EDE9FE]" variant="outline">Provider preview</Badge>
          <ShieldCheck aria-hidden="true" className="h-5 w-5 text-[#C4B5FD]" />
        </div>
        <h3 className="mt-6 text-2xl font-black leading-tight text-white">Proof-backed execution specialist</h3>
        <p className="mt-3 text-sm font-semibold leading-7 text-white/58">Compared by relevant outcomes, proof score, reliability, and plan quality.</p>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[["Proof", "92"], ["Outcomes", "18"], ["On time", "96%"]].map(([label, value]) => (
            <div className="border-t border-white/15 pt-3" key={label}><p className="text-[0.64rem] font-black uppercase text-white/42">{label}</p><p className="mt-2 text-sm font-black text-white">{value}</p></div>
          ))}
        </div>
        <Button as="a" className="mt-7 w-full border-white/20 bg-white/10 text-white hover:border-white/50 hover:bg-white/15 hover:text-white" href={ROUTES.PROVIDERS} variant="secondary">Explore providers</Button>
      </article>
    </div>
  );
}

export function ProofArenaStory() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <section className="bg-[#FBF9FF] py-20 sm:py-28 lg:py-36">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
            <SectionIntro
              badge="01 / The problem"
              copy="Traditional marketplaces optimize for activity. Serious work needs a system that makes execution quality visible before trust is given."
            >
              The old system asks clients to trust noise.
            </SectionIntro>
            <div className="grid gap-0 border-y border-[#DDD6E8]" data-story-reveal>
              {brokenSignals.map(([title, copy]) => (
                <div className="grid gap-3 border-b border-[#DDD6E8] py-5 last:border-b-0 sm:grid-cols-[0.8fr_1.2fr] sm:items-center" key={title}>
                  <div className="flex items-center gap-3">
                    <X aria-hidden="true" className="h-4 w-4 text-[#6D28D9]" />
                    <p className="font-black text-[#07030D]">{title}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#6F657C]">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#07030D] py-20 text-white sm:py-28 lg:py-36">
        <Container>
          <SectionIntro
            badge="02 / The shift"
            copy="A proof-based outcome economy turns scattered promises into a visible chain of decisions, execution, evidence, and earned reputation."
            dark
          >
            Stop hiring profiles. Start selecting execution.
          </SectionIntro>
          <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {shiftSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <MotionArticle
                  className="border-t border-white/16 pt-5"
                  key={step.title}
                  {...getRevealMotionProps(reduceMotion, { delay: index * 0.05 })}
                >
                  <div className="flex items-center justify-between">
                    <Icon aria-hidden="true" className="h-5 w-5 text-[#C4B5FD]" />
                    <span className="text-xs font-black text-white/32">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 text-xl font-black text-white">{step.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-7 text-white/50">{step.copy}</p>
                </MotionArticle>
              );
            })}
          </div>
          <div className="mt-14 h-px origin-left bg-[#C4B5FD]/45" data-story-line />
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-28 lg:py-36">
        <Container className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <SectionIntro
            badge="03 / Outcome challenges"
            copy="Clients define what success means before providers compete. The challenge becomes a decision contract, not a vague job post."
          >
            Begin with the result.
          </SectionIntro>
          <OutcomeChallengeVisual />
        </Container>
      </section>

      <section className="bg-[#F7F2FF] py-20 sm:py-28 lg:py-36">
        <Container className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <SectionIntro
            badge="04 / Execution plans"
            copy="Providers compete through milestone logic, risk awareness, proof strategy, and delivery clarity. Clients compare execution before making the decision."
          >
            Compare how the outcome will happen.
          </SectionIntro>
          <ExecutionPlanVisual />
        </Container>
      </section>

      <section className="bg-[#120A22] py-20 text-white sm:py-28 lg:py-36">
        <Container className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <SectionIntro
            badge="05 / Proof system"
            copy="Evidence is tied to the outcome and reviewed against defined requirements. Approved proof becomes the foundation of trust."
            dark
          >
            Proof is the product.
          </SectionIntro>
          <ProofSystemVisual />
        </Container>
      </section>

      <section className="bg-[#F8F4FF] py-20 sm:py-28 lg:py-36">
        <Container className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <SectionIntro
            badge="06 / Trust engine"
            copy="No stars. No popularity contest. Reputation grows from approved proof, completed outcomes, and reliable execution."
          >
            Trust that can explain itself.
          </SectionIntro>
          <TrustEngineVisual />
        </Container>
      </section>

      <section className="bg-[#07030D] py-20 text-white sm:py-28 lg:py-36">
        <Container className="grid gap-12 lg:grid-cols-[0.76fr_1.24fr] lg:items-center">
          <SectionIntro
            badge="07 / Smart matching"
            copy="Challenge requirements, provider history, execution plans, and proof signals connect to reveal visible outcome fit."
            dark
          >
            Matching built around the work.
          </SectionIntro>
          <MatchingVisual />
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-28 lg:py-36">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <SectionIntro
              badge="08 / Marketplace preview"
              copy="A marketplace designed around challenges, proof, execution plans, and earned trust instead of proposal volume."
            >
              An outcome economy, not a freelancer directory.
            </SectionIntro>
            <MarketplacePreview />
          </div>
        </Container>
      </section>
    </>
  );
}
