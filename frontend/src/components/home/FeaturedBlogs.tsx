import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BlogCard from "../blog/BlogCard";

interface Blog {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  createdAt: string;
  featured: boolean;
}

const FeaturedBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/blog-v2`,
        );

        const data = await res.json();

        const featuredBlogs = (data.blogs || [])
          .filter((blog: Blog) => blog.featured)
          .slice(0, 3);

        setBlogs(featuredBlogs);
      } catch (error) {
        console.error("Failed to load featured blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  return (
    <section className="bg-white py-20 px-6 lg:px-16">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <p className="text-yellow-600 uppercase tracking-[4px] font-semibold">
            Blog
          </p>

          <h2 className="text-4xl font-bold text-[#4b0082] mt-2">
            Featured Articles
          </h2>
        </div>

        <Link
          to="/blog"
          className="border-2 border-[#4b0082] px-6 py-3 rounded-full text-[#4b0082] font-semibold hover:bg-[#4b0082] hover:text-white transition"
        >
          View All Articles
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-lg">
          Loading featured articles...
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No featured articles available.
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedBlogs;
