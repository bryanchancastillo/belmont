// js/cart.js

const cart = []; // { id, name, price, qty, size, brand }

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

            <span class="cart-qty-value">${item.qty}</span>

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

  if (!id || !name) return;

  const existing = cart.find(p => p.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id,
      name,
      price,
      size,
      brand,
      qty: 1,
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

  // Incrementar / decrementar cantidad
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

function handleSendOrderClick() {
  if (!cart.length) return;

  let msg = 'Hola Sandra, me gustaría cotizar estos productos:%0A%0A';

  cart.forEach(item => {
    msg += `• ${item.name}`;
    if (item.brand) msg += ` (${item.brand})`;
    if (item.size) msg += ` - ${item.size}`;
    msg += ` | Cant: ${item.qty}%0A`;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  msg += `%0A%0ATotal aproximado: ${formatMoney(total)}`;

  const phone = '17863444445'; // número de Sandra
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

  // clicks dentro del carrito (Quitar, +, -)
  if (cartItemsList) {
    cartItemsList.addEventListener('click', handleCartListClick);
  }

  // enviar pedido
  if (sendOrderButton) {
    sendOrderButton.addEventListener('click', handleSendOrderClick);
  }

  // estado inicial
  updateCartUI();
}
