import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  User,
  Settings,
  ListOrdered,
  LogOut,
  X
} from "lucide-react";

import Loader from "../../components/Loader";
import { useProfileMutation, useLogoutMutation } from "../../redux/api/usersApiSlice";
import { setCredentials, logout } from "../../redux/features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();
  const [logoutApiCall] = useLogoutMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 mt-8 lg:mt-16 pb-[10rem] md:pb-0 flex flex-col lg:flex-row items-start justify-center min-h-[80vh] gap-6 max-w-[1000px]">
      
      {/* Left Sidebar Layout */}
      <div className="w-full lg:w-[320px] flex flex-col gap-6 shrink-0">
        {/* Navigation Card */}
        <div className="w-full bg-[#111] border border-gray-200 dark:border-gray-800 p-6 shadow-2xl rounded-none">
          <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800/80 pb-6 mb-4">
            <div className="w-12 h-12 bg-orange-600 flex items-center justify-center text-white text-xl font-bold rounded-none shrink-0 shadow-lg">
              {userInfo.username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h2 className="text-gray-900 dark:text-white font-medium text-[15px] truncate">{userInfo.username}</h2>
              <p className="text-gray-500 text-xs truncate mt-0.5">{userInfo.email}</p>
            </div>
          </div>
          
          <div className="flex flex-col space-y-1">
            <Link to="/profile" className="flex items-center justify-between text-gray-200 bg-gray-900 border-l-[3px] border-orange-500 px-4 py-3 transition-colors text-sm font-medium">
              <span className="flex items-center gap-3">
                <User className="w-4 h-4 text-orange-500" /> My Profile
              </span>
              <span className="text-gray-600 font-bold">&gt;</span>
            </Link>
            <Link to="/user-orders" className="flex items-center justify-between text-gray-500 hover:text-gray-700 dark:text-gray-300 border-l-[3px] border-transparent px-4 py-3 hover:bg-gray-900 transition-colors text-sm font-medium group">
              <span className="flex items-center gap-3">
                <ListOrdered className="w-4 h-4 group-hover:text-orange-400" /> My Orders
              </span>
              <span className="text-gray-700 group-hover:text-gray-500 font-bold">&gt;</span>
            </Link>
            <div className="flex items-center justify-between text-gray-500 hover:text-gray-700 dark:text-gray-300 border-l-[3px] border-transparent px-4 py-3 hover:bg-gray-900 transition-colors text-sm font-medium cursor-not-allowed group">
              <span className="flex items-center gap-3">
                <Settings className="w-4 h-4 group-hover:text-orange-400" /> Settings
              </span>
              <span className="text-gray-700 group-hover:text-gray-500 font-bold">&gt;</span>
            </div>
            <button onClick={logoutHandler} className="flex items-center justify-between text-gray-500 hover:text-red-400 border-l-[3px] border-transparent px-4 py-3 hover:bg-red-950/20 transition-colors w-full text-left text-sm font-medium mt-2 group">
              <span className="flex items-center gap-3">
                <LogOut className="w-4 h-4 group-hover:text-red-400" /> Log Out
              </span>
            </button>
          </div>
        </div>

        {/* Small Settings Card */}
        <div className="w-full bg-[#111] border border-gray-200 dark:border-gray-800 p-6 shadow-2xl rounded-none">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-gray-700 dark:text-gray-300 font-semibold text-sm tracking-wide">Settings</h3>
            <X className="text-gray-600 cursor-pointer hover:text-gray-900 dark:text-white" />
          </div>
          <div className="flex justify-between items-center text-xs mb-4">
            <span className="text-gray-500 font-medium">Theme</span>
            <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2 cursor-pointer hover:text-gray-900 dark:text-white">Dark <span className="text-gray-600 text-[10px]">▼</span></span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-medium">Language</span>
            <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2 cursor-pointer hover:text-gray-900 dark:text-white">Eng <span className="text-gray-600 text-[10px]">▼</span></span>
          </div>
        </div>
      </div>

      {/* Right Main Form Area */}
      <div className="flex-1 w-full bg-[#111] border border-gray-200 dark:border-gray-800 p-8 lg:p-12 relative shadow-2xl rounded-none">
        
        {/* Header containing Name/Email + Close Icon */}
        <div className="flex justify-between items-start mb-14">
          <div className="flex items-center gap-5">
            <div className="w-[72px] h-[72px] bg-orange-600 flex items-center justify-center text-white text-3xl font-bold rounded-none shrink-0 shadow-lg border-2 border-orange-500/20">
              {userInfo.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">{userInfo.username}</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 border-b border-transparent hover:border-orange-500 cursor-default transition-all inline-block pb-0.5">{userInfo.email}</p>
            </div>
          </div>
          <Link to="/" className="text-gray-600 hover:text-orange-500 transition-colors p-2 -mr-2 -mt-2">
            <X className="w-5 h-5" />
          </Link>
        </div>

        {/* List lines Form mimicking the image design */}
        <form onSubmit={submitHandler} className="flex flex-col">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 dark:border-gray-800/80 pb-5 mb-5 group">
            <label className="text-[13px] font-medium text-gray-600 dark:text-gray-400 w-1/3 shrink-0 mb-2 sm:mb-0 group-hover:text-orange-400 transition-colors tracking-wide">
              Name
            </label>
            <input
              type="text"
              className="w-full bg-transparent sm:text-right text-gray-200 focus:outline-none placeholder-gray-700 text-[14px] font-medium"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 dark:border-gray-800/80 pb-5 mb-5 group">
            <label className="text-[13px] font-medium text-gray-600 dark:text-gray-400 w-1/3 shrink-0 mb-2 sm:mb-0 group-hover:text-orange-400 transition-colors tracking-wide">
              Email account
            </label>
            <input
              type="email"
              className="w-full bg-transparent sm:text-right text-gray-200 focus:outline-none placeholder-gray-700 text-[14px] font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 dark:border-gray-800/80 pb-5 mb-5 group">
            <label className="text-[13px] font-medium text-gray-600 dark:text-gray-400 w-1/3 shrink-0 mb-2 sm:mb-0 group-hover:text-orange-400 transition-colors tracking-wide">
              Password
            </label>
            <input
              type="password"
              placeholder="Add new password"
              className="w-full bg-transparent sm:text-right text-gray-200 focus:outline-none placeholder-gray-700 text-[14px] font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 dark:border-gray-800/80 pb-5 mb-5 group">
            <label className="text-[13px] font-medium text-gray-600 dark:text-gray-400 w-1/3 shrink-0 mb-2 sm:mb-0 group-hover:text-orange-400 transition-colors tracking-wide">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full bg-transparent sm:text-right text-gray-200 focus:outline-none placeholder-gray-700 text-[14px] font-medium"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="pt-8">
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white text-[13px] font-bold py-3 px-8 transition-all shadow-none transform active:scale-[0.98] outline-none tracking-wider"
            >
              Save Change
            </button>
            {loadingUpdateProfile && <span className="ml-4"><Loader /></span>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
