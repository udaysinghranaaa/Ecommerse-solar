"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";
import Categories from "../components/Categories";
import WhyChoose from "../components/WhyChoose";
import Reviews from "../components/Reviews";
import Stories from "../components/Stories";

export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("https://ecommerse-solar.onrender.com/api/category")
      .then((res) => {
        const data =
          res.data.categories || (Array.isArray(res.data) ? res.data : []);
        setCategories(data);
      })
      .catch((err) => console.log(err));
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