'use client';

import { useEffect, useState } from 'react';
import { getPartner, invitePartner, unlinkPartner } from '@/lib/userApi';
import ErrorBanner from '@/components/wishlist/ErrorBanner';
import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/context/AuthContext';

export default function PartnerPage() {
  const { user } = useAuth();
  const [partner, setPartner] = useState(undefined); // undefined = loading, null = none
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  function fetchPartner() {
    setLoading(true);
    setError(null);
    getPartner(user?._id)
      .then((data) => setPartner(data ?? null))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchPartner();
  }, []);

  async function handleInvite(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await invitePartner(user?._id, inviteEmail);
      setInviteEmail('');
      setSuccess('Partner invitation sent.');
      fetchPartner();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUnlink() {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await unlinkPartner(user?._id);
      setSuccess('Partner unlinked.');
      fetchPartner();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthGuard>
    <main className="mx-auto max-w-md px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-red-800 dark:text-red-200">Partner</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your linked partner.</p>
      </header>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      {success && (
        <div className="rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-green-800 text-sm">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
        </div>
      ) : partner ? (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{partner.displayName}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Current partner</p>
          </div>
          <button
            onClick={handleUnlink}
            disabled={submitting}
            className="rounded-lg border border-red-300 text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-60 text-sm font-semibold px-3 py-1.5 transition-colors"
          >
            {submitting ? 'Unlinking…' : 'Unlink'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleInvite} className="flex flex-col gap-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No partner linked. Enter their email to send an invite.</p>
          <div className="flex flex-col gap-1">
            <label htmlFor="inviteEmail" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Partner&apos;s Email
            </label>
            <input
              id="inviteEmail"
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="partner@email.com"
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-60 text-white font-semibold py-2 transition-colors"
          >
            {submitting ? 'Sending…' : 'Send Invite'}
          </button>
        </form>
      )}
    </main>
    </AuthGuard>
  );
}
