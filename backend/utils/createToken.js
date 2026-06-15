import jwt from "jsonwebtoken";
import { getCookieOptions } from "./cookieConfig.js";

const generateToken = (res, userId) => {
  const JWT_SECRET = process.env.JWT_SECRET || "abac12afsdkjladf_growthsstore_secret_key_2024";
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "30d",
  });

  const cookieOptions = getCookieOptions(res.req);

  // Set JWT as an HTTP-Only Cookie
  res.cookie("jwt", token, cookieOptions);

  return token;
};

export default generateToken;
