// Sample product data
const products = [
    {
        id: 1,
        name: 'Lassi ke Andar Chullu Bhar Izzat',
        price: 99.99,
        image: 'public/product-1.jpeg',
        description: "Thand lassi, chullu bhar izzat. Ek ghoont, ani ego full ghaayab. Roast nantar serve karaychi asli item"
    },
    {
        id: 2,
        name: 'LassiLover 69 – Gaay ke Aashiq Edition',
        price: 699.99,
        image: 'public/product-2.jpeg',
        description: "Special edition for those who’d date a cow if legally possible."
    },
    {
        id: 3,
        name: 'Doodh Bass Booster 3000',
        price: 1299.99,
        image: 'public/product-3.jpeg',
        description: "Full doodh, full bass – body madhe fatkana vibration!"
    },
    {
        id: 4,
        name: 'Moo Moo Speaker',
        price: 199.99,
        image: 'public/product-4.jpeg',
        description: 'Moo madhe melody, volume madhe gaand fatel!'
    },
    {
        id: 5,
        name: 'TattiPhone Se Upar',
        price: 499.99,
        image: 'public/product-5.jpeg',
        description: "Phone cha camera zhopayla gela. Ha 4K madhe izzat uchalto, ani night mode madhe ch****a suddha disto!"
    },
    {
        id: 6,
        name: 'MooBaba GhaasGrazer Ultra',
        price: 79.99,
        image: 'public/product-7.jpeg',
        description: 'Turns every user into a cow... spiritually.'
    },
    {
        id: 7,
        name: 'BC Lite – Bina Context ke Gaali Machine',
        price: 349.99,
        image: 'public/product-6.jpeg',
        description: 'Press one button = automatic roasting begins.'
    },
    {
        id: 8,
        name: 'HavaChod Ultra Max 9000 – Bakaiti Se Bhara Hua',
        price: 399.99,
        image: 'public/product-8.jpeg',
        description: 'Bolto khup, karto kahi nahi. Fukta hava chodto'
    }
];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElement = document.getElementById('cart-count');
const cartTotalElement = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');
const contactForm = document.getElementById('contact-form');

// Cart array
let cart = [];

// Initialize the application
function init() {
    // Display products
    displayProducts();
    
    // Load cart from localStorage
    loadCart();
    
    // Update cart UI
    updateCartUI();
    
    // Event listeners
    cartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    checkoutBtn.addEventListener('click', checkout);
    clearCartBtn.addEventListener('click', clearCart);
    
    // Add event listener for featured product
    const featuredAddToCartBtn = document.querySelector('.featured-add-to-cart');
    if (featuredAddToCartBtn) {
        featuredAddToCartBtn.addEventListener('click', addFeaturedToCart);
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

// Display products in the product grid
function displayProducts() {
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to Add to Cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Toggle cart modal
function toggleCart() {
    cartModal.classList.toggle('open');
}

// Add product to cart
function addToCart(event) {
    const productId = parseInt(event.target.dataset.id);
    const product = products.find(product => product.id === productId);
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Increase quantity
        existingItem.quantity++;
    } else {
        // Add new item to cart
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart UI
    updateCartUI();
    
    // Show cart modal
    cartModal.classList.add('open');
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = cartCount;
    
    // Update cart items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Add event listeners to quantity buttons and remove buttons
        const decreaseButtons = document.querySelectorAll('.decrease');
        const increaseButtons = document.querySelectorAll('.increase');
        const removeButtons = document.querySelectorAll('.remove-item');
        
        decreaseButtons.forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });
        
        increaseButtons.forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
        
        removeButtons.forEach(button => {
            button.addEventListener('click', removeItem);
        });
    }
    
    // Update cart total
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
}

// Decrease item quantity
function decreaseQuantity(event) {
    const productId = parseInt(event.target.dataset.id);
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity--;
    } else {
        // Remove item if quantity is 1
        removeItem(event);
        return;
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart UI
    updateCartUI();
}

// Increase item quantity
function increaseQuantity(event) {
    const productId = parseInt(event.target.dataset.id);
    const item = cart.find(item => item.id === productId);
    
    item.quantity++;
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart UI
    updateCartUI();
}

// Remove item from cart
function removeItem(event) {
    const productId = parseInt(event.target.dataset.id);
    cart = cart.filter(item => item.id !== productId);
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart UI
    updateCartUI();
}

// Clear cart
function clearCart() {
    cart = [];
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart UI
    updateCartUI();
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    alert('Thank you for your purchase! Your order has been placed.');
    
    // Clear cart
    clearCart();
    
    // Close cart modal
    cartModal.classList.remove('open');
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Handle contact form submission
function handleContactForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    alert(`Thank you for your message, ${name}! We will get back to you soon.`);
    
    // Reset form
    contactForm.reset();
}

// Add featured product to cart
function addFeaturedToCart() {
    const featuredProduct = {
        id: 'special',
        name: 'Premium Offer',
        price: 69.69,
        image: 'public/special-product.jpeg',
        quantity: 1
    };
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === featuredProduct.id);
    
    if (existingItem) {
        // Increase quantity
        existingItem.quantity++;
    } else {
        // Add new item to cart
        cart.push(featuredProduct);
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart UI
    updateCartUI();
    
    // Show cart modal
    cartModal.classList.add('open');
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
