import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Briefcase, Users, PlusCircle, Pencil, Trash2, ArrowLeft, Check, X, FileDown, ShieldAlert, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    applicationsLoading 
  } = useAppStore();

  const [activeJobId, setActiveJobId] = useState(null); // When viewing applicants for a job
  const [activeJobTitle, setActiveJobTitle] = useState('');
  
  // Job Form states (for Create & Edit)
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [position, setPosition] = useState(1);
  const [requirements, setRequirements] = useState('');
  const [description, setDescription] = useState('');
  const [formFeedback, setFormFeedback] = useState('');

  useEffect(() => {
    if (user?.role === 'recruiter') {
      fetchAdminJobs();
    }
  }, [user, fetchAdminJobs]);

  const openCreateModal = () => {
    setEditingJobId(null);
    setTitle('');
    setCompany('');
    setLocation('');
    setSalary('');
    setJobType('Full-time');
    setPosition(1);
    setRequirements('');
    setDescription('');
    setFormFeedback('');
    setShowFormModal(true);
  };

  const openEditModal = (job) => {
    setEditingJobId(job._id);
    setTitle(job.title);
    setCompany(job.company);
    setLocation(job.location);
    setSalary(job.salary);
    setJobType(job.jobType);
    setPosition(job.position);
    setRequirements(job.requirements?.join(', ') || '');
    setDescription(job.description);
    setFormFeedback('');
    setShowFormModal(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    setFormFeedback('');

    const jobData = {
      title,
      company,
      location,
      salary,
      jobType,
      position: Number(position),
      requirements,
      description
    };

    let res;
    if (editingJobId) {
      res = await updateJob(editingJobId, jobData);
    } else {
      res = await createJob(jobData);
    }

    if (res.success) {
      setShowFormModal(false);
    } else {
      setFormFeedback(res.message);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job post? This action cannot be undone.")) {
      await deleteJob(jobId);
    }
  };

  const handleViewApplicants = async (job) => {
    setActiveJobId(job._id);
    setActiveJobTitle(job.title);
    await fetchApplicants(job._id);
  };

  const handleStatusChange = async (applicationId, status) => {
    await updateApplicationStatus(applicationId, status, activeJobId);
  };

  if (!user || user.role !== 'recruiter') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 text-slate-100">
        <ShieldAlert className="h-14 w-14 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-slate-400 text-sm mb-6">Only registered recruiters can access the recruiter portal dashboard.</p>
        <Link to="/" className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-2.5 rounded-xl text-sm font-semibold">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header segment */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Recruiter Workspace</h1>
            <p className="text-slate-400 mt-1 text-sm">Post new hiring announcements and manage incoming applications.</p>
          </div>
          {!activeJobId && (
            <button
              type="button"
              onClick={openCreateModal}
              className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-violet-600/30"
            >
              <PlusCircle className="h-5 w-5" />
              Create Job Post
            </button>
          )}
        </div>

        {/* Viewing applicants interface */}
        {activeJobId ? (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => setActiveJobId(null)}
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to job post manager
            </button>

            <div className="bg-slate-850/30 glass border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white">
                  Applicants for <span className="text-violet-400 font-semibold">{activeJobTitle}</span>
                </h2>
              </div>

              {applicationsLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500"></div>
                </div>
              ) : applicants.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/40 text-xs font-semibold text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                        <th className="p-4 pl-6">Candidate</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Resume</th>
                        <th className="p-4">Key Skills</th>
                        <th className="p-4">Date Applied</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm">
                      {applicants.map((app) => (
                        <tr key={app._id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-4 pl-6 font-bold text-white">{app.applicant?.name}</td>
                          <td className="p-4 text-slate-350">{app.applicant?.email}</td>
                          <td className="p-4">
                            {app.applicant?.profile?.resume ? (
                              <a
                                href={`http://localhost:5000${app.applicant.profile.resume}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-violet-400 hover:text-violet-300 font-medium inline-flex items-center gap-1 hover:underline"
                              >
                                <FileDown className="h-4 w-4" /> Download
                              </a>
                            ) : (
                              <span className="text-slate-500">No Resume</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="text-xs truncate max-w-xs block text-slate-400">
                              {app.applicant?.profile?.skills?.join(', ') || 'N/A'}
                            </span>
                          </td>
                          <td className="p-4 text-slate-450">{new Date(app.createdAt).toLocaleDateString()}</td>
                          <td className="p-4 text-center">
                            <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              app.status === 'accepted'
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/30'
                                : app.status === 'rejected'
                                ? 'bg-rose-950/60 text-rose-400 border border-rose-900/30'
                                : 'bg-amber-950/60 text-amber-400 border border-amber-900/30'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            {app.status === 'pending' && (
                              <div className="flex justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(app._id, 'accepted')}
                                  className="p-1.5 bg-emerald-950/80 border border-emerald-900 text-emerald-400 rounded-lg hover:bg-emerald-605 hover:text-white transition-all shadow"
                                  title="Accept Candidate"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(app._id, 'rejected')}
                                  className="p-1.5 bg-rose-950/80 border border-rose-900 text-rose-400 rounded-lg hover:bg-rose-605 hover:text-white transition-all shadow"
                                  title="Reject Candidate"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-20">
                  <Users className="h-10 w-10 text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-450 font-medium">No candidates have applied for this job yet.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Main jobs listing */
          <div className="bg-slate-850/30 glass border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">Your Job Postings</h2>
            </div>

            {jobsLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
              </div>
            ) : adminJobs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/40 text-xs font-semibold text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                      <th className="p-4 pl-6">Job Title</th>
                      <th className="p-4">Company Name</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Positions</th>
                      <th className="p-4">Created Date</th>
                      <th className="p-4">Applicants</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {adminJobs.map((job) => (
                      <tr key={job._id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="p-4 pl-6 font-bold text-white">{job.title}</td>
                        <td className="p-4 text-slate-300">{job.company}</td>
                        <td className="p-4 text-slate-400">{job.location}</td>
                        <td className="p-4 text-slate-450">{job.position} Openings</td>
                        <td className="p-4 text-slate-450">{new Date(job.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => handleViewApplicants(job)}
                            className="bg-slate-800 hover:bg-violet-600 text-slate-300 hover:text-white px-3.5 py-1.5 rounded-lg border border-slate-700 hover:border-violet-600 text-xs font-semibold transition-all flex items-center gap-1.5"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View ({job.applications?.length || 0})
                          </button>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(job)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                              title="Edit Job"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteJob(job._id)}
                              className="p-1.5 bg-rose-950/20 hover:bg-rose-955 border border-rose-900/30 hover:border-rose-900 text-rose-400 rounded-lg transition-colors"
                              title="Delete Job"
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
            ) : (
              <div className="text-center py-24">
                <Briefcase className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 font-bold text-md mb-2">No Job Posts Found</p>
                <p className="text-slate-500 text-xs max-w-xs mx-auto mb-6">Create your first hiring post by clicking the button above.</p>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all"
                >
                  Create Job Post
                </button>
              </div>
            )}
          </div>
        )}

        {/* CREATE / EDIT JOB MODAL */}
        {showFormModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-955/70 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-slate-850 border border-slate-700 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <h3 className="text-lg font-bold text-white">
                  {editingJobId ? 'Edit Job Posting' : 'Post New Hiring'}
                </h3>
                <button type="button" onClick={() => setShowFormModal(false)} className="text-slate-400 hover:text-white rounded-lg p-1.5">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveJob} className="p-6 space-y-4">
                {formFeedback && (
                  <div className="p-3 bg-rose-955/30 border border-rose-900/40 text-rose-400 rounded-xl text-xs font-semibold">
                    {formFeedback}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Job Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Senior Frontend Developer"
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Company Name</label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Stripe, Google"
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Location</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. San Francisco (Remote)"
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Salary Range</label>
                    <input
                      type="text"
                      required
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="e.g. $90k - $120k"
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Job Type</label>
                    <select
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Positions Available</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Requirements (Comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="React, Node.js, Express, MongoDB..."
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    rows="4"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a comprehensive job description summary..."
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 placeholder:text-slate-500"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-350 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-violet-600/20"
                  >
                    {editingJobId ? 'Save Changes' : 'Publish Job'}
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
