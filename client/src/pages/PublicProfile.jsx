import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BriefcaseBusiness, ShieldCheck } from "lucide-react";
import { AboutSection } from "../components/profile/AboutSection.jsx";
import { EducationSection } from "../components/profile/EducationSection.jsx";
import { ExperienceSection } from "../components/profile/ExperienceSection.jsx";
import { ProfileHeader } from "../components/profile/ProfileHeader.jsx";
import { ServicesSection } from "../components/profile/ServicesSection.jsx";
import { SkillsSection } from "../components/profile/SkillsSection.jsx";
import { VerifiedOutcomesSection } from "../components/profile/VerifiedOutcomesSection.jsx";
import { ProviderOutcomeOfferPreview } from "../components/providers/ProviderOutcomeOfferPreview.jsx";
import { ProviderProofSummary } from "../components/providers/ProviderProofSummary.jsx";
import { PublicProviderCTA } from "../components/providers/PublicProviderCTA.jsx";
import { SimilarProvidersSection } from "../components/providers/SimilarProvidersSection.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { Container } from "../components/Container.jsx";
import { ROUTES } from "../constants/index.js";
import { useAuth } from "../features/auth/useAuth.js";
import { usePublicProfile } from "../features/profile/useProfile.js";
import { formatDate } from "../utils/index.js";

function locationToText(location) {
  if (typeof location === "string") {
    return location.trim();
  }

  return [location?.city, location?.state, location?.country]
    .filter(Boolean)
    .join(", ");
}

function getDisplayName(user = {}) {
  return user.fullName || user.name || user.username || "ProofArena provider";
}

function getSkillNames(profile = {}, providerProfile = {}) {
  const profileSkills = Array.isArray(profile?.skills) ? profile.skills : [];
  const providerSkills = Array.isArray(providerProfile?.skills) ? providerProfile.skills : [];

  return Array.from(
    new Set(
      [...profileSkills, ...providerSkills]
        .map((skill) => (typeof skill === "string" ? skill : skill?.name || skill?.title))
        .filter(Boolean),
    ),
  );
}

function buildProviderDiscoveryData({ data, profile, providerProfile, user }) {
  const publicOutcomeOffers = data?.publicOutcomeOffers ?? {};
  const offers = publicOutcomeOffers.offers ?? [];
  const categories = Array.from(
    new Set([
      ...(providerProfile?.categories ?? []),
      ...offers.map((offer) => offer.category).filter(Boolean),
    ]),
  );
  const displayName = getDisplayName(user);

  return {
    ...providerProfile,
    avatar: user.avatar || profile.profilePicture?.url || profile.profilePicture || "",
    avatarUrl: user.avatar || profile.profilePicture?.url || profile.profilePicture || "",
    bioExcerpt: profile.bio || providerProfile?.professionalSummary || "",
    categories,
    completedOutcomes: providerProfile?.completedOutcomes,
    displayName,
    fullName: displayName,
    headline: profile.headline || providerProfile?.headline || providerProfile?.title || "",
    location: profile.locationLabel || locationToText(profile.location),
    outcomeOfferCount: publicOutcomeOffers.count ?? offers.length,
    outcomeOffers: {
      count: publicOutcomeOffers.count ?? offers.length,
      offers,
      top: publicOutcomeOffers.top ?? offers[0] ?? null,
    },
    outcomeOffersSummary: {
      categories,
      count: publicOutcomeOffers.count ?? offers.length,
      top: publicOutcomeOffers.top ?? offers[0] ?? null,
    },
    profileUrl: user.username ? `/profile/${user.username}` : "",
    providerSince: providerProfile?.createdAt ?? null,
    publicProfileUrl: user.username ? `/profile/${user.username}` : "",
    skills: getSkillNames(profile, providerProfile),
    topPublicOutcomeOffer: publicOutcomeOffers.top ?? offers[0] ?? null,
    userId: user.id || user._id || providerProfile?.userId || "",
    username: user.username || "",
    verification: profile.verification,
    verificationBadge: profile.verificationBadge,
    verificationStatus: providerProfile?.verificationStatus,
  };
}

