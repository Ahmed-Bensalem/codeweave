'use client';

interface ToolCardProps {
  name: string;
  isActive: boolean;
  onSelect: () => void;
}

export default function ToolCard({ name, isActive, onSelect }: ToolCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`px-4 py-2 rounded-md border transition font-semibold ${
        isActive
          ? 'bg-purple-600 text-white border-purple-600'
          : 'bg-white text-gray-700 border-gray-300 hover:border-purple-600 hover:text-purple-600 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:border-purple-400'
      }`}
    >
      {name}
    </button>
  );
}
