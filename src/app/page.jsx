'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = userId.trim();
    if (!trimmed) {
      setError('Please enter a user ID to continue.');
      return;
    }
    setError('');
    router.push('/wishlists/' + trimmed);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-700 dark:bg-red-900 px-4">
      <main className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center gap-6 text-center">
        <p className="text-6xl leading-none" aria-hidden="true">
          🎅 🎁 ⭐
        </p>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-red-800 dark:text-red-200">
            Sinterklaas Wishlist
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Create and share your Sinterklaas wish list
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <input
            type="text"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              if (error) setError('');
            }}
            placeholder="Enter your user ID"
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {error && (
            <p className="text-red-500 text-sm text-left">{error}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-semibold py-2 transition-colors"
          >
            View My Wishlist
          </button>
        </form>
      </main>
    </div>
  );
}