function PublicProfileLoading() {
  return (
    <section className="bg-[#FEFCE8] py-8 text-[#1C1917] sm:py-12">
      <Container>
        <div className="mx-auto grid max-w-6xl gap-5">
          <Card className="rounded-3xl" padding="none">
            <Skeleton className="h-44 rounded-none sm:h-56" />
            <div className="px-5 pb-6 sm:px-8">
              <div className="-mt-12 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end">
                <Skeleton className="h-28 w-28 rounded-full border-4 border-white sm:h-32 sm:w-32" />
                <div className="grid flex-1 gap-3 pt-4 sm:pt-16">
                  <Skeleton className="h-7 w-64 max-w-full" />
                  <Skeleton className="h-5 w-96 max-w-full" />
                  <Skeleton className="h-5 w-72 max-w-full" />
                </div>
              </div>
            </div>
          </Card>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
            <div className="grid gap-5">
              {[0, 1, 2].map((item) => (
                <Card className="rounded-3xl" key={item} padding="lg">
                  <Skeleton className="h-6 w-44" />
                  <Skeleton className="mt-5 h-4 w-full" />
                  <Skeleton className="mt-3 h-4 w-5/6" />
                  <Skeleton className="mt-3 h-4 w-2/3" />
                </Card>
              ))}
            </div>
            <div className="grid content-start gap-5">
              <Card className="rounded-3xl" padding="lg">
                <Skeleton className="h-6 w-44" />
                <Skeleton className="mt-5 h-11 w-full rounded-full" />
                <Skeleton className="mt-3 h-11 w-full rounded-full" />
                <Skeleton className="mt-3 h-11 w-full rounded-full" />
              </Card>
              <Card className="rounded-3xl" padding="lg">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="mt-4 h-24 w-full rounded-2xl" />
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function PublicProfileError({ isNetworkError = false, onRetry }) {
  return (
    <section className="bg-[#FEFCE8] py-12 sm:py-16">
      <Container>
        <EmptyState
          actionText="Explore Providers"
          description="This profile may be private, inactive, or no longer available."
          icon={ShieldCheck}
          secondaryActionHref={ROUTES.HOME}
          secondaryActionText="Go Home"
          title="Provider profile not available"
          variant="bordered"
          {...(isNetworkError
            ? {
                actionText: "Retry",
                onAction: onRetry,
              }
            : {
                actionHref: ROUTES.PROVIDERS,
              })}
        />
      </Container>
    </section>
  );
}

function PublicOutcomeOffersSection({ offers = [], provider }) {
  return (
    <Card className="rounded-3xl" id="outcome-offers" padding="lg">
      <div className="flex min-w-0 items-start gap-3">
        <div
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314]"
        >
          <BriefcaseBusiness className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
            Outcome offers
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-normal text-[#1C1917]">
            Public outcome offers
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#78716C]">
            Published offers this provider has made public for clients to review.
          </p>
        </div>
      </div>

      {offers.length ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {offers.map((offer) => (
            <ProviderOutcomeOfferPreview
              key={offer.id || offer.slug || offer.title}
              provider={{
                ...provider,
                topPublicOutcomeOffer: offer,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-[#D9F99D] bg-[#FEFCE8] p-5">
          <p className="text-sm font-black text-[#1C1917]">No public outcome offers yet.</p>
          <p className="mt-2 text-sm leading-6 text-[#78716C]">
            Public outcome offers will appear here after this provider publishes measurable offers.
          </p>
        </div>
      )}
    </Card>
  );
}

export function PublicProfile({ username }) {
  const params = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const normalizedUsername = decodeURIComponent(username ?? params.username ?? "")
    .replace(/^\/+|\/+$/g, "")
    .trim()
    .toLowerCase();
  const { data, error, isError, isLoading, refetch } = usePublicProfile(normalizedUsername);
  const profile = useMemo(() => data?.profile ?? {}, [data?.profile]);
  const providerProfile = useMemo(() => data?.providerProfile ?? null, [data?.providerProfile]);
  const user = useMemo(() => data?.user ?? {}, [data?.user]);
  const publicOffers = data?.publicOutcomeOffers?.offers ?? [];
  const provider = useMemo(
    () => buildProviderDiscoveryData({ data, profile, providerProfile, user }),
    [data, profile, providerProfile, user],
  );
  const isOwner = Boolean(authUser?.id && user?.id && authUser.id === user.id);
  const providerName = getDisplayName(user);

  useEffect(() => {
    if (!data) {
      return undefined;
    }

    const previousTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute("content");
    const description =
      profile.headline ||
      providerProfile?.headline ||
      "View this public ProofArena provider profile, proof signals, services, and outcome offers.";

    document.title = `${providerName} | ProofArena Provider`;
    metaDescription?.setAttribute("content", description);

    return () => {
      document.title = previousTitle;
      if (metaDescription && previousDescription !== null && previousDescription !== undefined) {
        metaDescription.setAttribute("content", previousDescription);
      }
    };
  }, [data, profile.headline, providerName, providerProfile?.headline]);

  function handleBackToProviders() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(ROUTES.PROVIDERS);
  }

  if (isLoading) {
    return <PublicProfileLoading />;
  }

  if (isError || !data) {
    return (
      <PublicProfileError
        isNetworkError={!["403", "404", 403, 404].includes(error?.status ?? error?.statusCode)}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <section className="bg-[#FEFCE8] py-8 text-[#1C1917] sm:py-12">
      <Container>
        <div className="mx-auto grid max-w-6xl gap-5 pb-20">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              className="min-h-10 px-4 py-2 text-xs"
              onClick={handleBackToProviders}
              type="button"
              variant="secondary"
            >
              <ArrowLeft aria-hidden="true" className="mr-2 h-4 w-4" />
              Back to providers
            </Button>
            <Button as="a" className="min-h-10 px-4 py-2 text-xs" href={ROUTES.PROVIDERS} variant="outline">
              Explore providers
            </Button>
          </div>

          <ProfileHeader
            isOwner={false}
            profileData={data}
            showPublicActions={false}
          />

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <main className="grid min-w-0 gap-5">
              <Card className="rounded-3xl" padding="lg">
                <ProviderProofSummary provider={provider} />
                <div className="mt-5 grid gap-3 rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
                      Provider since
                    </p>
                    <p className="mt-2 text-sm font-black text-[#1C1917]">
                      {formatDate(provider.providerSince, {
                        fallback: "Not available",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
                      Availability
                    </p>
                    <p className="mt-2 text-sm font-black text-[#1C1917]">
                      {provider.availability ? provider.availability.replaceAll("_", " ") : "Not listed"}
                    </p>
                  </div>
                </div>
              </Card>

              <PublicOutcomeOffersSection offers={publicOffers} provider={provider} />
              <AboutSection profile={profile} />
              <SkillsSection profile={profile} providerProfile={providerProfile} />
              <ServicesSection
                providerProfile={providerProfile}
                services={[...(profile.services ?? []), ...(data.serviceItems ?? [])]}
              />
              <ExperienceSection experience={profile.experience} />
              <EducationSection education={profile.education} />
              <VerifiedOutcomesSection providerProfile={providerProfile} />
            </main>

            <aside className="grid min-w-0 content-start gap-5 lg:sticky lg:top-24">
              <PublicProviderCTA
                availability={provider.availability}
                hasOutcomeOffers={publicOffers.length > 0}
                isOwner={isOwner}
                onBackToProviders={handleBackToProviders}
                provider={provider}
                providerName={providerName}
              />
              <Card className="rounded-3xl" padding="lg" variant="muted">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
                  Public profile
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#78716C]">
                  This page shows public-safe profile data only. Private contact details,
                  draft offers, private proof assets, and owner controls are not shown.
                </p>
              </Card>
            </aside>
          </div>

          <SimilarProvidersSection currentUsername={normalizedUsername} provider={provider} />
        </div>
      </Container>
    </section>
  );
}
