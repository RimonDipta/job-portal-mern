import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import PopularCategories from '../components/PopularCategories';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import JobCard from '../components/JobCard';
import { useAppStore } from '../store/useAppStore';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const { jobs, fetchJobs, jobsLoading } = useAppStore();

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const latestJobs = jobs.slice(0, 3); // Display top 3 latest jobs

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Stats Section */}
      <Stats />

      {/* 3. Popular Job Categories Section */}
      <PopularCategories />

      {/* 4. Latest Job Listings Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="h-6 w-6 text-violet-400" />
              Latest Job Openings
            </h2>
            <p className="text-slate-400 mt-2 text-sm md:text-base">
              Get hired fast. Explore these freshly posted job roles and start applying today.
            </p>
          </div>
          <Link
            to="/jobs"
            className="flex items-center gap-1.5 text-violet-400 hover:text-violet-300 font-semibold group hover:underline text-sm md:text-base shrink-0"
          >
            Explore All Available Jobs
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {jobsLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500"></div>
          </div>
        ) : latestJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-850/20 glass border border-slate-800 rounded-2xl">
            <p className="text-slate-400 font-medium">No job postings found. Check back later!</p>
          </div>
        )}
      </div>

      {/* 5. Why Choose Us Section */}
      <WhyChooseUs />

      {/* 6. Testimonials Section */}
      <Testimonials />
    </div>
  );
}
