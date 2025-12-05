// js/filters.js

import {
  getCurrentCategory,
  getCurrentBrand,
  setCurrentCategory,
  setCurrentBrand,
} from './state.js';

export function applyFilters() {
  
  const cards = document.querySelectorAll('#menuGrid .menu-item');
  let visibleCount = 0;

  const currentCategory = getCurrentCategory();
  const currentBrand = getCurrentBrand();

  cards.forEach(card => {
    const matchCategory =
      currentCategory === 'all' || card.dataset.category === currentCategory;
    const matchBrand =
      currentBrand === 'all' || card.dataset.brand === currentBrand;

    if (matchCategory && matchBrand) {
      visibleCount++;
      card.style.display = "block";
      card.classList.remove("show");
      // pequeña "reflow hack" para reiniciar animación
      void card.offsetWidth;
      card.classList.add("show");
    } else {
      card.style.display = "none";
      card.classList.remove("show");
    }
  });

  const noResults = document.getElementById("noResultsMessage");
  if (noResults) {
    noResults.style.display = visibleCount === 0 ? "block" : "none";
  }
}

export function setupCategoryFilters() {
  const buttons = document.querySelectorAll('.filters_menu li');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';

      // data-filter viene con un "." (ej ".congelados"), lo removemos
      setCurrentCategory(filter.replace('.', ''));
      applyFilters();
    });
  });
}

export function setupBrandChips() {
  const chips = document.querySelectorAll(".chip");

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      const brand = chip.dataset.brand || "all";
      setCurrentBrand(brand === "all" ? "all" : brand);
      applyFilters();
    });
  });
}
