document.addEventListener("DOMContentLoaded", function () {
    // Temporary demo data (remove later when using real Add-to-Cart)
    if (!localStorage.getItem("cart")) {
        localStorage.setItem("cart", JSON.stringify([
            { id: 1, name: "Product 1", price: 25.00, quantity: 1, img: "https://via.placeholder.com/70" },
            { id: 2, name: "Product 2", price: 15.00, quantity: 2, img: "https://via.placeholder.com/70" }
        ]));
    }

    document.addEventListener("DOMContentLoaded", function () {
        const cartBody = document.getElementById("cartBody");
        const selectAllCheckbox = document.getElementById("selectAll");
        const totalElement = document.querySelector(".cart-summary h3");
        const emptyMessage = document.getElementById("emptyMessage");

        // --- Load cart from localStorage ---
        function loadCart() {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            cartBody.innerHTML = ""; // clear old rows

            if (cart.length === 0) {
                emptyMessage.style.display = "block";
                document.querySelector(".cart-summary").style.display = "none";
                return;
            } else {
                emptyMessage.style.display = "none";
                document.querySelector(".cart-summary").style.display = "block";
            }

            cart.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
        <td><input type="checkbox" class="row-checkbox"></td>
        <td class="product">
          <img src="${item.img}" alt="${item.name}">
          <span>${item.name}</span>
        </td>
        <td>$${item.price.toFixed(2)}</td>
        <td class="quantity"><input type="number" value="${item.quantity}" min="1"></td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
        <td><button class="remove-btn">X</button></td>
      `;
                cartBody.appendChild(row);
            });

            attachEventListeners(); // reattach events after rendering
            updateCartTotal();
        }

        // --- Update total ---
        function updateCartTotal() {
            let total = 0;
            const rows = document.querySelectorAll("#cartBody tr");

            rows.forEach(row => {
                const checkbox = row.querySelector(".row-checkbox");
                const priceElement = row.querySelector("td:nth-child(3)");
                const quantityInput = row.querySelector(".quantity input");
                const totalCell = row.querySelector("td:nth-child(5)");

                const price = parseFloat(priceElement.textContent.replace("$", ""));
                const quantity = parseInt(quantityInput.value);
                const rowTotal = price * quantity;

                totalCell.textContent = `$${rowTotal.toFixed(2)}`;

                if (checkbox.checked) total += rowTotal;
            });

            totalElement.textContent = `Total: $${total.toFixed(2)}`;
        }

        // --- Save cart back to localStorage ---
        function saveCart() {
            const rows = document.querySelectorAll("#cartBody tr");
            const cart = [];
            rows.forEach(row => {
                const name = row.querySelector(".product span").textContent;
                const img = row.querySelector(".product img").src;
                const price = parseFloat(row.querySelector("td:nth-child(3)").textContent.replace("$", ""));
                const quantity = parseInt(row.querySelector(".quantity input").value);
                cart.push({ name, img, price, quantity });
            });
            localStorage.setItem("cart", JSON.stringify(cart));
        }

        // --- Attach events for quantity, remove, checkbox ---
        function attachEventListeners() {
            document.querySelectorAll(".quantity input").forEach(input => {
                input.addEventListener("change", function () {
                    if (this.value < 1) this.value = 1;
                    saveCart();
                    updateCartTotal();
                });
            });

            document.querySelectorAll(".remove-btn").forEach((btn, index) => {
                btn.addEventListener("click", function () {
                    let cart = JSON.parse(localStorage.getItem("cart")) || [];
                    cart.splice(index, 1); // remove product
                    localStorage.setItem("cart", JSON.stringify(cart));
                    loadCart(); // reload
                });
            });

            document.querySelectorAll(".row-checkbox").forEach(cb => {
                cb.addEventListener("change", function () {
                    if (!this.checked) {
                        selectAllCheckbox.checked = false;
                    } else if (document.querySelectorAll(".row-checkbox:checked").length === document.querySelectorAll(".row-checkbox").length) {
                        selectAllCheckbox.checked = true;
                    }
                    updateCartTotal();
                });
            });
        }

        // --- Select All Checkbox ---
        selectAllCheckbox.addEventListener("change", function () {
            document.querySelectorAll(".row-checkbox").forEach(cb => cb.checked = this.checked);
            updateCartTotal();
        });

        // --- Init ---
        loadCart();
    });
});