import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold">
          URL Shortener
        </Link>

        {token && (
          <div className="flex items-center gap-5">
            <Link to="/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>

            <Link to="/my-urls" className="hover:text-gray-300">
              My URLs
            </Link>

            {role === "ADMIN" && (
              <Link to="/admin" className="hover:text-gray-300">
                Admin
              </Link>
            )}

            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
