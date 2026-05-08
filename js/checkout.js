(function () {
  const ITEMS_STORAGE_KEY = "smile-shop-cart-items";
  const COUNT_STORAGE_KEY = "smile-shop-cart-count";
  const ORDERS_STORAGE_KEY = "smile-shop-orders";
  const USER_STORAGE_KEY = "smile-shop-user";
  const checkoutForm = document.getElementById("checkout-form");
  const checkoutItemsEl = document.getElementById("checkout-items");
  const checkoutTotalEl = document.getElementById("checkout-total");

  function loadItems() {
    try {
      return JSON.parse(localStorage.getItem(ITEMS_STORAGE_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function parsePrice(value) {
    return Number(String(value || "").replace(/[^\d]/g, "") || 0);
  }

  function formatPrice(value) {
    return value.toLocaleString("vi-VN") + "đ";
  }

  function renderSummary(items) {
    if (!items.length) {
      checkoutItemsEl.textContent = "Giỏ hàng đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.";
      checkoutTotalEl.textContent = "0đ";
      return;
    }

    checkoutItemsEl.innerHTML = items
      .map(function (item) {
        return "- " + item.name + " x" + item.qty + " (" + item.price + ")";
      })
      .join("<br>");

    const total = items.reduce(function (sum, item) {
      return sum + parsePrice(item.price) * item.qty;
    }, 0);
    checkoutTotalEl.textContent = formatPrice(total);
  }

  function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || "[]");
    orders.unshift(order);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }

  const currentItems = loadItems();
  renderSummary(currentItems);

  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || "null");
  } catch (error) {
    currentUser = null;
  }
  if (!currentUser || !currentUser.fullName) {
    alert("Vui lòng đăng nhập trước khi thanh toán.");
    window.location.href = "login.html";
    return;
  }

  checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const items = loadItems();
    if (!items.length) {
      alert("Giỏ hàng đang trống.");
      return;
    }

    const order = {
      id: "OD" + Date.now(),
      createdAt: new Date().toISOString(),
      customer: {
        fullName: document.getElementById("full-name").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim()
      },
      paymentMethod: document.getElementById("payment-method").value,
      items: items
    };

    saveOrder(order);
    localStorage.setItem(ITEMS_STORAGE_KEY, "[]");
    localStorage.setItem(COUNT_STORAGE_KEY, "0");
    alert("Đặt hàng thành công! Mã đơn: " + order.id);
    window.location.href = "order-history.html";
  });
})();
