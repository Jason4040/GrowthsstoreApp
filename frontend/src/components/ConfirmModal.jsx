import Modal from "./Modal";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title || "Confirm Action"}</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-8">{message || "Are you sure you want to proceed?"}</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-800 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium transition-colors shadow-lg"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
