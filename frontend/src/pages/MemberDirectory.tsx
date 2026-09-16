import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  User,
  MapPin,
  BriefcaseBusiness,
  Crown,
  Users,
} from "lucide-react";

import MemberPortalLayout from "../components/member/MemberPortalLayout";

interface Member {
  _id?: string;
  username?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  occupation?: string;
  chiefTitle?: string;
  ChiefTitle?: string;
  chieftaincyTitle?: string;
  city?: string;
  state?: string;
  lga?: string;
  photo?: string;
}

const MemberDirectory = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/ogboni/directory`,
        );

        if (!response.ok) {
          throw new Error("Unable to load member directory");
        }

        const data = await response.json();

        const directoryMembers = Array.isArray(data)
          ? data
          : Array.isArray(data.members)
            ? data.members
            : [];

        setMembers(directoryMembers);
      } catch (error) {
        console.error("Member directory error:", error);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return members;
    }

    return members.filter((member) => {
      const chieftaincyTitle =
        member.chieftaincyTitle || member.chiefTitle || member.ChiefTitle || "";

      const searchableText = [
        member.fullName,
        member.username,
        chieftaincyTitle,
        member.occupation,
        member.city,
        member.state,
        member.lga,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [members, search]);

  return (
    <MemberPortalLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/ogboni-dashboard"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-purple-900 hover:text-purple-700"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-900">
                <Users size={14} />
                Member Directory
              </div>

              <h1 className="text-3xl font-bold text-purple-950 sm:text-4xl">
                Member Directory
              </h1>

              <p className="mt-3 max-w-2xl text-gray-600">
                Search and discover fellow members by name, chieftaincy title,
                occupation, or location.
              </p>
            </div>

            <div className="text-sm font-medium text-gray-500">
              {members.length} member{members.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, chieftaincy title, occupation, city or state..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-sm text-gray-800 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100"
            />
          </div>

          {search.trim() && (
            <p className="mt-3 text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-purple-900">
                {filteredMembers.length}
              </span>{" "}
              result{filteredMembers.length === 1 ? "" : "s"} for "
              <span className="font-semibold text-gray-700">{search}</span>"
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-white">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-900" />
              <p className="text-sm font-medium text-gray-500">
                Loading member directory...
              </p>
            </div>
          </div>
        )}

        {/* Empty directory */}
        {!loading && members.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-900">
              <Users size={28} />
            </div>

            <h2 className="text-xl font-bold text-purple-950">
              Member directory is being prepared
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500">
              Directory information will appear here once the member directory
              service is connected.
            </p>
          </div>
        )}

        {/* No search results */}
        {!loading && members.length > 0 && filteredMembers.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-900">
              <Search size={28} />
            </div>

            <h2 className="text-xl font-bold text-purple-950">
              No members found
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500">
              No member matches "
              <span className="font-semibold text-gray-700">{search}</span>
              ". Try searching by another name or chieftaincy title.
            </p>
          </div>
        )}

        {/* Members */}
        {!loading && filteredMembers.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredMembers.map((member) => {
              const chieftaincyTitle =
                member.chieftaincyTitle ||
                member.chiefTitle ||
                member.ChiefTitle;

              return (
                <div
                  key={member._id || member.username || member.fullName}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="h-2 bg-purple-900" />

                  <div className="p-6">
                    {/* Profile */}
                    <div className="flex items-center gap-4">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.fullName || "Member"}
                          className="h-16 w-16 rounded-full object-cover ring-2 ring-purple-100"
                        />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xl font-bold text-purple-900">
                          {(member.fullName || "M")
                            .split(" ")
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((name) => name.charAt(0).toUpperCase())
                            .join("")}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-bold text-gray-900">
                          {member.fullName || "Member"}
                        </h2>

                        {chieftaincyTitle && (
                          <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-purple-800">
                            <Crown size={14} />
                            <span className="truncate">{chieftaincyTitle}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Information */}
                    <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">
                      {member.occupation && (
                        <div className="flex items-start gap-3 text-sm text-gray-600">
                          <BriefcaseBusiness
                            size={16}
                            className="mt-0.5 shrink-0 text-purple-700"
                          />
                          <span>{member.occupation}</span>
                        </div>
                      )}

                      {(member.city || member.state || member.lga) && (
                        <div className="flex items-start gap-3 text-sm text-gray-600">
                          <MapPin
                            size={16}
                            className="mt-0.5 shrink-0 text-purple-700"
                          />

                          <span>
                            {[member.city, member.lga, member.state]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Profile button */}
                    <div className="mt-6">
                      <button
                        type="button"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-800"
                      >
                        <User size={16} />
                        View Member
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MemberPortalLayout>
  );
};

export default MemberDirectory;
