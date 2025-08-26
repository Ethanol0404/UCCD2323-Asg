// Select all checkbox
$("#selectAll").on("change", function () {
  $("input[type=checkbox]").prop("checked", $(this).prop("checked"));
});

/*//Shipping Method
$("input[name=shipping]").on("change", function () {
  let shippingMethod = $(this).val();

  if (shippingMethod === "Home Delivery") {
    $("#addressBox").show();
  } else {
    $("#addressBox").hide();
  }
});

// Save address to Local Storage
$("#saveAddressBtn").on("click", function () {
  let address = $("#deliveryAddress").val().trim();

  if (address === "") {
    alert("Please enter your address before saving.");
  } else {
    localStorage.setItem("deliveryAddress", address);
    alert("Your address has been saved!");
  }
});*/



// Load saved address on page load
$(document).ready(function () {
  let savedAddress = localStorage.getItem("deliveryAddress");
  if (savedAddress) {
    $("#deliveryAddress").val(savedAddress);
  }
});

// Handle Confirm Order button
$(".btn-confirm").on("click", function () {
  let shipping = $("input[name=shipping]:checked").val();
  let payment = $("input[name=payment]:checked").val();
  let selectedBank = $("#bankSelect").val();

  if (selectedBank === "") {
    alert("Please select a bank to proceed with Online Banking.");
  } else {
    // Redirect user to the chosen bank's login page
    window.location.href = selectedBank;
  }

  function updatePrices(productTotal, shipping) {
    $("#productPrice").text("RM " + productTotal);
    $("#shippingFee").text("RM " + shipping);
    $("#totalPrice").text("RM " + (productTotal + shipping));
  }

  //Check cart item whether it is empty, if it is,prompt the message out
  document.addEventListener("DOMContentLoaded", function () {
    const cartBody = document.getElementById("cartBody");
    const emptyMessage = document.getElementById("emptyMessage");
    const cartTable = document.getElementById("cartTable");

    function checkCart() {
      if (cartBody.children.length === 0) {
        // If no items, show empty message, hide table
        emptyMessage.style.display = "block";
        cartTable.style.display = "none";
      } else {
        // If items exist, show table, hide empty message
        emptyMessage.style.display = "none";
        cartTable.style.display = "table";
      }
    }

    // Initial check when page loads
    checkCart();

    // Event delegation for delete buttons
    cartBody.addEventListener("click", function (e) {
      if (e.target.classList.contains("delete-btn")) {
        e.target.closest("tr").remove();
        checkCart();
      }
    });
  });

  /////Delete one product
  document.addEventListener("DOMContentLoaded", () => {
    const cartTable = document.getElementById("cartItems");

    cartTable.addEventListener("click", function (e) {
      if (e.target.classList.contains("delete-btn")) {
        e.target.closest("tr").remove(); // remove the row
        updateSummary(); // recalculate totals
      }
    });
  });

  // Delete All Products button
  $("#deleteAllBtn").on("click", function () {
    if (confirm("Are you sure you want to delete all products from the cart?")) {
      $(".checkout-table tbody").empty(); // remove all rows
      updatePrices(0, 0); // reset totals to RM 0
      alert("All products have been removed from your cart.");
    }
  });
  //Situation: User doesn't select shipping/ payment method
  if (!shipping || !payment) {
    alert("Please select a shipping and payment method before confirming your order.");
  } else {
    alert("Order confirmed!\nShipping: " + shipping + "\nPayment: " + payment);
  }
});

//Function to recalculate totols
function updateSummary() {
  let total = 0;
  const rows = document.querySelectorAll("#cartItems tr");

  rows.forEach(row => {
    const subtotal = row.querySelector(".subtotal");
    if (subtotal) {
      const price = parseFloat(subtotal.textContent.replace("RM", "").trim());
      total += price;
    }
  });

  document.getElementById("productPrice").textContent = "RM " + total;
  document.getElementById("totalPrice").textContent = "RM " + total;
}

// Update Subtotal & Total Price
function updateCartTotals() {
  let productTotal = 0;

  $(".checkout-table tbody tr").each(function () {
    let unitPrice = parseFloat($(this).find(".unit-price").text());
    let qty = parseInt($(this).find(".quantity").val());
    let subtotal = unitPrice * qty;

    $(this).find(".subtotal").text(subtotal.toFixed(2));
    productTotal += subtotal;
  });

  // Update summary section
  $("#productPrice").text("RM " + productTotal.toFixed(2));
  $("#totalPrice").text("RM " + productTotal.toFixed(2)); // assuming shipping is RM 0
}

//E-wallet transfer
document.addEventListener("DOMContentLoaded", function () {
  const ewalletRadio = document.querySelector('input[value="E-wallet Transfer"]');
  const ewalletOptions = document.getElementById("ewalletOptions");

  // Listen for selection
  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener("change", function () {
      if (ewalletRadio.checked) {
        ewalletOptions.style.display = "block";
      } else {
        ewalletOptions.style.display = "none";
        ewalletOptions.value = ""; // reset selection
      }
    });
  });
});

//Credit Card
//Card Number
const cardNumberInput = document.getElementById("cardNumber");
cardNumberInput.addEventListener("input", function () {
  // Remove all non-numeric characters
  this.value = this.value.replace(/\D/g, "");

  // Limit to 16 digits max
  if (this.value.length > 16) {
    this.value = this.value.slice(0, 16);
  }
});

// On form submit validation
document.getElementById("paymentForm").addEventListener("submit", function (e) {
  if (!/^\d{16}$/.test(cardNumberInput.value)) {
    e.preventDefault(); // stop form from submitting
    cardNumberInput.classList.add("is-invalid"); // show error style
  } else {
    cardNumberInput.classList.remove("is-invalid");
    cardNumberInput.classList.add("is-valid");
  }
});

//CVV
document.getElementById("cardCVV").addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, ""); // remove non-digits
  if (this.value.length > 3) {
    this.value = this.value.slice(0, 3); // limit to 3 digits
  }
});


// Quantity control functionality
document.querySelector('.minus').addEventListener('click', function () {
  const input = document.querySelector('.quantity-input');
  let value = parseInt(input.value) || 1;
  if (value > 1) {
    input.value = value - 1;
  }
});

document.querySelector('.plus').addEventListener('click', function () {
  const input = document.querySelector('.quantity-input');
  let value = parseInt(input.value) || 1;
  if (value < currentStock) {
    input.value = value + 1;
  }
});

// Manual input (typing number directly)
$(document).on("change", ".quantity", function () {
  let val = parseInt($(this).val());
  if (isNaN(val) || val < 1) {
    $(this).val(1);
  }
  updateCartTotals();
});

// Initialize totals on page load
$(document).ready(function () {
  updateCartTotals();
});

// Bootstrap form validation
(() => {
  'use strict';

  const form = document.querySelector('#shippingForm');

  form.addEventListener('submit', function (event) {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      saveAddress();
    }
    form.classList.add('was-validated');
  }, false);
})();

/*// Save shipping address in localStorage
function saveAddress() {
  const homeRadio = document.getElementById('homeRadio');
  const pickupRadio = document.getElementById('pickupRadio');
  let shippingData = {};

  if (homeRadio.checked) {
    const address = document.getElementById('homeAddress').value;
    shippingData = { method: 'Home Delivery', address };
  } else if (pickupRadio.checked) {
    const address = document.getElementById('pickupAddress').value;
    shippingData = { method: 'Self Collection', address };
  }

  localStorage.setItem('shippingInfo', JSON.stringify(shippingData));
  alert("Shipping info saved!");
}

//*/


