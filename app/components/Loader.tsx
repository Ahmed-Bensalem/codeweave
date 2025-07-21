'use client';

import { FaSpinner } from 'react-icons/fa';

export default function Loader() {
  return (
    <div className="flex justify-center mt-6">
      <FaSpinner className="animate-spin h-6 w-6 text-blue-600 dark:text-blue-400" />
    </div>
  );
}
