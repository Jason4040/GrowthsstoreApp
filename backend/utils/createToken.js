import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.domain = ".growthsstore.com";
  }

  // Set JWT as an HTTP-Only Cookie
  res.cookie("jwt", token, cookieOptions);

  return token;
};

export default generateToken;
