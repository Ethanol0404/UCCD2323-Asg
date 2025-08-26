const profileIcon = document.getElementById("profile");
const profileDropdown = document.getElementById("profileDropdown");
const signDropdown = document.getElementById("signDropdown");

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = decodeURIComponent(document.cookie).split(";");
  for (let c of ca) {
    c = c.trim();
    if (c.startsWith(nameEQ)) {
      return c.substring(nameEQ.length);
    }
  }
  return null;
}

const auth = getCookie("loggedInUser") || sessionStorage.getItem("loggedInUser");

if (auth) {
  profileDropdown.style.display = "none";
  signDropdown.style.display = "none";
} else {
  signDropdown.style.display = "none";
  profileDropdown.style.display = "none";
}

profileIcon.addEventListener("click", () => {
  if (auth) {
    profileDropdown.classList.toggle("show");
  } else {
    signDropdown.classList.toggle("show");
  }
});

document.addEventListener("click", (e) => {
  if (!profileIcon.contains(e.target) &&
    !profileDropdown.contains(e.target) &&
    !signDropdown.contains(e.target)) {
    [profileDropdown, signDropdown].forEach(dd => {
      if (dd.classList.contains("show")) {
        dd.classList.remove("show");
        setTimeout(() => {
          dd.style.display = "none";
        }, 300);
      }
    });
  }
});

function attachObserver(dropdown) {
  const observer = new MutationObserver(() => {
    if (dropdown.classList.contains("show")) {
      dropdown.style.display = "flex";
    }
  });
  observer.observe(dropdown, { attributes: true, attributeFilter: ["class"] });
}

attachObserver(profileDropdown);
attachObserver(signDropdown);




/* menu toggle */
const menuBtn = document.getElementById("menuIcon");
const filterContainer = document.querySelector(".filterCatContainer");
const overlay = document.querySelector(".overlay");

menuBtn.addEventListener("click", () => {
  filterContainer.classList.toggle("show");
  overlay.classList.toggle("show");
});

// Close when clicking overlay
overlay.addEventListener("click", () => {
  filterContainer.classList.remove("show");
  overlay.classList.remove("show");
});

/* filter price range */
const rangevalue = document.querySelector(".slider .priceSlider");
const rangeInputvalue = document.querySelectorAll(".rangeInput input");

let priceGap = 50;

const priceInputvalue = document.querySelectorAll(".priceInput input");
for (let i = 0; i < priceInputvalue.length; i++) {
  priceInputvalue[i].addEventListener("input", e => {

    let minp = parseInt(priceInputvalue[0].value);
    let maxp = parseInt(priceInputvalue[1].value);
    let diff = maxp - minp

    if (minp < 0) {
      alert("minimum price cannot be less than 0");
      priceInputvalue[0].value = 0;
      minp = 0;
    }

    if (maxp > 1000) {
      alert("maximum price cannot be greater than 1000");
      priceInputvalue[1].value = 1000;
      maxp = 1000;
    }

    if (minp > maxp - priceGap) {
      priceInputvalue[0].value = maxp - priceGap;
      minp = maxp - priceGap;

      if (minp < 0) {
        priceInputvalue[0].value = 0;
        minp = 0;
      }
    }

    if (diff >= priceGap && maxp <= rangeInputvalue[1].max) {
      if (e.target.className === "min-input") {
        rangeInputvalue[0].value = minp;
        let value1 = rangeInputvalue[0].max;
        rangevalue.style.left = `${(minp / value1) * 100}%`;
      }
      else {
        rangeInputvalue[1].value = maxp;
        let value2 = rangeInputvalue[1].max;
        rangevalue.style.right = `${100 - (maxp / value2) * 100}%`;
      }
    }
  });

  for (let i = 0; i < rangeInputvalue.length; i++) {
    rangeInputvalue[i].addEventListener("input", e => {
      let minVal = parseInt(rangeInputvalue[0].value);
      let maxVal = parseInt(rangeInputvalue[1].value);

      let diff = maxVal - minVal

      if (diff < priceGap) {

        if (e.target.className === "minRange") {
          rangeInputvalue[0].value = maxVal - priceGap;
        }
        else {
          rangeInputvalue[1].value = minVal + priceGap;
        }
      }
      else {

        priceInputvalue[0].value = minVal;
        priceInputvalue[1].value = maxVal;
        rangevalue.style.left = `${(minVal / rangeInputvalue[0].max) * 100}%`;
        rangevalue.style.right = `${100 - (maxVal / rangeInputvalue[1].max) * 100}%`;
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Get users and logged-in user
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const loggedInEmail = getCookie("loggedInUser") || sessionStorage.getItem("loggedInUser");
  let user = users.find(u => u.email === loggedInEmail);

  // Calculate total quantity
  let totalTypes = 0;
  if (user && Array.isArray(user.cart)) {
    totalTypes = user.cart.length;
  }

  // Show in header (create badge if not exists)
  let cartIcon = document.getElementById("cartIcon");
  if (cartIcon) {
    let badge = document.getElementById("cartQtyBadge");
    if (!badge) {
      badge = document.createElement("span");
      badge.id = "cartQtyBadge";
      badge.className = "cart-qty-badge";
      cartIcon.parentElement.style.position = "relative";
      cartIcon.parentElement.appendChild(badge);
    }
    badge.textContent = totalTypes;
    badge.style.display = totalTypes > 0 ? "inline-block" : "none";
  }

  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      document.cookie = "loggedInUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      alert("Logged out successfully!");
      window.location.href = "login.html";
    });
  }
});
