import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BriefcaseBusiness,
  ChevronDown,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import JobCard from "../components/JobCard";

const categories = [
  { name: "All categories", value: "" },
  { name: "Frontend", value: "Frontend" },
  { name: "Backend", value: "Backend" },
  { name: "Design / UI-UX", value: "Design" },
  { name: "Product Management", value: "Manager" },
  { name: "Full Stack", value: "Full Stack" },
  { name: "Mobile", value: "Mobile" },
];

function JobCardSkeleton() {
  return (
    <div className="glass animate-pulse rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="h-11 w-11 rounded-xl bg-white/[0.06]" />
        <div className="h-6 w-20 rounded-full bg-white/[0.05]" />
      </div>

      <div className="mt-6 h-5 w-2/3 rounded bg-white/[0.06]" />
      <div className="mt-3 h-3 w-1/3 rounded bg-white/[0.04]" />

      <div className="mt-5 space-y-2">
        <div className="h-3 w-full rounded bg-white/[0.04]" />
        <div className="h-3 w-5/6 rounded bg-white/[0.04]" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="h-8 rounded-xl bg-white/[0.04]" />
        <div className="h-8 rounded-xl bg-white/[0.04]" />
      </div>
    </div>
  );
}

function FilterChip({ children, onRemove }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/15 bg-violet-400/[0.07] px-3 py-1.5 text-xs font-medium text-violet-200 transition-colors hover:bg-violet-400/[0.12]"
    >
      {children}
      <X className="h-3 w-3" />
    </button>
  );
}

