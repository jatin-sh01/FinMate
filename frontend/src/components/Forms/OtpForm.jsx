/* eslint-disable react/prop-types */
import { Button } from "@nextui-org/react";

import OtpInput from "../Inputs/OtpInput";

const OtpForm = ({
  otp,
  email,
  setOtp,
  handleOtpSubmit,
  verifyOtpLoading,
  resendOtp,
  countdown,
}) => {
  return (
    <>
      <OtpInput
        otp={otp}
        email={email}
        setOtp={setOtp}
        onSubmit={handleOtpSubmit}
      />
      <Button
        variant="shadow"
        radius="full"
        isLoading={verifyOtpLoading}
        isDisabled={!otp || otp.length !== 4}
        className="premium-button text-base font-semibold w-full mt-8"
        onClick={handleOtpSubmit}
      >
        Verify OTP
      </Button>
      <span className="font-calSans text-base text-center mt-10 text-slate-700 dark:text-slate-200">
        Didn&apos;t receive OTP?
        {countdown === 0 ? (
          <span onClick={resendOtp} className="ml-1 action-btn">
            Resend OTP
          </span>
        ) : (
          <span className="ml-1 text-slate-500 dark:text-slate-400">
            Resend OTP in {countdown}s
          </span>
        )}
      </span>
    </>
  );
};

export default OtpForm;
