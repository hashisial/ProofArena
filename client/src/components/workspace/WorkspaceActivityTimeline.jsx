import { Activity, Bookmark, CheckCircle2, ClipboardList, Send, Target } from "lucide-react";
import { createElement } from "react";
import { Badge } from "../ui/Badge.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { formatDate } from "../../utils/formatDate.js";

const activityIcons = {
  challenge: Target,
  plan: ClipboardList,
  published: Send,
  selected: CheckCircle2,
  shortlist: Bookmark,
};

export function WorkspaceActivityTimeline({ events = [] }) {
  return (
    <Card as="section" padding="md" variant="bordered">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Activity Timeline</CardTitle>
          <Badge variant="outline">{events.length} recent</Badge>
        </div>
        <CardDescription>Recent client activity from real challenge, execution-plan, and shortlist records.</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <ol className="relative grid gap-3 before:absolute before:bottom-5 before:left-5 before:top-5 before:w-px before:bg-[#E9E2F3]">
            {events.map((event, index) => {
              const Icon = activityIcons[event.kind] || Activity;

              return (
                <li className="relative min-w-0 pl-12" key={`${event.label}-${event.title}-${event.date}-${index}`}>
                  <span className="absolute left-0 top-3 z-10 grid h-10 w-10 place-items-center rounded-2xl border border-[#E9E2F3] bg-white text-[#7C3AED]">
                    {createElement(Icon, { "aria-hidden": "true", className: "h-4 w-4" })}
                  </span>
                  <a className="block min-w-0 rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4 transition hover:border-[#A78BFA] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/12" href={event.href}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="break-words text-sm font-black text-[#07030D]">{event.title}</p>
                      <Badge size="sm" variant="gray">{event.label}</Badge>
                    </div>
                    <p className="mt-2 text-xs font-bold text-[#6F657C]">
                      {formatDate(event.date, { fallback: "Recently" })}
                    </p>
                  </a>
                </li>
              );
            })}
          </ol>
        ) : (
          <EmptyState
            description="Workspace activity will appear here."
            icon={Activity}
            size="sm"
            title="No workspace activity yet"
            variant="minimal"
          />
        )}
      </CardContent>
    </Card>
  );
}
