import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Mail, Lock, User, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const { register, authLoading } = useAppStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });
    if (!name || !email || !password) {
      setFeedback({ type: 'error', message: 'Please fill out all fields.' });
      return;
    }

    const res = await register({ name, email, password, role });
    if (res.success) {
      setFeedback({ type: 'success', message: res.message + ' Redirecting to login page...' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="min-h-[80vh] bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Create Your Account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-violet-400 hover:text-violet-300 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-850/40 glass py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-slate-800">
          
          {feedback.message && (
            <div className={`mb-6 p-4 rounded-xl border text-sm flex items-center gap-2.5 font-medium ${
              feedback.type === 'success' 
                ? 'bg-emerald-950/30 border-emerald-900/40 text-emerald-450' 
                : 'bg-rose-950/30 border-rose-900/40 text-rose-450'
            }`}>
              {feedback.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
              ) : (
                <ShieldAlert className="h-5 w-5 shrink-0 text-rose-500" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role Select Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">I want to register as:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('candidate')}
                  className={`py-2 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    role === 'candidate'
                      ? 'bg-violet-600/20 border-violet-500 text-violet-350'
                      : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800/40'
                  }`}
                >
                  Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`py-2 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    role === 'recruiter'
                      ? 'bg-violet-600/20 border-violet-500 text-violet-350'
                      : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800/40'
                  }`}
                >
                  Recruiter
                </button>
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <div className="mt-1 relative rounded-md flex items-center bg-slate-900/60 border border-slate-700 focus-within:border-violet-500 transition-colors">
                <User className="absolute left-3.5 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent border-none text-white focus:outline-none w-full pl-11 pr-4 py-2.5 text-sm placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Email input */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="mt-1 relative rounded-md flex items-center bg-slate-900/60 border border-slate-700 focus-within:border-violet-500 transition-colors">
                <Mail className="absolute left-3.5 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-none text-white focus:outline-none w-full pl-11 pr-4 py-2.5 text-sm placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="mt-1 relative rounded-md flex items-center bg-slate-900/60 border border-slate-700 focus-within:border-violet-500 transition-colors">
                <Lock className="absolute left-3.5 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent border-none text-white focus:outline-none w-full pl-11 pr-4 py-2.5 text-sm placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-200 disabled:opacity-50"
              >
                {authLoading ? 'Creating Account...' : 'Register'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
