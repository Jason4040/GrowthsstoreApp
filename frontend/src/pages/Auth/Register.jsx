import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation, useVerifyOTPMutation, useResendOTPMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { BASE_URL } from "../../redux/constants";
import { ArrowLeft } from "lucide-react";
import SEO from "../../components/SEO";

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
  const [resendOTP, { isLoading: isResending }] = useResendOTPMutation();

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
    const backendUrl = `${BASE_URL || window.location.origin}/auth/google?state=${encodeURIComponent(redirect)}`;
    window.location.href = backendUrl;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await register({ username, email, password }).unwrap();
      toast.success(res.message || "OTP code sent to email.");
      setOtpSent(true);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error || "Registration failed");
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

  const resendOtpHandler = async () => {
    try {
      const res = await resendOTP({ email }).unwrap();
      toast.success(res.message || "A new code has been sent.");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Failed to resend code.");
    }
  };

  return (
    <>
      <SEO title="Create Account | GrowthsStore" description="Create your GrowthsStore account." noindex />
      <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-white dark:bg-black/95 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-8 md:p-10 relative shadow-2xl animate-fade-in-up my-auto">
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
              <p className="text-gray-600 dark:text-gray-600 dark:text-gray-400 text-sm">We've sent a 6-digit verification code to <strong className="text-orange-500">{email}</strong>.</p>
            </div>

            <form onSubmit={otpSubmitHandler} className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-xs font-semibold text-gray-600 dark:text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                >
                  Verification Code (OTP)
                </label>
                <input
                  type="text"
                  id="otp"
                  maxLength="6"
                  className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white p-3.5 focus:border-orange-500 outline-none transition-colors text-center tracking-[8px] text-xl font-bold"
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

              <div className="text-center mt-4 space-y-2">
                <button
                  type="button"
                  onClick={resendOtpHandler}
                  disabled={isResending}
                  className="block w-full text-xs text-orange-500 hover:text-orange-400 transition-colors font-medium disabled:text-gray-600"
                >
                  {isResending ? "Resending..." : "Didn't receive the code? Resend OTP"}
                </button>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-xs text-gray-500 hover:text-orange-500 transition-colors font-medium inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change email or go back
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="mb-8 text-center mt-4">
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2 tracking-tight">Join Us</h1>
              <p className="text-gray-600 dark:text-gray-600 dark:text-gray-400 text-sm">Create your account to start shopping.</p>
            </div>

            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold text-gray-600 dark:text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white p-3.5 focus:border-orange-500 outline-none transition-colors"
                  placeholder="John Doe"
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-gray-600 dark:text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white p-3.5 focus:border-orange-500 outline-none transition-colors"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-gray-600 dark:text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white p-3.5 focus:border-orange-500 outline-none transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold text-gray-600 dark:text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white p-3.5 focus:border-orange-500 outline-none transition-colors"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3.5 mt-6 transition-all active:scale-[0.98] disabled:bg-gray-800 disabled:text-gray-500"
              >
                {isLoading ? "Creating Account..." : "Register"}
              </button>

              {isLoading && <Loader />}
            </form>

            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <span className="relative bg-white dark:bg-[#111] px-4 text-xs text-gray-500 uppercase">Or continue with</span>
            </div>

            <button
              type="button"
              onClick={googleLoginHandler}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-medium py-3.5 transition-all active:scale-[0.98] border border-gray-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>

            <div className="mt-8 text-center pt-6 border-t border-gray-200 dark:border-gray-800">
              <p className="text-gray-600 dark:text-gray-600 dark:text-gray-400 text-sm">
                Already have an account?{" "}
                <Link
                  to={redirect ? `/login?redirect=${redirect}` : "/login"}
                  className="text-orange-500 hover:text-orange-400 font-medium ml-1 transition-colors"
                >
                  Login
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default Register;
