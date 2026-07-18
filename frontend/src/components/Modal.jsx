import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
      <div 
        className="fixed inset-0 bg-white dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative bg-gray-100 dark:bg-white dark:bg-[#151515] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl z-10 min-w-[300px] max-w-lg w-full mx-4 transform transition-all">
        <button
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors focus:outline-none"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <div className="mt-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
