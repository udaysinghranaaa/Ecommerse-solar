"use client";

import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // ✅ ADD
import API from "./services/api";

export default function RootLayout({ children }) {
  const [categories, setCategories] = useState([]);
  const pathname = usePathname(); // ✅ ADD

  // 🔥 CHECK ADMIN ROUTE
  const isAdmin = pathname.startsWith("/admin");

  // 🔥 GLOBAL CATEGORY FETCH
  useEffect(() => {
    API.get("/category")
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

        {/* ❌ ADMIN PAGE पर Navbar hide */}
        {!isAdmin && <Navbar categories={categories} />}

        <main className="min-h-screen">{children}</main>

        {/* ❌ ADMIN PAGE पर Footer भी hide */}
        {!isAdmin && <Footer />}

      </body>
    </html>
  );
}