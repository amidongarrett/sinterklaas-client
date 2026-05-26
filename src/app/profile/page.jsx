'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <main className="mx-auto max-w-md px-4 py-8 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-red-800 dark:text-red-200">My Profile</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your profile, partner, children, and wishlist.</p>
        </header>

        <Link
          href={'/wishlists/' + user?._id}
          className="flex items-center justify-center gap-2 w-full rounded-lg bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-semibold py-3 transition-colors"
        >
          <span aria-hidden="true">🎁</span>
          My Wishlist
        </Link>

        <nav className="flex flex-col gap-3">
          <Link
            href="/profile/edit"
            className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-zinc-800 dark:text-zinc-200 hover:bg-red-50 dark:hover:bg-zinc-700 transition-colors"
          >
            <span className="font-medium">Update Profile</span>
            <span className="text-zinc-400 text-sm" aria-hidden="true">›</span>
          </Link>
          <Link
            href="/profile/partner"
            className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-zinc-800 dark:text-zinc-200 hover:bg-red-50 dark:hover:bg-zinc-700 transition-colors"
          >
            <span className="font-medium">Partner</span>
            <span className="text-zinc-400 text-sm" aria-hidden="true">›</span>
          </Link>
          <Link
            href="/profile/children"
            className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-zinc-800 dark:text-zinc-200 hover:bg-red-50 dark:hover:bg-zinc-700 transition-colors"
          >
            <span className="font-medium">Add Children</span>
            <span className="text-zinc-400 text-sm" aria-hidden="true">›</span>
          </Link>
        </nav>
      </main>
    </AuthGuard>
  );
}
