import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ecommerse-solar.onrender.com";

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

// 🔥 interceptor
API.interceptors.request.use((req) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token && token !== "undefined" && token !== "null") {
      req.headers.Authorization = `Bearer ${token}`;
    } else {
      delete req.headers.Authorization;
    }
  }

  return req;
});

export default API;

// APIs
export const getProducts = () => API.get("/products");

// ✅ FIXED (IMPORTANT)
export const createProduct = (data) =>
  API.post("/products", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// 🔥 FIXED
export const checkAdminAuth = () => API.get("/auth/admin-check");

export const getImageUrl = (path) => {
  if (!path) return "";
  return `${BASE_URL}/${path.replace(/\\/g, "/")}`;
};