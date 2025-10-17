import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Define the structure of a Route object
interface Route {
  _id: string;
  name: string;
  status: "draft" | "published";
  createdAt: string;
}

const API_URL = "http://localhost:5001/api/routes";

/**
 * The main dashboard page for managing all collection routes.
 * Styled entirely with Tailwind CSS.
 */
const DashboardPage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<Route[]>(API_URL);
      setRoutes(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch routes. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const handlePublish = async (routeId: string) => {
    if (
      window.confirm(
        "Are you sure you want to publish this route? This action cannot be undone."
      )
    ) {
      try {
        await axios.put(`${API_URL}/${routeId}`, { status: "published" });
        fetchRoutes();
      } catch (err) {
        alert("Failed to publish route.");
      }
    }
  };

  const handleDelete = async (routeId: string) => {
    if (window.confirm("Are you sure you want to delete this draft route?")) {
      try {
        await axios.delete(`${API_URL}/${routeId}`);
        fetchRoutes();
      } catch (err) {
        alert("Failed to delete route. You can only delete drafts.");
      }
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading routes...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Route Management Dashboard
      </h1>

      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-6 py-4 text-left font-semibold">Route Name</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-left font-semibold">Created On</th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center px-6 py-5 text-gray-600"
                >
                  No routes found.{" "}
                  <Link
                    to="/create-route"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Create one now
                  </Link>
                  !
                </td>
              </tr>
            ) : (
              routes.map((route) => (
                <tr
                  key={route._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 text-gray-800">{route.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                        route.status === "draft"
                          ? "bg-yellow-500"
                          : "bg-green-600"
                      }`}
                    >
                      {route.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(route.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex flex-wrap gap-2">
                    {route.status === "draft" && (
                      <button
                        onClick={() => handlePublish(route._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                      >
                        Publish
                      </button>
                    )}
                    <Link to={`/edit-route/${route._id}`}>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium">
                        Edit Name
                      </button>
                    </Link>
                    {route.status === "draft" && (
                      <button
                        onClick={() => handleDelete(route._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
