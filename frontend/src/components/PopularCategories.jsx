import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Server, Figma, Cpu, Compass, Layers } from 'lucide-react';

export default function PopularCategories() {
  const navigate = useNavigate();

  const categories = [
    { name: 'Frontend Engineering', icon: Layout, query: 'Frontend', count: '120+ Jobs', color: 'text-violet-400 border-violet-500/20 bg-violet-950/20' },
    { name: 'Backend Engineering', icon: Server, query: 'Backend', count: '95+ Jobs', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20' },
    { name: 'UI/UX Design', icon: Figma, query: 'Design', count: '45+ Jobs', color: 'text-pink-400 border-pink-500/20 bg-pink-950/20' },
    { name: 'Product Management', icon: Compass, query: 'Manager', count: '30+ Jobs', color: 'text-amber-400 border-amber-500/20 bg-amber-950/20' },
    { name: 'Full Stack Development', icon: Layers, query: 'Full Stack', count: '80+ Jobs', color: 'text-blue-400 border-blue-500/20 bg-blue-950/20' },
    { name: 'Mobile Developer', icon: Cpu, query: 'Mobile', count: '15+ Jobs', color: 'text-indigo-400 border-indigo-500/20 bg-indigo-950/20' },
  ];

  return (
    <div className="bg-slate-900 py-20 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Popular Job Categories</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
            Explore diverse career pathways. Click on any category block to view currently hiring opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <button
              key={i}
              type="button"
              onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.query)}`)}
              className="bg-slate-850/40 glass border border-slate-850 p-6 rounded-2xl hover:border-violet-500/30 flex items-center gap-4 text-left transition-all duration-300 hover:shadow-xl hover:shadow-violet-950/15 group w-full"
            >
              <div className={`p-4 rounded-xl shrink-0 border ${cat.color}`}>
                <cat.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors leading-tight">{cat.name}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">{cat.count}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
