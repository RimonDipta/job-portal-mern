import React from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Github,
  Layers3,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    label: "Frontend Engineering",
    query: "Frontend",
  },
  {
    label: "Backend Engineering",
    query: "Backend",
  },
  {
    label: "UI / UX Design",
    query: "Design",
  },
  {
    label: "Full Stack Development",
    query: "Full Stack",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.05] bg-[#050c18]">
      <div className="site-container py-14">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
          {/* =========================================================
              BRAND
          ========================================================== */}
          <div className="max-w-md">
            <Link to="/" className="group inline-flex items-center gap-2.5">
              <img
                src="/brand/logo-mark.svg"
                alt=""
                className="h-9 w-9 transition-transform duration-300 group-hover:scale-105"
              />

              <span className="text-sm font-bold tracking-[0.16em] text-white">
                JOB
                <span className="text-violet-400">PORTAL</span>
              </span>
            </Link>

            <p className="mt-5 text-sm leading-7 text-slate-600">
              A focused MERN job marketplace connecting candidates with
              recruiters through a simple, role-aware hiring workflow.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[11px] font-medium text-slate-500">
                <Layers3 className="h-3 w-3 text-violet-300" />
                MERN
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[11px] font-medium text-slate-500">
                <ShieldCheck className="h-3 w-3 text-cyan-300" />
                Protected workflows
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[11px] font-medium text-slate-500">
                <BriefcaseBusiness className="h-3 w-3 text-violet-300" />
                Candidate + recruiter
              </span>
            </div>

            <a
              href="https://github.com/RimonDipta/job-portal-mern"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-white"
            >
              <Github className="h-4 w-4" />
              View source on GitHub
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* =========================================================
              PLATFORM
          ========================================================== */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
              Platform
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-slate-600 transition-colors hover:text-violet-300"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/jobs"
                  className="text-sm text-slate-600 transition-colors hover:text-violet-300"
                >
                  Browse jobs
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="text-sm text-slate-600 transition-colors hover:text-violet-300"
                >
                  About the platform
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-sm text-slate-600 transition-colors hover:text-violet-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* =========================================================
              CATEGORIES
          ========================================================== */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
              Explore
            </h3>

            <ul className="mt-5 space-y-3">
              {categories.map((category) => (
                <li key={category.query}>
                  <Link
                    to={`/jobs?category=${encodeURIComponent(category.query)}`}
                    className="text-sm text-slate-600 transition-colors hover:text-violet-300"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* =========================================================
            BOTTOM BAR
        ========================================================== */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.05] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-slate-700">
            © {currentYear} JobPortal. Built with React, Node.js, Express &
            MongoDB.
          </p>

          <div className="flex items-center gap-5">
            <Link
              to="/jobs"
              className="text-[11px] font-medium text-slate-700 transition-colors hover:text-slate-400"
            >
              Browse jobs
            </Link>

            <Link
              to="/register"
              className="text-[11px] font-medium text-slate-700 transition-colors hover:text-slate-400"
            >
              Create account
            </Link>

            <a
              href="https://github.com/RimonDipta/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-medium text-slate-700 transition-colors hover:text-slate-400"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
