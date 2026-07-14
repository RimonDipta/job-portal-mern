import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Calendar } from 'lucide-react';

export default function JobCard({ job }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-slate-850/50 glass hover:bg-slate-800/80 transition-all duration-300 p-6 rounded-2xl flex flex-col justify-between border border-slate-800 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-950/10 group">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-950/80 text-violet-300 border border-violet-850/50 uppercase tracking-wider">
            {job.jobType}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(job.createdAt)}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-1">
          {job.title}
        </h3>
        <p className="text-sm font-semibold text-slate-400 mb-4">{job.company}</p>

        <p className="text-slate-300 text-sm mb-6 line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      </div>

      <div>
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-slate-400 mb-6 border-t border-slate-800/60 pt-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-violet-400 shrink-0" />
            <span className="line-clamp-1">{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-450 shrink-0" />
            <span className="line-clamp-1 text-emerald-400 font-medium">{job.salary}</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <Briefcase className="h-4 w-4 text-violet-400 shrink-0" />
            <span className="line-clamp-1">Positions: {job.position} Openings</span>
          </div>
        </div>

        <Link
          to={`/jobs/${job._id}`}
          className="block w-full text-center bg-slate-850 hover:bg-violet-600 text-white font-medium py-2.5 rounded-xl border border-slate-700 hover:border-violet-600 transition-all duration-200"
        >
          View Job Details
        </Link>
      </div>
    </div>
  );
}
