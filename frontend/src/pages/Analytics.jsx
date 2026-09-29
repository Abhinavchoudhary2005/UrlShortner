import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function Analytics() {
  const { shortCode } = useParams();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [clicks, setClicks] = useState([]);
  const [urlInfo, setUrlInfo] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const shortUrl = `${
    import.meta.env.VITE_API_URL || "http://localhost:8080"
  }/${shortCode}`;

  useEffect(() => {
    let cancelled = false;

    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const [urlResponse, clicksResponse] = await Promise.all([
          api.get(`/api/urls/info/${shortCode}`),
          api.get(`/api/urls/analytics/${shortCode}`),
        ]);

        if (cancelled) return;

        setUrlInfo(urlResponse.data);
        setClicks(clicksResponse.data);

        try {
          const summaryResponse = await api.get(
            `/api/urls/analytics/${shortCode}/summary`,
          );

          if (!cancelled) {
            setSummary(summaryResponse.data);
          }
        } catch (summaryError) {
          if (summaryError.response?.status === 404) {
            if (!cancelled) {
              setSummary({
                totalClicks: 0,
                uniqueVisitors: 0,
                firstClick: null,
                lastClick: null,
              });
            }
          } else {
            throw summaryError;
          }
        }
      } catch (error) {
        if (cancelled) return;

        console.error("Analytics error:", error);

        if (error.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }

        if (error.response?.status === 403) {
          setError("You do not have permission to view this URL analytics.");
          return;
        }

        if (error.response?.status === 404) {
          setError("URL not found or analytics are unavailable.");
          return;
        }

        setError("Could not load analytics.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, [shortCode, navigate]);

  const refreshAnalytics = async () => {
    try {
      setRefreshing(true);
      setError("");

      const [urlResponse, clicksResponse] = await Promise.all([
        api.get(`/api/urls/info/${shortCode}`),
        api.get(`/api/urls/analytics/${shortCode}`),
      ]);

      setUrlInfo(urlResponse.data);
      setClicks(clicksResponse.data);

      try {
        const summaryResponse = await api.get(
          `/api/urls/analytics/${shortCode}/summary`,
        );

        setSummary(summaryResponse.data);
      } catch (summaryError) {
        if (summaryError.response?.status === 404) {
          setSummary({
            totalClicks: 0,
            uniqueVisitors: 0,
            firstClick: null,
            lastClick: null,
          });
        } else {
          throw summaryError;
        }
      }
    } catch (error) {
      console.error("Refresh analytics error:", error);

      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      if (error.response?.status === 403) {
        setError("You do not have permission to view this URL analytics.");
        return;
      }

      setError("Could not refresh analytics.");
    } finally {
      setRefreshing(false);
    }
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const clickActivity = useMemo(() => {
    const grouped = {};

    clicks.forEach((click) => {
      if (!click.clickedAt) return;

      const date = new Date(click.clickedAt);

      const key = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });

      grouped[key] = (grouped[key] || 0) + 1;
    });

    return Object.entries(grouped).slice(-7);
  }, [clicks]);

  const maxClicks = Math.max(...clickActivity.map((item) => item[1]), 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">
          Loading analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                URL Analytics
              </h1>

              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {shortCode}
              </span>
            </div>

            <p className="text-gray-500 mt-2">
              Track performance and visitor activity.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={refreshAnalytics}
              disabled={refreshing}
              className="bg-white border border-gray-300 text-gray-800 px-4 py-2.5 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              {refreshing ? "Refreshing..." : "↻ Refresh"}
            </button>

            <Link
              to="/my-urls"
              className="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800"
            >
              Back to My URLs
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* URL information */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                Short URL
              </p>

              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-lg font-semibold hover:underline break-all"
              >
                {shortUrl}
              </a>

              {urlInfo?.originalUrl && (
                <p className="text-gray-500 mt-2 break-all">
                  → {urlInfo.originalUrl}
                </p>
              )}
            </div>

            <button
              onClick={copyUrl}
              className="shrink-0 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
            >
              {copied ? "✓ Copied" : "Copy URL"}
            </button>
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <p className="text-gray-500 text-sm">Total Clicks</p>

              <p className="text-4xl font-bold text-gray-900 mt-2">
                {summary.totalClicks}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <p className="text-gray-500 text-sm">Unique Visitors</p>

              <p className="text-4xl font-bold text-gray-900 mt-2">
                {summary.uniqueVisitors}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <p className="text-gray-500 text-sm">First Click</p>

              <p className="font-semibold text-gray-900 mt-3">
                {summary.firstClick
                  ? new Date(summary.firstClick).toLocaleString()
                  : "No clicks yet"}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <p className="text-gray-500 text-sm">Last Click</p>

              <p className="font-semibold text-gray-900 mt-3">
                {summary.lastClick
                  ? new Date(summary.lastClick).toLocaleString()
                  : "No clicks yet"}
              </p>
            </div>
          </div>
        )}

        {/* Click Activity */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold">Click Activity</h2>

            <p className="text-gray-500 text-sm mt-1">
              Clicks over the last active days
            </p>
          </div>

          {clickActivity.length === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-3">📊</div>

              <p className="font-semibold text-gray-700">
                No click activity yet
              </p>

              <p className="text-gray-400 text-sm mt-1">
                Open your short URL to generate analytics.
              </p>
            </div>
          ) : (
            <div className="h-64 flex items-end gap-4 border-b border-gray-200 px-2">
              {clickActivity.map(([date, count]) => {
                const height = `${Math.max((count / maxClicks) * 100, 5)}%`;

                return (
                  <div
                    key={date}
                    className="flex-1 h-full flex flex-col justify-end items-center gap-2"
                  >
                    <span className="text-sm font-semibold text-gray-700">
                      {count}
                    </span>

                    <div
                      className="w-full max-w-12 bg-blue-600 rounded-t-lg hover:bg-blue-700 transition"
                      style={{
                        height,
                        minHeight: "8px",
                      }}
                    />

                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {date}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Click Details */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Click Details</h2>

            <p className="text-gray-500 text-sm mt-1">
              Detailed information about every recorded click.
            </p>
          </div>

          {clicks.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3">🔗</div>

              <p className="font-semibold text-gray-700">No clicks yet</p>

              <p className="text-gray-400 text-sm mt-2">
                Share your short URL to start collecting analytics.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold">
                      Time
                    </th>

                    <th className="text-left p-4 text-sm font-semibold">
                      IP Address
                    </th>

                    <th className="text-left p-4 text-sm font-semibold">
                      Referrer
                    </th>

                    <th className="text-left p-4 text-sm font-semibold">
                      User Agent
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {clicks
                    .slice()
                    .reverse()
                    .map((click) => (
                      <tr key={click.id} className="border-t hover:bg-gray-50">
                        <td className="p-4 whitespace-nowrap">
                          {click.clickedAt
                            ? new Date(click.clickedAt).toLocaleString()
                            : "-"}
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          {click.ipAddress || "-"}
                        </td>

                        <td className="p-4 max-w-xs">
                          <div
                            className="truncate"
                            title={click.referrer || ""}
                          >
                            {click.referrer || "-"}
                          </div>
                        </td>

                        <td className="p-4 max-w-md">
                          <div
                            className="truncate"
                            title={click.userAgent || ""}
                          >
                            {click.userAgent || "-"}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
