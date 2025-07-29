import React, { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from "react-toastify";

const TwoFactorSetup = ({ isOpen, onClose, onSetupComplete }) => {
  const [step, setStep] = useState(1); // 1: QR Code, 2: Verify Code
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  const setup2FA = async () => {
    setLoading(true);
    try {
      console.log("Setting up 2FA...");
      const response = await fetch("/api/v1/users/2fa/setup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log("2FA setup response:", data);

      if (response.ok) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
        setStep(2);
        toast.success(data.message);
      } else {
        console.error("2FA setup error:", data);
        toast.error(data.error || "Failed to setup 2FA");
      }
    } catch (error) {
      console.error("2FA setup network error:", error);
      toast.error("Failed to setup 2FA - Network error");
    } finally {
      setLoading(false);
    }
  };

  const enable2FA = async () => {
    if (!verificationCode) {
      toast.error("Please enter the verification code");
      return;
    }

    if (verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    try {
      console.log("Enabling 2FA with code:", verificationCode);
      const response = await fetch("/api/v1/users/2fa/enable", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verificationCode }),
      });

      const data = await response.json();
      console.log("2FA enable response:", data);

      if (response.ok) {
        setBackupCodes(data.backupCodes);
        setStep(3);
        toast.success(data.message);
        onSetupComplete?.();
      } else {
        console.error("2FA enable error:", data);
        toast.error(data.error || "Failed to enable 2FA");
      }
    } catch (error) {
      console.error("2FA enable network error:", error);
      toast.error("Failed to enable 2FA - Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setQrCode("");
    setSecret("");
    setVerificationCode("");
    setBackupCodes([]);
    onClose();
  };

  React.useEffect(() => {
    if (isOpen && step === 1) {
      setup2FA();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
      isDismissable={false}
      hideCloseButton={step === 3}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">
            {step === 1 && "Setting up 2FA..."}
            {step === 2 && "Set up Two-Factor Authentication"}
            {step === 3 && "Backup Codes - Important!"}
          </h2>
        </ModalHeader>

        <ModalBody>
          {step === 1 && (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p>Setting up 2FA for your account...</p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">
                  Scan this QR code with your authenticator app
                </h3>
                {qrCode && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={qrCode}
                      alt="2FA QR Code"
                      className="border rounded-lg"
                    />
                  </div>
                )}

                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Can't scan? Enter this code manually:
                  </p>
                  <code className="bg-white dark:bg-gray-900 px-2 py-1 rounded text-sm font-mono">
                    {secret}
                  </code>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Recommended apps: Google Authenticator, Authy, Microsoft
                  Authenticator
                </p>
              </div>

              <div>
                <Input
                  label="Enter 6-digit code from your app"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="max-w-xs mx-auto"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  ⚠️ Save Your Backup Codes
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  These backup codes can be used to access your account if you
                  lose your authenticator device. Save them in a secure
                  location. You won't be able to see them again!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                {backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-900 p-2 rounded text-center font-mono text-sm"
                  >
                    {code}
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Each backup code can only be used once.
              </p>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          {step === 2 && (
            <>
              <Button color="danger" variant="light" onPress={handleClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={enable2FA}
                isLoading={loading}
                isDisabled={!verificationCode || verificationCode.length !== 6}
              >
                Enable 2FA
              </Button>
            </>
          )}

          {step === 3 && (
            <Button color="primary" onPress={handleClose} className="mx-auto">
              I've Saved My Backup Codes
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TwoFactorSetup;
