import {
  LayoutDashboard,
  Users,
  UserCheck,
  UserX,
  Clock3,
  Mail,
  Megaphone,
  Settings,
  LogOut,
  BookOpen,
} from "lucide-react";

interface SidebarProps {
  active: string;
  setActive: (value: string) => void;
}

const menu = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Members", icon: Users },
  { name: "Pending Applications", icon: Clock3 },
  { name: "Approved Members", icon: UserCheck },
  { name: "Rejected Members", icon: UserX },

  // NEW
  { name: "Blog CMS", icon: BookOpen },

  { name: "Email Center", icon: Mail },
  { name: "Announcements", icon: Megaphone },
  { name: "Settings", icon: Settings },
];

const Sidebar = ({ active, setActive }: SidebarProps) => {
  return (
    <aside className="w-72 bg-purple-950 text-white flex flex-col">
      <div className="p-6 border-b border-purple-800">
        <h1 className="text-2xl font-bold text-yellow-400">AJANGBILE</h1>

        <p className="text-gray-300 mt-1">Heritage Admin</p>
      </div>

      <nav className="flex-1 p-4">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl mb-2 transition
                ${
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

      <div className="p-4 border-t border-purple-800">
        <button className="w-full flex items-center gap-3 px-4 py-4 rounded-xl hover:bg-red-600 transition">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
