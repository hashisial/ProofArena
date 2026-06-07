import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/Button.jsx";
import { Container } from "../components/Container.jsx";
import { StatusBanner } from "../components/StatusBanner.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { requestPasswordReset, resetPassword } from "../services/api.js";

const initialForm = {
  accountType: "individual",
  email: "",
  name: "",
  password: "",
  role: "client",
  username: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getAuthError(error, fallback) {
  if (Array.isArray(error?.errors) && error.errors.length > 0) {
    return error.errors[0].message;
  }

  return error?.message ?? fallback;
}

function AuthField({ autoComplete, error, label, name, onChange, type = "text", value }) {
  const [isVisible, setIsVisible] = useState(false);
  const canReveal = type === "password";

  return (
    <label className="block text-sm font-semibold text-black">
      {label}
      <span className="relative mt-2 block">
        <input
          autoComplete={autoComplete}
          className={`w-full rounded-2xl border bg-white px-4 py-3 pr-12 text-sm font-semibold text-black outline-none transition placeholder:text-black/35 focus:ring-4 ${
            error
              ? "border-[#7C3AED]/60 ring-4 ring-[#7C3AED]/10"
              : "border-black/10 focus:border-[#7C3AED]/60 focus:ring-[#7C3AED]/10"
          }`}
          name={name}
          onChange={onChange}
          type={canReveal && isVisible ? "text" : type}
          value={value}
        />
        {canReveal ? (
          <button
            aria-label={isVisible ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-black/48 transition hover:bg-[#7C3AED]/8 hover:text-[#5B21B6]"
            onClick={() => setIsVisible((current) => !current)}
            type="button"
          >
            <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        ) : null}
      </span>
      {error ? <span className="mt-2 block text-xs font-bold text-[#5B21B6]">{error}</span> : null}
    </label>
  );
}

export function Auth() {
  const [form, setForm] = useState(initialForm);
  const initialMode =
    window.location.pathname === "/register"
      ? "register"
      : window.location.pathname === "/forgot-password"
        ? "forgot"
        : window.location.pathname === "/reset-password"
          ? "reset"
          : "login";
  const [mode, setMode] = useState(initialMode);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState("error");
  const [resetLink, setResetLink] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, signIn, signUp } = useAuth();

  const isRegistering = mode === "register";
  const isForgotMode = mode === "forgot";
  const isResetMode = mode === "reset";
  const resetToken = useMemo(
    () => new URLSearchParams(window.location.search).get("token") ?? "",
    [],
  );
  const isFormValid = useMemo(() => {
    const hasEmail = emailPattern.test(form.email.trim());
    const hasPassword = form.password.length >= 8;
    const hasName = !isRegistering || form.name.trim().length >= 2;
    const hasValidUsername =
      !isRegistering || !form.username.trim() || form.username.trim().length >= 3;
    const hasValidRole = !isRegistering || ["client", "provider"].includes(form.role);
    const hasValidAccountType =
      !isRegistering || ["individual", "agency"].includes(form.accountType);

    if (isForgotMode) {
      return hasEmail;
    }

    if (isResetMode) {
      return hasPassword && Boolean(resetToken);
    }

    return hasEmail && hasPassword && hasName && hasValidUsername && hasValidRole && hasValidAccountType;
  }, [form, isForgotMode, isRegistering, isResetMode, resetToken]);
  const validationErrors = useMemo(() => {
    const errors = {};

    if (!isResetMode && form.email && !emailPattern.test(form.email.trim())) {
      errors.email = "Use a valid email address.";
    }

    if (!isForgotMode && form.password && form.password.length < 8) {
      errors.password = "Use at least 8 characters.";
    }

    if (isRegistering) {
      if (form.name && form.name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters.";
      }

      if (form.username && !/^[a-zA-Z0-9._-]{3,32}$/.test(form.username.trim())) {
        errors.username = "Use 3-32 letters, numbers, dots, underscores, or hyphens.";
      }
    }

    return errors;
  }, [form, isForgotMode, isRegistering, isResetMode]);

  useEffect(() => {
    if (isAuthenticated && !isForgotMode && !isResetMode) {
      window.location.href = "/dashboard";
    }
  }, [isAuthenticated, isForgotMode, isResetMode]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
    setMessage("");
    setResetLink("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isFormValid) {
      setSubmitAttempted(true);
      setMessage(
        isForgotMode
          ? "Enter a valid account email."
          : isResetMode
            ? "Use a valid reset link and enter a password with at least 8 characters."
            : "Enter a valid name, email, password, role, and username when registering.",
      );
      setMessageTone("error");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      if (isForgotMode) {
        const response = await requestPasswordReset(form.email);
        setMessage(response.message ?? "Password reset instructions sent.");
        setMessageTone("success");
        setResetLink(response.resetUrl ?? "");
        return;
      }

      if (isResetMode) {
        const response = await resetPassword({
          password: form.password,
          token: resetToken,
        });
        setMessage(response.message ?? "Password updated. You can log in now.");
        setMessageTone("success");
        setForm(initialForm);
        return;
      }

      if (isRegistering) {
        await signUp(form);
        window.location.href = "/dashboard";
      } else {
        const user = await signIn({
          email: form.email,
          password: form.password,
        });
        window.location.href = user?.role === "admin" ? "/admin" : "/dashboard";
      }
    } catch (error) {
      setMessage(
        getAuthError(
          error,
          isForgotMode
            ? "Unable to send reset instructions."
            : isResetMode
              ? "Unable to update password."
              : isRegistering
                ? "Unable to create account."
                : "Unable to sign in.",
        ),
      );
      setMessageTone("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isAuthenticated && !isForgotMode && !isResetMode) {
    return null;
  }

  const heading = isForgotMode
    ? "Recover your password"
    : isResetMode
      ? "Create a new password"
      : isRegistering
        ? "Start with ProofArena"
        : "Welcome back to ProofArena";

  const helperText = isForgotMode
    ? "Enter your account email and we will send password reset instructions."
    : isResetMode
      ? "Choose a new password for your account. It must be at least 8 characters."
      : isRegistering
        ? "Create your account to launch outcome challenges or prove execution as a provider."
        : "Access your outcome workspace and continue tracking verified execution.";

  return (
    <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden bg-[radial-gradient(circle_at_12%_8%,rgba(124, 58, 237, 0.18),transparent_32rem),linear-gradient(180deg,#ffffff,#FBF9FF)] py-10 sm:py-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[8%] top-14 h-80 w-80 rounded-full bg-[#7C3AED]/12 blur-3xl" />
        <div className="absolute left-[10%] bottom-10 h-44 w-44 rotate-12 rounded-[2.5rem] border border-[#7C3AED]/16 bg-[#7C3AED]/6" />
      </div>
      <Container className="relative z-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <aside className="relative hidden overflow-hidden rounded-[2.2rem] border border-[#7C3AED]/16 bg-white p-8 text-black shadow-[0_24px_80px_rgba(124, 58, 237, 0.1)] lg:block">
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#7C3AED]/16 blur-3xl" />
            <div className="absolute bottom-12 right-12 h-28 w-28 rotate-12 rounded-[2rem] border border-[#7C3AED]/16 bg-[#7C3AED]/6" />
            <p className="relative text-xs font-bold uppercase tracking-[0.28em] text-[#7C3AED]">
              ProofArena by ScaleOps
            </p>
            <h2 className="relative mt-8 max-w-md text-5xl font-bold leading-[0.92] tracking-[-0.075em] text-black">
              Secure access for measurable outcomes.
            </h2>
            <p className="relative mt-6 max-w-md text-sm leading-7 text-black/62">
              Launch challenges, prove execution, and keep every verified proof record tied to the right workspace.
            </p>
            <div className="relative mt-10 grid gap-3">
              {["HTTP-only refresh session", "Role-aware workspace access", "Rate-limited auth routes"].map((item) => (
                <div className="rounded-2xl border border-[#7C3AED]/14 bg-[#F8F4FF] px-4 py-3 text-sm font-bold text-black" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <div className="premium-surface rounded-[2.2rem] p-5 sm:p-8">
            <p className="relative z-10 premium-kicker">
              ProofArena Access
            </p>
            <h1 className="relative z-10 mt-4 max-w-xl break-words text-3xl font-bold tracking-[-0.052em] text-black sm:text-5xl sm:tracking-[-0.06em]">
              {heading}
            </h1>
            <p className="relative z-10 mt-4 max-w-lg text-sm leading-6 text-black/58">
              {helperText}
            </p>

          {!isForgotMode && !isResetMode ? (
            <div className="relative z-10 mt-6 grid grid-cols-2 rounded-2xl border border-black/10 bg-black/[0.03] p-1">
            {[
              ["login", "Login"],
              ["register", "Register"],
            ].map(([value, label]) => (
              <button
                aria-pressed={mode === value}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  mode === value
                    ? "bg-black text-white shadow-[0_14px_35px_rgba(124, 58, 237, 0.18)]"
                    : "text-black/54 hover:text-black"
                }`}
                key={value}
                onClick={() => {
                  setMode(value);
                  setMessage("");
                  setResetLink("");
                  setSubmitAttempted(false);
                }}
                type="button"
              >
                {label}
              </button>
            ))}
            </div>
          ) : null}

          <form className="relative z-10 mt-6 grid gap-5" onSubmit={handleSubmit}>
            {isRegistering ? (
              <>
                <AuthField
                  autoComplete="name"
                  error={submitAttempted ? validationErrors.name : ""}
                  label="Full name"
                  name="name"
                  onChange={updateField}
                  value={form.name}
                />
                <AuthField
                  autoComplete="username"
                  error={submitAttempted ? validationErrors.username : ""}
                  label="Username"
                  name="username"
                  onChange={updateField}
                  value={form.username}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  {[ 
                    ["client", "Client", "I want to launch measurable outcome challenges."],
                    ["provider", "Provider", "I want to prove execution and win challenges."],
                  ].map(([roleValue, label, description]) => (
                    <button
                      className={`rounded-2xl border px-4 py-4 text-left transition ${
                        form.role === roleValue
                          ? "border-[#7C3AED] bg-[#7C3AED] text-white shadow-[0_20px_55px_rgba(124, 58, 237, 0.22)]"
                          : "border-black/10 bg-white text-black hover:border-[#7C3AED]/35 hover:bg-[#7C3AED]/6"
                      }`}
                      key={roleValue}
                      onClick={() => updateField({ target: { name: "role", value: roleValue } })}
                      type="button"
                    >
                      <span className="block text-sm font-bold">{label}</span>
                      <span className={`mt-2 block text-xs leading-5 ${form.role === roleValue ? "text-white/72" : "text-black/52"}`}>
                        {description}
                      </span>
                    </button>
                  ))}
                  <label className="block text-sm font-semibold text-black sm:col-span-2">
                    Account type
                    <select
                      className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#7C3AED]/60 focus:ring-4 focus:ring-[#7C3AED]/10"
                      name="accountType"
                      onChange={updateField}
                      value={form.accountType}
                    >
                      <option value="individual">Individual</option>
                      <option value="agency">Agency</option>
                    </select>
                  </label>
                </div>
              </>
            ) : null}
            {!isResetMode ? (
              <AuthField
                autoComplete="email"
                error={submitAttempted ? validationErrors.email : ""}
                label="Email"
                name="email"
                onChange={updateField}
                type="email"
                value={form.email}
              />
            ) : null}
            {!isForgotMode ? (
              <AuthField
                autoComplete={isRegistering ? "new-password" : "current-password"}
                error={submitAttempted ? validationErrors.password : ""}
                label={isResetMode ? "New password" : "Password"}
                name="password"
                onChange={updateField}
                type="password"
                value={form.password}
              />
            ) : null}

            {message ? (
              <StatusBanner tone={messageTone}>
                {message}
              </StatusBanner>
            ) : null}

            {resetLink ? (
              <Button as="a" href={resetLink} variant="outline">
                Open Reset Link
              </Button>
            ) : null}

            <Button
              disabled={isSubmitting}
              isLoading={isSubmitting}
              loadingLabel={
                isForgotMode
                  ? "Sending..."
                  : isResetMode
                    ? "Updating..."
                    : isRegistering
                      ? "Creating account..."
                      : "Signing in..."
              }
              type="submit"
            >
              {isForgotMode
                ? "Send Reset Instructions"
                : isResetMode
                  ? "Update Password"
                  : isRegistering
                    ? "Create Account"
                    : "Sign In"}
            </Button>
          </form>
          <div className="relative z-10 mt-5 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold">
            {!isForgotMode && !isResetMode ? (
              <a className="premium-link text-[#5B21B6]" href="/forgot-password">
                Forgot password?
              </a>
            ) : (
              <a className="premium-link text-[#5B21B6]" href="/login">
                Back to login
              </a>
            )}
            <a className="premium-link text-black/62 hover:text-black" href="/">
              Back to home
            </a>
          </div>
        </div>
        </div>
      </Container>
    </section>
  );
}
