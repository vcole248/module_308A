// js/main.js
// Wires up the UI to the API using async/await and AbortController for race-safety.

import { searchArticles, createDraft, updateDraftTitle } from './api.js';
import { renderResults, setStatus, setPagerEnabled, setPageLabel } from './ui.js';
import { state, setQuery, nextPage, prevPage, setArticles, getNewRequestId } from './state.js';

// ---------- DOM references ----------
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsGrid = document.getElementById('results');
const feedStatus = document.getElementById('feed-status');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageLabel = document.getElementById('page-label');

const createForm = document.getElementById('create-form');
const createTitle = document.getElementById('create-title');
const createBody = document.getElementById('create-body');
const createStatus = document.getElementById('create-status');

const updateForm = document.getElementById('update-form');
const updateTitle = document.getElementById('update-title');
const updateStatus = document.getElementById('update-status');

// ---------- App state ----------
// Using state.js for state management
let currentController = null; // AbortController for race safety

// ---------- Init ----------
attachEventHandlers();
void loadArticles(); // initial load

// ---------- Functions ----------
function attachEventHandlers() {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    setQuery(searchInput.value.trim());
    void loadArticles();
  });

  prevBtn.addEventListener('click', () => {
    prevPage();
    void loadArticles();
  });

  nextBtn.addEventListener('click', () => {
    nextPage();
    void loadArticles();
  });

  createForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = createTitle.value.trim();
    const body = createBody.value.trim();
    if (!title || !body) {
      setStatus(createStatus, 'Please enter a title and details.', 'error');
      return;
    }

    const submitBtn = createForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    setStatus(createStatus, 'Saving draft…');

    try {
      const created = await createDraft({ title, body });
      setStatus(createStatus, `Draft saved (ID: ${created.id}).`, 'success');
      createForm.reset();
    } catch (err) {
      setStatus(createStatus, `Error: ${err.message}`, 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });

  updateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newTitle = updateTitle.value.trim();
    if (!newTitle) {
      setStatus(updateStatus, 'Please enter a new title.', 'error');
      return;
    }

    const submitBtn = updateForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    setStatus(updateStatus, 'Updating draft #1…');

    try {
      const updated = await updateDraftTitle({ id: 1, title: newTitle });
      setStatus(updateStatus, `Draft #1 title updated to: "${updated.title}"`, 'success');
      updateForm.reset();
    } catch (err) {
      setStatus(updateStatus, `Error: ${err.message}`, 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
}

async function loadArticles() {
  // Abort any in-flight request to prevent race conditions / stale UI updates
  if (currentController) currentController.abort();
  currentController = new AbortController();

  setPagerEnabled(prevBtn, nextBtn, false, false);
  setStatus(feedStatus, 'Loading tax articles…');
  setPageLabel(pageLabel, state.page);

  let total = null;
  try {
    const { items, total: fetchedTotal } = await searchArticles({
      query: state.query,
      page: state.page,
      limit: state.limit,
      signal: currentController.signal,
    });
    total = fetchedTotal;
    setArticles(items);
    renderResults(resultsGrid, state.articles);

    // Helpful status: show a message if there are no results
    if (!state.articles || state.articles.length === 0) {
      setStatus(feedStatus, 'No articles found. Try a different keyword.');
    } else {
      setStatus(
        feedStatus,
        `Showing ${state.articles.length} article${state.articles.length > 1 ? 's' : ''} on this page.`
      );
    }
  } catch (err) {
    // Ignore abort errors; surface others
    if (err.name !== 'AbortError') {
      setStatus(feedStatus, `Error loading articles: ${err.message}`, 'error');
    }
  } finally {
    // Re-enable pager buttons and clear the controller if this request is still the latest one
    if (currentController && !currentController.signal.aborted) {
      const nextEnabled = total ? state.page < Math.ceil(total / state.limit) : true;
      setPagerEnabled(prevBtn, nextBtn, state.page > 1, nextEnabled);
      currentController = null;
    }
  }
}
``