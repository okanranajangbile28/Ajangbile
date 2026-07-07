import { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "../components/blog/BlogCard";

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  createdAt: string;
}

const BlogPageV2 = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBlogs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/blog-v2`,
      );

      setBlogs(res.data.blogs);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Ajangbile Heritage | Blog";
    loadBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}

      <section className="bg-purple-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="uppercase tracking-widest text-yellow-400 mb-3">
            Ajangbile Heritage
          </p>

          <h1 className="text-5xl font-bold mb-5">Blog & Articles</h1>

          <p className="text-xl text-gray-300 max-w-2xl">
            Explore Yoruba culture, Ifa wisdom, Ogboni traditions, spirituality,
            history and community news.
          </p>
        </div>
      </section>

      {/* ARTICLES */}

      <section className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <h2 className="text-center text-2xl">Loading articles...</h2>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-purple-900">
              No Articles Yet
            </h2>

            <p className="mt-4 text-gray-600">
              Articles published from the Blog CMS will appear here.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogPageV2;
