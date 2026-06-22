import { ArrowLeft, ArrowRight, CheckCircle2, FastForward } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Badge } from "../../components/ui/Badge.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card, CardDescription, CardTitle } from "../../components/ui/Card.jsx";
import { ErrorState } from "../../components/ui/ErrorState.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { PageHeader } from "../../components/ui/PageHeader.jsx";
import { PageLoader } from "../../components/ui/PageLoader.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { Textarea } from "../../components/ui/Textarea.jsx";
import { ROUTES } from "../../constants/index.js";
import { PROFILE_SECTION_KEY } from "../../types/profile.js";
import { useAuth } from "../../features/auth/useAuth.js";
import {
  useMyProfile,
  useUpdateOnboardingProgress,
  useUpdateProfileSection,
} from "../../features/profile/useProfile.js";
import {
  buildCompletedStepIds,
  buildSkippedStepIds,
  buildStepSectionPayload,
  calculateSectionProgress,
  formatPublicAssetList,
  formatStringList,
  formatTagList,
  getNextStep,
  getPreviousStep,
  getProfilePayload,
  getSectionValue,
  getStepPath,
  getOnboardingStepBySegment,
  isPublicFacingStep,
  isStepImplemented,
  isStepPlaceholder,
  validateStepPayload,
} from "../../features/profile/profileOnboarding.js";

const accountTypeOptions = [
  { label: "Individual provider", value: "individual" },
  { label: "Agency", value: "agency" },
  { label: "Organization", value: "organization" },
];

function getUpdateSectionKeyForStep(step) {
  if (step.id === "serviceCategories") {
    return PROFILE_SECTION_KEY.SKILLS;
  }

  return step.section;
}

function getInitialValues(step, profile) {
  const identity = getSectionValue(profile, PROFILE_SECTION_KEY.IDENTITY);
  const professionalIdentity = getSectionValue(profile, PROFILE_SECTION_KEY.PROFESSIONAL_IDENTITY);
  const skills = getSectionValue(profile, PROFILE_SECTION_KEY.SKILLS);
  const services = getSectionValue(profile, PROFILE_SECTION_KEY.SERVICES);
  const proof = getSectionValue(profile, PROFILE_SECTION_KEY.PROOF);

  switch (step.id) {
    case "accountType":
      return { accountType: identity.accountType || "individual" };
    case "personalInformation":
      return {
        displayName: identity.displayName || profile?.user?.fullName || "",
        firstName: identity.firstName || "",
        language: identity.language || "en",
        lastName: identity.lastName || "",
        timezone: identity.timezone || identity.location?.timezone || "",
        username: identity.username || profile?.user?.username || "",
      };
    case "contactInformation":
      return {
        city: identity.location?.city || "",
        contactEmail: identity.contactEmail || "",
        contactPhone: identity.contactPhone || "",
        country: identity.location?.country || "",
        state: identity.location?.state || "",
        timezone: identity.timezone || identity.location?.timezone || "",
      };
    case "professionalHeadline":
      return { headline: professionalIdentity.headline || profile?.headline || "" };
    case "bio":
      return { bio: professionalIdentity.bio || profile?.bio || "" };
    case "industry":
      return { industry: professionalIdentity.industry || "" };
    case "niche":
      return { niche: professionalIdentity.niche || "" };
    case "targetClient":
      return { targetClient: professionalIdentity.targetClient || "" };
    case "skills":
      return { skills: formatTagList(skills.skills) };
    case "tools":
      return { tools: formatTagList(skills.tools) };
    case "platforms":
      return { platforms: formatTagList(skills.platforms) };
    case "experienceLevels":
      return { skillLevels: formatTagList(skills.skillLevels) };
    case "serviceCategories":
      return { serviceCategories: formatStringList(skills.serviceCategories) };
    case "outcomeOffers":
      return { services: formatPublicAssetList(services.services) };
    case "pricingModels":
      return { pricingModels: formatStringList(services.pricingModels) };
    case "deliveryTimelines":
      return { deliveryTimelines: formatStringList(services.deliveryTimelines) };
    case "revisionPolicies":
      return { revisionPolicies: formatStringList(services.revisionPolicies) };
    case "portfolio":
      return { portfolioItems: formatPublicAssetList(proof.portfolioItems) };
    case "caseStudies":
      return { caseStudies: formatPublicAssetList(proof.caseStudies) };
    case "certifications":
      return { certifications: formatPublicAssetList(proof.certifications) };
    case "achievements":
      return { achievements: formatPublicAssetList(proof.achievements) };
    default:
      return {};
  }
}

