import {
  LayoutDashboard,
  Users,
  FileUser,
  Clock3,
  UserCheck,
  UserX,
  Mail,
  BookOpen,
  LogOut,
} from "lucide-react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  active: string;
  setActive: (value: string) => void;
}

const menu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Ogboni Members",
    icon: Users,
  },
  {
    name: "Ogboni Account Applications",
    icon: FileUser,
  },
  {
    name: "Membership Applications",
    icon: FileUser,
  },
  {
    name: "Pending Applications",
    icon: Clock3,
  },
  {
    name: "Approved Applicants",
    icon: UserCheck,
  },
  {
    name: "Rejected Applicants",
    icon: UserX,
  },
  {
    name: "Blog CMS",
    icon: BookOpen,
  },
  {
    name: "Email Center",
    icon: Mail,
  },
];

const Sidebar = ({ active, setActive }: SidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/user/logout`, {
        withCredentials: true,
      });

      localStorage.removeItem("user");

      navigate("/admin-login", {
        replace: true,
      });
    } catch {
      localStorage.removeItem("user");

      navigate("/admin-login", {
        replace: true,
      });
    }
  };

  return (
    <aside className="w-72 h-screen bg-purple-950 text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-purple-800">
        <h1 className="text-2xl font-bold text-yellow-400">AJANGBILE</h1>

        <p className="text-gray-300 mt-1">Heritage Admin</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <button
              type="button"
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl mb-2 transition ${
                active === item.name
                  ? "bg-yellow-500 text-purple-950 font-bold"
                  : "hover:bg-purple-900"
              }`}
            >
              <Icon size={20} />

              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-purple-800">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-xl hover:bg-red-600 transition"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
