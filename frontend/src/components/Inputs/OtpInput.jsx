import React from "react";
import OtpInput from "react-otp-input";

const CustomOtpInput = ({ otp, setOtp, email, onSubmit }) => {
  return (
    <>
      <p className="text-sm lg:text-base text-center text-balance text-slate-600 dark:text-slate-300 mb-6">
        Enter the OTP sent to {email} to proceed.
      </p>
      <OtpInput
        value={otp}
        onChange={setOtp}
        onSubmit={onSubmit}
        shouldAutoFocus
        numInputs={4}
        renderSeparator={<span className="w-2 sm:w-4 md:w-5"></span>}
        renderInput={(props) => <input {...props} />}
        inputType="tel"
        inputStyle="otp-cell"
      />
    </>
  );
};

export default CustomOtpInput;
