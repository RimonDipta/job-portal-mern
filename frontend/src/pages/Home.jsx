import React, { useEffect } from "react";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import Hero from "../components/Hero";
import Stats from "../components/Stats";
import PopularCategories from "../components/PopularCategories";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import JobCard from "../components/JobCard";

import { useAppStore } from "../store/useAppStore";

function JobSkeleton() {
  return (
    <div className="glass animate-pulse rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <div className="h-11 w-11 rounded-xl bg-white/[0.06]" />
        <div className="h-6 w-20 rounded-full bg-white/[0.04]" />
      </div>

      <div className="mt-6 h-5 w-3/4 rounded bg-white/[0.06]" />
      <div className="mt-3 h-3 w-1/3 rounded bg-white/[0.04]" />

      <div className="mt-5 space-y-2">
        <div className="h-3 w-full rounded bg-white/[0.04]" />
        <div className="h-3 w-5/6 rounded bg-white/[0.04]" />
      </div>

      <div className="mt-6 h-10 rounded-xl bg-white/[0.04]" />
    </div>
  );
}

export default function Home() {
  const { jobs, fetchJobs, jobsLoading, jobsError } = useAppStore();

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const latestJobs = jobs.slice(0, 3);

  const handleRetry = () => {
    fetchJobs();
  };

  return (
    <div className="relative overflow-hidden">
      {/* Global homepage atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-violet-600/[0.07] blur-[160px]" />
        <div className="absolute right-0 top-[1000px] h-[450px] w-[450px] rounded-full bg-cyan-400/[0.035] blur-[140px]" />
      </div>

      {/* Hero */}
      <Hero />

      {/* Platform capabilities */}
      <Stats />

      {/* Categories */}
      <PopularCategories />

      {/* Latest jobs */}
      <section className="section border-b border-white/[0.04]">
        <div className="site-container">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="section-eyebrow w-fit">
                <Sparkles className="h-3.5 w-3.5" />
                Latest opportunities
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Roles worth a closer look.
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
                Review the latest job postings and open any opportunity for its
                full description, requirements, and application workflow.
              </p>
            </div>

            <Link
              to="/jobs"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-violet-300 transition-colors hover:text-violet-200"
            >
              Browse all jobs
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Loading */}
          {jobsLoading && (
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <JobSkeleton />
              <JobSkeleton />
              <JobSkeleton />
            </div>
          )}

          {/* Error */}
          {!jobsLoading && jobsError && (
            <div className="mt-10 rounded-3xl border border-rose-400/15 bg-rose-400/[0.04] p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-rose-200">
                    We couldn&apos;t load the latest opportunities.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-rose-300/60">
                    {jobsError}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRetry}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-rose-400/15 bg-rose-400/[0.05] px-4 py-2.5 text-xs font-semibold text-rose-200 transition-colors hover:bg-rose-400/[0.1]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Jobs */}
          {!jobsLoading && !jobsError && latestJobs.length > 0 && (
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {latestJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}

          {/* Empty */}
          {!jobsLoading && !jobsError && latestJobs.length === 0 && (
            <div className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.025] text-violet-300">
                <BriefcaseEmptyIcon />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                No opportunities yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                There are currently no published jobs. Check back after a
                recruiter posts a new opportunity.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Platform advantages */}
      <WhyChooseUs />

      {/* Candidate / recruiter experiences */}
      <Testimonials />

      {/* Final CTA */}
      <section className="section">
        <div className="site-container">
          <div className="relative overflow-hidden rounded-3xl border border-violet-400/10 bg-gradient-to-br from-violet-500/[0.1] via-white/[0.02] to-cyan-400/[0.04] p-8 sm:p-12">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                  Your next move
                </p>

                <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Ready to explore what&apos;s available?
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Search the marketplace or create an account to start using the
                  candidate and recruiter workflows.
                </p>
              </div>

              <div className="relative flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/jobs"
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  Browse jobs
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/register"
                  className="btn-secondary inline-flex items-center justify-center gap-2"
                >
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function BriefcaseEmptyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
      <path d="M10 12v2h4v-2" />
    </svg>
  );
}
