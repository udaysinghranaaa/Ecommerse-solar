import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// ✅ ADD INTERCEPTOR (IMPORTANT)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;

// APIs
export const getProducts = () => API.get("/products");
export const createProduct = (data) => API.post("/products", data);