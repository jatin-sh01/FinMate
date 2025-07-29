import speakeasy from "speakeasy";
import QRCode from "qrcode";
import crypto from "crypto";

// Generate 2FA secret for user
export const generateTwoFactorSecret = (userEmail, appName = "FinMate") => {
  const secret = speakeasy.generateSecret({
    name: userEmail,
    issuer: appName,
    length: 32,
  });

  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url,
  };
};

// Generate QR code for 2FA setup
export const generateQRCode = async (otpauthUrl) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(otpauthUrl);
    return qrCodeDataURL;
  } catch (error) {
    throw new Error("Failed to generate QR code");
  }
};

// Verify 2FA token
export const verifyTwoFactorToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: token,
    window: 2, // Allow 2 time windows (60 seconds each way)
  });
};

// Generate backup codes
export const generateBackupCodes = () => {
  const codes = [];
  for (let i = 0; i < 8; i++) {
    const code = crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()
      .match(/.{1,2}/g)
      .join("-");
    codes.push(code);
  }
  return codes;
};

// Verify backup code
export const verifyBackupCode = (userBackupCodes, providedCode) => {
  const normalizedProvidedCode = providedCode.toUpperCase().replace(/\s/g, "");
  const index = userBackupCodes.findIndex(
    (code) => code.toUpperCase().replace(/\s/g, "") === normalizedProvidedCode
  );

  return index !== -1 ? index : false;
};
