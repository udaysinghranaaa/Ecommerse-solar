"use client";

import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RootLayout({ children }) {
  const [categories, setCategories] = useState([]);

  // 🔥 GLOBAL CATEGORY FETCH (Navbar ke liye)
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/category")
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

        {/* 🔥 GLOBAL NAVBAR */}
        <Navbar categories={categories} />

        {/* 🔥 PAGE CONTENT */}
        <main className="min-h-screen">{children}</main>

        {/* 🔥 GLOBAL FOOTER */}
        <Footer />

      </body>
    </html>
  );
}