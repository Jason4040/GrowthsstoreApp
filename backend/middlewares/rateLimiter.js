import rateLimit from "express-rate-limit";

// Guards login, OTP verification, and password-reset endpoints against
// credential stuffing / OTP brute-forcing (OTPs are only 6 digits).
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in a few minutes." },
});
