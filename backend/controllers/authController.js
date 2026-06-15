import User from "../models/userModel.js";
import createToken from "../utils/createToken.js";
import bcrypt from "bcryptjs";

// @desc    Redirect to Google OAuth consent screen
// @route   GET /auth/google
// @access  Public
export const googleAuth = (req, res) => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: getGoogleCallbackUrl(),
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const queryString = new URLSearchParams(options).toString();
  res.redirect(`${rootUrl}?${queryString}`);
};

// @desc    Google OAuth callback handler
// @route   GET /auth/google/callback
// @access  Public
export const googleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    console.error("Authorization code is missing from Google redirect");
    return res.redirect(`${getFrontendUrl()}/login?error=no_code`);
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: getGoogleCallbackUrl(),
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenResponse.json();

    if (tokens.error) {
      console.error("Google Token Exchange error:", tokens);
      return res.redirect(`${getFrontendUrl()}/login?error=token_exchange_failed`);
    }

    // Get user info from Google
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await userResponse.json();

    if (!googleUser.email) {
      console.error("Google user profile is missing email address");
      return res.redirect(`${getFrontendUrl()}/login?error=no_email`);
    }

    // Find user in database
    let user = await User.findOne({ email: googleUser.email });

    if (user) {
      // If user exists, link Google ID and update profile picture if missing
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleUser.sub;
        updated = true;
      }
      if (!user.picture) {
        user.picture = googleUser.picture;
        updated = true;
      }
      if (!user.isVerified) {
        user.isVerified = true;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    } else {
      // Create a new user with Google details
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = new User({
        username: googleUser.name || googleUser.email.split("@")[0],
        email: googleUser.email,
        googleId: googleUser.sub,
        picture: googleUser.picture,
        isVerified: true,
        password: hashedPassword,
      });

      await user.save();
    }

    // Generate JWT and set in Cookie
    createToken(res, user._id);

    // Redirect back to frontend
    res.redirect(`${getFrontendUrl()}`);
  } catch (error) {
    console.error("Google callback general error:", error);
    res.redirect(`${getFrontendUrl()}/login?error=server_error`);
  }
};

// @desc    Get current user profile
// @route   GET /auth/me
// @access  Private
export const getMe = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      picture: req.user.picture,
      googleId: req.user.googleId,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Clear jwt cookie to logout user
// @route   POST /auth/logout
// @access  Public
export const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production" || 
                       (req && req.headers.host && req.headers.host.includes("growthsstore.com"));

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(0),
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };

  if (isProduction) {
    cookieOptions.domain = ".growthsstore.com";
  }

  res.cookie("jwt", "", cookieOptions);
  res.status(200).json({ message: "Logged out successfully" });
};

// Helpers
const getFrontendUrl = () => {
  return process.env.NODE_ENV === "production"
    ? "https://growthsstore.com"
    : "http://localhost:5173";
};

const getGoogleCallbackUrl = () => {
  return process.env.NODE_ENV === "production"
    ? "https://app.growthsstore.com/auth/google/callback"
    : "https://app.growthsstore.com/auth/google/callback";
};
