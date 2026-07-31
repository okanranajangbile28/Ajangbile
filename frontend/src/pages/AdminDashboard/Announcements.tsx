import { useCallback, useEffect, useState } from "react";
import axios from "axios";

interface Announcement {
  _id: string;
  title: string;
  message: string;
  category: string;
  image?: string;
  pinned?: boolean;
  active?: boolean;
  createdAt?: string;
}

interface AnnouncementForm {
  title: string;
  message: string;
  category: string;
  image: File | null;
}

const Announcements = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<AnnouncementForm>({
    title: "",
    message: "",
    category: "Announcement",
    image: null,
  });

  const [preview, setPreview] = useState<string>("");

  const categories = ["Announcement", "Weekly Update", "Event"];

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${SERVER_URL}/api/announcements`);

      setAnnouncements(
        Array.isArray(res.data.announcements) ? res.data.announcements : [],
      );
    } catch (error) {
      console.error("Failed to fetch announcements", error);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  }, [SERVER_URL]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setForm({
      ...form,
      image: file,
    });

    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm({
      title: "",
      message: "",
      category: "Announcement",
      image: null,
    });

    setPreview("");
    setEditingId(null);
  };

  const submitAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("message", form.message);
      formData.append("category", form.category);

      if (form.image) {
        formData.append("announcementImage", form.image);
      }

      if (editingId) {
        await axios.patch(
          `${SERVER_URL}/api/announcements/${editingId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else {
        await axios.post(`${SERVER_URL}/api/announcements`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      resetForm();
      fetchAnnouncements();
    } catch (error) {
      console.error("Announcement save failed", error);
    } finally {
      setSaving(false);
    }
  };
  const editAnnouncement = (announcement: Announcement) => {
    setEditingId(announcement._id);

    setForm({
      title: announcement.title,
      message: announcement.message,
      category: announcement.category,
      image: null,
    });

    if (announcement.image) {
      setPreview(announcement.image);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteAnnouncement = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this announcement?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${SERVER_URL}/api/announcements/${id}`);

      fetchAnnouncements();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const togglePin = async (id: string, pinned?: boolean) => {
    try {
      await axios.patch(`${SERVER_URL}/api/announcements/${id}`, {
        pinned: !pinned,
      });

      fetchAnnouncements();
    } catch (error) {
      console.error("Pin update failed", error);
    }
  };

  const toggleActive = async (id: string, active?: boolean) => {
    try {
      await axios.patch(`${SERVER_URL}/api/announcements/${id}`, {
        active: !active,
      });

      fetchAnnouncements();
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-purple-900 mb-6">
          {editingId ? "Edit Announcement" : "Create Announcement"}
        </h1>

        <form onSubmit={submitAnnouncement} className="space-y-5">
          <div>
            <label className="block font-semibold mb-2">Title</label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Category</label>

            <select
              name="category"
              value={form.category}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-4 py-3"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Message</label>

            <textarea
              name="message"
              value={form.message}
              onChange={handleInputChange}
              required
              rows={5}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Announcement Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border rounded-lg p-2"
            />

            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-48 h-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-purple-800 text-white px-6 py-3 rounded-lg hover:bg-purple-900 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Announcement"
                  : "Create Announcement"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-900">
            All Announcements
          </h2>

          <span className="text-gray-600">{announcements.length} Total</span>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No announcements found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(Array.isArray(announcements) ? announcements : []).map(
              (announcement) => (
                <div
                  key={announcement._id}
                  className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  {announcement.image && (
                    <img
                      src={announcement.image}
                      alt={announcement.title}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="text-xl font-bold text-purple-900">
                        {announcement.title}
                      </h3>

                      {announcement.pinned && (
                        <span className="bg-yellow-400 text-black text-xs px-3 py-1 rounded-full">
                          Pinned
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500">
                      {announcement.category}
                    </p>

                    <p className="text-gray-700">{announcement.message}</p>

                    <div className="flex flex-wrap gap-2 pt-4">
                      <button
                        onClick={() => editAnnouncement(announcement)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteAnnouncement(announcement._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() =>
                          togglePin(announcement._id, announcement.pinned)
                        }
                        className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm hover:bg-yellow-600"
                      >
                        {announcement.pinned ? "Unpin" : "Pin"}
                      </button>

                      <button
                        onClick={() =>
                          toggleActive(announcement._id, announcement.active)
                        }
                        className={`px-4 py-2 rounded-lg text-sm text-white ${
                          announcement.active
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-600 hover:bg-gray-700"
                        }`}
                      >
                        {announcement.active ? "Deactivate" : "Activate"}
                      </button>
                    </div>

                    {announcement.createdAt && (
                      <p className="text-xs text-gray-400 pt-2">
                        Created:{" "}
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
