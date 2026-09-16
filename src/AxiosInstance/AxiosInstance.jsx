import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const instance = axios.create({
//   baseURL: "https://1vkmpxlh-8080.inc1.devtunnels.ms/api",
//   withCredentials: true,
//   timeout: 10000,
//   headers: {
//     "Content-type": "application/json",
//   },
// });
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
instance.interceptors.request.use(config => {
  console.log(`➡️ Request: ${config.method?.toUpperCase()} ${config.url}`);
  
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

let isRefreshing = false;
let failedQueue = [];
let authFailed = false;

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor
instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (authFailed) {
      return Promise.reject(error);
    }

    // 🔥 IMPORTANT: Login endpoint-க்கு 401 வந்தால் redirect செய்ய வேண்டாம்
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // ✅ Login endpoint-ஐ skip செய்யவும் - இங்கேதான் முக்கிய மாற்றம்
      if (originalRequest.url.includes("/auth/login")) {
        console.log("🚫 Login failed - 401 Unauthorized");
        // Login component-இல் error handle பண்ணும், redirect வேண்டாம்
        return Promise.reject(error);
      }

      if (originalRequest.url.includes("/auth/refresh")) {
        console.log("🚫 Refresh token failed");
        authFailed = true;
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace("/login?session_expired=1");
        return Promise.reject(error);
      }

      // ✅ Refresh token-க்கு மட்டும் redirect செய்யவும்
      if (isRefreshing) {
        console.log("⏳ Already refreshing, adding to queue");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => instance(originalRequest))
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      console.log("🔄 Starting token refresh...");
      try {
        const response = await instance.post("/auth/refresh");
        if (response.data?.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
        }
        console.log("✅ Token refreshed");
        processQueue(null);
        return instance(originalRequest);
      } catch (err) {
        console.error("❌ Refresh token failed", err);
        authFailed = true;
        processQueue(err);
        failedQueue = [];
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login?session_expired=1";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status !== 401) {
      const { status, data } = error.response || {};
      if (status === 400) {
        const fieldErrors = data?.errors || data?.details;
        if (fieldErrors && typeof fieldErrors === "object") {
          return Promise.reject({ type: "VALIDATION", errors: fieldErrors });
        }
      }
      const message = getErrorMessage(error);
      toast.error(message, { toastId: message });
    }

    return Promise.reject(error);
  }
);

export default instance;

const getErrorMessage = (error) => {
  if (error.response) {
    const details = error.response.data?.details;
    const message = error.response.data?.message;
    const status = error.response.status;

    let formattedDetails = '';
    if (Array.isArray(details)) {
      formattedDetails = details.join(', ');
    } else if (typeof details === 'string') {
      formattedDetails = details;
    }

    return formattedDetails || message || `Request failed (${status})`;
  }
  return error.message || "Unexpected error occurred";
};

// Logout function
export const logout = async () => {
  try {
    await instance.post("/auth/logout");
    localStorage.clear();
    sessionStorage.clear();
    console.log("Logged out successfully");
    document.title = "LIDER-SLMS";
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error.response?.data || error.message);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  }
};