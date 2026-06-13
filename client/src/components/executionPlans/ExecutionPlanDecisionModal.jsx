import { useState } from "react";
import { getExecutionPlanApiErrorMessage } from "../../features/executionPlans/executionPlanUtils.js";
import { Button } from "../ui/Button.jsx";
import { Modal } from "../ui/Modal.jsx";
import { Select } from "../ui/Select.jsx";
import { Textarea } from "../ui/Textarea.jsx";

const copy = {
  accept: {
    confirm: "Accept Plan",
    description: "This will select this provider for the challenge. Payments, milestone workspace, and proof review will connect in later stages.",
    field: "Acceptance note",
    title: "Accept this execution plan?",
  },
  reject: {
    confirm: "Reject Plan",
    description: "Rejecting removes this plan from active review while keeping the decision record clear.",
    field: "Additional note",
    title: "Reject this execution plan?",
  },
  shortlist: {
    confirm: "Shortlist Plan",
    description: "Shortlisting keeps this provider visible for closer comparison before accepting one plan.",
    field: "Shortlist note",
    title: "Shortlist this provider?",
  },
};

const rejectionReasonOptions = [
  { label: "Plan not clear", value: "Plan not clear" },
  { label: "Price too high", value: "Price too high" },
  { label: "Timeline does not fit", value: "Timeline does not fit" },
  { label: "Missing proof plan", value: "Missing proof plan" },
  { label: "Provider not suitable", value: "Provider not suitable" },
  { label: "Other", value: "Other" },
];

function DecisionModalBody({
  content,
  isLoading = false,
  mode = "shortlist",
  onClose,
  onConfirm,
  plan,
}) {
  const [note, setNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");

  async function handleConfirm() {
    if (mode === "reject" && !rejectionReason.trim()) {
      setError("Choose a rejection reason before confirming.");
      return;
    }

    try {
      if (mode === "reject") {
        const reason = [rejectionReason.trim(), note.trim()].filter(Boolean).join(": ");
        await onConfirm?.({ rejectionReason: reason });
      } else {
        await onConfirm?.({ note: note.trim() });
      }
    } catch (confirmError) {
      setError(getExecutionPlanApiErrorMessage(confirmError, "Decision could not be saved. Please try again."));
    }
  }

  return (
    <>
      {plan ? (
        <div className="mb-4 rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4">
          <p className="text-sm font-black text-[#1C1917]">{plan.title}</p>
          <p className="mt-1 text-sm leading-6 text-[#78716C]">{plan.summary}</p>
        </div>
      ) : null}
      {mode === "accept" ? (
        <div className="mb-4 rounded-2xl border border-[#A16207]/25 bg-[#FEFCE8] p-4 text-sm leading-6 text-[#57534E]">
          Accepting a plan does not trigger payment, messaging, milestone workspace, or proof review. It only records the selected provider for this challenge.
        </div>
      ) : null}
      {mode === "reject" ? (
        <div className="mb-4">
          <Select
            error={error}
            label="Rejection reason"
            onChange={(event) => {
              setRejectionReason(event.target.value);
              setError("");
            }}
            options={rejectionReasonOptions}
            value={rejectionReason}
          />
        </div>
      ) : null}
      <Textarea
        error={mode === "reject" ? undefined : error}
        label={content.field}
        onChange={(event) => {
          setNote(event.target.value);
          setError("");
        }}
        placeholder={mode === "reject" ? "Optional context for the provider." : "Optional note for this decision."}
        rows={4}
        value={note}
      />
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button disabled={isLoading} onClick={onClose} type="button" variant="secondary">
          Cancel
        </Button>
        <Button isLoading={isLoading} loadingLabel="Saving..." onClick={handleConfirm} type="button">
          {content.confirm}
        </Button>
      </div>
    </>
  );
}

export function ExecutionPlanDecisionModal({
  isLoading = false,
  isOpen,
  mode = "shortlist",
  onClose,
  onConfirm,
  plan,
}) {
  const content = copy[mode] ?? copy.shortlist;

  return (
    <Modal
      description={content.description}
      isOpen={isOpen}
      onClose={onClose}
      title={content.title}
    >
      <DecisionModalBody
        key={`${mode}-${plan?.id ?? "none"}-${isOpen ? "open" : "closed"}`}
        content={content}
        isLoading={isLoading}
        mode={mode}
        onClose={onClose}
        onConfirm={onConfirm}
        plan={plan}
      />
    </Modal>
  );
}
