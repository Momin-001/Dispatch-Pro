"use client";

import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

/** FormData must not use application/json — the browser sets multipart boundary. */
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData && config.headers) {
    const h = config.headers;
    if (typeof h.delete === "function") {
      h.delete("Content-Type");
      h.delete("content-type");
    } else {
      delete h["Content-Type"];
      delete h["content-type"];
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    const isSilent = error.config?.silent === true; // 👈 check the flag

    if (status === 401) {
      if (!isSilent && message && typeof window !== "undefined") {
        toast.error(message);
      }
    } else if (status === 403) {
      toast.error(
        message ||
          "Permission denied. Please refresh to access new permissions for your role."
      );
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (status) {
      toast.error(message || "Something went wrong.");
    }

    return Promise.reject(error);
  }
);

export default api;
