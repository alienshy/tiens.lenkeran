const menuIcon = document.getElementById('menuIcon');
const closeIcon = document.querySelector('.menu .bi-x');
const menu = document.querySelector('.menu');

menuIcon.addEventListener('click', () => {
    if (menu.style.left === "-100%") {
        menu.style.left = "0";
    } else {
        menu.style.left = "-100%";
    }
});

closeIcon.addEventListener('click', () => {
    menu.style.left = "-100%";
});

document.addEventListener('click', (event) => {
    const isClickInsideMenu = menu.contains(event.target);
    const isClickInsideMenuIcon = menuIcon.contains(event.target);

    if (!isClickInsideMenu && !isClickInsideMenuIcon) {
        menu.style.left = "-100%";
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 850) {
        menu.style.left = "-100%";
    }
});

const api = "https://feline-rogue-kilogram.glitch.me/data";
const itemsPerPage = 5;
let currentPage = 1;
let medicines = [];
let filteredMedicines = [];

const searchInput = document.getElementById('search');
const priceFilter = document.getElementById('priceFilter');
const carouselInner = document.querySelector('.carousel-inner');
const pageButtonsContainer = document.querySelector('.pagination');

// Fetch data and initialize
async function fetchData() {
    try {
        const response = await axios.get(api);
        medicines = response.data;
        filteredMedicines = [...medicines];
        paginateAndRender(filteredMedicines, currentPage);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Render Medicines
function renderMedicines(items) {
    carouselInner.innerHTML = '';

    items.forEach(item => {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';
        carouselItem.innerHTML = `
            <div class="image"><img src="${item.image}" alt="${item.name}"></div>
            <div class="text">
                <p>${item.name}</p>
                <a href="detail.html?id=${item.id}" class="details-button">Detallara bax</a>
            </div>
        `;
        carouselInner.appendChild(carouselItem);
    });
}
{/* <p class="price">$${item.price.toFixed(2)}</p> */}
// Update Pagination Buttons
function updatePagination() {
    const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
    pageButtonsContainer.innerHTML = '';

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.className = 'page-btn prev-page';
        prevButton.innerHTML = '&laquo; Prev';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            currentPage--;
            paginateAndRender(filteredMedicines, currentPage);
        });
        pageButtonsContainer.appendChild(prevButton);
    }

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `page-btn ${currentPage === i ? 'active' : ''}`;
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            paginateAndRender(filteredMedicines, currentPage);
        });
        pageButtonsContainer.appendChild(pageButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.className = 'page-btn next-page';
        nextButton.innerHTML = 'Next &raquo;';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            currentPage++;
            paginateAndRender(filteredMedicines, currentPage);
        });
        pageButtonsContainer.appendChild(nextButton);
    }
}

// Paginate and Render
function paginateAndRender(items, page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, items.length);
    const pageItems = items.slice(startIndex, endIndex);
    renderMedicines(pageItems);
    updatePagination();
}

// Filter and Sort
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const sortOrder = priceFilter.value;

    filteredMedicines = medicines
        .filter(medicine => medicine.name.toLowerCase().includes(searchTerm))
        .sort((a, b) => {
            if (sortOrder === 'low-high') return a.price - b.price;
            if (sortOrder === 'high-low') return b.price - a.price;
            return 0;
        });

    currentPage = 1;
    paginateAndRender(filteredMedicines, currentPage);
}

// Event Listeners
searchInput.addEventListener('input', applyFilters);
priceFilter.addEventListener('change', applyFilters);

// Initial Render
fetchData();
