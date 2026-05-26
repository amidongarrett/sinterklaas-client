'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getGroupMembers } from '@/lib/groupApi';
import { PLACEHOLDER_GROUP_ID } from '@/lib/placeholderGroup';
import ErrorBanner from '@/components/wishlist/ErrorBanner';
import AuthGuard from '@/components/AuthGuard';

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5 animate-pulse">
      <div className="h-5 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded mb-3" />
      <div className="h-4 w-1/2 bg-zinc-100 dark:bg-zinc-600 rounded mb-4" />
      <div className="h-8 w-28 bg-amber-100 dark:bg-amber-900/30 rounded-lg" />
    </div>
  );
}

export default function DashboardPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getGroupMembers(PLACEHOLDER_GROUP_ID)
      .then((data) => {
        if (!cancelled) setMembers(data.members ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthGuard>
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold text-red-800 dark:text-red-200">Group Dashboard</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          All members of your Sinterklaas group
        </p>
      </header>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : members.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400 text-sm py-12 text-center">
          No members in this group yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {members.map((member) => (
            <div
              key={member.userId}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {member.displayName}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                  {member.email}
                </p>
              </div>
              <Link
                href={`/wishlists/${encodeURIComponent(member.userId)}`}
                className="inline-block rounded-lg bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-sm font-semibold px-3 py-1.5 transition-colors self-start"
              >
                View Wishlist
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
    </AuthGuard>
  );
}
