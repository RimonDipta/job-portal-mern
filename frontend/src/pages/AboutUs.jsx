import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Heart,
  Layers3,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";

const capabilities = [
  {
    label: "Job discovery",
    description: "Search opportunities by keyword, category, and location.",
    icon: Layers3,
  },
  {
    label: "Candidate workflow",
    description: "Maintain profiles, upload resumes, and submit applications.",
    icon: Users,
  },
  {
    label: "Recruiter workspace",
    description:
      "Publish jobs, review applicants, and manage application status.",
    icon: Workflow,
  },
];

const workflow = [
  {
    number: "01",
    title: "Discover",
    description: "Search opportunities by role, category, and location.",
    icon: Layers3,
  },
  {
    number: "02",
    title: "Apply",
    description:
      "Submit applications and keep your candidate profile up to date.",
    icon: CheckCircle2,
  },
  {
    number: "03",
    title: "Manage",
    description:
      "Recruiters organize job postings and review applicants from one workspace.",
    icon: Workflow,
  },
];

const values = [
  {
    title: "Clarity",
    description:
      "Keep job discovery, applications, and hiring decisions easy to understand at every step.",
    icon: Compass,
  },
  {
    title: "Transparency",
    description:
      "Application status and recruiter actions should remain visible instead of hidden behind unclear workflows.",
    icon: ShieldCheck,
  },
  {
    title: "Human-first",
    description:
      "Design the experience around candidates and recruiters rather than making users adapt to the software.",
    icon: Heart,
  },
  {
    title: "Connected",
    description:
      "Bring candidates, opportunities, applications, and hiring workflows together in one platform.",
    icon: Users,
  },
];

const securityFeatures = [
  "JWT authentication",
  "Role-based authorization",
  "Protected recruiter workflows",
  "Protected resume access",
];

export default function AboutUs() {
  return (
    <div className="relative overflow-hidden">
      {/* =========================================================
          BACKGROUND ATMOSPHERE
      ========================================================== */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[140px]" />

        <div className="absolute right-0 top-[620px] h-[420px] w-[420px] rounded-full bg-cyan-500/5 blur-[120px]" />

        <div className="absolute bottom-[500px] left-0 h-[320px] w-[320px] rounded-full bg-indigo-500/[0.04] blur-[120px]" />
      </div>

      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="section relative">
        <div className="site-container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="section-eyebrow mx-auto w-fit">
              <Sparkles className="h-3.5 w-3.5" />
              About JobPortal
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              A simpler way to connect{" "}
              <span className="gradient-text">talent and opportunity.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">
              JobPortal is a full-stack MERN recruitment platform designed to
              bring job discovery, applications, and recruiter workflows into
              one focused experience.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/jobs"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                Explore opportunities
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/contact"
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                Get in touch
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* =====================================================
              PRODUCT VISUAL
          ====================================================== */}
          <div className="mx-auto mt-16 max-w-6xl">
            <div className="glass relative overflow-hidden rounded-3xl p-2 shadow-2xl shadow-violet-950/20">
              <div className="rounded-[22px] border border-white/[0.06] bg-[#091525] p-5 sm:p-7">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                      <Workflow className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        Hiring workspace
                      </p>

                      <p className="text-xs text-slate-500">
                        Connected candidate and recruiter workflows
                      </p>
                    </div>
                  </div>

                  <div className="hidden items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 sm:flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-medium text-slate-400">
                      Role-aware
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 pt-5 md:grid-cols-3">
                  {capabilities.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="group rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-white/[0.04]"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 transition-colors group-hover:bg-violet-500/15">
                          <Icon className="h-4.5 w-4.5" />
                        </div>

                        <p className="mt-5 text-sm font-semibold text-white">
                          {item.label}
                        </p>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          APPROACH
      ========================================================== */}
      <section className="section border-t border-white/[0.04]">
        <div className="site-container">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="section-eyebrow w-fit">
                <Compass className="h-3.5 w-3.5" />
                Our approach
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Built around the actual hiring journey.
              </h2>

              <p className="mt-5 leading-7 text-slate-400">
                JobPortal brings the candidate and recruiter sides of the hiring
                process into a single application. Candidates can discover
                relevant roles, maintain their profile, submit applications, and
                monitor their application progress.
              </p>

              <p className="mt-4 leading-7 text-slate-400">
                Recruiters get a focused workspace for publishing jobs, managing
                listings, reviewing applicants, and updating application
                statuses.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {[
                  "Candidate profiles",
                  "Recruiter workspace",
                  "Application tracking",
                  "Role-based access",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3.5 py-2 text-xs font-medium text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-6 sm:p-8">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-400">
                    Platform flow
                  </p>

                  <h3 className="mt-2 text-xl font-semibold text-white">
                    From discovery to decision
                  </h3>
                </div>

                <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 sm:flex">
                  <Workflow className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-3">
                {workflow.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.number}
                      className="group flex gap-4 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4 transition-all duration-300 hover:border-violet-400/20 hover:bg-white/[0.035]"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold tracking-[0.16em] text-slate-600">
                            {item.number}
                          </span>

                          <h4 className="text-sm font-semibold text-white">
                            {item.title}
                          </h4>
                        </div>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECURITY
      ========================================================== */}
      <section className="section border-t border-white/[0.04]">
        <div className="site-container">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="glass rounded-3xl p-7 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                <LockKeyhole className="h-5 w-5" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                Built with protection in mind
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Access follows the user&apos;s role.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-500">
                Authentication and authorization are part of the application
                architecture rather than being treated as a visual layer.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {securityFeatures.map((feature) => (
                <div
                  key={feature}
                  className="glass flex items-center gap-4 rounded-2xl p-5 transition-all duration-300 hover:border-cyan-400/15"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                    <ShieldCheck className="h-4 w-4" />
                  </div>

                  <p className="text-sm font-medium text-slate-300">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          VALUES
      ========================================================== */}
      <section className="section border-t border-white/[0.04]">
        <div className="site-container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="section-eyebrow mx-auto w-fit">
              <Heart className="h-3.5 w-3.5" />
              What matters
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Principles behind the product.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              The interface is only one part of the experience. The underlying
              workflow should remain predictable, transparent, and useful.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="glass group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 transition-colors group-hover:bg-violet-500/15">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-white">
                    {value.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================== */}
      <section className="section">
        <div className="site-container">
          <div className="relative overflow-hidden rounded-3xl border border-violet-400/10 bg-gradient-to-br from-violet-500/[0.12] via-white/[0.025] to-cyan-400/[0.06] p-8 sm:p-12">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                  Ready when you are
                </p>

                <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  Find the next opportunity that fits.
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Explore available roles or create an account to start using
                  the candidate and recruiter workflows.
                </p>
              </div>

              <Link
                to="/jobs"
                className="btn-primary inline-flex shrink-0 items-center gap-2"
              >
                Browse jobs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
