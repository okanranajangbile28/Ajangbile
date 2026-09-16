import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  User,
  UserRoundPen,
  CalendarDays,
  Users,
  Megaphone,
  Bell,
  BookOpen,
  Images,
  Settings,
  LogOut,
  ChevronRight,
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

interface MemberPortalLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    label: "Dashboard",
    path: "/ogboni-dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Profile",
    path: "/member-profile",
    icon: User,
  },
  {
    label: "Edit Profile",
    path: "/ogboni-edit-profile",
    icon: UserRoundPen,
  },
  {
    label: "Weekly Updates",
    path: "/weekly-updates",
    icon: Bell,
  },
  {
    label: "Events",
    path: "/events",
    icon: CalendarDays,
  },
  {
    label: "Member Directory",
    path: "/member-directory",
    icon: Users,
  },
  {
    label: "Announcements",
    path: "/announcements",
    icon: Megaphone,
  },
  {
    label: "Heritage & Learning",
    path: "/heritage-learning",
    icon: BookOpen,
  },
  {
    label: "Gallery",
    path: "/gallery",
    icon: Images,
  },
  {
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    label: "Account Settings",
    path: "/member-settings",
    icon: Settings,
  },
];

const MemberPortalLayout = ({ children }: MemberPortalLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [member, setMember] = useState<Member | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedMember = localStorage.getItem("ogboniMember");

    if (!storedMember) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsedMember = JSON.parse(storedMember);
      setMember(parsedMember);
    } catch (error) {
      console.error("Unable to read member information:", error);

      localStorage.removeItem("ogboniMember");
      localStorage.removeItem("ogboniToken");

      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("ogboniMember");
    localStorage.removeItem("ogboniToken");

    setMobileMenuOpen(false);

    navigate("/login", {
      replace: true,
    });
  };

  const getInitials = () => {
    if (!member?.fullName) {
      return "M";
    }

    return member.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
  };

  const isActive = (path: string) => {
    if (path === "/ogboni-dashboard") {
      return location.pathname === path;
    }

    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  if (!member) {
    return (
      <div className="min-h-screen bg-purple-950 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-yellow-400" />
          <p className="text-sm font-medium">Loading member portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* =========================================================
          MOBILE TOP BAR
      ========================================================= */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-purple-900/10 bg-white px-4 shadow-sm lg:hidden">
        <Link to="/ogboni-dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-900 text-sm font-bold text-yellow-400 shadow-sm">
            IA
          </div>

          <div className="leading-tight">
            <p className="text-sm font-bold text-purple-950">Iledi Ajangbile</p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">
              Member Portal
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-900 text-white shadow-sm transition hover:bg-purple-800"
          aria-label={mobileMenuOpen ? "Close member menu" : "Open member menu"}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* =========================================================
          MOBILE OVERLAY
      ========================================================= */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* =========================================================
          SIDEBAR
      ========================================================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col
          bg-purple-950 text-white shadow-2xl
          transition-transform duration-300
          lg:translate-x-0
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* BRAND */}
        <div className="border-b border-white/10 px-6 py-6">
          <Link to="/ogboni-dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400 font-bold text-purple-950 shadow-md">
              IA
            </div>

            <div>
              <h1 className="text-base font-bold">Iledi Ajangbile</h1>

              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-yellow-300">
                Member Portal
              </p>
            </div>
          </Link>
        </div>

        {/* MEMBER MINI PROFILE */}
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.fullName || "Member"}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-yellow-400/70"
              />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-400 font-bold text-purple-950 ring-2 ring-yellow-400/30">
                {getInitials()}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {member.fullName || "Member"}
              </p>

              <p className="truncate text-xs text-purple-200">
                {member.email || "Member Account"}
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-purple-300">
            Member Area
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    group flex items-center gap-3 rounded-xl px-3 py-3
                    text-sm font-medium transition-all
                    ${
                      active
                        ? "bg-yellow-400 text-purple-950 shadow-md"
                        : "text-purple-100 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <Icon
                    size={18}
                    className={
                      active
                        ? "text-purple-950"
                        : "text-purple-300 group-hover:text-yellow-300"
                    }
                  />

                  <span className="flex-1">{item.label}</span>

                  {active && <ChevronRight size={16} />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* LOGOUT */}
        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/10 hover:text-red-100"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =========================================================
          DESKTOP MAIN CONTENT
      ========================================================= */}
      <main className="min-h-screen lg:ml-[280px]">
        {/* Desktop top bar */}
        <div className="hidden h-16 items-center justify-between border-b border-gray-200 bg-white px-8 lg:flex">
          <div>
            <p className="text-sm font-medium text-gray-500">Member Portal</p>

            <h2 className="text-lg font-bold text-purple-950">
              Welcome, {member.fullName?.split(" ")[0] || "Member"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.fullName || "Member"}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-900 text-xs font-bold text-yellow-400">
                {getInitials()}
              </div>
            )}

            <div className="hidden xl:block">
              <p className="text-sm font-semibold text-gray-800">
                {member.fullName || "Member"}
              </p>

              <p className="text-xs text-gray-500">Active Member</p>
            </div>
          </div>
        </div>

        {/* Mobile spacing for fixed header */}
        <div className="h-16 lg:hidden" />

        {/* PAGE CONTENT */}
        <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
};

export default MemberPortalLayout;
