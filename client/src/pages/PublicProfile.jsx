import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AboutSection } from "../components/profile/AboutSection.jsx";
import { ActivitySection } from "../components/profile/ActivitySection.jsx";
import { EducationSection } from "../components/profile/EducationSection.jsx";
import { ExperienceSection } from "../components/profile/ExperienceSection.jsx";
import { ProfileHeader } from "../components/profile/ProfileHeader.jsx";
import { PublicProfileSidebar } from "../components/profile/PublicProfileSidebar.jsx";
import { ServicesSection } from "../components/profile/ServicesSection.jsx";
import { SkillsSection } from "../components/profile/SkillsSection.jsx";
import { VerifiedOutcomesSection } from "../components/profile/VerifiedOutcomesSection.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { Container } from "../components/Container.jsx";
import { ROUTES } from "../constants/index.js";
import { useAuth } from "../features/auth/useAuth.js";
import { usePublicProfile, usePublicProfileActivity } from "../features/profile/useProfile.js";
import {
  useConnectionStatus,
  useFollowStatus,
  useFollowUser,
  useSendConnectionRequest,
  useUnfollowUser,
} from "../features/social/useSocialActions.js";
import { copyToClipboard } from "../utils/index.js";

function getProfileUrl(username) {
  if (typeof window === "undefined") {
    return `/profile/${username}`;
  }

  return `${window.location.origin}/profile/${username}`;
}

function getErrorState(error) {
  const status = error?.status ?? error?.statusCode;

  if (status === 403) {
    return {
      cta: "Explore Providers",
      description: "The profile owner has limited public visibility.",
      title: "This profile is private",
      type: "private",
    };
  }

  if (status === 404) {
    return {
      cta: "Explore Providers",
      description: "This profile may have been removed, renamed, or is no longer available.",
      title: "Profile not found",
      type: "notFound",
    };
  }

  return {
    cta: "Try again",
    description: "Something went wrong while loading this profile. Please try again.",
    title: "Profile could not be loaded",
    type: "network",
  };
}

