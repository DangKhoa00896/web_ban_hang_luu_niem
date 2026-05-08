(function () {
  const ITEMS_STORAGE_KEY = "smile-shop-cart-items";
  const COUNT_STORAGE_KEY = "smile-shop-cart-count";
  const IMAGE_BY_PAGE = {
    "trangchu.html": [
      "tracen.jpg",
      "Tracen_Academy.webp",
      "Tazuna_Hayakawa_29.webp",
      "GenreHeader_880x440_Umamusume.webp",
      "tracen.jpg",
      "Tracen_Academy.webp"
    ],
    "nendoroid.html": [
      "tamamo chibi.webp",
      "super creek chibi.webp",
      "oguri cap chibi2.webp",
      "Fujimasa March chibi.webp",
      "manhattan cafe chibi.webp",
      "agnes tachyon chibi.webp"
      
    ],
    "scale-figure.html": [
      "mambo.webp",
      "narita brian.webp",
      "fusaichi.webp",
      "gran.webp",
      "tamamo.webp",
      "dantsu flame.webp",
      "manhattan cafe webp.webp",
      "rudolf.webp",
      "mayanooo.webp",
      "hishi miracle.webp"
    ],
    "pop-up-parade.html": [
      "plush-sharkitty-shark-cat-plush-doll-big-orange-shark-cat-50cm-1208367294_1024x1024.webp",
      "banner2.webp",
      "Max-Plushie-by-Steve-Purcell_900x.webp",
      "sam.webp",
      "sach.webp",
      "tb.webp",
      "leon.webp",
      "red.webp",
      "cocfudi.avif",
      "demon.webp"
    ],
    "plush-doll.html": [
     "cafe.jpg",
     "oguri.webp",
     "gentil.jpg",
     "mamboo.jpg",
     "mihono.jpg",
     "nice.jpg",
     "rice.jpg",
     "tamtam.jpg",
     "ulala.jpg",
     "week.jpg"
     
    ],
    "keychain-strap.html": [
      "d1.webp",
      "d2.webp",
      "d3.webp",
      "d4.webp",
      "d5.webp",
      "d6.webp",
      "d7.avif",
      "d8.jpg",
      "d9.webp",
      "d10.jpg"
    ],
    "acrylic-stand.html": [
      "stand1.webp",
      "stand2.jpg",
      "stand3.jpg",
      "stand4.jpg",
      "stand5.jpg",
      "stand6.jpg",
      "stand7.jpg",
      "stand8.jpg",
      "stand9.jpg",
      "stand10.jpg"
    ],
    "trang-tri-ban.html": [
      "car1.jpg",
      "car2.jpg",
      "car3.jpg",
      "car4.jpg",
      "car5.jpg",
      "car6.jpg",
      "car7.jpg",
      "car8.jpg",
      "car9.jpg",
      "car10.jpg"
    ],
    "preorder.html": [
      "tracen.jpg",
      "GenreHeader_880x440_Umamusume.webp",
      "Tazuna_Hayakawa_29.webp"
    ],
    "sale.html": [
      "GenreHeader_880x440_Umamusume.webp",
      "Tazuna_Hayakawa_29.webp",
      "Tracen_Academy.webp"
    ]
  };
  const DEFAULT_IMAGE_POOL = [
    "tracen.jpg",
    "Tracen_Academy.webp",
    "Tazuna_Hayakawa_29.webp"
  ];

  function isUnderWebHtmlPath() {
    var path = (window.location.pathname || "").replace(/\\/g, "/");
    return /\/web\/[^/]+\.html?$/i.test(path);
  }

  function resolveProductImageSrc(src) {
    if (!src) return src;
    var s = String(src).trim();
    if (/^(https?:|data:|blob:)/i.test(s)) return s;
    if (s.lastIndexOf("../", 0) === 0 || s.lastIndexOf("./", 0) === 0) return s;
    var prefix = isUnderWebHtmlPath() ? "../images/" : "images/";
    if (s.indexOf("images/") === 0) return prefix + s.slice("images/".length);
    return prefix + s;
  }

  function loadCartItems() {
    try {
      const parsed = JSON.parse(localStorage.getItem(ITEMS_STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveCartItems(items) {
    localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
    const count = items.reduce(function (sum, item) {
      return sum + item.qty;
    }, 0);
    localStorage.setItem(COUNT_STORAGE_KEY, String(count));
  }

  function getPriceFromCard(card) {
    const priceEl = card.querySelector(".product-price");
    if (!priceEl) return "Liên hệ";
    const match = priceEl.textContent.trim().replace(/\s+/g, " ").match(/\d[\d\.]*đ/);
    return match ? match[0] : "Liên hệ";
  }

  function addToCart(productName, productPrice) {
    const items = loadCartItems();
    const existing = items.find(function (item) {
      return item.name === productName;
    });
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ name: productName, price: productPrice, qty: 1 });
    }
    saveCartItems(items);
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      const nextCount = Number(el.textContent || "0") + 1;
      el.textContent = String(nextCount);
    });
  }
function applyHighlightFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const highlight = (params.get("highlight") || "").trim().toLowerCase();
    if (!highlight) return;
    const cards = Array.from(document.querySelectorAll(".product-card"));
    const targetCard = cards.find(function (card) {
      const titleEl = card.querySelector(".product-title");
      return titleEl && titleEl.textContent.trim().toLowerCase() === highlight;
    });
    if (!targetCard) return;
    cards.forEach(function (card) {
      card.style.display = "";
      card.classList.remove("product-focus");
    });
    targetCard.classList.add("product-focus");
    targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(function () {
      targetCard.classList.remove("product-focus");
    }, 1800);
  }
  function ensureAddButtons() {
    const cards = Array.from(document.querySelectorAll(".product-card"));
    cards.forEach(function (card) {
      const existingAddBtn = card.querySelector(".add-cart-btn");
      if (existingAddBtn) return;

      const existingAnyMiniBtn = card.querySelector(".product-footer .btn-mini");
      if (existingAnyMiniBtn) {
        existingAnyMiniBtn.classList.add("add-cart-btn");
        return;
      }

      const body = card.querySelector(".product-body");
      if (!body) return;

      const footer = document.createElement("div");
      footer.className = "product-footer";
      footer.innerHTML = '<button class="btn-mini add-cart-btn" type="button">🛒 Thêm vào giỏ</button>';
      body.appendChild(footer);
    });
  }

  function ensureProductImages() {
    const cards = Array.from(document.querySelectorAll(".product-card"));
    const pageName = window.location.pathname.split("/").pop().toLowerCase();
    const pool = IMAGE_BY_PAGE[pageName] || DEFAULT_IMAGE_POOL;
    cards.forEach(function (card, index) {
      const body = card.querySelector(".product-body");
      if (!body) return;

      const titleEl = card.querySelector(".product-title");
      const productTitle = titleEl ? titleEl.textContent.trim() : "San pham";
      const manualImage = card.getAttribute("data-image-src");
      const resolvedSrc = resolveProductImageSrc(manualImage || pool[index % pool.length]);
      const existingImage = card.querySelector(".product-image");

      if (existingImage) {
        existingImage.setAttribute("src", resolvedSrc);
        existingImage.setAttribute("loading", "lazy");
        existingImage.setAttribute("decoding", "async");
        existingImage.setAttribute("alt", productTitle);
        return;
      }

      const imageWrapper = document.createElement("div");
      imageWrapper.className = "product-image-wrapper";
      imageWrapper.innerHTML =
        '<div class="product-image-inner">' +
        '<img class="product-image" src="' + resolvedSrc + '" alt="' + productTitle + '" loading="lazy" decoding="async">' +
        "</div>";

      card.insertBefore(imageWrapper, body);
    });

    document.querySelectorAll(".product-image").forEach(function (img) {
      img.addEventListener("error", function () {
        img.src = resolveProductImageSrc("tracen.jpg");
        img.onerror = function () {
          img.src = "https://picsum.photos/seed/smile-shop-product/520/520";
          img.onerror = null;
        };
      }, { once: true });
    });
  }

  function ensureTenProducts() {
    const productGrid = document.querySelector(".product-grid");
    if (!productGrid) return;

    const cards = Array.from(productGrid.querySelectorAll(".product-card"));
    const pageName = window.location.pathname.split("/").pop().toLowerCase();
    let targetCount = null;
    if (pageName === "trangchu.html") targetCount = 5;
    else if (pageName === "nendoroid.html") targetCount = 6;

    if (!cards.length) return;

    if (targetCount !== null) {
      cards.forEach(function (card, i) {
        card.style.display = i < targetCount ? "" : "none";
      });
    }

    if (targetCount === null) return;

    const currentCards = Array.from(
      productGrid.querySelectorAll(".product-card")
    ).filter(function (c) {
      return c.style.display !== "none";
    });
    if (currentCards.length >= targetCount) return;

    const baseName = pageName.replace(".html", "").replace(/-/g, " ");
    const titlePrefix = baseName ? baseName.toUpperCase() : "SAN PHAM";
    const templateCard = currentCards[0];

    for (let i = currentCards.length; i < targetCount; i += 1) {
      const clone = templateCard.cloneNode(true);
      const titleEl = clone.querySelector(".product-title");
      const seriesEl = clone.querySelector(".product-series");
      const priceEl = clone.querySelector(".product-price");
      const badgeEl = clone.querySelector(".product-badge");
      const statusEl = clone.querySelector(".product-status");
      const dateEl = clone.querySelector(".product-date");
      const oldBtn = clone.querySelector(".add-cart-btn");
      if (oldBtn) oldBtn.classList.remove("add-cart-btn");

      if (titleEl) titleEl.textContent = titlePrefix + " - Mau so " + String(i + 1);
      if (seriesEl) seriesEl.textContent = "Smile Figure Collection";
      if (priceEl) {
        const generatedPrice = (450000 + i * 90000).toLocaleString("vi-VN") + "đ";
        priceEl.innerHTML = generatedPrice;
      }
      if (badgeEl) badgeEl.textContent = i % 2 === 0 ? "New" : "Hot";
      if (statusEl) statusEl.textContent = i % 3 === 0 ? "Pre-order" : "Con hang";
      if (dateEl) dateEl.textContent = "Cap nhat danh muc";

      productGrid.appendChild(clone);
    }
  }

  ensureTenProducts();
  ensureProductImages();
  ensureAddButtons();
  applyHighlightFromQuery();

  document.addEventListener("click", function (event) {
    const addBtn = event.target.closest(".add-cart-btn");
    if (!addBtn) return;
    const card = addBtn.closest(".product-card");
    if (!card) return;
    const titleEl = card.querySelector(".product-title");
    const productName = titleEl ? titleEl.textContent.trim() : "San pham";
    const productPrice = getPriceFromCard(card);
    addToCart(productName, productPrice);
  });
})();

