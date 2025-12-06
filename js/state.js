// js/state.js

let currentCategory = 'congelados';
let currentBrand = 'all';

export function setCurrentCategory(category) {
  currentCategory = category || 'all';
}

export function getCurrentCategory() {
  return currentCategory;
}

export function setCurrentBrand(brand) {
  currentBrand = brand || 'all';
}

export function getCurrentBrand() {
  return currentBrand;
}
