import React from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  FileSearch,
  LockKeyhole,
  Search,
  UserRoundCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    number: "01",
    title: "Focused job discovery",
    description:
      "Search opportunities using keywords, categories, and locations without navigating through unnecessary steps.",
    icon: Search,
  },
  {
    number: "02",
    title: "Application tracking",
    description:
      "Candidates can review submitted applications and see the status assigned by recruiters.",
    icon: CheckCircle2,
  },
  {
    number: "03",
    title: "Recruiter workspace",
    description:
      "Recruiters can publish jobs, edit listings, review applicants, and manage application decisions.",
    icon: UserRoundCheck,
  },
  {
    number: "04",
    title: "Protected workflows",
    description:
      "Authentication and role-based authorization keep candidate and recruiter capabilities separated.",
    icon: LockKeyhole,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section border-t border-white/[0.04]">
      <div className="site-container">
        <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Intro */}
          <div className="lg:sticky lg:top-28">
            <div className="section-eyebrow w-fit">
              <FileSearch className="h-3.5 w-3.5" />
              Built for the workflow
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Less friction.
              <br />
              <span className="gradient-text">More focus.</span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
              JobPortal brings the core recruitment workflow into one focused
              interface. Candidates get a straightforward application
              experience, while recruiters get the tools they need to manage
              their hiring pipeline.
            </p>

            <Link
              to="/jobs"
              className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-violet-300 transition-colors hover:text-violet-200"
            >
              Explore available jobs
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            {/* Capability strip */}
            <div className="mt-10 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="text-lg font-bold text-white">2</p>
                <p className="mt-1 text-xs text-slate-600">Platform roles</p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="text-lg font-bold text-white">MERN</p>
                <p className="mt-1 text-xs text-slate-600">Application stack</p>
              </div>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.number}
                  className="glass group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20"
                >
                  <div className="absolute right-5 top-5 text-[10px] font-bold tracking-[0.18em] text-slate-700">
                    {feature.number}
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 transition-all duration-300 group-hover:bg-violet-500/15 group-hover:text-violet-200">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 text-base font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>

                  <div className="mt-6 h-px w-10 bg-gradient-to-r from-violet-400/60 to-transparent transition-all duration-300 group-hover:w-16" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom workflow */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-white/[0.06] bg-[#091525]">
          <div className="grid md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Find an opportunity",
                text: "Browse and filter available roles based on what you are looking for.",
              },
              {
                step: "02",
                title: "Submit your application",
                text: "Use your candidate profile and resume to apply to a suitable position.",
              },
              {
                step: "03",
                title: "Follow the outcome",
                text: "Review your application history and status as the recruiter processes it.",
              },
            ].map((item, index) => (
              <div
                key={item.step}
                className={`relative p-6 sm:p-8 ${
                  index !== 2 ? "border-b md:border-b-0 md:border-r" : ""
                } border-white/[0.06]`}
              >
                <span className="text-xs font-bold tracking-[0.18em] text-violet-400">
                  {item.step}
                </span>

                <h3 className="mt-4 text-base font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
