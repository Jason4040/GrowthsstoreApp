import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation, useVerifyOTPMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const [verifyOTP, { isLoading: isVerifying }] = useVerifyOTPMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  useEffect(() => {
    const errorParam = sp.get("error");
    if (errorParam) {
      const errorMessages = {
        no_code: "Google authorization code missing.",
        token_exchange_failed: "Failed to exchange Google token.",
        no_email: "Could not retrieve email from Google account.",
        server_error: "A server error occurred during Google registration.",
      };
      toast.error(errorMessages[errorParam] || "Google sign-in failed.");
      navigate("/register", { replace: true });
    }
  }, [search, navigate, sp]);

  const googleLoginHandler = () => {
    const backendUrl = import.meta.env.MODE === "production"
      ? "https://app.growthsstore.com/auth/google"
      : "http://localhost:5000/auth/google";
    window.location.href = backendUrl;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();
        toast.success(res.message || "OTP code sent to email.");
        setOtpSent(true);
      } catch (err) {
        console.log(err);
        toast.error(err?.data?.message || err.error || "Registration failed");
      }
    }
  };

  const otpSubmitHandler = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP code");
      return;
    }

    try {
      const res = await verifyOTP({ email, otp }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Account successfully verified and registered!");
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error || "Verification failed");
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-white dark:bg-black/95 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-[#111] border border-gray-200 dark:border-gray-800 p-8 md:p-10 relative shadow-2xl animate-fade-in-up my-auto">
        {/* Close Button */}
        <Link
          to="/"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>

        {otpSent ? (
          <>
            <div className="mb-8 text-center mt-4">
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2 tracking-tight">Verify Email</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">We've sent a 6-digit verification code to <strong className="text-orange-500">{email}</strong>.</p>
            </div>

            <form onSubmit={otpSubmitHandler} className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                >
                  Verification Code (OTP)
                </label>
                <input
                  type="text"
                  id="otp"
                  maxLength="6"
                  className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-white p-3.5 focus:border-orange-500 outline-none transition-colors text-center tracking-[8px] text-xl font-bold"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>

              <button
                disabled={isVerifying}
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3.5 mt-6 transition-all active:scale-[0.98] disabled:bg-gray-800 disabled:text-gray-500"
              >
                {isVerifying ? "Verifying..." : "Confirm Verification"}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-xs text-gray-500 hover:text-orange-500 transition-colors font-medium"
                >
                  ← Change email or go back
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="mb-8 text-center mt-4">
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2 tracking-tight">Join Us</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Create your account to start shopping.</p>
            </div>

            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-white p-3.5 focus:border-orange-500 outline-none transition-colors"
                  placeholder="John Doe"
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-white p-3.5 focus:border-orange-500 outline-none transition-colors"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-white p-3.5 focus:border-orange-500 outline-none transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-white p-3.5 focus:border-orange-500 outline-none transition-colors"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                disabled={isLoading}
                type="submit"
                >
                  Login
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
