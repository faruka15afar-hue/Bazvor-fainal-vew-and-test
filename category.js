"use strict";

/* =========================================================
   BAZVOR CATEGORY PAGE
   COMPLETE REPLACEMENT JS

   FEATURES
   ---------------------------------------------------------
   • Hardcoded Categories
   • Hardcoded Products
   • No Search
   • Category Filtering
   • All Categories
   • Product Sorting
   • Add To Cart
   • Wishlist
   • Cart Count
   • Bottom Navigation
   • LocalStorage
   • Responsive Friendly
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const BAZVOR = {
  brand: "Bazvor",

  storage: {
    cart: "bazvor_cart",
    wishlist: "bazvor_wishlist"
  }
};


/* =========================================================
   CATEGORY DATA
========================================================= */

const categories = [

  {
    id: "all",
    name: "All",
    image:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=500&q=80"
  },

  {
    id: "electronics",
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=500&q=80"
  },

  {
    id: "fashion",
    name: "Fashion",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=500&q=80"
  },

  {
    id: "beauty",
    name: "Beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80"
  },

  {
    id: "home",
    name: "Home & Living",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80"
  },

  {
    id: "sports",
    name: "Sports",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=500&q=80"
  },

  {
    id: "agriculture",
    name: "Agriculture",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=500&q=80"
  },

  {
    id: "automotive",
    name: "Automotive",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=500&q=80"
  },

  {
    id: "mobile",
    name: "Mobiles",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80"
  },

  {
    id: "watches",
    name: "Watches",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=500&q=80"
  },

  {
    id: "grocery",
    name: "Grocery",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80"
  },

  {
    id: "baby",
    name: "Baby & Kids",
    image:
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=500&q=80"
  }

];


/* =========================================================
   PRODUCT DATA
========================================================= */

const products = [

  {
    id: "p001",
    name: "Premium Wireless Headphones",
    category: "electronics",
    price: 1890,
    oldPrice: 2490,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85",
    rating: 4.8,
    reviews: 128,
    badge: "Popular"
  },

  {
    id: "p002",
    name: "Classic Men's Casual Shirt",
    category: "fashion",
    price: 790,
    oldPrice: 1100,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85",
    rating: 4.7,
    reviews: 94,
    badge: "Sale"
  },

  {
    id: "p003",
    name: "Smartphone Pro Max",
    category: "mobile",
    price: 28990,
    oldPrice: 31990,
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=85",
    rating: 4.9,
    reviews: 231,
    badge: "Top Rated"
  },

  {
    id: "p004",
    name: "Luxury Men's Watch",
    category: "watches",
    price: 3490,
    oldPrice: 4990,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=85",
    rating: 4.8,
    reviews: 76,
    badge: "Premium"
  },

  {
    id: "p005",
    name: "Daily Beauty Care Set",
    category: "beauty",
    price: 1250,
    oldPrice: 1690,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=85",
    rating: 4.6,
    reviews: 63,
    badge: "New"
  },

  {
    id: "p006",
    name: "Modern Home Sofa",
    category: "home",
    price: 18500,
    oldPrice: 22000,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=85",
    rating: 4.7,
    reviews: 41,
    badge: "Featured"
  },

  {
    id: "p007",
    name: "Professional Football",
    category: "sports",
    price: 990,
    oldPrice: 1290,
    image:
      "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=700&q=85",
    rating: 4.8,
    reviews: 52,
    badge: "Popular"
  },

  {
    id: "p008",
    name: "Organic Fresh Vegetables",
    category: "agriculture",
    price: 450,
    oldPrice: 550,
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=85",
    rating: 4.5,
    reviews: 37,
    badge: "Fresh"
  },

  {
    id: "p009",
    name: "Car Interior Accessories Set",
    category: "automotive",
    price: 1450,
    oldPrice: 1890,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=85",
    rating: 4.6,
    reviews: 44,
    badge: "Hot"
  },

  {
    id: "p010",
    name: "Premium Baby Clothing Set",
    category: "baby",
    price: 890,
    oldPrice: 1190,
    image:
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=700&q=85",
    rating: 4.9,
    reviews: 88,
    badge: "Best Seller"
  },

  {
    id: "p011",
    name: "Bluetooth Portable Speaker",
    category: "electronics",
    price: 1590,
    oldPrice: 1990,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=85",
    rating: 4.7,
    reviews: 72,
    badge: "Popular"
  },

  {
    id: "p012",
    name: "Premium Women's Dress",
    category: "fashion",
    price: 1490,
    oldPrice: 1990,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=85",
    rating: 4.8,
    reviews: 113,
    badge: "New"
  },

  {
    id: "p013",
    name: "Wireless Smart Watch",
    category: "watches",
    price: 2290,
    oldPrice: 2990,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e5a?auto=format&fit=crop&w=700&q=85",
    rating: 4.6,
    reviews: 81,
    badge: "Sale"
  },

  {
    id: "p014",
    name: "Skincare Essentials",
    category: "beauty",
    price: 990,
    oldPrice: 1390,
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=85",
    rating: 4.7,
    reviews: 69,
    badge: "Trending"
  },

  {
    id: "p015",
    name: "Premium Rice 5kg",
    category: "agriculture",
    price: 490,
    oldPrice: 550,
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=85",
    rating: 4.5,
    reviews: 35,
    badge: "Fresh"
  },

  {
    id: "p016",
    name: "Running Sports Shoes",
    category: "sports",
    price: 2190,
    oldPrice: 2890,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",
    rating: 4.8,
    reviews: 146,
    badge: "Best Seller"
  }

];


