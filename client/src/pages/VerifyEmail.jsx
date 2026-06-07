import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { Input } from "../components/ui/Input.jsx";
import { ROUTES } from "../constants/index.js";
import { useAuth } from "../features/auth/useAuth.js";
import { isRequired, isValidEmail } from "../utils/index.js";

const resendSuccessMessage =
  "If an unverified account exists with this email, verification instructions will be sent.";

function getAuthError(error, fallback) {
  if (Array.isArray(error?.errors) && error.errors.length > 0) {
    return error.errors[0]?.message ?? fallback;
  }

  return error?.message ?? fallback;
}

function ResendVerificationForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { resendVerification } = useAuth();

  function updateEmail(event) {
    setEmail(event.target.value);
    setEmailError("");
    setFormError("");
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
    setFormError("");
    setSuccessMessage("");

    try {
      await resendVerification({ email: email.trim() });
      setSuccessMessage(resendSuccessMessage);
    } catch (error) {
      setFormError(getAuthError(error, "Unable to send verification instructions. Please try again."));
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
        <p className="rounded-2xl border border-[#7C3AED]/20 bg-[#F5F3FF] px-4 py-3 text-sm font-semibold text-[#5B21B6]">
          {successMessage}
        </p>
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

export function VerifyEmail() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const isResendRoute = location.pathname === ROUTES.RESEND_VERIFICATION;
  const hasRequestedVerificationRef = useRef(false);
  const [status, setStatus] = useState(token && !isResendRoute ? "loading" : "missing");
  const [message, setMessage] = useState("");
  const [showResendForm, setShowResendForm] = useState(isResendRoute);
  const { isAuthenticated, verifyEmail } = useAuth();

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
        setMessage(getAuthError(error, "Verification link is invalid or expired."));
      }
    }

    verifyToken();
  }, [isResendRoute, token, verifyEmail]);

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isMissing = status === "missing";
  const isError = status === "error";

  return (
    <Card className="border-[#E9E2F3] shadow-[0_24px_80px_rgba(124, 58, 237, 0.12)]" padding="lg" variant="elevated">
      <CardHeader>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7C3AED]">
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
          <div className="rounded-2xl border border-[#7C3AED]/20 bg-[#F5F3FF] px-4 py-4 text-sm font-semibold leading-6 text-[#5B21B6]">
            Verifying your account now.
          </div>
        ) : null}

        {isSuccess ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Button as="a" className="w-full" href={ROUTES.DASHBOARD}>
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
            {showResendForm ? <ResendVerificationForm /> : null}
            <Link className="text-center text-sm font-semibold text-[#5B21B6] transition hover:text-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70" to={ROUTES.LOGIN}>
              Back to Login
            </Link>
          </div>
        ) : null}

        {isSuccess && isAuthenticated ? (
          <p className="mt-5 rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] px-4 py-3 text-sm font-semibold text-[#6F657C]">
            Your current session has been updated with verified email status.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
