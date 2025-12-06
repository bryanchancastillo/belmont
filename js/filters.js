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
      setCurrentBrand('all');         // 👉 reset marca al cambiar categoría

      await loadMenu(category);       // 👉 aquí se pintan las cards de la categoría

      setupBrandChips();              // 👉 reconstruye las marcas según esa categoría
      applyFilters();                 // 👉 aplica filtro categoría + marca
    });
  });
}

export function setupBrandChips() {
  const container = document.querySelector('.brand-chips');
  if (!container) return;

  const currentCategory = getCurrentCategory();
  const currentBrand = getCurrentBrand();

  // Tomamos las cards del grid
  const cards = document.querySelectorAll('#menuGrid .menu-item');

  // Sacamos solo las marcas que existen en la categoría actual
  const brandsSet = new Set();

  cards.forEach(card => {
    const cardCategory = card.getAttribute('data-category') || '';
    const cardBrand = card.getAttribute('data-brand') || '';

    if (cardCategory === currentCategory && cardBrand) {
      brandsSet.add(cardBrand);
    }
  });

  const brands = Array.from(brandsSet);

  // Construimos el HTML de los chips
  let html = `
    <span data-brand="all" class="chip${currentBrand === 'all' ? ' active' : ''}">
      Todas
    </span>
  `;

  html += brands
    .map(brand => `
      <span
        data-brand="${brand}"
        class="chip${currentBrand === brand ? ' active' : ''}"
      >
        ${brand}
      </span>
    `)
    .join('');

  container.innerHTML = html;

  // Ahora sí, agregamos eventos a los chips generados
  const chips = container.querySelectorAll('.chip');
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
