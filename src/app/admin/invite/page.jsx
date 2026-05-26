'use client';

import { useState } from 'react';
import { inviteGroupMember } from '@/lib/groupApi';
import { PLACEHOLDER_GROUP_ID } from '@/lib/placeholderGroup';
import ErrorBanner from '@/components/wishlist/ErrorBanner';

export default function AdminInvitePage() {
  const [inviteUrl, setInviteUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setCopied(false);
    try {
      const data = await inviteGroupMember(PLACEHOLDER_GROUP_ID);
      setInviteUrl(data.inviteUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Failed to copy to clipboard.');
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-red-800 dark:text-red-200">Invite Users</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Generate a one-time invite link to share with a new member.</p>
      </header>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full rounded-lg bg-red-700 hover:bg-red-800 active:bg-red-900 disabled:opacity-60 text-white font-semibold py-2 transition-colors"
      >
        {loading ? 'Generating…' : 'Generate Invite Link'}
      </button>

      {inviteUrl && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Invite URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className="flex-1 min-w-0 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-2 text-zinc-700 dark:text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={handleCopy}
              className="shrink-0 rounded-lg bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-sm font-semibold px-3 py-2 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
