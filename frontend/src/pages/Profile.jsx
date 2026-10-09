import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
  Edit3,
  FileText,
  FileUp,
  Info,
  Mail,
  MapPin,
  Pencil,
  ShieldCheck,
  Sparkles,
  Upload,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { useAppStore } from "../store/useAppStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const BACKEND_URL = API_URL.replace(/\/api\/v1\/?$/, "");

const formatDate = (value) => {
  if (!value) return "â€”";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "â€”";
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
        icon: CheckCircle2,
        className: "border-emerald-400/15 bg-emerald-400/10 text-emerald-300",
      };

    case "rejected":
      return {
        label: "Rejected",
        icon: X,
        className: "border-rose-400/15 bg-rose-400/10 text-rose-300",
      };

    default:
      return {
        label: "Pending",
        icon: Clock3,
        className: "border-amber-400/15 bg-amber-400/10 text-amber-300",
      };
  }
};

function ProfileStat({ label, value, description, icon: Icon }) {
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

function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="section-eyebrow mb-2">{eyebrow}</p>}

        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

function StatusBadge({ status }) {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-6">
        <div className="h-56 rounded-3xl bg-white/[0.04]" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-32 rounded-2xl bg-white/[0.04]" />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="h-72 rounded-3xl bg-white/[0.04]" />
          <div className="h-72 rounded-3xl bg-white/[0.04]" />
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const {
    user,
    appliedJobs,
    fetchAppliedJobs,
    updateProfile,
    authLoading,
    adminJobs,
    fetchAdminJobs,
    applicationsLoading,
    applicationsError,
  } = useAppStore();

  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab =
    searchParams.get("tab") === "applied" && user?.role === "candidate"
      ? "applied"
      : "overview";

  const [showEditModal, setShowEditModal] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [modalFeedback, setModalFeedback] = useState({
    type: "",
    message: "",
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(user.name || "");
    setEmail(user.email || "");
    setBio(user.profile?.bio || "");
    setSkills(user.profile?.skills?.join(", ") || "");
  }, [user]);

  useEffect(() => {
    if (user?.role === "candidate") {
      fetchAppliedJobs();
    }

    if (user?.role === "recruiter") {
      fetchAdminJobs();
    }
  }, [user, fetchAppliedJobs, fetchAdminJobs]);

  const applicationStats = useMemo(() => {
    const total = appliedJobs.length;

    const accepted = appliedJobs.filter(
      (application) => application.status === "accepted",
    ).length;

    const rejected = appliedJobs.filter(
      (application) => application.status === "rejected",
    ).length;

    const pending = appliedJobs.filter(
      (application) => !application.status || application.status === "pending",
    ).length;

    return {
      total,
      accepted,
      rejected,
      pending,
    };
  }, [appliedJobs]);

  const openEditModal = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setBio(user?.profile?.bio || "");
    setSkills(user?.profile?.skills?.join(", ") || "");
    setResumeFile(null);
    setModalFeedback({
      type: "",
      message: "",
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    if (authLoading) {
      return;
    }

    setShowEditModal(false);
    setResumeFile(null);
    setModalFeedback({
      type: "",
      message: "",
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    setModalFeedback({
      type: "",
      message: "",
    });

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      setModalFeedback({
        type: "error",
        message: "Name and email are required.",
      });
      return;
    }

    const formData = new FormData();

    formData.append("name", trimmedName);
    formData.append("email", trimmedEmail);
    formData.append("bio", bio.trim());
    formData.append("skills", skills.trim());

    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    const response = await updateProfile(formData);

    if (response.success) {
      setModalFeedback({
        type: "success",
        message: response.message || "Profile updated successfully.",
      });

      setTimeout(() => {
        setShowEditModal(false);
        setResumeFile(null);
        setModalFeedback({
          type: "",
          message: "",
        });
      }, 700);

      return;
    }

    setModalFeedback({
      type: "error",
      message: response.message || "Unable to update your profile.",
    });
  };

  const handleRetryApplications = async () => {
    await fetchAppliedJobs();
  };

  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="glass w-full max-w-md rounded-3xl border border-white/[0.06] p-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10">
            <AlertCircle className="h-7 w-7 text-amber-300" />
          </div>

          <h1 className="text-2xl font-bold text-white">
            Authentication required
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Sign in to access your profile and manage your account.
          </p>

          <Link to="/login" className="btn-primary mt-6 inline-flex">
            Sign in
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (authLoading && !user) {
    return <ProfileSkeleton />;
  }

  const isCandidate = user.role === "candidate";
  const isRecruiter = user.role === "recruiter";

  const profileSkills = user.profile?.skills || [];

  const resumeUrl = user.profile?.resume
    ? `${BACKEND_URL}${user.profile.resume}`
    : null;

  return (
    <div className="relative min-h-screen overflow-hidden pb-20 pt-8">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="site-container">
        {/* Page heading */}
        <div className="mb-8">
          <p className="section-eyebrow mb-3">
            {isRecruiter ? "Recruiter workspace" : "Your workspace"}
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Profile & account
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Manage your professional identity, application activity, and account
            information from one place.
          </p>
        </div>

        {/* Profile hero */}
        <section className="glass relative overflow-hidden rounded-[28px] border border-white/[0.07] p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-5">
              <div className="relative shrink-0">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-300/20 bg-gradient-to-br from-violet-500/30 to-indigo-500/10 text-2xl font-bold text-white shadow-xl shadow-violet-950/30">
                  {getInitials(user.name)}
                </div>

                <div className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0b1628] bg-emerald-400">
                  <Check className="h-3.5 w-3.5 text-slate-950" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-2xl font-bold tracking-tight text-white">
                    {user.name}
                  </h2>

                  <span className="rounded-full border border-violet-400/15 bg-violet-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-violet-300">
                    {user.role}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-slate-500" />
                    {user.email}
                  </span>

                  {user.profile?.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      {user.profile.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={openEditModal}
              className="btn-secondary w-full sm:w-auto"
            >
              <Pencil className="h-4 w-4" />
              Edit profile
            </button>
          </div>

          {/* Tabs */}
          <div className="relative mt-8 flex flex-wrap gap-2 border-t border-white/[0.06] pt-5">
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                activeTab === "overview"
                  ? "bg-violet-500 text-white shadow-lg shadow-violet-950/30"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              Overview
            </button>

            {isCandidate && (
              <button
                type="button"
                onClick={() => setSearchParams({ tab: "applied" })}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === "applied"
                    ? "bg-violet-500 text-white shadow-lg shadow-violet-950/30"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                Applications
                <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs">
                  {applicationStats.total}
                </span>
              </button>
            )}
          </div>
        </section>

        {/* Candidate stats */}
        {isCandidate && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ProfileStat
              label="Applications"
              value={applicationStats.total}
              description="Total submitted applications"
              icon={BriefcaseBusiness}
            />

            <ProfileStat
              label="Pending"
              value={applicationStats.pending}
              description="Waiting for recruiter review"
              icon={Clock3}
            />

            <ProfileStat
              label="Accepted"
              value={applicationStats.accepted}
              description="Applications moving forward"
              icon={CheckCircle2}
            />

            <ProfileStat
              label="Skills"
              value={profileSkills.length}
              description="Technologies on your profile"
              icon={Code2}
            />
          </div>
        )}

        {/* Recruiter stats */}
        {isRecruiter && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ProfileStat
              label="Jobs published"
              value={adminJobs.length}
              description="Active roles in your workspace"
              icon={BriefcaseBusiness}
            />

            <ProfileStat
              label="Account type"
              value="PRO"
              description="Recruiter workspace access"
              icon={ShieldCheck}
            />

            <ProfileStat
              label="Hiring"
              value="Active"
              description="Your recruiting workspace is ready"
              icon={Users}
            />
          </div>
        )}

        {/* Main content */}
        {activeTab === "overview" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            {/* Left column */}
            <div className="space-y-6">
              {/* Professional summary */}
              <section className="glass rounded-3xl border border-white/[0.06] p-6 sm:p-8">
                <SectionHeader
                  eyebrow="Profile"
                  title="Professional summary"
                  description="Give recruiters a concise picture of who you are and what you bring."
                  action={
                    <button
                      type="button"
                      onClick={openEditModal}
                      className="hidden items-center gap-1.5 text-sm font-semibold text-violet-300 transition-colors hover:text-violet-200 sm:inline-flex"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>
                  }
                />

                {user.profile?.bio ? (
                  <p className="max-w-3xl text-sm leading-7 text-slate-300">
                    {user.profile.bio}
                  </p>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] p-6">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10">
                        <Sparkles className="h-5 w-5 text-violet-300" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          Complete your profile
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          Add a short professional summary so recruiters can
                          understand your background before reviewing your
                          application.
                        </p>

                        <button
                          type="button"
                          onClick={openEditModal}
                          className="mt-4 text-sm font-semibold text-violet-300 hover:text-violet-200"
                        >
                          Add summary â†’
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Skills */}
              <section className="glass rounded-3xl border border-white/[0.06] p-6 sm:p-8">
                <SectionHeader
                  eyebrow="Expertise"
                  title="Skills & technologies"
                  description="Your technical stack and professional strengths."
                />

                {profileSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {profileSkills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-xl border border-white/[0.07] bg-white/[0.035] px-3.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-violet-400/20 hover:text-white"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] p-6">
                    <div className="flex items-center gap-3">
                      <Code2 className="h-5 w-5 text-slate-500" />

                      <p className="text-sm text-slate-500">
                        No skills have been added yet.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={openEditModal}
                      className="mt-4 text-sm font-semibold text-violet-300 hover:text-violet-200"
                    >
                      Add your skills â†’
                    </button>
                  </div>
                )}
              </section>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Resume */}
              {isCandidate && (
                <section className="glass overflow-hidden rounded-3xl border border-white/[0.06]">
                  <div className="border-b border-white/[0.06] p-6">
                    <p className="section-eyebrow mb-2">Candidate profile</p>

                    <h2 className="text-lg font-bold text-white">Resume</h2>
                  </div>

                  <div className="p-6">
                    {user.profile?.resume ? (
                      <>
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-400/10">
                            <FileText className="h-5 w-5 text-violet-300" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white">
                              {user.profile.resumeOriginalName ||
                                "Uploaded resume"}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              Your resume is available to recruiters when you
                              apply for their jobs.
                            </p>
                          </div>
                        </div>

                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary mt-5 w-full"
                        >
                          <FileText className="h-4 w-4" />
                          Open resume
                        </a>
                      </>
                    ) : (
                      <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/10">
                          <FileUp className="h-6 w-6 text-violet-300" />
                        </div>

                        <h3 className="mt-4 text-sm font-semibold text-white">
                          Add your resume
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          Upload a PDF, DOC, or DOCX resume to make your profile
                          application-ready.
                        </p>

                        <button
                          type="button"
                          onClick={openEditModal}
                          className="btn-primary mt-5 w-full"
                        >
                          <Upload className="h-4 w-4" />
                          Upload resume
                        </button>
                      </>
                    )}
                  </div>
                </section>
              )}

              {/* Recruiter workspace */}
              {isRecruiter && (
                <section className="glass rounded-3xl border border-white/[0.06] p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-400/10">
                    <BriefcaseBusiness className="h-5 w-5 text-violet-300" />
                  </div>

                  <h2 className="mt-5 text-lg font-bold text-white">
                    Recruiting workspace
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Manage your job postings and review candidates from the
                    recruiter dashboard.
                  </p>

                  <Link to="/dashboard" className="btn-primary mt-5 w-full">
                    Open dashboard
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </section>
              )}

              {/* Account information */}
              <section className="glass rounded-3xl border border-white/[0.06] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
                    <UserRound className="h-5 w-5 text-slate-300" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Account information
                    </p>

                    <p className="text-xs text-slate-500">
                      Your registered details
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                      Full name
                    </p>
                    <p className="mt-1 text-sm text-slate-300">{user.name}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                      Email
                    </p>
                    <p className="mt-1 break-all text-sm text-slate-300">
                      {user.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                      Account role
                    </p>
                    <p className="mt-1 text-sm capitalize text-slate-300">
                      {user.role}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* Applications */}
        {activeTab === "applied" && isCandidate && (
          <section className="mt-6 glass overflow-hidden rounded-3xl border border-white/[0.06]">
            <div className="border-b border-white/[0.06] p-6 sm:p-8">
              <SectionHeader
                eyebrow="Candidate activity"
                title="Application history"
                description="Track the jobs you've applied to and their current status."
                action={
                  <Link to="/jobs" className="btn-secondary">
                    Find more jobs
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                }
              />
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
              <div className="p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-400/10">
                  <AlertCircle className="h-6 w-6 text-rose-300" />
                </div>

                <h3 className="mt-4 font-semibold text-white">
                  Applications couldn't be loaded
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {applicationsError}
                </p>

                <button
                  type="button"
                  onClick={handleRetryApplications}
                  className="btn-secondary mt-5"
                >
                  Try again
                </button>
              </div>
            ) : appliedJobs.length === 0 ? (
              <div className="p-10 text-center sm:p-16">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-400/10">
                  <BriefcaseBusiness className="h-7 w-7 text-violet-300" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-white">
                  No applications yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Your application activity will appear here after you apply for
                  a job.
                </p>

                <Link to="/jobs" className="btn-primary mt-6 inline-flex">
                  Explore jobs
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.05]">
                {appliedJobs.map((application) => {
                  const job = application.job;

                  return (
                    <div
                      key={application._id}
                      className="group p-5 transition-colors hover:bg-white/[0.02] sm:p-6"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">
                            <BriefcaseBusiness className="h-5 w-5 text-violet-300" />
                          </div>

                          <div className="min-w-0">
                            {job?._id ? (
                              <Link
                                to={`/jobs/${job._id}`}
                                className="line-clamp-1 text-base font-bold text-white transition-colors hover:text-violet-300"
                              >
                                {job.title || "Untitled position"}
                              </Link>
                            ) : (
                              <p className="line-clamp-1 text-base font-bold text-white">
                                {job?.title || "Untitled position"}
                              </p>
                            )}

                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                              <span>
                                {job?.company || "Company not available"}
                              </span>

                              {job?.location && (
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {job.location}
                                </span>
                              )}

                              <span>
                                Applied {formatDate(application.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 lg:justify-end">
                          <StatusBadge status={application.status} />

                          {job?._id && (
                            <Link
                              to={`/jobs/${job._id}`}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] text-slate-500 transition-all hover:border-violet-400/20 hover:bg-violet-400/10 hover:text-violet-300"
                              aria-label="View job"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Edit profile modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="absolute inset-0" onClick={closeEditModal} />

          <div className="relative my-8 w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0b1628] shadow-2xl shadow-black/50">
            <div className="flex items-start justify-between border-b border-white/[0.06] p-6 sm:p-7">
              <div>
                <p className="section-eyebrow mb-2">Account settings</p>

                <h2 className="text-xl font-bold text-white">
                  Edit your profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Keep your professional information up to date.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={authLoading}
                className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="max-h-[75vh] overflow-y-auto p-6 sm:p-7"
            >
              {modalFeedback.message && (
                <div
                  className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 text-sm ${
                    modalFeedback.type === "success"
                      ? "border-emerald-400/15 bg-emerald-400/10 text-emerald-300"
                      : "border-rose-400/15 bg-rose-400/10 text-rose-300"
                  }`}
                >
                  {modalFeedback.type === "success" ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  )}

                  <span>{modalFeedback.message}</span>
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="profile-name"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Full name
                  </label>

                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    className="focus-ring w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-violet-400/40"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="profile-email"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Email
                  </label>

                  <input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="focus-ring w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-violet-400/40"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="profile-bio"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                >
                  Professional summary
                </label>

                <textarea
                  id="profile-bio"
                  rows={5}
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  className="focus-ring w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm leading-6 text-white outline-none transition-colors placeholder:text-slate-600 focus:border-violet-400/40"
                  placeholder="Tell recruiters about your experience, strengths, and career focus..."
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="profile-skills"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                >
                  Skills
                </label>

                <input
                  id="profile-skills"
                  type="text"
                  value={skills}
                  onChange={(event) => setSkills(event.target.value)}
                  className="focus-ring w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-violet-400/40"
                  placeholder="React, Node.js, MongoDB, TypeScript..."
                />

                <p className="mt-2 text-xs text-slate-600">
                  Separate multiple skills with commas.
                </p>
              </div>

              {isCandidate && (
                <div className="mt-5">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Resume
                  </label>

                  <div className="relative rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.025] p-5 transition-colors hover:border-violet-400/30">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(event) =>
                        setResumeFile(event.target.files?.[0] || null)
                      }
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />

                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-400/10">
                        <FileUp className="h-5 w-5 text-violet-300" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {resumeFile
                            ? resumeFile.name
                            : user.profile?.resumeOriginalName ||
                              "Choose a resume file"}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          PDF, DOC, or DOCX
                        </p>
                      </div>

                      <Upload className="ml-auto h-5 w-5 shrink-0 text-slate-500" />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={authLoading}
                  className="btn-secondary w-full sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {authLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Save changes
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
