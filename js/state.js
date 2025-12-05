// js/state.js

let currentCategory = 'congelados';
let currentBrand = 'all';

export function getCurrentCategory() {
  return currentCategory;
}

export function getCurrentBrand() {
  return currentBrand;
}

export function setCurrentCategory(value) {
  currentCategory = value;
}

export function setCurrentBrand(value) {
  currentBrand = value;
}
