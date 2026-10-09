import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Code2,
  Eye,
  FileText,
  MapPin,
  Pencil,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { useAppStore } from "../store/useAppStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const BACKEND_URL = API_URL.replace(/\/api\/v1\/?$/, "");

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const getStatusConfig = (status) => {
  switch (status) {
    case "accepted":
      return {
        label: "Accepted",
        className: "border-emerald-400/15 bg-emerald-400/10 text-emerald-300",
      };

    case "rejected":
      return {
        label: "Rejected",
        className: "border-rose-400/15 bg-rose-400/10 text-rose-300",
      };

    default:
      return {
        label: "Pending",
        className: "border-amber-400/15 bg-amber-400/10 text-amber-300",
      };
  }
};

function DashboardStat({ icon: Icon, label, value, description }) {
  return (
    <div className="glass rounded-2xl border border-white/[0.06] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/20">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04]">
          <Icon className="h-5 w-5 text-violet-300" />
        </div>

        <span className="text-2xl font-bold tracking-tight text-white">
          {value}
        </span>
      </div>

      <p className="text-sm font-semibold text-slate-200">{label}</p>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function JobTypeBadge({ type }) {
  return (
    <span className="rounded-full border border-violet-400/15 bg-violet-400/10 px-2.5 py-1 text-[11px] font-semibold text-violet-300">
      {type || "Full-time"}
    </span>
  );
}

function DashboardSkeleton() {
  return (
    <div className="site-container py-10">
      <div className="animate-pulse space-y-6">
        <div className="h-36 rounded-3xl bg-white/[0.04]" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-32 rounded-2xl bg-white/[0.04]" />
          ))}
        </div>

        <div className="h-[500px] rounded-3xl bg-white/[0.04]" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const {
    user,
    adminJobs,
    fetchAdminJobs,
    createJob,
    updateJob,
    deleteJob,
    applicants,
    fetchApplicants,
    updateApplicationStatus,
    jobsLoading,
    jobsError,
    applicationsLoading,
    applicationsError,
  } = useAppStore();

  const [activeJobId, setActiveJobId] = useState(null);
  const [activeJobTitle, setActiveJobTitle] = useState("");
  const [applicantSearch, setApplicantSearch] = useState("");

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [position, setPosition] = useState(1);
  const [requirements, setRequirements] = useState("");
  const [description, setDescription] = useState("");

  const [formFeedback, setFormFeedback] = useState({
    type: "",
    message: "",
  });

  const [actionFeedback, setActionFeedback] = useState("");

  useEffect(() => {
    if (user?.role === "recruiter") {
      fetchAdminJobs();
    }
  }, [user, fetchAdminJobs]);

  const dashboardStats = useMemo(() => {
    const totalApplicants = adminJobs.reduce(
      (total, job) => total + (job.applications?.length || 0),
      0,
    );

    const totalPositions = adminJobs.reduce(
      (total, job) => total + Number(job.position || 0),
      0,
    );

    return {
      jobs: adminJobs.length,
      applicants: totalApplicants,
      positions: totalPositions,
    };
  }, [adminJobs]);

  const filteredApplicants = useMemo(() => {
    const query = applicantSearch.trim().toLowerCase();

    if (!query) {
      return applicants;
    }

    return applicants.filter((application) => {
      const name = application.applicant?.name?.toLowerCase() || "";
      const email = application.applicant?.email?.toLowerCase() || "";
      const skills =
        application.applicant?.profile?.skills?.join(" ").toLowerCase() || "";

      return (
        name.includes(query) || email.includes(query) || skills.includes(query)
      );
    });
  }, [applicants, applicantSearch]);

  const resetJobForm = () => {
    setEditingJobId(null);
    setTitle("");
    setCompany("");
    setLocation("");
    setSalary("");
    setJobType("Full-time");
    setPosition(1);
    setRequirements("");
    setDescription("");
    setFormFeedback({
      type: "",
      message: "",
    });
  };

  const openCreateModal = () => {
    resetJobForm();
    setShowFormModal(true);
  };

  const openEditModal = (job) => {
    setEditingJobId(job._id);
    setTitle(job.title || "");
    setCompany(job.company || "");
    setLocation(job.location || "");
    setSalary(job.salary || "");
    setJobType(job.jobType || "Full-time");
    setPosition(job.position || 1);
    setRequirements(job.requirements?.join(", ") || "");
    setDescription(job.description || "");

    setFormFeedback({
      type: "",
      message: "",
    });

    setShowFormModal(true);
  };

  const closeFormModal = () => {
    if (jobsLoading) {
      return;
    }

    setShowFormModal(false);
    resetJobForm();
  };

  const handleSaveJob = async (event) => {
    event.preventDefault();

    setFormFeedback({
      type: "",
      message: "",
    });

    const jobData = {
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      salary: salary.trim(),
      jobType,
      position: Number(position),
      requirements: requirements.trim(),
      description: description.trim(),
    };

    let response;

    if (editingJobId) {
      response = await updateJob(editingJobId, jobData);
    } else {
      response = await createJob(jobData);
    }

    if (response.success) {
      setShowFormModal(false);
      resetJobForm();
      return;
    }

    setFormFeedback({
      type: "error",
      message: response.message || "Unable to save the job.",
    });
  };

  const handleDeleteJob = async (job) => {
    const confirmed = window.confirm(
      `Delete "${job.title}"?\n\nThis will also remove applications associated with this job. This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setActionFeedback("");

    const response = await deleteJob(job._id);

    if (!response.success) {
      setActionFeedback(response.message || "Unable to delete the job.");
    }
  };

  const handleViewApplicants = async (job) => {
    setActionFeedback("");
    setApplicantSearch("");
    setActiveJobId(job._id);
    setActiveJobTitle(job.title);

    await fetchApplicants(job._id);
  };

  const handleStatusChange = async (applicationId, status) => {
    setActionFeedback("");

    const response = await updateApplicationStatus(
      applicationId,
      status,
      activeJobId,
    );

    if (response?.success === false) {
      setActionFeedback(
        response.message || "Unable to update application status.",
      );
    }
  };

  const handleBackToJobs = () => {
    setActiveJobId(null);
    setActiveJobTitle("");
    setApplicantSearch("");
    setActionFeedback("");
  };

  if (!user || user.role !== "recruiter") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="glass w-full max-w-md rounded-3xl border border-white/[0.06] p-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-400/10">
            <ShieldAlert className="h-7 w-7 text-rose-300" />
          </div>

          <h1 className="text-2xl font-bold text-white">
            Recruiter access required
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Only authenticated recruiter accounts can access this workspace.
          </p>

          <Link to="/" className="btn-primary mt-6 inline-flex">
            Return home
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (jobsLoading && adminJobs.length === 0 && !activeJobId) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden pb-20 pt-8">
      <div className="pointer-events-none absolute right-0 top-0 -z-10 h-[480px] w-[620px] rounded-full bg-violet-600/10 blur-[130px]" />

      <div className="site-container">
        {/* Dashboard header */}
        <section className="glass relative overflow-hidden rounded-[28px] border border-white/[0.07] p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-400/10">
                  <BriefcaseBusiness className="h-5 w-5 text-violet-300" />
                </div>

                <p className="section-eyebrow">Recruiter workspace</p>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Welcome back, {user.name?.split(" ")[0] || "Recruiter"}.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Manage your open roles, review candidates, and keep your hiring
                pipeline moving.
              </p>
            </div>

            {!activeJobId && (
              <button
                type="button"
                onClick={openCreateModal}
                className="btn-primary w-full sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                Create job
              </button>
            )}
          </div>
        </section>

        {/* Stats */}
        {!activeJobId && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardStat
              icon={BriefcaseBusiness}
              label="Published jobs"
              value={dashboardStats.jobs}
              description="Roles currently in your workspace"
            />

            <DashboardStat
              icon={Users}
              label="Applications"
              value={dashboardStats.applicants}
              description="Candidates across your jobs"
            />

            <DashboardStat
              icon={Code2}
              label="Open positions"
              value={dashboardStats.positions}
              description="Total hiring slots published"
            />

            <DashboardStat
              icon={Check}
              label="Workspace"
              value="LIVE"
              description="Recruiter account is active"
            />
          </div>
        )}

        {/* Action error */}
        {actionFeedback && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-400/15 bg-rose-400/10 p-4 text-sm text-rose-300">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Applicant view */}
        {activeJobId ? (
          <section className="mt-6">
            <button
              type="button"
              onClick={handleBackToJobs}
              className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to job postings
            </button>

            <div className="glass overflow-hidden rounded-3xl border border-white/[0.06]">
              <div className="border-b border-white/[0.06] p-6 sm:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="section-eyebrow mb-2">Candidate pipeline</p>

                    <h2 className="text-2xl font-bold tracking-tight text-white">
                      {activeJobTitle}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Review applicants and update their application status.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                      <input
                        type="search"
                        value={applicantSearch}
                        onChange={(event) =>
                          setApplicantSearch(event.target.value)
                        }
                        placeholder="Search candidates..."
                        className="focus-ring w-full rounded-xl border border-white/[0.08] bg-white/[0.035] py-2.5 pl-9 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400/30 sm:w-64"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {applicationsLoading ? (
                <div className="space-y-3 p-6 sm:p-8">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-24 animate-pulse rounded-2xl bg-white/[0.03]"
                    />
                  ))}
                </div>
              ) : applicationsError ? (
                <div className="p-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-400/10">
                    <AlertCircle className="h-6 w-6 text-rose-300" />
                  </div>

                  <h3 className="mt-4 font-semibold text-white">
                    Applicants couldn't be loaded
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    {applicationsError}
                  </p>

                  <button
                    type="button"
                    onClick={() => fetchApplicants(activeJobId)}
                    className="btn-secondary mt-5"
                  >
                    Try again
                  </button>
                </div>
              ) : filteredApplicants.length === 0 ? (
                <div className="p-12 text-center sm:p-20">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-400/10">
                    <Users className="h-7 w-7 text-violet-300" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-white">
                    {applicantSearch
                      ? "No matching candidates"
                      : "No applications yet"}
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    {applicantSearch
                      ? "Try another name, email address, or skill."
                      : "Applications for this position will appear here when candidates apply."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.05]">
                  {filteredApplicants.map((application) => {
                    const candidate = application.applicant;
                    const resume = candidate?.profile?.resume;

                    return (
                      <div
                        key={application._id}
                        className="p-5 transition-colors hover:bg-white/[0.02] sm:p-6"
                      >
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                          <div className="flex min-w-0 items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-400/10 font-bold text-violet-300">
                              {getInitials(candidate?.name)}
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-bold text-white">
                                  {candidate?.name || "Unknown candidate"}
                                </h3>

                                <StatusBadge status={application.status} />
                              </div>

                              <p className="mt-1 text-sm text-slate-500">
                                {candidate?.email || "No email available"}
                              </p>

                              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">
                                <span className="inline-flex items-center gap-1.5">
                                  <CalendarDays className="h-3.5 w-3.5" />
                                  Applied {formatDate(application.createdAt)}
                                </span>

                                {candidate?.profile?.skills?.length > 0 && (
                                  <span className="inline-flex items-center gap-1.5">
                                    <Code2 className="h-3.5 w-3.5" />
                                    {candidate.profile.skills
                                      .slice(0, 3)
                                      .join(", ")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                            {resume ? (
                              <a
                                href={`${BACKEND_URL}${resume}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary"
                              >
                                <FileText className="h-4 w-4" />
                                View resume
                              </a>
                            ) : (
                              <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] px-3.5 py-2.5 text-xs text-slate-600">
                                No resume
                              </span>
                            )}

                            {application.status === "pending" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStatusChange(
                                      application._id,
                                      "accepted",
                                    )
                                  }
                                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/10 px-3.5 py-2.5 text-sm font-semibold text-emerald-300 transition-all hover:bg-emerald-400/15"
                                >
                                  <Check className="h-4 w-4" />
                                  Accept
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStatusChange(
                                      application._id,
                                      "rejected",
                                    )
                                  }
                                  className="inline-flex items-center gap-2 rounded-xl border border-rose-400/15 bg-rose-400/10 px-3.5 py-2.5 text-sm font-semibold text-rose-300 transition-all hover:bg-rose-400/15"
                                >
                                  <X className="h-4 w-4" />
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        ) : (
          /* Job management */
          <section className="mt-6">
            <div className="glass overflow-hidden rounded-3xl border border-white/[0.06]">
              <div className="border-b border-white/[0.06] p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="section-eyebrow mb-2">Hiring pipeline</p>

                    <h2 className="text-2xl font-bold tracking-tight text-white">
                      Your job postings
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Create, edit, and manage the positions you're currently
                      hiring for.
                    </p>
                  </div>

                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {adminJobs.length} {adminJobs.length === 1 ? "job" : "jobs"}{" "}
                    published
                  </span>
                </div>
              </div>

              {jobsError ? (
                <div className="p-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-400/10">
                    <AlertCircle className="h-6 w-6 text-rose-300" />
                  </div>

                  <h3 className="mt-4 font-semibold text-white">
                    Jobs couldn't be loaded
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    {jobsError}
                  </p>

                  <button
                    type="button"
                    onClick={() => fetchAdminJobs()}
                    className="btn-secondary mt-5"
                  >
                    Try again
                  </button>
                </div>
              ) : adminJobs.length === 0 ? (
                <div className="p-12 text-center sm:p-20">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-400/10">
                    <BriefcaseBusiness className="h-7 w-7 text-violet-300" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-white">
                    No job postings yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Publish your first role and start building your candidate
                    pipeline.
                  </p>

                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="btn-primary mt-6"
                  >
                    <Plus className="h-4 w-4" />
                    Create your first job
                  </button>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="border-b border-white/[0.06] bg-white/[0.015] text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                          <th className="px-6 py-4">Position</th>

                          <th className="px-4 py-4">Location</th>

                          <th className="px-4 py-4">Type</th>

                          <th className="px-4 py-4">Applicants</th>

                          <th className="px-4 py-4">Posted</th>

                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-white/[0.05]">
                        {adminJobs.map((job) => (
                          <tr
                            key={job._id}
                            className="transition-colors hover:bg-white/[0.02]"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">
                                  <BriefcaseBusiness className="h-4 w-4 text-violet-300" />
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate font-semibold text-white">
                                    {job.title}
                                  </p>

                                  <p className="mt-1 truncate text-xs text-slate-600">
                                    {job.company}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-5">
                              <span className="inline-flex items-center gap-1.5 text-sm text-slate-400">
                                <MapPin className="h-3.5 w-3.5 text-slate-600" />
                                {job.location}
                              </span>
                            </td>

                            <td className="px-4 py-5">
                              <JobTypeBadge type={job.jobType} />
                            </td>

                            <td className="px-4 py-5">
                              <button
                                type="button"
                                onClick={() => handleViewApplicants(job)}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-violet-400/20 hover:bg-violet-400/10 hover:text-violet-300"
                              >
                                <Users className="h-3.5 w-3.5" />
                                {job.applications?.length || 0}
                              </button>
                            </td>

                            <td className="px-4 py-5 text-sm text-slate-600">
                              {formatDate(job.createdAt)}
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex justify-end gap-2">
                                <Link
                                  to={`/jobs/${job._id}`}
                                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] text-slate-500 transition-all hover:border-violet-400/20 hover:bg-violet-400/10 hover:text-violet-300"
                                  title="View job"
                                >
                                  <Eye className="h-4 w-4" />
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => openEditModal(job)}
                                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] text-slate-500 transition-all hover:border-violet-400/20 hover:bg-violet-400/10 hover:text-violet-300"
                                  title="Edit job"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteJob(job)}
                                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] text-slate-500 transition-all hover:border-rose-400/20 hover:bg-rose-400/10 hover:text-rose-300"
                                  title="Delete job"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile/tablet cards */}
                  <div className="divide-y divide-white/[0.05] lg:hidden">
                    {adminJobs.map((job) => (
                      <div key={job._id} className="p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">
                              <BriefcaseBusiness className="h-5 w-5 text-violet-300" />
                            </div>

                            <div className="min-w-0">
                              <h3 className="truncate font-bold text-white">
                                {job.title}
                              </h3>

                              <p className="mt-1 text-xs text-slate-600">
                                {job.company}
                              </p>
                            </div>
                          </div>

                          <JobTypeBadge type={job.jobType} />
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                            <p className="text-slate-600">Location</p>

                            <p className="mt-1 truncate text-slate-300">
                              {job.location}
                            </p>
                          </div>

                          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                            <p className="text-slate-600">Applicants</p>

                            <p className="mt-1 text-slate-300">
                              {job.applications?.length || 0}
                            </p>
                          </div>

                          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                            <p className="text-slate-600">Positions</p>

                            <p className="mt-1 text-slate-300">
                              {job.position || 0}
                            </p>
                          </div>

                          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                            <p className="text-slate-600">Posted</p>

                            <p className="mt-1 text-slate-300">
                              {formatDate(job.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewApplicants(job)}
                            className="btn-secondary flex-1"
                          >
                            <Users className="h-4 w-4" />
                            Applicants
                          </button>

                          <Link
                            to={`/jobs/${job._id}`}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] text-slate-500 hover:border-violet-400/20 hover:bg-violet-400/10 hover:text-violet-300"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => openEditModal(job)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] text-slate-500 hover:border-violet-400/20 hover:bg-violet-400/10 hover:text-violet-300"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteJob(job)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] text-slate-500 hover:border-rose-400/20 hover:bg-rose-400/10 hover:text-rose-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Create / edit job modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="absolute inset-0" onClick={closeFormModal} />

          <div className="relative my-8 w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0b1628] shadow-2xl shadow-black/50">
            <div className="flex items-start justify-between border-b border-white/[0.06] p-6 sm:p-7">
              <div>
                <p className="section-eyebrow mb-2">
                  {editingJobId ? "Job management" : "New opportunity"}
                </p>

                <h2 className="text-xl font-bold text-white">
                  {editingJobId ? "Edit job posting" : "Create a job posting"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingJobId
                    ? "Update the details of your existing position."
                    : "Publish a clear and compelling opportunity for candidates."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeFormModal}
                disabled={jobsLoading}
                className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveJob}
              className="max-h-[75vh] overflow-y-auto p-6 sm:p-7"
            >
              {formFeedback.message && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-400/15 bg-rose-400/10 p-4 text-sm text-rose-300">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>{formFeedback.message}</span>
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="job-title"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Job title
                  </label>

                  <input
                    id="job-title"
                    type="text"
                    required
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Senior Full Stack Developer"
                    className="focus-ring w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400/40"
                  />
                </div>

                <div>
                  <label
                    htmlFor="job-company"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Company
                  </label>

                  <input
                    id="job-company"
                    type="text"
                    required
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    placeholder="Acme Inc."
                    className="focus-ring w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400/40"
                  />
                </div>

                <div>
                  <label
                    htmlFor="job-location"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Location
                  </label>

                  <input
                    id="job-location"
                    type="text"
                    required
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Dhaka / Remote"
                    className="focus-ring w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400/40"
                  />
                </div>

                <div>
                  <label
                    htmlFor="job-salary"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Salary range
                  </label>

                  <input
                    id="job-salary"
                    type="text"
                    required
                    value={salary}
                    onChange={(event) => setSalary(event.target.value)}
                    placeholder="$80k – $120k"
                    className="focus-ring w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400/40"
                  />
                </div>

                <div>
                  <label
                    htmlFor="job-type"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Job type
                  </label>

                  <select
                    id="job-type"
                    value={jobType}
                    onChange={(event) => setJobType(event.target.value)}
                    className="focus-ring w-full rounded-xl border border-white/[0.08] bg-[#101c2f] px-4 py-3 text-sm text-white outline-none focus:border-violet-400/40"
                  >
                    <option value="Full-time">Full-time</option>

                    <option value="Part-time">Part-time</option>

                    <option value="Contract">Contract</option>

                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="job-position"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Positions available
                  </label>

                  <input
                    id="job-position"
                    type="number"
                    min="1"
                    required
                    value={position}
                    onChange={(event) => setPosition(event.target.value)}
                    className="focus-ring w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm text-white outline-none focus:border-violet-400/40"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="job-requirements"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Requirements
                  </label>

                  <input
                    id="job-requirements"
                    type="text"
                    required
                    value={requirements}
                    onChange={(event) => setRequirements(event.target.value)}
                    placeholder="React, Node.js, MongoDB, TypeScript..."
                    className="focus-ring w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400/40"
                  />

                  <p className="mt-2 text-xs text-slate-600">
                    Separate requirements with commas.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="job-description"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Description
                  </label>

                  <textarea
                    id="job-description"
                    rows={6}
                    required
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Describe the role, responsibilities, team, and what success looks like..."
                    className="focus-ring w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-violet-400/40"
                  />
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeFormModal}
                  disabled={jobsLoading}
                  className="btn-secondary w-full sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={jobsLoading}
                  className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {jobsLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingJobId ? (
                        <Pencil className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}

                      {editingJobId ? "Save changes" : "Publish job"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