function StepFields({ errors, onChange, step, values }) {
  const setValue = (field) => (event) => onChange(field, event.target.value);
  const listHelper = "Use one item per line. Keep entries factual and client-safe.";
  const assetHelper = "Use one item per line: Title | URL | Short description. Do not add private client details.";

  switch (step.id) {
    case "accountType":
      return (
        <Select
          error={errors.accountType}
          helperText="This controls future provider, agency, and organization profile behavior."
          label="Account type"
          onChange={setValue("accountType")}
          options={accountTypeOptions}
          required
          value={values.accountType ?? ""}
        />
      );
    case "personalInformation":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input error={errors.displayName} label="Display name" onChange={setValue("displayName")} required value={values.displayName ?? ""} />
          <Input error={errors.username} helperText="Used for future public profile URLs." label="Username" onChange={setValue("username")} required value={values.username ?? ""} />
          <Input label="First name" onChange={setValue("firstName")} value={values.firstName ?? ""} />
          <Input label="Last name" onChange={setValue("lastName")} value={values.lastName ?? ""} />
          <Input label="Timezone" onChange={setValue("timezone")} value={values.timezone ?? ""} />
          <Input label="Language" onChange={setValue("language")} value={values.language ?? "en"} />
        </div>
      );
    case "contactInformation":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input error={errors.contactEmail} helperText="Private by default. Used for support and verification readiness." label="Contact email" onChange={setValue("contactEmail")} required type="email" value={values.contactEmail ?? ""} />
          <Input helperText="Private by default." label="Contact phone" onChange={setValue("contactPhone")} value={values.contactPhone ?? ""} />
          <Input label="City" onChange={setValue("city")} value={values.city ?? ""} />
          <Input label="State / region" onChange={setValue("state")} value={values.state ?? ""} />
          <Input label="Country" onChange={setValue("country")} value={values.country ?? ""} />
          <Input label="Timezone" onChange={setValue("timezone")} value={values.timezone ?? ""} />
        </div>
      );
    case "professionalHeadline":
      return <Input error={errors.headline} helperText="Public. Keep it specific and outcome-focused." label="Professional headline" maxLength={180} onChange={setValue("headline")} required value={values.headline ?? ""} />;
    case "bio":
      return <Textarea error={errors.bio} helperText="Public. Explain who you help, what outcomes you create, and what proof clients should expect." label="Bio" onChange={setValue("bio")} required rows={8} value={values.bio ?? ""} />;
    case "industry":
      return <Input error={errors.industry} label="Primary industry" onChange={setValue("industry")} required value={values.industry ?? ""} />;
    case "niche":
      return <Input error={errors.niche} helperText="Example: B2B SaaS demand generation for seed-stage teams." label="Niche" onChange={setValue("niche")} required value={values.niche ?? ""} />;
    case "targetClient":
      return <Textarea error={errors.targetClient} helperText="Public. Describe the buyer segment you serve best." label="Target client" onChange={setValue("targetClient")} required rows={5} value={values.targetClient ?? ""} />;
    case "skills":
      return <Textarea error={errors.skills} helperText="Public. Add at least three core skills." label="Core skills" onChange={setValue("skills")} required rows={7} value={values.skills ?? ""} />;
    case "tools":
      return <Textarea helperText={listHelper} label="Tools" onChange={setValue("tools")} rows={7} value={values.tools ?? ""} />;
    case "platforms":
      return <Textarea helperText={listHelper} label="Platforms" onChange={setValue("platforms")} rows={7} value={values.platforms ?? ""} />;
    case "experienceLevels":
      return <Textarea error={errors.skillLevels} helperText="One per line, for example: SEO | advanced." label="Experience levels" onChange={setValue("skillLevels")} required rows={7} value={values.skillLevels ?? ""} />;
    case "serviceCategories":
      return <Textarea error={errors.serviceCategories} helperText="Public. Add service categories clients can understand." label="Service categories" onChange={setValue("serviceCategories")} required rows={7} value={values.serviceCategories ?? ""} />;
    case "outcomeOffers":
      return <Textarea helperText={assetHelper} label="Outcome offer readiness" onChange={setValue("services")} rows={7} value={values.services ?? ""} />;
    case "pricingModels":
      return <Textarea helperText="Mixed visibility. Examples: fixed fee, milestone-based, retainer, performance bonus." label="Pricing models" onChange={setValue("pricingModels")} rows={7} value={values.pricingModels ?? ""} />;
    case "deliveryTimelines":
      return <Textarea error={errors.deliveryTimelines} helperText="Public. Examples: 7-day audit, 14-day sprint, 30-day implementation." label="Delivery timelines" onChange={setValue("deliveryTimelines")} required rows={7} value={values.deliveryTimelines ?? ""} />;
    case "revisionPolicies":
      return <Textarea helperText="Mixed visibility. Define reasonable revision boundaries without creating contract terms yet." label="Revision policies" onChange={setValue("revisionPolicies")} rows={7} value={values.revisionPolicies ?? ""} />;
    case "portfolio":
      return <Textarea helperText={assetHelper} label="Portfolio references" onChange={setValue("portfolioItems")} rows={7} value={values.portfolioItems ?? ""} />;
    case "caseStudies":
      return <Textarea helperText={assetHelper} label="Case studies" onChange={setValue("caseStudies")} rows={7} value={values.caseStudies ?? ""} />;
    case "certifications":
      return <Textarea helperText={assetHelper} label="Certifications" onChange={setValue("certifications")} rows={7} value={values.certifications ?? ""} />;
    case "achievements":
      return <Textarea helperText={assetHelper} label="Achievements" onChange={setValue("achievements")} rows={7} value={values.achievements ?? ""} />;
    default:
      return null;
  }
}

