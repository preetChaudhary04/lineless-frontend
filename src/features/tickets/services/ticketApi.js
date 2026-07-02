import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

// Join a queue (Students only)
export const joinQueue = async (serviceId) => {
  try {
    const response = await api.post("/api/tickets/join", { serviceId });
    return response.data;
  } catch (error) {
    console.error("API Error in joinQueue:", error.message);
    throw new Error(
      error.response?.data?.message || "Failed to issue queue ticket.",
    );
  }
};

// Fetches a student's personal queue history/active tokens (Students only)
export const fetchMyTickets = async () => {
  try {
    const response = await api.get("/api/tickets/my-tickets");
    return response.data;
  } catch (error) {
    console.error("API Error in fetchMyTickets:", error.message);
    throw new Error(
      error.response?.data?.message || "Failed to load your ticket profile.",
    );
  }
};

// Provider calls up the next customer in line sequence (Providers / Admins only)
export const advanceNextCustomer = async (serviceId) => {
  try {
    const response = await api.patch(`/api/tickets/next/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error("API Error in advanceNextCustomer:", error.message);
    throw new Error(
      error.response?.data?.message || "Failed to advance the line status.",
    );
  }
};

// Get the entire current active queue sequence of students (Providers / Admins only)
export const fetchActiveLineup = async (serviceId) => {
  try {
    const response = await api.get(`/api/tickets/active-line/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error("API Error in fetchActiveLineup:", error.message);
    throw new Error(
      error.response?.data?.message || "Failed to load active queue lineup.",
    );
  }
};
