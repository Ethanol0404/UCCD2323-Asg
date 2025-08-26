const forYouContainer = document.querySelector('.forYouContainer');
let productsData = []; // This will store our loaded products

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    await loadProductData();

    // Load "For You" first
    loadForYouProducts();

    // Check cookies consent
    const cookiesConsent = localStorage.getItem('cookiesConsent');
    console.log('Cookies consent status:', cookiesConsent);
    if (cookiesConsent) {
        cookies.style.display = 'none';
    }

    setTimeout(() => {
        if (!cookiesConsent) {
            cookies.style.display = 'none';
            localStorage.setItem('cookiesConsent', false);
        }
    }, 5 * 60 * 1000);
    
});

// Load product data from JSON file
async function loadProductData() {
    try {
        const response = await fetch('js/productInfo.json');
        console.log('Loading product data from js/productInfo.json');
        if (!response.ok) {
            throw new Error('Failed to load products data');
        }
        const data = await response.json();
        productsData = data.products;
    } catch (error) {
        console.error('Error loading product data:', error);
        showAlert('danger', 'Failed to load product information');
    }
}

// Load 4 random "For You" products (no filtering, just shuffle)
function loadForYouProducts() {
    if (!forYouContainer) {
        console.error('For You container not found');
        return;
    }
    forYouContainer.innerHTML = '';

    // Shuffle & pick 4
    const randomProducts = [...productsData]
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

    randomProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'forYouItem';
        productElement.innerHTML = `
            <img id="forYouImg" src="${product.images[0]}" alt="${product.name}" width="200" height="200" loading="lazy">
            <p id="forYouProductName">${product.name}</p>
            <p id="forYouPrice">${formatPrice(product.price)}</p>
            <div id="forYouDetails">
                <div>
                    <img src="picture/productDetail/puzzle-piece.png" alt="puzzle" width="25" height="25">
                    <span>Pieces: </span>
                    <p>${product.details.pieces}</p>
                </div>
                <div>
                    <img src="picture/productDetail/material.png" alt="material" width="25" height="25">
                    <span>Materials: </span>
                    <p>${product.details.material}</p>
                </div>
                <div>
                    <img src="picture/productDetail/maximize.png" alt="maximize" width="25" height="25">
                    <span>Size: </span>
                    <p>${product.details.size}</p>
                </div>
            </div>
        `;

        productElement.addEventListener('click', () => {
            window.location.href = `productDetail.html?id=${product.id}`;
        });

        forYouContainer.appendChild(productElement);
    });
}

function formatPrice(price) {
    return `RM${price.toFixed(2)}`;
}

function showAlert(type, message) {
    // Implement your alert/notification system here
    console.log(`${type}: ${message}`);
}

const cookies = document.querySelector('.cookiesContainer');

// Cookies mechanism
document.getElementById('cookiesRejectBtn').addEventListener('click', function() {
    cookies.style.display = 'none';
    localStorage.setItem('cookiesConsent', false);
});

document.getElementById('cookiesAcceptBtn').addEventListener('click', function() {
    cookies.style.display = 'none';
    localStorage.setItem('cookiesConsent', true);
});

