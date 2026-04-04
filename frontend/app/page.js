import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";
import Categories from "../components/Categories";
import WhyChoose from "../components/WhyChoose";
import Reviews from "../components/Reviews";
import Footer from "../components/Footer";
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ProductGrid title="🔥 Trending Now" />
      <ProductGrid title="❤️ Most Loved" />
      <Categories />
      <WhyChoose />
      <Reviews />
      <Footer />
    </>
  );
}