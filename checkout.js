"use strict";

/* =========================================================
   FIREBASE
========================================================= */

import {
  initializeApp
} from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {
  getAuth,
  onAuthStateChanged
} from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {

  apiKey:
    "AIzaSyCc1q9_taS8b-T3FxQmQ12BajjBgvtcmyM",

  authDomain:
    "bazvor-da3c4.firebaseapp.com",

  projectId:
    "bazvor-da3c4",

  storageBucket:
    "bazvor-da3c4.firebasestorage.app",

  messagingSenderId:
    "59852021286",

  appId:
    "1:59852021286:web:b6ad6eba476f853b1710e7",

  measurementId:
    "G-L6JFCT5RDD"
};


const app =
  initializeApp(firebaseConfig);


const auth =
  getAuth(app);


const db =
  getFirestore(app);


/* =========================================================
   KEYS
========================================================= */

const CHECKOUT_KEY =
  "bazvorCheckout";

const CART_KEY =
  "bazvorCart";

const LOCAL_ADDRESS_KEY =
  "bazvorAddresses";


/* =========================================================
   STATE
========================================================= */

let checkoutData = null;

let currentUser = null;

let addresses = [];

let selectedAddress = null;

let placingOrder = false;

let toastTimer;


/* =========================================================
   HELPERS
========================================================= */

const $ = selector =>
  document.querySelector(selector);


function money(value) {

  return "৳" +
    (Number(value) || 0)
      .toLocaleString(
        "en-BD"
      );

}


function text(
  selector,
  value
) {

  const element =
    $(selector);


  if (element) {

    element.textContent =
      value;

  }

}


function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

}


function productName(item) {

  return (
    item?.name ||
    item?.productName ||
    item?.title ||
    "Product"
  );

}


function productPrice(item) {

  return Number(
    item?.price ??
    item?.salePrice ??
    item?.discountPrice ??
    item?.sellingPrice ??
    0
  ) || 0;

}


function quantity(item) {

  const amount =
    Number(
      item?.quantity
    );


  return amount > 0
    ? amount
    : 1;

}


function productImage(item) {

  const images =
    item?.images ||
    item?.productImages ||
    item?.photos;


  if (
    Array.isArray(images) &&
    images.length
  ) {

    const image =
      images[0];


    if (
      typeof image ===
      "string"
    ) {

      return image;

    }


    if (image?.url) {

      return image.url;

    }


    if (image?.imageUrl) {

      return image.imageUrl;

    }

  }


  return (
    item?.image ||
    item?.imageUrl ||
    item?.imageURL ||
    item?.thumbnail ||
    item?.photo ||
    "https://via.placeholder.com/300x300?text=BAZVOR"
  );

}


/* =========================================================
   COLOR
========================================================= */

function productColor(item) {

  return String(

    item?.selectedColor ??
    item?.selectedColour ??
    item?.color ??
    item?.colour ??
    item?.colorName ??
    item?.selectedColorName ??
    item?.variantColor ??
    ""

  ).trim();

}


function productSize(item) {

  return String(

    item?.selectedSize ??
    item?.size ??
    item?.sizeName ??
    item?.variantSize ??
    ""

  ).trim();

}


const namedColors = {

  black: "#111111",

  white: "#ffffff",

  red: "#ef4444",

  blue: "#2563eb",

  navy: "#172554",

  green: "#16a34a",

  pink: "#ec4899",

  purple: "#7c3aed",

  orange: "#f97316",

  yellow: "#eab308",

  grey: "#6b7280",

  gray: "#6b7280",

  silver: "#c0c0c0",

  gold: "#d4af37",

  brown: "#795548",

  beige: "#d8c3a5"

};


function colorValue(color) {

  if (!color) {

    return "";
  }


  if (
    /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
      .test(color)
  ) {

    return color;

  }


  return (
    namedColors[
      color.toLowerCase()
    ] ||
    ""
  );

}


