import React, { useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAppStore } from "../store/useAppStore";

const formatDate = (value) => {
  if (!value) {
    return "Recently posted";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently posted";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const formatJobType = (value) => {
  if (!value) {
    return "Full Time";
  }

  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const getJobType = (job) => {
  return job.jobType || job.job_type || job.type || "full-time";
};

const getSalary = (job) => {
  if (job.salary) {
    return String(job.salary);
  }

  if (job.salaryMin || job.salaryMax) {
    const minimum = job.salaryMin || job.salary_min;
    const maximum = job.salaryMax || job.salary_max;

    if (minimum && maximum) {
      return `$${minimum} - $${maximum}`;
    }

    return `$${minimum || maximum}`;
  }

  return "Salary not specified";
};

const getCompanyName = (job) => {
  return job.company || job.companyName || job.company_name || "Hiring company";
};

const getLocation = (job) => {
  return job.location || "Location not specified";
};

const getRequirements = (job) => {
  if (Array.isArray(job.requirements)) {
    return job.requirements.filter(Boolean);
  }

  if (typeof job.requirements === "string") {
    return job.requirements
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const getCreatedDate = (job) => {
  return job.createdAt || job.created_at || job.updatedAt || job.updated_at;
};

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    user,
    token,
    job,
    jobLoading,
    jobError,
    fetchJobById,
    applyForJob,
    applicationStatusByJobId,
    applicationsLoading,
    applicationsError,
    fetchAppliedJobs,
    applicants,
    applicantsLoading,
    fetchApplicants,
  } = useAppStore();

  useEffect(() => {
    if (!id) {
      return;
    }

    fetchJobById(id);
  }, [id, fetchJobById]);

  useEffect(() => {
    if (user?.role === "candidate" && token) {
      fetchAppliedJobs();
    }
  }, [user?.role, token, fetchAppliedJobs]);

  const handleApply = async () => {
    if (!user || !token) {
      navigate("/login", {
        state: {
          from: `/jobs/${id}`,
        },
      });

      return;
    }

    if (user.role !== "candidate") {
      return;
    }

    await applyForJob(id);
  };

  const handleViewApplicants = async () => {
    if (!id || user?.role !== "recruiter") {
      return;
    }

    await fetchApplicants(id);
  };

  if (jobLoading) {
    return <JobDetailSkeleton />;
  }

  if (jobError || !job) {
    return (
      <div className="site-container py-20">
        <div className="glass mx-auto max-w-2xl rounded-3xl p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10">
            <XCircle className="h-6 w-6 text-rose-400" />
          </div>

          <h1 className="mt-5 text-xl font-semibold text-white">
            We couldn't load this opportunity
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {jobError ||
              "The job may have been removed or is no longer available."}
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => fetchJobById(id)}
              className="btn-secondary"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>

            <Link to="/jobs" className="btn-primary">
              Browse jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const companyName = getCompanyName(job);
  const location = getLocation(job);
  const jobType = getJobType(job);
  const salary = getSalary(job);
  const requirements = getRequirements(job);
  const createdDate = getCreatedDate(job);

  const applicationStatus = applicationStatusByJobId?.[id] || null;

  const hasApplied =
    applicationStatus !== null && applicationStatus !== undefined;

  const isPending = applicationsLoading === id || applicationsLoading === true;

  const isRecruiter = user?.role === "recruiter";
  const isCandidate = user?.role === "candidate";

  const recruiterOwnsJob =
    isRecruiter &&
    job.created_by &&
    user?._id &&
    String(job.created_by) === String(user._id);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 subtle-grid opacity-30" />

        <div className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute right-1/4 top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="site-container relative py-8 sm:py-12">
          <Link
            to="/jobs"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to opportunities
          </Link>

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-300">
                  <BriefcaseBusiness className="h-3.5 w-3.5" />
                  {formatJobType(jobType)}
                </span>

                {job.category && (
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-400">
                    {job.category}
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {job.title}
              </h1>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-slate-500" />
                  {companyName}
                </span>

                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  {location}
                </span>

                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-slate-500" />
                  Posted {formatDate(createdDate)}
                </span>
              </div>
            </div>

            <div className="hidden shrink-0 lg:block">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-indigo-500/10 shadow-xl shadow-violet-950/20">
                <Building2 className="h-8 w-8 text-violet-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="site-container pt-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Main */}
          <main className="space-y-6">
            {/* Overview */}
            <section className="glass rounded-3xl p-6 sm:p-8">
              <SectionHeading icon={FileText} title="About the role" />

              <div className="mt-6 whitespace-pre-line text-sm leading-7 text-slate-400 sm:text-base">
                {job.description ||
                  "The hiring team has not provided a detailed description for this opportunity yet."}
              </div>
            </section>

            {/* Requirements */}
            <section className="glass rounded-3xl p-6 sm:p-8">
              <SectionHeading
                icon={ShieldCheck}
                title="What we're looking for"
              />

              {requirements.length > 0 ? (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {requirements.map((requirement, index) => (
                    <div
                      key={`${requirement}-${index}`}
                      className="flex gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4"
                    >
                      <div className="mt-0.5 shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                      </div>

                      <span className="text-sm leading-6 text-slate-300">
                        {requirement}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-6 text-sm leading-6 text-slate-500">
                  No specific requirements have been listed.
                </p>
              )}
            </section>

            {/* Recruiter view */}
            {recruiterOwnsJob && (
              <section className="rounded-3xl border border-violet-400/15 bg-violet-500/[0.06] p-6 sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-300">
                      <Users className="h-4 w-4" />
                      Recruiter workspace
                    </div>

                    <h2 className="mt-2 text-xl font-semibold text-white">
                      Review candidates for this role
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      View applicants and manage their application status from
                      your recruiter dashboard.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleViewApplicants}
                    className="btn-primary shrink-0"
                  >
                    <Users className="h-4 w-4" />
                    View applicants
                  </button>
                </div>

                {applicantsLoading && (
                  <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Loading applicants...
                  </div>
                )}

                {applicants?.length > 0 && (
                  <div className="mt-6 space-y-2">
                    {applicants.map((applicant) => (
                      <div
                        key={applicant._id || applicant.applicationId}
                        className="rounded-2xl border border-white/5 bg-slate-950/30 p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-medium text-white">
                              {applicant.name ||
                                applicant.applicant?.name ||
                                "Candidate"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {applicant.email ||
                                applicant.applicant?.email ||
                                "Email unavailable"}
                            </p>
                          </div>

                          <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium capitalize text-slate-400">
                            {applicant.status || "pending"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </main>

          {/* Sidebar */}
          <aside>
            <div className="space-y-4 lg:sticky lg:top-28">
              {/* Apply card */}
              <section className="glass overflow-hidden rounded-3xl">
                <div className="border-b border-white/5 p-6">
                  <div className="section-eyebrow mb-4">
                    <Sparkles className="h-3.5 w-3.5" />
                    Opportunity
                  </div>

                  <h2 className="text-xl font-semibold text-white">
                    Ready to take the next step?
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Apply for this role and put your profile in front of the
                    hiring team.
                  </p>
                </div>

                <div className="p-6">
                  {isCandidate && hasApplied ? (
                    <ApplicationStatus status={applicationStatus} />
                  ) : isCandidate ? (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={handleApply}
                      className="btn-primary w-full justify-center"
                    >
                      {isPending ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        <>
                          Apply for this role
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  ) : !user ? (
                    <button
                      type="button"
                      onClick={handleApply}
                      className="btn-primary w-full justify-center"
                    >
                      Sign in to apply
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : isRecruiter ? (
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
                      <p className="text-sm font-medium text-slate-300">
                        Recruiter account
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Candidate accounts can apply for job opportunities.
                      </p>
                    </div>
                  ) : null}

                  {applicationsError && (
                    <p className="mt-3 text-center text-xs leading-5 text-rose-400">
                      {applicationsError}
                    </p>
                  )}

                  {!user && (
                    <p className="mt-3 text-center text-xs text-slate-600">
                      You'll need a candidate account to submit an application.
                    </p>
                  )}
                </div>
              </section>

              {/* Job facts */}
              <section className="glass rounded-3xl p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Job details
                </h2>

                <div className="mt-5 space-y-5">
                  <JobFact
                    icon={WalletCards}
                    label="Compensation"
                    value={salary}
                  />

                  <JobFact icon={MapPin} label="Location" value={location} />

                  <JobFact
                    icon={Clock3}
                    label="Employment"
                    value={formatJobType(jobType)}
                  />

                  <JobFact
                    icon={CalendarDays}
                    label="Posted"
                    value={formatDate(createdDate)}
                  />

                  {job.position !== undefined && (
                    <JobFact
                      icon={Users}
                      label="Open positions"
                      value={String(job.position)}
                    />
                  )}
                </div>
              </section>

              {/* Trust */}
              <div className="rounded-3xl border border-cyan-400/10 bg-cyan-500/[0.04] p-5">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />

                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      Secure application flow
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Your application information is handled through the
                      platform's protected API.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
        <Icon className="h-5 w-5 text-violet-400" />
      </div>

      <h2 className="text-xl font-semibold text-white">{title}</h2>
    </div>
  );
}

function JobFact({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
        <Icon className="h-4 w-4 text-slate-400" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-600">{label}</p>

        <p className="mt-1 break-words text-sm font-medium text-slate-300">
          {value}
        </p>
      </div>
    </div>
  );
}

function ApplicationStatus({ status }) {
  const normalizedStatus = String(status).toLowerCase();

  const statusConfig = {
    pending: {
      icon: Clock3,
      title: "Application submitted",
      description: "Your application is waiting for review by the hiring team.",
      className: "border-amber-400/15 bg-amber-500/[0.06] text-amber-300",
    },
    accepted: {
      icon: CheckCircle2,
      title: "Application accepted",
      description: "The hiring team has accepted your application.",
      className: "border-emerald-400/15 bg-emerald-500/[0.06] text-emerald-300",
    },
    rejected: {
      icon: XCircle,
      title: "Application not selected",
      description:
        "The hiring team has decided not to move forward with this application.",
      className: "border-rose-400/15 bg-rose-500/[0.06] text-rose-300",
    },
  };

  const config = statusConfig[normalizedStatus] || statusConfig.pending;

  const Icon = config.icon;

  return (
    <div className={`rounded-2xl border p-4 ${config.className}`}>
      <div className="flex gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />

        <div>
          <p className="text-sm font-semibold">{config.title}</p>

          <p className="mt-1 text-xs leading-5 opacity-70">
            {config.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function JobDetailSkeleton() {
  return (
    <div className="min-h-screen animate-pulse">
      <section className="border-b border-white/5">
        <div className="site-container py-12">
          <div className="h-4 w-36 rounded bg-white/5" />

          <div className="mt-10 h-5 w-24 rounded bg-white/5" />

          <div className="mt-5 h-12 max-w-2xl rounded bg-white/5" />

          <div className="mt-5 h-4 max-w-xl rounded bg-white/5" />
        </div>
      </section>

      <section className="site-container py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <SkeletonBlock height="h-72" />
            <SkeletonBlock height="h-64" />
          </div>

          <div className="space-y-4">
            <SkeletonBlock height="h-72" />
            <SkeletonBlock height="h-64" />
          </div>
        </div>
      </section>
    </div>
  );
}

function SkeletonBlock({ height }) {
  return <div className={`glass rounded-3xl ${height}`} />;
}
