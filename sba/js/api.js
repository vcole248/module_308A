// js/api.js
// Network calls to an external API using the Fetch API.
// Uses JSONPlaceholder: https://jsonplaceholder.typicode.com/
// Supports GET (search + pagination), POST (create), PATCH (update)

const BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Search articles with optional query + pagination.
 * @param {{ query?: string, page?: number, limit?: number, signal?: AbortSignal }} opts
 * @returns {Promise<{ items: Array, total: number | null }>}
 */
export async function searchArticles({ query = '', page = 1, limit = 8, signal } = {}) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);        // Full-text search supported by JSON Server
  params.set('_page', String(page));
  params.set('_limit', String(limit));

  const url = `${BASE_URL}/posts?${params.toString()}`;
  const res = await fetch(url, { signal });

  if (!res.ok) {
    throw new Error(`Failed to load articles (HTTP ${res.status})`);
  }

  const items = await res.json();
  // JSON Server returns X-Total-Count when using _page; JSONPlaceholder mirrors this behavior.
  const totalHeader = res.headers.get('x-total-count');
  const total = totalHeader ? Number(totalHeader) : null;

  return { items, total };
}

/**
 * Create a new draft (POST).
 * @param {{ title: string, body: string }} payload
 * @returns {Promise<object>}
 */
export async function createDraft({ title, body }) {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body, userId: 1 }),
  });

  if (!res.ok) {
    throw new Error(`Failed to create draft (HTTP ${res.status})`);
  }

  return res.json();
}

/**
 * Update draft title with PATCH (default: #1 as per UI).
 * @param {{ id?: number, title: string }} payload
 * @returns {Promise<object>}
 */
export async function updateDraftTitle({ id = 1, title }) {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update draft #${id} (HTTP ${res.status})`);
  }

  return res.json();
}