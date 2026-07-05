import { X } from "lucide-react";

const ImagePreviewModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[99999] animate-fadeIn">
      <div 
        className="fixed inset-0 bg-white dark:bg-black/90 backdrop-blur-sm transition-opacity cursor-pointer"
        onClick={onClose}
      ></div>
      <div className="relative z-10 max-w-5xl w-full mx-4 flex items-center justify-center">
        <button
          className="absolute -top-12 right-0 text-gray-600 dark:text-gray-400 hover:text-white transition-colors focus:outline-none bg-white dark:bg-black/50 p-2 rounded-full"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <img 
          src={imageUrl} 
          alt="Preview" 
          className="max-h-[85vh] w-auto max-w-full rounded-lg shadow-2xl object-contain border border-gray-200 dark:border-gray-800"
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
