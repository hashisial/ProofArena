import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { Input } from "../components/ui/Input.jsx";
import { ROUTES } from "../constants/index.js";
import { getAuthErrorMessage } from "../features/auth/authFormUtils.js";
import { useAuth } from "../features/auth/useAuth.js";
import { getDefaultAuthenticatedRoute } from "../routes/authRouteUtils.js";
import { isRequired, isValidEmail } from "../utils/index.js";

const resendSuccessMessage =
  "If an unverified account exists with this email, verification instructions will be sent.";

function ResendVerificationForm({ initialEmail = "" }) {
  const [email, setEmail] = useState(initialEmail);
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [developmentEmail, setDevelopmentEmail] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const { resendVerification } = useAuth();

  function updateEmail(event) {
    setEmail(event.target.value);
    setEmailError("");
    setFormError("");
    setDevelopmentEmail(null);
    setSuccessMessage("");
  }

  function validateForm() {
    if (!isRequired(email)) {
      setEmailError("Email is required.");
      return false;
    }

    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }

    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setDevelopmentEmail(null);
    setFormError("");
    setSuccessMessage("");

    try {
      const response = await resendVerification({ email: email.trim() });
      setDevelopmentEmail(response.developmentEmail ?? response.data?.developmentEmail ?? null);
      setSuccessMessage(response.message || resendSuccessMessage);
    } catch (error) {
      setFormError(getAuthErrorMessage(error, "Unable to send verification instructions. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-5 grid gap-4" noValidate onSubmit={handleSubmit}>
      <Input
        autoComplete="email"
        error={emailError}
        id="resend-verification-email"
        label="Email"
        name="email"
        onChange={updateEmail}
        required
        type="email"
        value={email}
      />

      {formError ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {formError}
        </p>
      ) : null}

      {successMessage ? (
        <p className="rounded-2xl border border-[#3F6212]/20 bg-[#F7FEE7] px-4 py-3 text-sm font-semibold text-[#365314]">
          {successMessage}
        </p>
      ) : null}

      {developmentEmail?.previewUrl ? (
        <div className="rounded-2xl border border-[#A16207]/25 bg-[#FFFBEB] px-4 py-3 text-sm leading-6 text-[#57534E]">
          <p className="font-black text-[#1C1917]">Development email fallback active.</p>
          <p className="mt-1">
            SMTP is not configured, so the verification email was written to the local server outbox.
          </p>
          {developmentEmail.outboxPath ? (
            <p className="mt-2 break-all text-xs font-semibold text-[#78716C]">
              Outbox: {developmentEmail.outboxPath}
            </p>
          ) : null}
          <Button as="a" className="mt-3 w-full" href={developmentEmail.previewUrl} variant="outline">
            Open development verification link
          </Button>
        </div>
      ) : null}

      <Button
        className="w-full"
        disabled={isSubmitting}
        isLoading={isSubmitting}
        loadingLabel="Sending..."
        type="submit"
      >
        Send verification link
      </Button>
    </form>
  );
}

export function VerifyEmail({ forceResend = false }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const isResendRoute = forceResend || location.pathname === ROUTES.RESEND_VERIFICATION;
  const hasRequestedVerificationRef = useRef(false);
  const [status, setStatus] = useState(token && !isResendRoute ? "loading" : "missing");
  const [message, setMessage] = useState("");
  const [showResendForm, setShowResendForm] = useState(isResendRoute);
  const { isAuthenticated, user, verifyEmail } = useAuth();

  useEffect(() => {
    if (isResendRoute || !token || hasRequestedVerificationRef.current) {
      return;
    }

    hasRequestedVerificationRef.current = true;

    async function verifyToken() {
      try {
        await verifyEmail({ token });
        setStatus("success");
        setMessage("");
      } catch (error) {
        setStatus("error");
        setMessage(getAuthErrorMessage(error, "Verification link is invalid or expired."));
      }
    }

    verifyToken();
  }, [isResendRoute, token, verifyEmail]);

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isMissing = status === "missing";
  const isError = status === "error";

  return (
    <Card className="border-[#E7E5E4] shadow-[0_24px_80px_rgba(63, 98, 18, 0.12)]" padding="lg" variant="elevated">
      <CardHeader>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">
          Email verification
        </p>

        {isLoading ? (
          <>
            <CardTitle as="h1" className="text-3xl sm:text-4xl">
              Verifying your email
            </CardTitle>
            <CardDescription>
              Securing your ProofArena workspace.
            </CardDescription>
          </>
        ) : null}

        {isSuccess ? (
          <>
            <CardTitle as="h1" className="text-3xl sm:text-4xl">
              Email verified successfully
            </CardTitle>
            <CardDescription>
              Your ProofArena account is now verified. You can continue to your outcome workspace.
            </CardDescription>
          </>
        ) : null}

        {isError ? (
          <>
            <CardTitle as="h1" className="text-3xl sm:text-4xl">
              Verification link is invalid or expired
            </CardTitle>
            <CardDescription>
              Request a new verification link to continue securing your ProofArena account.
            </CardDescription>
          </>
        ) : null}

        {isMissing ? (
          <>
            <CardTitle as="h1" className="text-3xl sm:text-4xl">
              {isResendRoute ? "Request a new verification link" : "Verification token missing"}
            </CardTitle>
            <CardDescription>
              {isResendRoute
                ? "Enter your email and we will send verification instructions if an unverified account exists."
                : "The verification link is incomplete. Request a new email verification link."}
            </CardDescription>
          </>
        ) : null}
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="rounded-2xl border border-[#3F6212]/20 bg-[#F7FEE7] px-4 py-4 text-sm font-semibold leading-6 text-[#365314]">
            Verifying your account now.
          </div>
        ) : null}

        {isSuccess ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              as="a"
              className="w-full"
              href={getDefaultAuthenticatedRoute(user)}
            >
              Go to Dashboard
            </Button>
            <Button as="a" className="w-full" href={ROUTES.LOGIN} variant="outline">
              Go to Login
            </Button>
          </div>
        ) : null}

        {isError && message ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {message}
          </p>
        ) : null}

        {(isError || isMissing) ? (
          <div className="grid gap-3">
            {!showResendForm ? (
              <Button className="w-full" onClick={() => setShowResendForm(true)} type="button">
                Request new link
              </Button>
            ) : null}
            {showResendForm ? <ResendVerificationForm initialEmail={user?.email} /> : null}
            <Link className="text-center text-sm font-semibold text-[#365314] transition hover:text-[#3F6212] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70" to={ROUTES.LOGIN}>
              Back to Login
            </Link>
          </div>
        ) : null}

        {isSuccess && isAuthenticated ? (
          <p className="mt-5 rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] px-4 py-3 text-sm font-semibold text-[#57534E]">
            Your current session has been updated with verified email status.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function ResendVerification() {
  return <VerifyEmail forceResend />;
}
