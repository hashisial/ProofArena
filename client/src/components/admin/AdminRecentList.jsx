import { formatDate } from "../../utils/formatDate.js";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";
import { AdminStatusBadge } from "./AdminStatusBadge.jsx";

function getTitle(item) {
  return item.title || item.displayName || item.headline || "Record";
}

function getStatus(item) {
  return item.moderation?.status || item.accountStatus || item.status || item.verificationStatus;
}

export function AdminRecentList({ description, items = [], title }) {
  return (
    <Card className="h-full" variant="bordered">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <div className="mt-5 divide-y divide-[#E7E5E4]">
        {items.length ? items.map((item) => (
          <div className="flex flex-col gap-2 py-3 first:pt-0 sm:flex-row sm:items-center sm:justify-between" key={item.id}>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[#1C1917]">{getTitle(item)}</p>
              <p className="mt-1 text-xs font-bold text-[#78716C]">{formatDate(item.createdAt)}</p>
            </div>
            <AdminStatusBadge status={getStatus(item)} />
          </div>
        )) : (
          <p className="text-sm leading-6 text-[#78716C]">No recent records available.</p>
        )}
      </div>
    </Card>
  );
}
