import {
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  FileCheck2,
  GraduationCap,
  Lightbulb,
  Medal,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Modal } from "../ui/Modal.jsx";

const sectionGroups = [
  {
    items: [
      ["About", "Tell visitors what outcomes you help deliver.", UserRound],
      ["Experience", "Add professional roles and delivery history.", BriefcaseBusiness],
      ["Education", "Show relevant learning and credentials.", GraduationCap],
      ["Skills", "Highlight proof-relevant capabilities.", Wrench],
    ],
    title: "Core",
  },
  {
    items: [
      ["Services", "Describe the measurable work you can provide.", Sparkles],
      ["Verified outcomes", "Show completed challenge records.", FileCheck2],
      ["Portfolio proof", "Attach evidence-backed work samples.", Lightbulb],
      ["Provider availability", "Show what work you are open to.", BadgeCheck],
    ],
    title: "ProofArena",
  },
  {
    items: [
      ["Verification badge", "Start trust and identity checks.", ShieldCheck],
      ["Recommendations", "Prepare future social proof.", Medal],
      ["Certifications", "Add professional credentials.", Award],
    ],
    title: "Trust",
  },
];

export function AddSectionModal({ onClose, open = false }) {
  return (
    <Modal
      description="Strengthen your ProofArena profile by adding proof-focused professional details."
      footer={
        <Button onClick={onClose} type="button">
          Done
        </Button>
      }
      isOpen={open}
      onClose={onClose}
      size="xl"
      title="Add profile section"
    >
      <div className="grid gap-6">
        {sectionGroups.map((group) => (
          <section className="grid gap-3" key={group.title}>
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-[#7C3AED]">
              {group.title}
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {group.items.map(([title, description, icon]) => {
                const SectionIcon = icon;

                return (
                  <div
                    className="rounded-2xl border border-[#E9E2F3] bg-white p-4 transition hover:border-[#A78BFA] hover:shadow-[0_18px_48px_rgba(124, 58, 237, 0.1)]"
                    key={`${group.title}-${title}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F5F3FF] text-[#5B21B6]">
                        <SectionIcon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-[#07030D]">{title}</p>
                        <p className="mt-1 text-sm leading-6 text-[#6F657C]">{description}</p>
                      </div>
                    </div>
                    <Button className="mt-4 w-full" onClick={onClose} type="button" variant="secondary">
                      Add
                    </Button>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </Modal>
  );
}
