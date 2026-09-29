import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function MyUrls() {
  const navigate = useNavigate();

  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [copiedCode, setCopiedCode] = useState("");

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await api.get("/api/urls/my");

        console.log("My URLs:", response.data);

        setUrls(response.data);
      } catch (error) {
        console.error("My URLs error:", error);

        if (error.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }

        setError("Could not load your URLs.");
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, [navigate]);

  const copyUrl = async (shortUrl, shortCode) => {
    try {
      await navigator.clipboard.writeText(shortUrl);

      setCopiedCode(shortCode);

      setTimeout(() => {
        setCopiedCode("");
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const getExpirationStatus = (expiresAt) => {
    if (!expiresAt) {
      return {
        text: "Never expires",
        className: "bg-green-100 text-green-700",
      };
    }

    const expirationDate = new Date(expiresAt);
    const now = new Date();

    if (expirationDate <= now) {
      return {
        text: "Expired",
        className: "bg-red-100 text-red-700",
      };
    }

    return {
      text: `Expires ${expirationDate.toLocaleString()}`,
      className: "bg-yellow-100 text-yellow-700",
    };
  };

  const filteredUrls = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return urls;
    }

    return urls.filter((url) => {
      return (
        url.originalUrl?.toLowerCase().includes(query) ||
        url.shortCode?.toLowerCase().includes(query) ||
        url.customAlias?.toLowerCase().includes(query)
      );
    });
  }, [urls, search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">
          Loading your URLs...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My URLs</h1>

            <p className="text-gray-500 mt-1">
              Manage and track your shortened links
            </p>
          </div>

          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-center"
          >
            + Create URL
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* No URLs at all */}
        {urls.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
            <div className="text-5xl mb-5">🔗</div>

            <h2 className="text-2xl font-bold text-gray-900">No URLs yet</h2>

            <p className="text-gray-500 mt-2 mb-6">
              Create your first shortened URL and start tracking clicks.
            </p>

            <Link
              to="/dashboard"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Create Your First URL
            </Link>
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by original URL, short code or alias..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xl"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                <span>
                  Showing {filteredUrls.length} of {urls.length} URLs
                </span>

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-blue-600 hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>

            {/* No search results */}
            {filteredUrls.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border p-10 text-center">
                <div className="text-4xl mb-4">🔍</div>

                <h2 className="text-xl font-semibold">No matching URLs</h2>

                <p className="text-gray-500 mt-2">
                  Try searching for a different URL or short code.
                </p>

                <button
                  onClick={() => setSearch("")}
                  className="mt-5 bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid gap-5">
                {filteredUrls.map((url) => {
                  const shortUrl = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/${url.shortCode}`;

                  const expiration = getExpirationStatus(url.expiresAt);

                  return (
                    <div
                      key={url.id}
                      className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition"
                    >
                      {/* Top section */}
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="min-w-0 flex-1">
                          {/* Original URL */}
                          <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                            Original URL
                          </p>

                          <p
                            className="font-medium text-gray-900 mt-1 break-all"
                            title={url.originalUrl}
                          >
                            {url.originalUrl}
                          </p>

                          {/* Short URL */}
                          <div className="mt-5">
                            <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                              Short URL
                            </p>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-1">
                              <a
                                href={shortUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 font-semibold hover:underline break-all"
                              >
                                {shortUrl}
                              </a>

                              <button
                                onClick={() => copyUrl(shortUrl, url.shortCode)}
                                className="shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-sm transition"
                              >
                                {copiedCode === url.shortCode
                                  ? "✓ Copied"
                                  : "Copy"}
                              </button>
                            </div>
                          </div>

                          {/* Alias */}
                          {url.customAlias && (
                            <div className="mt-4">
                              <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                                Custom Alias
                              </p>

                              <span className="inline-block mt-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                                {url.customAlias}
                              </span>
                            </div>
                          )}

                          {/* Expiration */}
                          <div className="mt-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${expiration.className}`}
                            >
                              {expiration.text}
                            </span>
                          </div>
                        </div>

                        {/* Right side */}
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[140px]">
                          {/* Click count */}
                          <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-gray-900">
                              {url.clickCount ?? 0}
                            </p>

                            <p className="text-sm text-gray-500">Clicks</p>
                          </div>

                          {/* Analytics */}
                          <button
                            onClick={() => {
                              console.log(
                                "Analytics shortCode:",
                                url.shortCode,
                              );

                              navigate(`/analytics/${url.shortCode}`);
                            }}
                            className="bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition"
                          >
                            View Analytics
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MyUrls;