function PublicProfileLoading() {
  return (
    <section className="bg-[#FFFBEB] py-8 text-[#1C1917] sm:py-12">
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
                <Skeleton className="h-28 w-28 rounded-full" />
                <Skeleton className="mt-5 h-5 w-full" />
                <Skeleton className="mt-3 h-5 w-2/3" />
              </Card>
              <Card className="rounded-3xl" padding="lg">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="mt-4 h-10 w-full rounded-full" />
                <Skeleton className="mt-3 h-10 w-full rounded-full" />
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function PublicProfileError({ error, onRetry }) {
  const state = getErrorState(error);

  return (
    <section className="bg-[#FFFBEB] py-12 sm:py-16">
      <Container>
        <Card className="mx-auto max-w-3xl rounded-3xl" padding="lg">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">
            Public profile
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#1C1917]">
            {state.title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#78716C]">{state.description}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {state.type === "network" ? (
              <Button onClick={onRetry} type="button">
                {state.cta}
              </Button>
            ) : (
              <Button as="a" href={ROUTES.PROVIDERS}>
                {state.cta}
              </Button>
            )}
            <Button as="a" href={ROUTES.HOME} variant="outline">
              Go Home
            </Button>
          </div>
        </Card>
      </Container>
    </section>
  );
}

export function PublicProfile({ username }) {
  const params = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user: authUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const statusTimerRef = useRef(null);
  const normalizedUsername = decodeURIComponent(username ?? params.username ?? "")
    .replace(/^\/+|\/+$/g, "")
    .trim()
    .toLowerCase();
  const { data, error, isError, isLoading, refetch } = usePublicProfile(normalizedUsername);
  const activityQuery = usePublicProfileActivity(normalizedUsername, Boolean(data));
  const profile = useMemo(() => data?.profile ?? {}, [data?.profile]);
  const profileWithActivity = useMemo(
    () => ({
      ...profile,
      activitySummary: activityQuery.data ?? profile.activitySummary,
    }),
    [activityQuery.data, profile],
  );
  const providerProfile = useMemo(() => data?.providerProfile ?? null, [data?.providerProfile]);
  const user = useMemo(() => data?.user ?? {}, [data?.user]);
  const targetUserId = user.id || user._id;
  const isSelfProfile = Boolean(authUser?.id && targetUserId && authUser.id === targetUserId);
  const socialActionsEnabled = Boolean(isAuthenticated && targetUserId && !isSelfProfile);
  const connectionStatusQuery = useConnectionStatus(targetUserId, socialActionsEnabled);
  const followStatusQuery = useFollowStatus(targetUserId, socialActionsEnabled);
  const sendConnectionMutation = useSendConnectionRequest();
  const followMutation = useFollowUser(normalizedUsername);
  const unfollowMutation = useUnfollowUser(normalizedUsername);
  const profileUrl = normalizedUsername ? getProfileUrl(normalizedUsername) : "";
  const connectionStatus = connectionStatusQuery.data?.status ?? "none";
  const isFollowed = Boolean(followStatusQuery.data?.followed);
  const connectLabel =
    connectionStatus === "connected"
      ? "Connected"
      : connectionStatus === "pending_sent"
        ? "Pending"
        : connectionStatus === "pending_received"
          ? "Respond"
          : "Connect";

  useEffect(() => {
    if (!data) {
      return undefined;
    }

    const fullName = user.fullName || user.name || user.username || "ProofArena Member";
    const description =
      profile.headline ||
      "View this ProofArena profile, services, skills, and verified outcome reputation.";
    const previousTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute("content");

    document.title = `${fullName} | ProofArena Profile`;
    metaDescription?.setAttribute("content", description);

    return () => {
      document.title = previousTitle;
      if (metaDescription && previousDescription !== null && previousDescription !== undefined) {
        metaDescription.setAttribute("content", previousDescription);
      }
    };
  }, [data, profile.headline, user.fullName, user.name, user.username]);

  useEffect(
    () => () => {
      window.clearTimeout(statusTimerRef.current);
    },
    [],
  );

  function showStatus(message) {
    setStatusMessage(message);
    window.clearTimeout(statusTimerRef.current);
    statusTimerRef.current = window.setTimeout(() => setStatusMessage(""), 3200);
  }

  async function handleCopyProfileLink() {
    const copied = await copyToClipboard(profileUrl);
    showStatus(copied ? "Profile link copied." : "Copy failed. Please copy the address manually.");
  }

  async function handleShareProfile() {
    const title = `${user.fullName || user.username || "ProofArena profile"} | ProofArena`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url: profileUrl });
        showStatus("Share sheet opened.");
        return;
      } catch {
        // User cancellation or unsupported platform path should fall back quietly.
      }
    }

    await handleCopyProfileLink();
  }

  async function handleConnect() {
    if (!isAuthenticated) {
      navigate(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(`/profile/${normalizedUsername}`)}`);
      return;
    }

    if (isSelfProfile) {
      showStatus("This is your profile.");
      return;
    }

    if (connectionStatus === "connected") {
      showStatus("You are already connected.");
      return;
    }

    if (connectionStatus === "pending_sent") {
      showStatus("Connection request is already pending.");
      return;
    }

    if (connectionStatus === "pending_received") {
      showStatus("Incoming request responses are available from Connections.");
      return;
    }

    try {
      await sendConnectionMutation.mutateAsync(targetUserId);
      showStatus("Connection request sent.");
    } catch (mutationError) {
      showStatus(mutationError.message || "Unable to send connection request.");
    }
  }

  function handleMessage() {
    if (isAuthenticated) {
      navigate(`${ROUTES.MESSAGES}?to=${encodeURIComponent(normalizedUsername)}`);
      return;
    }

    navigate(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(`/profile/${normalizedUsername}`)}`);
  }

  async function handleFollow() {
    if (!isAuthenticated) {
      navigate(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(`/profile/${normalizedUsername}`)}`);
      return;
    }

    if (isSelfProfile) {
      showStatus("You cannot follow your own profile.");
      return;
    }

    try {
      if (isFollowed || isFollowing) {
        await unfollowMutation.mutateAsync(targetUserId);
        setIsFollowing(false);
        showStatus("Unfollowed.");
        return;
      }

      await followMutation.mutateAsync(targetUserId);
      setIsFollowing(true);
      showStatus("Following.");
    } catch (mutationError) {
      setIsFollowing((current) => !current);
      showStatus(mutationError.message || "Follow action is unavailable right now.");
    }
  }

  function handleMore(action) {
    if (action === "copyProfileLink") {
      handleCopyProfileLink();
      return;
    }

    if (action === "shareProfile") {
      handleShareProfile();
      return;
    }

    if (action === "reportProfile") {
      showStatus("Profile reporting will be available in a later stage.");
    }
  }

  if (isLoading) {
    return <PublicProfileLoading />;
  }

  if (isError || !data) {
    return <PublicProfileError error={error} onRetry={() => refetch()} />;
  }

  return (
    <section className="bg-[#FFFBEB] py-8 text-[#1C1917] sm:py-12">
      <Container>
        <div className="mx-auto grid max-w-6xl gap-5 pb-20">
          <ProfileHeader
            followLabel={isFollowed || isFollowing ? "Following" : "Follow"}
            isOwner={false}
            onConnect={handleConnect}
            onFollow={handleFollow}
            onMessage={handleMessage}
            onMore={handleMore}
            profileData={data}
            connectLabel={connectLabel}
          />

          {statusMessage ? (
            <div
              className="rounded-2xl border border-[#D9F99D] bg-white px-4 py-3 text-sm font-bold text-[#365314] shadow-[0_16px_40px_rgba(63, 98, 18, 0.08)]"
              role="status"
            >
              {statusMessage}
            </div>
          ) : null}

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
            <main className="grid min-w-0 gap-5">
              <AboutSection profile={profile} />
              <ActivitySection profile={profileWithActivity} />
              <ExperienceSection experience={profile.experience} />
              <EducationSection education={profile.education} />
              <SkillsSection profile={profile} providerProfile={providerProfile} />
              <ServicesSection providerProfile={providerProfile} services={profile.services} />
              <VerifiedOutcomesSection providerProfile={providerProfile} />
            </main>

            <PublicProfileSidebar
              onCopyProfileLink={handleCopyProfileLink}
              profile={profile}
              providerProfile={providerProfile}
              statusMessage={statusMessage}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
