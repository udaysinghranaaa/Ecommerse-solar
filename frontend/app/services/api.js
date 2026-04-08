import axios from "axios";

// ✅ Safe BASE URL
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ecommerse-solar.onrender.com";

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

// ✅ Interceptor (safe for Next.js)
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

// ✅ APIs
export const getProducts = () => API.get("/products");
export const createProduct = (data) => API.post("/products", data);