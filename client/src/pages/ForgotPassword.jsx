import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { Input } from "../components/ui/Input.jsx";
import { ROUTES } from "../constants/index.js";
import { getAuthErrorMessage } from "../features/auth/authFormUtils.js";
import { useAuth } from "../features/auth/useAuth.js";
import { getDefaultAuthenticatedRoute } from "../routes/authRouteUtils.js";
import { isRequired, isValidEmail } from "../utils/index.js";

const successMessage =
  "If an account exists with this email, password reset instructions will be sent.";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword, isAuthenticated, isAuthChecking, user } = useAuth();

  function updateEmail(event) {
    setEmail(event.target.value);
    setEmailError("");
    setFormError("");
    setIsSubmitted(false);
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

    setEmailError("");
    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      await forgotPassword({ email: email.trim() });
      setIsSubmitted(true);
    } catch (error) {
      setFormError(getAuthErrorMessage(error, "Unable to send reset instructions. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isAuthChecking && isAuthenticated) {
    return <Navigate replace to={getDefaultAuthenticatedRoute(user)} />;
  }

  return (
    <Card className="border-[#E7E5E4] shadow-[0_24px_80px_rgba(63, 98, 18, 0.12)]" padding="lg" variant="elevated">
      <CardHeader>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">
          Secure access
        </p>
        <CardTitle as="h1" className="text-3xl sm:text-4xl">
          Reset your ProofArena password
        </CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send password reset instructions if an account exists.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isSubmitted ? (
          <div className="rounded-2xl border border-[#3F6212]/20 bg-[#F7FEE7] px-4 py-4 text-sm font-semibold leading-6 text-[#365314]">
            {successMessage}
          </div>
        ) : null}

        <form className="mt-5 grid gap-5" noValidate onSubmit={handleSubmit}>
          <Input
            autoComplete="email"
            error={emailError}
            id="forgot-password-email"
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

          <Button
            className="w-full"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            loadingLabel="Sending..."
            type="submit"
          >
            Send reset instructions
          </Button>
        </form>

        <p className="mt-6 text-sm font-semibold text-[#57534E]">
          Remembered your password?{" "}
          <Link className="text-[#365314] transition hover:text-[#3F6212] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70" to={ROUTES.LOGIN}>
            Back to login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
