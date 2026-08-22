import { useEffect } from "react";
import Explore from "../components/home/Explore";
import FeaturedBlogs from "../components/home/FeaturedBlogs";
import OgboniFeaturedBlogs from "../components/home/OgboniFeaturedBlogs";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Hero from "../components/home/Hero";
import Testimonials from "../components/home/Testimonials";

const HomePage = () => {
  useEffect(() => {
    document.title = "Okanran Ajangbile | Home";
  }, []);

  return (
    <div>
      <Hero />

      <Explore />

      <FeaturedProducts />

      {/* Normal Ajangbile Heritage Blog */}
      <FeaturedBlogs />

      {/* Ogboni Blog */}
      <OgboniFeaturedBlogs />

      <Testimonials />
    </div>
  );
};

export default HomePage;
