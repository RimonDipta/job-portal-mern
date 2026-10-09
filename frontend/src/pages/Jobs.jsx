import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ArrowDownUp,
  X,
  BriefcaseBusiness,
  ChevronDown,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

import JobCard from "../components/JobCard";
import { useAppStore } from "../store/useAppStore";

const CATEGORY_OPTIONS = [
  "Frontend",
  "Backend",
  "Full Stack",
  "Product Design",
  "Product",
  "Mobile",
];

const TYPE_OPTIONS = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "salary-high", label: "Salary: High to Low" },
  { value: "salary-low", label: "Salary: Low to High" },
];

const normalize = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const getJobDate = (job) => {
  const value =
    job.createdAt || job.created_at || job.updatedAt || job.updated_at;

  const timestamp = value ? new Date(value).getTime() : 0;

  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const getSalaryValue = (job) => {
  const candidates = [job.salary, job.salaryMin, job.salary_max, job.salaryMax];

  for (const value of candidates) {
    const numeric = Number(
      typeof value === "string" ? value.replace(/[^0-9.]/g, "") : value,
    );

    if (Number.isFinite(numeric)) {
      return numeric;
    }
  }

  return 0;
};

const matchesCategory = (job, category) => {
  if (!category) {
    return true;
  }

  const target = normalize(category);

  const values = [
    job.category,
    job.jobCategory,
    job.job_category,
    job.industry,
    job.title,
  ]
    .filter(Boolean)
    .map(normalize);

  return values.some((value) => value.includes(target));
};

const matchesJobType = (job, type) => {
  if (!type) {
    return true;
  }

  const target = normalize(type);

  const values = [job.jobType, job.job_type, job.type]
    .filter(Boolean)
    .map(normalize);

  return values.some((value) => {
    return value === target || value.replace(/\s+/g, "-") === target;
  });
};

const matchesKeyword = (job, keyword) => {
  if (!keyword) {
    return true;
  }

  const target = normalize(keyword);

  const searchableText = [
    job.title,
    job.description,
    job.company,
    job.location,
    job.category,
    job.jobCategory,
    job.jobType,
    ...(Array.isArray(job.requirements) ? job.requirements : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(target);
};

const matchesLocation = (job, location) => {
  if (!location) {
    return true;
  }

  const target = normalize(location);

  return normalize(job.location).includes(target);
};

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { jobs, jobsLoading, jobsError, fetchJobs } = useAppStore();

  const [keywordInput, setKeywordInput] = useState(
    searchParams.get("keyword") || "",
  );

  const [locationInput, setLocationInput] = useState(
    searchParams.get("location") || "",
  );

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const keyword = searchParams.get("keyword") || "";
  const location = searchParams.get("location") || "";
  const category = searchParams.get("category") || "";
  const type = searchParams.get("type") || "";
  const sort = searchParams.get("sort") || "latest";

  useEffect(() => {
    setKeywordInput(keyword);
    setLocationInput(location);
  }, [keyword, location]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const updateParams = (updates) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      const normalizedValue = typeof value === "string" ? value.trim() : value;

      if (
        normalizedValue === "" ||
        normalizedValue === null ||
        normalizedValue === undefined
      ) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, normalizedValue);
      }
    });

    setSearchParams(nextParams);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    updateParams({
      keyword: keywordInput,
      location: locationInput,
    });
  };

  const handleCategoryChange = (value) => {
    updateParams({
      category: value === category ? "" : value,
    });
  };

  const handleTypeChange = (value) => {
    updateParams({
      type: value === type ? "" : value,
    });
  };

  const handleSortChange = (event) => {
    updateParams({
      sort: event.target.value,
    });
  };

  const clearFilters = () => {
    setKeywordInput("");
    setLocationInput("");

    setSearchParams({});
  };

  const filteredJobs = useMemo(() => {
    const filtered = jobs.filter((job) => {
      return (
        matchesKeyword(job, keyword) &&
        matchesLocation(job, location) &&
        matchesCategory(job, category) &&
        matchesJobType(job, type)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sort === "oldest") {
        return getJobDate(a) - getJobDate(b);
      }

      if (sort === "salary-high") {
        return getSalaryValue(b) - getSalaryValue(a);
      }

      if (sort === "salary-low") {
        return getSalaryValue(a) - getSalaryValue(b);
      }

      return getJobDate(b) - getJobDate(a);
    });
  }, [jobs, keyword, location, category, type, sort]);

  const activeFilterCount = [keyword, location, category, type].filter(
    Boolean,
  ).length;

  return (
    <div className="min-h-screen pb-20">
      {/* Page header */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 subtle-grid opacity-30" />

        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute -right-32 top-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="site-container relative py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="section-eyebrow mb-5">
              <Sparkles className="h-3.5 w-3.5" />
              Explore opportunities
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find work that
              <span className="gradient-text"> moves you forward.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Search open positions, discover companies, and find opportunities
              that match the way you want to work.
            </p>
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="glass mt-10 rounded-2xl p-2 sm:p-3"
          >
            <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-slate-950/40 px-4 py-3">
                <Search className="h-5 w-5 shrink-0 text-slate-500" />

                <input
                  type="text"
                  value={keywordInput}
                  onChange={(event) => setKeywordInput(event.target.value)}
                  placeholder="Job title, skill, or keyword"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                />
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-slate-950/40 px-4 py-3">
                <MapPin className="h-5 w-5 shrink-0 text-slate-500" />

                <input
                  type="text"
                  value={locationInput}
                  onChange={(event) => setLocationInput(event.target.value)}
                  placeholder="City, country, or remote"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                />
              </div>

              <button type="submit" className="btn-primary min-h-[48px] px-7">
                Search jobs
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Marketplace */}
      <section className="site-container pt-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
          {/* Desktop filters */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="glass sticky top-28 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-white">Filters</h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Refine your search
                  </p>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-medium text-violet-400 transition-colors hover:text-violet-300"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="my-5 h-px bg-white/5" />

              <FilterContent
                category={category}
                type={type}
                onCategoryChange={handleCategoryChange}
                onTypeChange={handleTypeChange}
              />
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <BriefcaseBusiness className="h-5 w-5 text-violet-400" />

                  <h2 className="text-lg font-semibold text-white">
                    {jobsLoading
                      ? "Finding opportunities"
                      : `${filteredJobs.length} ${
                          filteredJobs.length === 1
                            ? "opportunity"
                            : "opportunities"
                        }`}
                  </h2>
                </div>

                {!jobsLoading && activeFilterCount > 0 && (
                  <p className="mt-1 text-sm text-slate-500">
                    Showing results matching your filters
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.06] lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500 px-1.5 text-[10px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                  <ArrowDownUp className="h-4 w-4 text-slate-500" />

                  <select
                    value={sort}
                    onChange={handleSortChange}
                    className="bg-transparent text-sm font-medium text-slate-300 outline-none"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="bg-slate-900"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {/* Active filters */}
            {activeFilterCount > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {keyword && (
                  <FilterChip
                    label={`Keyword: ${keyword}`}
                    onRemove={() => updateParams({ keyword: "" })}
                  />
                )}

                {location && (
                  <FilterChip
                    label={`Location: ${location}`}
                    onRemove={() => updateParams({ location: "" })}
                  />
                )}

                {category && (
                  <FilterChip
                    label={category}
                    onRemove={() => updateParams({ category: "" })}
                  />
                )}

                {type && (
                  <FilterChip
                    label={
                      TYPE_OPTIONS.find((option) => option.value === type)
                        ?.label || type
                    }
                    onRemove={() => updateParams({ type: "" })}
                  />
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-1 text-xs font-medium text-slate-500 transition-colors hover:text-slate-300"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Loading */}
            {jobsLoading && (
              <div className="grid gap-4">
                {[1, 2, 3].map((item) => (
                  <JobSkeleton key={item} />
                ))}
              </div>
            )}

            {/* Error */}
            {!jobsLoading && jobsError && (
              <div className="glass rounded-2xl border border-rose-500/20 p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10">
                  <BriefcaseBusiness className="h-5 w-5 text-rose-400" />
                </div>

                <h3 className="mt-4 font-semibold text-white">
                  We couldn't load the jobs
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {jobsError}
                </p>

                <button
                  type="button"
                  onClick={() => fetchJobs()}
                  className="btn-secondary mt-5"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try again
                </button>
              </div>
            )}

            {/* Empty */}
            {!jobsLoading && !jobsError && filteredJobs.length === 0 && (
              <div className="glass rounded-2xl border border-white/5 px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
                  <Search className="h-6 w-6 text-violet-400" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  No opportunities found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Try adjusting your search terms or removing some filters to
                  see more opportunities.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn-secondary mt-6"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset search
                </button>
              </div>
            )}

            {/* Results */}
            {!jobsLoading && !jobsError && filteredJobs.length > 0 && (
              <div className="grid gap-4">
                {filteredJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile filters */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-white/10 bg-slate-950 p-6 shadow-2xl">
            <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-slate-700" />

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Filters</h2>

                <p className="mt-1 text-xs text-slate-500">
                  Refine available opportunities
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-xl border border-white/10 p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="my-6 h-px bg-white/5" />

            <FilterContent
              category={category}
              type={type}
              onCategoryChange={handleCategoryChange}
              onTypeChange={handleTypeChange}
            />

            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={clearFilters}
                className="btn-secondary"
              >
                Clear all
              </button>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="btn-primary"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterContent({ category, type, onCategoryChange, onTypeChange }) {
  return (
    <div className="space-y-7">
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Category
        </h3>

        <div className="space-y-1">
          {CATEGORY_OPTIONS.map((option) => {
            const active = category === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() => onCategoryChange(option)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  active
                    ? "bg-violet-500/10 text-violet-300"
                    : "text-slate-400 hover:bg-white/[0.03] hover:text-slate-200"
                }`}
              >
                <span>{option}</span>

                {active && (
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Job type
        </h3>

        <div className="space-y-1">
          {TYPE_OPTIONS.map((option) => {
            const active = type === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onTypeChange(option.value)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  active
                    ? "bg-cyan-500/10 text-cyan-300"
                    : "text-slate-400 hover:bg-white/[0.03] hover:text-slate-200"
                }`}
              >
                <span>{option.label}</span>

                {active && (
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300 transition-colors hover:bg-violet-500/15"
    >
      {label}
      <X className="h-3.5 w-3.5" />
    </button>
  );
}

function JobSkeleton() {
  return (
    <div className="glass animate-pulse rounded-2xl p-6">
      <div className="flex gap-4">
        <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/5" />

        <div className="min-w-0 flex-1">
          <div className="h-4 w-2/3 rounded bg-white/5" />
          <div className="mt-3 h-3 w-1/3 rounded bg-white/5" />
          <div className="mt-6 h-3 w-full rounded bg-white/5" />
          <div className="mt-2 h-3 w-4/5 rounded bg-white/5" />
        </div>
      </div>
    </div>
  );
}
