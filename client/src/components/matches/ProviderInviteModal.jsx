import { useState } from "react";
import { Textarea } from "../ui/Textarea.jsx";
import { Button } from "../ui/Button.jsx";
import { Modal } from "../ui/Modal.jsx";

export function ProviderInviteModal({
  challenge,
  isOpen,
  match,
  onClose,
}) {
  const [message, setMessage] = useState("");
  const providerName = match?.provider?.fullName || match?.provider?.username || "this provider";
  const challengeTitle = challenge?.title || "this challenge";

  return (
    <Modal
      description="Invite foundation only. Messaging and invite delivery will be connected in a later stage."
      footer={
        <>
          <Button onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button disabled title="The current backend does not expose an invite mutation yet." type="button">
            Invite backend pending
          </Button>
        </>
      }
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Provider"
    >
      <div className="grid gap-4">
        <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4">
          <p className="text-sm font-bold leading-6 text-[#44403C]">
            This will invite <span className="font-black text-[#1C1917]">{providerName}</span> to review{" "}
            <span className="font-black text-[#1C1917]">{challengeTitle}</span> and submit an execution plan once the invite workflow is connected.
          </p>
        </div>
        <Textarea
          helperText="Stored locally in this modal only for now. No message is sent by this prompt."
          label="Optional invite message"
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Briefly explain why this provider looks like a fit."
          rows={4}
          value={message}
        />
        <p className="text-sm leading-6 text-[#78716C]">
          The current match status endpoint allows viewed, saved, and dismissed. It does not accept invited yet, so this UI does not fake an invite or mutate unsupported status.
        </p>
      </div>
    </Modal>
  );
}
