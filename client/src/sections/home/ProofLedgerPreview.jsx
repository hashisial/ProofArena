import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  History,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../../components/Button.jsx";
import { Container } from "../../components/Container.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { getRevealMotionProps } from "../../utils/motion.js";
import { SectionHeader } from "./SectionHeader.jsx";

const MotionDiv = motion.div;

const proofRecords = [
  {
    category: "Real Estate Leads",
    proofType: "CRM sheet + appointment confirmations",
    result: "42 qualified seller leads reviewed",
    scoreImpact: "Proof score impact: +8",
    status: "Verified",
  },
  {
    category: "SaaS Development",
    proofType: "Live URL + Git commits + walkthrough",
    result: "Landing page launched with live demo",
    scoreImpact: "Proof score impact: +6",
    status: "Verified",
  },
  {
    category: "Customer Support",
    proofType: "Ticket reports + support dashboard",
    result: "Response time reduced under 2 minutes",
    scoreImpact: "Proof score impact: +7",
    status: "Verified",
  },
];

const pipeline = ["Submitted", "Reviewed", "Verified", "Added to proof history"];

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

function ProofRecordCard({ index, record, reduceMotion }) {
  return (
    <MotionDiv {...getMotionProps(reduceMotion, index * 0.06)}>
      <Card
        className="premium-motion-card group h-full transition duration-300 hover:-translate-y-1 hover:border-[#A78BFA] hover:shadow-[0_24px_76px_rgba(124, 58, 237, 0.14)]"
        padding="lg"
        variant="default"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED]">
              {record.category}
            </p>
            <h3 className="mt-3 text-xl font-black leading-tight text-[#07030D]">
              {record.result}
            </h3>
          </div>
          <Badge leftIcon={<BadgeCheck className="h-4 w-4" />} variant="primary">
            {record.status}
          </Badge>
        </div>

        <div className="mt-5 rounded-2xl border border-[#E9E2F3] bg-[#FCFAFF] p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">
            Proof type
          </p>
          <p className="mt-2 text-sm font-bold leading-6 text-[#27272A]">
            {record.proofType}
          </p>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#EDE9FE] bg-[#F8F4FF] p-4">
          <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#7C3AED]" />
          <p className="text-sm font-black leading-6 text-[#5B21B6]">
            {record.scoreImpact}
          </p>
        </div>
      </Card>
    </MotionDiv>
  );
}

export function ProofLedgerPreview() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F4FF_46%,#F5F3FF_100%)] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_18%_12%,rgba(124, 58, 237, 0.14),transparent_34%),radial-gradient(circle_at_86%_66%,rgba(167, 139, 250, 0.12),transparent_30%)]" />
      <Container className="relative z-10">
        <MotionDiv {...getMotionProps(reduceMotion, 0)}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end">
            <SectionHeader
              badge="Trust system"
              description="ProofArena connects verified delivery records with provider reputation so clients can choose based on evidence."
              title="Proof records and rankings built around real execution."
            />

            <div className="premium-motion-card rounded-3xl border border-[#E9E2F3] bg-[#FCFAFF] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F5F3FF] text-[#5B21B6]">
                  <History aria-hidden="true" className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black text-[#07030D]">
                    Preview workflow
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#6F657C]">
                    The examples below are product previews that show how proof
                    could move from submission to verified reputation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </MotionDiv>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <MotionDiv {...getMotionProps(reduceMotion, 0.08)}>
            <div>
              <Badge variant="primary">Proof Ledger</Badge>
              <h2 className="mt-4 text-3xl font-black leading-tight text-[#07030D] sm:text-4xl">
                Verified proof becomes reputation.
              </h2>
              <p className="mt-4 text-base leading-8 text-[#6F657C] sm:text-lg">
                Every completed outcome can generate proof records that show
                what was delivered, how it was verified, and why the provider
                earned reputation.
              </p>

              <div className="mt-8 rounded-3xl border border-[#E9E2F3] bg-white p-5 shadow-[0_20px_64px_rgba(31, 14, 54, 0.06)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F5F3FF] text-[#5B21B6]">
                      <FileCheck2 aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-black text-[#07030D]">Proof status pipeline</p>
                      <p className="text-sm leading-6 text-[#6F657C]">Submitted evidence becomes history after review.</p>
                    </div>
                  </div>
                  <Badge variant="green">Audit trail</Badge>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {pipeline.map((step, index) => (
                    <div className="premium-motion-row relative rounded-2xl border border-[#E9E2F3] bg-[#FCFAFF] p-4" key={step}>
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-sm font-black text-[#5B21B6]">
                        {index + 1}
                      </span>
                      <p className="mt-3 text-sm font-black leading-6 text-[#27272A]">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button as="a" className="w-full sm:w-auto" href={ROUTES.PROOF_LEDGER}>
                  Explore Proof Ledger
                  <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
                </Button>
                <Button as="a" className="w-full sm:w-auto" href={ROUTES.REGISTER} variant="secondary">
                  Create a Challenge
                </Button>
              </div>
            </div>
          </MotionDiv>

          <div className="grid gap-5">
            {proofRecords.map((record, index) => (
              <ProofRecordCard
                index={index}
                key={record.category}
                record={record}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-3xl border border-[#E9E2F3] bg-[#FCFAFF] p-5">
          <ClipboardCheck aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#7C3AED]" />
          <p className="text-sm font-semibold leading-7 text-[#6F657C]">
            These records are preview examples. Live proof records should come
            from reviewed submissions, not marketing claims.
          </p>
        </div>
      </Container>
    </section>
  );
}
