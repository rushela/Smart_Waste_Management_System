import React from "react";
import { NavLink } from "react-router-dom";

/**
 * A responsive navigation bar for the application.
 * Uses NavLink for active styling with Tailwind.
 */
const Navigation: React.FC = () => {
  return (
    <header className="bg-[#2c3e50] px-6 md:px-12 py-4 flex justify-between items-center shadow-md">
      <NavLink
        to="/"
        className="text-white font-bold text-xl hover:text-green-400 transition"
      >
        Smart Waste Planner
      </NavLink>

      <nav className="flex space-x-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md transition ${
              isActive ? "bg-[#1abc9c] text-white" : "text-[#ecf0f1] hover:bg-[#34495e]"
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/create-route"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md transition ${
              isActive ? "bg-[#1abc9c] text-white" : "text-[#ecf0f1] hover:bg-[#34495e]"
            }`
          }
        >
          Create New Route
        </NavLink>
      </nav>
    </header>
  );
};

export default Navigation;
