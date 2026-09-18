"use strict";


/* =========================================================
   FIREBASE
========================================================= */

import {
  initializeApp,
  getApps,
  getApp
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
    "1:59852021286:web:b6ad6eba476f853b1710e7"

};


const app =
  getApps().length
    ? getApp()
    : initializeApp(
        firebaseConfig
      );


const auth =
  getAuth(app);


const db =
  getFirestore(app);



/* =========================================================
   PAYMENT

   এখানে নিজের নম্বর বসাবে
========================================================= */

const PAYMENT_CONFIG = {

  bkash: {

    name:
      "bKash",

    number:
      "01XXXXXXXXX"

  },


  nagad: {

    name:
      "Nagad",

    number:
      "01XXXXXXXXX"

  },


  cod: {

    name:
      "Cash on Delivery",

    number:
      ""

  }

};



/* =========================================================
   KEYS / STATE
========================================================= */

const CART_KEY =
  "bazvorCart";


let cart =
  [];


let selectedIndexes =
  new Set();


let appliedCoupon =
  "";


let couponDiscount =
  0;


let checkoutData =
  null;


let customerPhone =
  "";


let selectedPayment =
  "";


let currentUser =
  null;


let placingOrder =
  false;


let toastTimer;



/* LOCATION */

let divisions =
  [];


let districts =
  [];


let upazilas =
  [];


let unions =
  [];


let locationsLoaded =
  false;


const selectedLocation = {

  division:
    "",

  district:
    "",

  upazila:
    "",

  union:
    ""

};



/* =========================================================
   HELPERS
========================================================= */

const $ = selector =>
  document.querySelector(
    selector
  );


function money(value) {

  return "৳" +
    (
      Number(value) ||
      0
    )
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


  if (
    element
  ) {

    element.textContent =
      value;

  }

}


