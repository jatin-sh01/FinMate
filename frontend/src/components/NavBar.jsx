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
    <header className="w-full h-[10vh] px-6 sm:px-8 md:px-12 flex justify-between items-center border-b-1 border-gray-300 dark:border-gray-700 z-[999] bg-white dark:bg-gray-900 transition-colors">
      <div className="flex items-center gap-x-3">
        <img src={logo} alt="FinMate logo" className="w-[2rem] md:w-[3rem]" />
        <h1
          className="text-xl sm:text-2xl md:text-3xl uppercase cursor-pointer text-gray-800 dark:text-white"
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
          className="text-xl text-secondary dark:text-gray-300 transition-all hover:text-primary relative animateBottom"
        >
          Contact Me
        </Link>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <ThemeToggle className="mr-2" />
        <div className="hidden min-[460px]:flex items-center space-x-2 sm:space-x-4">
          <Button
            color="primary"
            className="text-base md:text-lg w-[7rem] sm:w-[8rem]"
            startContent={<Register />}
            onPress={() => navigate("/register")}
            radius="sm"
          >
            Register
          </Button>
          <Button
            color="primary"
            variant="bordered"
            className="text-base md:text-lg w-[7rem] sm:w-[8rem]"
            startContent={<Login />}
            onPress={() => navigate("/login")}
            radius="sm"
          >
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
