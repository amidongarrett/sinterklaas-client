const BASE = process.env.NEXT_PUBLIC_API_URL;

async function handleResponse(res) {
  if (res.ok) {
    if (res.status === 204) return undefined;
    return res.json();
  }
  let message = `Request failed with status ${res.status}`;
  try {
    const body = await res.json();
    if (body?.error) message = body.error;
  } catch {
    // ignore parse errors — use the default message
  }
  throw new Error(message);
}

export async function getItems(userId) {
  const res = await fetch(`${BASE}/api/wishlists/${encodeURIComponent(userId)}`);
  const data = await handleResponse(res);
  return data.items;
}

export async function addItem(userId, body) {
  const res = await fetch(`${BASE}/api/wishlists/${encodeURIComponent(userId)}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function updateItem(userId, itemId, body) {
  const res = await fetch(
    `${BASE}/api/wishlists/${encodeURIComponent(userId)}/items/${encodeURIComponent(itemId)}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  return handleResponse(res);
}

export async function deleteItem(userId, itemId) {
  const res = await fetch(
    `${BASE}/api/wishlists/${encodeURIComponent(userId)}/items/${encodeURIComponent(itemId)}`,
    { method: 'DELETE' }
  );
  await handleResponse(res);
}

export async function claimItem(userId, itemId) {
  const res = await fetch(
    `${BASE}/api/wishlists/${encodeURIComponent(userId)}/items/${encodeURIComponent(itemId)}/claim`,
    { method: 'POST' }
  );
  return handleResponse(res);
}

export async function unclaimItem(userId, itemId) {
  const res = await fetch(
    `${BASE}/api/wishlists/${encodeURIComponent(userId)}/items/${encodeURIComponent(itemId)}/unclaim`,
    { method: 'POST' }
  );
  return handleResponse(res);
}
