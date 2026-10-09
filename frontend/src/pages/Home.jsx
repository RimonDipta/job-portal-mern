import React, { useEffect } from "react";
import { ArrowRight, RefreshCw, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import Hero from "../components/Hero";
import Stats from "../components/Stats";
import PopularCategories from "../components/PopularCategories";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import JobCard from "../components/JobCard";

import { useAppStore } from "../store/useAppStore";

export default function Home() {
  const { jobs, fetchJobs, jobsLoading, jobsError } = useAppStore();

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const latestJobs = jobs.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <Hero />

      {/* Platform capabilities */}
      <Stats />

      {/* Categories */}
      <PopularCategories />

      {/* Latest jobs */}
      <section className="section border-b border-white/[0.06]">
        <div className="site-container">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="section-eyebrow">
                <Sparkles className="h-3.5 w-3.5" />
                Fresh opportunities
              </span>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Latest openings.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Explore the latest positions added to the platform and find your
                next opportunity.
              </p>
            </div>

            <Link
              to="/jobs"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-violet-300 transition-colors hover:text-violet-200"
            >
              View all jobs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10">
            {jobsLoading ? (
              <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-[330px] animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.025]"
                  />
                ))}
              </div>
            ) : jobsError ? (
              <div className="rounded-2xl border border-rose-400/10 bg-rose-400/[0.04] p-8 text-center">
                <p className="text-sm font-medium text-rose-300">
                  Unable to load job openings.
                </p>

                <p className="mt-2 text-xs text-slate-600">{jobsError}</p>

                <button
                  type="button"
                  onClick={() => fetchJobs()}
                  className="btn-secondary mt-5"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </button>
              </div>
            ) : latestJobs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {latestJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="glass rounded-2xl p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/[0.07] text-violet-300">
                  <Sparkles className="h-5 w-5" />
                </div>

                <h3 className="mt-5 text-base font-semibold text-white">
                  No openings yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  New opportunities will appear here when recruiters publish
                  them.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Existing supporting sections */}
      <WhyChooseUs />

      <Testimonials />

      {/* Final CTA */}
      <section className="section">
        <div className="site-container">
          <div className="relative overflow-hidden rounded-[30px] border border-violet-400/10 bg-gradient-to-br from-violet-500/[0.10] via-white/[0.025] to-cyan-400/[0.06] px-6 py-14 text-center sm:px-12 lg:py-20">
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative">
              <span className="section-eyebrow">Ready when you are</span>

              <h2 className="mx-auto mt-2 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Your next chapter could start with one search.
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                Create your profile, discover opportunities, and start building
                the career you want.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/jobs" className="btn-primary">
                  Explore jobs
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link to="/register" className="btn-secondary">
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
