import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { PageLoader } from "../components/ui/PageLoader.jsx";
import { DYNAMIC_ROUTES, ROUTES, USER_ROLES } from "../constants/index.js";
import { AdminLayout } from "../layouts/AdminLayout.jsx";
import { AuthLayout } from "../layouts/AuthLayout.jsx";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";
import { PublicLayout } from "../layouts/PublicLayout.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { RoleRoute } from "./RoleRoute.jsx";

function lazyNamed(importer, exportName) {
  return lazy(() =>
    importer().then((module) => ({
      default: module[exportName],
    })),
  );
}

const routeShells = () => import("../pages/RouteShells.jsx");

const Account = lazyNamed(() => import("../pages/Account.jsx"), "Account");
const AdminDashboard = lazyNamed(() => import("../pages/AdminDashboard.jsx"), "AdminDashboard");
const AdminChallenges = lazyNamed(() => import("../pages/AdminChallenges.jsx"), "AdminChallenges");
const AdminOffers = lazyNamed(() => import("../pages/AdminOffers.jsx"), "AdminOffers");
const AdminProofAssets = lazyNamed(() => import("../pages/AdminProofAssets.jsx"), "AdminProofAssets");
const AdminProviders = lazyNamed(() => import("../pages/AdminProviders.jsx"), "AdminProviders");
const AdminReports = lazyNamed(() => import("../pages/AdminReports.jsx"), "AdminReports");
const AdminUsers = lazyNamed(() => import("../pages/AdminUsers.jsx"), "AdminUsers");
const AdminVerification = lazyNamed(() => import("../pages/AdminVerification.jsx"), "AdminVerification");
const ChallengeBuilder = lazyNamed(() => import("../pages/ChallengeBuilder.jsx"), "ChallengeBuilder");
const ChallengeDetail = lazyNamed(() => import("../pages/ChallengeDetail.jsx"), "ChallengeDetail");
const ChallengePlans = lazyNamed(() => import("../pages/ChallengePlans.jsx"), "ChallengePlans");
const Challenges = lazyNamed(() => import("../pages/Challenges.jsx"), "Challenges");
const ClientExecutionPlanDetail = lazyNamed(() => import("../pages/ClientExecutionPlanDetail.jsx"), "ClientExecutionPlanDetail");
const ClientWorkspace = lazyNamed(() => import("../pages/ClientWorkspace.jsx"), "ClientWorkspace");
const Connections = lazyNamed(() => import("../pages/Connections.jsx"), "Connections");
const Dashboard = lazyNamed(() => import("../pages/Dashboard.jsx"), "Dashboard");
const ExecutionPlanBuilder = lazyNamed(() => import("../pages/ExecutionPlanBuilder.jsx"), "ExecutionPlanBuilder");
const ExecutionPlanDetail = lazyNamed(() => import("../pages/ExecutionPlanDetail.jsx"), "ExecutionPlanDetail");
const ExecutionPlans = lazyNamed(() => import("../pages/ExecutionPlans.jsx"), "ExecutionPlans");
const FirstClientMode = lazyNamed(() => import("../pages/FirstClientMode.jsx"), "FirstClientMode");
const Forbidden = lazyNamed(() => import("../pages/Forbidden.jsx"), "Forbidden");
const ForgotPassword = lazyNamed(() => import("../pages/ForgotPassword.jsx"), "ForgotPassword");
const Home = lazyNamed(() => import("../pages/Home.jsx"), "Home");
const LeadManagement = lazyNamed(() => import("../pages/LeadManagement.jsx"), "LeadManagement");
const Login = lazyNamed(() => import("../pages/Login.jsx"), "Login");
const Marketplace = lazyNamed(() => import("../pages/Marketplace.jsx"), "Marketplace");
const MatchedChallenges = lazyNamed(() => import("../pages/MatchedChallenges.jsx"), "MatchedChallenges");
const Messages = lazyNamed(() => import("../pages/Messages.jsx"), "Messages");
const MyChallenges = lazyNamed(() => import("../pages/MyChallenges.jsx"), "MyChallenges");
const Network = lazyNamed(() => import("../pages/Network.jsx"), "Network");
const NotFound = lazyNamed(() => import("../pages/NotFound.jsx"), "NotFound");
const Notifications = lazyNamed(() => import("../pages/Notifications.jsx"), "Notifications");
const OutcomeOfferBuilder = lazyNamed(() => import("../pages/OutcomeOfferBuilder.jsx"), "OutcomeOfferBuilder");
const OutcomeOfferDetail = lazyNamed(() => import("../pages/OutcomeOfferDetail.jsx"), "OutcomeOfferDetail");
const OutcomeOffers = lazyNamed(() => import("../pages/OutcomeOffers.jsx"), "OutcomeOffers");
const OpportunityPipeline = lazyNamed(() => import("../pages/OpportunityPipeline.jsx"), "OpportunityPipeline");
const Payments = lazyNamed(() => import("../pages/Payments.jsx"), "Payments");
const Portfolio = lazyNamed(() => import("../pages/Portfolio.jsx"), "Portfolio");
const Profile = lazyNamed(() => import("../pages/Profile.jsx"), "Profile");
const ProofAssetDetail = lazyNamed(() => import("../pages/ProofAssetDetail.jsx"), "ProofAssetDetail");
const ProofVault = lazyNamed(() => import("../pages/ProofVault.jsx"), "ProofVault");
const Projects = lazyNamed(() => import("../pages/Projects.jsx"), "Projects");
const ProviderServices = lazyNamed(() => import("../pages/ProviderServices.jsx"), "ProviderServices");
const ProviderCompare = lazyNamed(() => import("../pages/ProviderCompare.jsx"), "ProviderCompare");
const Providers = lazyNamed(() => import("../pages/Providers.jsx"), "Providers");
const PublicChallenge = lazyNamed(() => import("../pages/PublicChallenge.jsx"), "PublicChallenge");
const PublicOutcomeOffer = lazyNamed(() => import("../pages/PublicOutcomeOffer.jsx"), "PublicOutcomeOffer");
const RecommendedProviders = lazyNamed(() => import("../pages/RecommendedProviders.jsx"), "RecommendedProviders");
const Register = lazyNamed(() => import("../pages/Register.jsx"), "Register");
const ResetPassword = lazyNamed(() => import("../pages/ResetPassword.jsx"), "ResetPassword");
const Saved = lazyNamed(() => import("../pages/Saved.jsx"), "Saved");
const SavedProviders = lazyNamed(() => import("../pages/SavedProviders.jsx"), "SavedProviders");
const Scraper = lazyNamed(() => import("../pages/Scraper.jsx"), "Scraper");
const ServerError = lazyNamed(() => import("../pages/ServerError.jsx"), "ServerError");
const Services = lazyNamed(() => import("../pages/Services.jsx"), "Services");
const Settings = lazyNamed(() => import("../pages/Settings.jsx"), "Settings");
const StarterChallenges = lazyNamed(() => import("../pages/StarterChallenges.jsx"), "StarterChallenges");
const VerifyEmail = lazyNamed(() => import("../pages/VerifyEmail.jsx"), "VerifyEmail");

