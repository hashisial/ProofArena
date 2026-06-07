import { motion, useReducedMotion } from "framer-motion";
import { Edit3, Plus } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { cn } from "../../utils/cn.js";

function SectionAction({ ariaLabel, children, onClick }) {
  return (
    <button
      aria-label={ariaLabel}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E9E2F3] bg-white text-[#493C5E] transition hover:-translate-y-0.5 hover:border-[#7C3AED]/40 hover:bg-[#F5F3FF] hover:text-[#5B21B6] hover:shadow-[0_14px_34px_rgba(124, 58, 237, 0.14)] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/10"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function ProfileSection({
  action,
  addLabel,
  children,
  className = "",
  description,
  editLabel,
  empty = false,
  emptyActionText,
  emptyDescription,
  emptyTitle,
  isOwner = false,
  onAdd,
  onEdit,
  subtitle,
  title,
}) {
  const reduceMotion = useReducedMotion();
  const supportingText = subtitle ?? description;
  const actionControls = isOwner ? (
    <div className="flex shrink-0 items-center gap-2">
      {action}
      {onAdd ? (
        <SectionAction ariaLabel={addLabel || `Add ${title}`} onClick={onAdd}>
          <Plus aria-hidden="true" className="h-4 w-4" />
        </SectionAction>
      ) : null}
      {onEdit ? (
        <SectionAction ariaLabel={editLabel || `Edit ${title}`} onClick={onEdit}>
          <Edit3 aria-hidden="true" className="h-4 w-4" />
        </SectionAction>
      ) : null}
    </div>
  ) : null;

  return (
    <Card
      as={motion.section}
      className={cn(
        "rounded-3xl border-[#E9E2F3] bg-white shadow-[0_18px_58px_rgba(31, 14, 54, 0.07)] transition hover:border-[#C4B5FD]/70 hover:shadow-[0_24px_72px_rgba(124, 58, 237, 0.12)]",
        className,
      )}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      padding="lg"
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ amount: 0.18, once: true }}
      variant="default"
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-[#07030D]">
            {title}
          </h2>
          {supportingText ? (
            <p className="mt-1 text-sm leading-6 text-[#6F657C]">{supportingText}</p>
          ) : null}
        </div>
        {actionControls}
      </div>
      <div className="mt-5">
        {empty ? (
          <EmptyState
            actionText={isOwner ? emptyActionText : undefined}
            className="border-dashed"
            description={emptyDescription}
            onAction={onAdd || onEdit}
            size="sm"
            title={emptyTitle || `No ${title.toLowerCase()} added yet`}
            variant={isOwner ? "spotlight" : "bordered"}
          />
        ) : (
          children
        )}
      </div>
    </Card>
  );
}
