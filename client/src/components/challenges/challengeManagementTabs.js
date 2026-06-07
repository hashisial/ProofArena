export const challengeManagementTabs = Object.freeze([
  { label: "All", statuses: [], value: "all" },
  { label: "Draft", statuses: ["draft"], value: "draft" },
  { label: "Open", statuses: ["open"], value: "open" },
  { label: "Reviewing Plans", statuses: ["reviewing_plans"], value: "reviewing_plans" },
  { label: "Provider Selected", statuses: ["provider_selected"], value: "provider_selected" },
  { label: "In Progress", statuses: ["in_progress", "proof_review"], value: "in_progress" },
  { label: "Completed", statuses: ["completed"], value: "completed" },
  { label: "Paused/Archived", statuses: ["paused", "archived", "cancelled"], value: "paused_archived" },
]);

export function getTabCount(challenges = [], tab) {
  if (!tab?.statuses?.length) {
    return challenges.length;
  }

  return challenges.filter((challenge) => tab.statuses.includes(challenge.status)).length;
}
