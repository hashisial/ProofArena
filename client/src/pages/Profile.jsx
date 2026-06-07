import { useRef, useState } from "react";
import { AddSectionModal } from "../components/profile/AddSectionModal.jsx";
import { AboutSection } from "../components/profile/AboutSection.jsx";
import { ActivitySection } from "../components/profile/ActivitySection.jsx";
import { CoverPhotoModal } from "../components/profile/CoverPhotoModal.jsx";
import { EditAboutModal } from "../components/profile/EditAboutModal.jsx";
import { EducationSection } from "../components/profile/EducationSection.jsx";
import { EditEducationModal } from "../components/profile/EditEducationModal.jsx";
import { EditExperienceModal } from "../components/profile/EditExperienceModal.jsx";
import { EditIntroModal } from "../components/profile/EditIntroModal.jsx";
import { EditServiceModal } from "../components/profile/EditServiceModal.jsx";
import { EditSkillsModal } from "../components/profile/EditSkillsModal.jsx";
import { EnhanceProfilePanel } from "../components/profile/EnhanceProfilePanel.jsx";
import { ExperienceSection } from "../components/profile/ExperienceSection.jsx";
import { OpenToModal } from "../components/profile/OpenToModal.jsx";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { ProfileAnalytics } from "../components/profile/ProfileAnalytics.jsx";
import { ProfileHeader } from "../components/profile/ProfileHeader.jsx";
import { ProfilePhotoModal } from "../components/profile/ProfilePhotoModal.jsx";
import { ProfileVisibilityCard } from "../components/profile/ProfileVisibilityCard.jsx";
import { ServicesSection } from "../components/profile/ServicesSection.jsx";
import { SkillsSection } from "../components/profile/SkillsSection.jsx";
import { VerificationRequestModal } from "../components/profile/VerificationRequestModal.jsx";
import { VerificationStatusCard } from "../components/profile/VerificationStatusCard.jsx";
import { VerifiedOutcomesSection } from "../components/profile/VerifiedOutcomesSection.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { PageLoader } from "../components/ui/PageLoader.jsx";
import { useAuth } from "../features/auth/useAuth.js";
import {
  useMyProfile,
  useMyProfileAnalytics,
  usePrivacySettings,
  useAddEducation,
  useAddExperience,
  useAddService,
  useDeleteEducation,
  useDeleteExperience,
  useDeleteService,
  useRequestVerification,
  useUpdateAbout,
  useUpdateAvatar,
  useUpdateCoverImage,
  useUpdateEducation,
  useUpdateExperience,
  useUpdateIntro,
  useUpdateOpenTo,
  useUpdateService,
  useUpdateSkills,
  useVerificationStatus,
} from "../features/profile/useProfile.js";

function ProfileError({ message }) {
  return (
    <Card className="rounded-3xl" padding="lg">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7C3AED]">
        Profile unavailable
      </p>
      <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#07030D]">
        Profile could not be loaded
      </h1>
      <p className="mt-3 text-sm leading-6 text-[#6F657C]">
        {message || "We could not load your profile workspace. Try refreshing the page."}
      </p>
      <Button className="mt-5" onClick={() => window.location.reload()} type="button">
        Refresh
      </Button>
    </Card>
  );
}