/* =========================================================
   READ CHECKOUT
========================================================= */

function loadCheckout() {

  try {

    const saved =
      localStorage.getItem(
        CHECKOUT_KEY
      );


    checkoutData =
      saved
        ? JSON.parse(saved)
        : null;


  } catch (error) {

    checkoutData = null;

  }


  if (
    !checkoutData ||
    !Array.isArray(
      checkoutData.items
    ) ||
    !checkoutData.items.length
  ) {

    window.location.replace(
      "cart.html"
    );

    return false;

  }


  return true;

}


/* =========================================================
   CALCULATION
========================================================= */

function calculations() {

  const items =
    checkoutData?.items || [];


  const subtotal =
    Number(
      checkoutData?.subtotal
    ) ||
    items.reduce(
      (total,item) =>
        total +
        productPrice(item) *
        quantity(item),
      0
    );


  const savings =
    Number(
      checkoutData?.productDiscount
    ) || 0;


  const coupon =
    Number(
      checkoutData?.couponDiscount
    ) || 0;


  const delivery =
    Number(
      checkoutData?.deliveryCharge
    ) || 0;


  const total =
    Math.max(
      0,
      subtotal +
      delivery -
      coupon
    );


  const itemCount =
    items.reduce(
      (total,item) =>
        total +
        quantity(item),
      0
    );


  return {

    subtotal,
    savings,
    coupon,
    delivery,
    total,
    itemCount

  };

}


/* =========================================================
   PRODUCTS
========================================================= */

function renderProducts() {

  const container =
    $("#checkoutItems");


  if (!container) return;


  const items =
    checkoutData.items;


  container.innerHTML =
    items
      .map(item => {

        const name =
          productName(item);


        const price =
          productPrice(item);


        const qty =
          quantity(item);


        const total =
          price * qty;


        const color =
          productColor(item);


        const size =
          productSize(item);


        const cssColor =
          colorValue(color);


        let variants = "";


        if (color) {

          variants += `

            <span class="variant-chip">

              ${
                cssColor
                  ? `
                    <span
                      class="color-dot"
                      style="
                        background:${escapeHTML(cssColor)}
                      "
                    ></span>
                  `
                  : ""
              }

              Color:
              <strong>
                ${escapeHTML(color)}
              </strong>

            </span>

          `;

        }


        if (size) {

          variants += `

            <span class="variant-chip">

              Size:

              <strong>
                ${escapeHTML(size)}
              </strong>

            </span>

          `;

        }


        if (!variants) {

          variants = `

            <span class="variant-chip">
              Standard
            </span>

          `;

        }


        return `

          <article class="checkout-product">


            <div class="checkout-product-image">

              <img
                src="${escapeHTML(productImage(item))}"
                alt="${escapeHTML(name)}"
                loading="lazy"
                onerror="
                  this.onerror=null;
                  this.src='https://via.placeholder.com/300x300?text=BAZVOR';
                "
              >

            </div>


            <div class="checkout-product-info">

              <div class="checkout-product-name">
                ${escapeHTML(name)}
              </div>


              <div class="checkout-product-price">

                ${money(price)}

                <span>
                  × ${qty}
                </span>

              </div>


              <div class="variant-list">
                ${variants}
              </div>

            </div>


            <strong class="checkout-product-total">
              ${money(total)}
            </strong>


          </article>

        `;

      })
      .join("");


  text(
    "#productCount",
    `(${items.length})`
  );

}


/* =========================================================
   SUMMARY
========================================================= */

