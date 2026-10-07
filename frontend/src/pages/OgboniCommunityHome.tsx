import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Heart,
  MessageCircle,
  Send,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

import MemberPortalLayout from "../components/member/MemberPortalLayout";

interface Comment {
  _id?: string;
  member?: {
    _id?: string;
    fullName?: string;
    username?: string;
    photo?: string;

    // Possible chief/chieftaincy title field names
    chiefTitle?: string;
    ChiefTitle?: string;
    chieftaincyTitle?: string;
  };
  content: string;
  createdAt?: string;
}

interface Post {
  _id: string;
  content: string;
  image?: string;
  createdAt?: string;

  likes?: string[];

  comments?: Comment[];
}

const OgboniCommunityHome = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [commentText, setCommentText] = useState<Record<string, string>>({});

  const [submittingComment, setSubmittingComment] = useState<string | null>(
    null,
  );

  const token = localStorage.getItem("ogboniToken");

  /*
   * ============================================================
   * LOAD COMMUNITY POSTS
   * ============================================================
   */
  const fetchPosts = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/ogboni/posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPosts(response.data.posts || []);
    } catch (error) {
      console.error("Failed to load community posts:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  /*
   * ============================================================
   * LIKE / UNLIKE POST
   * ============================================================
   */
  const toggleLike = async (postId: string) => {
    if (!token) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/ogboni/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchPosts();
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  /*
   * ============================================================
   * ADD COMMENT
   * ============================================================
   */
  const addComment = async (postId: string) => {
    if (!token) return;

    const text = commentText[postId]?.trim();

    if (!text) return;

    try {
      setSubmittingComment(postId);

      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/ogboni/posts/${postId}/comments`,
        {
          content: text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCommentText((previous) => ({
        ...previous,
        [postId]: "",
      }));

      await fetchPosts();
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setSubmittingComment(null);
    }
  };

  /*
   * ============================================================
   * DELETE OWN COMMENT
   * ============================================================
   */
  const deleteComment = async (postId: string, commentId: string) => {
    if (!token) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/ogboni/posts/${postId}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchPosts();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  /*
   * ============================================================
   * FORMAT DATE
   * ============================================================
   */
  const formatDate = (date?: string) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  /*
   * ============================================================
   * CURRENT MEMBER
   * ============================================================
   */
  const currentMember = (() => {
    try {
      const stored = localStorage.getItem("ogboniMember");

      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const currentMemberId = currentMember?._id;

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */
  return (
    <MemberPortalLayout>
      <div className="mx-auto max-w-4xl">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <section className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#4b0082]">
            Iledi Ajangbile
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
            Community Home
          </h1>

          <p className="mt-2 text-base text-gray-500">
            Connect with fellow members, share in the community, and stay
            connected with Iledi Ajangbile.
          </p>
        </section>

        {/* =====================================================
            COMMUNITY FEED
        ====================================================== */}
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-purple-100 border-t-[#4b0082]" />

            <p className="text-gray-500">Loading community posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-50">
              <ImageIcon size={24} className="text-[#4b0082]" />
            </div>

            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              No community posts yet
            </h2>

            <p className="mt-2 text-gray-500">
              New posts from the community will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => {
              const likes = post.likes || [];
              const comments = post.comments || [];

              const likedByCurrentMember = likes.some(
                (like) => String(like) === String(currentMemberId),
              );

              return (
                <article
                  key={post._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  {/* =================================================
                      POST HEADER
                  ================================================== */}
                  <div className="flex items-center gap-3 px-5 py-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-900 font-bold text-yellow-400">
                      IA
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        Iledi Ajangbile
                      </p>

                      <p className="text-sm text-gray-500">
                        {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* =================================================
                      POST CONTENT
                  ================================================== */}
                  <div className="px-5 pb-5">
                    <p className="whitespace-pre-wrap text-base leading-7 text-gray-700">
                      {post.content}
                    </p>
                  </div>

                  {/* =================================================
                      POST IMAGE
                  ================================================== */}
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Community post"
                      className="max-h-[600px] w-full object-cover"
                    />
                  )}

                  {/* =================================================
                      LIKE / COMMENT COUNTS
                  ================================================== */}
                  <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 text-sm text-gray-500">
                    <span>
                      {likes.length} {likes.length === 1 ? "Like" : "Likes"}
                    </span>

                    <span>
                      {comments.length}{" "}
                      {comments.length === 1 ? "Comment" : "Comments"}
                    </span>
                  </div>

                  {/* =================================================
                      ACTION BUTTONS
                  ================================================== */}
                  <div className="grid grid-cols-2 border-b border-gray-100">
                    {/* LIKE BUTTON */}
                    <button
                      type="button"
                      onClick={() => toggleLike(post._id)}
                      className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition ${
                        likedByCurrentMember
                          ? "bg-red-50 text-red-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Heart
                        size={18}
                        fill={likedByCurrentMember ? "currentColor" : "none"}
                        className={
                          likedByCurrentMember
                            ? "text-red-600"
                            : "text-gray-500"
                        }
                      />

                      {likedByCurrentMember ? "Liked" : "Like"}
                    </button>

                    {/* COMMENT BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        document
                          .getElementById(`comments-${post._id}`)
                          ?.focus();
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                    >
                      <MessageCircle size={18} />
                      Comment
                    </button>
                  </div>

                  {/* =================================================
                      COMMENTS
                  ================================================== */}
                  <div className="px-5 py-5">
                    {comments.length > 0 && (
                      <div className="mb-5 space-y-4">
                        {comments.map((comment) => {
                          /*
                           * Determine the member's chief title.
                           *
                           * We support the possible field names used
                           * by the member data.
                           */
                          const memberTitle =
                            comment.member?.chiefTitle ||
                            comment.member?.ChiefTitle ||
                            comment.member?.chieftaincyTitle;

                          const memberName =
                            comment.member?.fullName ||
                            comment.member?.username ||
                            "Member";

                          return (
                            <div
                              key={comment._id}
                              className="rounded-xl bg-gray-50 p-4"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  {/* CHIEF TITLE */}
                                  {memberTitle && (
                                    <p className="text-xs font-semibold uppercase tracking-wide text-[#4b0082]">
                                      {memberTitle}
                                    </p>
                                  )}

                                  {/* MEMBER NAME */}
                                  <p
                                    className={`text-sm font-semibold text-gray-900 ${
                                      memberTitle ? "mt-1" : ""
                                    }`}
                                  >
                                    {memberName}
                                  </p>

                                  {/* COMMENT */}
                                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                                    {comment.content}
                                  </p>

                                  {/* COMMENT DATE */}
                                  {comment.createdAt && (
                                    <p className="mt-2 text-xs text-gray-400">
                                      {formatDate(comment.createdAt)}
                                    </p>
                                  )}
                                </div>

                                {/* DELETE OWN COMMENT */}
                                {comment.member?._id === currentMemberId &&
                                  comment._id && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        deleteComment(
                                          post._id,
                                          comment._id as string,
                                        )
                                      }
                                      className="text-gray-400 transition hover:text-red-600"
                                      aria-label="Delete comment"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* =================================================
                        COMMENT INPUT
                    ================================================== */}
                    <div className="flex items-end gap-3">
                      <textarea
                        id={`comments-${post._id}`}
                        value={commentText[post._id] || ""}
                        onChange={(event) =>
                          setCommentText((previous) => ({
                            ...previous,
                            [post._id]: event.target.value,
                          }))
                        }
                        placeholder="Write a comment..."
                        rows={2}
                        className="min-h-[48px] flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#4b0082] focus:ring-2 focus:ring-purple-100"
                      />

                      <button
                        type="button"
                        onClick={() => addComment(post._id)}
                        disabled={
                          submittingComment === post._id ||
                          !commentText[post._id]?.trim()
                        }
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#4b0082] text-white transition hover:bg-[#3b0068] disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Send comment"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </MemberPortalLayout>
  );
};

export default OgboniCommunityHome;
