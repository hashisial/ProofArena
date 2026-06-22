import { ClientPagePlaceholder } from "../../components/client/ClientPagePlaceholder.jsx";

export function ClientActiveWork() {
  return (
    <ClientPagePlaceholder
      description="Track active outcomes, milestones, provider updates, proof submissions, approvals, and revisions."
      moduleKey="active"
      stageNote="Milestones, proof review, and active outcome workflows come later."
      title="Active Work"
    />
  );
}
