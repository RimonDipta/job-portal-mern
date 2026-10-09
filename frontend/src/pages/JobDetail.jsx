import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  ArrowLeft,
  Send,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    selectedJob,
    fetchJobById,
    applyForJob,
    fetchApplicationStatus,
    applicationStatusByJobId,
    user,
    jobsLoading,
    jobsError,
    applicationsLoading,
    applicationsError,
  } = useAppStore();

  const [applying, setApplying] = useState(false);

  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  useEffect(() => {
    fetchJobById(id);
  }, [id, fetchJobById]);

  useEffect(() => {
    if (user?.role === "candidate" && id) {
      fetchApplicationStatus(id);
    }
  }, [id, user?.role, fetchApplicationStatus]);

  const applicationStatus = applicationStatusByJobId[id] || null;

  const userHasApplied = Boolean(applicationStatus);

  const handleApply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "recruiter") {
      setFeedback({
        type: "error",
        message: "Recruiters cannot apply for job posts.",
      });

      return;
    }

    if (userHasApplied) {
      return;
    }

    setApplying(true);

    setFeedback({
      type: "",
      message: "",
    });

    const res = await applyForJob(id);

    setApplying(false);

    if (res.success) {
      setFeedback({
        type: "success",
        message: res.message,
      });
    } else {
      setFeedback({
        type: "error",
        message: res.message,
      });
    }
  };

  if (jobsLoading && !selectedJob) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500" />
      </div>
    );
  }

  if (jobsError && !selectedJob) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 text-center">
        <ShieldAlert className="h-14 w-14 text-rose-500 mb-4" />

        <h2 className="text-2xl font-bold text-white mb-2">
          Unable to Load Job
        </h2>

        <p className="text-slate-400 text-sm mb-6 max-w-md">
          {jobsError}
        </p>

        <button
          type="button"
          onClick={() => fetchJobById(id)}
          className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!selectedJob) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4">
        <ShieldAlert className="h-14 w-14 text-rose-500 mb-4" />

        <h2 className="text-2xl font-bold text-white mb-2">
          Job Post Not Found
        </h2>

        <p className="text-slate-400 text-sm mb-6">
          The job posting you are looking for has expired or does not exist.
        </p>

        <Link
          to="/jobs"
          className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Job Search
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to all jobs
        </Link>

        {/* Job Header Card */}
        <div className="bg-slate-850/40 glass border border-slate-800 p-8 rounded-3xl mb-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-950/80 text-violet-300 border border-violet-800 uppercase tracking-wider">
                  {selectedJob.jobType}
                </span>

                <span className="text-xs text-slate-400">
                  Posted on{" "}
                  {new Date(selectedJob.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-3xl font-extrabold text-white mb-2">
                {selectedJob.title}
              </h1>

              <p className="text-lg font-bold text-violet-400">
                {selectedJob.company}
              </p>
            </div>

            {/* Application Action Button */}
            <div>
              {user?.role === "recruiter" ? (
                <div className="bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 text-sm text-slate-400 font-medium text-center">
                  Recruiter Mode
                </div>
              ) : userHasApplied ? (
                <div className="flex items-center gap-2 bg-emerald-950/50 text-emerald-400 border border-emerald-900/30 px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-950/20">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />

                  {applicationStatus === "accepted"
                    ? "Application Accepted"
                    : applicationStatus === "rejected"
                      ? "Application Rejected"
                      : "Applied Successfully"}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={applying || applicationsLoading}
                  className="w-full md:w-auto bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/40 disabled:opacity-50"
                >
                  <Send className="h-4.5 w-4.5" />

                  {applying
                    ? "Submitting Application..."
                    : applicationsLoading
                      ? "Checking Application..."
                      : "Apply Now"}
                </button>
              )}
            </div>
          </div>

          {/* Feedback alerts */}
          {feedback.message && (
            <div
              className={`mt-6 p-4 rounded-xl border text-sm font-medium ${
                feedback.type === "success"
                  ? "bg-emerald-950/30 text-emerald-400 border-emerald-900/40"
                  : "bg-rose-950/30 text-rose-400 border-rose-900/40"
              }`}
            >
              {feedback.message}
            </div>
          )}

          {applicationsError && user?.role === "candidate" && !userHasApplied && (
            <div className="mt-4 p-4 rounded-xl border border-amber-900/40 bg-amber-950/20 text-sm">
              <p className="text-amber-400 font-medium">Unable to check your application status.</p>
              <p className="text-slate-500 mt-1">{applicationsError}</p>
              <button
                type="button"
                onClick={() => fetchApplicationStatus(id)}
                className="mt-3 text-violet-400 hover:text-violet-300 font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Core metadata line grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 uppercase tracking-wider block">
                Salary Range
              </span>

              <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
                <DollarSign className="h-4 w-4 shrink-0 text-emerald-400" />
                {selectedJob.salary}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 uppercase tracking-wider block">
                Job Location
              </span>

              <span className="text-sm font-semibold text-white flex items-center gap-1">
                <MapPin className="h-4 w-4 shrink-0 text-violet-400" />
                {selectedJob.location}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 uppercase tracking-wider block">
                Job Type
              </span>

              <span className="text-sm font-semibold text-white flex items-center gap-1">
                <Briefcase className="h-4 w-4 shrink-0 text-violet-400" />
                {selectedJob.jobType}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 uppercase tracking-wider block">
                Positions Available
              </span>

              <span className="text-sm font-semibold text-white flex items-center gap-1">
                <Calendar className="h-4 w-4 shrink-0 text-violet-400" />
                {selectedJob.position} Openings
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Body Section */}
        <div className="bg-slate-850/30 glass border border-slate-800 p-8 rounded-3xl space-y-8">
          {/* Job Description */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">
              Job Description
            </h2>

            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              {selectedJob.description}
            </p>
          </div>

          {/* Job Requirements */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              Requirements & Skills
            </h2>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
              {selectedJob.requirements?.map((req, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80"
                >
                  <CheckCircle2 className="h-4.5 w-4.5 text-violet-400 shrink-0 mt-0.5" />

                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
