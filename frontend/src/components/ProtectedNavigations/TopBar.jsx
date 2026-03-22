import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar } from "@nextui-org/react";
import { Link } from "react-router-dom";

import arrow from "../../assets/arrow.gif";
import avatar from "../../assets/avatar.webp";
import ThemeToggle from "../ThemeToggle";
import Menu from "./Menu";

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth?.user);

  const isRouteActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-full h-[10vh] flex justify-between items-center px-4 md:px-8 py-2 border-b border-slate-200/80 dark:border-slate-700/80 bg-white/75 dark:bg-slate-900/70 backdrop-blur-xl transition-colors">
      <div className="block xl:hidden">
        <Menu />
      </div>
      <div className="hidden md:flex items-center space-x-3">
        <img src={arrow} alt="" className="w-[30px] opacity-85" />
        <Link
          to="https://www.linkedin.com/in/Jatinsharma-/"
          target="_blank"
          className="text-lg text-slate-500 dark:text-slate-300 transition-all hover:text-primary relative animateBottom"
        >
          Contact Me
        </Link>
      </div>
      <div className="flex justify-center items-center space-x-3">
        <ThemeToggle />
        <button
          onClick={() => navigate("/dashboard/settings")}
          className={`hidden sm:flex items-center gap-2 rounded-full border px-2.5 py-1.5 transition-all ${
            isRouteActive("/dashboard/settings")
              ? "border-indigo-400/80 bg-indigo-50 dark:bg-slate-800"
              : "border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-900/75 hover:border-indigo-300 dark:hover:border-indigo-500"
          }`}
        >
          <Avatar
            src={avatar}
            name={user?.username || "User"}
            size="sm"
            isBordered
            color="secondary"
            showFallback
          />
          <span className="max-w-[8.5rem] truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
            {user?.username || "Profile"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
