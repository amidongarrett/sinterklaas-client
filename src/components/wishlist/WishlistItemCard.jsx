'use client';

import { useState } from 'react';

function parseLinks(raw) {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function WishlistItemCard({
  item,
  busyItemId,
  onUpdate,
  onDelete,
  onClaim,
  onUnclaim,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(item.name);
  const [editDescription, setEditDescription] = useState(item.description ?? '');
  const [editLinksRaw, setEditLinksRaw] = useState(item.links.join('\n'));
  const [editNameError, setEditNameError] = useState(null);

  const busy = busyItemId === item.id;

  function enterEdit() {
    setEditName(item.name);
    setEditDescription(item.description ?? '');
    setEditLinksRaw(item.links.join('\n'));
    setEditNameError(null);
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setEditNameError(null);
  }

  async function handleSave() {
    if (!editName.trim()) {
      setEditNameError('Name is required.');
      return;
    }
    setEditNameError(null);
    const body = {
      name: editName.trim(),
      description: editDescription.trim() || null,
      links: parseLinks(editLinksRaw),
    };
    await onUpdate(item.id, body);
    setIsEditing(false);
  }

  const isClaimed = item.claimedBy !== null;

  if (isEditing) {
    return (
      <div className="rounded-lg border border-amber-300 bg-white p-4 space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={editName}
            onChange={(e) => {
              setEditName(e.target.value);
              if (editNameError) setEditNameError(null);
            }}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {editNameError && <p className="mt-1 text-xs text-red-600">{editNameError}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={2}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Links (comma or newline separated)
          </label>
          <textarea
            value={editLinksRaw}
            onChange={(e) => setEditLinksRaw(e.target.value)}
            rows={2}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={busy}
            className="flex items-center gap-1.5 rounded bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
          >
            {busy && (
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            Save
          </button>
          <button
            onClick={cancelEdit}
            disabled={busy}
            className="rounded border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{item.name}</p>
          {item.description && (
            <p className="mt-0.5 text-sm text-gray-600">{item.description}</p>
          )}
          {item.links.length > 0 && (
            <ul className="mt-1 space-y-0.5">
              {item.links.map((link) => (
                <li key={link}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline break-all"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {isClaimed && (
          <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
            Claimed
          </span>
        )}
      </div>

      {awaitingConfirm ? (
        <div className="flex items-center gap-2 pt-1">
          <p className="text-xs text-gray-700">Delete this item?</p>
          <button
            onClick={async () => {
              await onDelete(item.id);
              setAwaitingConfirm(false);
            }}
            disabled={busy}
            className="flex items-center gap-1 rounded bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {busy && (
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            Confirm
          </button>
          <button
            onClick={() => setAwaitingConfirm(false)}
            disabled={busy}
            className="rounded border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={enterEdit}
            disabled={busy}
            className="rounded border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Edit
          </button>
          <button
            onClick={() => setAwaitingConfirm(true)}
            disabled={busy}
            className="rounded border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            Delete
          </button>
          {isClaimed ? (
            <button
              onClick={() => onUnclaim(item.id)}
              disabled={busy}
              className="flex items-center gap-1 rounded border border-green-300 px-2.5 py-1 text-xs font-semibold text-green-800 hover:bg-green-50 disabled:opacity-60"
            >
              {busy && (
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-green-700 border-t-transparent" />
              )}
              Unclaim
            </button>
          ) : (
            <button
              onClick={() => onClaim(item.id)}
              disabled={busy}
              className="flex items-center gap-1 rounded bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-60"
            >
              {busy && (
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              Claim
            </button>
          )}
        </div>
      )}
    </div>
  );
}
