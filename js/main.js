// js/main.js

import { loadMenu, preloadAllMenus } from './menu.js';

import {
  applyFilters,
  setupCategoryFilters,
  setupBrandChips,
} from './filters.js';

import {
  setCurrentCategory,
  setCurrentBrand,
  setSearchQuery,
  getCurrentCategory,
  getCurrentBrand,
  setLastBeforeSearch,
  getLastBeforeSearch,
} from './state.js';

import { initCart } from './cart.js';

const INITIAL_CATEGORY = 'congelados';
const INITIAL_BRAND = 'all';

const ALL_CATEGORIES = [
  'congelados',
  'jugos',
  'salsas',
  'salmuera',
  'granosharinas',
  'sacos',
  'deshidratados',
  'sodas',
  'lacteos',
  'enlatados',
  'condimentos',
  'pastasfideos',
  'paneton',
  'endulzantes',
  'snacks',
  'infusiones',
  'aguas',
  'vinos',
  'cervezas',
  'piscos',
  'otros',
];

window.addEventListener('DOMContentLoaded', async () => {
  // Estado inicial
  setCurrentCategory(INITIAL_CATEGORY);
  setCurrentBrand(INITIAL_BRAND);
  setSearchQuery('');

  // Precargar todo para búsqueda global
  await preloadAllMenus(ALL_CATEGORIES);

  // Render inicial
  await loadMenu(INITIAL_CATEGORY);

  // Configurar filtros
  setupCategoryFilters();
  setupBrandChips();

  // Carrito
  initCart();

  // 🔍 Buscador global (SIN debounce, versión simple)
  const searchInput = document.getElementById('menuSearchInput');
  let searchWasActive = false;

  if (searchInput) {
    searchInput.addEventListener('input', async (e) => {
      const value = (e.target.value || '').trim();

      // Guardar estado antes de buscar
      if (value && !searchWasActive) {
        setLastBeforeSearch(getCurrentCategory(), getCurrentBrand());
        searchWasActive = true;
      }

      // Si borró → volver al estado anterior
      if (!value) {
        setSearchQuery('');
        searchWasActive = false;

        const prev = getLastBeforeSearch();
        setCurrentCategory(prev.category);
        setCurrentBrand(prev.brand);

        await loadMenu(prev.category);
        setupBrandChips();
        applyFilters();
        return;
      }

      // Búsqueda global
      setSearchQuery(value);
      applyFilters();
    });
  }

  // Filtros iniciales
  applyFilters();
});
