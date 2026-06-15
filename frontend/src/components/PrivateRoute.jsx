import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery } from "../redux/api/usersApiSlice";
import { setCredentials } from "../redux/features/auth/authSlice";
import Loader from "./Loader";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: meData, isLoading, isFetching } = useGetMeQuery(undefined, {
    skip: !!userInfo,
  });

  useEffect(() => {
    if (meData && !userInfo) {
      dispatch(setCredentials({ ...meData }));
    }
  }, [meData, userInfo, dispatch]);

  if (!userInfo && (isLoading || isFetching)) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader />
      </div>
    );
  }

  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