function renderSummary() {

  const data =
    calculations();


  text(
    "#subtotal",
    money(data.subtotal)
  );


  text(
    "#productSavings",
    "-" +
    money(data.savings)
  );


  text(
    "#deliveryCharge",
    money(data.delivery)
  );


  text(
    "#deliveryMethodPrice",
    data.delivery
      ? money(data.delivery)
      : "Free"
  );


  text(
    "#grandTotal",
    money(data.total)
  );


  text(
    "#bottomTotal",
    money(data.total)
  );


  text(
    "#summaryItemCount",
    `(${data.itemCount} ${
      data.itemCount === 1
        ? "item"
        : "items"
    })`
  );


  const coupon =
    data.coupon;


  const code =
    String(
      checkoutData.couponCode || ""
    ).trim();


  if (coupon > 0) {

    $("#couponSection").hidden =
      false;


    $("#summaryCouponRow").hidden =
      false;


    text(
      "#couponCode",
      code || "Coupon"
    );


    text(
      "#couponSaving",
      "-" +
      money(coupon)
    );


    text(
      "#summaryCoupon",
      "-" +
      money(coupon)
    );


  } else {

    $("#couponSection").hidden =
      true;


    $("#summaryCouponRow").hidden =
      true;

  }

}


/* =========================================================
   LOCAL ADDRESSES
========================================================= */

function loadLocalAddresses() {

  try {

    const saved =
      localStorage.getItem(
        LOCAL_ADDRESS_KEY
      );


    const result =
      saved
        ? JSON.parse(saved)
        : [];


    return Array.isArray(result)
      ? result
      : [];


  } catch {

    return [];

  }

}


function saveLocalAddresses() {

  localStorage.setItem(
    LOCAL_ADDRESS_KEY,
    JSON.stringify(addresses)
  );

}


/* =========================================================
   LOAD ADDRESSES
========================================================= */

async function loadAddresses() {

  addresses =
    loadLocalAddresses();


  /*
    Logged-in:
    Try Firestore.
  */

  if (currentUser) {

    try {

      const addressQuery =
        query(
          collection(
            db,
            "addresses"
          ),

          where(
            "userId",
            "==",
            currentUser.uid
          )
        );


      const snapshot =
        await getDocs(
          addressQuery
        );


      const cloudAddresses =
        [];


      snapshot.forEach(
        item => {

          cloudAddresses.push({

            id:
              item.id,

            ...item.data()

          });

        }
      );


      if (
        cloudAddresses.length
      ) {

        addresses =
          cloudAddresses;

      }


    } catch (error) {

      console.warn(
        "Address load error:",
        error
      );

    }

  }


  selectedAddress =
    addresses.find(
      address =>
        address.isDefault === true
    ) ||
    addresses[0] ||
    null;


  renderAddress();

}


/* =========================================================
   ADDRESS
========================================================= */

function fullAddress(address) {

  if (!address) {

    return "";
  }


  return [

    address.addressLine,
    address.area,
    address.city

  ]
    .filter(Boolean)
    .join(", ");

}


function renderAddress() {

  const card =
    $("#addressCard");


  const button =
    $("#placeOrderButton");


  if (!selectedAddress) {

    card?.classList.remove(
      "has-address"
    );


    text(
      "#addressName",
      "Add delivery address"
    );


    text(
      "#addressPhone",
      ""
    );


    text(
      "#addressText",
      "Choose where you want your order delivered"
    );


    text(
      "#addressAction",
      "Add"
    );


    if (button) {

      button.disabled =
        true;

    }


    return;

  }


  card?.classList.add(
    "has-address"
  );


  text(
    "#addressName",
    selectedAddress.name ||
    "Delivery Address"
  );


  text(
    "#addressPhone",
    selectedAddress.phone ||
    ""
  );


  text(
    "#addressText",
    fullAddress(
      selectedAddress
    )
  );


  text(
    "#addressAction",
    "Change"
  );


  if (button) {

    button.disabled =
      false;

  }

}


/* =========================================================
   SAVED ADDRESS UI
========================================================= */

