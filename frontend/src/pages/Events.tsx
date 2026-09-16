import { useEffect, useState } from "react";
import { CalendarDays, MapPin, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

import MemberPortalLayout from "../components/member/MemberPortalLayout";

interface EventItem {
  _id: string;
  title: string;
  message: string;
  category: string;
  image?: string;
  pinned?: boolean;
  active?: boolean;
  createdAt?: string;
}

const Events = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/announcements`,
        );

        const data = Array.isArray(response.data?.announcements)
          ? response.data.announcements
          : [];

        const filtered = data
          .filter(
            (item: EventItem) =>
              item.category === "Event" && item.active !== false,
          )
          .sort((a: EventItem, b: EventItem) => {
            return (
              new Date(b.createdAt || "").getTime() -
              new Date(a.createdAt || "").getTime()
            );
          });

        setEvents(filtered);
      } catch (error) {
        console.error("Unable to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
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
            <CalendarDays size={24} />
          </div>

          <h1 className="text-2xl font-bold text-purple-950 sm:text-3xl">
            Events
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Stay informed about upcoming gatherings, activities and important
            events within the fraternity.
          </p>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="text-center">
              <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-purple-100 border-t-purple-900" />

              <p className="text-sm text-gray-500">Loading events...</p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-gray-200">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
              <Sparkles size={25} />
            </div>

            <h2 className="text-lg font-bold text-gray-900">
              No upcoming events
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              New fraternity events will appear here when they are published by
              the administration.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {events.map((event, index) => (
              <article
                key={event._id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-md"
              >
                {event.image ? (
                  <div className="relative h-52 overflow-hidden bg-gray-100">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />

                    {index === 0 && (
                      <span className="absolute left-4 top-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-purple-950 shadow-md">
                        Latest Event
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex h-32 items-center justify-center bg-purple-950">
                    <CalendarDays size={42} className="text-yellow-400" />
                  </div>
                )}

                <div className="p-5 sm:p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-900">
                      Event
                    </span>

                    {event.pinned && (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800">
                        Featured
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-gray-900">
                    {event.title}
                  </h2>

                  {event.createdAt && (
                    <div className="mt-3 flex items-center gap-2 text-sm font-medium text-purple-800">
                      <CalendarDays size={16} />
                      {formatDate(event.createdAt)}
                    </div>
                  )}

                  <div className="mt-4 flex items-start gap-2 text-sm text-gray-500">
                    <MapPin size={16} className="mt-0.5 shrink-0" />

                    <span>
                      See the event announcement for venue and additional
                      details.
                    </span>
                  </div>

                  <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-600">
                    {event.message}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </MemberPortalLayout>
  );
};

export default Events;
