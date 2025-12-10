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

import { initCart } from './cart.js'; // 🛒 NUEVO

window.addEventListener("DOMContentLoaded", async () => {
  // estado inicial
  setCurrentCategory('congelados');
  setCurrentBrand('all');

  // cargar categoría inicial
  await loadMenu('congelados');

  // configurar listeners (categorías y marcas)
  setupCategoryFilters();
  setupBrandChips();

  // inicializar carrito (event listeners, badges, etc.)
  initCart(); // 🛒 NUEVO

  // aplicar filtros iniciales
  applyFilters();
});
