"use strict";

/* =========================================================
   BAZVOR — MESSAGE SYSTEM
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
  query,
  where,
  onSnapshot,
  doc,
  updateDoc
} from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


/* =========================================================
   FIREBASE
========================================================= */

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
   HELPERS
========================================================= */

const $ = selector =>
  document.querySelector(selector);


const esc = value =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");


function go(page) {

  if (!page) return;

  location.href =
    page;
}


/* =========================================================
   STATE
========================================================= */

let currentUser = null;

let conversations = [];

let currentSearch = "";

let unsubscribeConversations = null;


/* =========================================================
   ELEMENTS
========================================================= */

const loading =
  $("#messageLoading");


const guest =
  $("#guestState");


const conversationSection =
  $("#conversationSection");


const conversationList =
  $("#conversationList");


const emptyState =
  $("#emptyState");


const searchEmptyState =
  $("#searchEmptyState");


const errorState =
  $("#errorState");


const searchInput =
  $("#messageSearchInput");


const clearSearchButton =
  $("#clearSearchButton");


/* =========================================================
   HIDE STATES
========================================================= */

function hideStates() {

  loading.hidden =
    true;

  guest.hidden =
    true;

  conversationSection.hidden =
    true;

  emptyState.hidden =
    true;

  searchEmptyState.hidden =
    true;

  errorState.hidden =
    true;
}


/* =========================================================
   TIME
========================================================= */

function timestamp(value) {

  if (!value) return 0;


  if (
    typeof value.toMillis ===
    "function"
  ) {

    return value.toMillis();
  }


  if (
    typeof value.seconds ===
    "number"
  ) {

    return value.seconds * 1000;
  }


  const parsed =
    Date.parse(value);


  return Number.isFinite(parsed)
    ? parsed
    : 0;
}


function timeLabel(value) {

  const time =
    timestamp(value);


  if (!time) return "";


  const date =
    new Date(time);


  const now =
    new Date();


  const sameDay =
    date.toDateString() ===
    now.toDateString();


  if (sameDay) {

    return date
      .toLocaleTimeString(
        [],
        {
          hour: "numeric",
          minute: "2-digit"
        }
      );
  }


  const yesterday =
    new Date(now);


  yesterday.setDate(
    now.getDate() - 1
  );


  if (
    date.toDateString() ===
    yesterday.toDateString()
  ) {

    return "Yesterday";
  }


  return date
    .toLocaleDateString(
      [],
      {
        day: "numeric",
        month: "short"
      }
    );
}


/* =========================================================
   CONVERSATION DATA HELPERS
========================================================= */

function otherName(item) {

  return (
    item.otherName ||
    item.sellerName ||
    item.shopName ||
    item.supportName ||
    item.title ||
    "Bazvor User"
  );
}


function otherPhoto(item) {

  return (
    item.otherPhoto ||
    item.sellerPhoto ||
    item.shopLogo ||
    item.photoURL ||
    ""
  );
}


function lastMessage(item) {

  return (
    item.lastMessage ||
    item.lastMessageText ||
    "Start a conversation"
  );
}


function unreadCount(item) {

  if (!currentUser) {

    return 0;
  }


  /*
     Recommended format:

     unreadCounts: {
        uid1: 2,
        uid2: 0
     }
  */

  const counts =
    item.unreadCounts;


  if (
    counts &&
    typeof counts === "object"
  ) {

    const number =
      Number(
        counts[
          currentUser.uid
        ]
      );


    return Number.isFinite(number)
      ? Math.max(0, number)
      : 0;
  }


  /*
     Basic fallback.
  */

  const number =
    Number(item.unreadCount);


  return Number.isFinite(number)
    ? Math.max(0, number)
    : 0;
}


/* =========================================================
   AVATAR
========================================================= */

function avatarHTML(item) {

  const name =
    otherName(item);


  const photo =
    otherPhoto(item);


  const initial =
    name
      .trim()
      .charAt(0)
      .toUpperCase() ||
    "B";


  return `

    <span class="conversation-avatar">

      ${
        photo
          ? `
            <img
              src="${esc(photo)}"
              alt="${esc(name)}"
              loading="lazy"
              onerror="this.remove()"
            >
          `
          : esc(initial)
      }

    </span>

    ${
      item.online === true
        ? `
          <span class="online-dot"></span>
        `
        : ""
    }

  `;
}


/* =========================================================
   CONVERSATION CARD
========================================================= */

