const DashboardHome = () => {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-gray-500">Pending Applications</h3>
          <p className="text-4xl font-bold mt-4 text-yellow-500">0</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-gray-500">Approved Members</h3>
          <p className="text-4xl font-bold mt-4 text-green-600">0</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-gray-500">Rejected Members</h3>
          <p className="text-4xl font-bold mt-4 text-red-600">0</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-gray-500">Total Members</h3>
          <p className="text-4xl font-bold mt-4 text-purple-900">0</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow mt-8 p-8">
        <h2 className="text-2xl font-bold text-purple-900">
          Welcome Administrator
        </h2>

        <p className="mt-3 text-gray-600">
          Select an option from the sidebar to manage members, approvals,
          announcements and emails.
        </p>
      </div>
    </div>
  );
};

export default DashboardHome;
