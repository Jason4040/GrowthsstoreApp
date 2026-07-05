import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to={`/login?redirect=${location.pathname}`} replace />
  );
};
export default AdminRoute;