function renderSavedAddresses() {

  const container =
    $("#savedAddresses");


  if (!container) return;


  if (!addresses.length) {

    container.innerHTML = "";

    return;

  }


  container.innerHTML =
    addresses
      .map(
        (address,index) => {

          const selected =
            selectedAddress &&
            String(
              selectedAddress.id
            ) ===
            String(
              address.id
            );


          return `

            <button
              type="button"
              class="
                saved-address
                ${selected ? "active" : ""}
              "
              data-index="${index}"
            >

              <span class="saved-address-icon">
                <i class="fa-solid fa-location-dot"></i>
              </span>


              <span class="saved-address-content">

                <strong>
                  ${escapeHTML(
                    address.name ||
                    "Address"
                  )}
                </strong>


                <span>
                  ${escapeHTML(
                    address.phone || ""
                  )}
                </span>


                <span>
                  ${escapeHTML(
                    fullAddress(address)
                  )}
                </span>

              </span>


              ${
                selected
                  ? `
                    <span class="saved-address-check">
                      <i class="fa-solid fa-circle-check"></i>
                    </span>
                  `
                  : ""
              }

            </button>

          `;

        }
      )
      .join("");


  container
    .querySelectorAll(
      ".saved-address"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const index =
            Number(
              button.dataset.index
            );


          selectedAddress =
            addresses[index] ||
            null;


          renderAddress();

          closeAddressSheet();

        }
      );

    });

}


/* =========================================================
   ADDRESS SHEET
========================================================= */

function openAddressSheet() {

  renderSavedAddresses();


  $("#addressBackdrop")
    ?.removeAttribute(
      "hidden"
    );


  const sheet =
    $("#addressSheet");


  sheet?.classList.add(
    "open"
  );


  sheet?.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow =
    "hidden";

}


function closeAddressSheet() {

  $("#addressBackdrop")
    ?.setAttribute(
      "hidden",
      ""
    );


  const sheet =
    $("#addressSheet");


  sheet?.classList.remove(
    "open"
  );


  sheet?.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.style.overflow =
    "";

}


/* =========================================================
   SAVE ADDRESS
========================================================= */

async function saveAddress(event) {

  event.preventDefault();


  const name =
    $("#addressFullName")
      .value
      .trim();


  const phone =
    $("#addressPhoneInput")
      .value
      .trim();


  const addressLine =
    $("#addressLine")
      .value
      .trim();


  const area =
    $("#addressArea")
      .value
      .trim();


  const city =
    $("#addressCity")
      .value
      .trim();


  const isDefault =
    $("#makeDefaultAddress")
      .checked ||
    addresses.length === 0;


  if (
    !name ||
    !phone ||
    !addressLine ||
    !city
  ) {

    showToast(
      "Please complete the required address fields"
    );


    return;

  }


  /*
    Simple BD mobile validation.
  */

  const phoneClean =
    phone.replace(
      /[\s-]/g,
      ""
    );


  if (
    !/^(\+?880|0)?1[3-9]\d{8}$/
      .test(phoneClean)
  ) {

    showToast(
      "Enter a valid mobile number"
    );


    return;

  }


  if (isDefault) {

    addresses =
      addresses.map(
        address => ({
          ...address,
          isDefault: false
        })
      );

  }


  const localId =
    `ADDR-${Date.now()}`;


  const addressData = {

    id:
      localId,

    userId:
      currentUser?.uid ||
      "",

    name,
    phone,
    addressLine,
    area,
    city,
    isDefault

  };


  /*
    Local save first.
  */

  addresses.unshift(
    addressData
  );


  selectedAddress =
    addressData;


  saveLocalAddresses();


  /*
    Firestore save if authenticated.
  */

  if (currentUser) {

    try {

      const result =
        await addDoc(
          collection(
            db,
            "addresses"
          ),

          {
            ...addressData,

            userId:
              currentUser.uid,

            createdAt:
              serverTimestamp()
          }
        );


      selectedAddress.id =
        result.id;


      addresses[0].id =
        result.id;


      saveLocalAddresses();


    } catch (error) {

      console.warn(
        "Could not sync address:",
        error
      );

    }

  }


  $("#addressForm")
    ?.reset();


  renderAddress();

  closeAddressSheet();


  showToast(
    "Delivery address saved"
  );

}


