import UpgradeButton from "./UpgradeButton";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
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
          Pro Feature – Upgrade to unlock
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Unlock unlimited access, advanced features, and priority support with
          the Pro plan to supercharge your experience!
        </p>
        <div className="flex justify-end gap-3 items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Close
          </button>
          <UpgradeButton />
        </div>
      </div>
    </div>
  );
}
