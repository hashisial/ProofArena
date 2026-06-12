import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  ShieldCheck,
  Target,
} from "lucide-react";
import { Button } from "../../components/Button.jsx";
import { Container } from "../../components/Container.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { getRevealMotionProps, slideInRight } from "../../utils/motion.js";

const MotionDiv = motion.div;

const panels = [
  {
    accentBadge: "Outcome target",
    badge: "For clients",
    bullets: [
      "Create measurable outcome challenges",
      "Define proof requirements before work starts",
      "Compare structured execution plans",
      "Track delivery through milestones",
      "Approve proof before reputation grows",
    ],
    cta: "Create a Challenge",
    description:
      "Post a measurable challenge, compare execution plans with less guesswork, track milestones, and approve proof before completion.",
    example: "30 qualified seller leads in 30 days",
    href: ROUTES.REGISTER,
    icon: Target,
    previewIcon: ClipboardCheck,
    previewRows: ["Define outcome", "Compare plans", "Track milestones", "Verify proof"],
    previewTitle: "Client workflow",
    secondaryCta: "Explore Challenges",
    secondaryHref: ROUTES.CHALLENGES,
    title: "For clients who need results, not promises.",
  },
  {
    accentBadge: "Verified proof",
    badge: "For providers",
    bullets: [
      "Package skills into outcome offers",
      "Get matched with relevant challenges",
      "Submit structured execution plans",
      "Deliver milestones with visible progress",
      "Grow proof score from approved proof",
    ],
    cta: "Become a Provider",
    description:
      "ProofArena helps providers turn skill into outcome offers, receive relevant challenge matches, and build reputation from approved work.",
    example: "Proof Score: 92",
    href: ROUTES.REGISTER,
    icon: BadgeCheck,
    previewIcon: Gauge,
    previewRows: [
      "Execution plan submitted",
      "Milestones completed",
      "Proof approved",
      "Proof score increased",
    ],
    previewTitle: "Provider reputation",
    secondaryCta: "Explore Providers",
    secondaryHref: ROUTES.PROVIDERS,
    title: "For providers who want clients without endless chasing.",
  },
];

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

function PreviewCard({ panel, provider = false }) {
  const PreviewIcon = panel.previewIcon;

  return (
    <div className="mt-7 rounded-[1.5rem] border border-[#E7E5E4] bg-white p-4 shadow-[0_16px_48px_rgba(28, 25, 23, 0.05)] sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314]">
            <PreviewIcon aria-hidden="true" className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-base font-black text-[#1C1917]">{panel.previewTitle}</p>
            <p className="mt-1 break-words text-sm font-bold leading-6 text-[#57534E]">{panel.example}</p>
          </div>
        </div>
        <Badge variant={provider ? "green" : "primary"}>{panel.accentBadge}</Badge>
      </div>

      {provider ? (
        <div className="mt-5 rounded-2xl border border-[#ECFCCB] bg-[#FFFBEB] p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">
              Proof score
            </span>
            <span className="text-lg font-black text-[#1C1917]">92</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#ECFCCB]">
            <div className="h-full w-[92%] rounded-full bg-[#3F6212]" />
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-[#ECFCCB] bg-[#FFFBEB] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">
              Proof requirement
            </span>
            <Badge variant="primary">CRM + confirmations</Badge>
          </div>
        </div>
      )}

      <div className="mt-4 grid gap-3">
        {panel.previewRows.map((row, index) => (
          <div className="flex items-center gap-3 rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-3" key={row}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-xs font-black text-[#365314]">
              {index + 1}
            </span>
            <span className="min-w-0 text-sm font-black leading-6 text-[#1C1917]">{row}</span>
            {index >= 2 ? (
              <CheckCircle2 aria-hidden="true" className="ml-auto h-4 w-4 shrink-0 text-[#3F6212]" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ClientProviderSplitSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#FFFBEB] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_18%_12%,rgba(63, 98, 18, 0.13),transparent_34%),radial-gradient(circle_at_88%_74%,rgba(101, 163, 13, 0.12),transparent_28%)]" />
      <Container className="relative z-10">
        <MotionDiv {...getMotionProps(reduceMotion, 0)}>
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="primary">Built for both sides of execution</Badge>
            <h2 className="mt-4 break-words text-3xl font-black leading-tight text-[#1C1917] [text-wrap:balance] sm:text-4xl lg:text-5xl">
              Clients get clarity. Providers get matched by proof.
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#57534E] sm:text-lg">
              ProofArena connects measurable business goals with providers who
              can turn skill into outcome offers, structured plans, and verified proof.
            </p>
          </div>
        </MotionDiv>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {panels.map((panel, index) => {
            const Icon = panel.icon;
            const isProvider = index === 1;

            return (
              <MotionDiv
                key={panel.badge}
                {...getRevealMotionProps(reduceMotion, {
                  delay: 0.08 + index * 0.08,
                  variant: isProvider ? slideInRight : undefined,
                })}
              >
                <Card
                  className={`premium-motion-card group h-full border-[#E7E5E4] transition duration-300 hover:-translate-y-1 hover:border-[#65A30D] hover:shadow-[0_28px_86px_rgba(63, 98, 18, 0.16)] ${
                    isProvider
                      ? "bg-[linear-gradient(135deg,#FFFFFF_0%,#FFFBEB_54%,#F7FEE7_100%)]"
                      : "bg-white"
                  }`}
                  padding="lg"
                  variant="elevated"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314] transition group-hover:bg-[#3F6212] group-hover:text-white">
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <Badge variant="primary">{panel.badge}</Badge>
                  </div>

                  <h2 className="mt-6 break-words text-3xl font-black leading-tight text-[#1C1917] [text-wrap:balance] sm:text-4xl">
                    {panel.title}
                  </h2>
                  <p className="mt-4 text-sm font-semibold leading-7 text-[#57534E] sm:text-base">
                    {panel.description}
                  </p>

                  <ul className="mt-6 grid gap-3">
                    {panel.bullets.map((bullet) => (
                      <li className="flex items-start gap-3" key={bullet}>
                        <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#3F6212]" />
                        <span className="text-sm font-semibold leading-7 text-[#44403C]">{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <PreviewCard panel={panel} provider={isProvider} />

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Button as="a" className="w-full sm:w-auto" href={panel.href} variant={isProvider ? "secondary" : "primary"}>
                      {panel.cta}
                      <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
                    </Button>
                    <a
                      className="inline-flex min-h-12 w-full max-w-full items-center justify-center rounded-full border border-[#E7E5E4] bg-white px-4 text-center text-sm font-black text-[#365314] transition hover:-translate-y-0.5 hover:border-[#65A30D] hover:bg-[#F7FEE7] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70 sm:w-auto"
                      href={panel.secondaryHref}
                    >
                      {panel.secondaryCta}
                    </a>
                  </div>
                </Card>
              </MotionDiv>
            );
          })}
        </div>

        <MotionDiv
          className="mt-8 flex items-start gap-3 rounded-3xl border border-[#E7E5E4] bg-white p-5 shadow-[0_16px_50px_rgba(28, 25, 23, 0.04)]"
          {...getMotionProps(reduceMotion, 0.22)}
        >
          <ShieldCheck aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#3F6212]" />
          <p className="text-sm font-semibold leading-7 text-[#57534E]">
            These role flows are product previews. Real challenge activity, proof review,
            and provider reputation are handled by connected ProofArena workflows.
          </p>
        </MotionDiv>
      </Container>
    </section>
  );
}
