const productsPage = document.getElementById("productsPage");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const pageNumbersContainer = document.getElementById("page-numbers");
let products = [];

let currentPage = 1;
const productsPerPage = 3;
let totalProducts = 0;

// Fetch products from the API
async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) throw new Error("Failed to fetch products.");
    products = await response.json();
    totalProducts = products.length;
    displayProducts();
    updatePaginationControls();
  } catch (error) {
    console.error(error);
    productsPage.innerHTML = "<p>Error loading products. Please try again later.</p>";
  }
}

// Display products in a grid
function displayProducts() {
  productsPage.innerHTML = "";

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = Math.min(startIndex + productsPerPage, totalProducts);
  const pageProducts = products.slice(startIndex, endIndex);

  pageProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card col-md-4 mb-4";

    let shortDescription;
    if (product.description.length > 100) {
      shortDescription = product.description.substring(0, 100) + "...";
    } else {
      shortDescription = product.description;
    }

    const knowMoreButton = document.createElement("button");
    knowMoreButton.classList.add("know-more-btn");
    knowMoreButton.textContent = "Know More";
    knowMoreButton.addEventListener("click", function () {
      window.location.href = `detail.html?id=${product.id}`;
    });

    card.innerHTML = `
      <img src="${product.image}" alt="${product.image}">
      <h5>${product.title}</h5>
      <p class="short-desc">${shortDescription}</p>
      <p>$${product.price}</p>
    `;
    card.appendChild(knowMoreButton);
    productsPage.appendChild(card);
  });

  updateCartCount();
}

// Update pagination controls
function updatePaginationControls() {
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;

  const visiblePages = generatePageNumbers(totalPages);
  pageNumbersContainer.innerHTML = "";

visiblePages.forEach(page => {
  const span = document.createElement("span"); 
  span.textContent = page;

  if (page === "...") {
    span.classList.add("ellipsis"); 
  } else {
    span.classList.add("page-number"); 
    span.dataset.page = page; 
    if (page === currentPage) {
      span.classList.add("active");
    }
  }
  pageNumbersContainer.appendChild(span);
});

  document.querySelectorAll(".page-number").forEach(el =>
    el.addEventListener("click", event => {
      currentPage = Number(event.target.getAttribute("data-page"));
      displayProducts();
      updatePaginationControls();
    })
  );
}

// Generate page numbers with ellipsis
function generatePageNumbers(totalPages) {
  const maxPagesToShow = 5;
  const pages = [];

  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage, "...", totalPages);
    }
  }
  return pages;
}

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayProducts();
    updatePaginationControls();
  }
});

nextButton.addEventListener("click", () => {
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayProducts();
    updatePaginationControls();
  }
});

fetchProducts();

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
