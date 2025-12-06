// js/filters.js

import { loadMenu } from './menu.js';
import {
  getCurrentCategory,
  getCurrentBrand,
  setCurrentCategory,
  setCurrentBrand,
} from './state.js';

export function applyFilters() {
  const currentCategory = getCurrentCategory();
  const currentBrand = getCurrentBrand();

  const items = document.querySelectorAll('#menuGrid .menu-item');
  if (!items.length) return;

  let visibleCount = 0;

  items.forEach(card => {
    const cardCategory = card.getAttribute('data-category') || '';
    const cardBrand = card.getAttribute('data-brand') || '';

    let visible = true;

    if (currentCategory && currentCategory !== 'all' && cardCategory !== currentCategory) {
      visible = false;
    }

    if (currentBrand && currentBrand !== 'all' && cardBrand !== currentBrand) {
      visible = false;
    }

    card.style.display = visible ? '' : 'none';
    if (visible) visibleCount++;
  });

  const noResults = document.getElementById('noResultsMessage');
  if (noResults) {
    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
  }
}

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

      await loadMenu(category);

      applyFilters();
    });
  });
}

export function setupBrandChips() {
  const chips = document.querySelectorAll('.chip'); // 👈 aquí
  if (!chips.length) return;

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
