import { Badge } from "../ui/Badge.jsx";

const variants = Object.freeze({
  active: "green",
  approved: "green",
  completed: "green",
  flagged: "yellow",
  open: "primary",
  pending: "yellow",
  pending_review: "yellow",
  private: "gray",
  published: "green",
  public: "primary",
  rejected: "red",
  suspended: "red",
  verified: "green",
});

function formatLabel(value) {
  return String(value || "Not available")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function AdminStatusBadge({ status }) {
  return <Badge variant={variants[status] ?? "gray"}>{formatLabel(status)}</Badge>;
}
