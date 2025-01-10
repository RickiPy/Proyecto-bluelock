// Configuración de jugadores
const playerConfigs = {
    rin: {
        name: 'Rin Itoshi',
        color: '#00FFFF',
        image: '/assets/images/Rin Ropa.jpg'
    },
    sae: {
        name: 'Sae Itoshi',
        color: '#FD7CE1',
        image: '/assets/images/Sae Ropa.jpg'
    },
    nagi: {
        name: 'Nagi Seishiro',
        color: '#A78BFA',
        image: '/assets/images/Nagi Ropa.jpg'
    },
    isagi: {
        name: 'Yoichi Isagi',
        color: '#60A5FA',
        image: '/assets/images/Isagi Ropa.jpg'
    }
};

// Carrito de compras
let cart = [];

// Cargar carrito desde localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    cart = savedCart ? JSON.parse(savedCart) : [];
    // Asegurarse de que cada item tenga una cantidad
    cart = cart.map(item => ({
        ...item,
        quantity: item.quantity || 1
    }));
}

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Función para calcular el total del carrito
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

// Función para actualizar el contenido del carrito
function updateCartContent() {
    const cartPreview = document.querySelector('.cart-preview');
    if (!cartPreview) return;

    const isMainPage = !window.location.href.includes('player-store.html');
    const accentColor = isMainPage ? 'accent-blue' : 'player';

    if (cart.length === 0) {
        cartPreview.innerHTML = `<p class="text-center text-${accentColor}/70">Carrito vacío</p>`;
        return;
    }

    let content = '<div class="space-y-4">';
    cart.forEach((item, index) => {
        content += `
            <div class="flex items-center gap-3 pb-3 border-b border-${accentColor}/20">
                <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-lg">
                <div class="flex-1">
                    <div class="flex justify-between items-start">
                        <h4 class="text-${accentColor} font-semibold">${item.name}</h4>
                        <span class="text-xs text-${accentColor}/70 px-2 py-1 bg-${accentColor}/10 rounded-full">x${item.quantity}</span>
                    </div>
                    <p class="text-sm text-gray-400">${item.description}</p>
                    <div class="flex justify-between items-center mt-1">
                        <span class="text-white font-bold">${(item.price * item.quantity).toFixed(2)}€</span>
                        <div class="flex items-center gap-2">
                            <button onclick="removeOneFromCart(${index})" class="text-xs text-${accentColor}/70 hover:text-${accentColor}">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button onclick="addOneToCart(${index})" class="text-xs text-${accentColor}/70 hover:text-${accentColor}">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button onclick="removeFromCart(${index})" class="text-xs text-red-500/70 hover:text-red-500 ml-2">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    content += `
        <div class="pt-3 border-t border-${accentColor}/20">
            <div class="flex justify-between items-center">
                <span class="text-${accentColor}/70">Total:</span>
                <span class="text-white font-bold text-lg">${calculateTotal()}€</span>
            </div>
            <button onclick="checkout()" class="w-full mt-3 bg-${accentColor} text-black font-semibold py-2 rounded-lg hover:bg-${accentColor}/90 transition-colors">
                Proceder al Pago
            </button>
        </div>
    </div>`;

    cartPreview.innerHTML = content;
}

// Función para añadir al carrito
function addToCart(product) {
    const existingProductIndex = cart.findIndex(item => 
        item.name === product.name && 
        item.price === product.price
    );

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    updateCartContent();

    // Mostrar notificación
    showNotification('Producto añadido al carrito');
}

// Función para eliminar una unidad del carrito
function removeOneFromCart(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        saveCart();
        updateCartCount();
        updateCartContent();
    } else {
        removeFromCart(index);
    }
}

// Función para añadir una unidad al carrito
function addOneToCart(index) {
    cart[index].quantity++;
    saveCart();
    updateCartCount();
    updateCartContent();
    showNotification('Cantidad actualizada');
}

// Función para eliminar del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    updateCartContent();
    showNotification('Producto eliminado del carrito', 'warning');
}

// Función para mostrar notificaciones
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const isMainPage = !window.location.href.includes('player-store.html');
    const bgColor = type === 'success' ? 
        (isMainPage ? 'bg-accent-blue/90' : 'bg-player/90') : 
        'bg-red-500/90';
    const textColor = isMainPage ? 'text-black' : 'text-black';
    
    notification.className = `fixed bottom-4 right-4 ${bgColor} ${textColor} px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 translate-y-20 opacity-0`;
    notification.innerHTML = `
        <div class="flex items-center gap-2">
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
            <span class="font-semibold">${message}</span>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.remove('translate-y-20', 'opacity-0');
    }, 100);
    setTimeout(() => {
        notification.classList.add('translate-y-20', 'opacity-0');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Función para proceder al pago
function checkout() {
    if (cart.length === 0) {
        showNotification('El carrito está vacío', 'warning');
        return;
    }

    // Simular proceso de pago
    setTimeout(() => {
        showNotification('¡Pago realizado correctamente!');
        cart = [];
        saveCart();
        updateCartCount();
        updateCartContent();
    }, 1000);
}

// Inicializar carrito
loadCart();

// Función para obtener el jugador de la URL
function getPlayerFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('player') || 'rin';
}

// Función para actualizar el contenido de la tienda según el jugador
function updateStoreContent() {
    const player = getPlayerFromUrl();
    const config = playerConfigs[player];
    
    if (!config) return;

    // Actualizar título y color del tema
    document.documentElement.style.setProperty('--player-color', config.color);
    document.title = `${config.name} Store - Bluelock`;

    // Actualizar contenido dinámico
    const storeTitle = document.querySelector('.store-title');
    if (storeTitle) {
        storeTitle.textContent = `${config.name} Store`;
        storeTitle.style.color = config.color;
    }

    // Actualizar imagen del producto
    const productImage = document.querySelector('.product-image');
    if (productImage) {
        productImage.src = config.image;
        productImage.alt = `${config.name} Equipación`;
    }

    // Configurar botones de "Añadir al Carrito"
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        const productInfo = {
            name: button.dataset.name || 'Producto',
            price: parseFloat(button.dataset.price || 0),
            image: config.image,
            description: button.dataset.description || 'Descripción no disponible'
        };

        button.onclick = () => addToCart(productInfo);
    });
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    updateStoreContent();
    updateCartCount();
    updateCartContent();

    // Manejar la visibilidad del carrito
    const cartIcon = document.querySelector('.cart-icon');
    const cartPreview = document.querySelector('.cart-preview');
    let isCartVisible = false;

    if (cartIcon && cartPreview) {
        cartIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            isCartVisible = !isCartVisible;
            cartPreview.classList.toggle('hidden', !isCartVisible);
            if (isCartVisible) {
                cartPreview.classList.add('scale-100');
            } else {
                cartPreview.classList.remove('scale-100');
            }
        });

        // Cerrar el carrito cuando se hace click fuera
        document.addEventListener('click', (e) => {
            if (isCartVisible && !cartPreview.contains(e.target) && !cartIcon.contains(e.target)) {
                isCartVisible = false;
                cartPreview.classList.add('hidden');
                cartPreview.classList.remove('scale-100');
            }
        });

        // Evitar que el carrito se cierre al hacer click dentro
        cartPreview.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Agregar elementos de energía a cada contenedor
    document.querySelectorAll('.character-container').forEach(container => {
        const energyOrbs = document.createElement('div');
        energyOrbs.className = 'energy-orbs';
        container.appendChild(energyOrbs);

        // Seguimiento del mouse para el efecto de aura
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            container.style.setProperty('--x', `${x}%`);
            container.style.setProperty('--y', `${y}%`);
        });
    });
});
