import { useEffect, useState } from "react";
import BlogCard from "../components/blog/BlogCard";

interface Blog {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  createdAt: string;
}

const BlogPageV2 = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Blog | Ajangbile Heritage";

    const loadBlogs = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/blog-v2`,
        );

        const data = await res.json();

        setBlogs(data.blogs || []);
      } catch (error) {
        console.error("Failed to load blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  if (loading) {
    return <div className="py-24 text-center text-xl">Loading articles...</div>;
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-14">
        <h1 className="text-5xl font-bold text-[#4b0082] mb-4">
          Ajangbile Heritage Blog
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover articles on Ifa, Ogboni, Yoruba history, African
          spirituality, culture, and traditional wisdom.
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          No articles have been published yet.
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

export default BlogPageV2;