/* =========================================================
   STATE
========================================================= */

let activeCategory = "all";
let currentProducts = [...products];

let cart = loadStorage(BAZVOR.storage.cart, []);
let wishlist = loadStorage(BAZVOR.storage.wishlist, []);


/* =========================================================
   DOM HELPERS
========================================================= */

function $(selector, parent = document) {
  return parent.querySelector(selector);
}


function $$(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}


/* =========================================================
   STORAGE
========================================================= */

function loadStorage(key, fallback) {

  try {

    const saved = localStorage.getItem(key);

    if (!saved) {
      return fallback;
    }

    return JSON.parse(saved);

  } catch (error) {

    console.warn("Bazvor storage error:", error);

    return fallback;
  }
}


function saveStorage(key, value) {

  try {

    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

  } catch (error) {

    console.warn("Bazvor storage save error:", error);
  }
}


/* =========================================================
   MONEY FORMAT
========================================================= */

function formatPrice(value) {

  return "৳" + Number(value).toLocaleString("en-BD");
}


/* =========================================================
   DISCOUNT
========================================================= */

function getDiscount(oldPrice, price) {

  if (!oldPrice || oldPrice <= price) {
    return 0;
  }

  return Math.round(
    ((oldPrice - price) / oldPrice) * 100
  );
}


/* =========================================================
   CATEGORY RENDER
========================================================= */

function renderCategories() {

  const containers = [
    ".category-grid",
    "#categoryGrid",
    ".categories-grid"
  ];

  let container = null;

  for (const selector of containers) {

    container = $(selector);

    if (container) break;
  }

  if (!container) {
    console.warn("Bazvor: category grid not found.");
    return;
  }


  container.innerHTML = categories.map(category => {

    const active =
      category.id === activeCategory
        ? "active"
        : "";

    return `
      <button
        type="button"
        class="category-card ${active}"
        data-category="${category.id}"
        aria-label="${category.name}"
      >

        <span class="category-card__image">
          <img
            src="${category.image}"
            alt="${category.name}"
            loading="lazy"
          >
        </span>

        <span class="category-card__label">
          ${category.name}
        </span>

      </button>
    `;

  }).join("");


  $$( "[data-category]", container ).forEach(card => {

    card.addEventListener(
      "click",
      () => {

        const category =
          card.dataset.category;

        selectCategory(category);

      }
    );

  });

}


/* =========================================================
   SELECT CATEGORY
========================================================= */

