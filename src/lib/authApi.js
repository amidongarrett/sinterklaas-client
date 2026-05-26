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
  const err = new Error(message);
  err.status = res.status;
  throw err;
}

export async function requestOtp({ email, displayName }) {
  const body = { email };
  if (displayName !== undefined) body.displayName = displayName;
  const res = await fetch(`${BASE}/api/auth/request-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function verifyOtp({ userId, code }) {
  const res = await fetch(`${BASE}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ userId, code }),
  });
  return handleResponse(res);
}

export async function logout() {
  const res = await fetch(`${BASE}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  return handleResponse(res);
}

export async function getMe() {
  const res = await fetch(`${BASE}/api/auth/me`, {
    credentials: 'include',
  });
  return handleResponse(res);
}
