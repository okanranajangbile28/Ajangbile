import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface OgboniBlog {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
}

const OgboniFeaturedBlogs = () => {
  const [blogs, setBlogs] = useState<OgboniBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOgboniBlogs = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/ogboni-blog`,
        );

        if (!res.ok) {
          throw new Error("Failed to load Ogboni blogs");
        }

        const data = await res.json();

        const publishedBlogs = (data.blogs || [])
          .filter((blog: OgboniBlog) => blog.published)
          .slice(0, 3);

        setBlogs(publishedBlogs);
      } catch (error) {
        console.error("Failed to load Ogboni blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOgboniBlogs();
  }, []);

  return (
    <section className="bg-purple-950 py-20 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-yellow-400 mt-2">
              Ogboni Blog
            </h2>

            <p className="text-gray-300 max-w-2xl mt-4">
              Explore the history, traditions, wisdom, culture and teachings of
              Ogboni.
            </p>
          </div>

          <Link
            to="/ogboni"
            className="border-2 border-yellow-400 px-6 py-3 rounded-full text-yellow-300 font-semibold hover:bg-yellow-400 hover:text-purple-950 transition"
          >
            View Ogboni Page
          </Link>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-16 text-gray-300 text-lg">
            Loading Ogboni articles...
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            No Ogboni articles have been published yet.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="bg-purple-900 border border-yellow-500/50 rounded-3xl overflow-hidden shadow-xl hover:-translate-y-1 transition duration-300"
              >
                {/* Image */}
                {blog.coverImage ? (
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-56 bg-purple-800 flex items-center justify-center">
                    <span className="text-yellow-400 font-bold text-xl">
                      Ogboni
                    </span>
                  </div>
                )}

                <div className="p-7">
                  {/* Category */}
                  <p className="text-yellow-400 text-sm uppercase tracking-wider font-semibold mb-3">
                    {blog.category}
                  </p>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {blog.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-300 leading-7 mb-6">{blog.excerpt}</p>

                  {/* Read */}
                  <Link
                    to={`/ogboni-blog/${blog.slug}`}
                    className="inline-flex items-center gap-2 bg-yellow-500 text-purple-950 px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition"
                  >
                    Read Article
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* View All */}
        {blogs.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/ogboni"
              className="inline-flex items-center gap-2 text-yellow-300 font-semibold hover:text-yellow-400 transition"
            >
              Explore More Ogboni Articles
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default OgboniFeaturedBlogs;
