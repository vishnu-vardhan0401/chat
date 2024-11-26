import React, { useContext, useState } from "react";
import { FaMessage } from "react-icons/fa6";
import {
  IoLogoCodepen,
  IoMdAdd,
  IoMdAddCircle,
  IoIosBatteryCharging,
  IoMdLogOut,
} from "react-icons/io";
import { context } from "../Context/Global";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const { handleLogout } = useContext(context);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`h-screen bg-gray-900 text-white flex flex-col justify-between items-center ${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-300`}
    >
      {/* Top Section */}
      <div className="flex flex-col items-center mt-4">
        {/* Logo */}
        <div
          onClick={() => setCollapsed(!collapsed)}
          className="text-3xl p-4 cursor-pointer hover:scale-110 transition-transform"
        >
          <IoLogoCodepen />
        </div>
        {/* Navigation */}
        <div className="flex flex-col gap-6 items-center mt-10">
          {/* Chat */}
          <button
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/chat")}
          >
            <FaMessage className="text-2xl group-hover:text-blue-400" />
            {!collapsed && <span className="text-sm group-hover:text-blue-400">Chat</span>}
          </button>
          {/* Requests */}
          <button
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/request")}
          >
            <IoMdAdd className="text-3xl group-hover:text-green-400" />
            {!collapsed && <span className="text-sm group-hover:text-green-400">Requests</span>}
          </button>
          {/* Add Friend */}
          <button
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/addfriend")}
          >
            <IoMdAddCircle className="text-3xl group-hover:text-pink-400" />
            {!collapsed && <span className="text-sm group-hover:text-pink-400">Add Friend</span>}
          </button>
          {/* Profile */}
          <button
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/profile")}
          >
            <IoIosBatteryCharging className="text-3xl group-hover:text-purple-400" />
            {!collapsed && <span className="text-sm group-hover:text-purple-400">Profile</span>}
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        className="flex items-center gap-3 cursor-pointer group mb-6"
        onClick={handleLogout}
      >
        <IoMdLogOut className="text-3xl group-hover:text-red-400" />
        {!collapsed && <span className="text-sm group-hover:text-red-400">Logout</span>}
      </button>
    </div>
  );
}

export default Sidebar;
