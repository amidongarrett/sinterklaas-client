'use client';

import { useState } from 'react';

function parseLinks(raw) {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AddItemForm({ onAdd, submitting }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [linksRaw, setLinksRaw] = useState('');
  const [nameError, setNameError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setNameError('Name is required.');
      return;
    }
    setNameError(null);

    const body = { name: name.trim() };
    if (description.trim()) body.description = description.trim();
    const links = parseLinks(linksRaw);
    if (links.length > 0) body.links = links;

    await onAdd(body);
    // Clear form on success — onAdd throws on error, so this only runs on success
    setName('');
    setDescription('');
    setLinksRaw('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-amber-300 bg-amber-50 p-4 space-y-3"
    >
      <h2 className="text-lg font-semibold text-amber-900">Add a wish</h2>

      <div>
        <label className="block text-sm font-medium text-amber-800 mb-1" htmlFor="item-name">
          Name <span className="text-red-600">*</span>
        </label>
        <input
          id="item-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError(null);
          }}
          placeholder="e.g. Chocolate letter"
          className="w-full rounded border border-amber-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        {nameError && <p className="mt-1 text-xs text-red-600">{nameError}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-amber-800 mb-1" htmlFor="item-desc">
          Description <span className="text-amber-500 font-normal">(optional)</span>
        </label>
        <textarea
          id="item-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Any details or preferences..."
          rows={2}
          className="w-full rounded border border-amber-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-amber-800 mb-1" htmlFor="item-links">
          Links <span className="text-amber-500 font-normal">(optional, comma or newline separated)</span>
        </label>
        <textarea
          id="item-links"
          value={linksRaw}
          onChange={(e) => setLinksRaw(e.target.value)}
          placeholder="https://..."
          rows={2}
          className="w-full rounded border border-amber-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center gap-2 rounded bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
      >
        {submitting && (
          <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        )}
        Add wish
      </button>
    </form>
  );
}
