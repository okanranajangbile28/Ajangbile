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

    setMember(JSON.parse(storedMember));

    fetchAnnouncements();
  }, [navigate, fetchAnnouncements]);

  const logout = () => {
    localStorage.removeItem("ogboniMember");
    localStorage.removeItem("ogboniToken");

    navigate("/login", {
      replace: true,
    });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* HERO */}

        <div className="bg-gradient-to-r from-purple-900 to-purple-700 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src={
                  member?.photo ||
                  `https://ui-avatars.com/api/?background=4c1d95&color=fff&size=256&name=${encodeURIComponent(
                    member?.fullName || "Member",
                  )}`
                }
                alt={member?.fullName}
                className="w-40 h-40 rounded-full border-4 border-yellow-400 object-cover shadow-xl"
              />

              <div>
                <h1 className="text-4xl font-bold text-yellow-400">Welcome,</h1>

                <h2 className="text-3xl font-bold mt-2">
                  Chief {member?.fullName}
                </h2>

                <p className="text-purple-100 mt-3">
                  Confederation of Ogboni Aborigine Fraternity
                </p>

                <div className="flex flex-wrap gap-3 mt-6">
                  <span className="bg-green-600 px-4 py-2 rounded-full text-sm font-bold">
                    Active Member
                  </span>

                  <span className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                    {memberTitle}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate("/ogboni-edit-profile")}
                className="bg-yellow-500 hover:bg-yellow-600 transition text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2"
              >
                <Pencil size={18} />
                Edit Profile
              </button>

              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-xl font-bold flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-purple-900 rounded-3xl p-6 shadow-xl hover:scale-[1.02] transition">
            <ShieldCheck className="text-green-400 mb-3" size={35} />

            <h3 className="text-yellow-400 font-bold text-lg">Membership</h3>

            <p className="mt-3 text-xl font-bold">Active</p>
          </div>

          <div className="bg-purple-900 rounded-3xl p-6 shadow-xl hover:scale-[1.02] transition">
            <Mail className="text-blue-400 mb-3" size={35} />

            <h3 className="text-yellow-400 font-bold text-lg">Email</h3>

            <p className="mt-3 break-all">{member?.email}</p>
          </div>

          <div className="bg-purple-900 rounded-3xl p-6 shadow-xl hover:scale-[1.02] transition">
            <Phone className="text-yellow-400 mb-3" size={35} />

            <h3 className="text-yellow-400 font-bold text-lg">Phone</h3>

            <p className="mt-3">{member?.phoneNumber}</p>
          </div>

          <div className="bg-purple-900 rounded-3xl p-6 shadow-xl hover:scale-[1.02] transition">
            <User className="text-pink-400 mb-3" size={35} />

            <h3 className="text-yellow-400 font-bold text-lg">Chief Title</h3>

            <p className="mt-3">{memberTitle}</p>
          </div>
        </div>

        {/* MAIN CONTENT */}

        <div className="grid lg:grid-cols-3 gap-8 mt-10"></div>
        {/* LEFT COLUMN */}

        <div className="lg:col-span-2 space-y-8">
          {/* QUICK ACTIONS */}

          <div className="bg-purple-900 rounded-3xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6">
              Quick Actions
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <button
                onClick={() => navigate("/ogboni-edit-profile")}
                className="bg-purple-800 hover:bg-purple-700 rounded-2xl p-6 text-left transition"
              >
                <Pencil size={35} className="text-yellow-400 mb-3" />

                <h3 className="font-bold text-xl">Edit Profile</h3>

                <p className="text-gray-300 mt-2">
                  Update your personal information.
                </p>
              </button>

              <button className="bg-purple-800 hover:bg-purple-700 rounded-2xl p-6 text-left transition">
                <Bell size={35} className="text-yellow-400 mb-3" />

                <h3 className="font-bold text-xl">Weekly Updates</h3>

                <p className="text-gray-300 mt-2">
                  View official weekly updates.
                </p>
              </button>

              <button className="bg-purple-800 hover:bg-purple-700 rounded-2xl p-6 text-left transition">
                <CalendarDays size={35} className="text-yellow-400 mb-3" />

                <h3 className="font-bold text-xl">Events</h3>

                <p className="text-gray-300 mt-2">
                  Upcoming meetings and ceremonies.
                </p>
              </button>

              <button className="bg-purple-800 hover:bg-purple-700 rounded-2xl p-6 text-left transition">
                <User size={35} className="text-yellow-400 mb-3" />

                <h3 className="font-bold text-xl">Member Directory</h3>

                <p className="text-gray-300 mt-2">Coming Soon.</p>
              </button>
            </div>
          </div>

          {/* ANNOUNCEMENTS */}

          <div className="bg-purple-900 rounded-3xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6">
              Announcements
            </h2>

            {announcements
              .filter(
                (item) =>
                  item.category === "Announcement" && item.active !== false,
              )
              .map((item) => (
                <div
                  key={item._id}
                  className="bg-purple-800 rounded-2xl overflow-hidden mb-6"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-64 object-cover"
                    />
                  )}

                  <div className="p-6">
                    {item.pinned && (
                      <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                        📌 PINNED
                      </span>
                    )}

                    <h3 className="text-2xl font-bold mt-4">{item.title}</h3>

                    <p className="mt-4 whitespace-pre-wrap leading-7">
                      {item.message}
                    </p>

                    {item.createdAt && (
                      <p className="text-sm text-gray-300 mt-4">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}

            {announcements.filter(
              (item) =>
                item.category === "Announcement" && item.active !== false,
            ).length === 0 && (
              <div className="bg-purple-800 rounded-2xl p-6">
                <p className="text-xl font-bold">No Announcements Yet</p>

                <p className="text-gray-300 mt-3">
                  Official announcements from Ajangbile Heritage will appear
                  here.
                </p>
              </div>
            )}
          </div>
          {/* WEEKLY UPDATES */}

          <div className="bg-purple-900 rounded-3xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6">
              Weekly Updates
            </h2>

            {announcements
              .filter(
                (item) =>
                  item.category === "Weekly Update" && item.active !== false,
              )
              .map((item) => (
                <div
                  key={item._id}
                  className="bg-purple-800 rounded-2xl overflow-hidden mb-6"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-64 object-cover"
                    />
                  )}

                  <div className="p-6">
                    {item.pinned && (
                      <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                        📌 PINNED
                      </span>
                    )}

                    <h3 className="text-2xl font-bold mt-4">{item.title}</h3>

                    <p className="mt-4 whitespace-pre-wrap leading-7">
                      {item.message}
                    </p>

                    {item.createdAt && (
                      <p className="text-sm text-gray-300 mt-4">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}

            {announcements.filter(
              (item) =>
                item.category === "Weekly Update" && item.active !== false,
            ).length === 0 && (
              <div className="bg-purple-800 rounded-2xl p-6">
                <p className="text-xl font-bold">No Weekly Updates Yet</p>

                <p className="text-gray-300 mt-3">
                  Weekly updates from the Grand Council will appear here
                  automatically.
                </p>
              </div>
            )}
          </div>
        </div>
        {/* RIGHT COLUMN */}

        <div className="space-y-8">
          {/* UPCOMING EVENTS */}

          <div className="bg-purple-900 rounded-3xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6">
              Upcoming Events
            </h2>

            {announcements
              .filter(
                (item) => item.category === "Event" && item.active !== false,
              )
              .map((item) => (
                <div
                  key={item._id}
                  className="bg-purple-800 rounded-2xl overflow-hidden mb-6"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-56 object-cover"
                    />
                  )}

                  <div className="p-6">
                    {item.pinned && (
                      <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                        📌 PINNED
                      </span>
                    )}

                    <h3 className="text-2xl font-bold mt-4">{item.title}</h3>

                    <p className="mt-4 whitespace-pre-wrap leading-7">
                      {item.message}
                    </p>

                    {item.createdAt && (
                      <p className="text-sm text-gray-300 mt-4">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}

            {announcements.filter(
              (item) => item.category === "Event" && item.active !== false,
            ).length === 0 && (
              <div className="bg-purple-800 rounded-2xl p-6">
                <p className="text-xl font-bold">No Events Scheduled</p>

                <p className="text-gray-300 mt-3">
                  Meetings, festivals, ceremonies and official gatherings will
                  appear here.
                </p>
              </div>
            )}
          </div>

          {/* MEMBER INFORMATION */}
          {/* MEMBER INFORMATION */}

          <div className="bg-purple-900 rounded-3xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6">
              Member Information
            </h2>

            <div className="space-y-4">
              <p>
                <strong>Name:</strong> {member?.fullName}
              </p>

              <p>
                <strong>Username:</strong> {member?.username}
              </p>

              <p>
                <strong>Email:</strong> {member?.email}
              </p>

              <p>
                <strong>Phone:</strong> {member?.phoneNumber}
              </p>

              <p>
                <strong>Gender:</strong> {member?.gender}
              </p>

              <p>
                <strong>Occupation:</strong> {member?.occupation}
              </p>

              <p>
                <strong>Chief Title:</strong> {memberTitle}
              </p>

              <p>
                <strong>State:</strong> {member?.state}
              </p>

              <p>
                <strong>L.G.A:</strong> {member?.lga}
              </p>

              <p>
                <strong>City:</strong> {member?.city}
              </p>

              <div>
                <strong>Address</strong>

                <div className="mt-2 bg-purple-800 rounded-xl p-4">
                  {member?.address || "-"}
                </div>
              </div>
            </div>
          </div>

          {/* MEMBER STATUS */}
          {/* MEMBER STATUS */}

          <div className="bg-purple-900 rounded-3xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6">
              Membership Status
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-purple-700 pb-3">
                <span>Status</span>

                <span className="bg-green-600 px-4 py-1 rounded-full font-bold">
                  Active
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-purple-700 pb-3">
                <span>Rank</span>

                <span>{memberTitle}</span>
              </div>

              <div className="flex justify-between items-center border-b border-purple-700 pb-3">
                <span>Username</span>

                <span>{member?.username}</span>
              </div>

              <div className="flex justify-between items-center border-b border-purple-700 pb-3">
                <span>Email</span>

                <span className="text-right break-all">{member?.email}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Phone</span>

                <span>{member?.phoneNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OgboniDashboard;