/* =========================================================
   ORDER ID
========================================================= */

function createOrderId() {

  const date =
    new Date();


  const year =
    date.getFullYear();


  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );


  const random =
    Math.random()
      .toString(36)
      .substring(2,7)
      .toUpperCase();


  return (
    `BZV-${year}${month}${day}-${random}`
  );

}


/* =========================================================
   CART ITEM MATCHING

   Used to remove purchased quantity,
   not every matching cart row.
========================================================= */

function productIdentity(item) {

  return [

    String(
      item?.productId ??
      item?.id ??
      item?.sku ??
      ""
    ),

    productColor(item)
      .toLowerCase(),

    productSize(item)
      .toLowerCase(),

    String(
      productPrice(item)
    )

  ].join("|");

}


/* =========================================================
   REMOVE ONLY ORDERED QUANTITY
========================================================= */

function removePurchasedItems() {

  try {

    const saved =
      localStorage.getItem(
        CART_KEY
      );


    let cart =
      saved
        ? JSON.parse(saved)
        : [];


    if (!Array.isArray(cart)) {

      return;

    }


    /*
      Build required quantity by identity.
    */

    const required =
      new Map();


    checkoutData.items
      .forEach(item => {

        const key =
          productIdentity(
            item
          );


        const current =
          required.get(key) ||
          0;


        required.set(
          key,
          current +
          quantity(item)
        );

      });


    /*
      Remove quantities progressively.
    */

    const newCart = [];


    cart.forEach(item => {

      const key =
        productIdentity(
          item
        );


      const needed =
        required.get(key) ||
        0;


      if (needed <= 0) {

        newCart.push(item);

        return;

      }


      const cartQty =
        quantity(item);


      if (
        cartQty <= needed
      ) {

        required.set(
          key,
          needed - cartQty
        );


        return;

      }


      /*
        Cart line has more quantity
        than purchased.
      */

      newCart.push({

        ...item,

        quantity:
          cartQty - needed

      });


      required.set(
        key,
        0
      );

    });


    localStorage.setItem(
      CART_KEY,
      JSON.stringify(
        newCart
      )
    );


    window.dispatchEvent(
      new CustomEvent(
        "bazvorCartUpdated"
      )
    );


  } catch (error) {

    console.warn(
      "Cart cleanup error:",
      error
    );

  }

}


/* =========================================================
   PLACE ORDER
========================================================= */

