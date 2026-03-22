import React from "react";
import { Button } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";

import arrow from "../assets/arrow.gif";
import logo from "/logo.webp";
import { Register, Login } from "../utils/Icons";
import ThemeToggle from "./ThemeToggle";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full sticky top-0 z-[999] border-b border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors">
      <div className="w-full max-w-7xl mx-auto h-[72px] px-4 sm:px-6 md:px-10 flex justify-between items-center">
        <div className="flex items-center gap-x-3">
          <img src={logo} alt="FinMate logo" className="w-8 md:w-10" />
          <h1
            className="text-xl sm:text-2xl md:text-3xl uppercase cursor-pointer text-slate-800 dark:text-white"
            onClick={() => navigate("/")}
          >
            Fin <span className="text-primary text-xl">Mate.</span>
          </h1>
        </div>
        <div className="hidden xmd:flex items-center space-x-4">
          <img src={arrow} alt="" className="w-[35px]" />
          <Link
            to="https://www.linkedin.com/in/Jatinsharma-/"
            target="_blank"
            className="text-lg text-slate-500 dark:text-slate-300 transition-all hover:text-primary relative animateBottom"
          >
            Contact Me
          </Link>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <ThemeToggle className="mr-1" />
          <div className="hidden min-[460px]:flex items-center space-x-2 sm:space-x-3">
            <Button
              className="premium-button text-sm md:text-base w-[6.8rem] sm:w-[7.8rem]"
              startContent={<Register />}
              onPress={() => navigate("/register")}
              radius="full"
            >
              Register
            </Button>
            <Button
              className="text-sm md:text-base w-[6.2rem] sm:w-[7rem] border border-indigo-300/80 dark:border-indigo-500/60 bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-100 hover:bg-indigo-50 dark:hover:bg-slate-800"
              startContent={<Login />}
              onPress={() => navigate("/login")}
              radius="full"
              variant="light"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
