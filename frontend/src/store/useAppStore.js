import { create } from "zustand";
import api, { setUnauthorizedHandler } from "../lib/api";

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.warn("Unable to restore saved user session:", error);

    localStorage.removeItem("user");

    return null;
  }
};

export const useAppStore = create((set, get) => ({
  // =========================================================
  // Authentication State
  // =========================================================

  user: getStoredUser(),
  token: localStorage.getItem("token") || null,
  authLoading: false,
  authError: null,

  // =========================================================
  // Jobs State
  // =========================================================

  jobs: [],
  selectedJob: null,
  adminJobs: [],
  jobsLoading: false,
  jobsError: null,

  // =========================================================
  // Applications State
  // =========================================================

  appliedJobs: [],
  applicants: [],
  applicationStatusByJobId: {},
  applicationsLoading: false,
  applicationsError: null,

  // =========================================================
  // Authentication Actions
  // =========================================================

  register: async (userData) => {
    set({
      authLoading: true,
      authError: null,
    });

    try {
      const response = await api.post("/user/register", userData);

      set({
        authLoading: false,
        authError: null,
      });

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed.";

      set({
        authLoading: false,
        authError: msg,
      });

      return {
        success: false,
        message: msg,
      };
    }
  },

  login: async (userData) => {
    set({
      authLoading: true,
      authError: null,
    });

    try {
      const response = await api.post("/user/login", userData);

      const { user, token, message } = response.data;

      if (!user || !token) {
        throw new Error("Invalid authentication response.");
      }

      localStorage.setItem("user", JSON.stringify(user));

      localStorage.setItem("token", token);

      set({
        user,
        token,
        authLoading: false,
        authError: null,

        appliedJobs: [],
        applicants: [],
        applicationStatusByJobId: {},

        applicationsError: null,
      });

      return {
        success: true,
        message,
        user,
      };
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || "Login failed.";

      set({
        authLoading: false,
        authError: msg,
      });

      return {
        success: false,
        message: msg,
      };
    }
  },

  logout: async () => {
    set({
      authLoading: true,
      authError: null,
    });

    try {
      await api.get("/user/logout");
    } catch (error) {
      console.warn("Logout request skipped on server:", error.message);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,

      adminJobs: [],
      appliedJobs: [],
      applicants: [],
      applicationStatusByJobId: {},

      selectedJob: null,

      applicationsError: null,
      authError: null,

      authLoading: false,
    });

    return {
      success: true,
      message: "Logged out successfully.",
    };
  },

  updateProfile: async (formData) => {
    set({
      authLoading: true,
      authError: null,
    });

    try {
      const response = await api.put("/user/profile/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { user, message } = response.data;

      if (!user) {
        throw new Error("Invalid profile response.");
      }

      localStorage.setItem("user", JSON.stringify(user));

      set({
        user,
        authLoading: false,
        authError: null,
      });

      return {
        success: true,
        message,
      };
    } catch (error) {
      const msg = error.response?.data?.message || "Profile update failed.";

      set({
        authLoading: false,
        authError: msg,
      });

      return {
        success: false,
        message: msg,
      };
    }
  },

  // =========================================================
  // Job Actions
  // =========================================================

  fetchJobs: async (filters = {}) => {
    set({
      jobsLoading: true,
      jobsError: null,
    });

    try {
      const { keyword, category, location } = filters;

      let url = "/job/get";

      const params = [];

      if (keyword) {
        params.push(`keyword=${encodeURIComponent(keyword)}`);
      }

      if (category) {
        params.push(`category=${encodeURIComponent(category)}`);
      }

      if (location) {
        params.push(`location=${encodeURIComponent(location)}`);
      }

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const response = await api.get(url);

      const jobs = response.data.jobs || [];

      set({
        jobs,
        jobsLoading: false,
        jobsError: null,
      });

      return jobs;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to fetch jobs.";

      set({
        jobsLoading: false,
        jobsError: msg,
      });

      return [];
    }
  },

  fetchJobById: async (jobId) => {
    set({
      jobsLoading: true,
      jobsError: null,
      selectedJob: null,
    });

    try {
      const response = await api.get(`/job/get/${jobId}`);

      const job = response.data.job;

      if (!job) {
        throw new Error("Invalid job response.");
      }

      set({
        selectedJob: job,
        jobsLoading: false,
        jobsError: null,
      });

      return job;
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to fetch job details.";

      set({
        jobsLoading: false,
        jobsError: msg,
        selectedJob: null,
      });

      return null;
    }
  },

  fetchAdminJobs: async () => {
    set({
      jobsLoading: true,
      jobsError: null,
    });

    try {
      const response = await api.get("/job/getadminjobs");

      const jobs = response.data.jobs || [];

      set({
        adminJobs: jobs,
        jobsLoading: false,
        jobsError: null,
      });

      return jobs;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to fetch your jobs.";

      set({
        jobsLoading: false,
        jobsError: msg,
      });

      return [];
    }
  },

  createJob: async (jobData) => {
    set({
      jobsLoading: true,
      jobsError: null,
    });

    try {
      const response = await api.post("/job/post", jobData);

      set({
        jobsLoading: false,
        jobsError: null,
      });

      await get().fetchAdminJobs();

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to create job.";

      set({
        jobsLoading: false,
        jobsError: msg,
      });

      return {
        success: false,
        message: msg,
      };
    }
  },

  updateJob: async (jobId, jobData) => {
    set({
      jobsLoading: true,
      jobsError: null,
    });

    try {
      const response = await api.put(`/job/update/${jobId}`, jobData);

      set({
        jobsLoading: false,
        jobsError: null,
      });

      await get().fetchAdminJobs();

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update job.";

      set({
        jobsLoading: false,
        jobsError: msg,
      });

      return {
        success: false,
        message: msg,
      };
    }
  },

  deleteJob: async (jobId) => {
    set({
      jobsLoading: true,
      jobsError: null,
    });

    try {
      const response = await api.delete(`/job/delete/${jobId}`);

      set({
        jobsLoading: false,
        jobsError: null,
      });

      await get().fetchAdminJobs();

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to delete job.";

      set({
        jobsLoading: false,
        jobsError: msg,
      });

      return {
        success: false,
        message: msg,
      };
    }
  },

  // =========================================================
  // Application Actions
  // =========================================================

  applyForJob: async (jobId) => {
    set({
      applicationsLoading: true,
      applicationsError: null,
    });

    try {
      const response = await api.post(`/application/apply/${jobId}`);

      set((state) => ({
        applicationsLoading: false,
        applicationsError: null,

        applicationStatusByJobId: {
          ...state.applicationStatusByJobId,
          [jobId]: "pending",
        },
      }));

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to apply for job.";

      set({
        applicationsLoading: false,
        applicationsError: msg,
      });

      return {
        success: false,
        message: msg,
      };
    }
  },

  fetchAppliedJobs: async () => {
    set({
      applicationsLoading: true,
      applicationsError: null,
    });

    try {
      const response = await api.get("/application/get");

      const applications = response.data.applications || [];

      const statusMap = applications.reduce((result, application) => {
        const jobId = application.job?._id || application.job;

        if (jobId) {
          result[jobId.toString()] = application.status || "pending";
        }

        return result;
      }, {});

      set({
        appliedJobs: applications,
        applicationStatusByJobId: statusMap,
        applicationsLoading: false,
        applicationsError: null,
      });

      return {
        success: true,
        applications,
      };
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to fetch your applications.";

      set({
        applicationsLoading: false,
        applicationsError: msg,
      });

      return {
        success: false,
        applications: [],
        message: msg,
      };
    }
  },

  fetchApplicationStatus: async (jobId) => {
    const currentUser = get().user;

    if (!currentUser || currentUser.role !== "candidate") {
      return {
        success: false,
        status: null,
        message: "Only candidates can view application status.",
      };
    }

    set({
      applicationsLoading: true,
      applicationsError: null,
    });

    try {
      const response = await api.get("/application/get");

      const applications = response.data.applications || [];

      const application = applications.find((item) => {
        const applicationJobId = item.job?._id || item.job;

        return applicationJobId?.toString() === jobId?.toString();
      });

      const status = application?.status || null;

      set((state) => ({
        applicationsLoading: false,
        applicationsError: null,

        applicationStatusByJobId: {
          ...state.applicationStatusByJobId,
          [jobId]: status,
        },
      }));

      return {
        success: true,
        status,
      };
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to fetch application status.";

      set({
        applicationsLoading: false,
        applicationsError: msg,
      });

      return {
        success: false,
        status: null,
        message: msg,
      };
    }
  },

  fetchApplicants: async (jobId) => {
    set({
      applicationsLoading: true,
      applicationsError: null,
      applicants: [],
    });

    try {
      const response = await api.get(`/application/${jobId}/applicants`);

      const job = response.data.job;

      if (!job) {
        throw new Error("Invalid applicants response.");
      }

      const applicants = job.applications || [];

      set({
        applicants,
        applicationsLoading: false,
        applicationsError: null,
      });

      return {
        success: true,
        job,
      };
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to fetch applicants.";

      set({
        applicationsLoading: false,
        applicationsError: msg,
        applicants: [],
      });

      return {
        success: false,
        job: null,
        message: msg,
      };
    }
  },

  updateApplicationStatus: async (applicationId, status, jobId) => {
    set({
      applicationsLoading: true,
      applicationsError: null,
    });

    try {
      const response = await api.put(
        `/application/status/${applicationId}/update`,
        { status },
      );

      if (jobId) {
        await get().fetchApplicants(jobId);
      } else {
        set({
          applicationsLoading: false,
          applicationsError: null,
        });
      }

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to update applicant status.";

      set({
        applicationsLoading: false,
        applicationsError: msg,
      });

      return {
        success: false,
        message: msg,
      };
    }
  },
}));

// =========================================================
// Global Authentication Failure Handling
// =========================================================

setUnauthorizedHandler(() => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  useAppStore.setState({
    user: null,
    token: null,

    authLoading: false,
    authError: "Your session has expired. Please log in again.",

    adminJobs: [],
    appliedJobs: [],
    applicants: [],
    applicationStatusByJobId: {},

    selectedJob: null,

    applicationsLoading: false,
    applicationsError: null,

    jobsLoading: false,
  });
});