function StepPlaceholder({ canSkip, onSkip, step, isSkipping }) {
  const helperText = canSkip
    ? "This step is part of the 45-step onboarding registry, but it does not create fake uploads, verification, proof, or marketplace data. You can skip it now and return when the workflow exists."
    : "This step is part of the 45-step onboarding registry, but this required workflow is planned for a later stage. It is visible for route safety only and will not create fake profile data.";

  return (
    <Card padding="lg">
      <Badge variant="primary">Foundation only</Badge>
      <CardTitle as="h2" className="mt-3">
        {step.title} is reserved for a later workflow
      </CardTitle>
      <CardDescription>{helperText}</CardDescription>
      {canSkip ? (
        <div className="mt-6">
          <Button
            iconLeft={<FastForward className="h-4 w-4" />}
            isLoading={isSkipping}
            onClick={onSkip}
            variant="secondary"
          >
            Skip for now
          </Button>
        </div>
      ) : null}
    </Card>
  );
}

export function ProfileOnboardingStepPage() {
  const { stepSegment } = useParams();
  const step = getOnboardingStepBySegment(stepSegment);
  const { isAuthenticated } = useAuth();
  const profileQuery = useMyProfile(isAuthenticated);

  if (!step) {
    return <Navigate replace to={ROUTES.SYSTEM.NOT_FOUND} />;
  }

  if (profileQuery.isLoading) {
    return <PageLoader description="Loading saved profile draft values." title="Loading step" />;
  }

  if (profileQuery.isError) {
    return (
      <ErrorState
        description={profileQuery.error?.message}
        onPrimaryAction={() => profileQuery.refetch()}
        primaryActionText="Try again"
        title="Profile step could not be loaded"
      />
    );
  }

  const profile = getProfilePayload(profileQuery.data);

  return (
    <ProfileOnboardingStepEditor
      key={`${step.id}-${profile?.updatedAt ?? profileQuery.dataUpdatedAt}`}
      profile={profile}
      step={step}
    />
  );
}

