import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navigation from "./pages/Auth/Navigation";
import TopAnnouncement from "./components/TopAnnouncement";
import SocialSidebar from "./components/SocialSidebar";
import Footer from "./components/Footer";
import { ToastContainer, toast } from "react-toastify";
import { useGetMeQuery } from "./redux/api/usersApiSlice";
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

  useEffect(() => {
    if (meData) {
      const isDifferent = !userInfo || userInfo._id !== meData._id || userInfo.email !== meData.email;
      if (isDifferent) {
        dispatch(setCredentials({ ...meData }));
      }
    }
  }, [meData, userInfo, dispatch]);

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
      <TopAnnouncement />
      <Navigation />
      <SocialSidebar />
      <main className="py-3 md:ml-[96px] min-h-screen flex flex-col justify-between">
        <div className="flex-grow">
          <Outlet />
        </div>
        <Footer />
      </main>
    </>
  );
};

export default App;
