// js/state.js

const state = {
  items: [],              // todos los productos del menu.json
  currentCategory: 'congelados',
  currentBrand: 'all',
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
