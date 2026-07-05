import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery } from "../redux/api/usersApiSlice";
import { setCredentials } from "../redux/features/auth/authSlice";
import Loader from "./Loader";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: meData, isLoading, isFetching } = useGetMeQuery(undefined, {
    skip: !!userInfo,
  });

  useEffect(() => {
    if (meData) {
      const isDifferent = !userInfo || userInfo._id !== meData._id || userInfo.email !== meData.email;
      if (isDifferent) {
        dispatch(setCredentials({ ...meData }));
      }
    }
  }, [meData, userInfo, dispatch]);

  if (!userInfo && (isLoading || isFetching)) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader />
      </div>
    );
  }

  return userInfo ? <Outlet /> : <Navigate to={`/login?redirect=${location.pathname}`} replace />;
};

export default PrivateRoute;
