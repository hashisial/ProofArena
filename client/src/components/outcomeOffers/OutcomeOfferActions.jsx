import { useState } from "react";
import { Link } from "react-router-dom";
import { Archive, Eye, Pause, Pencil, Rocket, Trash2 } from "lucide-react";
import { ROUTES } from "../../constants/index.js";
import { Button } from "../ui/Button.jsx";
import { Modal } from "../ui/Modal.jsx";

export function OutcomeOfferActions({
  isArchiving = false,
  isDeleting = false,
  isPausing = false,
  isPublishing = false,
  offer,
  onArchive,
  onDelete,
  onPause,
  onPublish,
  showView = true,
}) {
  const [confirmAction, setConfirmAction] = useState(null);
  const offerId = offer?.id ?? offer?._id;
  const status = offer?.status ?? "draft";
  const canPublish = ["draft", "paused"].includes(status);
  const canPause = status === "published";
  const canArchive = status !== "archived";

  async function runConfirmedAction() {
    if (confirmAction === "archive") {
      await onArchive?.(offerId);
    }

    if (confirmAction === "delete") {
      await onDelete?.(offerId);
    }

    setConfirmAction(null);
  }

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {showView ? (
          <Button as={Link} className="w-full sm:w-auto" to={ROUTES.OWNER_OUTCOME_OFFER(offerId)} variant="secondary">
            <Eye aria-hidden="true" className="mr-2 h-4 w-4" />
            View
          </Button>
        ) : null}
        <Button as={Link} className="w-full sm:w-auto" to={ROUTES.EDIT_OUTCOME_OFFER(offerId)} variant="outline">
          <Pencil aria-hidden="true" className="mr-2 h-4 w-4" />
          Edit
        </Button>
        {canPublish ? (
          <Button
            className="w-full sm:w-auto"
            isLoading={isPublishing}
            loadingLabel="Publishing..."
            onClick={() => onPublish?.(offerId)}
            type="button"
          >
            <Rocket aria-hidden="true" className="mr-2 h-4 w-4" />
            Publish
          </Button>
        ) : null}
        {canPause ? (
          <Button
            className="w-full sm:w-auto"
            isLoading={isPausing}
            loadingLabel="Pausing..."
            onClick={() => onPause?.(offerId)}
            type="button"
            variant="secondary"
          >
            <Pause aria-hidden="true" className="mr-2 h-4 w-4" />
            Pause
          </Button>
        ) : null}
        {canArchive ? (
          <Button
            className="w-full sm:w-auto"
            isLoading={isArchiving}
            loadingLabel="Archiving..."
            onClick={() => setConfirmAction("archive")}
            type="button"
            variant="secondary"
          >
            <Archive aria-hidden="true" className="mr-2 h-4 w-4" />
            Archive
          </Button>
        ) : (
          <Button
            className="w-full sm:w-auto"
            isLoading={isDeleting}
            loadingLabel="Deleting..."
            onClick={() => setConfirmAction("delete")}
            type="button"
            variant="secondary"
          >
            <Trash2 aria-hidden="true" className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
      </div>
      <Modal
        description="This keeps existing client-facing safeguards in place and removes the offer from active management flows."
        footer={
          <>
            <Button onClick={() => setConfirmAction(null)} type="button" variant="secondary">
              Cancel
            </Button>
            <Button
              isLoading={isArchiving || isDeleting}
              loadingLabel="Working..."
              onClick={runConfirmedAction}
              type="button"
            >
              Confirm
            </Button>
          </>
        }
        isOpen={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        title={confirmAction === "delete" ? "Delete archived offer?" : "Archive outcome offer?"}
      >
        <p className="text-sm leading-6 text-[#78716C]">
          {confirmAction === "delete"
            ? "This action is only available after an offer has been archived."
            : "Archived offers are hidden from public discovery and can no longer be edited."}
        </p>
      </Modal>
    </>
  );
}
