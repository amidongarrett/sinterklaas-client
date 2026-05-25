'use client';

import WishlistItemCard from './WishlistItemCard';

export default function WishlistItemList({
  items,
  loading,
  busyItemId,
  onUpdate,
  onDelete,
  onClaim,
  onUnclaim,
}) {
  if (!loading && items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">
        No wishes yet — add one above!
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id}>
          <WishlistItemCard
            item={item}
            busyItemId={busyItemId}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onClaim={onClaim}
            onUnclaim={onUnclaim}
          />
        </li>
      ))}
    </ul>
  );
}