export default function Jobs() {
  const { jobs, fetchJobs, jobsLoading, jobsError } = useAppStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("keyword") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "",
  );
  const [locationTerm, setLocationTerm] = useState(
    searchParams.get("location") || "",
  );
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setSearchTerm(searchParams.get("keyword") || "");
    setSelectedCategory(searchParams.get("category") || "");
    setLocationTerm(searchParams.get("location") || "");
  }, [searchParams]);

  useEffect(() => {
    fetchJobs({
      keyword: searchParams.get("keyword") || "",
      category: searchParams.get("category") || "",
      location: searchParams.get("location") || "",
    });
  }, [searchParams, fetchJobs]);

  const activeFilters = useMemo(() => {
    const filters = [];

    if (searchParams.get("keyword")) {
      filters.push({
        type: "keyword",
        label: `Search: ${searchParams.get("keyword")}`,
      });
    }

    if (searchParams.get("category")) {
      const category = categories.find(
        (item) => item.value === searchParams.get("category"),
      );

      filters.push({
        type: "category",
        label: category?.name || searchParams.get("category"),
      });
    }

    if (searchParams.get("location")) {
      filters.push({
        type: "location",
        label: `Location: ${searchParams.get("location")}`,
      });
    }

    return filters;
  }, [searchParams]);

  const handleApplyFilters = (event) => {
    event.preventDefault();

    const params = {};

    if (searchTerm.trim()) {
      params.keyword = searchTerm.trim();
    }

    if (selectedCategory) {
      params.category = selectedCategory;
    }

    if (locationTerm.trim()) {
      params.location = locationTerm.trim();
    }

    setSearchParams(params);
    setFiltersOpen(false);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setLocationTerm("");
    setSearchParams({});
  };

  const handleRemoveFilter = (type) => {
    const params = new URLSearchParams(searchParams);

    if (type === "keyword") {
      params.delete("keyword");
      setSearchTerm("");
    }

    if (type === "category") {
      params.delete("category");
      setSelectedCategory("");
    }

    if (type === "location") {
      params.delete("location");
      setLocationTerm("");
    }

    setSearchParams(params);
  };

  const handleRetry = () => {
    fetchJobs({
      keyword: searchParams.get("keyword") || "",
      category: searchParams.get("category") || "",
      location: searchParams.get("location") || "",
    });
  };

  const hasFilters = activeFilters.length > 0;

  return (
    <div className="relative overflow-hidden">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-violet-600/[0.08] blur-[140px]" />
        <div className="absolute right-0 top-[650px] h-[320px] w-[320px] rounded-full bg-cyan-400/[0.04] blur-[120px]" />
      </div>

      {/* Page header */}
      <section className="section pb-8">
        <div className="site-container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="section-eyebrow mx-auto w-fit">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              Job marketplace
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Find work that{" "}
              <span className="gradient-text">fits your direction.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Search available opportunities by role, category, and location.
              Open any listing to review the full requirements and application
              details.
            </p>
          </div>

          {/* Search panel */}
          <div className="mx-auto mt-10 max-w-5xl">
            <form
              onSubmit={handleApplyFilters}
              className="glass rounded-3xl p-3 shadow-2xl shadow-violet-950/10"
            >
              <div className="grid gap-2 lg:grid-cols-[1.3fr_1fr_auto]">
                <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#091525]/80 px-4 py-3.5 transition-colors focus-within:border-violet-400/30">
                  <Search className="h-4.5 w-4.5 shrink-0 text-violet-400" />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Job title, keyword, or company"
                    className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  />
                </div>

                <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#091525]/80 px-4 py-3.5 transition-colors focus-within:border-violet-400/30">
                  <MapPin className="h-4.5 w-4.5 shrink-0 text-cyan-400" />

                  <input
                    type="text"
                    value={locationTerm}
                    onChange={(event) => setLocationTerm(event.target.value)}
                    placeholder="Location or remote"
                    className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary inline-flex min-h-[50px] items-center justify-center gap-2 rounded-2xl px-6"
                >
                  <Search className="h-4 w-4" />
                  Search jobs
                </button>
              </div>

              {/* Category selector */}
              <div className="mt-2 flex flex-col gap-2 border-t border-white/[0.05] pt-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 px-2">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-slate-600" />
                  <span className="text-xs font-medium text-slate-600">
                    Category
                  </span>
                </div>

                <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {categories.map((category) => (
                    <button
                      key={category.value || "all"}
                      type="button"
                      onClick={() => setSelectedCategory(category.value)}
                      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                        selectedCategory === category.value
                          ? "border-violet-400/25 bg-violet-400/10 text-violet-200"
                          : "border-white/[0.06] bg-white/[0.02] text-slate-500 hover:border-white/[0.1] hover:text-slate-300"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="section pt-8">
        <div className="site-container">
          {/* Results toolbar */}
          <div className="flex flex-col gap-4 border-b border-white/[0.05] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-white">
                  Available opportunities
                </h2>

                {!jobsLoading && (
                  <span className="rounded-full border border-white/[0.06] bg-white/[0.025] px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                    {jobs.length}
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                {hasFilters
                  ? "Showing results matching your current search."
                  : "Browse the latest opportunities available on the platform."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFiltersOpen((current) => !current)}
              className="btn-secondary inline-flex items-center justify-center gap-2 sm:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  filtersOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Mobile filter panel */}
          {filtersOpen && (
            <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:hidden">
              <form onSubmit={handleApplyFilters} className="space-y-4">
                <div>
                  <label
                    htmlFor="mobile-category"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Category
                  </label>

                  <select
                    id="mobile-category"
                    value={selectedCategory}
                    onChange={(event) =>
                      setSelectedCategory(event.target.value)
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#091525] px-3 py-3 text-sm text-slate-300 outline-none focus:border-violet-400/30"
                  >
                    {categories.map((category) => (
                      <option
                        key={category.value || "all"}
                        value={category.value}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn-primary w-full">
                  Apply filters
                </button>
              </form>
            </div>
          )}

          {/* Active filters */}
          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2 py-5">
              <span className="mr-1 text-xs font-medium text-slate-600">
                Active:
              </span>

              {activeFilters.map((filter) => (
                <FilterChip
                  key={filter.type}
                  onRemove={() => handleRemoveFilter(filter.type)}
                >
                  {filter.label}
                </FilterChip>
              ))}

              <button
                type="button"
                onClick={handleClearFilters}
                className="ml-1 inline-flex items-center gap-1.5 px-2 text-xs font-medium text-slate-600 transition-colors hover:text-slate-300"
              >
                <RotateCcw className="h-3 w-3" />
                Clear all
              </button>
            </div>
          )}

          {/* Error */}
          {jobsError && !jobsLoading && (
            <div className="mt-5 rounded-2xl border border-rose-400/15 bg-rose-400/[0.05] p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-rose-200">
                    We couldn&apos;t load the job listings.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-rose-300/60">
                    {jobsError}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRetry}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-rose-400/15 bg-rose-400/[0.06] px-4 py-2.5 text-xs font-semibold text-rose-200 transition-colors hover:bg-rose-400/[0.1]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {jobsLoading && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
            </div>
          )}

          {/* Results */}
          {!jobsLoading && !jobsError && jobs.length > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!jobsLoading && !jobsError && jobs.length === 0 && (
            <div className="mt-6 overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02]">
              <div className="relative px-6 py-16 text-center sm:px-10 sm:py-20">
                <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-violet-500/[0.07] blur-3xl" />

                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.025] text-violet-300">
                  <Sparkles className="h-6 w-6" />
                </div>

                <h3 className="relative mt-6 text-xl font-semibold text-white">
                  No opportunities found
                </h3>

                <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  Try a broader keyword, another location, or remove one of your
                  active filters.
                </p>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="btn-secondary relative mt-6 inline-flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
