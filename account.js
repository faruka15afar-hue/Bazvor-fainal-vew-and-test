"use strict";

/* =========================================================
   BAZVOR ACCOUNT PAGE
   CLEAN & STABLE JS
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const backBtn =
    document.getElementById("backBtn");

const settingsBtn =
    document.getElementById("settingsBtn");

const cameraBtn =
    document.getElementById("cameraBtn");

const profileInput =
    document.getElementById("profileInput");

const profileImage =
    document.getElementById("profileImage");

const avatarPlaceholder =
    document.getElementById("avatarPlaceholder");

const editProfileBtn =
    document.getElementById("editProfileBtn");

const editModal =
    document.getElementById("editModal");

const modalClose =
    document.getElementById("modalClose");

const saveProfileBtn =
    document.getElementById("saveProfileBtn");

const editName =
    document.getElementById("editName");

const editPhone =
    document.getElementById("editPhone");

const editEmail =
    document.getElementById("editEmail");

const profileName =
    document.getElementById("profileName");

const profilePhone =
    document.getElementById("profilePhone");

const profileEmail =
    document.getElementById("profileEmail");

const logoutBtn =
    document.getElementById("logoutBtn");

const trackBtn =
    document.getElementById("trackBtn");

const sellerBanner =
    document.getElementById("sellerBanner");


/* =========================================================
   NAVIGATION HELPER
========================================================= */

function goTo(page) {

    window.location.href = page;

}


/* =========================================================
   BACK BUTTON
========================================================= */

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function () {

            if (
                window.history.length > 1
            ) {

                window.history.back();

            } else {

                goTo("home.html");

            }

        }
    );

}


/* =========================================================
   SETTINGS
========================================================= */

if (settingsBtn) {

    settingsBtn.addEventListener(
        "click",
        function () {

            alert(
                "Settings page will be connected here."
            );

        }
    );

}


/* =========================================================
   PROFILE PHOTO
========================================================= */

if (cameraBtn && profileInput) {

    cameraBtn.addEventListener(
        "click",
        function () {

            profileInput.click();

        }
    );


    profileInput.addEventListener(
        "change",
        function () {

            const file =
                this.files &&
                this.files[0];

            if (!file) return;


            if (
                !file.type.startsWith("image/")
            ) {

                alert(
                    "Please select an image."
                );

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const imageUrl =
                        event.target.result;


                    profileImage.src =
                        imageUrl;

                    profileImage.style.display =
                        "block";

                    avatarPlaceholder.style.display =
                        "none";


                    try {

                        localStorage.setItem(
                            "bazvor_profile_image",
                            imageUrl
                        );

                    } catch (error) {

                        console.warn(
                            "Image could not be saved.",
                            error
                        );

                    }

                };


            reader.readAsDataURL(file);

        }
    );

}


/* =========================================================
   LOAD PROFILE PHOTO
========================================================= */

try {

    const savedImage =
        localStorage.getItem(
            "bazvor_profile_image"
        );


    if (savedImage) {

        profileImage.src =
            savedImage;

        profileImage.style.display =
            "block";

        avatarPlaceholder.style.display =
            "none";

    }

} catch (error) {

    console.warn(error);

}


/* =========================================================
   EDIT PROFILE MODAL
========================================================= */

function openEditModal() {

    editModal.classList.add(
        "show"
    );

    document.body.style.overflow =
        "hidden";

}


function closeEditModal() {

    editModal.classList.remove(
        "show"
    );

    document.body.style.overflow =
        "";

}


if (editProfileBtn) {

    editProfileBtn.addEventListener(
        "click",
        openEditModal
    );

}


if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeEditModal
    );

}


if (editModal) {

    editModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                editModal
            ) {

                closeEditModal();

            }

        }
    );

}


/* =========================================================
   SAVE PROFILE
========================================================= */

