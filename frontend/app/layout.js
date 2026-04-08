"use client";

import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import API from "./services/api"; // ✅ CHANGE

export default function RootLayout({ children }) {
  const [categories, setCategories] = useState([]);

  // 🔥 GLOBAL CATEGORY FETCH
  useEffect(() => {
    API.get("/category") // ✅ CHANGE
      .then((res) => {
        const data =
          res.data.categories || (Array.isArray(res.data) ? res.data : []);
        setCategories(data);
      })
      .catch((err) => console.log("Category Error:", err));
  }, []);

  return (
    <html lang="en">
      <body className="bg-white text-gray-900">

        <Navbar categories={categories} />

        <main className="min-h-screen">{children}</main>

        <Footer />

      </body>
    </html>
  );
}