import { useSelector, useDispatch } from "react-redux";
import { setBackendDown } from "../redux/features/system/serverStatusSlice";
import { BASE_URL } from "../redux/constants";

const UnderMaintenance = () => {
  const { isBackendDown } = useSelector((state) => state.serverStatus);
  const dispatch = useDispatch();

  const handleRetry = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/config/paypal`, { credentials: "include" });
      if (res.ok || res.status < 500) {
        dispatch(setBackendDown(false));
        window.location.reload();
      }
    } catch (error) {
      console.log("Server still unreachable...");
    }
  };

  if (!isBackendDown) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white p-6 transition-colors duration-300">
      <div className="max-w-2xl w-full flex flex-col items-center text-center">
        <img
          src="https://barcampvientiane.org/wp-content/uploads/2022/12/Under-Maintenance.jpg"
          alt="Under Maintenance"
          className="w-full max-w-lg h-auto object-contain rounded-2xl shadow-2xl mb-8 border border-gray-200 dark:border-gray-800"
        />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          We'll Be Right Back!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-md mb-8">
          Our servers are currently undergoing maintenance or are temporarily unavailable. Please check back in a few moments.
        </p>
        <button
          onClick={handleRetry}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 text-sm uppercase tracking-widest"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
};

export default UnderMaintenance;
