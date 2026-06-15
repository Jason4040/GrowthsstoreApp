import { useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navigation from "./pages/Auth/Navigation";
import SocialSidebar from "./components/SocialSidebar";
import { ToastContainer } from "react-toastify";
import { useGetMeQuery } from "./redux/api/usersApiSlice";
import { setCredentials } from "./redux/features/auth/authSlice";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // Auto-login: If user has a cookie but userInfo is not set in redux (e.g. on load / after Google redirect)
  const { data: meData } = useGetMeQuery(undefined, {
    skip: !!userInfo,
  });

  useEffect(() => {
    if (meData && !userInfo) {
      dispatch(setCredentials({ ...meData }));
    }
  }, [meData, userInfo, dispatch]);
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="!bg-[#101010] !border !border-gray-800 !rounded-none !shadow-none !text-white !font-sans"
        bodyClassName="!text-sm !text-white !font-medium"
        closeButton={({ closeToast }) => (
          <button
            onClick={closeToast}
            className="text-gray-600 hover:text-white transition-colors text-lg leading-none px-1"
          >
            ✕
          </button>
        )}
      />
      <Navigation />
      <SocialSidebar />
      <main className="py-3 md:ml-[96px]">
        <Outlet />
      </main>
    </>
  );
};

export default App;
