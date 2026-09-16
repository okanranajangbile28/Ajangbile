import { useEffect, useState } from "react";
import { Megaphone, CalendarDays, Pin, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

import MemberPortalLayout from "../components/member/MemberPortalLayout";

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

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/announcements`,
        );

        const data = Array.isArray(response.data?.announcements)
          ? response.data.announcements
          : [];

        const filtered = data
          .filter(
            (item: Announcement) =>
              item.category === "Announcement" && item.active !== false,
          )
          .sort((a: Announcement, b: Announcement) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;

            return (
              new Date(b.createdAt || "").getTime() -
              new Date(a.createdAt || "").getTime()
            );
          });

        setAnnouncements(filtered);
      } catch (error) {
        console.error("Unable to fetch announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const formatDate = (date?: string) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <MemberPortalLayout>
      <div className="mx-auto w-full max-w-6xl">
        {/* HEADER */}
        <div className="mb-8">
          <Link
            to="/ogboni-dashboard"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-purple-900 hover:text-purple-700"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-900">
                <Megaphone size={24} />
              </div>

              <h1 className="text-2xl font-bold text-purple-950 sm:text-3xl">
                Announcements
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                Stay informed about important notices, information and official
                communications from Iledi Ajangbile.
              </p>
            </div>

            <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Published
              </p>

              <p className="mt-1 text-xl font-bold text-purple-950">
                {announcements.length}
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="text-center">
              <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-purple-100 border-t-purple-900" />

              <p className="text-sm text-gray-500">Loading announcements...</p>
            </div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-gray-200">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-900">
              <Megaphone size={25} />
            </div>

            <h2 className="text-lg font-bold text-gray-900">
              No announcements yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              There are currently no published announcements for members. Please
              check back later.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {announcements.map((announcement) => (
              <article
                key={announcement._id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {announcement.image && (
                  <div className="h-52 overflow-hidden bg-gray-100">
                    <img
                      src={announcement.image}
                      alt={announcement.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="p-5 sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-900">
                      Announcement
                    </span>

                    {announcement.pinned && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-700">
                        <Pin size={13} />
                        Pinned
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-bold leading-7 text-gray-900">
                    {announcement.title}
                  </h2>

                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                    {announcement.message}
                  </p>

                  {announcement.createdAt && (
                    <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
                      <CalendarDays size={14} />
                      {formatDate(announcement.createdAt)}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </MemberPortalLayout>
  );
};

export default Announcements;
