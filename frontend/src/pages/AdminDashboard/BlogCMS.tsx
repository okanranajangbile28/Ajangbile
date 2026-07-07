import { useEffect, useState } from "react";
import axios from "axios";

interface Blog {
  _id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
}

const BlogCMS = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const [editingId, setEditingId] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Culture");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);

  const [image, setImage] = useState<File | null>(null);

  const loadBlogs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/blog-v2`,
      );

      setBlogs(res.data.blogs);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const clearForm = () => {
    setEditingId("");
    setTitle("");
    setCategory("Culture");
    setExcerpt("");
    setContent("");
    setFeatured(false);
    setPublished(true);
    setImage(null);
  };

  const submitBlog = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("category", category);
      formData.append("excerpt", excerpt);
      formData.append("content", content);
      formData.append("featured", String(featured));
      formData.append("published", String(published));

      if (image) {
        formData.append("image", image);
      }

      if (editingId) {
        await axios.patch(
          `${import.meta.env.VITE_SERVER_URL}/api/blog-v2/${editingId}`,
          formData,
        );

        alert("Blog updated successfully.");
      } else {
        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/blog-v2`,
          formData,
        );

        alert("Blog created successfully.");
      }

      clearForm();
      loadBlogs();
    } catch (err) {
      console.log(err);
      alert("Unable to save blog.");
    }
  };

  const editBlog = (blog: Blog) => {
    setEditingId(blog._id);

    setTitle(blog.title);
    setCategory(blog.category);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setFeatured(blog.featured);
    setPublished(blog.published);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteBlog = async (id: string) => {
    if (!window.confirm("Delete this article?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/blog-v2/${id}`,
      );

      loadBlogs();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Blog CMS</h1>

      <form
        onSubmit={submitBlog}
        className="space-y-5 bg-white p-6 rounded-xl shadow"
      >
        <input
          placeholder="Blog title"
          className="border w-full p-3 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="border w-full p-3 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Culture</option>
          <option>History</option>
          <option>Spirituality</option>
          <option>News</option>
          <option>Events</option>
        </select>

        <textarea
          rows={3}
          className="border w-full p-3 rounded"
          placeholder="Short excerpt..."
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />

        <textarea
          rows={8}
          className="border w-full p-3 rounded"
          placeholder="Write article..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              setImage(e.target.files[0]);
            }
          }}
        />

        <div className="flex gap-8">
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured
          </label>

          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Published
          </label>
        </div>

        <div className="flex gap-4">
          <button className="bg-purple-700 text-white px-8 py-3 rounded">
            {editingId ? "Update Blog" : "Publish Blog"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={clearForm}
              className="bg-gray-500 text-white px-8 py-3 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-3xl font-bold mt-12 mb-6">Existing Articles</h2>

      <div className="space-y-4">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold text-xl">{blog.title}</h3>

              <p className="text-gray-600">{blog.category}</p>

              <div className="flex gap-3 mt-2">
                {blog.featured && (
                  <span className="bg-yellow-400 px-3 py-1 rounded-full text-sm">
                    Featured
                  </span>
                )}

                {blog.published ? (
                  <span className="bg-green-200 px-3 py-1 rounded-full text-sm">
                    Published
                  </span>
                ) : (
                  <span className="bg-gray-300 px-3 py-1 rounded-full text-sm">
                    Draft
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => editBlog(blog)}
                className="bg-blue-600 text-white px-5 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteBlog(blog._id)}
                className="bg-red-600 text-white px-5 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogCMS;
