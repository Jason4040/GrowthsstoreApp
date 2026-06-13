import { useState, useEffect } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineDatabase,
  AiOutlineOrderedList,
  AiOutlineUsergroupAdd,
  AiOutlineFileText,
  AiOutlineMessage,
  AiOutlineQuestionCircle,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import { setCurrency } from "../../redux/features/currency/currencySlice";
import FavoritesCount from "../Products/FavoritesCount";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { currentCurrency } = useSelector((state) => state.currency);

  const { data: myOrders } = useGetMyOrdersQuery(undefined, { skip: !userInfo });
  const hasApprovedOrder = myOrders?.some(order => order.isPaid);
  const showMessagesLink = userInfo && (userInfo.isAdmin || hasApprovedOrder);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    let timeout;
    if (showVideo) {
      timeout = setTimeout(() => setShowVideo(false), 5000);
    } else {
      timeout = setTimeout(() => setShowVideo(true), 10000);
    }
    return () => clearTimeout(timeout);
  }, [showVideo]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col justify-between py-3 text-white bg-black h-[100vh] fixed border-r border-gray-800 rounded-none`}
        id="sidebar-menu"
      >
        <div className="flex flex-col space-y-1.5 mt-2">
          <div className="flex justify-center mb-3 px-2 w-full h-[55px]">
            <Link to="/" className="relative w-[55px] h-full block">
              <img 
                src="/businesslogo.png" 
                alt="Logo" 
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ease-in-out ${showVideo ? 'opacity-0' : 'opacity-100'} drop-shadow-lg`} 
              />
              <video 
                src="/loading.webm" 
                autoPlay 
                loop 
                muted 
                playsInline
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ease-in-out ${showVideo ? 'opacity-100' : 'opacity-0'} drop-shadow-lg`} 
              />
            </Link>
          </div>

          <div className="px-4 mb-2">
            <select
              value={currentCurrency}
              onChange={(e) => dispatch(setCurrency(e.target.value))}
              className="w-full bg-[#1A1A1A] text-white text-sm font-medium border border-gray-800 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none nav-item-name transition-opacity"
            >
              <option value="USD">USD ($)</option>
              <option value="UGX">UGX (USh)</option>
              <option value="RWF">RWF (FRw)</option>
            </select>
          </div>

          <Link
            to="/"
            className="flex items-center text-gray-400 hover:text-white transition-colors py-2 group/link relative"
          >
            <div className="w-[96px] flex justify-center shrink-0">
              <AiOutlineHome size={30} className="transform group-hover/link:scale-110 transition-transform" />
            </div>
            <span className="nav-item-name font-medium whitespace-nowrap text-sm group-hover/link:text-orange-500">Home</span>
          </Link>

          <Link
            to="/shop"
            className="flex items-center text-gray-400 hover:text-white transition-colors py-2 group/link relative"
          >
            <div className="w-[96px] flex justify-center shrink-0">
              <AiOutlineShopping size={30} className="transform group-hover/link:scale-110 transition-transform" />
            </div>
            <span className="nav-item-name font-medium whitespace-nowrap text-sm group-hover/link:text-orange-500">Shop</span>
          </Link>

          <Link
            to="/cart"
            className="flex items-center text-gray-400 hover:text-white transition-colors py-2 group/link relative"
          >
            <div className="w-[96px] flex justify-center shrink-0">
              <div className="relative">
                <AiOutlineShoppingCart size={30} className="transform group-hover/link:scale-110 transition-transform" />
                {cartItems.length > 0 && (
                  <span className="absolute top-[-8px] right-[-10px] px-1.5 py-0.5 text-[10px] font-semibold text-white bg-orange-600 rounded-none z-10 animate-pulse border border-red-800">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </span>
                )}
              </div>
            </div>
            <span className="nav-item-name font-medium whitespace-nowrap text-sm group-hover/link:text-orange-500">Cart</span>
          </Link>

          <Link
            to="/favorite"
            className="flex items-center text-gray-400 hover:text-white transition-colors py-2 group/link relative"
          >
            <div className="w-[96px] flex justify-center shrink-0">
              <div className="relative">
                <FaHeart size={26} className="transform group-hover/link:scale-110 transition-transform group-hover/link:text-orange-500" />
                <FavoritesCount />
              </div>
            </div>
            <span className="nav-item-name font-medium whitespace-nowrap text-sm group-hover/link:text-orange-500">Saved</span>
          </Link>

          <Link
            to="/faq"
            className="flex items-center text-gray-400 hover:text-white transition-colors py-2 group/link relative"
          >
            <div className="w-[96px] flex justify-center shrink-0">
              <AiOutlineQuestionCircle size={30} className="transform group-hover/link:scale-110 transition-transform" />
            </div>
            <span className="nav-item-name font-medium whitespace-nowrap text-sm group-hover/link:text-orange-500">FAQ</span>
          </Link>

          {showMessagesLink && (
            <Link
              to="/messages"
              className="flex items-center text-gray-400 hover:text-white transition-colors py-2 group/link relative"
            >
              <div className="w-[96px] flex justify-center shrink-0">
                <AiOutlineMessage size={30} className="transform group-hover/link:scale-110 transition-transform" />
              </div>
              <span className="nav-item-name font-medium whitespace-nowrap text-sm group-hover/link:text-orange-500">Messages</span>
            </Link>
          )}

          {userInfo && userInfo.isAdmin && (
            <div className="flex flex-col space-y-1.5 border-t border-gray-800 pt-3 mt-3">
              <Link
                to="/admin/dashboard"
                className="flex items-center text-gray-500 hover:text-white transition-colors py-2 group/link relative"
              >
                <div className="w-[96px] flex justify-center shrink-0">
                  <MdDashboard size={28} className="transform group-hover/link:scale-110 transition-transform" />
                </div>
                <span className="nav-item-name font-semibold whitespace-nowrap text-sm group-hover/link:text-orange-500 text-gray-400">Admin Dashboard</span>
              </Link>
              <Link
                to="/admin/allproductslist"
                className="flex items-center text-gray-500 hover:text-white transition-colors py-2 group/link relative"
              >
                <div className="w-[96px] flex justify-center shrink-0">
                  <AiOutlineDatabase size={28} className="transform group-hover/link:scale-110 transition-transform" />
                </div>
                <span className="nav-item-name font-semibold whitespace-nowrap text-sm group-hover/link:text-orange-500 text-gray-400">Products</span>
              </Link>
              <Link
                to="/admin/categorylist"
                className="flex items-center text-gray-500 hover:text-white transition-colors py-2 group/link relative"
              >
                <div className="w-[96px] flex justify-center shrink-0">
                  <BiCategory size={28} className="transform group-hover/link:scale-110 transition-transform" />
                </div>
                <span className="nav-item-name font-semibold whitespace-nowrap text-sm group-hover/link:text-orange-500 text-gray-400">Categories</span>
              </Link>
              <Link
                to="/admin/orderlist"
                className="flex items-center text-gray-500 hover:text-white transition-colors py-2 group/link relative"
              >
                <div className="w-[96px] flex justify-center shrink-0">
                  <AiOutlineOrderedList size={28} className="transform group-hover/link:scale-110 transition-transform" />
                </div>
                <span className="nav-item-name font-semibold whitespace-nowrap text-sm group-hover/link:text-orange-500 text-gray-400">Orders</span>
              </Link>
              <Link
                to="/admin/paymentproofs"
                className="flex items-center text-gray-500 hover:text-white transition-colors py-2 group/link relative"
              >
                <div className="w-[96px] flex justify-center shrink-0">
                  <AiOutlineFileText size={28} className="transform group-hover/link:scale-110 transition-transform" />
                </div>
                <span className="nav-item-name font-semibold whitespace-nowrap text-sm group-hover/link:text-orange-500 text-gray-400">Payment Proofs</span>
              </Link>
              <Link
                to="/admin/userlist"
                className="flex items-center text-gray-500 hover:text-white transition-colors py-2 group/link relative"
              >
                <div className="w-[96px] flex justify-center shrink-0">
                  <AiOutlineUsergroupAdd size={28} className="transform group-hover/link:scale-110 transition-transform" />
                </div>
                <span className="nav-item-name font-semibold whitespace-nowrap text-sm group-hover/link:text-orange-500 text-gray-400">Users</span>
              </Link>
              <Link
                to="/admin/faqmanager"
                className="flex items-center text-gray-500 hover:text-white transition-colors py-2 group/link relative"
              >
                <div className="w-[96px] flex justify-center shrink-0">
                  <AiOutlineQuestionCircle size={28} className="transform group-hover/link:scale-110 transition-transform" />
                </div>
                <span className="nav-item-name font-semibold whitespace-nowrap text-sm group-hover/link:text-orange-500 text-gray-400">FAQ Manager</span>
              </Link>
            </div>
          )}
        </div>

        <div className="relative border-t border-gray-800 pt-3 px-0 pb-2">
          <button
            onClick={toggleDropdown}
            className="flex items-center text-gray-400 focus:outline-none transition-all hover:text-white w-full group/btn"
          >
            {userInfo ? (
              <div className="flex items-center w-full">
                <div className="w-[96px] flex justify-center shrink-0">
                  <div className="w-12 h-12 rounded-none bg-orange-600 flex items-center justify-center text-white font-semibold text-xl shadow-none">
                    {userInfo.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <span className="nav-item-name font-medium truncate w-28 whitespace-nowrap text-left group-hover/btn:text-orange-500">
                  {userInfo.username}
                </span>
                <svg
                  className={`nav-item-name h-5 w-5 ml-auto mr-4 transition-transform text-gray-500 group-hover/btn:text-white ${dropdownOpen ? "rotate-180" : ""
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            ) : (
              <></>
            )}
          </button>

          {dropdownOpen && userInfo && (
            <ul
              className={`absolute bottom-20 left-[96px] p-3 space-y-2 bg-[#101010] border border-gray-800 text-gray-300 rounded-none w-48 shadow-2xl z-[9999]`}
            >
              <li>
                <Link
                  to="/profile"
                  className="block px-4 py-3 hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={logoutHandler}
                  className="block w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors text-sm font-medium text-red-500 hover:text-red-400"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}

          {!userInfo && (
            <ul className="flex flex-col space-y-1.5 mt-2">
              <li>
                <Link
                  to="/login"
                  className="flex items-center text-gray-400 hover:text-white transition-colors py-2 group/link relative"
                >
                  <div className="w-[96px] flex justify-center shrink-0">
                    <AiOutlineLogin size={30} className="transform group-hover/link:scale-110 transition-transform" />
                  </div>
                  <span className="nav-item-name font-medium whitespace-nowrap text-sm group-hover/link:text-orange-500">Login</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="flex items-center text-gray-400 hover:text-white transition-colors py-2 group/link relative"
                >
                  <div className="w-[96px] flex justify-center shrink-0">
                    <AiOutlineUserAdd size={30} className="transform group-hover/link:scale-110 transition-transform" />
                  </div>
                  <span className="nav-item-name font-medium whitespace-nowrap text-sm group-hover/link:text-orange-500">
                    Register
                  </span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg text-white py-3 px-6 flex justify-between items-center z-[9999] border-t border-gray-800 rounded-none shadow-2xl">
        <Link to="/" className="flex flex-col items-center gap-1 group">
          <AiOutlineHome size={22} className="group-hover:text-orange-500 transition-colors" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link to="/shop" className="flex flex-col items-center gap-1 group">
          <AiOutlineShopping size={22} className="group-hover:text-orange-500 transition-colors" />
          <span className="text-[10px] font-medium">Shop</span>
        </Link>
        <Link to="/cart" className="flex flex-col items-center gap-1 relative group">
          <AiOutlineShoppingCart size={22} className="group-hover:text-orange-500 transition-colors" />
          <span className="text-[10px] font-medium">Cart</span>
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-2 px-1.5 py-0.5 text-[9px] font-medium text-white bg-orange-600 rounded-none animate-pulse">
              {cartItems.reduce((a, c) => a + c.qty, 0)}
            </span>
          )}
        </Link>
        <Link to="/favorite" className="flex flex-col items-center gap-1 relative group">
          <FaHeart size={18} className="group-hover:text-orange-500 transition-colors" />
          <span className="text-[10px] font-medium">Saved</span>
          <FavoritesCount />
        </Link>
        <Link to="/faq" className="flex flex-col items-center gap-1 group">
          <AiOutlineQuestionCircle size={22} className="group-hover:text-orange-500 transition-colors" />
          <span className="text-[10px] font-medium">FAQ</span>
        </Link>
        {showMessagesLink && (
          <Link to="/messages" className="flex flex-col items-center gap-1 group">
            <AiOutlineMessage size={22} className="group-hover:text-orange-500 transition-colors" />
            <span className="text-[10px] font-medium">Messages</span>
          </Link>
        )}
        {userInfo ? (
          <Link to="/profile" className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 rounded-none bg-orange-600 flex items-center justify-center text-[10px] font-medium">
              {userInfo.username.charAt(0).toUpperCase()}
            </div>
            <span className="text-[10px] font-medium truncate w-12 text-center">Account</span>
          </Link>
        ) : (
          <Link to="/login" className="flex flex-col items-center gap-1 group">
            <AiOutlineLogin size={22} className="group-hover:text-orange-500 transition-colors" />
            <span className="text-[10px] font-medium">Login</span>
          </Link>
        )}
      </div>
    </>
  );
};

export default Navigation;
