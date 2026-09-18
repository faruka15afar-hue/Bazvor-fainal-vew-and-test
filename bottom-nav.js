"use strict";

/* =========================================================
   BAZVOR — SHARED BOTTOM NAVIGATION
   One navigation for all pages
========================================================= */

const currentPage =
  window.location.pathname
    .split("/")
    .pop()
    .toLowerCase() || "home.html";


const navigationHTML = `
  <nav class="bottom-navigation">

    <a
      href="home.html"
      class="bottom-nav-item"
      data-page="home.html"
    >
      <i class="fa-solid fa-house"></i>
      <span>Home</span>
    </a>


    <a
      href="categories.html"
      class="bottom-nav-item"
      data-page="categories.html"
    >
      <i class="fa-solid fa-table-cells-large"></i>
      <span>Categories</span>
    </a>


    <a
      href="message.html"
      class="bottom-nav-item"
      data-page="message.html"
    >
      <i class="fa-regular fa-message"></i>
      <span>Message</span>
    </a>


    <a
      href="cart.html"
      class="bottom-nav-item"
      data-page="cart.html"
    >
      <span class="bottom-cart-icon">

        <i class="fa-solid fa-cart-shopping"></i>

        <b
          class="cart-badge"
          id="cartBadge"
        >
          0
        </b>

      </span>

      <span>Cart</span>
    </a>


    <a
      href="account.html"
      class="bottom-nav-item"
      data-page="account.html"
    >
      <i class="fa-regular fa-user"></i>
      <span>Account</span>
    </a>

  </nav>
`;


/* =========================================================
   INSERT NAVIGATION
========================================================= */

document.body.insertAdjacentHTML(
  "beforeend",
  navigationHTML
);


/* =========================================================
   ACTIVE PAGE
========================================================= */

const navItems =
  document.querySelectorAll(".bottom-nav-item");


navItems.forEach(item => {

  const page =
    item.dataset.page.toLowerCase();

  if (page === currentPage) {

    item.classList.add("active");

  }

});


/* =========================================================
   CART BADGE
========================================================= */

function updateSharedCartBadge() {

  const badge =
    document.getElementById("cartBadge");

  if (!badge) return;


  let cart = [];

  try {

    cart =
      JSON.parse(
        localStorage.getItem("bazvorCart")
      ) || [];

  } catch (error) {

    cart = [];

  }


  let count = 0;


  if (Array.isArray(cart)) {

    cart.forEach(item => {

      const quantity =
        Number(item.quantity) || 1;

      count += quantity;

    });

  }


  badge.textContent =
    count > 99 ? "99+" : count;

}


/* Initial */

updateSharedCartBadge();


/* Listen for cart changes */

window.addEventListener(
  "storage",
  updateSharedCartBadge
);


/* Same-page custom update */

window.addEventListener(
  "bazvorCartUpdated",
  updateSharedCartBadge
);