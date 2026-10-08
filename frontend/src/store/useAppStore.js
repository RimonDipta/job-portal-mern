import { create } from "zustand";
import axios from "axios";

// Define the root API endpoint for backend communication
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

// Retrieve saved authentication session state if it exists
const savedToken = localStorage.getItem("token");

if (savedToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
}

export const useAppStore = create((set, get) => ({
  // Authentication State
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: savedToken || null,
  authLoading: false,
  authError: null,

  // Jobs State
  jobs: [],
  selectedJob: null,
  adminJobs: [],
  jobsLoading: false,
  jobsError: null,

  // Applications State
  appliedJobs: [],
  applicants: [],
  applicationStatusByJobId: {},
  applicationsLoading: false,

  // Actions - Authentication
  register: async (userData) => {
    set({ authLoading: true, authError: null });

    try {
      const response = await axios.post("/user/register", userData);

      set({ authLoading: false });

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
      const response = await axios.post("/user/login", userData);
      const { user, token, message } = response.data;

      if (!user || !token) {
        throw new Error("Invalid authentication response.");
      }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      set({
        user,
        token,
        authLoading: false,
        applicationStatusByJobId: {},
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
    set({ authLoading: true });

    try {
      await axios.get("/user/logout");
    } catch (error) {
      console.warn("Logout request skipped on server:", error.message);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    delete axios.defaults.headers.common["Authorization"];

    set({
      user: null,
      token: null,
      adminJobs: [],
      appliedJobs: [],
      applicants: [],
      applicationStatusByJobId: {},
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
      const response = await axios.put("/user/profile/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { user, message } = response.data;

      localStorage.setItem("user", JSON.stringify(user));

      set({
        user,
        authLoading: false,
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

  // Actions - Jobs
  fetchJobs: async (filters = {}) => {
    set({
      jobsLoading: true,
      jobsError: null,
    });

    try {
      const { keyword, category } = filters;

      let url = "/job/get";
      const params = [];

      if (keyword) {
        params.push(`keyword=${encodeURIComponent(keyword)}`);
      }

      if (category) {
        params.push(`category=${encodeURIComponent(category)}`);
      }

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const response = await axios.get(url);

      set({
        jobs: response.data.jobs,
        jobsLoading: false,
      });
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to fetch jobs.";

      set({
        jobsLoading: false,
        jobsError: msg,
      });
    }
  },

  fetchJobById: async (jobId) => {
    set({
      jobsLoading: true,
      jobsError: null,
      selectedJob: null,
    });

    try {
      const response = await axios.get(`/job/get/${jobId}`);

      set({
        selectedJob: response.data.job,
        jobsLoading: false,
      });

      return response.data.job;
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to fetch job details.";

      set({
        jobsLoading: false,
        jobsError: msg,
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
      const response = await axios.get("/job/getadminjobs");

      set({
        adminJobs: response.data.jobs,
        jobsLoading: false,
      });
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to fetch your jobs.";

      set({
        jobsLoading: false,
        jobsError: msg,
      });
    }
  },

  createJob: async (jobData) => {
    set({ jobsLoading: true });

    try {
      const response = await axios.post("/job/post", jobData);

      set({ jobsLoading: false });

      await get().fetchAdminJobs();

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to create job.";

      set({ jobsLoading: false });

      return {
        success: false,
        message: msg,
      };
    }
  },

  updateJob: async (jobId, jobData) => {
    set({ jobsLoading: true });

    try {
      const response = await axios.put(`/job/update/${jobId}`, jobData);

      set({ jobsLoading: false });

      await get().fetchAdminJobs();

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update job.";

      set({ jobsLoading: false });

      return {
        success: false,
        message: msg,
      };
    }
  },

  deleteJob: async (jobId) => {
    set({ jobsLoading: true });

    try {
      const response = await axios.delete(`/job/delete/${jobId}`);

      set({ jobsLoading: false });

      await get().fetchAdminJobs();

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to delete job.";

      set({ jobsLoading: false });

      return {
        success: false,
        message: msg,
      };
    }
  },

  // Actions - Applications

  applyForJob: async (jobId) => {
    set({ applicationsLoading: true });

    try {
      const response = await axios.post(`/application/apply/${jobId}`);

      set((state) => ({
        applicationsLoading: false,
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

      set({ applicationsLoading: false });

      return {
        success: false,
        message: msg,
      };
    }
  },

  fetchAppliedJobs: async () => {
    set({ applicationsLoading: true });

    try {
      const response = await axios.get("/application/get");

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
      });

      return applications;
    } catch (error) {
      console.error(error);

      set({
        applicationsLoading: false,
      });

      return [];
    }
  },

  fetchApplicationStatus: async (jobId) => {
    if (!get().user || get().user.role !== "candidate") {
      return null;
    }

    set({ applicationsLoading: true });

    try {
      const response = await axios.get("/application/get");

      const applications = response.data.applications || [];

      const application = applications.find((item) => {
        const applicationJobId = item.job?._id || item.job;

        return applicationJobId?.toString() === jobId?.toString();
      });

      const status = application?.status || null;

      set((state) => ({
        applicationsLoading: false,
        applicationStatusByJobId: {
          ...state.applicationStatusByJobId,
          [jobId]: status,
        },
      }));

      return status;
    } catch (error) {
      console.error(error);

      set({ applicationsLoading: false });

      return null;
    }
  },

  fetchApplicants: async (jobId) => {
    set({
      applicationsLoading: true,
      applicants: [],
    });

    try {
      const response = await axios.get(`/application/${jobId}/applicants`);

      set({
        applicants: response.data.job.applications,
        applicationsLoading: false,
      });

      return response.data.job;
    } catch (error) {
      console.error(error);

      set({
        applicationsLoading: false,
      });

      return null;
    }
  },

  updateApplicationStatus: async (applicationId, status, jobId) => {
    try {
      const response = await axios.put(
        `/application/status/${applicationId}/update`,
        { status },
      );

      if (jobId) {
        await get().fetchApplicants(jobId);
      }

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to update applicant status.";

      return {
        success: false,
        message: msg,
      };
    }
  },
}));
