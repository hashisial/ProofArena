import { useState } from "react";
import { Button } from "../ui/Button.jsx";
import { Modal } from "../ui/Modal.jsx";
import { Textarea } from "../ui/Textarea.jsx";

export function AdminActionModal({
  actionLabel,
  description,
  error,
  isOpen,
  isPending,
  onClose,
  onConfirm,
  reasonEnabled = true,
  resourceLabel,
}) {
  const [reason, setReason] = useState("");

  return (
    <Modal
      description={description}
      footer={
        <>
          <Button disabled={isPending} onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button
            isLoading={isPending}
            loadingLabel="Updating..."
            onClick={() => onConfirm(reason)}
            type="button"
          >
            {actionLabel}
          </Button>
        </>
      }
      isOpen={isOpen}
      onClose={onClose}
      title={`${actionLabel}: ${resourceLabel}`}
    >
      {reasonEnabled ? (
        <Textarea
          helperText="Optional. This note is stored in the moderation audit record."
          label="Moderation reason"
          maxLength={1000}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Add context for this moderation decision..."
          value={reason}
        />
      ) : null}
      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </Modal>
  );
}
