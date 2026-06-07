import { Badge } from "../ui/Badge.jsx";

const availabilityLabels = {
  available: "Available",
  available_next_week: "Available next week",
  available_now: "Available now",
  available_this_week: "Available this week",
  fully_booked: "Fully booked",
  limited: "Limited",
  unavailable: "Fully booked",
};

function getVariant(status) {
  if (["available", "available_now", "available_this_week", "available_next_week"].includes(status)) {
    return "green";
  }

  if (status === "limited") {
    return "secondary";
  }

  return "gray";
}

export function ProviderAvailabilityBadge({ availability }) {
  const status = String(availability ?? "").trim().toLowerCase() || "limited";

  return (
    <Badge variant={getVariant(status)}>
      {availabilityLabels[status] ?? "Availability not listed"}
    </Badge>
  );
}
