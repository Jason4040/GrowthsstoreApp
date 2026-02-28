import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("User successfully registered");
      } catch (err) {
        console.log(err);
        toast.error(err.data.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-[#111] border border-gray-800 p-8 md:p-10 relative shadow-2xl animate-fade-in-up my-auto">
        {/* Close Button */}
        <Link
          to="/"
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>

        <div className="mb-8 text-center mt-4">
          <h1 className="text-3xl font-semibold text-white mb-2 tracking-tight">Join Us</h1>
          <p className="text-gray-400 text-sm">Create your account to start shopping.</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full bg-black border border-gray-800 text-white p-3.5 focus:border-pink-500 outline-none transition-colors"
              placeholder="John Doe"
              value={username}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full bg-black border border-gray-800 text-white p-3.5 focus:border-pink-500 outline-none transition-colors"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full bg-black border border-gray-800 text-white p-3.5 focus:border-pink-500 outline-none transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full bg-black border border-gray-800 text-white p-3.5 focus:border-pink-500 outline-none transition-colors"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-3.5 mt-6 transition-all active:scale-[0.98] disabled:bg-gray-800 disabled:text-gray-500"
          >
            {isLoading ? "Creating Account..." : "Register"}
          </button>

          {isLoading && <Loader />}
        </form>

        <div className="mt-8 text-center pt-6 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-pink-500 hover:text-pink-400 font-medium ml-1 transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
