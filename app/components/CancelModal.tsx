interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export default function CancelModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: CancelModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Confirm Cancellation
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to cancel your subscription? You will lose
          access to premium features.
        </p>
        <div className="flex justify-end gap-3 items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Close
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            {loading ? "Canceling..." : "Confirm Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
