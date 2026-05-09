(function () {
  const searchInput = document.getElementById("search-input");
  const productList = document.getElementById("product-list");
  const productCards = Array.from(document.querySelectorAll(".product-card"));
  const productTitles = productCards
    .map(function (card) {
      const titleEl = card.querySelector(".product-title");
      return titleEl ? titleEl.textContent.trim() : "";
    })
    .filter(Boolean);
  const PRODUCT_ROUTE_BY_NAME = {
    "nendoroid hero girl - edition sakura festival": "trangchu.html",
    "scale figure 1/7 magic idol star stage ver.": "trangchu.html",
    "acrylic stand chibi friends - set 3 nhân vật": "trangchu.html",
    "plush doll - bunny dream night ver.": "trangchu.html",
    "móc khóa rubber - smile chibi pack (set 4)": "trangchu.html",
    "desk decoration set - mini world anime room": "trangchu.html",
    "gối ôm cá mập vàng": "pop-up-parade.html",
    "gối ôm cá mập xám": "pop-up-parade.html",
    "thỏ bông tai dài snow bunny": "pop-up-parade.html",
    "gấu vest xanh gentle bear": "pop-up-parade.html",
    "poster vintage red frame catalog": "pop-up-parade.html",
    "ly sứ trái tim arthur morgan": "pop-up-parade.html",
    "khung ảnh thú bông leon": "pop-up-parade.html",
    "khung ảnh thú bông red": "pop-up-parade.html",
    "ly sứ mascot wolf run": "pop-up-parade.html",
    "combo đồ uống mèo đen black cat cafe": "pop-up-parade.html",
    "manhattan cafe": "plush-doll.html",
    "oguri cap": "plush-doll.html",
    "gentildonna": "plush-doll.html",
    "matikanetannhauser": "plush-doll.html",
    "mihono bourbon": "plush-doll.html",
    "nice nature": "plush-doll.html",
    "rice shower": "plush-doll.html",
    "tamamo cross": "plush-doll.html",
    "haru urara": "plush-doll.html",
    "special week": "plush-doll.html",
    "key chain deltarune 1": "keychain-strap.html",
    "key chain deltarune 2": "keychain-strap.html",
    "key chain deltarune 3": "keychain-strap.html",
    "key chain deltarune 4": "keychain-strap.html",
    "key chain deltarune 5": "keychain-strap.html",
    "key chain deltarune 6": "keychain-strap.html",
    "key chain deltarune 7": "keychain-strap.html",
    "key chain deltarune 8": "keychain-strap.html",
    "key chain deltarune 9": "keychain-strap.html",
    "combo sticker deltarune": "keychain-strap.html"
  };
  const suggestSource = Array.from(new Set(productTitles.concat(Object.keys(PRODUCT_ROUTE_BY_NAME))));
  const COUNT_STORAGE_KEY = "smile-shop-cart-count";
  const ITEMS_STORAGE_KEY = "smile-shop-cart-items";
  let searchSuggestBox = null;
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
    var text = String(cartCount);
    document.querySelectorAll("#cart-count, [data-cart-count]").forEach(function (el) {
      el.textContent = text;
    });
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

  function focusProductByName(productName) {
    if (!productName) return;

    productCards.forEach(function (card) {
      card.style.display = "";
      card.classList.remove("product-focus");
    });

    const targetCard = productCards.find(function (card) {
      const titleEl = card.querySelector(".product-title");
      return titleEl && titleEl.textContent.trim().toLowerCase() === productName.trim().toLowerCase();
    });

    if (!targetCard) {
      filterProducts(productName);
      return;
    }

    targetCard.style.display = "";
    targetCard.classList.add("product-focus");
    targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(function () {
      targetCard.classList.remove("product-focus");
    }, 1500);
  }

  function getCurrentFileName() {
    return (window.location.pathname.split("/").pop() || "").toLowerCase();
  }

  function getTargetRoute(productName) {
    return PRODUCT_ROUTE_BY_NAME[(productName || "").trim().toLowerCase()] || getCurrentFileName();
  }

  function ensureSuggestBox() {
    if (searchSuggestBox || !searchInput) return;
    searchSuggestBox = document.createElement("div");
    searchSuggestBox.className = "search-suggest-box";
    searchInput.parentElement.appendChild(searchSuggestBox);
  }

  function hideSuggestions() {
    if (!searchSuggestBox) return;
    searchSuggestBox.innerHTML = "";
    searchSuggestBox.classList.remove("open");
  }

  function showSuggestions(query) {
    ensureSuggestBox();
    if (!searchSuggestBox) return;

    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      hideSuggestions();
      return;
    }

    const suggestions = suggestSource
      .filter(function (name) { return name.toLowerCase().includes(keyword); })
      .slice(0, 6);

    if (!suggestions.length) {
      hideSuggestions();
      return;
    }

    searchSuggestBox.innerHTML = suggestions
      .map(function (name) {
        return '<button type="button" class="search-suggest-item" data-name="' + name.replace(/"/g, "&quot;") + '">' + name + "</button>";
      })
      .join("");
    searchSuggestBox.classList.add("open");
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
      if (productList) {
        productList.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    if (event.target.closest(".btn-outline")) {
      showToast("Lich phat hanh dang cap nhat, vui long quay lai sau.");
      return;
    }
  });

  if (searchInput) {
    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        filterProducts(searchInput.value);
        hideSuggestions();
      }
    });

    searchInput.addEventListener("input", function () {
      if (!searchInput.value.trim()) {
        productCards.forEach(function (card) { card.style.display = ""; });
      }
      showSuggestions(searchInput.value);
    });

    searchInput.addEventListener("focus", function () {
      showSuggestions(searchInput.value);
    });
  }

  document.addEventListener("click", function (event) {
    if (event.target.closest(".search-suggest-item")) {
      const item = event.target.closest(".search-suggest-item");
      const selected = item.getAttribute("data-name") || item.textContent.trim();
      searchInput.value = selected;
      const targetRoute = getTargetRoute(selected);
      if (targetRoute && targetRoute !== getCurrentFileName()) {
        window.location.href = targetRoute + "?highlight=" + encodeURIComponent(selected);
      } else {
        focusProductByName(selected);
      }
      hideSuggestions();
      return;
    }

    if (!event.target.closest(".search-box")) {
      hideSuggestions();
    }
  });

  (function applyHighlightFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const highlight = params.get("highlight");
    if (!highlight) return;
    setTimeout(function () {
      focusProductByName(highlight);
    }, 120);
  })();
})();