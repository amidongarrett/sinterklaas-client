'use client';

import { useState } from 'react';
import { addChild } from '@/lib/userApi';
import { PLACEHOLDER_USER_ID } from '@/lib/placeholderUser';
import ErrorBanner from '@/components/wishlist/ErrorBanner';

export default function ChildrenPage() {
  const [children, setChildren] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const body = { displayName };
      if (email.trim()) body.email = email.trim();
      const newChild = await addChild(PLACEHOLDER_USER_ID, body);
      setChildren((prev) => [...prev, newChild]);
      setDisplayName('');
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-red-800 dark:text-red-200">Add Children</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Add child accounts to your family.</p>
      </header>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="childName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Child&apos;s Name <span className="text-red-500">*</span>
          </label>
          <input
            id="childName"
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Child's display name"
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="childEmail" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Child&apos;s Email <span className="text-zinc-400 font-normal">(optional)</span>
          </label>
          <input
            id="childEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="child@email.com"
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-60 text-white font-semibold py-2 transition-colors"
        >
          {submitting ? 'Adding…' : 'Add Child'}
        </button>
      </form>

      {children.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Added this session</h2>
          <ul className="space-y-1">
            {children.map((child, i) => (
              <li
                key={child.id ?? i}
                className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-zinc-800 dark:text-zinc-200"
              >
                {child.displayName}
                {child.email && <span className="ml-2 text-zinc-400">({child.email})</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
