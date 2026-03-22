/* eslint-disable react/prop-types */
import { Avatar } from "@nextui-org/react";
import { Link } from "react-router-dom";

import avatar from "../../assets/avatar.webp";

const UserAuthForm = ({
  title,
  imageSrc,
  imageTitle,
  alt,
  form,
  footer,
  footerLink,
  footerLinkPath,
}) => {
  return (
    <div className="w-full max-w-6xl flex flex-col lg:flex-row lg:items-stretch rounded-3xl border border-indigo-100/70 dark:border-slate-700/70 bg-gradient-to-br from-white/90 via-indigo-50/70 to-violet-50/70 dark:from-slate-950/90 dark:via-slate-900/80 dark:to-indigo-950/50 shadow-[0_24px_70px_-30px_rgba(79,70,229,0.5)] p-2 sm:p-3">
      <div className="hidden lg:flex flex-col justify-center items-center w-[46%] px-6 py-8">
        <h4 className="text-3xl xl:text-4xl text-slate-800 dark:text-slate-100 relative animateBottom font-calSans">
          {imageTitle}
        </h4>
        <img src={imageSrc} alt={alt} className="w-full max-w-[25rem]" />
      </div>
      <div className="flex flex-col justify-center items-center w-full lg:w-[54%] min-h-[30rem] sm:min-h-[34rem] bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-white/60 dark:border-slate-700/60 shadow-xl px-3 py-8 sm:px-5 sm:py-10">
        <Avatar
          src={avatar}
          name="Avatar"
          className="w-20 h-20 sm:w-24 sm:h-24 text-lg mb-4"
          isBordered
          color="secondary"
          showFallback
        />
        <h3 className="text-slate-900 dark:text-slate-100 text-2xl md:text-3xl xl:text-4xl mb-4 text-center">
          {title}
        </h3>
        <div className="w-full max-w-md flex flex-col justify-center items-center">
          {form}
        </div>
        {footer && (
          <span className="font-calSans text-sm sm:text-base text-center mt-5 text-slate-700 dark:text-slate-200">
            <span className="block sm:inline">{footer}</span>
            <Link to={footerLinkPath} className="ml-1 action-btn">
              {footerLink}
            </Link>
          </span>
        )}
      </div>
    </div>
  );
};

export default UserAuthForm;
