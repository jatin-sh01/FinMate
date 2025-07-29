import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@nextui-org/react";
import { useNavigate, Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

import NavBar from "../components/NavBar";

import dashboardLight from "../assets/light dashboard.png";
import dashboardDark from "../assets/dark dashboard.png";
import { StartNow, ThreeDots } from "../utils/Icons";

const Home = () => {
  const navigate = useNavigate();
  const userIsVerified = useSelector((state) => state.auth?.user?.verified);

  useEffect(() => {
    if (userIsVerified) {
      navigate("/dashboard");
    }
  }, [userIsVerified]);

  return (
    <main
      className={`${
        userIsVerified ? "hidden" : ""
      } w-full h-full bg-white dark:bg-gray-900 transition-colors`}
    >
      <NavBar />
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-4 pt-12 sm:pt-0 gap-y-12 flex flex-col sm:block h-[90vh] sm:h-full transition-all duration-300">
        <div className="w-full sm:h-[65vh] flex flex-col justify-center items-center order-2 sm:order-1">
          <h2 className="text-4xl md:text-5xl xl:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent text-center">
            Manage your{" "}
            <TypeAnimation
              sequence={[
                "Finances",
                1000,
                "Expenses",
                1000,
                "Income",
                1000,
                "Budget",
                1000,
              ]}
              wrapper="span"
              speed={20}
              className="inline-block"
              repeat={Infinity}
            />{" "}
            smartly
          </h2>
          <p className="text-sm sm:text-base lg:text-lg my-8 text-balance text-center w-[90%] xl:w-[60%] text-gray-700 dark:text-gray-300">
            Welcome to{" "}
            <span className="text-primary font-calSans">FinMate</span> - your
            comprehensive financial management platform. Take control of your
            money with smart expense tracking, income monitoring, multi-currency
            support, and detailed financial insights that help you achieve your
            goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button
              color="primary"
              className="text-sm sm:text-base lg:text-lg lg:w-[14rem] px-6 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              radius="sm"
              startContent={<StartNow />}
              onPress={() => navigate("/register")}
            >
              Start using Now!
            </Button>
            <ThreeDots
              className="text-primary size-[2.5rem] cursor-pointer hover:scale-110 transition-transform duration-200"
              onClick={() => navigate("/login")}
            />
          </div>
        </div>
        <div className="flex justify-center items-center order-1 sm:order-2">
          {/* Light theme image */}
          <img
            src={dashboardLight}
            alt="FinMate Dashboard - Light Theme"
            className="w-[90%] xl:w-[80%] mx-auto rounded-xl border-3 border-gray-300 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] block dark:hidden"
          />
          {/* Dark theme image */}
          <img
            src={dashboardDark}
            alt="FinMate Dashboard - Dark Theme"
            className="w-[90%] xl:w-[80%] mx-auto rounded-xl border-3 border-gray-600 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] hidden dark:block"
          />
        </div>
        <div className="hidden sm:flex justify-center items-center mt-4">
          <Link to="https://github.com/jatin-sh01/FinMate-" target="_blank">
            <Button
              color="primary"
              radius="sm"
              variant="bordered"
              className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
            >
              Know More About the Project
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Home;
