import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  BriefcaseBusiness,
  MapPin,
  ShieldCheck,
  Pencil,
  MapPinned,
} from "lucide-react";

import MemberPortalLayout from "../components/member/MemberPortalLayout";

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

const MemberProfile = () => {
  const navigate = useNavigate();

  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const storedMember = localStorage.getItem("ogboniMember");

    if (!storedMember) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setMember(JSON.parse(storedMember));
    } catch (error) {
      console.error("Unable to load member profile:", error);

      localStorage.removeItem("ogboniMember");
      localStorage.removeItem("ogboniToken");

      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const memberTitle =
    member?.chiefTitle ||
    member?.ChiefTitle ||
    member?.chieftaincyTitle ||
    "Not Assigned";

  const displayName = member?.fullName || "Member";

  const getInitials = () => {
    if (!displayName) return "M";

    return displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
  };

  if (!member) {
    return (
      <div className="min-h-screen bg-purple-950 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-yellow-400" />
          <p className="text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <MemberPortalLayout>
      <div className="mx-auto w-full max-w-5xl">
        {/* HEADER */}

        <div className="mb-8">
          <Link
            to="/ogboni-dashboard"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-purple-900 hover:text-purple-700"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-900">
              Member Profile
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              View your registered member information and account details.
            </p>
          </div>
        </div>

        {/* PROFILE HEADER */}

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="h-28 bg-purple-950 sm:h-36" />

          <div className="px-5 pb-6 sm:px-8 sm:pb-8">
            <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={displayName}
                    className="h-28 w-28 rounded-2xl border-4 border-white object-cover shadow-md sm:h-32 sm:w-32"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white bg-yellow-400 text-3xl font-bold text-purple-950 shadow-md sm:h-32 sm:w-32">
                    {getInitials()}
                  </div>
                )}

                <div className="pb-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {displayName}
                  </h2>

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-purple-900">
                      {memberTitle}
                    </span>

                    <span className="hidden text-gray-300 sm:inline">•</span>

                    <span className="text-sm text-gray-500">Active Member</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/ogboni-edit-profile")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-900"
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            </div>
          </div>
        </section>

        {/* ACCOUNT INFORMATION */}

        <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="border-b border-gray-100 px-5 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                <User size={19} className="text-purple-900" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Personal Information
                </h2>

                <p className="text-sm text-gray-500">
                  Your registered personal details.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-0 sm:grid-cols-2">
            {/* Full Name */}

            <div className="border-b border-gray-100 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <User size={18} className="mt-0.5 text-gray-400" />

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Full Name
                  </p>

                  <p className="mt-1 break-words text-base font-semibold text-gray-900">
                    {member.fullName || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Username */}

            <div className="border-b border-gray-100 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="mt-0.5 text-gray-400" />

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Username
                  </p>

                  <p className="mt-1 break-words text-base font-semibold text-gray-900">
                    {member.username || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Gender */}

            <div className="border-b border-gray-100 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <User size={18} className="mt-0.5 text-gray-400" />

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Gender
                  </p>

                  <p className="mt-1 break-words text-base font-semibold text-gray-900">
                    {member.gender || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Occupation */}

            <div className="border-b border-gray-100 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <BriefcaseBusiness size={18} className="mt-0.5 text-gray-400" />

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Occupation
                  </p>

                  <p className="mt-1 break-words text-base font-semibold text-gray-900">
                    {member.occupation || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}

            <div className="border-b border-gray-100 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 text-gray-400" />

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </p>

                  <p className="mt-1 break-all text-base font-semibold text-gray-900">
                    {member.email || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}

            <div className="border-b border-gray-100 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 text-gray-400" />

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Phone Number
                  </p>

                  <p className="mt-1 break-words text-base font-semibold text-gray-900">
                    {member.phoneNumber || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MEMBERSHIP INFORMATION */}

        <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="border-b border-gray-100 px-5 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100">
                <ShieldCheck size={19} className="text-yellow-700" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Membership Information
                </h2>

                <p className="text-sm text-gray-500">
                  Your membership status and title.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-0 sm:grid-cols-2">
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Membership Status
              </p>

              <div className="mt-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Active Member
                </span>
              </div>
            </div>

            <div className="border-b border-gray-100 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Chief Title
              </p>

              <p className="mt-2 text-base font-semibold text-gray-900">
                {memberTitle}
              </p>
            </div>
          </div>
        </section>

        {/* LOCATION */}

        <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="border-b border-gray-100 px-5 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                <MapPinned size={19} className="text-gray-600" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Location & Address
                </h2>

                <p className="text-sm text-gray-500">
                  Your registered location information.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-0 sm:grid-cols-3">
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                City
              </p>

              <p className="mt-2 text-base font-semibold text-gray-900">
                {member.city || "-"}
              </p>
            </div>

            <div className="border-b border-gray-100 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                LGA
              </p>

              <p className="mt-2 text-base font-semibold text-gray-900">
                {member.lga || "-"}
              </p>
            </div>

            <div className="border-b border-gray-100 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                State
              </p>

              <p className="mt-2 text-base font-semibold text-gray-900">
                {member.state || "-"}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 text-gray-400" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Address
                </p>

                <p className="mt-2 text-base leading-7 text-gray-700">
                  {member.address || "-"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM ACTION */}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/ogboni-edit-profile")}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-900"
          >
            <Pencil size={16} />
            Update My Profile
          </button>
        </div>
      </div>
    </MemberPortalLayout>
  );
};

export default MemberProfile;
