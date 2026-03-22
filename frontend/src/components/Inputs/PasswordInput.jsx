import React, { useState } from "react";
import { Input } from "@nextui-org/react";

import { Password, Eye, EyeOff } from "../../utils/Icons";

const PasswordInput = ({
  value,
  onChange,
  errors,
  label,
  name,
  isInvalid,
  errorMessage,
  placeholder,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = (e) => {
    e.preventDefault();
    setIsVisible(!isVisible);
  };

  return (
    <Input
      type={isVisible ? "text" : "password"}
      label={label ? label : "Password"}
      name={name ? name : "password"}
      value={value}
      onChange={onChange}
      isInvalid={isInvalid ? isInvalid : !!errors?.password}
      errorMessage={errorMessage ? errorMessage : errors?.password}
      placeholder={placeholder ? placeholder : "Enter your password"}
      className="w-full"
      startContent={<Password />}
      endContent={
        <button
          onClick={toggleVisibility}
          className="rounded-md p-1 transition-colors hover:bg-indigo-50 dark:hover:bg-slate-800"
        >
          {isVisible ? <Eye /> : <EyeOff />}
        </button>
      }
      classNames={{
        label: "text-slate-700 dark:text-slate-200",
        input:
          "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500",
        inputWrapper:
          "premium-input rounded-xl shadow-sm",
        errorMessage: "text-error font-calSans",
      }}
    />
  );
};

export default PasswordInput;
