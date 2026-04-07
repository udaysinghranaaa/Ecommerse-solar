"use client";

import { useEffect, useState } from "react";
import API from "../services/api";
import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";
import Categories from "../components/Categories";
import WhyChoose from "../components/WhyChoose";
import Reviews from "../components/Reviews";
import Stories from "../components/Stories";

export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get("/category")
      .then((res) => {
        setCategories(res.data.categories || []);
      })
      .catch((err) => {
        console.error("CATEGORY ERROR:", err);
      });
  }, []);

  return (
    <>
      <Hero />
      <ProductGrid title="⚡ Featured Solar Solutions" type="trending" />
      <ProductGrid title="🌟 Customer Favorites" type="featured" />
      <Categories categories={categories} />
      <WhyChoose />
      <Reviews />
      <Stories />
    </>
  );
}