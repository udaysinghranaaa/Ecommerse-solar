import axios from "axios";

// ✅ ENV se URL lo
const BASE_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  // ✅ invalid values filter
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