const AdminDisputes = lazyNamed(routeShells, "AdminDisputes");
const AdminProofReview = lazyNamed(routeShells, "AdminProofReview");
const AdminSettings = lazyNamed(routeShells, "AdminSettings");
const Billing = lazyNamed(routeShells, "Billing");
const Blog = lazyNamed(routeShells, "Blog");
const CaseStudies = lazyNamed(routeShells, "CaseStudies");
const ContactPlaceholder = lazyNamed(routeShells, "ContactPlaceholder");
const HelpCenter = lazyNamed(routeShells, "HelpCenter");
const HowItWorks = lazyNamed(routeShells, "HowItWorks");
const Leaderboard = lazyNamed(routeShells, "Leaderboard");
const MarketplaceCategoryRoute = lazyNamed(routeShells, "MarketplaceCategoryRoute");
const Pricing = lazyNamed(routeShells, "Pricing");
const PrivacyPolicy = lazyNamed(routeShells, "PrivacyPolicy");
const ProofLedger = lazyNamed(routeShells, "ProofLedger");
const ProofWorkspace = lazyNamed(routeShells, "ProofWorkspace");
const ProviderProfileRoute = lazyNamed(routeShells, "ProviderProfileRoute");
const PublicProfileRoute = lazyNamed(routeShells, "PublicProfileRoute");
const Resources = lazyNamed(routeShells, "Resources");
const ServiceDetailRoute = lazyNamed(routeShells, "ServiceDetailRoute");
const TermsOfService = lazyNamed(routeShells, "TermsOfService");
const TrustSafety = lazyNamed(routeShells, "TrustSafety");