function selectCategory(category) {

  activeCategory = category;

  currentProducts =
    category === "all"
      ? [...products]
      : products.filter(
          product =>
            product.category === category
        );


  renderCategories();
  renderProducts();

  updateCategoryTitle();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================================================
   CATEGORY TITLE
========================================================= */

function updateCategoryTitle() {

  const title =
    $(".page-heading h1") ||
    $(".page-heading__title") ||
    $("#categoryTitle") ||
    $(".category-title");

  if (!title) return;


  const category =
    categories.find(
      item => item.id === activeCategory
    );


  if (category) {

    title.textContent =
      category.id === "all"
        ? "Explore Categories"
        : category.name;

  }

}


/* =========================================================
   PRODUCT RENDER
========================================================= */

function renderProducts(list = currentProducts) {

  const containers = [
    ".products-grid",
    "#productsGrid",
    ".product-grid"
  ];

  let container = null;

  for (const selector of containers) {

    container = $(selector);

    if (container) break;
  }

  if (!container) {

    console.warn(
      "Bazvor: products grid not found."
    );

    return;
  }


  if (!list.length) {

    container.innerHTML = `
      <div class="empty-state">

        <div class="empty-state__icon">
          🛍️
        </div>

        <h3>No products found</h3>

        <p>
          There are no products in this category yet.
        </p>

        <button
          type="button"
          class="filter-btn"
          data-show-all
        >
          View All Products
        </button>

      </div>
    `;


    const showAll =
      $("[data-show-all]", container);

    if (showAll) {

      showAll.addEventListener(
        "click",
        () => selectCategory("all")
      );

    }

    return;
  }


  container.innerHTML =
    list.map(product => createProductCard(product))
      .join("");


  bindProductEvents(container);

}


/* =========================================================
   PRODUCT CARD
========================================================= */

function createProductCard(product) {

  const discount =
    getDiscount(
      product.oldPrice,
      product.price
    );


  const liked =
    wishlist.includes(product.id);


  return `
    <article
      class="product-card"
      data-product-id="${product.id}"
    >

      <div class="product-card__media">

        ${
          product.badge
            ? `
              <span class="product-card__badge">
                ${product.badge}
              </span>
            `
            : ""
        }


        ${
          discount > 0
            ? `
              <span class="product-card__discount">
                -${discount}%
              </span>
            `
            : ""
        }


        <button
          type="button"
          class="product-card__favorite ${liked ? "active" : ""}"
          data-wishlist="${product.id}"
          aria-label="Add to wishlist"
          aria-pressed="${liked}"
        >
          ${liked ? "♥" : "♡"}
        </button>


        <img
          src="${product.image}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
          class="product-card__image"
        >

      </div>


      <div class="product-card__body">

        <h3 class="product-card__title">
          ${escapeHTML(product.name)}
        </h3>


        <div class="product-card__rating">

          <span class="stars">
            ★
          </span>

          <span>
            ${product.rating}
          </span>

          <span class="review-count">
            (${product.reviews})
          </span>

        </div>


        <div class="product-card__price-row">

          <strong class="product-card__price">
            ${formatPrice(product.price)}
          </strong>


          ${
            product.oldPrice
              ? `
                <del class="product-card__old-price">
                  ${formatPrice(product.oldPrice)}
                </del>
              `
              : ""
          }

        </div>


        <button
          type="button"
          class="add-to-cart"
          data-cart="${product.id}"
        >
          <span>+</span>
          Add to Cart
        </button>

      </div>

    </article>
  `;
}


/* =========================================================
   PRODUCT EVENTS
========================================================= */

function bindProductEvents(container) {


  /* -------------------------------------------------------
     WISHLIST
  ------------------------------------------------------- */

  $$("[data-wishlist]", container)
    .forEach(button => {

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();
          event.stopPropagation();

          toggleWishlist(
            button.dataset.wishlist
          );

        }
      );

    });


  /* -------------------------------------------------------
     CART
  ------------------------------------------------------- */

  $$("[data-cart]", container)
    .forEach(button => {

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();
          event.stopPropagation();

          addToCart(
            button.dataset.cart
          );

        }
      );

    });


  /* -------------------------------------------------------
     PRODUCT OPEN
  ------------------------------------------------------- */

  $$(".product-card", container)
    .forEach(card => {

      card.addEventListener(
        "click",
        event => {

          if (
            event.target.closest(
              "button"
            )
          ) {
            return;
          }


          const product =
            products.find(
              item =>
                item.id ===
                card.dataset.productId
            );


          if (!product) return;


          openProduct(product);

        }
      );

    });

}


/* =========================================================
   OPEN PRODUCT
========================================================= */

function openProduct(product) {

  /*
    If product-details.html exists,
    send the product ID there.
  */

  const url =
    `product-details.html?id=${encodeURIComponent(product.id)}`;


  window.location.href = url;

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(productId) {

  const product =
    products.find(
      item => item.id === productId
    );

  if (!product) return;


  const existing =
    cart.find(
      item => item.id === productId
    );


  if (existing) {

    existing.quantity =
      Number(existing.quantity || 1) + 1;

  } else {

    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
      quantity: 1
    });

  }


  saveStorage(
    BAZVOR.storage.cart,
    cart
  );


  updateCartCount();

  showToast(
    `${product.name} added to cart`
  );

}


/* =========================================================
   WISHLIST
========================================================= */

function toggleWishlist(productId) {

  const index =
    wishlist.indexOf(productId);


  if (index >= 0) {

    wishlist.splice(index, 1);

    showToast(
      "Removed from wishlist"
    );

  } else {

    wishlist.push(productId);

    showToast(
      "Added to wishlist"
    );

  }


  saveStorage(
    BAZVOR.storage.wishlist,
    wishlist
  );


  renderProducts();

}


