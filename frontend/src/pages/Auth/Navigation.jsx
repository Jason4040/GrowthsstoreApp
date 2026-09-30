import { useState, useEffect } from "react";
import {
  Home,
  ShoppingBag,
  LogIn,
  UserPlus,
  ShoppingCart,
  Database,
  ListOrdered,
  Users,
  FileText,
  MessageSquare,
  HelpCircle,
  DollarSign,
  Heart,
  LayoutDashboard,
  Layers,
  Menu,
  X,
  User,
  Sun,
  Moon,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import { setCurrency } from "../../redux/features/currency/currencySlice";
import FavoritesCount from "../Products/FavoritesCount";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import { switchLanguage } from "../../Utils/translateService";

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
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [activeLang, setActiveLang] = useState(localStorage.getItem('appLang') || 'en');

  const handleLangChange = (langCode) => {
    setActiveLang(langCode);
    switchLanguage(langCode);
  };

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    } else {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    }
  };

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
      dispatch({ type: "api/resetApiState" }); // Manually dispatch the reset action if apiSlice is not imported
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Floating Action Buttons: Theme Toggle + Language Switcher */}
      <div className="fixed bottom-[80px] md:bottom-6 right-4 md:right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">
        {/* Theme Toggle */}
        <div
          className="pointer-events-auto bg-white dark:bg-[#1A1A1A] rounded-full p-3 border border-gray-200 dark:border-gray-800 shadow-2xl flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <img src="/icons/them mode.png" className="w-[22px] h-[22px] object-contain" alt="Light Mode" /> : <img src="/icons/them mode.png" className="w-[22px] h-[22px] object-contain" alt="Dark Mode" />}
        </div>



        {/* Hidden Google Translate target is in index.html body */}
      </div>

      {/* Desktop Sidebar */}
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col py-3 text-gray-900 dark:text-white bg-white dark:bg-black h-[100vh] fixed top-0 left-0 border-r border-gray-200 dark:border-gray-800 rounded-none`}
        id="sidebar-menu"
      >
        <div className="flex flex-col space-y-1.5 mt-2 flex-1 min-h-0 overflow-y-auto" id="sidebar-nav-scroll">
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

          <button
            onClick={() => {
              const order = ['USD', 'UGX', 'RWF'];
              const next = order[(order.indexOf(currentCurrency) + 1) % order.length];
              dispatch(setCurrency(next));
            }}
            className="flex items-center text-left w-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2 group/link relative z-[60]"
          >
            <div className="w-[96px] flex justify-center shrink-0">
              <img src={currentCurrency === 'UGX' ? '/icons/currency-uganda.png' : currentCurrency === 'RWF' ? '/icons/currency-rwanda.png' : '/icons/currency-dollar.png'} className={`w-[26px] h-[26px] object-contain transform group-hover/link:scale-110 transition-transform ${currentCurrency !== 'USD' ? 'dark:invert' : ''}`} alt="Currency" />
            </div>
            <div className="nav-item-name flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">Currency</span>
              <span className="font-medium whitespace-nowrap text-sm group-hover/link:text-orange-500 leading-tight">
                {currentCurrency === 'USD' ? 'USD ($)' : currentCurrency === 'UGX' ? 'UGX (USh)' : 'RWF (FRw)'}
              </span>
            </div>
          </button>

          <Link
            to="/"
            className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2 group/link relative"
          >
            <div className="w-[96px] flex justify-center shrink-0">
              <img src="/icons/home.png" className="w-[30px] h-[30px] object-contain transform group-hover/link:scale-110 transition-transform dark:invert" alt="Home" />
            </div>
            <span className="nav-item-name font-medium whitespace-nowrap text-sm group-hover/link:text-orange-500">Home</span>
          </Link>

          <Link
            to="/shop"
            className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2 group/link relative"
          >
            <div className="w-[96px] flex justify-center shrink-0">
              <img src="/icons/products.png" className="w-[30px] h-[30px] object-contain transform group-hover/link:scale-110 transition-transform dark:invert" alt="Shop" />
            </div>
            <span className="nav-item-name font-medium whitespace-nowrap text-sm group-hover/link:text-orange-500">Shop</span>
          </Link>

          <Link
            to="/cart"
            className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2 group/link relative"
          >
            <div className="w-[96px] flex justify-center shrink-0">
              <div className="relative">
                <img src="/icons/cart.png" className="w-[30px] h-[30px] object-contain transform group-hover/link:scale-110 transition-transform dark:invert" alt="Cart" />
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
            className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2 group/link relative"
          >
            <div className="w-[96px] flex justify-center shrink-0">
              <div className="relative">
                <img src="/icons/savedProducts.png" className="w-[26px] h-[26px] object-contain transform group-hover/link:scale-110 transition-transform dark:invert" alt="Saved" />
                <FavoritesCount />
              </div>
            </div>
            <span className="nav-item-name font-medium whitespace-nowrap text-sm group-hover/link:text-orange-500">Saved</span>
          </Link>

          <Link
            to="/faq"
            className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2 group/link relative"
          >
            <div className="w-[96px] flex justify-center shrink-0">
              <img src="/icons/faq.png" className="w-[30px] h-[30px] object-contain transform group-hover/link:scale-110 transition-transform dark:invert" alt="FAQ" />
            </div>
            <span className="nav-item-name font-medium whitespace-nowrap text-sm group-hover/link:text-orange-500">FAQ</span>
          </Link>

          {showMessagesLink && (
            <Link
              to="/messages"
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2 group/link relative"
            >
              <div className="w-[96px] flex justify-center shrink-0">
                <img src="/icons/email.png" className="w-[30px] h-[30px] object-contain transform group-hover/link:scale-110 transition-transform dark:invert" alt="Messages" />
              </div>
              <span className="nav-item-name font-medium whitespace-nowrap text-sm group-hover/link:text-orange-500">Messages</span>
            </Link>
          )}

          {userInfo && userInfo.isAdmin && (
            <div className="flex flex-col space-y-1.5 border-t border-gray-200 dark:border-gray-800 pt-3 mt-3">
              <button
                onClick={() => setShowAdminMenu(!showAdminMenu)}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2 group/link relative w-full focus:outline-none"
              >
                <div className="w-[96px] flex justify-center shrink-0">
                  <img src="/icons/menu.png" className={`w-[28px] h-[28px] object-contain transform group-hover/link:scale-110 transition-transform dark:invert ${showAdminMenu ? 'opacity-75' : ''}`} alt="Admin Menu" />
                </div>
                <span className="nav-item-name font-semibold whitespace-nowrap text-sm group-hover/link:text-orange-500 text-gray-700 dark:text-gray-300">
                  Admin Menu
                </span>
                <svg
                  className={`nav-item-name h-4 w-4 ml-auto mr-4 transition-transform text-gray-500 group-hover/link:text-gray-900 dark:text-white ${showAdminMenu ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showAdminMenu && (
                <div className="flex flex-col space-y-1.5 bg-gray-50 dark:bg-[#1A1A1A]/80 py-2 border-y border-gray-200 dark:border-gray-800/50">
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2 group/link relative"
                  >
                    <div className="w-[96px] flex justify-center shrink-0">
                      <img src="/icons/menu.png" className="w-[24px] h-[24px] object-contain transform group-hover/link:scale-110 transition-transform dark:invert" alt="Dashboard" />
                    </div>
                    <span className="nav-item-name font-semibold whitespace-nowrap text-[13px] group-hover/link:text-orange-500 text-gray-700 dark:text-gray-300">Dashboard</span>
                  </Link>
                  <Link
                    to="/admin/allproductslist"
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2 group/link relative"
                  >
                    <div className="w-[96px] flex justify-center shrink-0">
                      <img src="/icons/products.png" className="w-[24px] h-[24px] object-contain transform group-hover/link:scale-110 transition-transform dark:invert" alt="Products" />
                    </div>
                    <span className="nav-item-name font-semibold whitespace-nowrap text-[13px] group-hover/link:text-orange-500 text-gray-700 dark:text-gray-300">Products</span>
                  </Link>
                  <Link
                    to="/admin/categorylist"
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2 group/link relative"
                  >
                    <div className="w-[96px] flex justify-center shrink-0">
                      <img src="/icons/categories.png" className="w-[24px] h-[24px] object-contain transform group-hover/link:scale-110 transition-transform dark:invert" alt="Categories" />
                    </div>
                    <span className="nav-item-name font-semibold whitespace-nowrap text-[13px] group-hover/link:text-orange-500 text-gray-700 dark:text-gray-300">Categories</span>
                  </Link>
                  <Link
                    to="/admin/orderlist"
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2 group/link relative"
                  >
                    <div className="w-[96px] flex justify-center shrink-0">
                      <img src="/icons/orders.png" className="w-[24px] h-[24px] object-contain transform group-hover/link:scale-110 transition-transform dark:invert" alt="Orders" />
                    </div>
                    <span className="nav-item-name font-semibold whitespace-nowrap text-[13px] group-hover/link:text-orange-500 text-gray-700 dark:text-gray-300">Orders</span>
                  </Link>
                  <Link
                    to="/admin/paymentproofs"
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2 group/link relative"
                  >
                    <div className="w-[96px] flex justify-center shrink-0">
                      <img src="/icons/paymentsProof.png" className="w-[24px] h-[24px] object-contain transform group-hover/link:scale-110 transition-transform dark:invert" alt="Payment Proofs" />
                    </div>
                    <span className="nav-item-name font-semibold whitespace-nowrap text-[13px] group-hover/link:text-orange-500 text-gray-700 dark:text-gray-300">Payment Proofs</span>
                  </Link>
                  <Link
                    to="/admin/userlist"
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2 group/link relative"
                  >
                    <div className="w-[96px] flex justify-center shrink-0">
                      <img src="/icons/customers.png" className="w-[24px] h-[24px] object-contain transform group-hover/link:scale-110 transition-transform dark:invert" alt="Users" />
                    </div>
                    <span className="nav-item-name font-semibold whitespace-nowrap text-[13px] group-hover/link:text-orange-500 text-gray-700 dark:text-gray-300">Users</span>
                  </Link>
                  <Link
                    to="/admin/faqmanager"
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2 group/link relative"
                  >
                    <div className="w-[96px] flex justify-center shrink-0">
                      <img src="/icons/faq.png" className="w-[24px] h-[24px] object-contain transform group-hover/link:scale-110 transition-transform dark:invert" alt="FAQ Manager" />
                    </div>
                    <span className="nav-item-name font-semibold whitespace-nowrap text-[13px] group-hover/link:text-orange-500 text-gray-700 dark:text-gray-300">FAQ Manager</span>
                  </Link>
                  <Link
                    to="/admin/announcement"
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2 group/link relative"
                  >
                    <div className="w-[96px] flex justify-center shrink-0">
                      <img src="/icons/email.png" className="w-[24px] h-[24px] object-contain transform group-hover/link:scale-110 transition-transform dark:invert" alt="Announcement" />
                    </div>
                    <span className="nav-item-name font-semibold whitespace-nowrap text-[13px] group-hover/link:text-orange-500 text-gray-700 dark:text-gray-300">Announcement</span>
                  </Link>
                  <Link
                    to="/admin/locations"
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2 group/link relative"
                  >
                    <div className="w-[96px] flex justify-center shrink-0">
                      <MapPin className="w-[22px] h-[22px] transform group-hover/link:scale-110 transition-transform" />
                    </div>
                    <span className="nav-item-name font-semibold whitespace-nowrap text-[13px] group-hover/link:text-orange-500 text-gray-700 dark:text-gray-300">Shipping Locations</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative border-t border-gray-200 dark:border-gray-800 pt-3 px-0 pb-2 shrink-0">
          <button
            onClick={toggleDropdown}
            className="flex items-center text-gray-700 dark:text-gray-300 focus:outline-none transition-all hover:text-gray-900 dark:hover:text-white w-full group/btn"
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
                  className={`nav-item-name h-5 w-5 ml-auto mr-4 transition-transform text-gray-500 group-hover/btn:text-gray-900 dark:text-white ${dropdownOpen ? "rotate-180" : ""
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
              className={`absolute bottom-20 left-[96px] p-3 space-y-2 bg-white dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-none w-48 shadow-2xl z-[9999]`}
            >
              <li>
                <Link
                  to="/profile"
                  className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium rounded-md"
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={logoutHandler}
                  className="block w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600 transition-colors text-sm font-medium rounded-md"
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
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2 group/link relative"
                >
                  <div className="w-[96px] flex justify-center shrink-0">
                    <img src="/icons/login.png" className="w-[30px] h-[30px] object-contain transform group-hover/link:scale-110 transition-transform dark:invert" alt="Login" />
                  </div>
                  <span className="nav-item-name font-medium whitespace-nowrap text-sm group-hover/link:text-orange-500">Login</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors py-2 group/link relative"
                >
                  <div className="w-[96px] flex justify-center shrink-0">
                    <img src="/icons/register.png" className="w-[30px] h-[30px] object-contain transform group-hover/link:scale-110 transition-transform dark:invert" alt="Register" />
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-black/80 backdrop-blur-lg text-gray-700 dark:text-gray-200 py-3 px-6 flex justify-between items-center z-[9999] border-t border-gray-200 dark:border-gray-800 rounded-none shadow-2xl">
        <Link to="/" onClick={() => setShowMobileMenu(false)} className="flex flex-col items-center gap-1 group">
          <img src="/icons/home.png" className="w-[22px] h-[22px] object-contain dark:invert" alt="Home" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link to="/shop" onClick={() => setShowMobileMenu(false)} className="flex flex-col items-center gap-1 group">
          <img src="/icons/products.png" className="w-[22px] h-[22px] object-contain dark:invert" alt="Shop" />
          <span className="text-[10px] font-medium">Shop</span>
        </Link>
        <Link to="/cart" onClick={() => setShowMobileMenu(false)} className="flex flex-col items-center gap-1 relative group">
          <img src="/icons/cart.png" className="w-[22px] h-[22px] object-contain dark:invert" alt="Cart" />
          <span className="text-[10px] font-medium">Cart</span>
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-2 px-1.5 py-0.5 text-[9px] font-medium text-white bg-orange-600 rounded-none animate-pulse">
              {cartItems.reduce((a, c) => a + c.qty, 0)}
            </span>
          )}
        </Link>
        <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="flex flex-col items-center gap-1 group focus:outline-none">
          {userInfo ? (
            <div className={`w-6 h-6 rounded-none flex items-center justify-center text-[10px] font-medium transition-colors ${showMobileMenu ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 group-hover:bg-orange-500 group-hover:text-white'}`}>
              {userInfo.username.charAt(0).toUpperCase()}
            </div>
          ) : (
            <img src="/icons/menu.png" className={`w-[22px] h-[22px] object-contain dark:invert ${showMobileMenu ? 'opacity-75' : ''}`} alt="Menu" />
          )}
          <span className={`text-[10px] font-medium ${showMobileMenu ? 'text-orange-500' : ''}`}>Menu</span>
        </button>
      </div>

      {/* Mobile Full Screen Menu */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 bg-white dark:bg-[#0f0f0f] z-[9998] overflow-y-auto pb-24 pt-6 px-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Menu</h2>
            <button onClick={() => setShowMobileMenu(false)} className="p-2 -mr-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-100 dark:bg-gray-800 rounded-full">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Link to="/favorite" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-xl transition-colors">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"><img src="/icons/savedProducts.png" className="w-[20px] h-[20px] object-contain dark:invert" alt="Saved" /></div> <span className="font-medium">Saved Items</span>
            </Link>
            
            <Link to="/faq" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-xl transition-colors">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"><img src="/icons/faq.png" className="w-[20px] h-[20px] object-contain dark:invert" alt="FAQ" /></div> <span className="font-medium">FAQ & Help</span>
            </Link>
            
            {showMessagesLink && (
              <Link to="/messages" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-xl transition-colors">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"><img src="/icons/email.png" className="w-[20px] h-[20px] object-contain dark:invert" alt="Messages" /></div> <span className="font-medium">Messages</span>
              </Link>
            )}

            {userInfo ? (
              <>
                <Link to="/profile" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-xl transition-colors mt-2">
                  <div className="p-2 bg-orange-600 rounded-lg"><img src="/icons/customers.png" className="w-[20px] h-[20px] object-contain dark:invert" alt="My Account" /></div> <span className="font-medium">My Account</span>
                </Link>

                {userInfo.isAdmin && (
                  <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl mt-6 overflow-hidden shadow-lg">
                    <div className="flex items-center gap-3 text-orange-500 p-4 border-b border-gray-200 dark:border-gray-800 bg-orange-500/5">
                      <img src="/icons/menu.png" className="w-[20px] h-[20px] object-contain dark:invert" alt="Admin Controls" /> <span className="font-bold tracking-wide uppercase text-sm">Admin Controls</span>
                    </div>
                    <div className="flex flex-col p-2 space-y-1">
                        <Link to="/admin/dashboard" onClick={() => setShowMobileMenu(false)} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg font-medium text-sm transition-colors">Dashboard</Link>
                        <Link to="/admin/allproductslist" onClick={() => setShowMobileMenu(false)} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg font-medium text-sm transition-colors">Products Management</Link>
                        <Link to="/admin/categorylist" onClick={() => setShowMobileMenu(false)} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg font-medium text-sm transition-colors">Categories</Link>
                        <Link to="/admin/orderlist" onClick={() => setShowMobileMenu(false)} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg font-medium text-sm transition-colors">Customer Orders</Link>
                        <Link to="/admin/paymentproofs" onClick={() => setShowMobileMenu(false)} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg font-medium text-sm transition-colors">Payment Proofs</Link>
                        <Link to="/admin/userlist" onClick={() => setShowMobileMenu(false)} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg font-medium text-sm transition-colors">User List</Link>
                        <Link to="/admin/faqmanager" onClick={() => setShowMobileMenu(false)} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg font-medium text-sm transition-colors">FAQ Manager</Link>
                        <Link to="/admin/announcement" onClick={() => setShowMobileMenu(false)} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg font-medium text-sm transition-colors">Announcements</Link>
                    </div>
                  </div>
                )}

                <button onClick={() => { logoutHandler(); setShowMobileMenu(false); }} className="flex items-center gap-4 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 p-3 rounded-xl mt-6 w-full text-left transition-colors">
                  <div className="p-2 bg-red-500/10 rounded-lg"><img src="/icons/login.png" className="w-[20px] h-[20px] object-contain rotate-180 dark:invert" alt="Logout" /></div> <span className="font-bold">Logout</span>
                </button>
              </>
            ) : (
              <div className="mt-6 flex flex-col gap-3">
                <Link to="/login" onClick={() => setShowMobileMenu(false)} className="flex items-center justify-center gap-2 text-white bg-gray-800 hover:bg-gray-700 p-4 rounded-xl font-bold transition-colors w-full">
                  <img src="/icons/login.png" className="w-[20px] h-[20px] object-contain dark:invert" alt="Login" /> Login
                </Link>
                <Link to="/register" onClick={() => setShowMobileMenu(false)} className="flex items-center justify-center gap-2 text-white bg-orange-600 hover:bg-orange-700 p-4 rounded-xl font-bold transition-colors w-full">
                  <img src="/icons/register.png" className="w-[20px] h-[20px] object-contain dark:invert" alt="Register" /> Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
