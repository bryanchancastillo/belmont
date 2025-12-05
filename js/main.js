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
  await loadMenu();            // carga el JSON y crea las cards
  setupCategoryFilters();      // listeners para botones de categoría
  setupBrandChips();           // listeners para las marcas

  // estado inicial por defecto
  setCurrentCategory('congelados');
  setCurrentBrand('all');

  applyFilters();              // aplica filtros iniciales
});
