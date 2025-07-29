import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Avatar } from "@nextui-org/react";
import { Link } from "react-router-dom";

import { Settings, ShutDown as Logout } from "../../utils/Icons";
import arrow from "../../assets/arrow.gif";
import avatar from "../../assets/avatar.webp";
import { openModal } from "../../features/logoutModal/logoutModalSlice";
import ThemeToggle from "../ThemeToggle";
import Menu from "./Menu";

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isRouteActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-full h-[10vh] flex justify-between items-center px-8 py-2 border-b-1 border-secondary dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors">
      <div className="block xl:hidden">
        <Menu />
      </div>
      <div className="hidden md:flex items-center space-x-4">
        <img src={arrow} alt="" className="w-[35px]" />
        <Link
          to="https://www.linkedin.com/in/Jatinsharma-/"
          target="_blank"
          className="text-xl text-secondary dark:text-gray-300 transition-all hover:text-primary relative animateBottom"
        >
          Contact Me
        </Link>
      </div>
      <div className="flex justify-center items-center space-x-4">
        <ThemeToggle />
        <Settings
          className={`hidden sm:block p-1 border-1 border-secondary dark:border-gray-600 rounded-lg size-[1.8rem] transition-all cursor-pointer hover:bg-slate-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${
            isRouteActive("/dashboard/settings") ? "activeLink" : ""
          }`}
          onClick={() => navigate("/dashboard/settings")}
        />
        <Logout
          className="p-1 border-1 border-secondary dark:border-gray-600 rounded-lg size-[1.8rem] transition-all cursor-pointer hover:bg-error hover:text-white text-gray-700 dark:text-gray-300"
          onClick={() => dispatch(openModal())}
        />
        <Avatar
          src={avatar}
          name="Avatar"
          size="md"
          isBordered
          color="secondary"
          showFallback
        />
      </div>
    </div>
  );
};

export default TopBar;
