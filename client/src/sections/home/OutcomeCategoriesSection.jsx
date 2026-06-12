import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Code2,
  Globe2,
  Headphones,
  Megaphone,
  Settings2,
  UserCheck,
} from "lucide-react";
import { Button } from "../../components/Button.jsx";
import { Container } from "../../components/Container.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { getRevealMotionProps } from "../../utils/motion.js";
import { SectionHeader } from "./SectionHeader.jsx";

const MotionDiv = motion.div;

const categories = [
  {
    badge: "Growth",
    cta: "Explore lead outcomes",
    description:
      "Launch seller lead, buyer lead, appointment-setting, and CRM-ready pipeline challenges.",
    example: "30 qualified seller leads in 30 days",
    icon: Building2,
    proofExamples: ["Lead sheet", "CRM screenshots", "Appointment confirmations"],
    slug: "real-estate-lead-generation",
    title: "Real Estate Lead Generation",
  },
  {
    badge: "Product delivery",
    cta: "Explore SaaS outcomes",
    description:
      "Turn software workflows, MVP modules, dashboards, and landing pages into measurable delivery challenges.",
    example: "Launch MVP dashboard with auth and admin panel",
    icon: Code2,
    proofExamples: ["Live URL", "Git commits", "Demo walkthrough"],
    slug: "saas-product-delivery",
    title: "SaaS Product Delivery",
  },
  {
    badge: "Support ops",
    cta: "Explore support outcomes",
    description:
      "Build support workflows for exchanges, wallets, crypto cards, communities, and Web3 products.",
    example: "Reduce support response time under 2 minutes",
    icon: Headphones,
    proofExamples: ["Ticket reports", "Moderation logs", "Response dashboard"],
    slug: "crypto-support-operations",
    title: "Crypto Support Operations",
  },
  {
    badge: "Automation",
    cta: "Explore automation outcomes",
    description:
      "Create repeatable automation pipelines, CRM workflows, outreach systems, and reporting dashboards.",
    example: "Build automated outreach workflow with reporting dashboard",
    icon: Settings2,
    proofExamples: ["Automation logs", "CRM screenshots", "Dashboard link"],
    slug: "crm-automation",
    title: "CRM & Automation",
  },
  {
    badge: "Development",
    cta: "Explore development outcomes",
    description:
      "Launch premium websites, apps, dashboards, forms, and production-ready frontend/backend workflows.",
    example: "Build responsive landing page with contact flow",
    icon: Globe2,
    proofExamples: ["Live URL", "Screenshots", "Deployment report"],
    slug: "website-app-development",
    title: "Website/App Development",
  },
  {
    badge: "Operations",
    cta: "Explore VA outcomes",
    description:
      "Create measurable VA workflows for inbox handling, CRM updates, reporting, scheduling, and operations.",
    example: "500 leads processed into CRM weekly",
    icon: UserCheck,
    proofExamples: ["Work logs", "CRM updates", "Daily reports"],
    slug: "virtual-assistant-workflows",
    title: "Virtual Assistant Workflows",
  },
  {
    badge: "Marketing",
    cta: "Explore marketing outcomes",
    description:
      "Structure campaigns, outreach, content workflows, and growth tasks around measurable delivery.",
    example: "Launch 4-week outreach campaign with weekly reports",
    icon: Megaphone,
    proofExamples: ["Campaign reports", "Outreach logs", "Analytics screenshots"],
    slug: "marketing-execution",
    title: "Marketing Execution",
  },
  {
    badge: "Consulting",
    cta: "Explore consulting outcomes",
    description:
      "Work with operators who can diagnose, plan, execute, and prove business improvement outcomes.",
    example: "Audit and improve sales workflow with documented proof",
    icon: BriefcaseBusiness,
    proofExamples: ["Audit report", "Workflow map", "Implementation proof"],
    slug: "proof-based-consulting",
    title: "Proof-Based Consulting",
  },
];

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

function getChallengeCategoryHref(slug) {
  const search = new URLSearchParams();
  search.set("category", slug);

  return `${ROUTES.CHALLENGES}?${search.toString()}`;
}

export function OutcomeCategoriesSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24" id="outcome-categories">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_15%_14%,rgba(63, 98, 18, 0.1),transparent_32%),radial-gradient(circle_at_85%_78%,rgba(101, 163, 13, 0.12),transparent_28%)]" />
      <Container className="relative z-10">
        <MotionDiv {...getMotionProps(reduceMotion, 0)}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-end">
            <SectionHeader
              badge="Outcome categories"
              description="Choose the result you want, then compare providers by plan quality, proof requirements, and reputation."
              title="Explore outcome categories."
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
              <Button as="a" className="w-full sm:w-auto" href={ROUTES.CHALLENGES}>
                Explore Challenges
                <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
              </Button>
              <Button as="a" className="w-full sm:w-auto" href={ROUTES.REGISTER} variant="secondary">
                Become a Provider
              </Button>
            </div>
          </div>
        </MotionDiv>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <MotionDiv key={category.title} {...getMotionProps(reduceMotion, 0.06 + index * 0.04)}>
                <Card
                  className="premium-motion-card group flex h-full flex-col transition duration-300 hover:-translate-y-1 hover:border-[#65A30D] hover:shadow-[0_26px_82px_rgba(63, 98, 18, 0.16)]"
                  padding="lg"
                  variant="default"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314] transition group-hover:bg-[#3F6212] group-hover:text-white">
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <Badge variant="primary">{category.badge}</Badge>
                  </div>
                  <h3 className="mt-6 break-words text-xl font-black leading-tight text-[#1C1917]">
                    {category.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#57534E]">{category.description}</p>
                  <div className="mt-5 rounded-2xl border border-[#ECFCCB] bg-[#FFFBEB] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
                      Example outcome
                    </p>
                    <p className="mt-2 text-sm font-black leading-6 text-[#1C1917]">
                      {category.example}
                    </p>
                  </div>
                  <div className="mt-4 rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">
                      Proof examples
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {category.proofExamples.map((proof) => (
                        <span
                          className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-[#E7E5E4] bg-white px-3 py-2 text-xs font-black leading-5 text-[#44403C]"
                          key={proof}
                        >
                          <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#3F6212]" />
                          {proof}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    className="mt-auto inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#3F6212]/25 bg-[#3F6212]/5 px-4 py-2 text-center text-sm font-black text-[#365314] transition hover:border-[#3F6212] hover:bg-[#3F6212] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70"
                    href={getChallengeCategoryHref(category.slug)}
                  >
                    {category.cta}
                    <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
                  </a>
                </Card>
              </MotionDiv>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
