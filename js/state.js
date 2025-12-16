// js/state.js

const state = {
  items: [],
  currentCategory: 'congelados',
  currentBrand: 'all',
  searchQuery: '',

  // ✅ NUEVO: para volver al estado anterior al buscar
  lastCategoryBeforeSearch: 'congelados',
  lastBrandBeforeSearch: 'all',
};

export function setItems(items) {
  state.items = items;
}
export function getItems() {
  return state.items;
}

export function setCurrentCategory(category) {
  state.currentCategory = category;
}
export function getCurrentCategory() {
  return state.currentCategory;
}

export function setCurrentBrand(brand) {
  state.currentBrand = brand;
}
export function getCurrentBrand() {
  return state.currentBrand;
}

export function setSearchQuery(q) {
  state.searchQuery = (q || '').toLowerCase().trim();
}
export function getSearchQuery() {
  return state.searchQuery;
}

// ✅ NUEVO
export function setLastBeforeSearch(category, brand) {
  state.lastCategoryBeforeSearch = category;
  state.lastBrandBeforeSearch = brand;
}
export function getLastBeforeSearch() {
  return {
    category: state.lastCategoryBeforeSearch,
    brand: state.lastBrandBeforeSearch,
  };
}
