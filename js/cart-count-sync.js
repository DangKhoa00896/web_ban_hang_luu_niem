(function () {
  function ensureRobotoNonBlocking() {
    if (document.querySelector('link[data-smile-google-font="1"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;800&display=swap";
    link.media = "print";
    link.onload = function () {
      link.media = "all";
    };
    link.setAttribute("data-smile-google-font", "1");
    document.head.appendChild(link);
  }
  ensureRobotoNonBlocking();

  const COUNT_STORAGE_KEY = "smile-shop-cart-count";
  const ITEMS_STORAGE_KEY = "smile-shop-cart-items";
  const USER_STORAGE_KEY = "smile-shop-user";
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
  const MENU_LABEL_BY_HREF = {
    "pop-up-parade.html": "MISCELLANEOUS",
    "keychain-strap.html": "Móc khóa & Stickers",
    "trang-tri-ban.html": "Racing Cars"
  };

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

  function syncAuthUI() {
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || "null");
    } catch (error) {
      user = null;
    }

    const actionAreas = Array.from(document.querySelectorAll(".header-actions"));
    actionAreas.forEach(function (area) {
      const links = Array.from(area.querySelectorAll("a"));
      const loginLink = links.find(function (a) {
        return a.getAttribute("href") === "#dang-nhap" || a.getAttribute("href") === "login.html" || a.textContent.includes("Đăng nhập");
      });
      if (!loginLink) return;

      let logoutLink = area.querySelector(".logout-link");

      if (user && user.fullName) {
        loginLink.textContent = "👤 " + user.fullName;
        loginLink.setAttribute("href", "javascript:void(0)");
        if (!logoutLink) {
          logoutLink = document.createElement("a");
          logoutLink.className = "logout-link";
          logoutLink.href = "#";
          logoutLink.textContent = "Đăng xuất";
          area.appendChild(logoutLink);
        }
      } else {
        loginLink.textContent = "👤 Đăng nhập";
        loginLink.setAttribute("href", "login.html");
        if (logoutLink) logoutLink.remove();
      }
    });
  }

  function ensureDashboardMenuLink() {
    const navLinks = Array.from(document.querySelectorAll("nav .nav-inner"));
    navLinks.forEach(function (menu) {
      const existed = Array.from(menu.querySelectorAll("a")).some(function (a) {
        const href = (a.getAttribute("href") || "").toLowerCase();
        return href === "dashboard.html" || a.textContent.toLowerCase().includes("dashboard");
      });

      if (existed) return;

      const link = document.createElement("a");
      link.href = "dashboard.html";
      link.textContent = "Dashboard";
      menu.appendChild(link);
    });
  }

  function syncMenuLabels() {
    const navAnchors = Array.from(document.querySelectorAll("nav .nav-inner a[href]"));
    navAnchors.forEach(function (link) {
      const href = (link.getAttribute("href") || "").toLowerCase();
      const mappedLabel = MENU_LABEL_BY_HREF[href];
      if (!mappedLabel) return;
      link.textContent = mappedLabel;
    });
  }

  function applyHighlightFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const highlight = (params.get("highlight") || "").trim().toLowerCase();
    if (!highlight) return;

    const cards = Array.from(document.querySelectorAll(".product-card"));
    const target = cards.find(function (card) {
      const titleEl = card.querySelector(".product-title");
      return titleEl && titleEl.textContent.trim().toLowerCase() === highlight;
    });
    if (!target) return;

    cards.forEach(function (card) {
      card.classList.remove("product-focus");
      card.style.display = "";
    });
    target.classList.add("product-focus");
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(function () {
      target.classList.remove("product-focus");
    }, 1600);
  }

  function enableGlobalSearchSuggest() {
    const currentFile = (window.location.pathname.split("/").pop() || "").toLowerCase();
    if (currentFile === "trangchu.html" || currentFile === "") return;

    const searchInput = document.getElementById("search-input") || document.querySelector(".search-box input");
    if (!searchInput || !searchInput.parentElement) return;

    const localTitles = Array.from(document.querySelectorAll(".product-card .product-title"))
      .map(function (el) { return el.textContent.trim(); })
      .filter(Boolean);
    const suggestSource = Array.from(new Set(localTitles.concat(Object.keys(PRODUCT_ROUTE_BY_NAME))));

    const box = document.createElement("div");
    box.className = "search-suggest-box";
    searchInput.parentElement.appendChild(box);

    function hideBox() {
      box.innerHTML = "";
      box.classList.remove("open");
    }

    function showBox(query) {
      const keyword = (query || "").trim().toLowerCase();
      if (!keyword) {
        hideBox();
        return;
      }
      const suggestions = suggestSource
        .filter(function (name) { return name.toLowerCase().includes(keyword); })
        .slice(0, 6);
      if (!suggestions.length) {
        hideBox();
        return;
      }
      box.innerHTML = suggestions.map(function (name) {
        return '<button type="button" class="search-suggest-item" data-name="' + name.replace(/"/g, "&quot;") + '">' + name + "</button>";
      }).join("");
      box.classList.add("open");
    }

    function currentFileName() {
      return (window.location.pathname.split("/").pop() || "").toLowerCase();
    }

    searchInput.addEventListener("input", function () {
      showBox(searchInput.value);
    });
    searchInput.addEventListener("focus", function () {
      showBox(searchInput.value);
    });

    document.addEventListener("click", function (event) {
      const item = event.target.closest(".search-suggest-item");
      if (item) {
        const selected = item.getAttribute("data-name") || item.textContent.trim();
        const targetRoute = PRODUCT_ROUTE_BY_NAME[selected.trim().toLowerCase()] || currentFileName();
        searchInput.value = selected;
        hideBox();
        if (targetRoute !== currentFileName()) {
          window.location.href = targetRoute + "?highlight=" + encodeURIComponent(selected);
        } else {
          const targetCard = Array.from(document.querySelectorAll(".product-card")).find(function (card) {
            const titleEl = card.querySelector(".product-title");
            return titleEl && titleEl.textContent.trim().toLowerCase() === selected.trim().toLowerCase();
          });
          if (targetCard) {
            targetCard.classList.add("product-focus");
            targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(function () { targetCard.classList.remove("product-focus"); }, 1500);
          }
        }
        return;
      }
      if (!event.target.closest(".search-box")) {
        hideBox();
      }
    });
  }

  function optimizeImageLoading() {
    const images = Array.from(document.querySelectorAll("img"));
    images.forEach(function (img) {
      const isCritical = img.classList.contains("hero-banner-image");
      if (!img.getAttribute("decoding")) {
        img.setAttribute("decoding", "async");
      }
      if (!img.getAttribute("loading")) {
        img.setAttribute("loading", isCritical ? "eager" : "lazy");
      }
    });
  }

  function syncNavActiveAndScroll() {
    const pathFile = (window.location.pathname.split("/").pop() || "").toLowerCase();
    const normalizedPath = pathFile === "" || pathFile === "index.html" ? "trangchu.html" : pathFile;

    document.querySelectorAll("nav .nav-inner").forEach(function (inner) {
      let active = inner.querySelector("a.active");
      if (!active) {
        inner.querySelectorAll("a[href]").forEach(function (a) {
          const hrefRaw = (a.getAttribute("href") || "").trim();
          const href = hrefRaw.split(/[?#]/)[0].toLowerCase();
          if (!href || href === "#" || href.indexOf("javascript:") === 0) return;
          if (href === normalizedPath) {
            inner.querySelectorAll("a.active").forEach(function (x) {
              x.classList.remove("active");
            });
            a.classList.add("active");
            active = a;
          }
        });
      }
      if (!active) return;

      function scrollCenter() {
        try {
          active.scrollIntoView({ inline: "center", block: "nearest", behavior: "auto" });
        } catch (e) {
          active.scrollIntoView();
        }
      }
      requestAnimationFrame(scrollCenter);
      setTimeout(scrollCenter, 80);
    });
  }

  document.addEventListener("click", function (event) {
    const logoutBtn = event.target.closest(".logout-link");
    if (!logoutBtn) return;
    event.preventDefault();
    localStorage.removeItem(USER_STORAGE_KEY);
    window.location.href = "trangchu.html";
  });

  syncAuthUI();
  syncMenuLabels();
  ensureDashboardMenuLink();
  syncNavActiveAndScroll();
  enableGlobalSearchSuggest();
  applyHighlightFromQuery();
  optimizeImageLoading();
})();
