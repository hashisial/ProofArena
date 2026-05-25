import { useState } from "react";
import { Link } from "react-router-dom";
import { Archive, Eye, Pause, Pencil, Rocket, SquareX } from "lucide-react";
import { ROUTES } from "../../constants/index.js";
import { Button } from "../ui/Button.jsx";
import { Modal } from "../ui/Modal.jsx";

export function ChallengeActions({
  challenge,
  isArchiving = false,
  isClosing = false,
  isPausing = false,
  isPublishing = false,
  onArchive,
  onClose,
  onPause,
  onPublish,
  showView = true,
}) {
  const [confirmAction, setConfirmAction] = useState(null);
  const challengeId = challenge?.id ?? challenge?._id;
  const status = challenge?.status ?? "draft";
  const canPublish = ["draft", "paused"].includes(status);
  const canPause = ["open", "reviewing_plans"].includes(status);
  const canClose = !["archived", "cancelled", "completed"].includes(status);
  const canArchive = status !== "archived";

  async function runConfirmedAction() {
    if (confirmAction === "close") {
      await onClose?.(challengeId);
    }

    if (confirmAction === "archive") {
      await onArchive?.(challengeId);
    }

    setConfirmAction(null);
  }

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {showView ? (
          <Button as={Link} className="w-full sm:w-auto" to={ROUTES.OWNER_CHALLENGE(challengeId)} variant="secondary">
            <Eye aria-hidden="true" className="mr-2 h-4 w-4" />
            View
          </Button>
        ) : null}
        <Button as={Link} className="w-full sm:w-auto" to={ROUTES.EDIT_CHALLENGE(challengeId)} variant="outline">
          <Pencil aria-hidden="true" className="mr-2 h-4 w-4" />
          Edit
        </Button>
        {canPublish ? (
          <Button
            className="w-full sm:w-auto"
            isLoading={isPublishing}
            loadingLabel="Publishing..."
            onClick={() => onPublish?.(challengeId)}
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
            onClick={() => onPause?.(challengeId)}
            type="button"
            variant="secondary"
          >
            <Pause aria-hidden="true" className="mr-2 h-4 w-4" />
            Pause
          </Button>
        ) : null}
        {canClose ? (
          <Button
            className="w-full sm:w-auto"
            isLoading={isClosing}
            loadingLabel="Closing..."
            onClick={() => setConfirmAction("close")}
            type="button"
            variant="secondary"
          >
            <SquareX aria-hidden="true" className="mr-2 h-4 w-4" />
            Close
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
        ) : null}
      </div>
      <Modal
        description="This changes how the challenge appears in client and public workflows."
        footer={
          <>
            <Button onClick={() => setConfirmAction(null)} type="button" variant="secondary">
              Cancel
            </Button>
            <Button
              isLoading={isArchiving || isClosing}
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
        title={confirmAction === "close" ? "Close challenge?" : "Archive challenge?"}
      >
        <p className="text-sm leading-6 text-[#78716C]">
          {confirmAction === "close"
            ? "Closed challenges are removed from public discovery and marked as cancelled for this foundation workflow."
            : "Archived challenges are hidden from active management and public discovery."}
        </p>
      </Modal>
    </>
  );
}
