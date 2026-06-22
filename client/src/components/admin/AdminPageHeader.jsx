import { PageHeader } from "../ui/PageHeader.jsx";

export function AdminPageHeader({ description, eyebrow = "Trust operations", title }) {
  return (
    <PageHeader
      badge={eyebrow}
      className="border-b border-[#E7E5E4] pb-6"
      description={description}
      showBackButton="auto"
      showBreadcrumbs
      title={title}
    />
  );
}
