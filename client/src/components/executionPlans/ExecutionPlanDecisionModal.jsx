import { useState } from "react";
import { getExecutionPlanApiErrorMessage } from "../../features/executionPlans/executionPlanUtils.js";
import { Button } from "../ui/Button.jsx";
import { Modal } from "../ui/Modal.jsx";
import { Textarea } from "../ui/Textarea.jsx";

const copy = {
  accept: {
    confirm: "Accept Plan",
    description: "This will mark this provider as selected for the challenge. Milestone workspace will be connected in a later stage.",
    field: "Accepted note",
    title: "Accept execution plan",
  },
  reject: {
    confirm: "Reject Plan",
    description: "Give a clear reason so the provider understands the decision.",
    field: "Rejection reason",
    title: "Reject execution plan",
  },
  shortlist: {
    confirm: "Shortlist Plan",
    description: "Shortlisting keeps this plan visible for closer comparison.",
    field: "Shortlist note",
    title: "Shortlist execution plan",
  },
};

function DecisionModalBody({
  content,
  isLoading = false,
  mode = "shortlist",
  onClose,
  onConfirm,
  plan,
}) {
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  async function handleConfirm() {
    if (mode === "reject" && !note.trim()) {
      setError("Add a rejection reason before confirming.");
      return;
    }

    try {
      await onConfirm?.(mode === "reject" ? { rejectionReason: note.trim() } : { note: note.trim() });
    } catch (confirmError) {
      setError(getExecutionPlanApiErrorMessage(confirmError, "Decision could not be saved. Please try again."));
    }
  }

  return (
    <>
      {plan ? (
        <div className="mb-4 rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4">
          <p className="text-sm font-black text-[#1C1917]">{plan.title}</p>
          <p className="mt-1 text-sm leading-6 text-[#78716C]">{plan.summary}</p>
        </div>
      ) : null}
      <Textarea
        error={error}
        label={content.field}
        onChange={(event) => {
          setNote(event.target.value);
          setError("");
        }}
        placeholder={mode === "reject" ? "Explain why this plan is not the right fit." : "Optional note for this decision."}
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