function routeSegment(route) {
  return route.replace(/^\//, "");
}

export function AppRoutes() {
  return (
    <Suspense
      fallback={
        <PageLoader
          description="Loading the ProofArena experience."
          title="Loading ProofArena"
        />
      }
    >
      <Routes>
        <Route element={<PublicLayout />}>
          <Route element={<Home />} index />
          <Route element={<HowItWorks />} path={routeSegment(ROUTES.HOW_IT_WORKS)} />
          <Route element={<Challenges />} path={routeSegment(ROUTES.CHALLENGES)} />
          <Route element={<PublicChallenge />} path={routeSegment(DYNAMIC_ROUTES.PUBLIC_CHALLENGE)} />
          <Route element={<Providers />} path={routeSegment(ROUTES.PROVIDERS)} />
          <Route element={<ProviderCompare />} path={routeSegment(ROUTES.PROVIDER_COMPARE)} />
          <Route element={<ProviderProfileRoute />} path={routeSegment(DYNAMIC_ROUTES.PROVIDER_PROFILE)} />
          <Route element={<ProofLedger />} path={routeSegment(ROUTES.PROOF_LEDGER)} />
          <Route element={<Leaderboard />} path={routeSegment(ROUTES.LEADERBOARD)} />
          <Route element={<PublicOutcomeOffer />} path={routeSegment(DYNAMIC_ROUTES.PUBLIC_OUTCOME_OFFER)} />
          <Route element={<Blog />} path={routeSegment(ROUTES.BLOG)} />
          <Route element={<ContactPlaceholder />} path={routeSegment(ROUTES.CONTACT)} />
          <Route element={<Resources />} path={routeSegment(ROUTES.RESOURCES)} />
          <Route element={<CaseStudies />} path={routeSegment(ROUTES.CASE_STUDIES)} />
          <Route element={<HelpCenter />} path={routeSegment(ROUTES.HELP)} />
          <Route element={<Pricing />} path={routeSegment(ROUTES.PRICING)} />
          <Route element={<PrivacyPolicy />} path={routeSegment(ROUTES.PRIVACY)} />
          <Route element={<TermsOfService />} path={routeSegment(ROUTES.TERMS)} />
          <Route element={<TrustSafety />} path={routeSegment(ROUTES.TRUST_SAFETY)} />
          <Route element={<PublicProfileRoute />} path={routeSegment(DYNAMIC_ROUTES.PUBLIC_PROFILE)} />
          <Route element={<PublicProfileRoute />} path={routeSegment(DYNAMIC_ROUTES.LEGACY_PUBLIC_PROFILE)} />
          <Route element={<Marketplace />} path={routeSegment(ROUTES.MARKETPLACE)} />
          <Route element={<MarketplaceCategoryRoute />} path={routeSegment(DYNAMIC_ROUTES.MARKETPLACE_CATEGORY)} />
          <Route element={<ServiceDetailRoute />} path={routeSegment(DYNAMIC_ROUTES.MARKETPLACE_SERVICE)} />
          <Route element={<Portfolio />} path={routeSegment(ROUTES.PORTFOLIO)} />
          <Route element={<Services />} path={routeSegment(ROUTES.SERVICES)} />
          <Route element={<Forbidden />} path={routeSegment(ROUTES.FORBIDDEN)} />
          <Route element={<ServerError />} path={routeSegment(ROUTES.SERVER_ERROR)} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route element={<Login />} path={routeSegment(ROUTES.LOGIN)} />
          <Route element={<Register />} path={routeSegment(ROUTES.REGISTER)} />
          <Route element={<ForgotPassword />} path={routeSegment(ROUTES.FORGOT_PASSWORD)} />
          <Route element={<ResetPassword />} path={routeSegment(ROUTES.RESET_PASSWORD)} />
          <Route element={<VerifyEmail />} path={routeSegment(ROUTES.VERIFY_EMAIL)} />
          <Route element={<VerifyEmail />} path={routeSegment(ROUTES.RESEND_VERIFICATION)} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route element={<Dashboard />} path={routeSegment(ROUTES.DASHBOARD)} />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><Dashboard /></RoleRoute>}
            path={routeSegment(ROUTES.PROVIDER_DASHBOARD)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.CLIENT]}><ClientWorkspace /></RoleRoute>}
            path={routeSegment(ROUTES.CLIENT_WORKSPACE)}
          />
          <Route element={<Account />} path={routeSegment(ROUTES.ACCOUNT)} />
          <Route element={<Connections />} path={routeSegment(ROUTES.CONNECTIONS)} />
          <Route element={<LeadManagement />} path={routeSegment(ROUTES.LEADS)} />
          <Route element={<Messages />} path={routeSegment(ROUTES.MESSAGES)} />
          <Route element={<Network />} path={routeSegment(ROUTES.NETWORK)} />
          <Route element={<Notifications />} path={routeSegment(ROUTES.NOTIFICATIONS)} />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.CLIENT]}><MyChallenges /></RoleRoute>}
            path={routeSegment(ROUTES.MY_CHALLENGES)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.CLIENT]}><ChallengeBuilder /></RoleRoute>}
            path={routeSegment(ROUTES.NEW_CHALLENGE)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.CLIENT]}><ChallengeBuilder /></RoleRoute>}
            path={routeSegment(DYNAMIC_ROUTES.EDIT_CHALLENGE)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.CLIENT]}><RecommendedProviders /></RoleRoute>}
            path={routeSegment(DYNAMIC_ROUTES.CHALLENGE_SHORTLISTED_PROVIDERS)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.CLIENT]}><RecommendedProviders /></RoleRoute>}
            path={routeSegment(DYNAMIC_ROUTES.CHALLENGE_PROVIDERS)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.CLIENT]}><RecommendedProviders /></RoleRoute>}
            path={routeSegment(DYNAMIC_ROUTES.PROVIDER_SELECTION)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.CLIENT]}><RecommendedProviders /></RoleRoute>}
            path={routeSegment(DYNAMIC_ROUTES.LEGACY_RECOMMENDED_PROVIDERS)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.CLIENT]}><ChallengePlans /></RoleRoute>}
            path={routeSegment(DYNAMIC_ROUTES.CHALLENGE_PLANS)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.CLIENT]}><ClientExecutionPlanDetail /></RoleRoute>}
            path={routeSegment(DYNAMIC_ROUTES.CLIENT_EXECUTION_PLAN)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.CLIENT]}><ChallengeDetail /></RoleRoute>}
            path={routeSegment(DYNAMIC_ROUTES.OWNER_CHALLENGE)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.CLIENT]}><SavedProviders /></RoleRoute>}
            path={routeSegment(ROUTES.SAVED_PROVIDERS)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><MatchedChallenges initialStatus="saved" key="saved-matches" /></RoleRoute>}
            path={routeSegment(ROUTES.SAVED_MATCHES)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><MatchedChallenges initialStatus="applied" key="applied-matches" /></RoleRoute>}
            path={routeSegment(ROUTES.APPLIED_MATCHES)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><MatchedChallenges key="all-matches" /></RoleRoute>}
            path={routeSegment(ROUTES.MATCHED_CHALLENGES)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><FirstClientMode /></RoleRoute>}
            path={routeSegment(ROUTES.FIRST_CLIENT_MODE)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><StarterChallenges /></RoleRoute>}
            path={routeSegment(ROUTES.STARTER_CHALLENGES)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><OpportunityPipeline /></RoleRoute>}
            path={routeSegment(ROUTES.OPPORTUNITY_PIPELINE)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><OpportunityPipeline /></RoleRoute>}
            path={routeSegment(DYNAMIC_ROUTES.OPPORTUNITY_DETAIL)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><ProofVault initialTab="readiness" /></RoleRoute>}
            path={routeSegment(ROUTES.PROOF_READINESS)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><ProofVault /></RoleRoute>}
            path={routeSegment(ROUTES.PROOF_VAULT)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><ProofAssetDetail /></RoleRoute>}
            path={routeSegment(DYNAMIC_ROUTES.PROOF_ASSET_DETAIL)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><ExecutionPlans /></RoleRoute>}
            path={routeSegment(ROUTES.MY_EXECUTION_PLANS)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><ExecutionPlanBuilder /></RoleRoute>}
            path={routeSegment(ROUTES.NEW_EXECUTION_PLAN)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><ExecutionPlanBuilder /></RoleRoute>}
            path={routeSegment(DYNAMIC_ROUTES.EDIT_EXECUTION_PLAN)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><ExecutionPlanDetail /></RoleRoute>}
            path={routeSegment(DYNAMIC_ROUTES.EXECUTION_PLAN_DETAIL)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><OutcomeOffers /></RoleRoute>}
            path={routeSegment(ROUTES.MY_OUTCOME_OFFERS)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><OutcomeOfferBuilder /></RoleRoute>}
            path={routeSegment(ROUTES.NEW_OUTCOME_OFFER)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><OutcomeOfferBuilder /></RoleRoute>}
            path={routeSegment(DYNAMIC_ROUTES.EDIT_OUTCOME_OFFER)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><OutcomeOfferDetail /></RoleRoute>}
            path={routeSegment(DYNAMIC_ROUTES.OWNER_OUTCOME_OFFER)}
          />
          <Route element={<Payments />} path={routeSegment(ROUTES.PAYMENTS)} />
          <Route element={<Profile />} path={routeSegment(ROUTES.PROFILE)} />
          <Route element={<Projects />} path={routeSegment(ROUTES.PROJECTS)} />
          <Route element={<ProofWorkspace />} path={routeSegment(ROUTES.PROOF)} />
          <Route element={<ProviderServices />} path={routeSegment(ROUTES.PROVIDER_SERVICES)} />
          <Route element={<Saved />} path={routeSegment(ROUTES.SAVED)} />
          <Route element={<Scraper />} path={routeSegment(ROUTES.SCRAPER)} />
          <Route element={<Settings />} path={routeSegment(ROUTES.SETTINGS)} />
          <Route element={<Billing />} path={routeSegment(ROUTES.BILLING)} />
        </Route>

        <Route
          element={
            <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route element={<AdminDashboard />} path={routeSegment(ROUTES.ADMIN)} />
          <Route element={<AdminUsers />} path={routeSegment(ROUTES.ADMIN_USERS)} />
          <Route element={<AdminProviders />} path={routeSegment(ROUTES.ADMIN_PROVIDERS)} />
          <Route element={<AdminChallenges />} path={routeSegment(ROUTES.ADMIN_CHALLENGES)} />
          <Route element={<AdminOffers />} path={routeSegment(ROUTES.ADMIN_OFFERS)} />
          <Route element={<AdminProofAssets />} path={routeSegment(ROUTES.ADMIN_PROOF_ASSETS)} />
          <Route element={<AdminProofReview />} path={routeSegment(ROUTES.ADMIN_PROOF_REVIEW)} />
          <Route element={<AdminReports />} path={routeSegment(ROUTES.ADMIN_REPORTS)} />
          <Route element={<AdminVerification />} path={routeSegment(ROUTES.ADMIN_VERIFICATION)} />
          <Route element={<AdminDisputes />} path={routeSegment(ROUTES.ADMIN_DISPUTES)} />
          <Route element={<AdminSettings />} path={routeSegment(ROUTES.ADMIN_SETTINGS)} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route element={<NotFound />} path="*" />
        </Route>
      </Routes>
    </Suspense>
  );
}
