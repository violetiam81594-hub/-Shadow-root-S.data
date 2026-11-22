const STORAGE_KEY = 'gitlit.elements.v1';
const MAX_SNIPPET_LENGTH = 1200;

const starterElements = [
  { id: 'starter-jelly', name: 'Jellybean hover button', kind: 'button', creator: 'GitLit demo', tags: ['playful', 'hover', 'CSS'], description: 'A tiny, bouncy button idea for interfaces that could use a little joy.', license: 'MIT', price: 0, terms: 'Free to remix with attribution. Demo listing; replace with your own terms.', snippet: '.jelly-button { border-radius: 999px; transition: transform 180ms ease; }\n.jelly-button:hover { transform: translateY(-3px) rotate(-2deg); }' },
  { id: 'starter-spark', name: 'Small spark icon', kind: 'icon', creator: 'GitLit demo', tags: ['symbol', 'bright', 'SVG'], description: 'A simple starburst mark for your next side project or notebook.', license: 'CC0-1.0', price: 0, terms: 'Public-domain dedication for this demo element.', snippet: '<svg viewBox="0 0 24 24" aria-label="spark">✳</svg>' },
  { id: 'starter-soft', name: 'Soft-focus stylesheet', kind: 'stylesheet', creator: 'GitLit demo', tags: ['soft', 'CSS', 'pastel'], description: 'A gentle color palette and a couple of tokens to get a new page started.', license: 'MIT', price: 0, terms: 'Keep this notice with copies. Demo listing.', snippet: ':root { --soft-ink: #322c43; --soft-paper: #fff8f1; --soft-pop: #d3b8ff; }' }
];

const catalog = document.querySelector('#catalog');
const emptyState = document.querySelector('#empty-state');
const searchInput = document.querySelector('#search-input');
let activeKind = 'all';
let elements = loadElements();

function loadElements() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(stored)) return stored.filter(isValidElement);
  } catch { /* Start with sample listings if browser storage is unavailable or invalid. */ }
  return structuredClone(starterElements);
}

function isValidElement(item) {
  return item && typeof item.id === 'string' && typeof item.name === 'string' &&
    typeof item.creator === 'string' && ['icon', 'font', 'stylesheet', 'button', 'other'].includes(item.kind);
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(elements));
    return true;
  } catch {
    return false;
  }
}

function makeText(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.textContent = value;
  return node;
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const visible = elements.filter((item) => {
    const matchesKind = activeKind === 'all' || item.kind === activeKind;
    const searchable = [item.name, item.creator, item.description, ...(item.tags || [])].join(' ').toLowerCase();
    return matchesKind && searchable.includes(query);
  });

  catalog.replaceChildren();
  emptyState.hidden = visible.length > 0;

  for (const item of visible) {
    const card = document.createElement('article');
    card.className = 'element-card';
    const symbol = makeText('div', `element-symbol kind-${item.kind}`, symbolFor(item.kind));
    symbol.setAttribute('aria-hidden', 'true');
    const header = document.createElement('div');
    header.className = 'card-topline';
    header.append(makeText('span', 'kind-label', item.kind), makeText('span', 'price-label', item.price > 0 ? `$${Number(item.price).toFixed(2)}` : 'Free'));
    card.append(symbol, header, makeText('h3', '', item.name), makeText('p', 'element-description', item.description), makeText('p', 'creator-line', `by ${item.creator}`));
    const tags = document.createElement('div');
    tags.className = 'tags';
    for (const tag of item.tags || []) tags.append(makeText('span', 'tag', `#${tag}`));
    card.append(tags);
    const details = document.createElement('details');
    details.className = 'element-details';
    details.append(makeText('summary', '', 'License, terms & code'));
    details.append(makeText('p', 'terms-text', `License: ${item.license || 'Not specified'}${item.terms ? ` · ${item.terms}` : ''}`));
    if (item.snippet) details.append(makeText('pre', 'snippet', item.snippet));
    card.append(details);
    catalog.append(card);
  }
}

function symbolFor(kind) {
  return ({ icon: '✳', font: 'Aa', stylesheet: '{ }', button: '↗', other: '✦' })[kind] || '✦';
}

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.filter.active')?.classList.remove('active');
    button.classList.add('active');
    activeKind = button.dataset.kind;
    render();
  });
});
searchInput.addEventListener('input', render);

const form = document.querySelector('#create-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const price = Number(data.get('price'));
  if (!Number.isFinite(price) || price < 0 || price > 100000) {
    showFormMessage('Enter a valid price between $0 and $100,000.');
    return;
  }

  const item = {
    id: crypto.randomUUID ? crypto.randomUUID() : `element-${Date.now()}`,
    name: String(data.get('name')).trim(),
    kind: String(data.get('kind')),
    creator: String(data.get('creator')).trim(),
    tags: String(data.get('tags')).split(',').map((tag) => tag.trim().replace(/^#/, '')).filter(Boolean).slice(0, 8),
    description: String(data.get('description')).trim(),
    license: String(data.get('license')),
    price,
    terms: String(data.get('terms')).trim(),
    snippet: String(data.get('snippet')).trim().slice(0, MAX_SNIPPET_LENGTH),
    createdAt: new Date().toISOString()
  };
  elements.unshift(item);
  const saved = persist();
  form.reset();
  form.elements.price.value = '0';
  showFormMessage(saved ? 'Added! Your element is saved in this browser.' : 'Added for this session, but browser storage is unavailable. Export the library to keep it.');
  activeKind = 'all';
  document.querySelector('.filter.active')?.classList.remove('active');
  document.querySelector('.filter[data-kind="all"]').classList.add('active');
  render();
  document.querySelector('#explore').scrollIntoView({ behavior: 'smooth' });
});

function showFormMessage(message) {
  document.querySelector('#form-message').textContent = message;
}

document.querySelector('#export-button').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ format: 'gitlit-library', version: 1, elements }, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'gitlit-library.json';
  link.click();
  URL.revokeObjectURL(link.href);
});

const githubForm = document.querySelector('#github-search-form');
githubForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = new FormData(githubForm).get('q').trim();
  const status = document.querySelector('#github-message');
  const results = document.querySelector('#github-results');
  const submit = githubForm.querySelector('button[type="submit"]');
  status.textContent = 'Searching public repositories…';
  results.replaceChildren();
  submit.disabled = true;
  try {
    const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&per_page=5`, {
      headers: { Accept: 'application/vnd.github+json' }
    });
    if (!response.ok) throw new Error(response.status === 403 ? 'GitHub rate limit reached. Try again later.' : `GitHub returned ${response.status}.`);
    const data = await response.json();
    if (!data.items?.length) status.textContent = 'No public repositories found. Try a broader search.';
    else {
      status.textContent = `Showing ${data.items.length} public repositories. Open a result to view its source on GitHub.`;
      for (const repo of data.items) {
        const link = document.createElement('a');
        link.className = 'github-result';
        link.href = repo.html_url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.append(makeText('strong', '', repo.full_name), makeText('span', '', repo.description || 'No description provided.'), makeText('small', '', `★ ${repo.stargazers_count} · ${repo.language || 'No language listed'}`));
        results.append(link);
      }
    }
  } catch (error) {
    status.textContent = `${error.message} Check your connection and try again.`;
  } finally {
    submit.disabled = false;
  }
});

render();
