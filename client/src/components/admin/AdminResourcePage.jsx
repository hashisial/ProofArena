import {
  CheckCircle2,
  ExternalLink,
  Flag,
  RotateCcw,
  Search,
  UserCheck,
  UserX,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { ROUTES } from "../../constants/index.js";
import { useAdminList, useAdminModeration, useAdminUserStatus } from "../../features/admin/useAdmin.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { formatDate } from "../../utils/formatDate.js";
import { formatNumber } from "../../utils/formatNumber.js";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";
import { AdminActionModal } from "./AdminActionModal.jsx";
import { AdminPageHeader } from "./AdminPageHeader.jsx";
import { AdminStatusBadge } from "./AdminStatusBadge.jsx";
import { AdminTable } from "./AdminTable.jsx";

const moderationOptions = [
  { label: "All moderation", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending" },
  { label: "Flagged", value: "flagged" },
  { label: "Rejected", value: "rejected" },
];

const roleOptions = [
  { label: "All roles", value: "all" },
  { label: "Clients", value: "client" },
  { label: "Providers", value: "provider" },
  { label: "Admins", value: "admin" },
];

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Name", value: "name" },
  { label: "Status", value: "status" },
];

const resourceConfig = Object.freeze({
  challenges: {
    description: "Moderate challenge quality, visibility, category fit, and platform safety.",
    emptyDescription: "Challenges will appear here as clients create them.",
    emptyTitle: "No challenges matched",
    searchPlaceholder: "Search challenge title, category, or client...",
    statusOptions: ["draft", "open", "reviewing_plans", "provider_selected", "in_progress", "completed", "paused", "archived"],
    title: "Challenge Moderation",
  },
  offers: {
    description: "Review outcome offers for clarity, visibility, quality, and marketplace safety.",
    emptyDescription: "Outcome offers will appear here as providers create them.",
    emptyTitle: "No outcome offers matched",
    searchPlaceholder: "Search offer title, category, or provider...",
    statusOptions: ["draft", "published", "paused", "archived"],
    title: "Outcome Offer Moderation",
  },
  proofAssets: {
    description: "Review proof assets and verification signals without exposing them publicly.",
    emptyDescription: "Proof assets will appear here when providers add evidence.",
    emptyTitle: "No proof assets matched",
    searchPlaceholder: "Search proof title, category, or provider...",
    statusOptions: ["approved", "pending", "flagged", "rejected"],
    title: "Proof Asset Moderation",
  },
  providers: {
    description: "Review provider trust signals, proof readiness, verification, and moderation status.",
    emptyDescription: "Providers will appear here as provider profiles are created.",
    emptyTitle: "No providers matched",
    searchPlaceholder: "Search provider name, headline, skill, or category...",
    statusOptions: ["none", "pending", "verified", "rejected"],
    title: "Provider Review",
  },
  users: {
    description: "Manage client, provider, and admin account status using admin-safe account data.",
    emptyDescription: "Users will appear here as accounts are created.",
    emptyTitle: "No users matched",
    searchPlaceholder: "Search name, username, or email...",
    statusOptions: ["active", "pending", "suspended"],
    title: "User Management",
  },
});

function statusSelectOptions(resource) {
  return [
    { label: "All statuses", value: "all" },
    ...resourceConfig[resource].statusOptions.map((value) => ({
      label: value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase()),
      value,
    })),
  ];
}

function getViewHref(resource, record) {
  if (resource === "providers" && record.provider?.username) {
    return `/profile/${encodeURIComponent(record.provider.username)}`;
  }
  if (resource === "challenges" && record.client?.username && record.slug) {
    return `/challenges/${encodeURIComponent(record.client.username)}/${encodeURIComponent(record.slug)}`;
  }
  if (resource === "offers" && record.provider?.username && record.slug) {
    return `/offers/${encodeURIComponent(record.provider.username)}/${encodeURIComponent(record.slug)}`;
  }
  return "";
}

function Identity({ record, type }) {
  const owner = record.provider || record.client || record;
  const title = record.title || record.headline || owner.displayName || "Not available";

  return (
    <div className="min-w-0">
      <p className="font-black text-[#1C1917]">{title}</p>
      {owner.displayName && owner.displayName !== title ? (
        <p className="mt-1 text-xs font-bold text-[#78716C]">{owner.displayName}</p>
      ) : null}
      {type === "users" && record.email ? <p className="mt-1 break-all text-xs text-[#78716C]">{record.email}</p> : null}
    </div>
  );
}

