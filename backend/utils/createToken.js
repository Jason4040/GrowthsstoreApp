import jwt from "jsonwebtoken";
import { getCookieOptions } from "./cookieConfig.js";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  const cookieOptions = getCookieOptions(res.req);

  // Set JWT as an HTTP-Only Cookie
  res.cookie("jwt", token, cookieOptions);

  return token;
};

export default generateToken;
