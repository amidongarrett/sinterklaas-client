'use client';

import { useEffect, useState } from 'react';
import { drawNames, getDrawResults } from '@/lib/groupApi';
import { PLACEHOLDER_GROUP_ID } from '@/lib/placeholderGroup';
import ErrorBanner from '@/components/wishlist/ErrorBanner';

export default function AdminDrawPage() {
  const [assignments, setAssignments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawing, setDrawing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getDrawResults(PLACEHOLDER_GROUP_ID)
      .then((data) => {
        if (!cancelled) setAssignments(data.assignments ?? null);
      })
      .catch(() => {
        // No existing draw results — that's fine, not an error
        if (!cancelled) setAssignments(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDraw() {
    setDrawing(true);
    setError(null);
    try {
      const data = await drawNames(PLACEHOLDER_GROUP_ID);
      setAssignments(data.assignments ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setDrawing(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-red-800 dark:text-red-200">Name Drawing</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Generate or re-roll the Secret Sinterklaas assignments.
        </p>
      </header>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      <div className="flex gap-3">
        <button
          onClick={handleDraw}
          disabled={drawing}
          className="rounded-lg bg-red-700 hover:bg-red-800 active:bg-red-900 disabled:opacity-60 text-white font-semibold px-5 py-2 transition-colors"
        >
          {drawing ? 'Drawing…' : 'Generate Assignments'}
        </button>
        {assignments && assignments.length > 0 && (
          <button
            onClick={handleDraw}
            disabled={drawing}
            className="rounded-lg border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-60 font-semibold px-5 py-2 transition-colors"
          >
            Re-roll
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
        </div>
      ) : assignments && assignments.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase text-xs tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Giver</th>
                <th className="text-left px-4 py-3 font-semibold">Receiver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {assignments.map((a, i) => (
                <tr key={i} className="bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100 font-medium">{a.giverName}</td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{a.receiverName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : assignments !== null ? (
        <p className="text-zinc-500 dark:text-zinc-400 text-sm py-4 text-center">
          No assignments yet. Click &ldquo;Generate Assignments&rdquo; to run the draw.
        </p>
      ) : null}
    </main>
  );
}
