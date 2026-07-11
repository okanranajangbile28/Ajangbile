const DashboardHome = () => {
  return (
    <div className="p-8">
      <div className="bg-white rounded-2xl shadow p-8">
        <h2 className="text-3xl font-bold text-purple-900">
          Welcome Administrator
        </h2>

        <p className="mt-4 text-gray-600 text-lg">
          Select an option from the sidebar to manage members, approvals,
          announcements and emails.
        </p>
      </div>
    </div>
  );
};

export default DashboardHome;
