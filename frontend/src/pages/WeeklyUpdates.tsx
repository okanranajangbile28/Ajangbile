import { useEffect, useState } from "react";
import { Bell, CalendarDays, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

import MemberPortalLayout from "../components/member/MemberPortalLayout";

interface WeeklyUpdate {
  _id: string;
  title: string;
  message: string;
  category: string;
  image?: string;
  pinned?: boolean;
  active?: boolean;
  createdAt?: string;
}

const WeeklyUpdates = () => {
  const [updates, setUpdates] = useState<WeeklyUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyUpdates = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/announcements`,
        );

        const data = Array.isArray(response.data?.announcements)
          ? response.data.announcements
          : [];

        const filtered = data
          .filter(
            (item: WeeklyUpdate) =>
              item.category === "Weekly Update" && item.active !== false,
          )
          .sort((a: WeeklyUpdate, b: WeeklyUpdate) => {
            return (
              new Date(b.createdAt || "").getTime() -
              new Date(a.createdAt || "").getTime()
            );
          });

        setUpdates(filtered);
      } catch (error) {
        console.error("Unable to fetch weekly updates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyUpdates();
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

          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
            <Bell size={24} />
          </div>

          <h1 className="text-2xl font-bold text-purple-950 sm:text-3xl">
            Weekly Updates
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Keep up with the latest weekly information, activities and updates
            from the fraternity.
          </p>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="text-center">
              <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-purple-100 border-t-purple-900" />

              <p className="text-sm text-gray-500">Loading weekly updates...</p>
            </div>
          </div>
        ) : updates.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-gray-200">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
              <Sparkles size={25} />
            </div>

            <h2 className="text-lg font-bold text-gray-900">
              No weekly updates yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              New weekly updates will appear here when they are published by the
              administration.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {updates.map((update, index) => (
              <article
                key={update._id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200"
              >
                <div className="flex">
                  <div className="hidden w-1 shrink-0 bg-purple-900 sm:block" />

                  <div className="flex-1 p-5 sm:p-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-900">
                            Weekly Update
                          </span>

                          {index === 0 && (
                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800">
                              Latest
                            </span>
                          )}
                        </div>

                        <h2 className="text-xl font-bold text-gray-900">
                          {update.title}
                        </h2>
                      </div>

                      {update.createdAt && (
                        <div className="flex shrink-0 items-center gap-2 text-xs font-medium text-gray-500">
                          <CalendarDays size={14} />
                          {formatDate(update.createdAt)}
                        </div>
                      )}
                    </div>

                    {update.image && (
                      <div className="mt-5 overflow-hidden rounded-xl bg-gray-100">
                        <img
                          src={update.image}
                          alt={update.title}
                          className="max-h-[400px] w-full object-cover"
                        />
                      </div>
                    )}

                    <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-600 sm:text-base">
                      {update.message}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </MemberPortalLayout>
  );
};

export default WeeklyUpdates;