if (saveProfileBtn) {

    saveProfileBtn.addEventListener(
        "click",
        function () {


            const name =
                editName.value.trim();

            const phone =
                editPhone.value.trim();

            const email =
                editEmail.value.trim();


            if (!name) {

                alert(
                    "Please enter your name."
                );

                return;

            }


            if (!email) {

                alert(
                    "Please enter your email."
                );

                return;

            }


            profileName.textContent =
                name;

            profilePhone.textContent =
                phone || "Not added";

            profileEmail.textContent =
                email;


            try {

                localStorage.setItem(
                    "bazvor_profile_name",
                    name
                );

                localStorage.setItem(
                    "bazvor_profile_phone",
                    phone
                );

                localStorage.setItem(
                    "bazvor_profile_email",
                    email
                );

            } catch (error) {

                console.warn(error);

            }


            closeEditModal();

        }
    );

}


/* =========================================================
   LOAD PROFILE DATA
========================================================= */

try {

    const savedName =
        localStorage.getItem(
            "bazvor_profile_name"
        );

    const savedPhone =
        localStorage.getItem(
            "bazvor_profile_phone"
        );

    const savedEmail =
        localStorage.getItem(
            "bazvor_profile_email"
        );


    if (savedName) {

        profileName.textContent =
            savedName;

        editName.value =
            savedName;

    }


    if (savedPhone) {

        profilePhone.textContent =
            savedPhone;

        editPhone.value =
            savedPhone;

    }


    if (savedEmail) {

        profileEmail.textContent =
            savedEmail;

        editEmail.value =
            savedEmail;

    }

} catch (error) {

    console.warn(error);

}


/* =========================================================
   QUICK STATS
========================================================= */

document
    .querySelectorAll(".stat-card")
    .forEach(function (card) {

        card.addEventListener(
            "click",
            function () {

                const action =
                    this.dataset.action;

                handleAccountAction(
                    action
                );

            }
        );

    });


/* =========================================================
   ACCOUNT MENU
========================================================= */

document
    .querySelectorAll(".menu-item")
    .forEach(function (item) {

        item.addEventListener(
            "click",
            function () {

                const action =
                    this.dataset.action;

                handleAccountAction(
                    action
                );

            }
        );

    });


/* =========================================================
   ACCOUNT ACTION HANDLER
========================================================= */

function handleAccountAction(
    action
) {

    switch (action) {

        case "orders":

            goTo("orders.html");

            break;


        case "wishlist":

            goTo("wishlist.html");

            break;


        case "reviews":

            goTo("reviews.html");

            break;


        case "coupons":

            goTo("coupons.html");

            break;


        case "addresses":

            goTo("addresses.html");

            break;


        case "payment":

            goTo("payment.html");

            break;


        case "notifications":

            goTo("notifications.html");

            break;


        case "help":

            goTo("help.html");

            break;


        case "privacy":

            goTo("privacy.html");

            break;


        default:

            console.log(
                "Unknown account action:",
                action
            );

    }

}


/* =========================================================
   TRACK ORDER
========================================================= */

if (trackBtn) {

    trackBtn.addEventListener(
        "click",
        function () {

            goTo("orders.html");

        }
    );

}


/* =========================================================
   SELLER
========================================================= */

if (sellerBanner) {

    sellerBanner.addEventListener(
        "click",
        function () {

            goTo("seller.html");

        }
    );

}


/* =========================================================
   LOGOUT
========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {


            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {

                return;

            }


            /*
             * এখানে পরে Firebase Auth
             * signOut() বসানো যাবে।
             */


            try {

                localStorage.removeItem(
                    "bazvor_profile_image"
                );

            } catch (error) {

                console.warn(error);

            }


            alert(
                "You have been logged out."
            );


            goTo("home.html");

        }
    );

}


/* =========================================================
   ESC KEY — CLOSE MODAL
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            editModal.classList.contains(
                "show"
            )
        ) {

            closeEditModal();

        }

    }
);