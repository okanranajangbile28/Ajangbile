import { useState } from "react";

import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import DashboardHome from "./DashboardHome";

import OgboniMembers from "./OgboniMembers";
import OgboniAccountApplications from "./OgboniAccountApplications";

import PendingApplications from "./PendingApplications";
import MembershipApplications from "./MembershipApplications";
import ApprovedMembers from "./ApprovedMembers";
import RejectedMembers from "./RejectedMembers";

import AdminProductsPage from "../AdminProductsPage";

import EmailCenter from "./EmailCenter";
import Announcements from "./Announcements";
import Settings from "./Settings";
import BlogCMS from "./BlogCMS";

const AdminDashboard = () => {
  const [active, setActive] = useState("Dashboard");

  const renderContent = () => {
    switch (active) {
      case "Dashboard":
        return <DashboardHome />;

      case "Ogboni Members":
        return <OgboniMembers />;

      case "Ogboni Account Applications":
        return <OgboniAccountApplications />;

      case "Membership Applications":
        return <MembershipApplications />;

      case "Pending Applications":
        return <PendingApplications />;

      case "Approved Applicants":
        return <ApprovedMembers />;

      case "Rejected Applicants":
        return <RejectedMembers />;

      case "Products":
        return <AdminProductsPage />;

      case "Blog CMS":
        return <BlogCMS />;

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

        <div className="flex-1 overflow-y-auto bg-gray-50">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