function escapeHTML(value) {

  return String(
    value ?? ""
  )
  .replace(/&/g,"&amp;")
  .replace(/</g,"&lt;")
  .replace(/>/g,"&gt;")
  .replace(/"/g,"&quot;")
  .replace(/'/g,"&#039;");

}


function toast(message) {

  const element =
    $("#toast");


  if (
    !element
  ) {

    return;

  }


  element.textContent =
    message;


  element.classList.add(
    "show"
  );


  clearTimeout(
    toastTimer
  );


  toastTimer =
    setTimeout(
      () => {

        element.classList.remove(
          "show"
        );

      },
      2200
    );

}



/* =========================================================
   PRODUCT
========================================================= */

function productName(item) {

  return (
    item?.name ||
    item?.productName ||
    item?.title ||
    "Product"
  );

}


function price(item) {

  return Number(

    item?.price ??
    item?.salePrice ??
    item?.discountPrice ??
    item?.sellingPrice ??
    0

  ) || 0;

}


function oldPrice(item) {

  return Number(

    item?.oldPrice ??
    item?.regularPrice ??
    item?.originalPrice ??
    0

  ) || 0;

}


function quantity(item) {

  const value =
    Number(
      item?.quantity
    );


  return value > 0
    ? value
    : 1;

}


function image(item) {

  const images =
    item?.images ||
    item?.productImages ||
    item?.photos;


  if (
    Array.isArray(images) &&
    images.length
  ) {

    const first =
      images[0];


    if (
      typeof first ===
      "string"
    ) {

      return first;

    }


    return (
      first?.url ||
      first?.imageUrl ||
      ""
    );

  }


  return (
    item?.image ||
    item?.imageUrl ||
    item?.thumbnail ||
    ""
  );

}



/* =========================================================
   CART
========================================================= */

function loadCart() {

  try {

    cart =
      JSON.parse(
        localStorage.getItem(
          CART_KEY
        ) ||
        "[]"
      );


    if (
      !Array.isArray(
        cart
      )
    ) {

      cart =
        [];

    }

  } catch {

    cart =
      [];

  }


  selectedIndexes =
    new Set(

      cart.map(
        (_,index) =>
          index
      )

    );

}


function saveCart() {

  localStorage.setItem(
    CART_KEY,
    JSON.stringify(
      cart
    )
  );


  window.dispatchEvent(
    new CustomEvent(
      "bazvorCartUpdated"
    )
  );

}


function selectedItems() {

  return [
    ...selectedIndexes
  ]
  .sort(
    (a,b) =>
      a-b
  )
  .map(
    index =>
      cart[index]
  )
  .filter(Boolean);

}



/* =========================================================
   CALCULATE
========================================================= */

function calculate() {

  const items =
    selectedItems();


  const subtotal =
    items.reduce(
      (sum,item) =>

        sum +
        price(item) *
        quantity(item),

      0
    );


  const savings =
    items.reduce(
      (sum,item) =>

        sum +

        Math.max(
          0,
          oldPrice(item) -
          price(item)
        )

        *

        quantity(item),

      0
    );


  const delivery =
    items.length
      ? 60
      : 0;


  const total =
    Math.max(

      0,

      subtotal +
      delivery -
      couponDiscount

    );


  const count =
    items.reduce(
      (sum,item) =>

        sum +
        quantity(item),

      0
    );


  return {

    items,
    subtotal,
    savings,
    delivery,
    total,
    count

  };

}



/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

  const count =
    cart.reduce(
      (sum,item) =>

        sum +
        quantity(item),

      0
    );


  text(

    "#cartCount",

    `${count} ${
      count === 1
        ? "item"
        : "items"
    }`

  );


  if (
    !cart.length
  ) {

    $("#cartContent")
      .classList.add(
        "hidden"
      );


    $("#emptyCart")
      .classList.remove(
        "hidden"
      );


    $("#cartItems")
      .innerHTML =
      "";


    updateSummary();


    return;

  }


  $("#cartContent")
    .classList.remove(
      "hidden"
    );


  $("#emptyCart")
    .classList.add(
      "hidden"
    );


  $("#cartItems")
    .innerHTML =

    cart.map(
      (item,index) => `

        <article class="cart-item">

          <label class="item-select">

            <input
              class="item-checkbox"
              type="checkbox"
              data-index="${index}"
              ${
                selectedIndexes.has(
                  index
                )
                  ? "checked"
                  : ""
              }
            >

            <span class="item-check-ui"></span>

          </label>


          <div class="item-image-wrap">

            <img
              class="item-image"
              src="${escapeHTML(
                image(item)
              )}"
              alt="${escapeHTML(
                productName(item)
              )}"
            >

          </div>


          <div class="item-info">

            <div class="item-name">

              ${escapeHTML(
                productName(item)
              )}

            </div>


            <div class="item-variant">

              ${escapeHTML(
                item?.selectedColor ||
                item?.selectedSize ||
                "Standard"
              )}

            </div>


            <strong class="item-price">

              ${money(
                price(item)
              )}

            </strong>


            <div class="item-controls">

              <div class="quantity-control">

                <button
                  class="qty-minus"
                  type="button"
                  data-index="${index}"
                >
                  −
                </button>

                <span>

                  ${quantity(
                    item
                  )}

                </span>

                <button
                  class="qty-plus"
                  type="button"
                  data-index="${index}"
                >
                  +
                </button>

              </div>


              <button
                class="remove-item"
                type="button"
                data-index="${index}"
              >

                <i class="fa-regular fa-trash-can"></i>

              </button>

            </div>

          </div>

        </article>

      `
    )
    .join("");


  bindProducts();

  updateSelection();

  updateSummary();

}



/* =========================================================
   PRODUCT EVENTS
========================================================= */

function bindProducts() {

  document
    .querySelectorAll(
      ".item-checkbox"
    )
    .forEach(
      checkbox => {

        checkbox.onchange =
          () => {

            const index =
              Number(
                checkbox.dataset.index
              );


            if (
              checkbox.checked
            ) {

              selectedIndexes.add(
                index
              );

            } else {

              selectedIndexes.delete(
                index
              );

            }


            updateSelection();

            updateSummary();

          };

      }
    );


  document
    .querySelectorAll(
      ".qty-minus"
    )
    .forEach(
      button => {

        button.onclick =
          () => {

            const index =
              Number(
                button.dataset.index
              );


            cart[index].quantity =
              Math.max(

                1,

                quantity(
                  cart[index]
                ) - 1

              );


            saveCart();

            renderCart();

          };

      }
    );


  document
    .querySelectorAll(
      ".qty-plus"
    )
    .forEach(
      button => {

        button.onclick =
          () => {

            const index =
              Number(
                button.dataset.index
              );


            cart[index].quantity =
              quantity(
                cart[index]
              ) + 1;


            saveCart();

            renderCart();

          };

      }
    );


  document
    .querySelectorAll(
      ".remove-item"
    )
    .forEach(
      button => {

        button.onclick =
          () => {

            cart.splice(

              Number(
                button.dataset.index
              ),

              1

            );


            selectedIndexes =
              new Set(

                cart.map(
                  (_,index) =>
                    index
                )

              );


            saveCart();

            renderCart();

          };

      }
    );

}



/* =========================================================
   SELECTION
========================================================= */

function updateSelection() {

  const count =
    selectedIndexes.size;


  text(
    "#selectedCount",
    `${count} selected`
  );


  $("#selectAll").checked =

    cart.length > 0 &&

    count ===
    cart.length;


  $("#selectAll").indeterminate =

    count > 0 &&

    count <
    cart.length;


  $("#checkoutButton").disabled =
    count === 0;

}



/* =========================================================
   SUMMARY
========================================================= */

function updateSummary() {

  const data =
    calculate();


  text(
    "#subtotal",
    money(
      data.subtotal
    )
  );


  text(
    "#productDiscount",
    "-" +
    money(
      data.savings
    )
  );


  text(
    "#couponDiscountText",
    "-" +
    money(
      couponDiscount
    )
  );


  text(
    "#delivery",
    money(
      data.delivery
    )
  );


  text(
    "#total",
    money(
      data.total
    )
  );


  text(
    "#bottomTotal",
    money(
      data.total
    )
  );


  text(
    "#itemText",
    `(${data.count} items)`
  );


  $("#couponSummaryRow").hidden =
    couponDiscount <= 0;


  if (
    data.items.length
  ) {

    text(

      "#deliveryText",

      `Delivery charge: ${
        money(
          data.delivery
        )
      }`

    );


    text(

      "#deliveryEstimate",

      "Calculated from selected products"

    );

  } else {

    text(

      "#deliveryText",

      "Select products to calculate"

    );


    text(

      "#deliveryEstimate",

      "No products selected"

    );

  }

}



/* =========================================================
   COUPON
========================================================= */

function applyCoupon() {

  const code =
    $("#couponInput")
      .value
      .trim()
      .toUpperCase();


  const subtotal =
    calculate()
      .subtotal;


  if (
    code ===
    "BAZVOR10"
  ) {

    appliedCoupon =
      code;


    couponDiscount =
      Math.round(
        subtotal *
        .1
      );


  } else if (
    code ===
    "WELCOME50"
  ) {

    appliedCoupon =
      code;


    couponDiscount =
      Math.min(
        subtotal,
        50
      );


  } else {

    appliedCoupon =
      "";


    couponDiscount =
      0;


    text(
      "#couponMessage",
      "Invalid coupon code"
    );


    updateSummary();


    return;

  }


  text(
    "#couponStatus",
    `${code} applied`
  );


  text(

    "#couponMessage",

    `${money(
      couponDiscount
    )} discount applied`

  );


  updateSummary();

}



/* =========================================================
   PHONE
========================================================= */

function normalizePhone(value) {

  let phone =
    String(
      value ||
      ""
    )
    .replace(
      /\D/g,
      ""
    );


  if (
    phone.startsWith(
      "880"
    )
  ) {

    phone =
      phone.slice(3);

  }


  if (
    phone.startsWith(
      "0"
    )
  ) {

    phone =
      phone.slice(1);

  }


  if (
    !/^1[3-9]\d{8}$/
      .test(phone)
  ) {

    return "";

  }


  return (
    "+880" +
    phone
  );

}



/* =========================================================
   CHECKOUT OPEN / CLOSE
========================================================= */

function openCheckout() {

  const data =
    calculate();


  if (
    !data.items.length
  ) {

    toast(
      "Select a product first"
    );


    return;

  }


  checkoutData = {

    ...data,

    couponCode:
      appliedCoupon,

    couponDiscount

  };


  $("#checkoutBackdrop").hidden =
    false;


  $("#checkoutSheet")
    .classList.add(
      "open",
      "phone-size"
    );


  $("#checkoutSheet")
    .classList.remove(
      "detail-size"
    );


  $("#checkoutSheet")
    .setAttribute(
      "aria-hidden",
      "false"
    );


  document.body
    .classList.add(
      "checkout-open"
    );


  showStep(
    "phone"
  );


  setTimeout(
    () => {

      $("#customerPhone")
        .focus();

    },
    300
  );

}


function closeCheckout() {

  $("#checkoutBackdrop").hidden =
    true;


  $("#checkoutSheet")
    .classList.remove(
      "open",
      "detail-size"
    );


  $("#checkoutSheet")
    .classList.add(
      "phone-size"
    );


  document.body
    .classList.remove(
      "checkout-open"
    );

}



/* =========================================================
   STEP
========================================================= */

function showStep(step) {

  const map = {

    phone:
      "#phoneStep",

    location:
      "#locationStep",

    method:
      "#methodStep",

    final:
      "#finalStep"

  };


  Object
    .values(
      map
    )
    .forEach(
      selector => {

        $(selector)
          .classList.remove(
            "active"
          );

      }
    );


  $(map[step])
    .classList.add(
      "active"
    );


  if (
    step ===
    "phone"
  ) {

    $("#checkoutSheet")
      .classList.add(
        "phone-size"
      );


    $("#checkoutSheet")
      .classList.remove(
        "detail-size"
      );

  } else {

    $("#checkoutSheet")
      .classList.remove(
        "phone-size"
      );


    $("#checkoutSheet")
      .classList.add(
        "detail-size"
      );

  }

}



/* =========================================================
   BANGLADESH LOCATIONS
========================================================= */

/*
  We load complete lists once, then filter them
  by parent IDs. This avoids the broken
  "upazila/{district}" endpoint problem.
*/

const BD_API =
  "https://bdapis.com/api/v1.2";


async function requestList(
  urls
) {

  let lastError;


  for (
    const url
    of urls
  ) {

    try {

      const response =
        await fetch(
          url,
          {
            cache:
              "force-cache"
          }
        );


      if (
        !response.ok
      ) {

        throw new Error(
          `HTTP ${response.status}`
        );

      }


      const result =
        await response.json();


      const list =

        Array.isArray(
          result
        )

          ? result

          : (

              result?.data ||

              result?.result ||

              result?.divisions ||

              result?.districts ||

              result?.upazilas ||

              result?.unions ||

              []

            );


      if (
        Array.isArray(list)
      ) {

        return list;

      }


    } catch (
      error
    ) {

      lastError =
        error;

    }

  }


  throw (
    lastError ||
    new Error(
      "Location data unavailable"
    )
  );

}


function itemId(item) {

  return String(

    item?.id ??
    item?._id ??
    item?.value ??
    ""

  );

}


function itemName(item) {

  return String(

    item?.name ??
    item?.name_en ??
    item?.bn_name ??
    item?.title ??
    ""

  );

}


function parentId(
  item,
  type
) {

  if (
    type ===
    "division"
  ) {

    return String(

      item?.division_id ??
      item?.divisionId ??
      item?.division?.id ??
      ""

    );

  }


  if (
    type ===
    "district"
  ) {

    return String(

      item?.district_id ??
      item?.districtId ??
      item?.district?.id ??
      ""

    );

  }


  return String(

    item?.upazila_id ??
    item?.upazilaId ??
    item?.upazila?.id ??
    ""

  );

}



/* =========================================================
   LOCATION FALLBACK
========================================================= */

/*
  The most important fallback is Upazila.

  If the remote API exposes district data with nested
  upazilas, this extracts them instead of showing
  "Unavailable".
*/

function extractNestedUpazilas(
  districtId
) {

  const district =
    districts.find(
      item =>
        itemId(item) ===
        String(
          districtId
        )
    );


  const nested =

    district?.upazilas ||

    district?.upazila ||

    district?.thanas ||

    [];


  return Array.isArray(
    nested
  )
    ? nested
    : [];

}



/* =========================================================
   LOCATION DATA LOAD
========================================================= */

async function loadLocationDatabase() {

  $("#locationLoader").hidden =
    false;


  try {

    const [
      divisionData,
      districtData
    ] =
    await Promise.all([

      requestList([

        `${BD_API}/division`,

        `${BD_API}/divisions`

      ]),

      requestList([

        `${BD_API}/district`,

        `${BD_API}/districts`

      ])

    ]);


    divisions =
      divisionData;


    districts =
      districtData;


    fillSelect(

      "#divisionSelect",

      divisions,

      "Select division"

    );


  } catch (error) {

    console.error(
      "LOCATION LOAD:",
      error
    );


    /*
      8 divisions are provided locally so the
      first selector never becomes unusable.
    */

    divisions = [

      {id:"1",name:"Barishal"},
      {id:"2",name:"Chattogram"},
      {id:"3",name:"Dhaka"},
      {id:"4",name:"Khulna"},
      {id:"5",name:"Mymensingh"},
      {id:"6",name:"Rajshahi"},
      {id:"7",name:"Rangpur"},
      {id:"8",name:"Sylhet"}

    ];


    fillSelect(

      "#divisionSelect",

      divisions,

      "Select division"

    );


    toast(
      "Internet is required to load district and upazila"
    );

  } finally {

    $("#locationLoader").hidden =
      true;

  }

}



/* =========================================================
   SELECT HELPERS
========================================================= */

function fillSelect(
  selector,
  list,
  placeholder
) {

  const select =
    $(selector);


  select.innerHTML =

    `<option value="">
      ${placeholder}
    </option>`

    +

    list.map(
      item => `

        <option
          value="${escapeHTML(
            itemId(item)
          )}"
          data-name="${escapeHTML(
            itemName(item)
          )}"
        >
          ${escapeHTML(
            itemName(item)
          )}
        </option>

      `
    )
    .join("");


  select.disabled =
    false;

}


function clearSelect(
  selector,
  placeholder
) {

  const select =
    $(selector);


  select.innerHTML =

    `<option value="">
      ${placeholder}
    </option>`;


  select.disabled =
    true;

}


function selectedName(
  selector
) {

  return (
    $(selector)
      ?.selectedOptions?.[0]
      ?.dataset
      ?.name ||
    ""
  );

}



/* =========================================================
   DIVISION → DISTRICT
========================================================= */

async function divisionChanged() {

  const divisionId =
    $("#divisionSelect")
      .value;


  selectedLocation.division =
    selectedName(
      "#divisionSelect"
    );


  selectedLocation.district =
    "";


  selectedLocation.upazila =
    "";


  selectedLocation.union =
    "";


  clearSelect(
    "#districtSelect",
    "Select district"
  );


  clearSelect(
    "#upazilaSelect",
    "Select upazila"
  );


  clearSelect(
    "#unionSelect",
    "Select union"
  );


  if (
    !divisionId
  ) {

    return;

  }


  let matching =
    districts.filter(
      item =>

        parentId(
          item,
          "division"
        ) ===
        String(
          divisionId
        )
    );


  /*
    If parent IDs aren't present in the global
    response, request this division's districts.
  */

  if (
    !matching.length
  ) {

    $("#locationLoader").hidden =
      false;


    try {

      matching =
        await requestList([

          `${BD_API}/district/${divisionId}`,

          `${BD_API}/districts/${divisionId}`,

          `${BD_API}/district?division_id=${divisionId}`

        ]);


    } catch (
      error
    ) {

      console.error(
        "DISTRICT:",
        error
      );


      toast(
        "Couldn't load districts"
      );


    } finally {

      $("#locationLoader").hidden =
        true;

    }

  }


  if (
    matching.length
  ) {

    fillSelect(

      "#districtSelect",

      matching,

      "Select district"

    );

  }

}



/* =========================================================
   DISTRICT → UPAZILA
========================================================= */

async function districtChanged() {

  const districtId =
    $("#districtSelect")
      .value;


  selectedLocation.district =
    selectedName(
      "#districtSelect"
    );


  selectedLocation.upazila =
    "";


  selectedLocation.union =
    "";


  clearSelect(
    "#upazilaSelect",
    "Loading upazila..."
  );


  clearSelect(
    "#unionSelect",
    "Select union"
  );


  if (
    !districtId
  ) {

    clearSelect(
      "#upazilaSelect",
      "Select upazila"
    );


    return;

  }


  $("#locationLoader").hidden =
    false;


  let matching =
    [];


  try {

    /*
      First try direct district → upazila routes.
    */

    matching =
      await requestList([

        `${BD_API}/upazila/${districtId}`,

        `${BD_API}/upazilas/${districtId}`,

        `${BD_API}/upazila?district_id=${districtId}`,

        `${BD_API}/upazilas?district_id=${districtId}`

      ]);


  } catch (
    directError
  ) {

    /*
      Then try global Upazila data.
    */

    try {

      if (
        !upazilas.length
      ) {

        upazilas =
          await requestList([

            `${BD_API}/upazila`,

            `${BD_API}/upazilas`

          ]);

      }


      matching =
        upazilas.filter(
          item =>

            parentId(
              item,
              "district"
            ) ===
            String(
              districtId
            )
        );


    } catch (
      globalError
    ) {

      /*
        Last fallback: some District objects
        contain upazilas themselves.
      */

      matching =
        extractNestedUpazilas(
          districtId
        );

    }

  }


  $("#locationLoader").hidden =
    true;


  /*
    Do NOT write "Unavailable".
    Either render the actual list or explain
    that the list failed to load.
  */

  if (
    matching.length
  ) {

    fillSelect(

      "#upazilaSelect",

      matching,

      "Select upazila / thana"

    );


  } else {

    clearSelect(

      "#upazilaSelect",

      "Upazila list couldn't load"

    );


    toast(
      "Upazila list couldn't load. Check connection."
    );

  }

}



/* =========================================================
   UPAZILA → UNION
========================================================= */

async function upazilaChanged() {

  const upazilaId =
    $("#upazilaSelect")
      .value;


  selectedLocation.upazila =
    selectedName(
      "#upazilaSelect"
    );


  selectedLocation.union =
    "";


  clearSelect(
    "#unionSelect",
    "Loading union..."
  );


  if (
    !upazilaId
  ) {

    clearSelect(
      "#unionSelect",
      "Select union"
    );


    return;

  }


  $("#locationLoader").hidden =
    false;


  let matching =
    [];


  try {

    matching =
      await requestList([

        `${BD_API}/union/${upazilaId}`,

        `${BD_API}/unions/${upazilaId}`,

        `${BD_API}/union?upazila_id=${upazilaId}`

      ]);


  } catch {

    try {

      if (
        !unions.length
      ) {

        unions =
          await requestList([

            `${BD_API}/union`,

            `${BD_API}/unions`

          ]);

      }


      matching =
        unions.filter(
          item =>

            parentId(
              item,
              "upazila"
            ) ===
            String(
              upazilaId
            )
        );


    } catch {

      matching =
        [];

    }

  }


  $("#locationLoader").hidden =
    true;


  if (
    matching.length
  ) {

    fillSelect(

      "#unionSelect",

      matching,

      "Select union / parishad"

    );


  } else {

    /*
      Union isn't required because many city
      addresses do not have a Union field.
    */

    clearSelect(

      "#unionSelect",

      "Union optional / not listed"

    );

  }

}


function unionChanged() {

  selectedLocation.union =
    selectedName(
      "#unionSelect"
    );

}



/* =========================================================
   ADDRESS
========================================================= */

function addressValid() {

  return Boolean(

    selectedLocation.division &&

    selectedLocation.district &&

    selectedLocation.upazila &&

    $("#receiverName")
      .value
      .trim() &&

    $("#addressDetails")
      .value
      .trim()

  );

}


function fullAddress() {

  return [

    $("#addressDetails")
      .value
      .trim(),

    selectedLocation.union,

    selectedLocation.upazila,

    selectedLocation.district,

    selectedLocation.division

  ]
  .filter(Boolean)
  .join(", ");

}



/* =========================================================
   PAYMENT METHOD
========================================================= */

function selectPayment(method) {

  selectedPayment =
    method;


  document
    .querySelectorAll(
      ".payment-option"
    )
    .forEach(
      button => {

        button.classList.toggle(

          "active",

          button.dataset.payment ===
          method

        );

      }
    );


  $("#methodContinue").disabled =
    false;

}



/* =========================================================
   FINAL SCREEN
========================================================= */

function renderFinal() {

  const cod =
    selectedPayment ===
    "cod";


  $("#manualPayment").hidden =
    cod;


  $("#codConfirmation").hidden =
    !cod;


  if (
    cod
  ) {

    text(
      "#finalTitle",
      "Confirm order"
    );


    text(
      "#finalSubtitle",
      "Cash on Delivery"
    );


    text(
      "#codAmount",
      money(
        checkoutData.total
      )
    );


    return;

  }


  const config =
    PAYMENT_CONFIG[
      selectedPayment
    ];


  text(
    "#finalTitle",
    `Pay with ${
      config.name
    }`
  );


  text(
    "#finalSubtitle",
    "Complete payment"
  );


  text(
    "#selectedPaymentName",
    config.name
  );


  text(
    "#paymentNumber",
    config.number
  );


  text(
    "#paymentAmount",
    money(
      checkoutData.total
    )
  );


  updatePaidButton();

}



/* =========================================================
   TRANSACTION
========================================================= */

function validTransaction() {

  return (
    /^[A-Za-z0-9_-]{6,40}$/
    .test(
      $("#transactionId")
        .value
        .trim()
    )
  );

}


function updatePaidButton() {

  $("#placePaidOrder").disabled =
    !validTransaction() ||
    placingOrder;

}



/* =========================================================
   ORDER
========================================================= */

function makeOrderId() {

  return (
    "BZV-" +
    Date.now()
      .toString(36)
      .toUpperCase() +
    "-" +
    Math.random()
      .toString(36)
      .slice(2,6)
      .toUpperCase()
  );

}


async function placeOrder() {

  if (
    placingOrder
  ) {

    return;

  }


  if (
    !currentUser
  ) {

    /*
      Order must remain attached to user.
    */

    window.location.href =
      "auth.html?redirect=cart.html";


    return;

  }


  if (
    !customerPhone ||
    !addressValid() ||
    !selectedPayment
  ) {

    toast(
      "Complete checkout information"
    );


    return;

  }


  const cod =
    selectedPayment ===
    "cod";


  if (
    !cod &&
    !validTransaction()
  ) {

    toast(
      "Enter a valid transaction ID"
    );


    return;

  }


  placingOrder =
    true;


  $("#orderLoading").hidden =
    false;


  const orderId =
    makeOrderId();


  const order = {

    orderId,


    userId:
      currentUser.uid,


    receiver: {

      name:
        $("#receiverName")
          .value
          .trim(),

      phone:
        customerPhone,

      phoneVerified:
        false

    },


    address: {

      division:
        selectedLocation.division,

      district:
        selectedLocation.district,

      upazila:
        selectedLocation.upazila,

      union:
        selectedLocation.union,

      details:
        $("#addressDetails")
          .value
          .trim(),

      fullAddress:
        fullAddress()

    },


    items:

      checkoutData.items
      .map(
        item => {

          const unit =
            price(item);


          const qty =
            quantity(item);


          return {

            productId:
              String(

                item?.productId ??
                item?.id ??
                ""

              ),

            name:
              productName(
                item
              ),

            image:
              image(
                item
              ),

            price:
              unit,

            quantity:
              qty,

            total:
              unit *
              qty

          };

        }
      ),


    pricing: {

      subtotal:
        checkoutData.subtotal,

      productSavings:
        checkoutData.savings,

      couponDiscount:
        couponDiscount,

      deliveryCharge:
        checkoutData.delivery,

      total:
        checkoutData.total

    },


    paymentMethod:
      selectedPayment,


    paymentNumber:

      cod

        ? ""

        : PAYMENT_CONFIG[
            selectedPayment
          ].number,


    transactionId:

      cod

        ? ""

        : $("#transactionId")
            .value
            .trim(),


    paymentStatus:

      cod

        ? "cash_on_delivery"

        : "verification_pending",


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
      Remove purchased selected items.
    */

    [
      ...selectedIndexes
    ]
    .sort(
      (a,b) =>
        b-a
    )
    .forEach(
      index => {

        cart.splice(
          index,
          1
        );

      }
    );


    saveCart();


    localStorage.setItem(

      "bazvorLastOrder",

      JSON.stringify({

        firestoreId:
          result.id,

        orderId,

        total:
          checkoutData.total,

        paymentMethod:
          selectedPayment,

        createdAt:
          Date.now()

      })

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
      "ORDER:",
      error
    );


    placingOrder =
      false;


    $("#orderLoading").hidden =
      true;


    updatePaidButton();


    toast(
      "Couldn't place order. Try again."
    );

  }

}



/* =========================================================
   AUTH
========================================================= */

onAuthStateChanged(
  auth,
  user => {

    currentUser =
      user ||
      null;


    if (
      user &&
      !$("#receiverName")
        .value
    ) {

      $("#receiverName")
        .value =

        user.displayName ||
        "";

    }

  }
);



/* =========================================================
   INIT
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadCart();

    renderCart();


    /* SELECT ALL */

    $("#selectAll").onchange =
      event => {

        selectedIndexes =

          event.target.checked

            ? new Set(

                cart.map(
                  (_,index) =>
                    index
                )

              )

            : new Set();


        renderCart();

      };


    /* DELETE */

    $("#deleteSelected").onclick =
      () => {

        [
          ...selectedIndexes
        ]
        .sort(
          (a,b) =>
            b-a
        )
        .forEach(
          index => {

            cart.splice(
              index,
              1
            );

          }
        );


        selectedIndexes =
          new Set(

            cart.map(
              (_,index) =>
                index
            )

          );


        saveCart();

        renderCart();

      };


    /* COUPON */

    $("#couponTrigger").onclick =
      () => {

        $("#couponPanel").hidden =
          !$("#couponPanel").hidden;

      };


    $("#applyCoupon").onclick =
      applyCoupon;


    /* OPEN */

    $("#checkoutButton").onclick =
      openCheckout;


    if (
      $("#desktopCheckoutButton")
    ) {

      $("#desktopCheckoutButton").onclick =
        openCheckout;

    }


    /* CLOSE */

    $("#closePhoneCheckout").onclick =
      closeCheckout;


    $("#locationClose").onclick =
      closeCheckout;


    $("#methodClose").onclick =
      closeCheckout;


    $("#finalClose").onclick =
      closeCheckout;


    $("#checkoutBackdrop").onclick =
      closeCheckout;


    /* PHONE INPUT */

    $("#customerPhone").oninput =
      event => {

        event.target.value =

          event.target.value
          .replace(
            /\D/g,
            ""
          )
          .slice(
            0,
            11
          );


        $("#phoneContinue").disabled =
          !normalizePhone(
            event.target.value
          );

      };


    $("#customerPhone").onkeydown =
      event => {

        if (
          event.key ===
          "Enter" &&
          !$("#phoneContinue")
            .disabled
        ) {

          $("#phoneContinue")
            .click();

        }

      };


    $("#phoneContinue").onclick =
      async () => {

        const phone =
          normalizePhone(
            $("#customerPhone")
              .value
          );


        if (
          !phone
        ) {

          return;

        }


        customerPhone =
          phone;


        showStep(
          "location"
        );


        if (
          !locationsLoaded
        ) {

          await loadLocationDatabase();

          locationsLoaded =
            true;

        }

      };


    /* LOCATION BACK */

    $("#locationBack").onclick =
      () => {

        showStep(
          "phone"
        );

      };


    /* LOCATION SELECTS */

    $("#divisionSelect").onchange =
      divisionChanged;


    $("#districtSelect").onchange =
      districtChanged;


    $("#upazilaSelect").onchange =
      upazilaChanged;


    $("#unionSelect").onchange =
      unionChanged;


    $("#locationContinue").onclick =
      () => {

        if (
          !addressValid()
        ) {

          toast(
            "Select Division, District, Upazila and enter delivery details"
          );


          return;

        }


        showStep(
          "method"
        );

      };


    /* METHOD BACK */

    $("#methodBack").onclick =
      () => {

        showStep(
          "location"
        );

      };


    /* PAYMENT OPTIONS */

    document
      .querySelectorAll(
        ".payment-option"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              selectPayment(
                button.dataset.payment
              );

            };

        }
      );


    $("#methodContinue").onclick =
      () => {

        if (
          !selectedPayment
        ) {

          return;

        }


        renderFinal();


        showStep(
          "final"
        );

      };


    /* FINAL BACK */

    $("#finalBack").onclick =
      () => {

        showStep(
          "method"
        );

      };


    /* COPY */

    $("#copyPaymentNumber").onclick =
      async () => {

        if (
          selectedPayment ===
          "cod"
        ) {

          return;

        }


        const number =
          PAYMENT_CONFIG[
            selectedPayment
          ].number;


        try {

          await navigator
            .clipboard
            .writeText(
              number
            );


          toast(
            "Payment number copied"
          );


        } catch {

          toast(
            number
          );

        }

      };


    /* TRANSACTION */

    $("#transactionId").oninput =
      event => {

        event.target.value =

          event.target.value

          .replace(
            /\s+/g,
            ""
          )

          .slice(
            0,
            40
          );


        updatePaidButton();

      };


    /* ORDER */

    $("#placePaidOrder").onclick =
      placeOrder;


    $("#placeCodOrder").onclick =
      placeOrder;


    /* HEADER BACK */

    $("#backButton").onclick =
      () => {

        if (
          $("#checkoutSheet")
            .classList
            .contains(
              "open"
            )
        ) {

          closeCheckout();


          return;

        }


        if (
          history.length >
          1
        ) {

          history.back();

        } else {

          window.location.href =
            "home.html";

        }

      };

  }
);