function ActionButtons({ onAction, record, resource }) {
  const viewHref = getViewHref(resource, record);

  if (resource === "users") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => onAction(record, "active", "Activate account")} type="button" variant="secondary">
          <UserCheck aria-hidden="true" className="h-4 w-4" />
          Activate
        </Button>
        <Button onClick={() => onAction(record, "suspended", "Suspend account")} type="button" variant="outline">
          <UserX aria-hidden="true" className="h-4 w-4" />
          Suspend
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => onAction(record, "approved", "Approve")} type="button" variant="secondary">
        <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
        Approve
      </Button>
      <Button onClick={() => onAction(record, "flagged", "Flag")} type="button" variant="outline">
        <Flag aria-hidden="true" className="h-4 w-4" />
        Flag
      </Button>
      <Button onClick={() => onAction(record, "rejected", "Reject")} type="button" variant="outline">
        <XCircle aria-hidden="true" className="h-4 w-4" />
        Reject
      </Button>
      {viewHref ? (
        <Button as="a" href={viewHref} target="_blank" variant="secondary">
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
          View
        </Button>
      ) : null}
    </div>
  );
}

function getColumns(resource, onAction) {
  const actions = {
    key: "actions",
    label: "Actions",
    render: (record) => <ActionButtons onAction={onAction} record={record} resource={resource} />,
  };
  const moderation = {
    key: "moderation",
    label: "Moderation",
    render: (record) => <AdminStatusBadge status={record.moderation?.status} />,
  };

  if (resource === "users") {
    return [
      { key: "user", label: "User", render: (record) => <Identity record={record} type={resource} /> },
      { key: "role", label: "Role", render: (record) => <AdminStatusBadge status={record.role} /> },
      { key: "status", label: "Account status", render: (record) => <AdminStatusBadge status={record.accountStatus} /> },
      { key: "verification", label: "Verification", render: (record) => <AdminStatusBadge status={record.verificationStatus} /> },
      { key: "created", label: "Created", render: (record) => formatDate(record.createdAt) },
      actions,
    ];
  }

  if (resource === "providers") {
    return [
      { key: "provider", label: "Provider", render: (record) => <Identity record={record} type={resource} /> },
      { key: "proof", label: "Proof score", render: (record) => formatNumber(record.proofScore, { fallback: "Not available" }) },
      { key: "outcomes", label: "Outcomes", render: (record) => formatNumber(record.completedOutcomes, { fallback: "Not available" }) },
      { key: "verification", label: "Verification", render: (record) => <AdminStatusBadge status={record.verificationStatus} /> },
      { key: "availability", label: "Availability", render: (record) => <AdminStatusBadge status={record.availability} /> },
      moderation,
      actions,
    ];
  }

  if (resource === "challenges") {
    return [
      { key: "challenge", label: "Challenge", render: (record) => <Identity record={record} type={resource} /> },
      { key: "status", label: "Status", render: (record) => <AdminStatusBadge status={record.status} /> },
      { key: "visibility", label: "Visibility", render: (record) => <AdminStatusBadge status={record.visibility} /> },
      { key: "category", label: "Category", render: (record) => record.category || "Not available" },
      {
        key: "budget",
        label: "Budget",
        render: (record) => formatCurrency(record.budget?.max ?? record.budget?.min, record.budget?.currency, { fallback: "Not available" }),
      },
      moderation,
      actions,
    ];
  }

  if (resource === "offers") {
    return [
      { key: "offer", label: "Outcome offer", render: (record) => <Identity record={record} type={resource} /> },
      { key: "status", label: "Status", render: (record) => <AdminStatusBadge status={record.status} /> },
      { key: "visibility", label: "Visibility", render: (record) => <AdminStatusBadge status={record.visibility} /> },
      { key: "category", label: "Category", render: (record) => record.category || "Not available" },
      { key: "quality", label: "Quality score", render: (record) => formatNumber(record.qualityScore, { fallback: "Not available" }) },
      moderation,
      actions,
    ];
  }

  return [
    { key: "proof", label: "Proof asset", render: (record) => <Identity record={record} type={resource} /> },
    { key: "type", label: "Type", render: (record) => <AdminStatusBadge status={record.assetType} /> },
    { key: "source", label: "Source", render: (record) => record.sourceType?.replaceAll("_", " ") || "Not available" },
    { key: "visibility", label: "Visibility", render: (record) => <AdminStatusBadge status={record.visibility} /> },
    { key: "verification", label: "Verification", render: (record) => <AdminStatusBadge status={record.verificationStatus} /> },
    moderation,
    actions,
  ];
}

