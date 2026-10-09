import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAppStore } from "../store/useAppStore";

const roles = [
  {
    value: "candidate",
    label: "Candidate",
    description: "Find opportunities and apply to jobs.",
    icon: UserRound,
  },
  {
    value: "recruiter",
    label: "Recruiter",
    description: "Post roles and manage applicants.",
    icon: BriefcaseBusiness,
  },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, user, token, authLoading, authError } = useAppStore();

  const [role, setRole] = useState("candidate");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (token && user) {
      navigate(user.role === "recruiter" ? "/dashboard" : "/", {
        replace: true,
      });
    }
  }, [token, user, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setFormError("Please enter both your email address and password.");
      return;
    }

    try {
      // The Zustand store expects a single object.
      const result = await login({
        email,
        password,
        role,
      });

      if (!result?.success) {
        setFormError(
          result?.message ||
            "Unable to sign in. Please check your credentials.",
        );
        return;
      }

      const authenticatedUser = result.user;

      if (!authenticatedUser) {
        setFormError(
          "Login succeeded, but the user account could not be loaded.",
        );
        return;
      }

      // Enforce the role selected on the login form.
      if (authenticatedUser.role !== role) {
        await useAppStore.getState().logout();

        setFormError(
          `This account is registered as a ${authenticatedUser.role}. Please select the correct role.`,
        );
        return;
      }

      const requestedDestination = location.state?.from;

      // Only allow internal application paths as return destinations.
      const destination =
        typeof requestedDestination === "string" &&
        requestedDestination.startsWith("/") &&
        !requestedDestination.startsWith("//")
          ? requestedDestination
          : authenticatedUser.role === "recruiter"
            ? "/dashboard"
            : "/";

      navigate(destination, { replace: true });
    } catch (loginError) {
      setFormError(
        loginError?.response?.data?.message ||
          loginError?.message ||
          "Something went wrong while signing in.",
      );
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title={
        <>
          Pick up where
          <span className="gradient-text"> you left off.</span>
        </>
      }
      description="Sign in to discover opportunities, manage applications, or grow your hiring pipeline."
    >
      <div className="mb-7">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Sign in
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Access your JobPortal account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Email address
          </label>

          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="focus-ring h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-slate-700 focus:border-violet-400/40 focus:bg-white/[0.05]"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Password
          </label>

          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="focus-ring h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-12 text-sm text-white outline-none transition-colors placeholder:text-slate-700 focus:border-violet-400/40 focus:bg-white/[0.05]"
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-600 transition-colors hover:text-slate-300"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <fieldset>
          <legend className="mb-3 text-sm font-medium text-slate-300">
            Sign in as
          </legend>

          <div className="grid gap-3 sm:grid-cols-2">
            {roles.map((item) => {
              const Icon = item.icon;
              const active = role === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setRole(item.value);
                    setFormError("");
                  }}
                  className={`relative rounded-2xl border p-4 text-left transition-all ${
                    active
                      ? "border-violet-400/40 bg-violet-500/[0.08] shadow-lg shadow-violet-950/10"
                      : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                  }`}
                >
                  {active && (
                    <span className="absolute right-3 top-3">
                      <CheckCircle2 className="h-4 w-4 text-violet-400" />
                    </span>
                  )}

                  <Icon
                    className={`h-5 w-5 ${
                      active ? "text-violet-400" : "text-slate-500"
                    }`}
                  />

                  <p className="mt-3 text-sm font-semibold text-white">
                    {item.label}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>
        </fieldset>

        {(formError || authError) && (
          <AuthError message={formError || authError} />
        )}

        <button
          type="submit"
          disabled={authLoading}
          className="btn-primary min-h-12 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
        >
          {authLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-violet-400 transition-colors hover:text-violet-300"
        >
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}

function AuthLayout({ eyebrow, title, description, children }) {
  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden">
      <div className="absolute inset-0 subtle-grid opacity-20" />

      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="site-container relative py-10 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50 shadow-2xl shadow-black/20 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative hidden overflow-hidden border-r border-white/5 bg-gradient-to-br from-violet-500/[0.10] via-transparent to-cyan-500/[0.06] p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div className="absolute -right-20 top-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative">
              <Link to="/" className="inline-flex items-center">
                <img
                  src="/brand/logo.svg"
                  alt="JobPortal"
                  className="h-9 w-auto"
                />
              </Link>

              <div className="mt-24 max-w-md">
                <div className="section-eyebrow mb-5">
                  <Sparkles className="h-3.5 w-3.5" />
                  {eyebrow}
                </div>

                <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                  {title}
                </h1>

                <p className="mt-6 text-sm leading-7 text-slate-400 xl:text-base">
                  {description}
                </p>
              </div>
            </div>

            <div className="relative mt-12 grid grid-cols-2 gap-3">
              <TrustCard
                icon={ShieldCheck}
                title="Protected"
                text="Secure account access"
              />

              <TrustCard
                icon={BriefcaseBusiness}
                title="Built for hiring"
                text="One platform, two roles"
              />
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:p-12 xl:p-14">
            <div className="mb-10 lg:hidden">
              <Link to="/" className="inline-flex items-center">
                <img
                  src="/brand/logo.svg"
                  alt="JobPortal"
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
      <Icon className="h-5 w-5 text-violet-400" />

      <p className="mt-4 text-sm font-semibold text-white">{title}</p>

      <p className="mt-1 text-xs text-slate-600">{text}</p>
    </div>
  );
}

function AuthError({ message }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-rose-400/15 bg-rose-500/[0.06] px-4 py-3"
    >
      <p className="text-sm leading-6 text-rose-300">{message}</p>
    </div>
  );
}
