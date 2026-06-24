import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

// Register a new User
const registerUser = async ({
  fullName,
  email,
  password,
  phoneNumber,
  role,
}) => {
  try {
    const response = await api.post("/api/auth/register", {
      fullName,
      email,
      password,
      phoneNumber,
      role,
    });
    return response.data;
  } catch (error) {
    console.error("API Error in registerUser:", error.message);
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

// Login an User
const loginUser = async ({ email, password }) => {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("API Error in loginUser:", error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// Logout user
const logoutUser = async () => {
  try {
    const response = await api.post("/api/auth/logout");
    return response.data;
  } catch (error) {
    console.error("API Error in logoutUser:", error.message);
    throw new Error(error.response?.data?.message || "Logout failed");
  }
};

// Fetches the currently authenticated user session
const getMe = async () => {
  try {
    const response = await api.get("/api/auth/me");
    return response.data;
  } catch (error) {
    console.error("API Error in getMe:", error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch user session",
    );
  }
};

export { registerUser, loginUser, logoutUser, getMe };