function conversationHTML(item) {

  const unread =
    unreadCount(item);


  const name =
    otherName(item);


  const message =
    lastMessage(item);


  return `

    <button
      type="button"
      class="conversation-item ${
        unread > 0
          ? "unread"
          : ""
      }"
      data-conversation-id="${esc(item.id)}"
    >

      <span style="position:relative">

        ${avatarHTML(item)}

      </span>


      <span class="conversation-body">

        <span class="conversation-top">

          <strong class="conversation-name">
            ${esc(name)}
          </strong>


          ${
            item.verified === true ||
            item.isSupport === true
              ? `
                <i
                  class="fa-solid fa-circle-check verified"
                ></i>
              `
              : ""
          }


          <time class="conversation-time">

            ${esc(
              timeLabel(
                item.updatedAt ||
                item.lastMessageAt
              )
            )}

          </time>

        </span>


        <span class="conversation-bottom">

          <span class="last-message">

            ${
              item.lastSenderId ===
              currentUser?.uid
                ? `
                  <i
                    class="fa-solid fa-check-double message-status ${
                      item.lastMessageRead
                        ? "read"
                        : ""
                    }"
                  ></i>
                `
                : ""
            }

            ${esc(message)}

          </span>


          ${
            unread > 0
              ? `
                <b class="unread-badge">

                  ${
                    unread > 99
                      ? "99+"
                      : unread
                  }

                </b>
              `
              : ""
          }

        </span>

      </span>

    </button>

  `;
}


/* =========================================================
   FILTER
========================================================= */

function filteredConversations() {

  if (!currentSearch) {

    return conversations;
  }


  return conversations.filter(
    item => {

      const text =
        (
          otherName(item) +
          " " +
          lastMessage(item)
        )
          .toLowerCase();


      return text.includes(
        currentSearch
      );
    }
  );
}


/* =========================================================
   HEADER BADGE
========================================================= */

function updateUnreadHeader() {

  const total =
    conversations.reduce(
      (
        sum,
        item
      ) =>
        sum +
        unreadCount(item),
      0
    );


  const element =
    $("#headerUnreadCount");


  if (total > 0) {

    element.hidden =
      false;


    element.textContent =
      `${
        total > 99
          ? "99+"
          : total
      } unread`;


    $("#markAllReadButton").hidden =
      false;

  } else {

    element.hidden =
      true;


    $("#markAllReadButton").hidden =
      true;
  }
}


/* =========================================================
   RENDER
========================================================= */

function renderConversations() {

  hideStates();


  if (
    conversations.length === 0
  ) {

    emptyState.hidden =
      false;

    return;
  }


  const filtered =
    filteredConversations();


  if (
    filtered.length === 0
  ) {

    searchEmptyState.hidden =
      false;

    return;
  }


  conversationSection.hidden =
    false;


  $("#conversationSummary")
    .textContent =
      `${
        conversations.length
      } conversation${
        conversations.length === 1
          ? ""
          : "s"
      }`;


  conversationList.innerHTML =
    filtered
      .map(
        conversationHTML
      )
      .join("");


  conversationList
    .querySelectorAll(
      "[data-conversation-id]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const id =
            button.dataset
              .conversationId;


          go(
            `chat.html?id=${
              encodeURIComponent(id)
            }`
          );

        }
      );

    });


  updateUnreadHeader();
}


/* =========================================================
   LOAD FIRESTORE CONVERSATIONS
========================================================= */

function loadConversations(user) {

  if (
    typeof unsubscribeConversations ===
    "function"
  ) {

    unsubscribeConversations();

    unsubscribeConversations =
      null;
  }


  hideStates();

  loading.hidden =
    false;


  /*
     Firestore structure:

     conversations/{conversationId}

     participants: [
       "BUYER_UID",
       "SELLER_UID"
     ]

     otherName: "Tech Store"
     lastMessage: "Hello"
     updatedAt: serverTimestamp()

     unreadCounts: {
       BUYER_UID: 2,
       SELLER_UID: 0
     }
  */


  const conversationsQuery =
    query(
      collection(
        db,
        "conversations"
      ),

      where(
        "participants",
        "array-contains",
        user.uid
      )
    );


  unsubscribeConversations =
    onSnapshot(

      conversationsQuery,

      snapshot => {

        conversations = [];


        snapshot.forEach(
          documentSnapshot => {

            conversations.push({

              id:
                documentSnapshot.id,

              ...(
                documentSnapshot.data() ||
                {}
              )

            });

          }
        );


        /*
           Sort locally so Firestore
           composite index isn't required.
        */

        conversations.sort(
          (a,b) =>
            timestamp(
              b.updatedAt ||
              b.lastMessageAt
            ) -
            timestamp(
              a.updatedAt ||
              a.lastMessageAt
            )
        );


        renderConversations();

      },

      error => {

        console.error(
          "BAZVOR MESSAGE ERROR:",
          error
        );


        hideStates();


        errorState.hidden =
          false;


        $("#errorMessage")
          .textContent =
            error.code ===
            "permission-denied"
              ? "Message permission denied. Check your Firestore rules."
              : "Unable to load your conversations right now.";

      }

    );

}


