import { ProviderCard } from "./ProviderCard.jsx";
import { ProviderSkeletonCard } from "./ProviderSkeletonCard.jsx";
import { useAuth } from "../../features/auth/useAuth.js";
import { usePublicProviders } from "../../features/providers/useProviders.js";

function firstValue(values = []) {
  return values.find((value) => String(value ?? "").trim()) ?? "";
}

export function SimilarProvidersSection({
  currentUsername = "",
  provider = {},
}) {
  const category = firstValue(provider.categories);
  const skill = firstValue(provider.skills);
  const auth = useAuth();
  const query = usePublicProviders(
    {
      category,
      skill: category ? "" : skill,
      limit: 4,
      sort: "proof_score",
    },
    {
      enabled: Boolean(category || skill),
    },
  );

  if (!category && !skill) {
    return null;
  }

  const providers = (query.data?.items ?? [])
    .filter((item) => item.username !== currentUsername)
    .slice(0, 3);

  if (query.isLoading) {
    return (
      <section className="grid gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED]">
            Similar providers
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-normal text-[#07030D]">
            Related public providers
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <ProviderSkeletonCard key={item} />
          ))}
        </div>
      </section>
    );
  }

  if (!providers.length) {
    return null;
  }

  return (
    <section className="grid gap-4">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED]">
          Similar providers
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-normal text-[#07030D]">
          Related public providers
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {providers.map((item) => (
          <ProviderCard
            isAuthenticated={auth.isAuthenticated}
            key={item.userId || item.id || item.username}
            provider={item}
            viewerRole={auth.role || auth.user?.role}
          />
        ))}
      </div>
    </section>
  );
}
