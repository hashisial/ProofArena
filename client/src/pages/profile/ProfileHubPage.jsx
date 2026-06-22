import { ArrowRight, Eye, FileText, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card, CardDescription, CardTitle } from "../../components/ui/Card.jsx";
import { ErrorState } from "../../components/ui/ErrorState.jsx";
import { PageHeader } from "../../components/ui/PageHeader.jsx";
import { PageLoader } from "../../components/ui/PageLoader.jsx";
import { ROUTES } from "../../constants/index.js";
import { useAuth } from "../../features/auth/useAuth.js";
import {
  useMyProfile,
  usePublicProfilePreview,
} from "../../features/profile/useProfile.js";
import {
  calculateOverallProgress,
  getCompletedStepIds,
  getOnboardingStepBySegment,
  getProfilePayload,
  getStepPath,
} from "../../features/profile/profileOnboarding.js";
import { PROFILE_ONBOARDING_STEPS, PROFILE_SECTIONS } from "../../config/profile/index.js";

function getCurrentStep(profile) {
  const currentStepId = profile?.onboardingProgress?.currentStepId;
  const explicitStep = PROFILE_ONBOARDING_STEPS.find((step) => step.id === currentStepId);

  if (explicitStep) {
    return explicitStep;
  }

  const completed = new Set(getCompletedStepIds(profile));
  return PROFILE_ONBOARDING_STEPS.find((step) => !completed.has(step.id)) ?? PROFILE_ONBOARDING_STEPS[0];
}

function getSectionPercent(profile, section) {
  const completed = new Set(getCompletedStepIds(profile));
  const completedCount = section.steps.filter((stepId) => completed.has(stepId)).length;
  return section.steps.length ? Math.round((completedCount / section.steps.length) * 100) : 0;
}

export function ProfileHubPage() {
  const { isAuthenticated } = useAuth();
  const profileQuery = useMyProfile(isAuthenticated);
  const previewQuery = usePublicProfilePreview(isAuthenticated);

  if (profileQuery.isLoading) {
    return (
      <PageLoader
        description="Loading your profile command center and onboarding progress."
        title="Loading profile"
      />
    );
  }

  if (profileQuery.isError) {
    return (
      <ErrorState
        description={profileQuery.error?.message}
        onPrimaryAction={() => profileQuery.refetch()}
        primaryActionText="Try again"
        title="Profile could not be loaded"
      />
    );
  }

  const profileData = profileQuery.data;
  const profile = getProfilePayload(profileData);
  const currentStep = getCurrentStep(profile);
  const completedCount = getCompletedStepIds(profile).length;
  const progress = calculateOverallProgress(profile);
  const preview = previewQuery.data?.profile;

  return (
    <div className="grid gap-6">
      <PageHeader
        backFallback={ROUTES.DASHBOARD}
        description="Build your client-ready provider identity, save draft sections, and prepare a public-safe profile."
        eyebrow="Enhanced profile"
        showBack
        title="Profile command center"
        actions={
          <Button as={Link} rightIcon={<ArrowRight className="h-4 w-4" />} to={getStepPath(currentStep)}>
            Continue setup
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="grid gap-5" padding="lg">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge variant={profile?.publishState?.isPublished ? "success" : "primary"}>
                {profile?.publishState?.isPublished ? "Published" : "Draft profile"}
              </Badge>
              <CardTitle as="h2" className="mt-3 text-2xl">
                {progress}% profile readiness
              </CardTitle>
              <CardDescription>
                {completedCount} of {PROFILE_ONBOARDING_STEPS.length} onboarding steps are complete.
                Completion is based on real saved profile sections, not placeholder data.
              </CardDescription>
            </div>
            <div className="min-w-28 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4 text-center">
              <p className="text-3xl font-black text-[var(--color-primary)]">{progress}%</p>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                Ready
              </p>
            </div>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-[var(--color-muted-surface)]">
            <div
              className="h-full rounded-full bg-[var(--color-primary)] transition-all motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <ShieldCheck aria-hidden="true" className="h-5 w-5 text-[var(--color-primary)]" />
              <p className="mt-3 text-sm font-black text-[var(--color-foreground)]">Private draft</p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Owner-editable fields stay private until publish review.</p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <Eye aria-hidden="true" className="h-5 w-5 text-[var(--color-primary)]" />
              <p className="mt-3 text-sm font-black text-[var(--color-foreground)]">Public-safe preview</p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Preview only exposes fields allowed by the backend projection.</p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-card)] p-4">
              <FileText aria-hidden="true" className="h-5 w-5 text-[var(--color-primary)]" />
              <p className="mt-3 text-sm font-black text-[var(--color-foreground)]">Structured onboarding</p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">All 45 steps use the central registry and route-safe navigation.</p>
            </div>
          </div>
        </Card>

        <Card className="self-start" padding="lg">
          <Badge variant="outline">Public preview</Badge>
          <CardTitle as="h2" className="mt-3 text-xl">
            {preview?.displayName || profileData?.user?.fullName || "Provider profile"}
          </CardTitle>
          <CardDescription>
            {preview?.headline || "Add headline and proof-backed positioning to prepare your public profile."}
          </CardDescription>
          <div className="mt-5 flex flex-wrap gap-2">
            {(preview?.skills ?? []).slice(0, 5).map((skill) => (
              <Badge key={skill} variant="primary">{skill}</Badge>
            ))}
          </div>
        </Card>
      </div>

      <Card padding="lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle as="h2">Onboarding sections</CardTitle>
            <CardDescription>
              Each section persists independently so future forms can plug into the same save flow.
            </CardDescription>
          </div>
          <Button as={Link} to={ROUTES.PROVIDER.PROFILE_ONBOARDING} variant="secondary">
            View all steps
          </Button>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {PROFILE_SECTIONS.map((section) => {
            const percent = getSectionPercent(profile, section);
            const firstStep = getOnboardingStepBySegment(
              PROFILE_ONBOARDING_STEPS.find((step) => step.id === section.steps[0])?.routeSegment,
            );

            return (
              <Link
                className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-card)] p-4 transition hover:border-[var(--color-primary-border)] hover:bg-[var(--color-surface-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                key={section.key}
                to={firstStep ? getStepPath(firstStep) : ROUTES.PROVIDER.PROFILE_ONBOARDING}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-[var(--color-foreground)]">{section.label}</p>
                  <Badge variant={percent === 100 ? "success" : "default"}>{percent}%</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{section.description}</p>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
