import axios from "axios";
import useAuthStore from "../store/useAuthStore";

// Create an Axios instance
let baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
if (baseUrl.endsWith("/")) baseUrl = baseUrl.slice(0, -1);
if (!baseUrl.endsWith("/api")) baseUrl += "/api";

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request via interceptor
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

export default api;
