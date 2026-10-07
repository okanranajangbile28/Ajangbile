import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  ImagePlus,
  Pencil,
  Trash2,
  MessageCircle,
  Heart,
  X,
} from "lucide-react";

interface Comment {
  _id: string;
  content: string;
  member?: {
    _id: string;
    fullName?: string;
    username?: string;
  };
  createdAt: string;
}

interface Post {
  _id: string;
  content: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  author?: {
    _id: string;
    name?: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface PostsResponse {
  success: boolean;
  results?: number;
  posts?: Post[];
}

interface ApiErrorResponse {
  message?: string;
}

interface ImageUploadResponse {
  success: boolean;
  image?: string;
}

const IlediOgboniPost = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const getAdminToken = useCallback((): string => {
    return (
      localStorage.getItem("token") || localStorage.getItem("accessToken") || ""
    );
  }, []);

  const getAuthHeaders = useCallback(() => {
    const token = getAdminToken();

    return {
      Authorization: `Bearer ${token}`,
    };
  }, [getAdminToken]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get<PostsResponse>(
        `${serverUrl}/api/ogboni/posts/admin`,
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        },
      );

      setPosts(response.data.posts || []);
    } catch (error: unknown) {
      console.error("Failed to load Iledi Ogboni posts:", error);

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        setError(
          error.response?.data?.message || "Unable to load Iledi Ogboni posts.",
        );
      } else {
        setError("Unable to load Iledi Ogboni posts.");
      }
    } finally {
      setLoading(false);
    }
  }, [serverUrl, getAuthHeaders]);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  const resetForm = () => {
    setContent("");
    setImage("");
    setImageFile(null);
    setImagePreview("");
    setEditingPost(null);
    setError("");
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      event.target.value = "";
      return;
    }

    setError("");
    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const removeImage = () => {
    setImage("");
    setImageFile(null);
    setImagePreview("");
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();

    formData.append("image", file);

    setUploadingImage(true);

    try {
      const response = await axios.post<ImageUploadResponse>(
        `${serverUrl}/api/ogboni/posts/image`,
        formData,
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        },
      );

      const uploadedImage = response.data.image;

      if (!uploadedImage) {
        throw new Error("Cloudinary did not return an image URL.");
      }

      return uploadedImage;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!content.trim()) {
      setError("Please enter some content for the post.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      let finalImage = image;

      // Upload a newly selected image first.
      if (imageFile) {
        finalImage = await uploadImage(imageFile);
      }

      if (editingPost) {
        await axios.patch(
          `${serverUrl}/api/ogboni/posts/${editingPost._id}`,
          {
            content: content.trim(),
            image: finalImage.trim(),
          },
          {
            headers: getAuthHeaders(),
            withCredentials: true,
          },
        );
      } else {
        await axios.post(
          `${serverUrl}/api/ogboni/posts`,
          {
            content: content.trim(),
            image: finalImage.trim(),
          },
          {
            headers: getAuthHeaders(),
            withCredentials: true,
          },
        );
      }

      resetForm();
      await fetchPosts();
    } catch (error: unknown) {
      console.error("Failed to save post:", error);

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        setError(error.response?.data?.message || "Unable to save the post.");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unable to save the post.");
      }
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setContent(post.content);
    setImage(post.image || "");
    setImageFile(null);
    setImagePreview(post.image || "");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (postId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await axios.delete(`${serverUrl}/api/ogboni/posts/${postId}`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      if (editingPost?._id === postId) {
        resetForm();
      }

      await fetchPosts();
    } catch (error: unknown) {
      console.error("Failed to delete post:", error);

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        setError(error.response?.data?.message || "Unable to delete the post.");
      } else {
        setError("Unable to delete the post.");
      }
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    const confirmed = window.confirm("Delete this comment?");

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await axios.delete(
        `${serverUrl}/api/ogboni/posts/${postId}/comments/${commentId}`,
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        },
      );

      await fetchPosts();
    } catch (error: unknown) {
      console.error("Failed to delete comment:", error);

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        setError(
          error.response?.data?.message || "Unable to delete the comment.",
        );
      } else {
        setError("Unable to delete the comment.");
      }
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-purple-900">
            Iledi Ogboni Post
          </h2>

          <p className="mt-2 text-gray-600">
            Create and manage private community posts for approved Ogboni
            members.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {error}
          </div>
        )}

        {/* Create / Edit Post */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xl font-bold text-purple-900">
                {editingPost ? "Edit Post" : "Create Community Post"}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                This post will appear in the private Ogboni member community
                feed.
              </p>
            </div>

            {editingPost && (
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600"
              >
                <X size={18} />
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Content */}
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Write an announcement, message, teaching, update or community post..."
              rows={7}
              maxLength={10000}
              className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-purple-500 resize-y"
            />

            {/* Image Upload */}
            <div className="mt-5">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <ImagePlus size={18} />
                Add Image
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <label className="inline-flex items-center justify-center gap-2 cursor-pointer bg-purple-900 hover:bg-purple-800 text-white font-semibold px-5 py-3 rounded-xl transition">
                  <ImagePlus size={18} />
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {(image || imagePreview) && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="inline-flex items-center justify-center gap-2 border border-gray-200 hover:bg-red-50 hover:text-red-600 text-gray-700 font-semibold px-5 py-3 rounded-xl transition"
                  >
                    <X size={18} />
                    Remove Image
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Select an image from your computer. It will be uploaded to
                Cloudinary when you publish or update the post.
              </p>
            </div>

            {/* Image Preview */}
            {(imagePreview || image) && (
              <div className="mt-5 relative">
                <img
                  src={imagePreview || image}
                  alt="Post preview"
                  className="w-full max-h-96 object-cover rounded-xl border border-gray-200"
                />

                {imageFile && (
                  <div className="absolute left-3 bottom-3 bg-black/70 text-white text-xs px-3 py-2 rounded-lg">
                    Ready to upload
                  </div>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="mt-5 bg-purple-900 hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              {uploadingImage
                ? "Uploading Image..."
                : saving
                  ? "Saving..."
                  : editingPost
                    ? "Update Post"
                    : "Publish Post"}
            </button>
          </form>
        </div>

        {/* Community Posts */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-2xl font-bold text-purple-900">
              Community Posts
            </h3>

            <span className="text-sm text-gray-500">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </span>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
              Loading community posts...
            </div>
          ) : posts.length === 0 ? (
            /* Empty */
            <div className="bg-white rounded-2xl shadow p-10 text-center">
              <MessageCircle size={42} className="mx-auto text-gray-300 mb-4" />

              <h4 className="text-lg font-semibold text-gray-700">
                No community posts yet
              </h4>

              <p className="text-gray-500 mt-2">
                Create the first Iledi Ogboni community post above.
              </p>
            </div>
          ) : (
            /* Posts List */
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-2xl shadow overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="p-5 border-b border-gray-100 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {post.author?.name ||
                          post.author?.email ||
                          "Administrator"}
                      </h4>

                      <p className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => handleEdit(post)}
                        className="p-2 rounded-lg hover:bg-purple-50 text-purple-700"
                        title="Edit post"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDelete(post._id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                        title="Delete post"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-5">
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {post.content}
                    </p>

                    {post.image && (
                      <img
                        src={post.image}
                        alt="Community post"
                        className="mt-5 w-full max-h-[500px] object-cover rounded-xl"
                      />
                    )}
                  </div>

                  {/* Engagement */}
                  <div className="px-5 py-3 border-t border-b border-gray-100 flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <Heart size={17} />
                      {post.likes?.length || 0} likes
                    </span>

                    <span className="flex items-center gap-2">
                      <MessageCircle size={17} />
                      {post.comments?.length || 0} comments
                    </span>
                  </div>

                  {/* Comments */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="p-5 bg-gray-50">
                      <h5 className="font-semibold text-gray-800 mb-4">
                        Comments
                      </h5>

                      <div className="space-y-3">
                        {post.comments.map((comment) => (
                          <div
                            key={comment._id}
                            className="bg-white rounded-xl p-4 border border-gray-100"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {comment.member?.fullName ||
                                    comment.member?.username ||
                                    "Ogboni Member"}
                                </p>

                                <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                                  {comment.content}
                                </p>

                                <p className="text-xs text-gray-400 mt-2">
                                  {new Date(comment.createdAt).toLocaleString()}
                                </p>
                              </div>

                              {/* Delete Comment */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteComment(post._id, comment._id)
                                }
                                className="text-red-500 hover:text-red-700"
                                title="Delete comment"
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IlediOgboniPost;
