import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  // ✅ FIX: invalid values filter करो
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