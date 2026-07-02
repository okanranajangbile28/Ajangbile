import { useState } from "react";

import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import DashboardHome from "./DashboardHome";

import PendingApplications from "./PendingApplications";
import ApprovedMembers from "./ApprovedMembers";
import RejectedMembers from "./RejectedMembers";
import EmailCenter from "./EmailCenter";
import Announcements from "./Announcements";
import Settings from "./Settings";

const AdminDashboard = () => {
  const [active, setActive] = useState("Dashboard");

  const renderContent = () => {
    switch (active) {
      case "Dashboard":
        return <DashboardHome />;

      case "Members":
        return (
          <div className="p-8 text-xl font-semibold">
            Members Page (Coming Next)
          </div>
        );

      case "Pending Applications":
        return <PendingApplications />;

      case "Approved Members":
        return <ApprovedMembers />;

      case "Rejected Members":
        return <RejectedMembers />;

      case "Email Center":
        return <EmailCenter />;

      case "Announcements":
        return <Announcements />;

      case "Settings":
        return <Settings />;

      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar active={active} setActive={setActive} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar title={active} />

        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
