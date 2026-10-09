import React from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  MessageSquareQuote,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const perspectives = [
  {
    role: "For candidates",
    title: "A clearer path from search to application.",
    description:
      "Discover opportunities, maintain your professional profile, upload a resume, and keep your application history in one place.",
    icon: Users,
    points: [
      "Search and filter jobs",
      "Maintain your profile",
      "Upload a PDF resume",
      "Track application status",
    ],
  },
  {
    role: "For recruiters",
    title: "A focused workspace for managing applicants.",
    description:
      "Publish opportunities and move candidates through the application workflow without switching between disconnected tools.",
    icon: BriefcaseBusiness,
    points: [
      "Create and manage jobs",
      "Review applicants",
      "Search candidate information",
      "Update application status",
    ],
  },
];

export default function Testimonials() {
  return (
    <section className="section border-t border-white/[0.04]">
      <div className="site-container">
        <div className="mx-auto max-w-2xl text-center">
          <div className="section-eyebrow mx-auto w-fit">
            <MessageSquareQuote className="h-3.5 w-3.5" />
            Built for both sides
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            One platform.
            <br />
            <span className="gradient-text">Two focused experiences.</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
            Candidates and recruiters have different goals. The interface keeps
            those workflows separate while connecting them through the same
            application lifecycle.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {perspectives.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.role}
                className="glass group relative overflow-hidden rounded-3xl p-7 sm:p-8"
              >
                {/* Decorative glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-500/5 blur-3xl transition-all duration-500 group-hover:bg-violet-500/10" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {item.role}
                    </span>
                  </div>

                  <h3 className="mt-7 max-w-md text-xl font-semibold leading-8 text-white sm:text-2xl">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>

                  <div className="mt-7 grid gap-2 sm:grid-cols-2">
                    {item.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-center gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3.5 py-3"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-400" />
                        <span className="text-xs font-medium text-slate-300">
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical trust row */}
        <div className="mt-6 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                <ShieldCheck className="h-[18px] w-[18px]" />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Designed around real application state
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Authentication, role-based access, application statuses,
                  protected profiles, and recruiter workflows are part of the
                  application architecture.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {["React", "Node.js", "Express", "MongoDB", "JWT", "Zustand"].map(
                (technology) => (
                  <span
                    key={technology}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-[#091525] px-3 py-1.5 text-[11px] font-medium text-slate-400"
                  >
                    <Code2 className="h-3 w-3 text-violet-400" />
                    {technology}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/about"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-violet-300 transition-colors hover:text-violet-200"
          >
            Learn more about the platform
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
