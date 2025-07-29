import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      default: null,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    backupCodes: [
      {
        type: String,
      },
    ],
    currency: {
      type: String,
      default: "USD",
      enum: [
        "USD",
        "EUR",
        "GBP",
        "INR",
        "JPY",
        "CAD",
        "AUD",
        "CHF",
        "CNY",
        "KRW",
        "BRL",
        "MXN",
        "RUB",
        "ZAR",
        "SGD",
        "HKD",
        "NZD",
        "SEK",
        "NOK",
        "DKK",
        "PLN",
      ],
    },
    country: {
      type: String,
      default: "US",
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
