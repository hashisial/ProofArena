import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { PageLoader } from "../components/ui/PageLoader.jsx";
import { ROUTES, USER_ROLES } from "../constants/index.js";
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
const Admin = lazyNamed(() => import("../pages/Admin.jsx"), "Admin");
const ChallengeBuilder = lazyNamed(() => import("../pages/ChallengeBuilder.jsx"), "ChallengeBuilder");
const ChallengeDetail = lazyNamed(() => import("../pages/ChallengeDetail.jsx"), "ChallengeDetail");
const ChallengePlans = lazyNamed(() => import("../pages/ChallengePlans.jsx"), "ChallengePlans");
const Challenges = lazyNamed(() => import("../pages/Challenges.jsx"), "Challenges");
const ClientExecutionPlanDetail = lazyNamed(() => import("../pages/ClientExecutionPlanDetail.jsx"), "ClientExecutionPlanDetail");
const Connections = lazyNamed(() => import("../pages/Connections.jsx"), "Connections");
const Dashboard = lazyNamed(() => import("../pages/Dashboard.jsx"), "Dashboard");
const ExecutionPlanBuilder = lazyNamed(() => import("../pages/ExecutionPlanBuilder.jsx"), "ExecutionPlanBuilder");
const ExecutionPlanDetail = lazyNamed(() => import("../pages/ExecutionPlanDetail.jsx"), "ExecutionPlanDetail");
const ExecutionPlans = lazyNamed(() => import("../pages/ExecutionPlans.jsx"), "ExecutionPlans");
const Forbidden = lazyNamed(() => import("../pages/Forbidden.jsx"), "Forbidden");
const ForgotPassword = lazyNamed(() => import("../pages/ForgotPassword.jsx"), "ForgotPassword");
const Home = lazyNamed(() => import("../pages/Home.jsx"), "Home");
const LeadManagement = lazyNamed(() => import("../pages/LeadManagement.jsx"), "LeadManagement");
const Login = lazyNamed(() => import("../pages/Login.jsx"), "Login");
const Marketplace = lazyNamed(() => import("../pages/Marketplace.jsx"), "Marketplace");
const Messages = lazyNamed(() => import("../pages/Messages.jsx"), "Messages");
const MyChallenges = lazyNamed(() => import("../pages/MyChallenges.jsx"), "MyChallenges");
const Network = lazyNamed(() => import("../pages/Network.jsx"), "Network");
const NotFound = lazyNamed(() => import("../pages/NotFound.jsx"), "NotFound");
const Notifications = lazyNamed(() => import("../pages/Notifications.jsx"), "Notifications");
const OutcomeOfferBuilder = lazyNamed(() => import("../pages/OutcomeOfferBuilder.jsx"), "OutcomeOfferBuilder");
const OutcomeOfferDetail = lazyNamed(() => import("../pages/OutcomeOfferDetail.jsx"), "OutcomeOfferDetail");
const OutcomeOffers = lazyNamed(() => import("../pages/OutcomeOffers.jsx"), "OutcomeOffers");
const Payments = lazyNamed(() => import("../pages/Payments.jsx"), "Payments");
const Portfolio = lazyNamed(() => import("../pages/Portfolio.jsx"), "Portfolio");
const Profile = lazyNamed(() => import("../pages/Profile.jsx"), "Profile");
const Projects = lazyNamed(() => import("../pages/Projects.jsx"), "Projects");
const ProviderServices = lazyNamed(() => import("../pages/ProviderServices.jsx"), "ProviderServices");
const Providers = lazyNamed(() => import("../pages/Providers.jsx"), "Providers");
const PublicChallenge = lazyNamed(() => import("../pages/PublicChallenge.jsx"), "PublicChallenge");
const PublicOutcomeOffer = lazyNamed(() => import("../pages/PublicOutcomeOffer.jsx"), "PublicOutcomeOffer");
const Register = lazyNamed(() => import("../pages/Register.jsx"), "Register");
const ResetPassword = lazyNamed(() => import("../pages/ResetPassword.jsx"), "ResetPassword");
const Saved = lazyNamed(() => import("../pages/Saved.jsx"), "Saved");
const Scraper = lazyNamed(() => import("../pages/Scraper.jsx"), "Scraper");
const ServerError = lazyNamed(() => import("../pages/ServerError.jsx"), "ServerError");
const Services = lazyNamed(() => import("../pages/Services.jsx"), "Services");
const Settings = lazyNamed(() => import("../pages/Settings.jsx"), "Settings");
const VerifyEmail = lazyNamed(() => import("../pages/VerifyEmail.jsx"), "VerifyEmail");

