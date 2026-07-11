import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const AdminRoutes = () => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/user/me`,
          {
            withCredentials: true,
          },
        );

        const user = response.data?.data?.user;

        if (user && (user.role === "admin" || user.role === "developer")) {
          setAuthorized(true);

          localStorage.setItem("user", JSON.stringify(user));
        } else {
          setAuthorized(false);

          localStorage.removeItem("user");
        }
      } catch {
        setAuthorized(false);

        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold text-purple-900">
          Checking admin access...
        </p>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/admin-login" replace />;
  }

  return <Outlet />;
};

export default AdminRoutes;
