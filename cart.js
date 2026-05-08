(function () {
  const ITEMS_STORAGE_KEY = "smile-shop-cart-items";
  const COUNT_STORAGE_KEY = "smile-shop-cart-count";
  const cartListEl = document.getElementById("cart-list");
  const cartTotalEl = document.getElementById("cart-total");
  const cartTotalItemsEl = document.getElementById("cart-total-items");
  const cartCountEl = document.getElementById("cart-count");
  const clearCartBtn = document.getElementById("clear-cart-btn");

  function loadCartItems() {
    try {
      const raw = localStorage.getItem(ITEMS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveCartItems(items) {
    localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
    const count = items.reduce(function (total, item) {
      return total + item.qty;
    }, 0);
    localStorage.setItem(COUNT_STORAGE_KEY, String(count));
  }

  function parsePrice(value) {
    const numberText = String(value || "").replace(/[^\d]/g, "");
    return Number(numberText || 0);
  }

  function formatPrice(value) {
    return value.toLocaleString("vi-VN") + "đ";
  }

  function createCard(item, index) {
    const subtotal = parsePrice(item.price) * item.qty;
    return (
      '<article class="product-card">' +
      '<div class="product-body">' +
      '<h2 class="product-title">' + item.name + "</h2>" +
      '<div class="product-series">Don gia: ' + item.price + "</div>" +
      '<div class="product-meta">' +
      '<div class="product-price">So luong: ' +
      '<button class="btn-mini qty-btn decrease-btn" data-index="' + index + '" type="button">-</button> ' +
      '<input class="qty-value qty-input" data-index="' + index + '" type="number" min="1" step="1" value="' + item.qty + '" aria-label="So luong san pham" /> ' +
      '<button class="btn-mini qty-btn increase-btn" data-index="' + index + '" type="button">+</button>' +
      "</div>" +
      '<div class="product-status">Tam tinh: ' + formatPrice(subtotal) + "</div>" +
      "</div>" +
      '<div class="product-footer">' +
      '<button class="btn-mini remove-item-btn" data-index="' + index + '" type="button">Xoa</button>' +
      '<div class="product-date">Cap nhat tu trang chu</div>' +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  function renderCart() {
    const items = loadCartItems();
    const totalItems = items.reduce(function (total, item) { return total + item.qty; }, 0);
    const totalPrice = items.reduce(function (total, item) {
      return total + parsePrice(item.price) * item.qty;
    }, 0);

    cartCountEl.textContent = String(totalItems);
    cartTotalEl.textContent = formatPrice(totalPrice);
    cartTotalItemsEl.textContent = totalItems + " sản phẩm";

    if (!items.length) {
      cartListEl.innerHTML = '<article class="product-card"><div class="product-body"><h2 class="product-title">Giỏ hàng đang trống</h2><div class="product-series">Hãy quay lại trang chủ và thêm sản phẩm vào giỏ.</div></div></article>';
      return;
    }

    cartListEl.innerHTML = items.map(createCard).join("");
  }

  document.addEventListener("click", function (event) {
    const increaseBtn = event.target.closest(".increase-btn");
    if (increaseBtn) {
      const index = Number(increaseBtn.dataset.index);
      const items = loadCartItems();
      if (items[index]) {
        items[index].qty += 1;
      }
      saveCartItems(items);
      renderCart();
      return;
    }

    const decreaseBtn = event.target.closest(".decrease-btn");
    if (decreaseBtn) {
      const index = Number(decreaseBtn.dataset.index);
      const items = loadCartItems();
      if (items[index]) {
        items[index].qty -= 1;
        if (items[index].qty <= 0) {
          items.splice(index, 1);
        }
      }
      saveCartItems(items);
      renderCart();
      return;
    }

    const removeBtn = event.target.closest(".remove-item-btn");
    if (removeBtn) {
      const index = Number(removeBtn.dataset.index);
      const items = loadCartItems();
      items.splice(index, 1);
      saveCartItems(items);
      renderCart();
      return;
    }

    if (event.target.closest("#clear-cart-btn")) {
      saveCartItems([]);
      renderCart();
    }
  });

  document.addEventListener("change", function (event) {
    const qtyInput = event.target.closest(".qty-input");
    if (!qtyInput) return;

    const index = Number(qtyInput.dataset.index);
    const items = loadCartItems();
    if (!items[index]) return;

    const nextQty = Number(qtyInput.value);
    if (!Number.isFinite(nextQty) || nextQty < 1) {
      qtyInput.value = String(items[index].qty);
      return;
    }

    items[index].qty = Math.floor(nextQty);
    saveCartItems(items);
    renderCart();
  });

  renderCart();
})();
