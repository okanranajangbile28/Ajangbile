import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";

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
        console.error("Failed to load blog:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadBlog();
    }
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
    <article className="max-w-5xl mx-auto py-16 px-6">
      {/* FEATURED IMAGE */}
      <div className="w-full bg-gray-100 rounded-2xl overflow-hidden mb-10">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full max-h-[600px] object-contain"
        />
      </div>

      {/* CATEGORY */}
      <span className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-6">
        {blog.category}
      </span>

      {/* TITLE */}
      <h1 className="text-4xl md:text-5xl font-bold text-purple-950 mb-4 leading-tight">
        {blog.title}
      </h1>

      {/* DATE + AUTHOR */}
      <div className="text-gray-500 mb-10">
        {new Date(blog.createdAt).toLocaleDateString()} • {blog.author}
      </div>

      {/* EXCERPT */}
      <p className="text-xl text-gray-700 italic mb-10 leading-8">
        {blog.excerpt}
      </p>

      {/* ARTICLE CONTENT */}
      <ContentContainer
        dangerouslySetInnerHTML={{
          __html: blog.content || "",
        }}
      />

      {/* BACK TO BLOG */}
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

const ContentContainer = styled.div`
  font-family: "Open Sans", sans-serif;
  color: #333;
  font-size: 18px;
  line-height: 1.8;

  p {
    margin-bottom: 20px;
  }

  h2 {
    font-family: "Manrope", sans-serif;
    font-size: 30px;
    font-weight: 700;
    line-height: 1.3;
    margin-top: 36px;
    margin-bottom: 18px;
    color: #4b0082;
  }

  h3 {
    font-family: "Manrope", sans-serif;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.4;
    margin-top: 30px;
    margin-bottom: 16px;
    color: #4b0082;
  }

  strong {
    font-weight: 700;
  }

  a {
    color: #6a1b9a;
    font-weight: 600;
    text-decoration: underline;
    cursor: pointer;
  }

  a:hover {
    opacity: 0.75;
  }

  ol {
    list-style-type: decimal;
    margin-left: 24px;
    padding-left: 24px;
    margin-bottom: 20px;
  }

  ul {
    list-style-type: disc;
    margin-left: 24px;
    padding-left: 24px;
    margin-bottom: 20px;
  }

  li {
    margin-bottom: 8px;
  }

  blockquote {
    border-left: 4px solid #4b0082;
    padding-left: 20px;
    margin: 24px 0;
    font-style: italic;
    color: #555;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 24px 0;
  }

  hr {
    margin: 32px 0;
    border: 0;
    border-top: 1px solid #ddd;
  }

  @media (max-width: 768px) {
    font-size: 16px;

    h2 {
      font-size: 25px;
    }

    h3 {
      font-size: 21px;
    }
  }
`;

export default BlogDetails;
