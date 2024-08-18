const apiUrl = 'https://feline-rogue-kilogram.glitch.me/data';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
        fetch(`${apiUrl}/${productId}`)
            .then(response => response.json())
            .then(product => displayProductDetails(product));
    }
    document.getElementById('back-button').addEventListener('click', () => {
        window.history.back();
    });
});

function displayProductDetails(product) {
    const detailDiv = document.getElementById('product-detail');
    detailDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h1>${product.name}</h1>
        <p>${product.description}</p>
        <h2>İstifadə Qaydaları:</h2>
        <ul>
            ${product.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
        </ul>
        <h2>Tərkibi:</h2>
        <p>${product.composition}</p>
        <h2>Əlaqə:</h2>
        <p><a href="tel:+${product.contact.phone}">Zəng et: ${product.contact.phone}</a></p>
        <p><a href="https://wa.me/${product.contact.phone}">WhatsApp ilə əlaqə: ${product.contact.phone}</a></p>
        ${product.contact.delivery ? `
            <h3>Çatdırılma:</h3>
            <p>Metro: ${product.contact.delivery.metro}</p>
            <p>Rayon: ${product.contact.delivery.rayon}</p>
        ` : ''}
        <p><a href="https://www.instagram.com/alisahverdiyew/" target="_blank">Instagram Profilinə Keçid</a></p>
    `;
}