export function AdminResourcePage({ resource }) {
  const config = resourceConfig[resource];
  const [filters, setFilters] = useState({
    limit: 20,
    moderationStatus: "all",
    page: 1,
    q: "",
    role: "all",
    sort: "newest",
    status: "all",
  });
  const [selectedAction, setSelectedAction] = useState(null);
  const [feedback, setFeedback] = useState("");
  const query = useAdminList(resource, filters);
  const moderationMutation = useAdminModeration();
  const userStatusMutation = useAdminUserStatus();
  const activeMutation = resource === "users" ? userStatusMutation : moderationMutation;
  const columns = getColumns(resource, setSelectedActionFromArgs);

  function setSelectedActionFromArgs(record, status, label) {
    activeMutation.reset();
    setFeedback("");
    setSelectedAction({ label, record, status });
  }

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value, page: 1 }));
  }

  async function confirmAction(reason) {
    if (!selectedAction) return;

    try {
      if (resource === "users") {
        await userStatusMutation.mutateAsync({
          id: selectedAction.record.id,
          status: selectedAction.status,
        });
      } else {
        await moderationMutation.mutateAsync({
          id: selectedAction.record.id,
          payload: { reason, status: selectedAction.status },
          resource,
        });
      }
      setFeedback(`${selectedAction.label} completed successfully.`);
      setSelectedAction(null);
    } catch {
      // Mutation error is rendered in the modal.
    }
  }

  const items = query.data?.items ?? [];
  const pagination = query.data?.pagination ?? { page: 1, pages: 1, total: 0 };

  return (
    <div className="grid gap-6">
      <AdminPageHeader description={config.description} title={config.title} />

      <section aria-label={`${config.title} filters`} className="grid gap-4 rounded-2xl border border-[#E7E5E4] bg-white p-4 lg:grid-cols-[minmax(16rem,1fr)_repeat(3,minmax(10rem,0.5fr))]">
        <Input
          label="Search"
          leftIcon={<Search className="h-4 w-4" />}
          onChange={(event) => updateFilter("q", event.target.value)}
          placeholder={config.searchPlaceholder}
          type="search"
          value={filters.q}
        />
        {resource === "users" ? (
          <Select label="Role" onChange={(event) => updateFilter("role", event.target.value)} options={roleOptions} placeholder="" value={filters.role} />
        ) : (
          <Select label="Moderation" onChange={(event) => updateFilter("moderationStatus", event.target.value)} options={moderationOptions} placeholder="" value={filters.moderationStatus} />
        )}
        <Select label="Status" onChange={(event) => updateFilter("status", event.target.value)} options={statusSelectOptions(resource)} placeholder="" value={filters.status} />
        <Select label="Sort" onChange={(event) => updateFilter("sort", event.target.value)} options={sortOptions} placeholder="" value={filters.sort} />
      </section>

      <div aria-live="polite">
        {feedback ? (
          <p className="rounded-xl border border-[#65A30D]/25 bg-[#F7FEE7] px-4 py-3 text-sm font-bold text-[#365314]">
            {feedback}
          </p>
        ) : null}
      </div>

      {query.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton className="h-64" key={index} />
          ))}
        </div>
      ) : null}

      {query.isError ? (
        <Card variant="bordered">
          <p className="font-black text-[#1C1917]">Could not load {config.title.toLowerCase()}</p>
          <p className="mt-2 text-sm text-[#78716C]">The admin data request failed. Try again.</p>
          <Button className="mt-4" onClick={() => query.refetch()} type="button" variant="secondary">
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Retry
          </Button>
        </Card>
      ) : null}

      {!query.isLoading && !query.isError && items.length ? (
        <AdminTable caption={config.title} columns={columns} items={items} />
      ) : null}

      {!query.isLoading && !query.isError && !items.length ? (
        <EmptyState
          actionHref={ROUTES.ADMIN}
          actionText="Admin Overview"
          description={config.emptyDescription}
          title={config.emptyTitle}
          variant="bordered"
        />
      ) : null}

      {!query.isLoading && !query.isError && pagination.pages > 1 ? (
        <nav aria-label={`${config.title} pagination`} className="flex flex-col gap-3 rounded-2xl border border-[#E7E5E4] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-[#57534E]">
            Page {pagination.page} of {pagination.pages} · {formatNumber(pagination.total)} records
          </p>
          <div className="flex gap-2">
            <Button disabled={pagination.page <= 1} onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))} type="button" variant="secondary">
              Previous
            </Button>
            <Button disabled={pagination.page >= pagination.pages} onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))} type="button" variant="secondary">
              Next
            </Button>
          </div>
        </nav>
      ) : null}

      <AdminActionModal
        actionLabel={selectedAction?.label ?? "Update"}
        description={
          resource === "users"
            ? "This changes the user's account access status."
            : "This decision updates the moderation audit record and public eligibility."
        }
        error={activeMutation.error?.message}
        isOpen={Boolean(selectedAction)}
        isPending={activeMutation.isPending}
        key={`${selectedAction?.record?.id ?? "none"}-${selectedAction?.status ?? "none"}`}
        onClose={() => {
          activeMutation.reset();
          setSelectedAction(null);
        }}
        onConfirm={confirmAction}
        reasonEnabled={resource !== "users"}
        resourceLabel={
          selectedAction?.record?.title ||
          selectedAction?.record?.headline ||
          selectedAction?.record?.displayName ||
          selectedAction?.record?.provider?.displayName ||
          "record"
        }
      />
    </div>
  );
}
