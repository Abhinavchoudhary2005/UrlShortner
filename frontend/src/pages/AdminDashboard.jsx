import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [urls, setUrls] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [statsResponse, usersResponse, urlsResponse] = await Promise.all([
          api.get("/api/admin/stats"),
          api.get("/api/admin/users"),
          api.get("/api/admin/urls"),
        ]);

        setStats(statsResponse.data);
        setUsers(usersResponse.data);
        setUrls(urlsResponse.data);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }

        if (error.response?.status === 403) {
          setError("You do not have admin access.");
          return;
        }

        setError("Could not load admin dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {stats && (
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-500">Total Users</p>

              <p className="text-4xl font-bold mt-2">{stats.totalUsers}</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-500">Total URLs</p>

              <p className="text-4xl font-bold mt-2">{stats.totalUrls}</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-500">Total Clicks</p>

              <p className="text-4xl font-bold mt-2">{stats.totalClicks}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow mb-8 overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Users</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">ID</th>

                  <th className="text-left p-4">Email</th>

                  <th className="text-left p-4">Role</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-4">{user.id}</td>

                    <td className="p-4">{user.email}</td>

                    <td className="p-4">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">All URLs</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">ID</th>

                  <th className="text-left p-4">Original URL</th>

                  <th className="text-left p-4">Short Code</th>

                  <th className="text-left p-4">Clicks</th>
                </tr>
              </thead>

              <tbody>
                {urls.map((url) => (
                  <tr key={url.id} className="border-t">
                    <td className="p-4">{url.id}</td>

                    <td className="p-4 max-w-md truncate">{url.originalUrl}</td>

                    <td className="p-4 font-medium">{url.shortCode}</td>

                    <td className="p-4">{url.clickCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
