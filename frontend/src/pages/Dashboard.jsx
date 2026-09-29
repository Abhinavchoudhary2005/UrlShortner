import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const [shortUrl, setShortUrl] = useState("");
  const [shortCode, setShortCode] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const createShortUrl = async (e) => {
    e.preventDefault();

    setError("");
    setShortUrl("");
    setShortCode("");
    setLoading(true);

    try {
      const response = await api.post("/api/urls", {
        originalUrl,
        customAlias: customAlias || null,
        expiresAt: expiresAt || null,
      });

      const data = response.data;

      console.log("Created URL:", data);

      setShortCode(data.shortCode);

      setShortUrl(
        `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/${data.shortCode}`,
      );

      setOriginalUrl("");
      setCustomAlias("");
      setExpiresAt("");
    } catch (error) {
      console.error("Create URL error:", error);

      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      setError(error.response?.data || "Could not create short URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Shorten Your URL</h1>

          <p className="text-gray-500 mb-8">
            Create short, trackable links in seconds.
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {shortUrl && (
            <div className="bg-green-100 border border-green-300 p-5 rounded-lg mb-6">
              <p className="font-semibold text-green-800 mb-2">
                Your short URL:
              </p>

              <input
                value={shortUrl}
                readOnly
                className="w-full bg-white border rounded-lg px-4 py-2"
              />

              <div className="flex flex-wrap gap-3 mt-4">
                {/* COPY */}
                <button
                  onClick={() => navigator.clipboard.writeText(shortUrl)}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                >
                  Copy
                </button>

                {/* OPEN SHORT URL */}
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800"
                >
                  Open URL
                </a>

                {/* ANALYTICS */}
                <button
                  onClick={() => {
                    console.log("Opening analytics for:", shortCode);

                    navigate(`/analytics/${shortCode}`);
                  }}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                  View Analytics
                </button>
              </div>
            </div>
          )}

          <form onSubmit={createShortUrl} className="space-y-6">
            <div>
              <label className="block font-medium mb-2">Original URL</label>

              <input
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com"
                required
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Custom Alias
                <span className="text-gray-400 font-normal"> (optional)</span>
              </label>

              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="my-link"
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Expiration
                <span className="text-gray-400 font-normal"> (optional)</span>
              </label>

              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Short URL"}
            </button>
          </form>
        </div>

        {/* QUICK ACCESS */}

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <button
            onClick={() => navigate("/my-urls")}
            className="bg-white shadow rounded-xl p-6 text-left hover:shadow-lg"
          >
            <h2 className="text-xl font-bold">My URLs</h2>

            <p className="text-gray-500 mt-2">
              View and manage your shortened URLs.
            </p>
          </button>

          <button
            onClick={() => navigate("/my-urls")}
            className="bg-white shadow rounded-xl p-6 text-left hover:shadow-lg"
          >
            <h2 className="text-xl font-bold">Analytics</h2>

            <p className="text-gray-500 mt-2">
              Track clicks and visitors from your URLs.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
