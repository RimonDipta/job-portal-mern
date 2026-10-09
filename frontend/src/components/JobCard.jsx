import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  DollarSign,
  MapPin,
} from "lucide-react";

export default function JobCard({ job }) {
  const formatDate = (dateString) => {
    if (!dateString) {
      return "Recently";
    }

    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-white/[0.035] hover:shadow-xl hover:shadow-violet-950/10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-gradient-to-br from-violet-500/15 to-cyan-400/10 text-violet-300">
          <BriefcaseBusiness className="h-5 w-5" />
        </div>

        <span className="rounded-full border border-violet-400/10 bg-violet-400/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-300">
          {job.jobType || "Full-time"}
        </span>
      </div>

      <div className="mt-5">
        <h3 className="line-clamp-1 text-lg font-bold tracking-tight text-white transition-colors group-hover:text-violet-300">
          {job.title}
        </h3>

        <p className="mt-1 text-sm font-medium text-slate-500">{job.company}</p>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
        {job.description}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2 border-y border-white/[0.06] py-4 text-xs text-slate-500">
        <div className="flex min-w-0 items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-cyan-400/80" />

          <span className="truncate">{job.location || "Remote"}</span>
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <DollarSign className="h-3.5 w-3.5 shrink-0 text-emerald-400/80" />

          <span className="truncate">{job.salary || "Competitive"}</span>
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <BriefcaseBusiness className="h-3.5 w-3.5 shrink-0 text-violet-400/80" />

          <span className="truncate">
            {job.position || 1} opening
            {Number(job.position) === 1 ? "" : "s"}
          </span>
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-500" />

          <span className="truncate">{formatDate(job.createdAt)}</span>
        </div>
      </div>

      <Link
        to={`/jobs/${job._id}`}
        className="group/link mt-5 flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-sm font-semibold text-slate-300 transition-all hover:border-violet-400/20 hover:bg-violet-500/[0.06] hover:text-white"
      >
        View opportunity
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
      </Link>
    </article>
  );
}
