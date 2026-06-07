import { useState } from "react";
import { LOST_REASON_OPTIONS } from "../../features/opportunities/opportunityUtils.js";
import { Button } from "../ui/Button.jsx";
import { Modal } from "../ui/Modal.jsx";
import { Select } from "../ui/Select.jsx";
import { Textarea } from "../ui/Textarea.jsx";

export function LostReasonModal({
  isOpen,
  isSubmitting = false,
  onClose,
  onConfirm,
  opportunity,
}) {
  const [lostReason, setLostReason] = useState("client_chose_other");
  const [lostNote, setLostNote] = useState("");

  async function handleConfirm() {
    await onConfirm?.({
      lostNote,
      lostReason,
      stage: "lost",
    });
    setLostNote("");
    setLostReason("client_chose_other");
  }

  return (
    <Modal
      description={opportunity?.title ? `Record why "${opportunity.title}" was lost.` : "Record why this opportunity was lost."}
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Mark opportunity lost"
    >
      <div className="grid gap-4">
        <Select
          label="Lost reason"
          onChange={(event) => setLostReason(event.target.value)}
          options={LOST_REASON_OPTIONS}
          placeholder=""
          required
          value={lostReason}
        />
        <Textarea
          label="Lost note"
          onChange={(event) => setLostNote(event.target.value)}
          placeholder="Add context you may want to review later."
          rows={4}
          value={lostNote}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button isLoading={isSubmitting} loadingLabel="Saving..." onClick={handleConfirm} type="button">
            Mark Lost
          </Button>
        </div>
      </div>
    </Modal>
  );
}
