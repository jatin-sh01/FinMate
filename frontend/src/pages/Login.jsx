import React, { useState, useEffect } from "react";
import { object, string } from "yup";
import { toast } from "react-toastify";
import { useDisclosure } from "@nextui-org/react";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  useLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "../features/api/apiSlices/userApiSlice";
import { setCredentials } from "../features/authenticate/authSlice";
import { updateLoader } from "../features/loader/loaderSlice";

import loginImg from "../assets/login.webp";
import { UserAuthForm, OtpForm } from "../components/Forms";
import TwoFactorVerification from "../components/Modals/TwoFactorVerification";
import validateForm from "../utils/validateForm";
import { EmailInput, PasswordInput } from "../components/Inputs";
import SubmitButton from "../components/SubmitButton";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(
    parseInt(localStorage.getItem("otpCountdown")) || 0
  );

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Login, 2:(if user is not verified) OTP verification, 3: 2FA verification

  // 2FA states
  const [requires2FA, setRequires2FA] = useState(false);
  const [userEmailFor2FA, setUserEmailFor2FA] = useState("");
  const {
    isOpen: is2FAOpen,
    onOpen: on2FAOpen,
    onClose: on2FAClose,
  } = useDisclosure();

  const validationSchema = object({
    email: string().required("Email is required.").email("Invalid Email."),
    password: string()
      .required("Password is required.")
      .min(8, "Password must be atleast 8 characters long."),
  });

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    validateForm(e.target.name, e.target.value, validationSchema, setErrors);
  };

  const { email, password } = formData;
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [sendOtp] = useSendOtpMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      dispatch(updateLoader(40));
      const res = await login(formData).unwrap();

      dispatch(updateLoader(60));

      // Check if 2FA is required
      if (res.requires2FA) {
        setUserEmailFor2FA(res.email);
        setRequires2FA(true);
        on2FAOpen();
        toast.info(res.message);
        return;
      }

      await dispatch(setCredentials(res.user));
      toast.success(res.message || "Logged in successfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
      if (error?.data?.user?.verified === false) {
        await sendOtp({ email });
        await dispatch(updateLoader(60));
        setCountdown(60);
        await localStorage.setItem("otpCountdown", "60");
        setStep(2);
        toast.error(
          error?.data?.error || "Please verify your email via to proceed."
        );
        return;
      }

      toast.error(error?.data?.error || "Unexpected Internal Server Error!");
    } finally {
      dispatch(updateLoader(100));
    }
  };

  const [verifyOtp, { isLoading: verifyOtpLoading }] = useVerifyOtpMutation();
  const handleOtpSubmit = async (e) => {
    try {
      e.preventDefault();

      dispatch(updateLoader(40));
      const otpRes = await verifyOtp({ email, otp }).unwrap();

      dispatch(updateLoader(70));
      toast.success(
        otpRes.message ||
          "Email is verified successfully. Please login to proceed!"
      );
      setStep(1);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.error || "Unexpected Internal Server Error!");
    } finally {
      dispatch(updateLoader(100));
    }
  };

  const resendOtp = async (e) => {
    try {
      e.preventDefault();

      dispatch(updateLoader(40));
      const otpRes = await sendOtp({ email }).unwrap();

      dispatch(updateLoader(70));
      toast.success(
        otpRes.message || "OTP sent successfully. Please check your email!"
      );
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.error || "Unexpected Internal Server Error!");
      setCountdown(60);
      localStorage.setItem("otpCountdown", "60");
    } finally {
      dispatch(updateLoader(100));
    }
  };

  // Handle 2FA verification success
  const handle2FAVerificationSuccess = async (user) => {
    try {
      dispatch(updateLoader(60));
      await dispatch(setCredentials(user));
      toast.success("2FA verification successful!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to complete login");
    } finally {
      dispatch(updateLoader(100));
      setRequires2FA(false);
    }
  };

  const handle2FAClose = () => {
    setRequires2FA(false);
    setUserEmailFor2FA("");
  };

  const hasErrors = Object.values(errors).some((error) => !!error);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
        localStorage.setItem("otpCountdown", (countdown - 1).toString());
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <section className="w-full h-[90vh] px-6 sm:px-8 md:px-12 flex justify-center items-center">
      <UserAuthForm
        title={step === 1 ? "Welcome Back!" : "Verify your Email"}
        imageSrc={loginImg}
        imageTitle="Start using Now."
        alt="login image"
        form={
          step === 1 ? (
            <>
              <EmailInput
                value={email}
                onChange={handleOnChange}
                errors={errors}
              />
              <PasswordInput
                value={password}
                onChange={handleOnChange}
                errors={errors}
              />
              <SubmitButton
                isLoading={loginLoading}
                handleSubmit={handleSubmit}
                isDisabled={!email || !password || hasErrors}
              />
            </>
          ) : (
            <OtpForm
              otp={otp}
              setOtp={setOtp}
              email={email}
              handleOtpSubmit={handleOtpSubmit}
              resendOtp={resendOtp}
              countdown={countdown}
              verifyOtpLoading={verifyOtpLoading}
            />
          )
        }
        footer={step === 1 && "Don't have an account?"}
        footerLink={step === 1 && "Register"}
        footerLinkPath={step === 1 && "/register"}
      />

      <TwoFactorVerification
        isOpen={is2FAOpen}
        email={userEmailFor2FA}
        onClose={handle2FAClose}
        onVerificationSuccess={handle2FAVerificationSuccess}
      />
    </section>
  );
};

export default Login;
