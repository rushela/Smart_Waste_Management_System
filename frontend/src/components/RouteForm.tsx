import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface RouteFormProps {
  onSubmit: (name: string) => void;
  initialName?: string;
  buttonText: string;
  pageTitle: string;
}

/**
 * A reusable form for creating or editing a route.
 * Styled with Tailwind CSS.
 */
const RouteForm: React.FC<RouteFormProps> = ({
  onSubmit,
  initialName = "",
  buttonText,
  pageTitle,
}) => {
  const [name, setName] = useState(initialName);
  const navigate = useNavigate();

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        {pageTitle}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
        {/* Input Field */}
        <div>
          <label
            htmlFor="routeName"
            className="block text-gray-700 font-medium mb-2"
          >
            Route Name
          </label>
          <input
            id="routeName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Colombo Zone A - Morning"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-3">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md transition"
          >
            {buttonText}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-5 py-2 rounded-md transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RouteForm;
