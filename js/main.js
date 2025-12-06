// js/main.js

import { loadMenu } from './menu.js';

import {
  applyFilters,
  setupCategoryFilters,
  setupBrandChips,
} from './filters.js';

import {
  setCurrentCategory,
  setCurrentBrand,
} from './state.js';

window.addEventListener("DOMContentLoaded", async () => {
  // estado inicial
  setCurrentCategory('congelados');
  setCurrentBrand('all');

  // cargar categoría inicial
  await loadMenu('congelados');

  // configurar listeners
  setupCategoryFilters();
  setupBrandChips();

  // aplicar filtros iniciales
  applyFilters();
});
