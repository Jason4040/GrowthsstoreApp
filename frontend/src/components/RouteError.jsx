import { useNavigate, useRouteError, isRouteErrorResponse } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const RouteError = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error(error);

  const message = isRouteErrorResponse(error)
    ? error.statusText || `Error ${error.status}`
    : error?.message;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-center px-4">
      <AlertTriangle className="w-12 h-12 text-orange-500 mb-4" />
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
        Something went wrong
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        {message || "An unexpected error occurred. Please try refreshing the page."}
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/")}
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 px-6 transition-all active:scale-95"
        >
          Go Home
        </button>
        <button
          onClick={() => window.location.reload()}
          className="border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium py-2.5 px-6 transition-all active:scale-95"
        >
          Reload
        </button>
      </div>
    </div>
  );
};

export default RouteError;
