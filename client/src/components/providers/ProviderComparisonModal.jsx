import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Modal } from "../ui/Modal.jsx";
import { SaveProviderButton } from "./SaveProviderButton.jsx";
import { ProviderComparisonTable } from "./ProviderComparisonTable.jsx";

function getProviderKey(provider = {}) {
  return provider.userId || provider.id || provider._id || provider.username;
}

function getName(provider = {}) {
  return provider.displayName || provider.fullName || provider.name || provider.username || "Provider";
}

function getProfileHref(provider = {}) {
  return provider.publicProfileUrl || provider.profileUrl || (provider.username ? `/profile/${provider.username}` : "");
}

export function ProviderComparisonModal({
  isOpen,
  onClose,
  providers = [],
}) {
  return (
    <Modal
      description="Compare public proof signals, availability, skills, and outcome offer context. This does not choose a winner or send invites."
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="Compare providers"
    >
      <div className="grid gap-5">
        <ProviderComparisonTable providers={providers} />

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {providers.map((provider) => {
            const href = getProfileHref(provider);

            return (
              <div
                className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4"
                key={getProviderKey(provider)}
              >
                <p className="text-sm font-black text-[#07030D]">{getName(provider)}</p>
                <div className="mt-4 grid gap-2">
                  {href ? (
                    <Button as="a" className="min-h-10 px-4 py-2 text-xs" href={href}>
                      View Profile
                      <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                    </Button>
                  ) : null}
                  <SaveProviderButton
                    className="min-h-10 px-4 py-2 text-xs"
                    provider={provider}
                    source="comparison"
                    variant="outline"
                  />
                  <SaveProviderButton
                    className="min-h-10 px-4 py-2 text-xs"
                    provider={provider}
                    source="comparison"
                    statusOnSave="shortlisted"
                    variant="secondary"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
