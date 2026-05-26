'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import {
  getItems,
  addItem,
  updateItem,
  deleteItem,
  claimItem,
  unclaimItem,
} from '@/lib/wishlistApi';
import AddItemForm from '@/components/wishlist/AddItemForm';
import WishlistItemList from '@/components/wishlist/WishlistItemList';
import ErrorBanner from '@/components/wishlist/ErrorBanner';
import AuthGuard from '@/components/AuthGuard';

export default function WishlistPage({ params }) {
  const { userId } = use(params);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [busyItemId, setBusyItemId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getItems(userId)
      .then((fetched) => {
        if (!cancelled) setItems(fetched);
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
  }, [userId]);

  async function handleAdd(body) {
    setSubmitting(true);
    setActionError(null);
    try {
      const newItem = await addItem(userId, body);
      setItems((prev) => [...prev, newItem]);
    } catch (err) {
      setActionError(err.message);
      throw err; // re-throw so AddItemForm does not clear itself
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(itemId, body) {
    setBusyItemId(itemId);
    setActionError(null);
    try {
      const updated = await updateItem(userId, itemId, body);
      setItems((prev) => prev.map((i) => (i.id === itemId ? updated : i)));
    } catch (err) {
      setActionError(err.message);
      throw err;
    } finally {
      setBusyItemId(null);
    }
  }

  async function handleDelete(itemId) {
    setBusyItemId(itemId);
    setActionError(null);
    try {
      await deleteItem(userId, itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyItemId(null);
    }
  }

  async function handleClaim(itemId) {
    setBusyItemId(itemId);
    setActionError(null);
    try {
      const updated = await claimItem(userId, itemId);
      setItems((prev) => prev.map((i) => (i.id === itemId ? updated : i)));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyItemId(null);
    }
  }

  async function handleUnclaim(itemId) {
    setBusyItemId(itemId);
    setActionError(null);
    try {
      const updated = await unclaimItem(userId, itemId);
      setItems((prev) => prev.map((i) => (i.id === itemId ? updated : i)));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyItemId(null);
    }
  }

  return (
    <AuthGuard>
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-amber-900">Wishlist</h1>
        <p className="text-sm text-gray-500">
          for <span className="font-medium text-gray-700">{userId}</span>
        </p>
      </header>

      <ErrorBanner message={error} onDismiss={() => setError(null)} />
      <ErrorBanner message={actionError} onDismiss={() => setActionError(null)} />

      <AddItemForm onAdd={handleAdd} submitting={submitting} />

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
        </div>
      ) : (
        <WishlistItemList
          items={items}
          loading={loading}
          busyItemId={busyItemId}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onClaim={handleClaim}
          onUnclaim={handleUnclaim}
        />
      )}
    </main>
    </AuthGuard>
  );
}
