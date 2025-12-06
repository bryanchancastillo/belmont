// js/menu.js

import { getCurrentCategory } from './state.js';

let currentCategory = getCurrentCategory();

export async function loadMenu(category = currentCategory) {
  currentCategory = category;

  try {
    const response = await fetch(`data/${category}.json`);

    if (!response.ok) {
      console.error(`Error al cargar data/${category}.json:`, response.status, response.statusText);
      return;
    }

    const items = await response.json();

    const grid = document.getElementById("menuGrid");
    if (!grid) {
      console.error("No se encontró el elemento #menuGrid");
      return;
    }

    grid.innerHTML = "";

    items.forEach((item, index) => {
      let optionsHtml = "";

      if (Array.isArray(item.variants) && item.variants.length > 0) {
        optionsHtml = `
          <div class="options" style="display:flex;flex-direction:column;gap:8px;margin-top:12px;">
            ${item.variants
              .map(v => {
                const size = v.size || "";
                const caseInfo = v.case || "";
                const unitPrice = typeof v.unitPrice === "number"
                  ? v.unitPrice.toFixed(2)
                  : (v.unitPrice ?? v.price);

                const casePrice = typeof v.casePrice === "number"
                  ? v.casePrice.toFixed(2)
                  : (v.casePrice || "");

                return `
                  <div style="display:flex;flex-direction:column;gap:4px;padding:6px 10px;border-radius:10px;background:#111827;">

                    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
                      <span style="background:#ffffff20;padding:3px 10px;border-radius:999px;font-size:13px;">
                        ${size}
                      </span>
                      <span style="font-size:15px;font-weight:500;color:#fff;">
                        $${unitPrice}
                      </span>
                    </div>

                    ${(caseInfo || casePrice)
                      ? `<div style="font-size:12px;color:#e5e7eb;opacity:.9;">
                          Case: ${caseInfo}${casePrice ? ` · $${casePrice}` : ""}
                        </div>`
                      : ""}

                  </div>
                `;
              })
              .join("")}
          </div>`;
      } else if (item.price) {
        const price = typeof item.price === "number" ? item.price.toFixed(2) : item.price;
        optionsHtml = `
          <div class="options" style="margin-top:12px;">
            <h6>$${price}</h6>
          </div>
        `;
      }

      const brand = item.brand || "";
      const categoryClass = item.category || currentCategory;

      const card = `
        <div class="col-sm-6 col-lg-4 all ${categoryClass} menu-item"
             data-category="${categoryClass}"
             data-brand="${brand}">
          <div class="box">
            <div class="img-box">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="detail-box">
              <h5>${item.name}</h5>
              <p>${item.description || ""}</p>
              ${optionsHtml}
            </div>
          </div>
        </div>
      `;

      grid.insertAdjacentHTML("beforeend", card);

      // 💡 AQUI: darle la clase .show para que se vea y se anime
      const added = grid.lastElementChild;
      if (added) {
        // pequeño delay para que se note la animación
        setTimeout(() => {
          added.classList.add('show');
        }, 40 * index);
      }
    });

  } catch (err) {
    console.error(`Error cargando la categoría ${category}:`, err);
  }
}
