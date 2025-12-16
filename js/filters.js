// js/filters.js

import { loadMenu, renderMenuItems } from './menu.js';
import {
  getCurrentCategory,
  getCurrentBrand,
  setCurrentCategory,
  setCurrentBrand,
  getSearchQuery,
  getItems,
  setSearchQuery,
} from './state.js';

/* Helpers */
function normalize(str) {
  return (str || '').toLowerCase();
}

function itemToSearchText(item) {
  const name = normalize(item.name);
  const desc = normalize(item.description);
  const brand = normalize(item.brand);
  const category = normalize(item.category);

  // ✅ buscar también en variants (size, case)
  let variantsText = '';
  if (Array.isArray(item.variants)) {
    variantsText = item.variants
      .map(v => `${normalize(v.size)} ${normalize(v.case)}`)
      .join(' ');
  }

  return `${name} ${desc} ${brand} ${category} ${variantsText}`.trim();
}

export function applyFilters() {
  const currentCategory = getCurrentCategory();
  const currentBrand = getCurrentBrand();
  const q = getSearchQuery();
  const allItems = getItems();

  // 🔍 MODO GLOBAL: si hay texto, renderizamos desde ALL ITEMS
  if (q) {
    const words = q.split(/\s+/).filter(Boolean);

    const filtered = allItems.filter((item) => {
      const brand = normalize(item.brand);
      const text = itemToSearchText(item);

      // match texto
      const okText = words.every(w => text.includes(w));
      if (!okText) return false;

      // match marca (si está activa)
      if (currentBrand !== 'all' && brand !== normalize(currentBrand)) return false;

      return true;
    });

    renderMenuItems(filtered, 'all');
    buildBrandChipsFromItems(filtered);

    const noResults = document.getElementById('noResultsMessage');
    if (noResults) noResults.style.display = filtered.length === 0 ? 'block' : 'none';

    return;
  }

  // ✅ MODO NORMAL (sin búsqueda): filtra lo ya pintado
  const cards = document.querySelectorAll('#menuGrid .menu-item');
  if (!cards.length) return;

  let visibleCount = 0;

  cards.forEach(card => {
    const cardCategory = normalize(card.getAttribute('data-category'));
    const cardBrand = normalize(card.getAttribute('data-brand'));

    let visible = true;

    if (currentCategory !== 'all' && cardCategory !== normalize(currentCategory)) visible = false;
    if (visible && currentBrand !== 'all' && cardBrand !== normalize(currentBrand)) visible = false;

    card.style.display = visible ? '' : 'none';
    if (visible) visibleCount++;
  });

  const noResults = document.getElementById('noResultsMessage');
  if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}

/* Categorías */
export function setupCategoryFilters() {
  const filtersMenu = document.querySelector('.filters_menu');
  if (!filtersMenu) return;

  const lis = filtersMenu.querySelectorAll('li');

  lis.forEach(li => {
    li.addEventListener('click', async () => {
      lis.forEach(f => f.classList.remove('active'));
      li.classList.add('active');

      const filter = li.getAttribute('data-filter') || '';
      const category = filter.replace('.', '') || 'all';

      setCurrentCategory(category);
      setCurrentBrand('all');

      // ✅ reset búsqueda estado + input
      setSearchQuery('');
      const searchInput = document.getElementById('menuSearchInput');
      if (searchInput) searchInput.value = '';

      await loadMenu(category);
      setupBrandChips();
      applyFilters();
    });
  });
}

/* Chips normal (usa cards actuales) */
export function setupBrandChips() {
  const container = document.querySelector('.brand-chips');
  if (!container) return;

  const currentCategory = getCurrentCategory();
  const currentBrand = getCurrentBrand();

  const cards = document.querySelectorAll('#menuGrid .menu-item');
  const brandsSet = new Set();

  cards.forEach(card => {
    const cardCategory = card.getAttribute('data-category') || '';
    const cardBrand = card.getAttribute('data-brand') || '';
    if (cardCategory === currentCategory && cardBrand) brandsSet.add(cardBrand);
  });

  const brands = Array.from(brandsSet);

  let html = `
    <span data-brand="all" class="chip${currentBrand === 'all' ? ' active' : ''}">Todas</span>
  `;

  html += brands.map(brand => `
    <span data-brand="${brand}" class="chip${currentBrand === brand ? ' active' : ''}">${brand}</span>
  `).join('');

  container.innerHTML = html;

  const chips = container.querySelectorAll('.chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const brand = chip.getAttribute('data-brand') || 'all';
      setCurrentBrand(brand);
      applyFilters();
    });
  });
}

/* Chips global (usa items filtrados) */
function buildBrandChipsFromItems(items) {
  const container = document.querySelector('.brand-chips');
  if (!container) return;

  const currentBrand = getCurrentBrand();
  const brandsSet = new Set();

  items.forEach((it) => {
    if (it.brand) brandsSet.add(it.brand);
  });

  const brands = Array.from(brandsSet);

  let html = `
    <span data-brand="all" class="chip${currentBrand === 'all' ? ' active' : ''}">Todas</span>
  `;

  html += brands.map(brand => `
    <span data-brand="${brand}" class="chip${currentBrand === brand ? ' active' : ''}">${brand}</span>
  `).join('');

  container.innerHTML = html;

  const chips = container.querySelectorAll('.chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const brand = chip.getAttribute('data-brand') || 'all';
      setCurrentBrand(brand);
      applyFilters();
    });
  });
}
