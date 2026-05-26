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

export async function getGroupMembers(groupId) {
  const res = await fetch(`${BASE}/api/groups/${encodeURIComponent(groupId)}/members`);
  return handleResponse(res);
}

export async function inviteGroupMember(groupId) {
  const res = await fetch(`${BASE}/api/groups/${encodeURIComponent(groupId)}/invite`, {
    method: 'POST',
  });
  return handleResponse(res);
}

export async function deleteGroupMember(groupId, userId) {
  const res = await fetch(
    `${BASE}/api/groups/${encodeURIComponent(groupId)}/members/${encodeURIComponent(userId)}`,
    { method: 'DELETE' }
  );
  await handleResponse(res);
}

export async function drawNames(groupId) {
  const res = await fetch(`${BASE}/api/groups/${encodeURIComponent(groupId)}/draw`, {
    method: 'POST',
  });
  return handleResponse(res);
}

export async function getDrawResults(groupId) {
  const res = await fetch(`${BASE}/api/groups/${encodeURIComponent(groupId)}/draw`);
  return handleResponse(res);
}
