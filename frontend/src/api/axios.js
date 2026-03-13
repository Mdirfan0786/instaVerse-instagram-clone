import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const clientServer = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Using inceptors for attach token automatically
clientServer.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
