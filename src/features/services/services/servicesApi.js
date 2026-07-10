import axios from "axios";

const api = axios.create({
  baseURL: "https://lineless-backend.onrender.com",
  // baseURL: "http://localhost:5000",
  withCredentials: true,
});

// 🟨 ADD THE REQUEST INTERCEPTOR HERE TO INJECT THE HIDDEN TOKEN STRINGS:
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attaches token string safely to outgoing headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Fetches all available campus service desks/counters
export const fetchAllServices = async () => {
  try {
    const response = await api.get("/api/services");
    return response.data;
  } catch (error) {
    console.error("API Error in fetchAllServices:", error.message);
    throw new Error(
      error.response?.data?.message || "Failed to load campus services.",
    );
  }
};

// Provisions a brand new queue counter (Providers/Admins only)
export const createServiceCounter = async ({ name, description }) => {
  try {
    const response = await api.post("/api/services", { name, description });
    return response.data;
  } catch (error) {
    console.error("API Error in createServiceCounter:", error.message);
    throw new Error(
      error.response?.data?.message || "Failed to establish service counter.",
    );
  }
};

// Update the status of queue counter (Providers/Admins only)
export const updateCounterStatus = async (serviceId, serviceStatus) => {
  try {
    const response = await api.patch(`/api/services/status/${serviceId}`, {
      serviceStatus,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to alter desk status.",
    );
  }
};