function ProfileOnboardingStepEditor({ profile, step }) {
  const navigate = useNavigate();
  const sectionMutation = useUpdateProfileSection();
  const progressMutation = useUpdateOnboardingProgress();
  const [values, setValues] = useState(() => getInitialValues(step, profile));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const previousStep = getPreviousStep(step.id);
  const nextStep = getNextStep(step.id);
  const isSaving = sectionMutation.isPending;
  const isSkipping = progressMutation.isPending;

  function handleChange(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  }

  async function saveStep({ continueAfterSave = false } = {}) {
    const nextErrors = validateStepPayload(step, values);
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    const completedStepIds = buildCompletedStepIds(profile, step.id);
    const currentStepId = continueAfterSave && nextStep ? nextStep.id : step.id;

    try {
      await sectionMutation.mutateAsync({
        payload: {
          currentStepId,
          data: buildStepSectionPayload(step, values),
          onboardingProgress: {
            completedStepIds,
            currentStepId,
            lastCompletedStepId: step.id,
            lastEditedSection: step.section,
            sectionProgress: calculateSectionProgress(completedStepIds),
          },
        },
        sectionKey: getUpdateSectionKeyForStep(step),
      });

      if (continueAfterSave && nextStep) {
        navigate(getStepPath(nextStep));
      }
    } catch (error) {
      setSubmitError(error?.message || "This profile step could not be saved.");
    }
  }

  async function skipStep() {
    const skippedStepIds = buildSkippedStepIds(profile, step.id);
    const currentStepId = nextStep?.id ?? step.id;

    try {
      await progressMutation.mutateAsync({
        currentStepId,
        lastEditedSection: step.section,
        skippedStepIds,
      });

      if (nextStep) {
        navigate(getStepPath(nextStep));
      }
    } catch (error) {
      setSubmitError(error?.message || "This onboarding step could not be skipped.");
    }
  }

  const canEdit = isStepImplemented(step.id);
  const canSkip = step.skippable || isStepPlaceholder(step.id);

  return (
    <div className="grid gap-6">
      <PageHeader
        backFallback={ROUTES.PROVIDER.PROFILE_ONBOARDING}
        description={step.description}
        eyebrow={`Step ${step.order} of 45`}
        showBack
        title={step.title}
        actions={
          <Button as={Link} to={ROUTES.PROVIDER.PROFILE_ONBOARDING} variant="secondary">
            All steps
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid min-w-0 gap-4">
          {canEdit ? (
            <Card padding="lg">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={isPublicFacingStep(step) ? "primary" : "outline"}>
                  {step.privacyLevel}
                </Badge>
                {step.required ? <Badge variant="warning">Required</Badge> : <Badge variant="default">Optional</Badge>}
              </div>

              <div className="mt-6 grid gap-5">
                <StepFields errors={errors} onChange={handleChange} step={step} values={values} />
              </div>

              {submitError ? (
                <p className="mt-5 rounded-[var(--radius-card)] border border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-3 text-sm font-semibold text-[var(--color-danger-strong)]" role="alert">
                  {submitError}
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  iconLeft={<CheckCircle2 className="h-4 w-4" />}
                  isLoading={isSaving}
                  onClick={() => saveStep({ continueAfterSave: false })}
                >
                  Save draft
                </Button>
                <Button
                  iconRight={<ArrowRight className="h-4 w-4" />}
                  isLoading={isSaving}
                  onClick={() => saveStep({ continueAfterSave: true })}
                  variant="secondary"
                >
                  Save and continue
                </Button>
                {canSkip ? (
                  <Button
                    isLoading={isSkipping}
                    onClick={skipStep}
                    variant="ghost"
                  >
                    Skip
                  </Button>
                ) : null}
              </div>
            </Card>
          ) : (
            <StepPlaceholder canSkip={canSkip} isSkipping={isSkipping} onSkip={skipStep} step={step} />
          )}
        </div>

        <aside className="grid gap-4 self-start">
          <Card padding="lg">
            <CardTitle as="h2">Navigation</CardTitle>
            <CardDescription>Move between adjacent onboarding steps safely.</CardDescription>
            <div className="mt-5 grid gap-3">
              {previousStep ? (
                <Button as={Link} iconLeft={<ArrowLeft className="h-4 w-4" />} to={getStepPath(previousStep)} variant="secondary">
                  Previous
                </Button>
              ) : null}
              {nextStep ? (
                <Button as={Link} iconRight={<ArrowRight className="h-4 w-4" />} to={getStepPath(nextStep)} variant="secondary">
                  Next
                </Button>
              ) : null}
            </div>
          </Card>

          <Card padding="lg">
            <CardTitle as="h2">Privacy note</CardTitle>
            <CardDescription>
              This form saves to your private draft. Public profile output is generated separately by the backend projection.
            </CardDescription>
          </Card>
        </aside>
      </div>
    </div>
  );
}
