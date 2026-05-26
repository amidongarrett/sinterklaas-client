'use client';

import { useState } from 'react';
import { updateProfile } from '@/lib/userApi';
import { PLACEHOLDER_USER_ID } from '@/lib/placeholderUser';
import ErrorBanner from '@/components/wishlist/ErrorBanner';

export default function EditProfilePage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      await updateProfile(PLACEHOLDER_USER_ID, { displayName, email });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-red-800 dark:text-red-200">Update Profile</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Change your display name or email address.</p>
      </header>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {success && (
        <div className="rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-green-800 text-sm">
          Profile updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="displayName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => { setDisplayName(e.target.value); setSuccess(false); }}
            placeholder="Your display name"
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setSuccess(false); }}
            placeholder="your@email.com"
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-60 text-white font-semibold py-2 transition-colors"
        >
          {submitting ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </main>
  );
}
