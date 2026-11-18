/**
 * ⌘K / Ctrl+K search dialog (markup in components/layout/Search.astro).
 *
 * The index is a JSON blob written into the page at build time by
 * data/search-index.ts, so search works offline and never goes stale.
 * Matching is a simple accent-insensitive "contains" over title + meta + kind.
 */

type Item = { title: string; meta: string; href: string; kind: string };

const MAX_RESULTS = 12;

const dialog = document.getElementById('search-dialog') as HTMLDialogElement;
const input = document.getElementById('search-input') as HTMLInputElement;
const list = document.getElementById('search-results') as HTMLUListElement;
const index: Item[] = JSON.parse(document.getElementById('search-index')!.textContent || '[]');
let active = 0;

/** Lowercase and strip accents, so "algebra" matches "Álgebra". */
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// ---------- rendering ----------

function resultRow(item: Item, selected: boolean): HTMLLIElement {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = item.href;
  a.setAttribute('role', 'option');
  a.setAttribute('aria-selected', String(selected));

  const text = document.createElement('div');
  const title = document.createElement('div');
  title.className = 'search-title';
  title.textContent = item.title;
  const meta = document.createElement('div');
  meta.className = 'search-meta';
  meta.textContent = item.meta;
  text.append(title, meta);

  const badge = document.createElement('span');
  badge.className = 'chip';
  badge.textContent = item.kind;

  a.append(text, badge);
  li.append(a);
  return li;
}

function render(query: string) {
  const q = norm(query.trim());
  const hits = index.filter((i) => !q || norm(`${i.title} ${i.meta} ${i.kind}`).includes(q)).slice(0, MAX_RESULTS);
  list.replaceChildren();
  active = 0;

  if (!hits.length) {
    const li = document.createElement('li');
    li.className = 'search-empty';
    li.textContent = `${dialog.dataset.none} “${query}”`; // "No results for" / "Sin resultados para"
    list.append(li);
    return;
  }
  hits.forEach((h, k) => list.append(resultRow(h, k === 0)));
}

// ---------- open / close ----------

function open() {
  input.value = '';
  render('');
  dialog.showModal();
  input.focus();
}

document.querySelectorAll('[data-open-search]').forEach((b) => b.addEventListener('click', open));
dialog.querySelector('[data-close-search]')?.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close(); // click on the backdrop
});

window.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    dialog.open ? dialog.close() : open();
  }
});

// ---------- keyboard navigation inside the results ----------

input.addEventListener('input', () => render(input.value));
input.addEventListener('keydown', (e) => {
  const links = Array.from(list.querySelectorAll('a'));
  if (!links.length) return;

  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    links[active]?.setAttribute('aria-selected', 'false');
    active = (active + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
    links[active].setAttribute('aria-selected', 'true');
    links[active].scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'Enter') {
    e.preventDefault();
    links[active].click();
  }
});
