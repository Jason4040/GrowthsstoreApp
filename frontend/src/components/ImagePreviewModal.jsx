import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const ImagePreviewModal = ({ isOpen, onClose, images = [], initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  if (!isOpen) return null;

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[99999] animate-fadeIn">
      <div 
        className="fixed inset-0 bg-white dark:bg-black/90 backdrop-blur-sm transition-opacity cursor-pointer"
        onClick={onClose}
      ></div>
      <div className="relative z-10 max-w-5xl w-full mx-4 flex flex-col items-center justify-center">
        <button
          className="absolute -top-12 right-0 text-gray-600 dark:text-gray-400 hover:text-white transition-colors focus:outline-none bg-white dark:bg-black/50 p-2 rounded-full z-20"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <div className="relative flex items-center justify-center w-full">
          {images.length > 1 && (
            <button 
              onClick={handlePrev}
              className="absolute left-0 md:-left-12 text-gray-400 hover:text-white p-2 focus:outline-none bg-black/50 rounded-full z-20"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          <img 
            src={images[currentIndex]} 
            alt={`Preview ${currentIndex + 1}`} 
            className="max-h-[85vh] w-auto max-w-full rounded-lg shadow-2xl object-contain border border-gray-200 dark:border-gray-800"
          />

          {images.length > 1 && (
            <button 
              onClick={handleNext}
              className="absolute right-0 md:-right-12 text-gray-400 hover:text-white p-2 focus:outline-none bg-black/50 rounded-full z-20"
            >
              <ChevronRight size={32} />
            </button>
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-4 flex flex-col items-center gap-4">
            <div className="flex gap-2 overflow-x-auto max-w-full pb-2 px-2 snap-x scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`relative shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all snap-center ${
                    currentIndex === idx
                      ? "border-orange-500 scale-110 opacity-100 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="text-white font-medium bg-black/50 px-4 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreviewModal;
