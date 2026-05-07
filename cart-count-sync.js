(function () {
  const COUNT_STORAGE_KEY = "smile-shop-cart-count";
  const ITEMS_STORAGE_KEY = "smile-shop-cart-items";

  function getCartCount() {
    try {
      const items = JSON.parse(localStorage.getItem(ITEMS_STORAGE_KEY) || "[]");
      if (Array.isArray(items) && items.length) {
        return items.reduce(function (sum, item) {
          return sum + (Number(item.qty) || 0);
        }, 0);
      }
    } catch (error) {
      // fallback below
    }
    return Number(localStorage.getItem(COUNT_STORAGE_KEY) || 0);
  }

  const count = getCartCount();
  document.querySelectorAll("[data-cart-count]").forEach(function (el) {
    el.textContent = String(count);
  });
})();
