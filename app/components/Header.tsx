'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
  useUser,
} from '@clerk/nextjs';
import UpgradeButton from './UpgradeButton';

function ShowUpgradeButtonIfFree() {
  const { user, isLoaded } = useUser();
  if (!isLoaded || !user) return null;

  const plan = user.publicMetadata?.plan;
  console.log("🔍 Clerk plan:", plan); // Debugging

  if (plan === 'pro') {
    return (
      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full dark:bg-green-800 dark:text-green-100">
        ✅ Pro User
      </span>
    );
  }

  return <UpgradeButton />;
}

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = stored === 'dark' || (!stored && prefersDark);

    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  return (
    <header className="w-full px-4 py-3 border-b bg-white dark:bg-gray-900 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Logo + Brand */}
      <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
        <Image src="/Logo.png" alt="CodeWeave Logo" width={48} height={48} className="h-12 w-12" priority />
        <span className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-white transition">
          CodeWeave
        </span>
      </Link>

      {/* Right side: dark mode toggle + auth */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleDark}
          className="text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        >
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>

        <SignedOut>
          <div className="flex gap-2 text-sm">
            <SignInButton mode="modal">
              <button className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="flex items-center gap-3">
            <ShowUpgradeButtonIfFree />
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </div>
    </header>
  );
}
