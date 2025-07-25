'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-6 mt-auto">
      <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-between items-center text-sm">
        <div className="flex gap-4">
          <Link href="https://codeweave.co/how-it-works" className="hover:underline">About</Link>
          <Link href="#" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</Link>
          <Link href="https://codeweave.co/contact" className="hover:underline">Contact</Link>
          <Link href="#" className="hover:underline">Privacy</Link>
        </div>
        <div>&copy; {new Date().getFullYear()} CodeWeave</div>
      </div>
    </footer>
  );
}
