import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import JobCard from '../components/JobCard';
import { Search, MapPin, SlidersHorizontal, Trash2 } from 'lucide-react';

export default function Jobs() {
  const { jobs, fetchJobs, jobsLoading } = useAppStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Local filter states syncing with URL search parameters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [locationTerm, setLocationTerm] = useState(searchParams.get('location') || '');

  const categories = [
    { name: 'All Categories', value: '' },
    { name: 'Frontend', value: 'Frontend' },
    { name: 'Backend', value: 'Backend' },
    { name: 'Design / UI-UX', value: 'Design' },
    { name: 'Product Management', value: 'Manager' },
    { name: 'Full Stack', value: 'Full Stack' },
    { name: 'Mobile Dev', value: 'Mobile' },
  ];

  // Refetch when search parameters change
  useEffect(() => {
    const filters = {
      keyword: searchParams.get('keyword') || '',
      category: searchParams.get('category') || '',
    };
    fetchJobs(filters);
  }, [searchParams, fetchJobs]);

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    const params = {};
    if (searchTerm) params.keyword = searchTerm;
    if (selectedCategory) params.category = selectedCategory;
    if (locationTerm) params.location = locationTerm;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setLocationTerm('');
    setSearchParams({});
  };

  // Local filter for location (since database fetch has keyword/category endpoints, we can filter location locally or pass it)
  const filteredJobs = jobs.filter(job => {
    if (!locationTerm) return true;
    return job.location.toLowerCase().includes(locationTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar Filter Section */}
          <div className="w-full lg:w-80 bg-slate-850/40 glass p-6 rounded-2xl border border-slate-800 shrink-0 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="h-4.5 w-4.5 text-violet-400" />
                Filters
              </h2>
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-rose-450 hover:text-rose-350 hover:underline flex items-center gap-1 font-medium transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear All
              </button>
            </div>

            <form onSubmit={handleApplyFilters} className="space-y-6">
              {/* Search input */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Search Job Title</label>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl focus-within:border-violet-500 transition-colors">
                  <Search className="h-4 w-4 text-slate-555 shrink-0" />
                  <input
                    type="text"
                    placeholder="E.g. Engineer, Developer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none text-white focus:outline-none w-full text-sm placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Location Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Location</label>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl focus-within:border-violet-500 transition-colors">
                  <MapPin className="h-4 w-4 text-slate-555 shrink-0" />
                  <input
                    type="text"
                    placeholder="E.g. remote, San Francisco..."
                    value={locationTerm}
                    onChange={(e) => setLocationTerm(e.target.value)}
                    className="bg-transparent border-none text-white focus:outline-none w-full text-sm placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Category Radios */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Job Category</label>
                <div className="space-y-2">
                  {categories.map((cat, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer group text-slate-350 hover:text-white transition-colors">
                      <input
                        type="radio"
                        name="category"
                        value={cat.value}
                        checked={selectedCategory === cat.value}
                        onChange={() => setSelectedCategory(cat.value)}
                        className="h-4 w-4 text-violet-600 border-slate-700 bg-slate-900 focus:ring-violet-500 focus:ring-offset-slate-900 rounded"
                      />
                      <span className="text-sm font-medium">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2.5 rounded-xl transition-all duration-200"
              >
                Apply Filters
              </button>
            </form>
          </div>

          {/* Right Main Grid Section */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-400 font-medium">
                Showing <span className="text-violet-400 font-semibold">{filteredJobs.length}</span> available jobs
              </p>
            </div>

            {jobsLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-slate-850/20 glass border border-slate-800 rounded-3xl">
                <p className="text-slate-400 font-semibold text-lg mb-2">No Jobs Found</p>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">Try refining your search terms or clearing the current filters.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
