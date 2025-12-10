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
      const brand = item.brand || "";
      const categoryClass = item.category || currentCategory;

      const baseId = item.id || `${categoryClass}-${index}`;

      let optionsHtml = "";

      // VARIANTS
      if (Array.isArray(item.variants) && item.variants.length > 0) {
        optionsHtml = `
          <div class="options" style="display:flex;flex-direction:column;gap:8px;margin-top:12px;">
            ${item.variants
            .map((v, vIndex) => {
              const size = v.size || "";
              const caseInfo = v.case || "";

              const unitPriceNum =
                typeof v.unitPrice === "number"
                  ? v.unitPrice
                  : Number(v.unitPrice ?? v.price ?? 0);

              const unitPrice = unitPriceNum.toFixed(2);

              const casePriceNum =
                typeof v.casePrice === "number"
                  ? v.casePrice
                  : Number(v.casePrice || 0);

              const casePrice = casePriceNum
                ? casePriceNum.toFixed(2)
                : "";

              const unitId = `${baseId}-v${vIndex}-unit`;
              const caseId = `${baseId}-v${vIndex}-case`;

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
                  : ""
                }

                    <div style="margin-top:4px;display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;">
                     <button
                        type="button"
                        class="add-to-cart simple-plus-btn"
                        data-id="${unitId}"
                        data-name="${item.name}"
                        data-price="${unitPriceNum}"
                        data-size="${size}"
                        data-brand="${brand}"
                      >
                        +
                      </button>
                    </div>
                  </div>
                `;
            })
            .join("")}
          </div>`;
      }
      // PRODUCTO SIMPLE
      else if (item.price) {
        const priceNum =
          typeof item.price === "number"
            ? item.price
            : Number(item.price || 0);

        const price = priceNum.toFixed(2);

        optionsHtml = `
          <div class="options" style="margin-top:12px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
            <h6 style="margin:0;">$${price}</h6>

            <button
              type="button"
              class="btn btn-sm btn-light add-to-cart"
              data-id="${baseId}"
              data-name="${item.name}"
              data-price="${priceNum}"
              data-size=""
              data-brand="${brand}"
            >
              Agregar
            </button>
          </div>
        `;
      }

      const card = `
        <div class="col-sm-6 col-lg-4 all ${categoryClass} menu-item"
             data-category="${categoryClass}"
             data-brand="${brand}">
          <div class="box">
            <div class="img-box">
              <img src="${item.image}" alt="${item.name}">
            </div>

            <div class="detail-box">
              ${brand
          ? `
                    <span class="brand-pill" data-brand="${brand}">
                      ${brand}
                    </span>
                  `
          : ""
        }

              <h5>${item.name}</h5>
              <p>${item.description || ""}</p>

              ${optionsHtml}
            </div>
          </div>
        </div>
      `;

      grid.insertAdjacentHTML("beforeend", card);

      const added = grid.lastElementChild;
      if (added) {
        setTimeout(() => {
          added.classList.add('show');
        }, 40 * index);
      }
    });

  } catch (err) {
    console.error(`Error cargando la categoría ${category}:`, err);
  }
}
