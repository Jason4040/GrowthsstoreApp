import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const navigate = useNavigate();

  const [forgotPassword, { isLoading: isSending }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const sendCodeHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email }).unwrap();
      toast.success(res.message || "Reset code sent to your email.");
      setCodeSent(true);
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Failed to send reset code.");
    }
  };

  const resetHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit reset code");
      return;
    }

    try {
      const res = await resetPassword({ email, otp, password }).unwrap();
      toast.success(res.message || "Password reset successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Password reset failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-white dark:bg-black/95 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-[#111] border border-gray-200 dark:border-gray-800 p-8 md:p-10 relative shadow-2xl animate-fade-in-up">
        <Link
          to="/login"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2 tracking-tight">
            {codeSent ? "Reset Password" : "Forgot Password"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {codeSent
              ? `Enter the 6-digit code sent to ${email} and your new password.`
              : "Enter your email and we'll send you a reset code."}
          </p>
        </div>

        {codeSent ? (
          <form onSubmit={resetHandler} className="space-y-5">
            <div>
              <label
                htmlFor="otp"
                className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
              >
                Reset Code
              </label>
              <input
                type="text"
                id="otp"
                maxLength="6"
                className="w-full bg-black border border-gray-200 dark:border-gray-800 text-white p-3.5 focus:border-orange-500 outline-none transition-colors text-center tracking-[8px] text-xl font-bold"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full bg-black border border-gray-200 dark:border-gray-800 text-white p-3.5 focus:border-orange-500 outline-none transition-colors"
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
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full bg-black border border-gray-200 dark:border-gray-800 text-white p-3.5 focus:border-orange-500 outline-none transition-colors"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              disabled={isResetting}
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3.5 mt-4 transition-all active:scale-[0.98] disabled:bg-gray-800 disabled:text-gray-500"
            >
              {isResetting ? "Resetting..." : "Reset Password"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setCodeSent(false)}
                className="text-xs text-gray-500 hover:text-orange-500 transition-colors font-medium"
              >
                ← Use a different email
              </button>
            </div>

            {isResetting && <Loader />}
          </form>
        ) : (
          <form onSubmit={sendCodeHandler} className="space-y-5">
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
                className="w-full bg-black border border-gray-200 dark:border-gray-800 text-white p-3.5 focus:border-orange-500 outline-none transition-colors"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              disabled={isSending}
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3.5 mt-4 transition-all active:scale-[0.98] disabled:bg-gray-800 disabled:text-gray-500"
            >
              {isSending ? "Sending..." : "Send Reset Code"}
            </button>

            {isSending && <Loader />}
          </form>
        )}

        <div className="mt-8 text-center pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-orange-500 hover:text-orange-400 font-medium ml-1 transition-colors"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
