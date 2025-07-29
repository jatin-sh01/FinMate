import React, { useEffect, useState } from "react";
import { object, string } from "yup";
import {
  Tabs,
  Tab,
  Link,
  Button,
  Card,
  CardBody,
  Spinner,
  Switch,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/authenticate/authSlice";
import { updateLoader } from "../../features/loader/loaderSlice";

import { UpdateProfile, ResetPassword } from "../../utils/Icons";
import TwoFactorSetup from "../../components/Modals/TwoFactorSetup";
import CurrencySelector from "../../components/CurrencySelector";

import {
  UsernameInput,
  PasswordInput,
  EmailInput,
} from "../../components/Inputs";
import {
  useGetUserDetailsQuery,
  useUpdateUserDetailsMutation,
  useResetPasswordMutation,
  useUpdateUserCurrencyMutation,
} from "../../features/api/apiSlices/userApiSlice";
import validateForm from "../../utils/validateForm";

const Settings = () => {
  const [selected, setSelected] = useState("accountInfo");
  const [accountInfoData, setAccountInfoData] = useState({
    username: "",
    email: "",
  });
  const [resetPassData, setResetPassData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [accountInfoErrors, setAccountInfoErrors] = useState({});
  const [resetPassErrors, setResetPassErrors] = useState({});

  const [initialAccountInfoData, setInitialAccountInfoData] = useState({
    username: "",
    email: "",
  });

  // 2FA States
  const [twoFactorStatus, setTwoFactorStatus] = useState({
    twoFactorEnabled: false,
    hasBackupCodes: false,
    remainingBackupCodes: 0,
  });
  const {
    isOpen: is2FASetupOpen,
    onOpen: on2FASetupOpen,
    onClose: on2FASetupClose,
  } = useDisclosure();
  const [is2FALoading, setIs2FALoading] = useState(false);

  // Currency State
  const [userCurrency, setUserCurrency] = useState("USD");

  const validationAccountInfoSchema = object({
    username: string()
      .min(3, "Username must be atleast 3 characters long.")
      .max(20, "Username should not be more than 20 characters."),
    email: string().email("Invalid Email."),
  });
  const validationResetPassSchema = object({
    oldPassword: string()
      .required("Password is required.")
      .min(8, "Password must be atleast 8 characters long."),
    newPassword: string()
      .required("New Password is required.")
      .min(8, "New Password must be at least 8 characters long."),
  });

  const handleAccountInfoOnChange = (e) => {
    setAccountInfoData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    validateForm(
      e.target.name,
      e.target.value,
      validationAccountInfoSchema,
      setAccountInfoErrors
    );
  };
  const handleResetPasswordOnChange = (e) => {
    setResetPassData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    validateForm(
      e.target.name,
      e.target.value,
      validationResetPassSchema,
      setResetPassErrors
    );
  };

  const { username, email } = accountInfoData;
  const [updateUser, { isLoading: updateUserLoading }] =
    useUpdateUserDetailsMutation();
  const dispatch = useDispatch();

  const handleUpdateUser = async (e) => {
    try {
      e.preventDefault();

      if (
        username === initialAccountInfoData.username &&
        email === initialAccountInfoData.email
      ) {
        toast.error("No changes detected.");
        return;
      }

      dispatch(updateLoader(40));
      const res = await updateUser(accountInfoData).unwrap();
      await dispatch(setCredentials(res.user));

      dispatch(updateLoader(60));
      toast.success(res.message || "Profile updated Successfully!");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.error || "Unexpected Internal Server Error!");
    } finally {
      dispatch(updateLoader(100));
    }
  };

  const { oldPassword, newPassword } = resetPassData;
  const [resetPassword, { isLoading: resetPasswordLoading }] =
    useResetPasswordMutation();
  const [updateCurrency, { isLoading: updateCurrencyLoading }] =
    useUpdateUserCurrencyMutation();
  const handleResetPassword = async (e) => {
    try {
      e.preventDefault();

      dispatch(updateLoader(40));
      const res = await resetPassword(resetPassData).unwrap();

      dispatch(updateLoader(60));
      toast.success(res.message || "Password updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.error || "Unexpected Internal Server Error!");
    } finally {
      dispatch(updateLoader(100));
    }
  };

  const {
    data,
    isLoading: userDetailsLoading,
    refetch,
  } = useGetUserDetailsQuery();
  const getUserDetails = async () => {
    try {
      await refetch();
      if (data?.user) {
        setAccountInfoData((prev) => ({
          ...prev,
          username: data.user.username,
        }));
        setAccountInfoData((prev) => ({ ...prev, email: data.user.email }));
        setInitialAccountInfoData({
          username: data.user.username,
          email: data.user.email,
        });
        setUserCurrency(data.user.currency || "USD");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch user details!");
    }
  };

  // Fetch 2FA status
  const fetch2FAStatus = async () => {
    try {
      const response = await fetch("/api/v1/users/2fa/status", {
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        setTwoFactorStatus(data);
      }
    } catch (error) {
      console.log("Failed to fetch 2FA status:", error);
    }
  };

  // Handle 2FA toggle
  const handle2FAToggle = async (enabled) => {
    if (enabled) {
      on2FASetupOpen();
    } else {
      // Show disable 2FA confirmation
      const password = prompt("Please enter your password to disable 2FA:");
      const token = prompt("Please enter your current 2FA code:");

      if (!password || !token) {
        return;
      }

      setIs2FALoading(true);
      try {
        const response = await fetch("/api/v1/users/2fa/disable", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, token }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success(data.message);
          setTwoFactorStatus((prev) => ({
            ...prev,
            twoFactorEnabled: false,
            hasBackupCodes: false,
            remainingBackupCodes: 0,
          }));
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        toast.error("Failed to disable 2FA");
      } finally {
        setIs2FALoading(false);
      }
    }
  };

  const handle2FASetupComplete = () => {
    fetch2FAStatus();
  };

  const handleCurrencyChange = async (currency) => {
    console.log("handleCurrencyChange called with:", currency);

    try {
      dispatch(updateLoader(20));

      const requestData = {
        currency: currency.code,
        country: currency.country,
      };
      console.log("Sending currency update request:", requestData);

      const response = await updateCurrency(requestData).unwrap();
      console.log("Currency update response:", response);

      // Backend returns { message, user } on success
      if (response.message && response.user) {
        // Update Redux store with new user data
        dispatch(setCredentials({ user: response.user }));
        setUserCurrency(currency.code);
        toast.success(response.message);
        dispatch(updateLoader(100));
      } else {
        toast.error("Failed to update currency");
      }
    } catch (error) {
      console.error("Currency update error:", error);
      toast.error(
        error?.data?.error ||
          error?.data?.message ||
          "Failed to update currency"
      );
    } finally {
      dispatch(updateLoader(100));
    }
  };

  const hasAccountInfoErrors = Object.values(accountInfoErrors).some(
    (error) => !!error
  );
  const hasResetPassErrors = Object.values(resetPassErrors).some(
    (error) => !!error
  );

  useEffect(() => {
    getUserDetails();
    fetch2FAStatus();
  }, [data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg px-2">
            Customize your account preferences, security settings, and
            personalization options
          </p>
        </div>

        <Card className="w-full shadow-xl sm:shadow-2xl backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0">
          {userDetailsLoading ? (
            <CardBody className="flex justify-center items-center h-64 sm:h-96">
              <div className="text-center space-y-4">
                <Spinner size="lg" color="primary" />
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Loading your settings...
                </p>
              </div>
            </CardBody>
          ) : (
            <CardBody className="p-3 sm:p-6 md:p-8">
              <Tabs
                fullWidth
                size="lg"
                aria-label="Settings Tabs"
                selectedKey={selected}
                onSelectionChange={setSelected}
                className="mb-4 sm:mb-6"
                classNames={{
                  tabList:
                    "gap-1 sm:gap-2 md:gap-6 w-full relative rounded-lg bg-gray-100 dark:bg-gray-800 p-1",
                  cursor: "w-full bg-white dark:bg-gray-700 shadow-lg",
                  tab: "max-w-fit px-2 sm:px-4 py-2 sm:py-3 h-10 sm:h-12",
                  tabContent:
                    "group-data-[selected=true]:text-blue-600 dark:group-data-[selected=true]:text-blue-400 font-medium text-xs sm:text-sm",
                }}
              >
                <Tab
                  key="accountInfo"
                  title={
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="hidden sm:inline">Profile</span>
                      <span className="sm:hidden">Info</span>
                    </div>
                  }
                >
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 sm:p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                      <h3 className="text-lg sm:text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        Personal Information
                      </h3>
                      <p className="text-blue-600 dark:text-blue-300 text-xs sm:text-sm">
                        Manage your account details and keep your profile
                        information up to date
                      </p>
                    </div>

                    <form className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <UsernameInput
                          value={username}
                          onChange={handleAccountInfoOnChange}
                          errors={accountInfoErrors}
                        />
                        <EmailInput
                          value={email}
                          onChange={handleAccountInfoOnChange}
                          errors={accountInfoErrors}
                          noDescription
                        />
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg">
                        <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          Need to update your password?{" "}
                          <Link
                            size="sm"
                            onPress={() => setSelected("resetPassword")}
                            className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Reset Password →
                          </Link>
                        </p>
                      </div>

                      <Button
                        size="lg"
                        color="primary"
                        onClick={handleUpdateUser}
                        isDisabled={hasAccountInfoErrors}
                        isLoading={updateUserLoading}
                        endContent={<UpdateProfile />}
                        className="w-full sm:w-full md:w-auto md:px-8 bg-gradient-to-r from-blue-600 to-purple-600 font-medium"
                      >
                        Update Profile
                      </Button>
                    </form>
                  </div>
                </Tab>
                <Tab
                  key="resetPassword"
                  title={
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <span className="hidden sm:inline">Password</span>
                      <span className="sm:hidden">Pass</span>
                    </div>
                  }
                >
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 sm:p-6 rounded-xl border border-orange-200 dark:border-orange-800">
                      <h3 className="text-lg sm:text-xl font-semibold text-orange-800 dark:text-orange-200 mb-2">
                        Password Security
                      </h3>
                      <p className="text-orange-600 dark:text-orange-300 text-xs sm:text-sm">
                        Keep your account secure with a strong password
                      </p>
                    </div>

                    <form className="space-y-4 sm:space-y-6">
                      <div className="space-y-3 sm:space-y-4">
                        <PasswordInput
                          name="oldPassword"
                          label="Current Password"
                          placeholder="Enter your current password"
                          value={oldPassword}
                          onChange={handleResetPasswordOnChange}
                          isInvalid={!!resetPassErrors?.oldPassword}
                          errorMessage={resetPassErrors?.oldPassword}
                          size="lg"
                        />
                        <PasswordInput
                          name="newPassword"
                          label="New Password"
                          placeholder="Enter your new password"
                          value={newPassword}
                          onChange={handleResetPasswordOnChange}
                          isInvalid={!!resetPassErrors?.newPassword}
                          errorMessage={resetPassErrors?.newPassword}
                          size="lg"
                        />
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg">
                        <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          Want to modify your account details?{" "}
                          <Link
                            size="sm"
                            onPress={() => setSelected("accountInfo")}
                            className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                          >
                            ← Account Information
                          </Link>
                        </p>
                      </div>

                      <Button
                        size="lg"
                        color="warning"
                        isLoading={resetPasswordLoading}
                        onClick={handleResetPassword}
                        isDisabled={
                          !oldPassword || !newPassword || hasResetPassErrors
                        }
                        endContent={<ResetPassword />}
                        className="w-full sm:w-full md:w-auto md:px-8 font-medium"
                      >
                        Update Password
                      </Button>
                    </form>
                  </div>
                </Tab>

                <Tab
                  key="security"
                  title={
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <span className="hidden sm:inline">Security</span>
                      <span className="sm:hidden">2FA</span>
                    </div>
                  }
                >
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 sm:p-6 rounded-xl border border-green-200 dark:border-green-800">
                      <h3 className="text-lg sm:text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                        Security Settings
                      </h3>
                      <p className="text-green-600 dark:text-green-300 text-xs sm:text-sm">
                        Protect your financial data with advanced security
                        features and two-factor authentication
                      </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            Two-Factor Authentication
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                            {twoFactorStatus.twoFactorEnabled
                              ? `Protection is active. You have ${twoFactorStatus.remainingBackupCodes} backup codes remaining.`
                              : "Secure your account with an authenticator app like Google Authenticator or Authy."}
                          </p>

                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <Switch
                                isSelected={twoFactorStatus.twoFactorEnabled}
                                onValueChange={handle2FAToggle}
                                isDisabled={is2FALoading}
                                color="success"
                                size="lg"
                              />
                              <span
                                className={`font-medium text-sm ${
                                  twoFactorStatus.twoFactorEnabled
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-gray-500 dark:text-gray-400"
                                }`}
                              >
                                {twoFactorStatus.twoFactorEnabled
                                  ? "Enabled"
                                  : "Disabled"}
                              </span>
                            </div>

                            {is2FALoading && (
                              <Spinner size="sm" color="primary" />
                            )}
                          </div>
                        </div>
                      </div>

                      {twoFactorStatus.twoFactorEnabled && (
                        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <div>
                              <span className="text-xs sm:text-sm font-medium text-green-800 dark:text-green-200">
                                Your account is protected with 2FA
                              </span>
                              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                Keep your authenticator app and backup codes in
                                a safe place.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Tab>

                <Tab
                  key="currency"
                  title={
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      <span className="hidden sm:inline">Currency</span>
                      <span className="sm:hidden">Money</span>
                    </div>
                  }
                >
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 sm:p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                      <h3 className="text-lg sm:text-xl font-semibold text-purple-800 dark:text-purple-200 mb-2">
                        Multi-Currency Settings
                      </h3>
                      <p className="text-purple-600 dark:text-purple-300 text-xs sm:text-sm">
                        Choose your preferred currency for all financial
                        displays and transactions
                      </p>
                    </div>

                    <CurrencySelector
                      selectedCurrency={userCurrency}
                      onCurrencyChange={handleCurrencyChange}
                    />
                  </div>
                </Tab>
              </Tabs>
            </CardBody>
          )}
        </Card>

        <TwoFactorSetup
          isOpen={is2FASetupOpen}
          onClose={on2FASetupClose}
          onSetupComplete={handle2FASetupComplete}
        />
      </div>
    </div>
  );
};

export default Settings;
