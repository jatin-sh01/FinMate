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
      } w-full min-h-screen dashboard-shell transition-colors relative overflow-hidden`}
    >
      <NavBar />
      <div className="hero-orb hero-orb-left"></div>
      <div className="hero-orb hero-orb-right"></div>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pb-8 pt-10 sm:pt-14 gap-y-12 flex flex-col transition-all duration-300">
        <div className="w-full min-h-[48vh] sm:min-h-[56vh] flex flex-col justify-center items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 dark:border-indigo-500/40 bg-white/75 dark:bg-slate-900/75 px-4 py-1.5 text-xs sm:text-sm font-semibold text-indigo-700 dark:text-indigo-200 shadow-sm mb-5">
            Smart money workflow, simplified
          </span>
          <h2 className="text-4xl md:text-5xl xl:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
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
          <p className="text-sm sm:text-base lg:text-lg my-7 text-balance w-[94%] xl:w-[62%] text-slate-600 dark:text-slate-300 leading-relaxed">
            Welcome to{" "}
            <span className="text-primary font-calSans">FinMate</span> - your
            comprehensive financial management platform. Take control of your
            money with smart expense tracking, income monitoring, multi-currency
            support, and detailed financial insights that help you achieve your
            goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <Button
              className="premium-button text-sm sm:text-base lg:text-lg w-[13.5rem] sm:w-[14rem] px-6 py-6"
              radius="full"
              startContent={<StartNow />}
              onPress={() => navigate("/register")}
            >
              Start using Now!
            </Button>
            <Button
              variant="light"
              radius="full"
              className="border border-indigo-200/80 dark:border-indigo-500/50 bg-white/70 dark:bg-slate-900/65 text-slate-700 dark:text-slate-200 px-5"
              endContent={<ThreeDots className="size-5" />}
              onPress={() => navigate("/login")}
            >
              Explore Demo
            </Button>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <img
            src={dashboardLight}
            alt="FinMate Dashboard - Light Theme"
            className="w-[96%] xl:w-[86%] mx-auto rounded-2xl border border-slate-300/80 shadow-2xl shadow-indigo-500/20 transition-all duration-300 transform hover:scale-[1.01] block dark:hidden"
          />
          <img
            src={dashboardDark}
            alt="FinMate Dashboard - Dark Theme"
            className="w-[96%] xl:w-[86%] mx-auto rounded-2xl border border-slate-700 shadow-2xl shadow-indigo-900/35 transition-all duration-300 transform hover:scale-[1.01] hidden dark:block"
          />
        </div>
        <div className="hidden sm:flex justify-center items-center mt-5">
          <Link to="https://github.com/jatin-sh01/FinMate-" target="_blank">
            <Button
              radius="full"
              variant="light"
              className="border border-indigo-300/70 dark:border-indigo-500/60 bg-white/70 dark:bg-slate-900/65 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
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
