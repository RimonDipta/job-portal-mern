import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, PlusCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Hero() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();
  const { user } = useAppStore();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword || location) {
      let query = '';
      if (keyword) query += `keyword=${encodeURIComponent(keyword)}&`;
      if (location) query += `location=${encodeURIComponent(location)}`;
      navigate(`/jobs?${query}`);
    } else {
      navigate('/jobs');
    }
  };

  const isRecruiter = user?.role === 'recruiter';

  return (
    <div className="relative overflow-hidden bg-slate-900 pt-20 pb-24 md:pt-28 md:pb-36 border-b border-slate-800">
      {/* Dynamic light glows */}
      <div className="absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl"></div>
      <div className="absolute bottom-10 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {isRecruiter ? (
          <>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Find the Best Talent <br />
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Build Your Dream Team
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-10 leading-relaxed">
              Publish hiring announcements, search candidate profiles, review resumes, and manage candidates in real-time.
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 px-8 rounded-2xl flex items-center gap-2 transition-all duration-200 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/40 text-lg animate-pulse"
              >
                <PlusCircle className="h-5 w-5" />
                Go to Recruiter Workspace
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Find Your Dream Job <br />
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Build Your Future
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-10 leading-relaxed">
              Discover thousands of job postings from leading corporations and innovative fast-growing startups. 
            </p>

            {/* Search Bar Form */}
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-slate-850/80 glass p-3 rounded-2xl flex flex-col md:flex-row gap-2 border border-slate-700 shadow-2xl">
              <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-slate-900/40 rounded-xl border border-slate-800">
                <Search className="h-5 w-5 text-violet-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="bg-transparent border-none text-white focus:outline-none w-full text-sm placeholder:text-slate-500"
                />
              </div>

              <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-slate-900/40 rounded-xl border border-slate-800">
                <MapPin className="h-5 w-5 text-violet-400 shrink-0" />
                <input
                  type="text"
                  placeholder="City, state, or remote..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent border-none text-white focus:outline-none w-full text-sm placeholder:text-slate-500"
                />
              </div>

              <button
                type="submit"
                className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/40"
              >
                Search Jobs
              </button>
            </form>

            <div className="mt-8 flex flex-wrap justify-center gap-2.5 text-sm text-slate-400">
              <span>Popular:</span>
              <button type="button" onClick={() => navigate('/jobs?keyword=React')} className="text-violet-400 hover:text-violet-300 font-medium">React.js</button>
              <span>&bull;</span>
              <button type="button" onClick={() => navigate('/jobs?keyword=Node')} className="text-violet-400 hover:text-violet-300 font-medium">Node.js</button>
              <span>&bull;</span>
              <button type="button" onClick={() => navigate('/jobs?keyword=Design')} className="text-violet-400 hover:text-violet-300 font-medium">UI/UX Design</button>
              <span>&bull;</span>
              <button type="button" onClick={() => navigate('/jobs?keyword=Manager')} className="text-violet-400 hover:text-violet-300 font-medium">Product Manager</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