export function Profile() {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const enhancePanelRef = useRef(null);
  const { isAuthenticated, user } = useAuth();
  const { data, error, isError, isLoading } = useMyProfile(isAuthenticated);
  const analyticsQuery = useMyProfileAnalytics(isAuthenticated);
  const verificationQuery = useVerificationStatus(isAuthenticated);
  const privacyQuery = usePrivacySettings(isAuthenticated);
  const updateAvatarMutation = useUpdateAvatar();
  const updateAboutMutation = useUpdateAbout();
  const updateCoverMutation = useUpdateCoverImage();
  const updateIntroMutation = useUpdateIntro();
  const updateSkillsMutation = useUpdateSkills();
  const addExperienceMutation = useAddExperience();
  const updateExperienceMutation = useUpdateExperience();
  const deleteExperienceMutation = useDeleteExperience();
  const addEducationMutation = useAddEducation();
  const updateEducationMutation = useUpdateEducation();
  const deleteEducationMutation = useDeleteEducation();
  const addServiceMutation = useAddService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();
  const updateOpenToMutation = useUpdateOpenTo();
  const requestVerificationMutation = useRequestVerification();
  const profileData = data
    ? {
        ...data,
        user: data.user ?? user,
      }
    : null;
  const profile = profileData?.profile ?? {};
  const providerProfile = profileData?.providerProfile ?? null;
  const analyticsData = analyticsQuery.data ?? {};
  const verificationStatus = verificationQuery.data ?? profile.verificationBadge ?? {};

  if (isLoading && !profileData) {
    return (
      <PageLoader
        description="Loading your owner controls, analytics, and public profile sections."
        title="Loading your ProofArena profile"
      />
    );
  }

  if (isError) {
    return <ProfileError message={error?.message} />;
  }

  if (!profileData) {
    return <ProfileError message="Profile data was not returned by the API." />;
  }

  function closeModal() {
    setActiveModal(null);
    setSelectedEducation(null);
    setSelectedExperience(null);
    setSelectedService(null);
  }

  function handleEnhanceProfile() {
    enhancePanelRef.current?.scrollIntoView?.({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleSectionPlaceholder() {
    setActiveModal("addSection");
  }

  function openAddExperience() {
    setSelectedExperience(null);
    setActiveModal("editExperience");
  }

  function openEditExperience(item) {
    setSelectedExperience(item);
    setActiveModal("editExperience");
  }

  function openAddEducation() {
    setSelectedEducation(null);
    setActiveModal("editEducation");
  }

  function openEditEducation(item) {
    setSelectedEducation(item);
    setActiveModal("editEducation");
  }

  function openAddService() {
    setSelectedService(null);
    setActiveModal("editService");
  }

  function openEditService(item) {
    setSelectedService(item);
    setActiveModal("editService");
  }

  function getItemId(item) {
    return item?._id || item?.id;
  }

  const editableSkills =
    Array.isArray(profile.skills) && profile.skills.length > 0
      ? profile.skills
      : providerProfile?.skills ?? [];

  function getPublicProfileUrl() {
    const username = profileData.user?.username;
    return username
      ? `${window.location.origin}/profile/${username}`
      : window.location.href;
  }

  async function handleMoreAction(action) {
    if (action === "copyProfileLink") {
      await navigator.clipboard?.writeText(getPublicProfileUrl());
      return;
    }

    if (action === "viewAsPublic") {
      window.location.href = getPublicProfileUrl();
      return;
    }

    if (action === "profileSettings") {
      window.location.href = "/settings";
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-5 pb-20">
      <PageHeader
        backFallback="/dashboard"
        description="Control your public ProofArena profile and proof-based reputation."
        eyebrow="Profile"
        showBack
        title="Profile"
      />

      <ProfileHeader
        isOwner
        onAddSection={() => setActiveModal("addSection")}
        onEditAvatar={() => setActiveModal("profilePhoto")}
        onEditCover={() => setActiveModal("coverPhoto")}
        onEditIntro={() => setActiveModal("editIntro")}
        onEnhanceProfile={handleEnhanceProfile}
        onMore={handleMoreAction}
        onOpenTo={() => setActiveModal("openTo")}
        onRequestVerification={() => setActiveModal("verificationRequest")}
        profileData={profileData}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-start">
        <div className="grid min-w-0 gap-5">
          <ProfileAnalytics
            activitySummary={analyticsData.activitySummary ?? profile.activitySummary}
            analytics={analyticsData.analytics ?? profile.analytics}
            isLoading={analyticsQuery.isLoading}
            isOwner
            profile={profile}
            profileCompletion={analyticsData.profileCompletion ?? profile.profileCompletion}
          />
          <AboutSection isOwner onEdit={() => setActiveModal("editAbout")} profile={profile} />
          <ActivitySection isOwner onCreatePost={handleSectionPlaceholder} profile={profile} />
          <ExperienceSection
            experience={profile.experience}
            isOwner
            onAdd={openAddExperience}
            onEditItem={openEditExperience}
          />
          <EducationSection
            education={profile.education}
            isOwner
            onAdd={openAddEducation}
            onEditItem={openEditEducation}
          />
          <SkillsSection
            isOwner
            onAdd={() => setActiveModal("editSkills")}
            onEdit={() => setActiveModal("editSkills")}
            profile={profile}
            providerProfile={providerProfile}
          />
          <ServicesSection
            isOwner
            onAdd={openAddService}
            onEditItem={openEditService}
            providerProfile={providerProfile}
            services={profile.services}
          />
          <VerifiedOutcomesSection isOwner providerProfile={providerProfile} />
        </div>

        <div className="min-w-0 lg:sticky lg:top-24" ref={enhancePanelRef}>
          <div className="mb-5">
            <ProfileVisibilityCard
              privacyData={privacyQuery.data}
              profileData={profileData}
            />
          </div>
          <div className="mb-5">
            <VerificationStatusCard
              isLoading={verificationQuery.isLoading}
              onRequest={() => setActiveModal("verificationRequest")}
              verification={verificationStatus}
            />
          </div>
          <EnhanceProfilePanel
            onAddSection={() => setActiveModal("addSection")}
            onEditIntro={() => setActiveModal("editIntro")}
            profileData={profileData}
          />
        </div>
      </div>

      {activeModal === "editIntro" ? (
        <EditIntroModal
          isSubmitting={updateIntroMutation.isPending}
          onClose={closeModal}
          onSubmit={(payload) => updateIntroMutation.mutateAsync(payload)}
          open
          profileData={profileData}
        />
      ) : null}
      {activeModal === "editAbout" ? (
        <EditAboutModal
          isSubmitting={updateAboutMutation.isPending}
          onClose={closeModal}
          onSubmit={(payload) => updateAboutMutation.mutateAsync(payload)}
          open
          profile={profile}
        />
      ) : null}
      {activeModal === "editSkills" ? (
        <EditSkillsModal
          isSubmitting={updateSkillsMutation.isPending}
          onClose={closeModal}
          onSubmit={(payload) => updateSkillsMutation.mutateAsync(payload)}
          open
          skills={editableSkills}
        />
      ) : null}
      {activeModal === "editExperience" ? (
        <EditExperienceModal
          initialData={selectedExperience ?? {}}
          isDeleting={deleteExperienceMutation.isPending}
          isSubmitting={addExperienceMutation.isPending || updateExperienceMutation.isPending}
          mode={selectedExperience ? "edit" : "add"}
          onClose={closeModal}
          onDelete={() => deleteExperienceMutation.mutateAsync(getItemId(selectedExperience))}
          onSubmit={(payload) =>
            selectedExperience
              ? updateExperienceMutation.mutateAsync({
                  experienceId: getItemId(selectedExperience),
                  payload,
                })
              : addExperienceMutation.mutateAsync(payload)
          }
          open
        />
      ) : null}
      {activeModal === "editEducation" ? (
        <EditEducationModal
          initialData={selectedEducation ?? {}}
          isDeleting={deleteEducationMutation.isPending}
          isSubmitting={addEducationMutation.isPending || updateEducationMutation.isPending}
          mode={selectedEducation ? "edit" : "add"}
          onClose={closeModal}
          onDelete={() => deleteEducationMutation.mutateAsync(getItemId(selectedEducation))}
          onSubmit={(payload) =>
            selectedEducation
              ? updateEducationMutation.mutateAsync({
                  educationId: getItemId(selectedEducation),
                  payload,
                })
              : addEducationMutation.mutateAsync(payload)
          }
          open
        />
      ) : null}
      {activeModal === "editService" ? (
        <EditServiceModal
          initialData={selectedService ?? {}}
          isDeleting={deleteServiceMutation.isPending}
          isSubmitting={addServiceMutation.isPending || updateServiceMutation.isPending}
          mode={selectedService ? "edit" : "add"}
          onClose={closeModal}
          onDelete={() => deleteServiceMutation.mutateAsync(getItemId(selectedService))}
          onSubmit={(payload) =>
            selectedService
              ? updateServiceMutation.mutateAsync({
                  payload,
                  serviceId: getItemId(selectedService),
                })
              : addServiceMutation.mutateAsync(payload)
          }
          open
        />
      ) : null}
      {activeModal === "openTo" ? (
        <OpenToModal
          isSubmitting={updateOpenToMutation.isPending}
          onClose={closeModal}
          onSubmit={(payload) => updateOpenToMutation.mutateAsync(payload)}
          open
          profileData={profileData}
        />
      ) : null}
      {activeModal === "verificationRequest" ? (
        <VerificationRequestModal
          currentStatus={verificationStatus}
          isSubmitting={requestVerificationMutation.isPending}
          onClose={closeModal}
          onSubmit={(payload) => requestVerificationMutation.mutateAsync(payload)}
          open
        />
      ) : null}
      {activeModal === "addSection" ? (
        <AddSectionModal onClose={closeModal} open />
      ) : null}
      {activeModal === "profilePhoto" ? (
        <ProfilePhotoModal
          currentAvatar={profileData.user?.avatar}
          isUploading={updateAvatarMutation.isPending}
          onClose={closeModal}
          onUpload={(file) => updateAvatarMutation.mutateAsync({ file })}
          open
          userName={profileData.user?.fullName || profileData.user?.username}
        />
      ) : null}
      {activeModal === "coverPhoto" ? (
        <CoverPhotoModal
          currentCover={profile.coverImage}
          isUploading={updateCoverMutation.isPending}
          onClose={closeModal}
          onUpload={(file) => updateCoverMutation.mutateAsync({ file })}
          open
        />
      ) : null}
    </div>
  );
}