/* =========================================================
   SEARCH
========================================================= */

searchInput
  ?.addEventListener(
    "input",
    event => {

      currentSearch =
        String(
          event.target.value ||
          ""
        )
          .trim()
          .toLowerCase();


      clearSearchButton.hidden =
        !currentSearch;


      if (
        currentUser
      ) {

        renderConversations();
      }

    }
  );


clearSearchButton
  ?.addEventListener(
    "click",
    () => {

      searchInput.value =
        "";


      currentSearch =
        "";


      clearSearchButton.hidden =
        true;


      renderConversations();


      searchInput.focus();

    }
  );


/* =========================================================
   MARK ALL READ
========================================================= */

$("#markAllReadButton")
  ?.addEventListener(
    "click",
    async () => {

      if (!currentUser) return;


      const unreadItems =
        conversations.filter(
          item =>
            unreadCount(item) > 0
        );


      for (
        const item of unreadItems
      ) {

        try {

          await updateDoc(
            doc(
              db,
              "conversations",
              item.id
            ),
            {
              [
                `unreadCounts.${
                  currentUser.uid
                }`
              ]: 0
            }
          );

        } catch (error) {

          console.warn(
            "MARK READ ERROR:",
            error
          );
        }

      }

    }
  );


/* =========================================================
   AUTH
========================================================= */

onAuthStateChanged(
  auth,
  user => {

    if (!user) {

      currentUser =
        null;


      conversations =
        [];


      if (
        typeof unsubscribeConversations ===
        "function"
      ) {

        unsubscribeConversations();

        unsubscribeConversations =
          null;
      }


      hideStates();


      guest.hidden =
        false;


      /*
         Search is unnecessary for guest.
      */

      $("#messageSearchSection")
        .style.display =
          "none";


      $("#floatingSupport")
        .style.display =
          "flex";


      return;
    }


    currentUser =
      user;


    $("#messageSearchSection")
      .style.display =
        "block";


    loadConversations(
      user
    );

  }
);


/* =========================================================
   GUEST LOGIN
========================================================= */

$("#guestLoginButton")
  ?.addEventListener(
    "click",
    () => {

      go(
        "auth.html?redirect=message.html"
      );

    }
  );


/* =========================================================
   SUPPORT
========================================================= */

function openSupport() {

  /*
     Guest can still view public
     help center.
  */

  if (!currentUser) {

    go(
      "help.html"
    );

    return;
  }


  /*
     Later we can automatically
     create/open Bazvor Support
     conversation here.

     For now:
  */

  go(
    "help.html"
  );

}


$("#headerSupportButton")
  ?.addEventListener(
    "click",
    openSupport
  );


$("#floatingSupport")
  ?.addEventListener(
    "click",
    openSupport
  );


$("#guestSupportButton")
  ?.addEventListener(
    "click",
    openSupport
  );


/* =========================================================
   SHOPPING
========================================================= */

$("#startShoppingButton")
  ?.addEventListener(
    "click",
    () => {

      go(
        "home.html"
      );

    }
  );


/* =========================================================
   BACK
========================================================= */

$("#backButton")
  ?.addEventListener(
    "click",
    () => {

      if (
        history.length > 1
      ) {

        history.back();

      } else {

        go(
          "home.html"
        );
      }

    }
  );


/* =========================================================
   RETRY
========================================================= */

$("#retryButton")
  ?.addEventListener(
    "click",
    () => {

      if (currentUser) {

        loadConversations(
          currentUser
        );
      }

    }
  );


/* =========================================================
   CLEANUP
========================================================= */

window.addEventListener(
  "beforeunload",
  () => {

    if (
      typeof unsubscribeConversations ===
      "function"
    ) {

      unsubscribeConversations();
    }

  }
);