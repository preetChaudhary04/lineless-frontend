import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

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