/* =========================================================
   CART COUNT
========================================================= */

function updateCartCount() {

  const count =
    cart.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );


  const selectors = [
    ".cart-count",
    "#cartCount",
    "[data-cart-count]"
  ];


  selectors.forEach(selector => {

    $$(selector).forEach(element => {

      element.textContent =
        count > 99
          ? "99+"
          : count;

      element.style.display =
        count > 0
          ? ""
          : "none";

    });

  });

}


/* =========================================================
   SORT PRODUCTS
========================================================= */

function sortProducts(value) {

  const sorted =
    [...currentProducts];


  switch (value) {


    case "price-low":

      sorted.sort(
        (a, b) =>
          a.price - b.price
      );

      break;


    case "price-high":

      sorted.sort(
        (a, b) =>
          b.price - a.price
      );

      break;


    case "rating":

      sorted.sort(
        (a, b) =>
          b.rating - a.rating
      );

      break;


    case "discount":

      sorted.sort(
        (a, b) =>
          getDiscount(
            b.oldPrice,
            b.price
          ) -
          getDiscount(
            a.oldPrice,
            a.price
          )
      );

      break;


    case "newest":

      /*
        Products are already arranged
        newest-first in this demo.
      */

      break;


    default:

      break;

  }


  renderProducts(sorted);

}


/* =========================================================
   SORT SELECT
========================================================= */

function initSorting() {

  const selects = [
    ".sort-select",
    "#sortProducts",
    "[data-sort]"
  ];


  let select = null;


  for (const selector of selects) {

    select = $(selector);

    if (select) break;

  }


  if (!select) return;


  select.addEventListener(
    "change",
    event => {

      sortProducts(
        event.target.value
      );

    }
  );

}


/* =========================================================
   BOTTOM NAVIGATION
========================================================= */

function initBottomNavigation() {

  const navItems =
    $$(
      ".bottom-nav__item, [data-nav]"
    );


  navItems.forEach(item => {

    item.addEventListener(
      "click",
      event => {

        event.preventDefault();


        const target =
          item.dataset.nav ||
          item.getAttribute("href");


        if (!target) return;


        if (
          target ===
          "#" ||
          target ===
          "category"
        ) {
          return;
        }


        window.location.href =
          target;

      }
    );

  });

}


/* =========================================================
   CART NAVIGATION
========================================================= */

function initCartButtons() {

  const buttons = [
    ".cart-button",
    "#cartButton",
    "[data-open-cart]"
  ];


  buttons.forEach(selector => {

    $$(selector).forEach(button => {

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();

          window.location.href =
            "cart.html";

        }
      );

    });

  });

}


/* =========================================================
   WISHLIST NAVIGATION
========================================================= */

function initWishlistButtons() {

  const buttons = [
    ".wishlist-button",
    "#wishlistButton",
    "[data-open-wishlist]"
  ];


  buttons.forEach(selector => {

    $$(selector).forEach(button => {

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();

          window.location.href =
            "wishlist.html";

        }
      );

    });

  });

}


/* =========================================================
   LOGO / HOME
========================================================= */

