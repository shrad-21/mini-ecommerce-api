let proceedToPayButton = document.getElementById("proceed-to-pay");
let addressTab = document.getElementById("addressTab");
let cartPage = document.getElementById("cartPage");
let summaryTab = document.getElementById("summaryTab");
let errorMessageElement = document.getElementById("error-message");
// to display cart items on cart page

let cart = [];
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

async function fetchProductData() {
  try {
    const response = await fetch("https://fakestoreapi.com/products"); // Replace with your actual API
    if (!response.ok) {
      throw new Error("Failed to fetch products.");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function displayCartProducts() {
  const cartContainer = document.getElementById("cartPage");
  const cartString = localStorage.getItem("cart");
  const proceedToPayButton = document.getElementById("proceed-to-pay");
  
  if (cartString) {
    cart = JSON.parse(cartString);
  }

  // if cart is empty --> show msg
  if (cart.length === 0) {
    cartContainer.innerHTML = "<h5>Your Cart is empty!<h5>";
    if (proceedToPayButton) {
      proceedToPayButton.style.display = "none";
    }
  } else {
    cartContainer.innerHTML = "";
    let totalPrice = 0;
    let totalItems = 0;

    cart.forEach((product, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

      const productTotalPrice = product.price * product.quantity;
      totalPrice += productTotalPrice; // Accumulate total price
      totalItems += product.quantity;

      cartItem.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <p>Price: $${product.price}</p>     
                <div class="controlQuantity" >
                <button class="decreaseBtn" onclick="changeQuantity(${index},-1)"> - </button>
                <p>Quantity: ${product.quantity}</p>
                <button class="increaseBtn" onclick="changeQuantity(${index},1)"> + </button>
                </div>

                <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>  
            `;
      cartContainer.appendChild(cartItem);
    });

    const totalElement = document.createElement("div");
    totalElement.classList.add("totalPrice");
    totalElement.innerHTML = `
            <h3>Total Price: $${totalPrice.toFixed(2)}</h3>
            <h3>Total Items: ${totalItems}</h3>
        `;
    cartContainer.appendChild(totalElement);
    if (proceedToPayButton) {
      proceedToPayButton.style.display = "block";
    }
  }
}

proceedToPayButton.addEventListener("click", () => {
  cartPage.style.display = "none";
  addressTab.style.display = "block";
  proceedToPayButton.style.display = "none";
  errorMessageElement.style.display="none";
});
displayCartProducts();


let summaryButton = document.getElementById("summary-button");

function changeQuantity(index, amount) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (index < 0 || index >= cart.length) {
    console.error(`Invalid index: ${index}`);
    return;
  }

  const product = cart[index];

  const newQuantity = product.quantity + amount;
  if (newQuantity <= 4 && newQuantity >= 1) {
    product.quantity = newQuantity;
    clearErrorMessage(); // Clear error message if quantity is valid
    // saveCart();
  } else if (newQuantity === 0) {
    removeFromCart(index);
    clearErrorMessage();
    return;
  } else {
    showErrorMessage("Quantity cannot exceed 4");
    return;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  console.log("cart updated");
  displayCartProducts();
  updateCartCount();
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (index < 0 || index >= cart.length) {
    console.error(`Invalid index: ${index}`);
    return;
  }

  cart.splice(index, 1); // Remove the product at the specified index
  localStorage.setItem("cart", JSON.stringify(cart));
  console.log("Product removed. Updated Cart:", cart);
  displayCartProducts();
  updateCartCount();
}

// Show error message
function showErrorMessage(message) {
  const errorMessageElement = document.getElementById("error-message");
  errorMessageElement.style.display = "block";
  errorMessageElement.textContent = message;
}

// Clear error message
function clearErrorMessage() {
  const errorMessageElement = document.getElementById("error-message");
  errorMessageElement.style.display = "none";
  errorMessageElement.textContent = "";
}

displayCartProducts();
updateCartCount();

// Populate state and city dropdowns
const cities = {
  Karnataka: ["Bengaluru", "Mysuru", "Hubli"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
};

const stateDropDown = document.getElementById("state");
const cityDropDown = document.getElementById("city");

Object.keys(cities).forEach(function (state) {
  const option = document.createElement("option");
  option.value = state;
  option.textContent = state;
  stateDropDown.appendChild(option);
});

cityDropDown.disabled = true;

stateDropDown.addEventListener("change", function () {
  const state = this.value;

  cityDropDown.innerHTML = '<option value="">Select City</option>';

  if (state && cities[state]) {
    cityDropDown.disabled = false;

    // Populate city options
    cities[state].forEach(function (city) {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      cityDropDown.appendChild(option);
    });
  } else {
    cityDropDown.disabled = true;
  }
});

summaryButton.addEventListener("click", (event) => {
  event.preventDefault();

  let isValid = true;

  // Clear all error messages
  document.getElementById("name-error").innerHTML = "";
  document.getElementById("state-error").innerHTML = "";
  document.getElementById("city-error").innerHTML = "";
  document.getElementById("pincode-error").innerHTML = "";
  document.getElementById("address1-error").innerHTML = "";
  document.getElementById("address2-error").innerHTML = "";
  document.getElementById("address3-error").innerHTML = "";
  document.getElementById("contact-error").innerHTML = "";

  // Validate name selection
  const name = document.getElementById("name").value;
  const nameErrorElement = document.getElementById("name-error");
  const nameRegrex= /^[A-Za-z]+( [A-Za-z]+)*$/;
  if (!name) {
    nameErrorElement.innerHTML = "Name is required.";
    isValid = false;
  }
  else if(!nameRegrex.test(name)){
    nameErrorElement.innerHTML="Special characters are not allowed."
    isValid=false;
  }

  // Validate state selection
  const state = stateDropDown.value;
  if (!state) {
    document.getElementById("state-error").innerHTML = "Please select a state.";
    isValid = false;
  }

  // Validate city selection
  const city = cityDropDown.value;
  if (state && !city) {
    document.getElementById("city-error").innerHTML = "Please select a city.";
    isValid = false;
  }

  // Validate pincode
  const pincode = document.getElementById("pincode").value.trim();
  const pincodeErrorElement = document.getElementById("pincode-error");
  if (!pincode) {
    pincodeErrorElement.innerHTML = "Pincode is required.";
    isValid = false;
  } else if (!/^\d{6}$/.test(pincode)) {
    pincodeErrorElement.innerHTML = "Pincode must be exactly 6 digits.";
    isValid = false;
  } else if (pincode === "000000") {
    pincodeErrorElement.innerHTML = "Pincode cannot be all zeros.";
    isValid = false;
  }

  // Validate address fields
  const addressLine1 = document.getElementById("address1").value.trim();
  const addressLine2 = document.getElementById("address2").value.trim();
  const addressLine3 = document.getElementById("address3").value.trim();

    if (!addressLine1) {
      document.getElementById("address1-error").innerHTML = "Address line 1 is required.";
      isValid = false;
    }
    if (!addressLine2) {
      document.getElementById("address2-error").innerHTML = "Address line 2 is required.";
      isValid = false;
    }
    if (!addressLine3) {
      document.getElementById("address3-error").innerHTML = "Address line 3 is required.";
      isValid = false;
    }
  
    // Validate contact number
    const contactNumber = document.getElementById("contact").value.trim();
    if (!contactNumber) {
      document.getElementById("contact-error").innerHTML = "Contact number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(contactNumber)) {
      document.getElementById("contact-error").innerHTML = "Contact number must be exactly 10 digits.";
      isValid = false;
    }
  
    // If form is not valid, prevent navigating to the summary tab
    if (!isValid) {
      return;
    }
  
    // If validation passes, switch to the summary tab
    addressTab.style.display = "none";
    summaryButton.style.display = "none";
    summaryTab.style.display = "block";
    
  
    // Populate the order summary
    displaySummary();
  });
  
  const summaryCartContainer = document.getElementById("summary-cart");
const summaryAddressContainer = document.getElementById("summary-address");

function displaySummary() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  summaryCartContainer.innerHTML = ""; // Clear previous summary
  summaryAddressContainer.innerHTML = ""; // Clear previous address

  if (cart.length === 0) {
    summaryCartContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  // Display cart items
  let totalPrice = 0;
  cart.forEach((product) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("summary-cart-item");

    const productTotalPrice = product.price * product.quantity;
    totalPrice += productTotalPrice;

    cartItem.innerHTML = `
      <div class="summary-cart-details">
        <h3>${product.title}</h3>
        <p>Price: $${product.price}</p>
        <p>Quantity: ${product.quantity}</p>
        <p>Total: $${productTotalPrice.toFixed(2)}</p>
        
      </div>
    `;
    summaryCartContainer.appendChild(cartItem);
  });

  // Display total price
  const totalElement = document.createElement("div");
  totalElement.classList.add("summary-total");
  totalElement.innerHTML = `
    <h3>Total Price: $${totalPrice.toFixed(2)}</h3>
  `;
  summaryCartContainer.appendChild(totalElement);

  // Display address summary
  const name=document.getElementById("name").value;
  const state = document.getElementById("state").value;
  const city = document.getElementById("city").value;
  const pincode = document.getElementById("pincode").value.trim();
  const addressLine1 = document.getElementById("address1").value.trim();
  const addressLine2 = document.getElementById("address2").value.trim();
  const addressLine3 = document.getElementById("address3").value.trim();
  const contactNumber = document.getElementById("contact").value.trim();

  summaryAddressContainer.innerHTML = `
  <h2>Delivering to ${name}</h2>
    <h3>Shipping Address</h3>
    <p>${addressLine1}, ${addressLine2}, ${addressLine3}</p>
    <p>${city}, ${state} - ${pincode}</p>
    <p>Contact: ${contactNumber}</p>
  `;
}

function showPopup() {
  // Show the popup
  document.getElementById("orderPopup").style.display = "flex";

  // Redirect to index.html after 2 seconds
  setTimeout(redirectToHome, 2000);
}

function redirectToHome() {
  window.location.href = "index.html";
}
