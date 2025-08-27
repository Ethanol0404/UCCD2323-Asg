// Back to top button functionality
const backToTopButton = document.getElementById('backToTopBtn');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 0) {   // show as soon as user scrolls down
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Initialize the page when loaded
document.addEventListener('DOMContentLoaded', async () => {
    await loadProductData(); // ensures products are loaded and rendered
    await renderProducts()
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    console.log('Category from URL:', category);
    if (category) {
        const headerId = `${category.replace(/\s+/g, '')}Header`;
        const headerElem = document.getElementById(headerId);
        if (headerElem) {
            headerElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});
