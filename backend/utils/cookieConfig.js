export const getCookieOptions = (req, isLogout = false) => {
  const host = req && req.headers.host ? req.headers.host : "";
  const isProduction = process.env.NODE_ENV === "production" || host.includes("growthsstore.com");

  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };

  if (!isLogout) {
    options.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
  } else {
    options.expires = new Date(0);
  }

  if (host.includes("growthsstore.com")) {
    options.domain = ".growthsstore.com";
    // sameSite must remain "none" for cross-origin cookie delivery
    // (frontend on growthsstore.com, backend on gowthstoresbackend.vercel.app)
  }

  return options;
};
