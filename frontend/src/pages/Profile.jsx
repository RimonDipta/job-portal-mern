import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { FileText, Code2, Mail, Info, FileUp, Edit2, X, Check, Clock, AlertTriangle, Briefcase } from 'lucide-react';

export default function Profile() {
  const { user, appliedJobs, fetchAppliedJobs, updateProfile, authLoading, adminJobs, fetchAdminJobs } = useAppStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'info';

  // Profile Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [skills, setSkills] = useState(user?.profile?.skills?.join(', ') || '');
  const [resumeFile, setResumeFile] = useState(null);
  const [modalFeedback, setModalFeedback] = useState('');

  useEffect(() => {
    if (user?.role === 'candidate') {
      fetchAppliedJobs();
    } else if (user?.role === 'recruiter') {
      fetchAdminJobs();
    }
  }, [user, fetchAppliedJobs, fetchAdminJobs]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setModalFeedback('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('bio', bio);
    formData.append('skills', skills);
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    const res = await updateProfile(formData);
    if (res.success) {
      setShowEditModal(false);
      setResumeFile(null);
    } else {
      setModalFeedback(res.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/65 text-emerald-400 border border-emerald-900/30">
            <Check className="h-3.5 w-3.5" /> Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-950/65 text-rose-400 border border-rose-900/30">
            <X className="h-3.5 w-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-950/65 text-amber-400 border border-amber-900/30">
            <Clock className="h-3.5 w-3.5" /> Pending
          </span>
        );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 text-slate-100">
        <AlertTriangle className="h-14 w-14 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-slate-400 text-sm mb-6">Please log in to view and manage your profile details.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Profile Card Header */}
        <div className="bg-slate-850/40 glass border border-slate-800 p-8 rounded-3xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center text-violet-400 font-extrabold text-2xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                {user.name}
                <button type="button" onClick={() => setShowEditModal(true)} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                  <Edit2 className="h-4 w-4" />
                </button>
              </h1>
              <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                <Mail className="h-4 w-4 text-slate-500" />
                {user.email}
              </p>
              <span className="inline-block text-xs uppercase bg-violet-955 text-violet-300 border border-violet-900/30 px-2.5 py-0.5 rounded-full mt-3 font-semibold tracking-wider">
                {user.role} Account
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSearchParams({ tab: 'info' })}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'info'
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Overview
            </button>
            {user.role === 'candidate' && (
              <button
                type="button"
                onClick={() => setSearchParams({ tab: 'applied' })}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'applied'
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                Applied Jobs ({appliedJobs.length})
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: User details overview */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Bio Block */}
              <div className="bg-slate-850/30 glass border border-slate-800 p-8 rounded-3xl">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <Info className="h-5 w-5 text-violet-400" />
                  Professional Summary
                </h2>
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                  {user.profile?.bio || "No professional summary added yet. Click edit to write a brief bio about your developer history."}
                </p>
              </div>

              {/* Skills block */}
              <div className="bg-slate-850/30 glass border border-slate-800 p-8 rounded-3xl">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <Code2 className="h-5 w-5 text-violet-400" />
                  Key Skills & Technologies
                </h2>
                {user.profile?.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.profile.skills.map((skill, idx) => (
                      <span key={idx} className="bg-slate-900 border border-slate-800 text-slate-300 px-3.5 py-1.5 rounded-xl text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No skills added yet. Add comma-separated tech stack elements.</p>
                )}
              </div>
            </div>

            {/* Right block: Resume download or Recruiter Stats */}
            <div className="space-y-6">
              {user.role === 'candidate' ? (
                <div className="bg-slate-850/30 glass border border-slate-800 p-8 rounded-3xl text-center">
                  <FileText className="h-12 w-12 text-violet-400 mx-auto mb-4" />
                  <h3 className="text-md font-bold text-white mb-2">Resume File</h3>
                  {user.profile?.resume ? (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-400 font-mono truncate">{user.profile.resumeOriginalName || 'Uploaded Resume'}</p>
                      <a
                        href={`http://localhost:5000${user.profile.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2 px-5 rounded-xl text-sm transition-all"
                      >
                        Download Resume File
                      </a>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">No PDF/DOC file uploaded. Add your CV to improve recruiter matches.</p>
                      <button
                        type="button"
                        onClick={() => setShowEditModal(true)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 px-5 rounded-xl text-sm transition-all border border-slate-700 w-full"
                      >
                        Upload File
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-850/30 glass border border-slate-800 p-8 rounded-3xl text-center">
                  <Briefcase className="h-12 w-12 text-violet-400 mx-auto mb-4" />
                  <h3 className="text-md font-bold text-white mb-2">Recruiting Stats</h3>
                  <div className="space-y-4 mt-4">
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                      <span className="text-2xl font-extrabold text-white block">{adminJobs.length}</span>
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Jobs Posted</span>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-all text-center font-sans"
                    >
                      Go to Workspace
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Candidate applications list */}
        {activeTab === 'applied' && user.role === 'candidate' && (
          <div className="bg-slate-850/30 glass border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">Applied Job Log</h2>
            </div>
            
            {appliedJobs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/40 text-xs font-semibold text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                      <th className="p-4 pl-6">Job Title</th>
                      <th className="p-4">Company Name</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Application Date</th>
                      <th className="p-4 pr-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {appliedJobs.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4 pl-6 font-bold text-white">{app.job?.title || 'Unknown Role'}</td>
                        <td className="p-4 text-slate-300">{app.job?.company || 'Unknown Company'}</td>
                        <td className="p-4 text-slate-400">{app.job?.location || 'Unknown Location'}</td>
                        <td className="p-4 text-slate-450">{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 pr-6 text-right">{getStatusBadge(app.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-20">
                <FileText className="h-10 w-10 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">You haven't applied for any jobs yet.</p>
                <Link to="/jobs" className="inline-block mt-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2 px-5 rounded-xl text-sm transition-all">
                  Find Jobs Now
                </Link>
              </div>
            )}
          </div>
        )}

        {/* PROFILE UPDATE MODAL */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-slate-850 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <h3 className="text-lg font-bold text-white">Update Profile Information</h3>
                <button type="button" onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white rounded-lg p-1.5">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-5">
                {modalFeedback && (
                  <div className="p-3 bg-rose-950/30 border border-rose-900/40 text-rose-400 rounded-xl text-xs font-semibold">
                    {modalFeedback}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Short Bio Summary</label>
                  <textarea
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 placeholder:text-slate-605"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Skills (Comma-separated)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, Node.js, Express, Figma..."
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 placeholder:text-slate-605"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Resume File (PDF, DOC, DOCX)</label>
                  <div className="mt-1 relative border border-dashed border-slate-700 hover:border-violet-500 rounded-xl p-6 bg-slate-900/50 flex flex-col items-center justify-center transition-colors">
                    <FileUp className="h-8 w-8 text-slate-500 mb-2" />
                    <span className="text-xs text-slate-400 text-center font-medium">
                      {resumeFile ? resumeFile.name : 'Drag and drop or click to browse'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-350 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-violet-600/20 disabled:opacity-50"
                  >
                    {authLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
