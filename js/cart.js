// js/cart.js

// cada item: { id, name, price, qty, size, brand, caseUnits?, unitPriceForCase? }
const cart = [];

function formatMoney(value) {
  const n = Number(value) || 0;
  return '$' + n.toFixed(2);
}

function updateCartUI() {
  const cartCountBadge = document.getElementById('cartCountBadge');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartTotalSpan = document.getElementById('cartTotal');
  const floatingCartCount = document.getElementById('floatingCartCount');

  if (!cartItemsList || !cartTotalSpan) return;

  // limpiar lista
  cartItemsList.innerHTML = '';

  // ==========================
  // CARRITO VACÍO
  // ==========================
  if (cart.length === 0) {
    const li = document.createElement('li');
    li.className = 'list-group-item cart-empty-message';

    li.innerHTML = `
      <div class="empty-cart-wrapper">
        <i class="fa fa-shopping-basket empty-cart-icon"></i>
        <p class="empty-cart-title">Tu carrito está vacío</p>
        <p class="empty-cart-sub">Agrega productos para comenzar</p>
      </div>
    `;

    cartItemsList.appendChild(li);

    if (cartCountBadge) cartCountBadge.textContent = '0';
    if (floatingCartCount) floatingCartCount.textContent = '0';
    cartTotalSpan.textContent = '$0.00';
    return;
  }

  // ==========================
  // HAY PRODUCTOS EN EL CARRITO
  // ==========================
  let total = 0;
  let totalQty = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    totalQty += item.qty;

    const li = document.createElement('li');
    li.className = 'list-group-item';

    li.innerHTML = `
      <div class="cart-item-main">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">
            ${item.brand ? `${item.brand} · ` : ''}${item.size || ''}
          </div>
          <div class="cart-item-qty-price">
            Cant: ${item.qty} x ${formatMoney(item.price)}
            ${
              item.caseUnits
                ? `<br>Case: ${item.caseUnits}`
                : ''
            }
          </div>
        </div>

        <div class="cart-item-side">
          <div class="cart-qty-controls">
            <button
              class="cart-qty-btn"
              type="button"
              data-id="${item.id}"
              data-action="minus"
            >−</button>

            <input
              type="number"
              class="cart-qty-input"
              min="1"
              value="${item.qty}"
              data-id="${item.id}"
            />

            <button
              class="cart-qty-btn"
              type="button"
              data-id="${item.id}"
              data-action="plus"
            >+</button>
          </div>

          <div class="cart-item-total">${formatMoney(itemTotal)}</div>

          <button 
            class="cart-item-remove" 
            type="button"
            data-id="${item.id}"
          >
            Quitar
          </button>
        </div>
      </div>
    `;

    cartItemsList.appendChild(li);
  });

  // actualizar contadores y total
  if (cartCountBadge) cartCountBadge.textContent = String(totalQty);
  if (floatingCartCount) floatingCartCount.textContent = String(totalQty);
  cartTotalSpan.textContent = formatMoney(total);
}

function handleAddToCartClick(e) {
  const btn = e.target.closest('.add-to-cart');
  if (!btn) return;

  const id = btn.getAttribute('data-id') || '';
  const name = btn.getAttribute('data-name') || '';
  const price = parseFloat(btn.getAttribute('data-price') || '0');
  const size = btn.getAttribute('data-size') || '';
  const brand = btn.getAttribute('data-brand') || '';

  // info de case (para mostrar "Case: 12 x $3.09")
  const caseUnits = btn.getAttribute('data-case-units') || '';
  const unitPriceForCase = parseFloat(
    btn.getAttribute('data-unit-price') || btn.getAttribute('data-price') || '0'
  );

  if (!id || !name) return;

  const existing = cart.find(p => p.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id,
      name,
      price,          // precio por unidad para total
      size,
      brand,
      qty: 1,
      caseUnits,      // ej. "12"
      unitPriceForCase
    });
  }

  updateCartUI();
}

// Maneja Quitar + botones +/- dentro del carrito
function handleCartListClick(e) {
  const removeBtn = e.target.closest('.cart-item-remove');
  const qtyBtn = e.target.closest('.cart-qty-btn');

  // Quitar producto
  if (removeBtn) {
    const id = removeBtn.getAttribute('data-id');
    if (!id) return;

    const index = cart.findIndex(p => p.id === id);
    if (index !== -1) {
      cart.splice(index, 1);
      updateCartUI();
    }
    return;
  }

  // Incrementar / decrementar cantidad con botones
  if (qtyBtn) {
    const id = qtyBtn.getAttribute('data-id');
    const action = qtyBtn.getAttribute('data-action');
    if (!id || !action) return;

    const item = cart.find(p => p.id === id);
    if (!item) return;

    if (action === 'plus') {
      item.qty += 1;
    } else if (action === 'minus') {
      if (item.qty > 1) {
        item.qty -= 1;
      } else {
        // si está en 1 y le dan a "-", se elimina el producto
        const index = cart.findIndex(p => p.id === id);
        if (index !== -1) {
          cart.splice(index, 1);
        }
      }
    }

    updateCartUI();
  }
}

// Maneja cuando el usuario escribe cantidad manualmente en el input
function handleCartQtyInputChange(e) {
  const input = e.target.closest('.cart-qty-input');
  if (!input) return;

  const id = input.getAttribute('data-id');
  if (!id) return;

  let value = parseInt(input.value, 10);

  if (isNaN(value) || value < 1) {
    value = 1;
  }

  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.qty = value;
  updateCartUI();
}

function handleSendOrderClick() {
  if (!cart.length) return;

  let msg = '*Hola Sandra*, espero que estés muy bien.%0A%0A';
  msg += '*Me gustaría solicitar una cotización para los siguientes productos:*%0A%0A';

  cart.forEach(item => {
    const subtotal = item.qty * item.price;

    msg += `*• ${item.name}*`;
    if (item.brand) msg += ` _(${item.brand})_`;
    if (item.size) msg += ` - ${item.size}`;

    // Cantidad con precio y subtotal
    msg += `%0A  *Cantidad:* ${item.qty} × ${formatMoney(item.price)} = *${formatMoney(subtotal)}*`;

    // Case sin precio
    if (item.caseUnits) {
      msg += `%0A  *Case:* ${item.caseUnits} bags`;
    }

    msg += `%0A-------------------------%0A`;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  msg += `%0A*Total aproximado:* ${formatMoney(total)}%0A%0A`;
  msg += 'Quedo atento(a) a tu confirmación. Muchas gracias. 🙏';

  const phone = '17863444445';
  const url = `https://wa.me/${phone}?text=${msg}`;
  window.open(url, '_blank');
}


export function initCart() {
  const menuGrid = document.getElementById('menuGrid');
  const cartItemsList = document.getElementById('cartItemsList');
  const sendOrderButton = document.getElementById('sendOrderButton');

  if (!menuGrid) return;

  // clicks en "Agregar" de las cards
  menuGrid.addEventListener('click', handleAddToCartClick);

  // clicks dentro del carrito (Quitar, +, -) y cambio de input
  if (cartItemsList) {
    cartItemsList.addEventListener('click', handleCartListClick);
    cartItemsList.addEventListener('change', handleCartQtyInputChange); // 👈 aquí cambiamos input → change
  }

  // enviar pedido
  if (sendOrderButton) {
    sendOrderButton.addEventListener('click', handleSendOrderClick);
  }

  // estado inicial
  updateCartUI();
}
