(function () {
  const ORDERS_STORAGE_KEY = "smile-shop-orders";
  const ordersListEl = document.getElementById("orders-list");
  const btnClearHistory = document.getElementById("btn-clear-history");

  function formatDate(iso) {
    const date = new Date(iso);
    return date.toLocaleString("vi-VN");
  }

  function parsePrice(value) {
    return Number(String(value || "").replace(/[^\d]/g, "") || 0);
  }

  function formatPrice(value) {
    return value.toLocaleString("vi-VN") + "đ";
  }

  function renderOrder(order) {
    const total = order.items.reduce(function (sum, item) {
      return sum + parsePrice(item.price) * item.qty;
    }, 0);
    const itemsHtml = order.items
      .map(function (item) {
        return "- " + item.name + " x" + item.qty + " (" + item.price + ")";
      })
      .join("<br>");

    return (
      '<article class="product-card">' +
      '<div class="product-body">' +
      '<h2 class="product-title">' + order.id + "</h2>" +
      '<div class="product-series">Ngay dat: ' + formatDate(order.createdAt) + "</div>" +
      '<div class="product-series">Nguoi nhan: ' + order.customer.fullName + " - " + order.customer.phone + "</div>" +
      '<div class="product-series">Dia chi: ' + order.customer.address + "</div>" +
      '<div class="product-series">Thanh toan: ' + order.paymentMethod + "</div>" +
      '<div class="product-meta"><div class="product-price">Tong tien: ' + formatPrice(total) + '</div><div class="product-status">Da luu</div></div>' +
      '<div class="product-footer"><div class="product-date">' + itemsHtml + "</div></div>" +
      "</div>" +
      "</article>"
    );
  }

  const orders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || "[]");
  if (!orders.length) {
    ordersListEl.innerHTML = '<article class="product-card"><div class="product-body"><h2 class="product-title">Chưa có đơn hàng</h2><div class="product-series">Hãy mua hàng và thanh toán để tạo lịch sử đơn.</div></div></article>';
    return;
  }
ordersListEl.innerHTML = orders.map(renderOrder).join("");

  // Xử lý nút xóa lịch sử
  if (btnClearHistory) {
    if (!orders.length) {
      btnClearHistory.style.display = "none";
    }
    
    btnClearHistory.addEventListener("click", function () {
      if (confirm("Bạn có chắc muốn xóa toàn bộ lịch sử đơn hàng không?")) {
        localStorage.removeItem(ORDERS_STORAGE_KEY);
        ordersListEl.innerHTML = '<article class="product-card"><div class="product-body"><h2 class="product-title">Chưa có đơn hàng</h2><div class="product-series">Hãy mua hàng và thanh toán để tạo lịch sử đơn.</div></div></article>';
        btnClearHistory.style.display = "none";
      }
    });
  }
})();
