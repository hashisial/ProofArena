import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Archive,
  ClipboardList,
  Eye,
  Pause,
  Pencil,
  Rocket,
  SquareX,
  UsersRound,
} from "lucide-react";
import { ROUTES } from "../../constants/routes.js";
import { getChallengeId, getChallengeNextAction } from "../../utils/challengeNextAction.js";
import { Button } from "../ui/Button.jsx";
import { Modal } from "../ui/Modal.jsx";

export function ChallengeActionMenu({
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
  const challengeId = getChallengeId(challenge);
  const status = challenge?.status ?? "draft";
  const nextAction = getChallengeNextAction(challenge);
  const canPause = ["open", "reviewing_plans"].includes(status);
  const canClose = !["archived", "cancelled", "completed"].includes(status);
  const canArchive = status !== "archived";
  const canReviewPlans = ["open", "reviewing_plans", "provider_selected", "in_progress", "proof_review", "completed"].includes(status);
  const canSeeRecommendations = ["open", "reviewing_plans", "provider_selected"].includes(status);
  const canEdit = !["archived", "cancelled", "completed", "in_progress", "proof_review"].includes(status);

  async function runConfirmedAction() {
    if (confirmAction === "close") {
      await onClose?.(challengeId);
    }

    if (confirmAction === "archive") {
      await onArchive?.(challengeId);
    }

    setConfirmAction(null);
  }

  function handlePrimaryAction() {
    if (nextAction.action === "publish") {
      onPublish?.(challengeId);
    }
  }

  return (
    <>
      <div className="grid w-full gap-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {nextAction.disabled ? (
            <Button className="w-full sm:w-auto" disabled type="button" variant="secondary">
              {nextAction.label}
            </Button>
          ) : nextAction.action === "publish" ? (
            <Button
              className="w-full sm:w-auto"
              isLoading={isPublishing}
              loadingLabel={status === "paused" ? "Resuming..." : "Publishing..."}
              onClick={handlePrimaryAction}
              type="button"
            >
              <Rocket aria-hidden="true" className="mr-2 h-4 w-4" />
              {nextAction.label}
            </Button>
          ) : nextAction.route ? (
            <Button as={Link} className="w-full sm:w-auto" to={nextAction.route}>
              <Eye aria-hidden="true" className="mr-2 h-4 w-4" />
              {nextAction.label}
            </Button>
          ) : null}

          {showView && challengeId ? (
            <Button as={Link} className="w-full sm:w-auto" to={ROUTES.OWNER_CHALLENGE(challengeId)} variant="secondary">
              <Eye aria-hidden="true" className="mr-2 h-4 w-4" />
              Control Panel
            </Button>
          ) : null}

          {canReviewPlans && challengeId ? (
            <Button as={Link} className="w-full sm:w-auto" to={ROUTES.CHALLENGE_PLANS(challengeId)} variant="outline">
              <ClipboardList aria-hidden="true" className="mr-2 h-4 w-4" />
              Review Plans
            </Button>
          ) : null}

          {canSeeRecommendations && challengeId ? (
            <Button as={Link} className="w-full sm:w-auto" to={ROUTES.RECOMMENDED_PROVIDERS(challengeId)} variant="outline">
              <UsersRound aria-hidden="true" className="mr-2 h-4 w-4" />
              Recommended Providers
            </Button>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {canEdit && challengeId ? (
            <Button as={Link} className="w-full sm:w-auto" to={ROUTES.EDIT_CHALLENGE(challengeId)} variant="secondary">
              <Pencil aria-hidden="true" className="mr-2 h-4 w-4" />
              Edit
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

        {nextAction.disabled ? (
          <p className="text-xs font-bold leading-5 text-[#78716C]">{nextAction.description}</p>
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
