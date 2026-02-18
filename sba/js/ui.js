// js/ui.js
// DOM rendering helpers and status messaging

/**
 * Render a grid of article cards.
 * @param {HTMLElement} container
 * @param {Array<{ id:number, title:string, body:string }>} items
 */
export function renderResults(container, items) {
  container.innerHTML = '';
  if (!items || items.length === 0) return;

  const fragment = document.createDocumentFragment();

  items.forEach(({ id, title, body }) => {
    const card = document.createElement('article');
    card.className = 'card-item';
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(body.slice(0, 140))}${body.length > 140 ? '…' : ''}</p>
      <p class="status">Article ID: ${id}</p>
    `;
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

/** Update the status text */
export function setStatus(el, text, kind = 'neutral') {
  el.textContent = text || '';
  el.classList.remove('error', 'success');
  if (kind === 'error') el.classList.add('error');
  if (kind === 'success') el.classList.add('success');
}

/** Enable/disable pager buttons safely */
export function setPagerEnabled(prevBtn, nextBtn, prevEnabled, nextEnabled) {
  prevBtn.disabled = !prevEnabled;
  nextBtn.disabled = !nextEnabled;
}

/** Update the "Page N" label */
export function setPageLabel(el, page) {
  el.textContent = `Page ${page}`;
}

/** Basic HTML escape to prevent unsafe markup rendering */
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}