function initBrandNavigation() {

  const brand =
    $(".brand") ||
    $(".logo") ||
    $(".site-logo");


  if (!brand) return;


  brand.style.cursor =
    "pointer";


  brand.addEventListener(
    "click",
    () => {

      window.location.href =
        "home.html";

    }
  );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

  let toast =
    $("#bazvorToast");


  if (!toast) {

    toast =
      document.createElement("div");

    toast.id =
      "bazvorToast";


    toast.className =
      "bazvor-toast";


    toast.innerHTML = `
      <span class="bazvor-toast__icon">
        ✓
      </span>

      <span class="bazvor-toast__text"></span>
    `;


    document.body.appendChild(toast);

  }


  const text =
    $(".bazvor-toast__text", toast);


  if (text) {
    text.textContent =
      message;
  }


  toast.classList.add(
    "show"
  );


  clearTimeout(
    toast._timer
  );


  toast._timer =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      2200
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   TOAST CSS
   Added automatically so JS remains standalone.
========================================================= */

function injectToastStyles() {

  if (
    document.getElementById(
      "bazvorToastStyles"
    )
  ) {
    return;
  }


  const style =
    document.createElement("style");


  style.id =
    "bazvorToastStyles";


  style.textContent = `

    .bazvor-toast {
      position: fixed;
      left: 50%;
      bottom: 88px;
      transform:
        translate(-50%, 20px);
      opacity: 0;
      visibility: hidden;

      display: flex;
      align-items: center;
      gap: 10px;

      max-width: calc(100vw - 32px);

      padding: 11px 16px;

      background: #171717;
      color: #fff;

      border-radius: 12px;

      font-family:
        Inter,
        system-ui,
        -apple-system,
        sans-serif;

      font-size: 13px;
      font-weight: 600;

      box-shadow:
        0 10px 30px
        rgba(0,0,0,.18);

      z-index: 99999;

      transition:
        opacity .25s ease,
        transform .25s ease,
        visibility .25s ease;
    }


    .bazvor-toast.show {
      opacity: 1;
      visibility: visible;

      transform:
        translate(-50%, 0);
    }


    .bazvor-toast__icon {
      width: 22px;
      height: 22px;

      display: grid;
      place-items: center;

      background: #e5006d;
      color: #fff;

      border-radius: 50%;

      font-size: 12px;
      font-weight: 800;
    }


    .bazvor-toast__text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }


    @media (max-width: 480px) {

      .bazvor-toast {
        bottom: 78px;
        font-size: 12px;
      }

    }

  `;


  document.head.appendChild(style);

}


/* =========================================================
   IMAGE ERROR HANDLING
========================================================= */

function initImageFallback() {

  document.addEventListener(
    "error",
    event => {

      const image =
        event.target;


      if (
        image &&
        image.tagName === "IMG"
      ) {

        image.classList.add(
          "image-error"
        );


        /*
          Prevent infinite error loop.
        */

        if (
          image.dataset.fallbackApplied
        ) {
          return;
        }


        image.dataset.fallbackApplied =
          "true";


        image.src =
          "data:image/svg+xml," +
          encodeURIComponent(`
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="500"
              height="500"
              viewBox="0 0 500 500"
            >
              <rect
                width="500"
                height="500"
                fill="#f7f7f8"
              />

              <text
                x="250"
                y="245"
                text-anchor="middle"
                font-family="Arial"
                font-size="28"
                fill="#999"
              >
                Bazvor
              </text>

              <text
                x="250"
                y="280"
                text-anchor="middle"
                font-family="Arial"
                font-size="16"
                fill="#aaa"
              >
                Image unavailable
              </text>

            </svg>
          `);

      }

    },
    true
  );

}


/* =========================================================
   ACTIVE CATEGORY FROM URL
========================================================= */

function loadCategoryFromURL() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  const category =
    params.get("category");


  if (!category) {
    return;
  }


  const exists =
    categories.some(
      item =>
        item.id === category
    );


  if (exists) {

    activeCategory =
      category;

    currentProducts =
      products.filter(
        product =>
          product.category ===
          category
      );

  }

}


/* =========================================================
   UPDATE URL
========================================================= */

function updateCategoryURL(
  category
) {

  try {

    const url =
      new URL(
        window.location.href
      );


    if (
      category === "all"
    ) {

      url.searchParams.delete(
        "category"
      );

    } else {

      url.searchParams.set(
        "category",
        category
      );

    }


    window.history.replaceState(
      {},
      "",
      url
    );

  } catch (error) {

    /*
      Ignore URL errors.
    */

  }

}


/* =========================================================
   CATEGORY CLICK WRAPPER
========================================================= */

const originalSelectCategory =
  selectCategory;


/*
  Override category selection so
  URL also updates.
*/

selectCategory = function(category) {

  originalSelectCategory(
    category
  );

  updateCategoryURL(
    category
  );

};


/* =========================================================
   INITIALIZE
========================================================= */

function initBazvorCategory() {

  loadCategoryFromURL();

  injectToastStyles();

  renderCategories();

  renderProducts();

  updateCategoryTitle();

  updateCartCount();

  initSorting();

  initBottomNavigation();

  initCartButtons();

  initWishlistButtons();

  initBrandNavigation();

  initImageFallback();

}


/* =========================================================
   DOM READY
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initBazvorCategory
  );

} else {

  initBazvorCategory();

}


/* =========================================================
   GLOBAL ACCESS
   Useful if HTML buttons or future
   scripts need to call Bazvor functions.
========================================================= */

window.BazvorCategory = {

  categories,

  products,

  getCart() {
    return [...cart];
  },

  getWishlist() {
    return [...wishlist];
  },

  addToCart,

  toggleWishlist,

  selectCategory,

  sortProducts,

  formatPrice

};


/* =========================================================
   END OF BAZVOR CATEGORY.JS
========================================================= */