const AdminChallenges = lazyNamed(routeShells, "AdminChallenges");
const AdminDisputes = lazyNamed(routeShells, "AdminDisputes");
const AdminProofReview = lazyNamed(routeShells, "AdminProofReview");
const AdminProviders = lazyNamed(routeShells, "AdminProviders");
const AdminReports = lazyNamed(routeShells, "AdminReports");
const AdminSettings = lazyNamed(routeShells, "AdminSettings");
const AdminUsers = lazyNamed(routeShells, "AdminUsers");
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
          <Route element={<PublicChallenge />} path={`${routeSegment(ROUTES.CHALLENGES)}/:username/:slug`} />
          <Route element={<Providers />} path={routeSegment(ROUTES.PROVIDERS)} />
          <Route element={<ProviderProfileRoute />} path={`${routeSegment(ROUTES.PROVIDERS)}/:username`} />
          <Route element={<ProofLedger />} path={routeSegment(ROUTES.PROOF_LEDGER)} />
          <Route element={<Leaderboard />} path={routeSegment(ROUTES.LEADERBOARD)} />
          <Route element={<PublicOutcomeOffer />} path={`${routeSegment(ROUTES.OUTCOME_OFFERS)}/:username/:slug`} />
          <Route element={<Blog />} path={routeSegment(ROUTES.BLOG)} />
          <Route element={<ContactPlaceholder />} path={routeSegment(ROUTES.CONTACT)} />
          <Route element={<Resources />} path={routeSegment(ROUTES.RESOURCES)} />
          <Route element={<CaseStudies />} path={routeSegment(ROUTES.CASE_STUDIES)} />
          <Route element={<HelpCenter />} path={routeSegment(ROUTES.HELP)} />
          <Route element={<Pricing />} path={routeSegment(ROUTES.PRICING)} />
          <Route element={<PrivacyPolicy />} path={routeSegment(ROUTES.PRIVACY)} />
          <Route element={<TermsOfService />} path={routeSegment(ROUTES.TERMS)} />
          <Route element={<TrustSafety />} path={routeSegment(ROUTES.TRUST_SAFETY)} />
          <Route element={<PublicProfileRoute />} path={`${routeSegment(ROUTES.PROFILE)}/:username`} />
          <Route element={<PublicProfileRoute />} path="u/:username" />
          <Route element={<Marketplace />} path={routeSegment(ROUTES.MARKETPLACE)} />
          <Route element={<MarketplaceCategoryRoute />} path={`${routeSegment(ROUTES.MARKETPLACE)}/category/:categorySlug`} />
          <Route element={<ServiceDetailRoute />} path={`${routeSegment(ROUTES.MARKETPLACE)}/service/:serviceId`} />
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
            path={`${routeSegment(ROUTES.MY_CHALLENGES)}/new`}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.CLIENT]}><ChallengeBuilder /></RoleRoute>}
            path={`${routeSegment(ROUTES.MY_CHALLENGES)}/:challengeId/edit`}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.CLIENT]}><ChallengePlans /></RoleRoute>}
            path={`${routeSegment(ROUTES.MY_CHALLENGES)}/:challengeId/plans`}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.CLIENT]}><ClientExecutionPlanDetail /></RoleRoute>}
            path={`${routeSegment(ROUTES.MY_CHALLENGES)}/:challengeId/plans/:planId`}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.CLIENT]}><ChallengeDetail /></RoleRoute>}
            path={`${routeSegment(ROUTES.MY_CHALLENGES)}/:challengeId`}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><ExecutionPlans /></RoleRoute>}
            path={routeSegment(ROUTES.MY_EXECUTION_PLANS)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><ExecutionPlanBuilder /></RoleRoute>}
            path={`${routeSegment(ROUTES.MY_EXECUTION_PLANS)}/new`}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><ExecutionPlanBuilder /></RoleRoute>}
            path={`${routeSegment(ROUTES.MY_EXECUTION_PLANS)}/:planId/edit`}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><ExecutionPlanDetail /></RoleRoute>}
            path={`${routeSegment(ROUTES.MY_EXECUTION_PLANS)}/:planId`}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><OutcomeOffers /></RoleRoute>}
            path={routeSegment(ROUTES.MY_OUTCOME_OFFERS)}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><OutcomeOfferBuilder /></RoleRoute>}
            path={`${routeSegment(ROUTES.MY_OUTCOME_OFFERS)}/new`}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><OutcomeOfferBuilder /></RoleRoute>}
            path={`${routeSegment(ROUTES.MY_OUTCOME_OFFERS)}/:offerId/edit`}
          />
          <Route
            element={<RoleRoute allowedRoles={[USER_ROLES.PROVIDER]}><OutcomeOfferDetail /></RoleRoute>}
            path={`${routeSegment(ROUTES.MY_OUTCOME_OFFERS)}/:offerId`}
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
          <Route element={<Admin />} path={routeSegment(ROUTES.ADMIN)} />
          <Route element={<AdminUsers />} path={routeSegment(ROUTES.ADMIN_USERS)} />
          <Route element={<AdminProviders />} path={routeSegment(ROUTES.ADMIN_PROVIDERS)} />
          <Route element={<AdminChallenges />} path={routeSegment(ROUTES.ADMIN_CHALLENGES)} />
          <Route element={<AdminProofReview />} path={routeSegment(ROUTES.ADMIN_PROOF_REVIEW)} />
          <Route element={<AdminReports />} path={routeSegment(ROUTES.ADMIN_REPORTS)} />
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
