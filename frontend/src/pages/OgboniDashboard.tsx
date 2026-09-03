import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  User,
  Bell,
  CalendarDays,
  Pencil,
  LogOut,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  ChevronRight,
  Pin,
  Clock3,
} from "lucide-react";

interface Member {
  _id?: string;
  username?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  occupation?: string;
  chiefTitle?: string;
  ChiefTitle?: string;
  chieftaincyTitle?: string;
  state?: string;
  lga?: string;
  city?: string;
  address?: string;
  photo?: string;
}

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

const OgboniDashboard = () => {
  const navigate = useNavigate();

  const [member, setMember] = useState<Member | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const memberTitle =
    member?.chiefTitle ||
    member?.ChiefTitle ||
    member?.chieftaincyTitle ||
    "Not Assigned";

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/announcements`,
      );

      setAnnouncements(
        Array.isArray(res.data.announcements) ? res.data.announcements : [],
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const storedMember = localStorage.getItem("ogboniMember");

    if (!storedMember) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setMember(JSON.parse(storedMember));
    } catch (error) {
      console.error("Unable to load member information:", error);
      localStorage.removeItem("ogboniMember");
      localStorage.removeItem("ogboniToken");
      navigate("/login", { replace: true });
      return;
    }

    fetchAnnouncements();
  }, [navigate, fetchAnnouncements]);

  const logout = () => {
    localStorage.removeItem("ogboniMember");
    localStorage.removeItem("ogboniToken");

    navigate("/login", {
      replace: true,
    });
  };

  const activeAnnouncements = announcements.filter(
    (item) => item.category === "Announcement" && item.active !== false,
  );

  const weeklyUpdates = announcements.filter(
    (item) => item.category === "Weekly Update" && item.active !== false,
  );

  const upcomingEvents = announcements.filter(
    (item) => item.category === "Event" && item.active !== false,
  );

  const formatDate = (date?: string) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const displayName = member?.fullName || "Member";

  return (
    <div className="min-h-screen bg-[#f6f7f9] text-gray-900">
      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-[#4b0082] uppercase">
                Member Portal
              </p>

              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mt-1">
                Confederation of Ogboni Aborigine Fraternity
              </h1>
            </div>

            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-base font-medium hover:bg-gray-50 transition"
            >
              <LogOut size={18} strokeWidth={1.8} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-8">
        {/* =====================================================
            MEMBER HEADER
        ===================================================== */}

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <img
                  src={
                    member?.photo ||
                    `https://ui-avatars.com/api/?background=4b0082&color=fff&size=256&name=${encodeURIComponent(
                      displayName,
                    )}`
                  }
                  alt={displayName}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border border-gray-200"
                />

                <div>
                  <p className="text-base text-gray-500 mb-1">Welcome back</p>

                  <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
                    {displayName}
                  </h2>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                    <span className="text-lg md:text-xl font-bold text-[#4b0082]">
                      {memberTitle}
                    </span>

                    <span className="hidden sm:block text-gray-300">•</span>

                    <span className="text-base text-gray-500">
                      Member Account
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/ogboni-edit-profile")}
                className="inline-flex items-center justify-center gap-2 bg-[#4b0082] hover:bg-[#3b0068] text-white px-5 py-2.5 rounded-lg text-base font-medium transition"
              >
                <Pencil size={17} strokeWidth={1.8} />
                Edit Profile
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            ACCOUNT SUMMARY
        ===================================================== */}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Membership */}

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <ShieldCheck
                  size={19}
                  className="text-[#4b0082]"
                  strokeWidth={1.8}
                />
              </div>

              <span className="text-sm font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-md">
                Active
              </span>
            </div>

            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Membership
            </p>

            <p className="text-lg font-semibold text-gray-900 mt-1">
              Active Member
            </p>
          </div>

          {/* Email */}

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
              <Mail size={19} className="text-gray-600" strokeWidth={1.8} />
            </div>

            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Email
            </p>

            <p className="text-base font-medium text-gray-900 mt-1 break-all">
              {member?.email || "-"}
            </p>
          </div>

          {/* Phone */}

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
              <Phone size={19} className="text-gray-600" strokeWidth={1.8} />
            </div>

            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Phone
            </p>

            <p className="text-base font-medium text-gray-900 mt-1">
              {member?.phoneNumber || "-"}
            </p>
          </div>

          {/* Title */}

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
              <User size={19} className="text-gray-600" strokeWidth={1.8} />
            </div>

            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Title
            </p>

            <p className="text-base font-medium text-gray-900 mt-1">
              {memberTitle}
            </p>
          </div>
        </section>

        {/* =====================================================
            MAIN DASHBOARD
        ===================================================== */}

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* ===================================================
              LEFT / MAIN COLUMN
          =================================================== */}

          <div className="lg:col-span-2 space-y-6">
            {/* QUICK ACTIONS */}

            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">
                  Quick Actions
                </h2>

                <p className="text-base text-gray-500 mt-1">
                  Access your member services and information.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-px bg-gray-100">
                {/* Edit Profile */}

                <button
                  onClick={() => navigate("/ogboni-edit-profile")}
                  className="bg-white p-6 text-left hover:bg-gray-50 transition group"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                      <Pencil
                        size={18}
                        className="text-[#4b0082]"
                        strokeWidth={1.8}
                      />
                    </div>

                    <ChevronRight
                      size={18}
                      className="text-gray-300 group-hover:text-gray-500 transition"
                    />
                  </div>

                  <h3 className="text-base font-semibold text-gray-900 mt-5">
                    Edit Profile
                  </h3>

                  <p className="text-base text-gray-500 mt-1">
                    Update your personal information.
                  </p>
                </button>

                {/* Weekly Updates */}

                <button className="bg-white p-6 text-left hover:bg-gray-50 transition group">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Bell
                        size={18}
                        className="text-gray-600"
                        strokeWidth={1.8}
                      />
                    </div>

                    <ChevronRight
                      size={18}
                      className="text-gray-300 group-hover:text-gray-500 transition"
                    />
                  </div>

                  <h3 className="text-base font-semibold text-gray-900 mt-5">
                    Weekly Updates
                  </h3>

                  <p className="text-base text-gray-500 mt-1">
                    View official weekly updates.
                  </p>
                </button>

                {/* Events */}

                <button className="bg-white p-6 text-left hover:bg-gray-50 transition group">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <CalendarDays
                        size={18}
                        className="text-gray-600"
                        strokeWidth={1.8}
                      />
                    </div>

                    <ChevronRight
                      size={18}
                      className="text-gray-300 group-hover:text-gray-500 transition"
                    />
                  </div>

                  <h3 className="text-base font-semibold text-gray-900 mt-5">
                    Events
                  </h3>

                  <p className="text-base text-gray-500 mt-1">
                    View upcoming meetings and ceremonies.
                  </p>
                </button>

                {/* Directory */}

                <button className="bg-white p-6 text-left hover:bg-gray-50 transition group">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <User
                        size={18}
                        className="text-gray-600"
                        strokeWidth={1.8}
                      />
                    </div>

                    <ChevronRight
                      size={18}
                      className="text-gray-300 group-hover:text-gray-500 transition"
                    />
                  </div>

                  <h3 className="text-base font-semibold text-gray-900 mt-5">
                    Member Directory
                  </h3>

                  <p className="text-base text-gray-500 mt-1">
                    Member directory access coming soon.
                  </p>
                </button>
              </div>
            </section>

            {/* =================================================
                ANNOUNCEMENTS
            ================================================= */}

            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Announcements
                  </h2>

                  <p className="text-base text-gray-500 mt-1">
                    Official communications from the fraternity.
                  </p>
                </div>

                <Bell size={19} className="text-gray-400" strokeWidth={1.8} />
              </div>

              <div className="p-6">
                {activeAnnouncements.length > 0 ? (
                  <div className="space-y-5">
                    {activeAnnouncements.map((item) => (
                      <article
                        key={item._id}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-56 object-cover"
                          />
                        )}

                        <div className="p-5">
                          <div className="flex flex-wrap items-center gap-2">
                            {item.pinned && (
                              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4b0082] bg-purple-50 px-2.5 py-1 rounded-md">
                                <Pin size={13} strokeWidth={2} />
                                Pinned
                              </span>
                            )}

                            {item.createdAt && (
                              <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                                <Clock3 size={13} strokeWidth={1.8} />
                                {formatDate(item.createdAt)}
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl font-semibold text-gray-900 mt-3">
                            {item.title}
                          </h3>

                          <p className="text-base text-gray-600 mt-3 whitespace-pre-wrap leading-7">
                            {item.message}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center">
                    <Bell
                      size={24}
                      className="mx-auto text-gray-400"
                      strokeWidth={1.6}
                    />

                    <p className="text-base font-medium text-gray-900 mt-3">
                      No announcements yet
                    </p>

                    <p className="text-base text-gray-500 mt-1">
                      Official announcements will appear here.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* =================================================
                WEEKLY UPDATES
            ================================================= */}

            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Weekly Updates
                  </h2>

                  <p className="text-base text-gray-500 mt-1">
                    Regular communications from the Grand Council.
                  </p>
                </div>

                <Bell size={19} className="text-gray-400" strokeWidth={1.8} />
              </div>

              <div className="p-6">
                {weeklyUpdates.length > 0 ? (
                  <div className="space-y-5">
                    {weeklyUpdates.map((item) => (
                      <article
                        key={item._id}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-56 object-cover"
                          />
                        )}

                        <div className="p-5">
                          <div className="flex flex-wrap items-center gap-2">
                            {item.pinned && (
                              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4b0082] bg-purple-50 px-2.5 py-1 rounded-md">
                                <Pin size={13} strokeWidth={2} />
                                Pinned
                              </span>
                            )}

                            {item.createdAt && (
                              <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                                <Clock3 size={13} strokeWidth={1.8} />
                                {formatDate(item.createdAt)}
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl font-semibold text-gray-900 mt-3">
                            {item.title}
                          </h3>

                          <p className="text-base text-gray-600 mt-3 whitespace-pre-wrap leading-7">
                            {item.message}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center">
                    <Bell
                      size={24}
                      className="mx-auto text-gray-400"
                      strokeWidth={1.6}
                    />

                    <p className="text-base font-medium text-gray-900 mt-3">
                      No weekly updates yet
                    </p>

                    <p className="text-base text-gray-500 mt-1">
                      Weekly updates from the Grand Council will appear here.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* ===================================================
              RIGHT COLUMN
          =================================================== */}

          <div className="space-y-6">
            {/* UPCOMING EVENTS */}

            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Upcoming Events
                    </h2>

                    <p className="text-base text-gray-500 mt-1">
                      Meetings and official gatherings.
                    </p>
                  </div>

                  <CalendarDays
                    size={19}
                    className="text-gray-400"
                    strokeWidth={1.8}
                  />
                </div>
              </div>

              <div className="p-6">
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-5">
                    {upcomingEvents.map((item) => (
                      <article
                        key={item._id}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-44 object-cover"
                          />
                        )}

                        <div className="p-5">
                          {item.pinned && (
                            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4b0082] bg-purple-50 px-2.5 py-1 rounded-md">
                              <Pin size={13} strokeWidth={2} />
                              Pinned
                            </span>
                          )}

                          <h3 className="text-lg font-semibold text-gray-900 mt-3">
                            {item.title}
                          </h3>

                          <p className="text-base text-gray-600 mt-2 whitespace-pre-wrap leading-7">
                            {item.message}
                          </p>

                          {item.createdAt && (
                            <p className="inline-flex items-center gap-1.5 text-sm text-gray-500 mt-4">
                              <Clock3 size={13} strokeWidth={1.8} />
                              {formatDate(item.createdAt)}
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <CalendarDays
                      size={24}
                      className="mx-auto text-gray-400"
                      strokeWidth={1.6}
                    />

                    <p className="text-base font-medium text-gray-900 mt-3">
                      No events scheduled
                    </p>

                    <p className="text-base text-gray-500 mt-1">
                      Upcoming events will appear here.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* MEMBER INFORMATION */}

            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">
                  Member Information
                </h2>

                <p className="text-base text-gray-500 mt-1">
                  Your registered member details.
                </p>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-start gap-3">
                  <User
                    size={18}
                    className="text-gray-400 mt-0.5"
                    strokeWidth={1.8}
                  />

                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-base font-medium text-gray-900 mt-1">
                      {member?.fullName || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User
                    size={18}
                    className="text-gray-400 mt-0.5"
                    strokeWidth={1.8}
                  />

                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="text-base font-medium text-gray-900 mt-1">
                      {member?.username || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail
                    size={18}
                    className="text-gray-400 mt-0.5"
                    strokeWidth={1.8}
                  />

                  <div className="min-w-0">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-base font-medium text-gray-900 mt-1 break-all">
                      {member?.email || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone
                    size={18}
                    className="text-gray-400 mt-0.5"
                    strokeWidth={1.8}
                  />

                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-base font-medium text-gray-900 mt-1">
                      {member?.phoneNumber || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BriefcaseBusiness
                    size={18}
                    className="text-gray-400 mt-0.5"
                    strokeWidth={1.8}
                  />

                  <div>
                    <p className="text-sm text-gray-500">Occupation</p>
                    <p className="text-base font-medium text-gray-900 mt-1">
                      {member?.occupation || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={18}
                    className="text-gray-400 mt-0.5"
                    strokeWidth={1.8}
                  />

                  <div>
                    <p className="text-sm text-gray-500">Chief Title</p>
                    <p className="text-base font-medium text-gray-900 mt-1">
                      {memberTitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="text-gray-400 mt-0.5"
                    strokeWidth={1.8}
                  />

                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-base font-medium text-gray-900 mt-1">
                      {[member?.city, member?.lga, member?.state]
                        .filter(Boolean)
                        .join(", ") || "-"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">Address</p>

                  <p className="text-base text-gray-700 leading-7 mt-1">
                    {member?.address || "-"}
                  </p>
                </div>
              </div>
            </section>

            {/* MEMBERSHIP STATUS */}

            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">
                  Membership Status
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <span className="text-base text-gray-500">Status</span>

                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-md">
                      <ShieldCheck size={14} strokeWidth={1.8} />
                      Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <span className="text-base text-gray-500">Rank</span>

                    <span className="text-base font-medium text-gray-900 text-right">
                      {memberTitle}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <span className="text-base text-gray-500">Username</span>

                    <span className="text-base font-medium text-gray-900 text-right">
                      {member?.username || "-"}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
                    <span className="text-base text-gray-500">Email</span>

                    <span className="text-base font-medium text-gray-900 text-right break-all">
                      {member?.email || "-"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-base text-gray-500">Phone</span>

                    <span className="text-base font-medium text-gray-900 text-right">
                      {member?.phoneNumber || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OgboniDashboard;
