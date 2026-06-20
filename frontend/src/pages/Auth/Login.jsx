import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

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
        server_error: "A server error occurred during Google sign-in.",
      };
      toast.error(errorMessages[errorParam] || "Google sign-in failed.");
      navigate("/login", { replace: true });
    }
  }, [search, navigate, sp]);

  const googleLoginHandler = () => {
    const backendUrl = import.meta.env.MODE === "production"
      ? "http://localhost:5000/auth/google"
      : "http://localhost:5000/auth/google";
    window.location.href = backendUrl;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      console.log(res);
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-white dark:bg-black/95 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-[#111] border border-gray-200 dark:border-gray-800 p-8 md:p-10 relative shadow-2xl animate-fade-in-up">
        {/* Close Button back to previous/home */}
        <Link
          to="/"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Sign in to your account to continue.</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
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
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-orange-500 hover:text-orange-400 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>
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

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3.5 mt-4 transition-all active:scale-[0.98] disabled:bg-gray-800 disabled:text-gray-500"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>

          {isLoading && <Loader />}
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <span className="relative bg-[#111] px-4 text-xs text-gray-500 uppercase">Or continue with</span>
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
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-orange-500 hover:text-orange-400 font-medium ml-1 transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
