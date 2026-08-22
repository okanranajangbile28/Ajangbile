import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface OgboniBlog {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  createdAt: string;
  featured: boolean;
}

const OgboniBlogSection = () => {
  const [blogs, setBlogs] = useState<OgboniBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOgboniBlogs = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/ogboni-blog`,
        );

        const data = await res.json();

        setBlogs(data.blogs || []);
      } catch (error) {
        console.error("Failed to load Ogboni blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOgboniBlogs();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-6">
        <div className="text-center text-gray-500">
          Loading Ogboni articles...
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section className="bg-purple-950 text-white py-20 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <p className="text-yellow-400 uppercase tracking-[4px] font-semibold">
              Ogboni
            </p>

            <h2 className="text-4xl font-bold text-yellow-400 mt-2">
              Ogboni Blog
            </h2>

            <p className="text-gray-300 mt-3 max-w-2xl">
              Explore articles on Ogboni history, tradition, spirituality,
              culture and sacred teachings.
            </p>
          </div>

          <Link
            to="/ogboni"
            className="border-2 border-yellow-400 px-6 py-3 rounded-full text-yellow-400 font-semibold hover:bg-yellow-400 hover:text-purple-950 transition"
          >
            Visit Ogboni
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {blogs.slice(0, 3).map((blog) => (
            <article
              key={blog._id}
              className="bg-purple-900 rounded-2xl overflow-hidden border border-purple-700 shadow-xl"
            >
              {blog.coverImage && (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-56 object-cover"
                />
              )}

              <div className="p-6">
                <p className="text-yellow-400 text-sm font-semibold uppercase tracking-wide">
                  {blog.category}
                </p>

                <h3 className="text-2xl font-bold mt-3 mb-3">{blog.title}</h3>

                <p className="text-gray-300 leading-7 mb-6">{blog.excerpt}</p>

                <Link
                  to={`/ogboni-blog/${blog.slug}`}
                  className="inline-block bg-yellow-500 text-purple-950 px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition"
                >
                  Read Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OgboniBlogSection;