async function placeOrder() {

  if (placingOrder) {

    return;

  }


  /*
    Require login before final order.
  */

  if (!currentUser) {

    window.location.href =
      "auth.html?redirect=checkout.html";


    return;

  }


  if (!selectedAddress) {

    showToast(
      "Add a delivery address first"
    );


    openAddressSheet();


    return;

  }


  if (
    !checkoutData?.items?.length
  ) {

    showToast(
      "Your checkout is empty"
    );


    return;

  }


  placingOrder =
    true;


  $("#placeOrderButton").disabled =
    true;


  $("#orderLoading")
    ?.removeAttribute(
      "hidden"
    );


  const price =
    calculations();


  const orderId =
    createOrderId();


  const items =
    checkoutData.items
      .map(item => {

        const unitPrice =
          productPrice(
            item
          );


        const qty =
          quantity(
            item
          );


        return {

          productId:
            String(
              item?.productId ??
              item?.id ??
              item?.sku ??
              ""
            ),

          name:
            productName(
              item
            ),

          image:
            productImage(
              item
            ),

          color:
            productColor(
              item
            ),

          size:
            productSize(
              item
            ),

          price:
            unitPrice,

          quantity:
            qty,

          total:
            unitPrice * qty

        };

      });


  const order = {

    orderId,

    userId:
      currentUser.uid,


    customer: {

      name:
        selectedAddress.name,

      phone:
        selectedAddress.phone,

      email:
        currentUser.email ||
        ""

    },


    address: {

      name:
        selectedAddress.name,

      phone:
        selectedAddress.phone,

      addressLine:
        selectedAddress.addressLine,

      area:
        selectedAddress.area ||
        "",

      city:
        selectedAddress.city,

      addressId:
        selectedAddress.id ||
        ""

    },


    items,


    pricing: {

      subtotal:
        price.subtotal,

      productSavings:
        price.savings,

      couponDiscount:
        price.coupon,

      deliveryCharge:
        price.delivery,

      total:
        price.total

    },


    couponCode:
      checkoutData.couponCode ||
      "",


    deliveryMethod:
      "standard",


    paymentMethod:
      "cod",


    paymentStatus:
      "unpaid",


    status:
      "pending",


    createdAt:
      serverTimestamp(),

    updatedAt:
      serverTimestamp()

  };


  try {

    const result =
      await addDoc(
        collection(
          db,
          "orders"
        ),

        order
      );


    /*
      Remove purchased quantities.
    */

    removePurchasedItems();


    /*
      Preserve success info before
      deleting checkout.
    */

    localStorage.setItem(
      "bazvorLastOrder",
      JSON.stringify({

        firestoreId:
          result.id,

        orderId:
          orderId,

        total:
          price.total,

        paymentMethod:
          "cod",

        createdAt:
          Date.now()

      })
    );


    localStorage.removeItem(
      CHECKOUT_KEY
    );


    localStorage.removeItem(
      "bazvorBuyNow"
    );


    window.location.replace(
      `order-success.html?orderId=${
        encodeURIComponent(
          orderId
        )
      }`
    );


  } catch (error) {

    console.error(
      "PLACE ORDER ERROR:",
      error
    );


    placingOrder =
      false;


    $("#placeOrderButton").disabled =
      !selectedAddress;


    $("#orderLoading")
      ?.setAttribute(
        "hidden",
        ""
      );


    showToast(
      "Couldn't place your order. Please try again."
    );

  }

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

  const toast =
    $("#toast");


  if (!toast) return;


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    toastTimer
  );


  toastTimer =
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
   AUTH
========================================================= */

onAuthStateChanged(
  auth,
  async user => {

    currentUser =
      user || null;


    await loadAddresses();


    /*
      Pre-fill new address form.
    */

    if (user) {

      if (
        !$("#addressFullName")
          .value
      ) {

        $("#addressFullName").value =
          user.displayName ||
          "";

      }


      if (
        !$("#addressPhoneInput")
          .value
      ) {

        $("#addressPhoneInput").value =
          user.phoneNumber ||
          "";

      }

    }

  }
);


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    if (!loadCheckout()) {

      return;

    }


    renderProducts();

    renderSummary();


    /*
      Back
    */

    $("#backButton")
      ?.addEventListener(
        "click",
        () => {

          if (
            window.history.length >
            1
          ) {

            window.history.back();

          } else {

            window.location.href =
              "cart.html";

          }

        }
      );


    /*
      Address
    */

    $("#addressCard")
      ?.addEventListener(
        "click",
        openAddressSheet
      );


    $("#closeAddressSheet")
      ?.addEventListener(
        "click",
        closeAddressSheet
      );


    $("#addressBackdrop")
      ?.addEventListener(
        "click",
        closeAddressSheet
      );


    $("#addressForm")
      ?.addEventListener(
        "submit",
        saveAddress
      );


    /*
      Place order
    */

    $("#placeOrderButton")
      ?.addEventListener(
        "click",
        placeOrder
      );


    /*
      ESC
    */

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key ===
          "Escape"
        ) {

          closeAddressSheet();

        }

      }
    );

  }
);