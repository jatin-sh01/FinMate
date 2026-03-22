import React from "react";
import { Input } from "@nextui-org/react";

import { User } from "../../utils/Icons";

const UsernameInput = ({ value, onChange, errors }) => {
  return (
    <Input
      type="text"
      label="Username"
      name="username"
      value={value}
      onChange={onChange}
      isInvalid={!!errors?.username}
      errorMessage={errors?.username}
      placeholder="Enter your username"
      startContent={<User />}
      className="w-full"
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

export default UsernameInput;
