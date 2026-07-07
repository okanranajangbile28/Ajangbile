import { Link } from "react-router-dom";

interface Blog {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  createdAt: string;
}

interface Props {
  blog: Blog;
}

const BlogCard = ({ blog }: Props) => {
  return (
    <article className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden">
      <img
        src={blog.coverImage}
        alt={blog.title}
        className="w-full h-64 object-cover"
      />

      <div className="p-6">
        <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full mb-4">
          {blog.category}
        </span>

        <h2 className="text-2xl font-bold text-purple-950 mb-3">
          {blog.title}
        </h2>

        <p className="text-gray-600 mb-6">{blog.excerpt}</p>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>

          <Link
            to={`/blog/${blog.slug}`}
            className="text-yellow-600 font-semibold hover:underline"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
