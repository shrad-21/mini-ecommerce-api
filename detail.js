const detailsPage = document.getElementById("detailsPage");
const productTitle = document.getElementById("productTitle");
const productImage = document.getElementById("productImage");
const productDescription = document.getElementById("productDescription");
const productPrice = document.getElementById("productPrice");
const addToCartButton = document.getElementById("addToCartButton");
const quantityControls = document.querySelector(".quantity-controls");
const productQuantity = document.getElementById("productQuantity");
const errorMessageElement = document.getElementById("error-message");

let cart = [];
 
// Load cart from localStorage
const cartString = localStorage.getItem("cart");
if (cartString) {
  try {
    cart = JSON.parse(cartString);
  } catch (e) {
    console.error("Error while parsing the cart", e);
  }
}

// Update the cart count in the header
function updateCartCount() {
  const cartString = localStorage.getItem("cart");
  let count = 0;
  if (cartString) {
    const cart = JSON.parse(cartString);
    cart.forEach((product) => {
      count += product.quantity;
    });

    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
      cartCountElement.textContent = count;
    }
  }
}

// Fetch product details by ID
async function fetchProductDetails(id) {
  const response = await fetch(`https://fakestoreapi.com/products/${id}`);
  const product = await response.json();

  productTitle.textContent = product.title;
  productImage.src = product.image;
  productPrice.textContent = `$${product.price}`;
  productDescription.textContent = product.description;

  let productId = parseInt(id);
  let existingProduct = cart.find((item) => item.id === productId);

  if (existingProduct) {
    addToCartButton.style.display = "none";
    quantityControls.style.display = "flex";
    productQuantity.textContent = `Quantity: ${existingProduct.quantity}`;
  } else {
    addToCartButton.style.display = "inline-block";
    quantityControls.style.display = "none";
    productQuantity.textContent = "Quantity: 1";
  }

  addToCartButton.addEventListener("click", function() {
    addToCart(product);
  });

  document.getElementById("increaseButton").addEventListener("click", function() {
    changeQuantity(product.id, 1);
  });

  document.getElementById("decreaseButton").addEventListener("click", function() {
    changeQuantity(product.id, -1);
  });
}

// Add a product to the cart
function addToCart(product) {
  let existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    if (existingProduct.quantity < 4) { // quantity to a maximum of 4
      existingProduct.quantity++;
      updateBtn(existingProduct);
    } else {
      showErrorMessage("You cannot add more than 4 of this item.");
    }
  } else {
    product.quantity = 1;
    cart.push(product);
    updateBtn(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Change the quantity of a product in the cart
function changeQuantity(productId, amount) {
  let existingProduct = cart.find((item) => item.id === productId);

  if (existingProduct) {
    const newQuantity = existingProduct.quantity + amount;

    if (newQuantity > 4) {
      showErrorMessage("You cannot add more than 4 of this item.");
    } else if (newQuantity <= 0) {
      cart = cart.filter((item) => item.id !== productId);
      addToCartButton.style.display = "inline-block";
      quantityControls.style.display = "none";
    } else {
      existingProduct.quantity = newQuantity;
      updateBtn(existingProduct);
      clearErrorMessage();
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }
}

// Show error message
function showErrorMessage(message) {
  errorMessageElement.style.display = "block";
  errorMessageElement.textContent = message;
}

// Clear error message
function clearErrorMessage() {
  errorMessageElement.style.display = "none";
  errorMessageElement.textContent = "";
}

// Update the UI to reflect the current state of the cart
function updateBtn(product) {
  if (product && product.quantity > 0) {
    addToCartButton.style.display = "none";
    quantityControls.style.display = "flex";
    productQuantity.textContent = `Quantity: ${product.quantity}`;
  } else {
    addToCartButton.style.display = "inline-block";
    quantityControls.style.display = "none";
  }
}

// Get product ID from the URL and fetch details
const urlParameter = new URLSearchParams(window.location.search);
const productId = urlParameter.get("id");
if (productId) {
  fetchProductDetails(productId);
}

// Back button functionality
const backButton = document.getElementById("backButton");
backButton.addEventListener("click", function () {
  window.location.href = "index.html";
});

// Initial update of the cart count
updateCartCount();
