import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  const req = res.req;
  const isProduction = process.env.NODE_ENV === "production" || 
                       (req && req.headers.host && req.headers.host.includes("growthsstore.com"));

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };

  if (isProduction) {
    cookieOptions.domain = ".growthsstore.com";
  }

  // Set JWT as an HTTP-Only Cookie
  res.cookie("jwt", token, cookieOptions);

  return token;
};

export default generateToken;
