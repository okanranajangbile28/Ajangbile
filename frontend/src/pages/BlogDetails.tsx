import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  createdAt: string;
}

const BlogDetails = () => {
  const { slug } = useParams();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/blog-v2/${slug}`,
        );

        const data = await res.json();

        setBlog(data.blog || null);

        if (data.blog) {
          document.title = `${data.blog.title} | Ajangbile Heritage`;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [slug]);

  if (loading) {
    return <div className="py-24 text-center text-xl">Loading article...</div>;
  }

  if (!blog) {
    return (
      <div className="max-w-5xl mx-auto py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Article not found</h2>

        <Link
          to="/blog"
          className="text-purple-700 font-semibold hover:underline"
        >
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto py-16 px-6">
      <img
        src={blog.coverImage}
        alt={blog.title}
        className="w-full h-[450px] object-cover rounded-2xl mb-10"
      />

      <span className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-6">
        {blog.category}
      </span>

      <h1 className="text-5xl font-bold text-purple-950 mb-4">{blog.title}</h1>

      <div className="text-gray-500 mb-10">
        {new Date(blog.createdAt).toLocaleDateString()} • {blog.author}
      </div>

      <p className="text-xl text-gray-700 italic mb-10">{blog.excerpt}</p>

      <div className="whitespace-pre-wrap leading-9 text-lg text-gray-800">
        {blog.content}
      </div>

      <div className="mt-14">
        <Link
          to="/blog"
          className="text-purple-700 font-semibold hover:underline"
        >
          ← Back to all articles
        </Link>
      </div>
    </article>
  );
};

export default BlogDetails;
