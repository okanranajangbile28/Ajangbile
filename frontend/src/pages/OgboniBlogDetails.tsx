import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface OgboniBlog {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  readingTime: number;
  views: number;
  createdAt: string;
}

interface OgboniBlogResponse {
  blog: OgboniBlog;
  message?: string;
}

const OgboniBlogDetails = () => {
  const { slug } = useParams<{ slug: string }>();

  const [blog, setBlog] = useState<OgboniBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/ogboni-blog/${slug}`,
        );

        const data: OgboniBlogResponse = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Article not found");
        }

        setBlog(data.blog);

        document.title = `${data.blog.title} | Ogboni | Ajangbile Heritage`;
      } catch (err: unknown) {
        console.error("Failed to load Ogboni article:", err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unable to load article.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadBlog();
    } else {
      setError("Article not found.");
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 text-center text-xl">Loading Ogboni article...</div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold text-[#4b0082] mb-4">
          Article Not Found
        </h1>

        <p className="text-gray-600 mb-8">
          {error || "This Ogboni article could not be found."}
        </p>

        <Link
          to="/ogboni"
          className="inline-block bg-[#4b0082] text-white px-6 py-3 rounded-full"
        >
          Back to Ogboni
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-purple-950 min-h-screen text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <Link
          to="/ogboni"
          className="inline-block text-yellow-400 mb-8 hover:text-yellow-300"
        >
          ← Back to Ogboni
        </Link>

        <div className="mb-8">
          <p className="text-yellow-400 uppercase tracking-wider font-semibold mb-3">
            {blog.category}
          </p>

          <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap gap-4 mt-6 text-gray-300">
            <span>By {blog.author}</span>

            <span>•</span>

            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>

            <span>•</span>

            <span>{blog.readingTime} min read</span>

            <span>•</span>

            <span>{blog.views} views</span>
          </div>
        </div>

        {blog.coverImage && (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full max-h-[550px] object-cover rounded-3xl shadow-2xl mb-12"
          />
        )}

        <div className="bg-purple-900 rounded-3xl p-8 md:p-12 shadow-xl">
          <p className="text-xl text-yellow-200 leading-9 mb-10">
            {blog.excerpt}
          </p>

          <div className="text-gray-200 text-lg leading-9 whitespace-pre-line">
            {blog.content}
          </div>
        </div>

        <div className="mt-12">
          <Link
            to="/ogboni"
            className="inline-flex items-center bg-yellow-500 text-purple-950 px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition"
          >
            ← Back to Ogboni
          </Link>
        </div>
      </div>
    </article>
  );
};

export default OgboniBlogDetails;
