// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// ✅ Firebase config from .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Only for development: disable actual SMS sending
auth.settings.appVerificationDisabledForTesting = true;

let confirmationResult = null;

// Setup recaptcha (needed even in dev, but invisible)
export const setupRecaptcha = (containerId = "recaptcha-container") => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      containerId,
      {
        size: "invisible", // Invisible in dev
        callback: (response) => {
          console.log("Recaptcha solved (dev)");
        },
      },
      auth
    );
    window.recaptchaVerifier.render();
  }
};

// Send OTP (fake SMS in dev)
export const sendOTP = async (phoneNumber) => {
  if (!phoneNumber.startsWith("+")) phoneNumber = "+91" + phoneNumber; // E.164 format
  setupRecaptcha();
  try {
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
    console.log("OTP sent (dev testing mode)");
    return confirmationResult;
  } catch (err) {
    console.error("Firebase sendOTP error:", err);
    throw new Error("Failed to send OTP. Check the number format or recaptcha.");
  }
};

// Verify OTP
export const verifyOTP = async (code) => {
  if (!confirmationResult) throw new Error("No OTP request found");
  try {
    const result = await confirmationResult.confirm(code);
    return result.user.phoneNumber; // returns verified phone
  } catch (err) {
    console.error("Firebase verifyOTP error:", err);
    throw new Error("OTP verification failed");
  }
};