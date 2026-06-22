import { CheckCircle2, Circle, FastForward } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card, CardDescription, CardTitle } from "../../components/ui/Card.jsx";
import { ErrorState } from "../../components/ui/ErrorState.jsx";
import { PageHeader } from "../../components/ui/PageHeader.jsx";
import { PageLoader } from "../../components/ui/PageLoader.jsx";
import { ROUTES } from "../../constants/index.js";
import { PROFILE_ONBOARDING_STEPS, PROFILE_SECTIONS } from "../../config/profile/index.js";
import { useAuth } from "../../features/auth/useAuth.js";
import { useMyProfile } from "../../features/profile/useProfile.js";
import {
  calculateOverallProgress,
  getCompletedStepIds,
  getProfilePayload,
  getSkippedStepIds,
  getStepPath,
  isStepImplemented,
  isStepPlaceholder,
} from "../../features/profile/profileOnboarding.js";

function statusForStep(step, completedSet, skippedSet) {
  if (completedSet.has(step.id)) {
    return {
      icon: <CheckCircle2 aria-hidden="true" className="h-4 w-4" />,
      label: "Complete",
      variant: "success",
    };
  }

  if (skippedSet.has(step.id)) {
    return {
      icon: <FastForward aria-hidden="true" className="h-4 w-4" />,
      label: "Skipped",
      variant: "warning",
    };
  }

  if (isStepPlaceholder(step.id)) {
    return {
      icon: <Circle aria-hidden="true" className="h-4 w-4" />,
      label: "Foundation",
      variant: "primary",
    };
  }

  return {
    icon: <Circle aria-hidden="true" className="h-4 w-4" />,
    label: isStepImplemented(step.id) ? "Ready" : "Later",
    variant: isStepImplemented(step.id) ? "outline" : "default",
  };
}

export function ProfileOnboardingPage() {
  const { isAuthenticated } = useAuth();
  const profileQuery = useMyProfile(isAuthenticated);

  if (profileQuery.isLoading) {
    return <PageLoader description="Loading the 45-step profile flow." title="Loading onboarding" />;
  }

  if (profileQuery.isError) {
    return (
      <ErrorState
        description={profileQuery.error?.message}
        onPrimaryAction={() => profileQuery.refetch()}
        primaryActionText="Try again"
        title="Onboarding could not be loaded"
      />
    );
  }

  const profile = getProfilePayload(profileQuery.data);
  const completedSet = new Set(getCompletedStepIds(profile));
  const skippedSet = new Set(getSkippedStepIds(profile));
  const progress = calculateOverallProgress(profile);

  return (
    <div className="grid gap-6">
      <PageHeader
        backFallback={ROUTES.PROVIDER.PROFILE}
        description="Move through the client-ready provider profile flow. Real forms are enabled for the Stage 4 sections; future-only workflow steps remain safe placeholders."
        eyebrow="Profile onboarding"
        showBack
        title="Enhanced profile setup"
        actions={
          <Button as={Link} to={getStepPath(PROFILE_ONBOARDING_STEPS[0])}>
            Start from first step
          </Button>
        }
      />

      <Card padding="lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle as="h2">{progress}% complete</CardTitle>
            <CardDescription>
              Progress updates after valid draft saves or explicit skips for optional foundation steps.
            </CardDescription>
          </div>
          <Badge variant="primary">{PROFILE_ONBOARDING_STEPS.length} steps</Badge>
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-[var(--color-muted-surface)]">
          <div className="h-full rounded-full bg-[var(--color-primary)]" style={{ width: `${progress}%` }} />
        </div>
      </Card>

      <div className="grid gap-5">
        {PROFILE_SECTIONS.map((section) => (
          <Card key={section.key} padding="lg">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle as="h2">{section.label}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </div>
              {section.requiredForPublish ? <Badge variant="warning">Publish gate</Badge> : null}
            </div>
            <div className="mt-5 grid gap-3">
              {section.steps.map((stepId) => {
                const step = PROFILE_ONBOARDING_STEPS.find((candidate) => candidate.id === stepId);
                if (!step) {
                  return null;
                }

                const status = statusForStep(step, completedSet, skippedSet);

                return (
                  <Link
                    className="grid gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-card)] p-4 transition hover:border-[var(--color-primary-border)] hover:bg-[var(--color-surface-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] sm:grid-cols-[1fr_auto] sm:items-center"
                    key={step.id}
                    to={getStepPath(step)}
                  >
                    <span>
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-[var(--color-foreground)]">{step.order}. {step.title}</span>
                        <Badge variant={status.variant} leftIcon={status.icon}>{status.label}</Badge>
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-[var(--color-text-muted)]">
                        {step.description}
                      </span>
                    </span>
                    <span className="text-sm font-bold text-[var(--color-primary)]">
                      {step.estimatedMinutes} min
                    </span>
                  </Link>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
