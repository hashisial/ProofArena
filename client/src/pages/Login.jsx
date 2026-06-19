import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { Input } from "../components/ui/Input.jsx";
import { ROUTES } from "../constants/index.js";
import { getAuthErrorMessage } from "../features/auth/authFormUtils.js";
import { useAuth } from "../features/auth/useAuth.js";
import {
  getDefaultAuthenticatedRoute,
  getIntendedDestination,
} from "../routes/authRouteUtils.js";
import { isRequired, isValidEmail } from "../utils/index.js";

const initialForm = {
  email: "",
  password: "",
};

export function Login() {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authError, clearAuthError, isAuthenticated, isAuthChecking, login, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const generalError = formError || authError?.message || "";

  const isSubmitDisabled = useMemo(() => {
    return isAuthChecking || isSubmitting || !form.email.trim() || !form.password;
  }, [form, isAuthChecking, isSubmitting]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
    setFieldErrors((current) => ({
      ...current,
      [name]: "",
    }));
    setFormError("");
    clearAuthError();
  }

  function validateForm() {
    const nextErrors = {};

    if (!isRequired(form.email)) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!isRequired(form.password)) {
      nextErrors.password = "Password is required.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFormError("");
    clearAuthError();

    try {
      const authData = await login({
        email: form.email.trim(),
        password: form.password,
      });
      navigate(
        getIntendedDestination(
          location.state,
          getDefaultAuthenticatedRoute(authData.user),
        ),
        { replace: true },
      );
    } catch (error) {
      setFormError(getAuthErrorMessage(error, "Unable to log in. Please try again."));
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
          ProofArena Access
        </p>
        <CardTitle as="h1" className="text-3xl sm:text-4xl">
          Welcome back to ProofArena
        </CardTitle>
        <CardDescription>
          Access your outcome workspace and continue tracking verified execution.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="grid gap-5" noValidate onSubmit={handleSubmit}>
          <Input
            autoComplete="email"
            error={fieldErrors.email}
            id="login-email"
            label="Email"
            name="email"
            onChange={updateField}
            required
            type="email"
            value={form.email}
          />

          <Input
            autoComplete="current-password"
            error={fieldErrors.password}
            id="login-password"
            label="Password"
            name="password"
            onChange={updateField}
            required
            type="password"
            value={form.password}
          />

          {generalError ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {generalError}
            </p>
          ) : null}

          <Button
            className="w-full"
            disabled={isSubmitDisabled}
            isLoading={isSubmitting}
            loadingLabel="Logging in..."
            type="submit"
          >
            Login
          </Button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold">
          <Link className="text-[#365314] transition hover:text-[#3F6212] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70" to={ROUTES.REGISTER}>
            Create an account
          </Link>
          <Link className="text-[#57534E] transition hover:text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70" to={ROUTES.FORGOT_PASSWORD}>
            Forgot password?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
