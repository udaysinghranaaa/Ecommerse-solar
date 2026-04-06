import axios from "axios";

// ✅ Next.js ENV
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token && token !== "undefined" && token !== "null") {
    req.headers.Authorization = `Bearer ${token}`;
  } else {
    delete req.headers.Authorization;
  }

  return req;
});

export default API;

// APIs
export const getProducts = () => API.get("/products");
export const createProduct = (data) => API.post("/products", data);