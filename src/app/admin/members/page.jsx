'use client';

import { useEffect, useState } from 'react';
import { getGroupMembers, deleteGroupMember } from '@/lib/groupApi';
import { PLACEHOLDER_GROUP_ID } from '@/lib/placeholderGroup';
import ErrorBanner from '@/components/wishlist/ErrorBanner';

export default function AdminMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

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

  async function handleRemove(userId) {
    setRemovingId(userId);
    setError(null);
    try {
      await deleteGroupMember(PLACEHOLDER_GROUP_ID, userId);
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
      setConfirmingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-red-800 dark:text-red-200">Delete Users</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Remove members from the group.</p>
      </header>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
        </div>
      ) : members.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400 text-sm py-8 text-center">No members found.</p>
      ) : (
        <ul className="space-y-2">
          {members.map((member) => (
            <li
              key={member.userId}
              className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{member.displayName}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">{member.email}</p>
              </div>

              {confirmingId === member.userId ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleRemove(member.userId)}
                    disabled={removingId === member.userId}
                    className="rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold px-3 py-1.5 transition-colors"
                  >
                    {removingId === member.userId ? 'Removing…' : 'Confirm'}
                  </button>
                  <button
                    onClick={() => setConfirmingId(null)}
                    className="rounded-lg border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-sm font-semibold px-3 py-1.5 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmingId(member.userId)}
                  className="shrink-0 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-semibold px-3 py-1.5 transition-colors"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
