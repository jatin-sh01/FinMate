import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { toast } from "react-toastify";

const TwoFactorVerification = ({
  isOpen,
  email,
  onClose,
  onVerificationSuccess,
}) => {
  const [activeTab, setActiveTab] = useState("authenticator");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const verify2FA = async (isBackupCode = false) => {
    if (!code) {
      toast.error("Please enter the code");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/v1/users/2fa/verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token: code,
          isBackupCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        onVerificationSuccess?.(data.user);
        handleClose();
      } else {
        toast.error(data.error);
        setCode("");
      }
    } catch (error) {
      toast.error("Verification failed");
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCode("");
    setActiveTab("authenticator");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      isDismissable={false}
      hideCloseButton
    >
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-bold">Two-Factor Authentication</h2>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter the verification code from your authenticator app or use a
              backup code.
            </p>

            <Tabs
              selectedKey={activeTab}
              onSelectionChange={setActiveTab}
              className="w-full"
            >
              <Tab key="authenticator" title="Authenticator App">
                <div className="space-y-4 pt-4">
                  <Input
                    label="6-digit code"
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Open your authenticator app (Google Authenticator, Authy,
                    etc.) and enter the 6-digit code.
                  </p>
                </div>
              </Tab>

              <Tab key="backup" title="Backup Code">
                <div className="space-y-4 pt-4">
                  <Input
                    label="Backup code"
                    placeholder="XX-XX-XX-XX"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Enter one of your backup codes. Each code can only be used
                    once.
                  </p>
                </div>
              </Tab>
            </Tabs>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={handleClose}
            isDisabled={loading}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={() => verify2FA(activeTab === "backup")}
            isLoading={loading}
            isDisabled={!code}
          >
            Verify
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TwoFactorVerification;
