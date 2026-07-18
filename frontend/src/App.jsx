import { useEffect, Suspense } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navigation from "./pages/Auth/Navigation";
import TopAnnouncement from "./components/TopAnnouncement";
import SocialSidebar from "./components/SocialSidebar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import { ToastContainer, toast } from "react-toastify";
import { useGetMeQuery, useUserHeartbeatMutation } from "./redux/api/usersApiSlice";
import { setCredentials } from "./redux/features/auth/authSlice";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);

  const params = new URLSearchParams(location.search);
  const isGoogleAuthSuccess = params.get("google_auth") === "success";

  const { data: meData, refetch } = useGetMeQuery(undefined, {
    skip: !!userInfo && !isGoogleAuthSuccess,
  });

  const [sendHeartbeat] = useUserHeartbeatMutation();

  useEffect(() => {
    if (meData) {
      const isDifferent = !userInfo || userInfo._id !== meData._id || userInfo.email !== meData.email;
      if (isDifferent) {
        dispatch(setCredentials({ ...meData }));
      }
    }
  }, [meData, userInfo, dispatch]);

  useEffect(() => {
    if (userInfo) {
      sendHeartbeat();
      const interval = setInterval(() => {
        sendHeartbeat();
      }, 3 * 60 * 1000); // 3 minutes
      return () => clearInterval(interval);
    }
  }, [userInfo, sendHeartbeat]);

  useEffect(() => {
    if (isGoogleAuthSuccess) {
      refetch();
      toast.success("Signed in with Google successfully!");
      navigate(location.pathname, { replace: true });
    }
  }, [isGoogleAuthSuccess, refetch, navigate, location.pathname]);

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
        toastClassName="!bg-gray-50 dark:bg-[#101010] !border !border-gray-200 dark:border-gray-800 !rounded-none !shadow-none !text-gray-900 dark:text-white !font-sans"
        bodyClassName="!text-sm !text-gray-900 dark:text-white !font-medium"
        closeButton={({ closeToast }) => (
          <button
            onClick={closeToast}
            className="text-gray-600 hover:text-gray-900 dark:text-white transition-colors text-lg leading-none px-1"
          >
            ✕
          </button>
        )}
      />
      <TopAnnouncement />
      <Navigation />
      <SocialSidebar />
      <main className="py-3 md:ml-[96px] min-h-screen flex flex-col justify-between">
        <div className="flex-grow">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </div>
        <Footer />
      </main>
    </>
  );
};

export default App;
