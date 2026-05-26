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

export async function updateProfile(userId, body) {
  const res = await fetch(`${BASE}/api/users/${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function getPartner(userId) {
  const res = await fetch(`${BASE}/api/users/${encodeURIComponent(userId)}/partner`);
  return handleResponse(res);
}

export async function invitePartner(userId, email) {
  const res = await fetch(`${BASE}/api/users/${encodeURIComponent(userId)}/partner/invite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

export async function unlinkPartner(userId) {
  const res = await fetch(`${BASE}/api/users/${encodeURIComponent(userId)}/partner`, {
    method: 'DELETE',
  });
  await handleResponse(res);
}

export async function addChild(userId, body) {
  const res = await fetch(`${BASE}/api/users/${encodeURIComponent(userId)}/children`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}
