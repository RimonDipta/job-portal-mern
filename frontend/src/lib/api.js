import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let unauthorizedHandler = null;

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

const getStoredToken = () => {
  return localStorage.getItem("token");
};

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    const isAuthenticationRequest =
      requestUrl.includes("/user/login") ||
      requestUrl.includes("/user/register");

    if (status === 401 && !isAuthenticationRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      delete api.defaults.headers.common.Authorization;

      if (typeof unauthorizedHandler === "function") {
        unauthorizedHandler();
      }
    }

    return Promise.reject(error);
  },
);

export default api;
