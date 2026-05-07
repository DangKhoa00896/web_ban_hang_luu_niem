(function () {
  const cartCountEl = document.getElementById("cart-count");
  const searchInput = document.getElementById("search-input");
  const productList = document.getElementById("product-list");
  const productCards = Array.from(document.querySelectorAll(".product-card"));
  const COUNT_STORAGE_KEY = "smile-shop-cart-count";
  const ITEMS_STORAGE_KEY = "smile-shop-cart-items";
  let cartItems = loadCartItems();
  let cartCount = getCartCount();

  function loadCartItems() {
    try {
      const raw = localStorage.getItem(ITEMS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveCartItems() {
    localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(cartItems));
    cartCount = getCartCount();
    localStorage.setItem(COUNT_STORAGE_KEY, String(cartCount));
  }

  function getCartCount() {
    return cartItems.reduce(function (total, item) {
      return total + item.qty;
    }, 0);
  }

  function updateCartUI() {
    cartCountEl.textContent = String(cartCount);
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.cssText = "position:fixed;right:18px;bottom:18px;background:#111;color:#fff;padding:10px 14px;border-radius:10px;font-size:13px;z-index:9999;box-shadow:0 8px 20px rgba(0,0,0,.25);";
    document.body.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 1600);
  }

  function addToCart(productName, productPrice) {
    const existingItem = cartItems.find(function (item) {
      return item.name === productName;
    });
    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cartItems.push({
        name: productName,
        price: productPrice,
        qty: 1
      });
    }
    saveCartItems();
    updateCartUI();
    showToast("Da them vao gio: " + productName);
  }

  function filterProducts(query) {
    const keyword = query.trim().toLowerCase();
    let visibleCount = 0;
    productCards.forEach(function (card) {
      const title = card.querySelector(".product-title").textContent.toLowerCase();
      const matched = title.includes(keyword);
      card.style.display = matched ? "" : "none";
      if (matched) visibleCount += 1;
    });
    if (keyword) {
      showToast("Tim thay " + visibleCount + " san pham");
    }
  }

  updateCartUI();

  document.addEventListener("click", function (event) {
    const addBtn = event.target.closest(".btn-mini");
    if (addBtn) {
      const card = addBtn.closest(".product-card");
      const productName = card.querySelector(".product-title").textContent.trim();
      const priceText = card.querySelector(".product-price").textContent.trim().replace(/\s+/g, " ");
      const currentPrice = (priceText.match(/\d[\d\.]*đ/) || ["Lien he"])[0];
      addToCart(productName, currentPrice);
      return;
    }

    if (event.target.closest(".btn-primary")) {
      productList.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (event.target.closest(".btn-outline")) {
      showToast("Lich phat hanh dang cap nhat, vui long quay lai sau.");
      return;
    }

  });

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      filterProducts(searchInput.value);
    }
  });

  searchInput.addEventListener("input", function () {
    if (!searchInput.value.trim()) {
      productCards.forEach(function (card) { card.style.display = ""; });
    }
  });
})();
