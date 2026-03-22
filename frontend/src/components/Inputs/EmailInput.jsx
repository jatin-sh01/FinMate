import React from "react";
import { Input } from "@nextui-org/react";

import { Email } from "../../utils/Icons";

const EmailInput = ({ value, onChange, errors, noDescription }) => {
  return (
    <Input
      type="text"
      label="Email"
      name="email"
      value={value}
      onChange={onChange}
      isInvalid={!!errors?.email}
      errorMessage={errors?.email}
      placeholder="Enter your email"
      startContent={<Email />}
      className="w-full mt-2"
      description={
        !noDescription && "We'll never share your email with anyone else."
      }
      classNames={{
        label: "text-slate-700 dark:text-slate-200",
        input:
          "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500",
        inputWrapper: "premium-input rounded-xl shadow-sm",
        description: !noDescription ? "text-slate-500 dark:text-slate-400 text-xs" : "",
        errorMessage: "text-error font-calSans",
      }}
    />
  );
};

export default EmailInput;
