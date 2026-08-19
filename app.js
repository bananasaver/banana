const categories = [
  ["Gaming", "🎮"],
  ["Laptops", "💻"],
  ["PC Components", "🖥️"],
  ["Monitors", "🖵"],
  ["Phones", "📱"],
  ["Headphones", "🎧"],
  ["Accessories", "⌨️"],
  ["Smart Home", "🏠"]
];

let allDeals = [];
let activeCategory = "All";

const categoriesEl = document.getElementById("categories");
const grid = document.getElementById("dealGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearSearch = document.getElementById("clearSearch");
const noResults = document.getElementById("noResults");

function renderCategories() {
  categoriesEl.innerHTML = categories.map(([name, icon]) => `
    <button class="category ${activeCategory === name ? "active" : ""}" data-category="${name}">
      <span class="icon">${icon}</span><span>${name}</span>
    </button>
  `).join("");

  categoriesEl.querySelectorAll(".category").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.category;
      renderCategories();
      filterDeals();
      document.getElementById("deals").scrollIntoView({behavior:"smooth", block:"start"});
    });
  });
}

function savingPercent(deal) {
  return Math.round(((deal.oldPrice - deal.price) / deal.oldPrice) * 100);
}

function renderDeals(deals) {
  grid.innerHTML = deals.map(deal => `
    <article class="deal-card">
      <span class="badge ${deal.badgeClass}">${deal.badge}</span>
      <div class="product-image">
        <img src="${deal.image}" alt="${deal.name}" loading="lazy">
      </div>
      <h3>${deal.name}</h3>
      <div class="subtitle">${deal.subtitle}</div>
      <div class="price">£${deal.price.toFixed(2)} <span class="old-price">£${deal.oldPrice.toFixed(2)}</span></div>
      <div class="saving">Save £${(deal.oldPrice - deal.price).toFixed(2)} (${savingPercent(deal)}%)</div>
      <div class="card-bottom">
        <span class="retailer">${deal.retailer}</span>
        <a class="view-deal" href="${deal.url}" target="_blank" rel="noopener">View Deal</a>
      </div>
    </article>
  `).join("");

  noResults.hidden = deals.length !== 0;
}

function filterDeals() {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = allDeals.filter(deal => {
    const matchesCategory = activeCategory === "All" || deal.category === activeCategory;
    const searchable = `${deal.name} ${deal.subtitle} ${deal.category} ${deal.retailer}`.toLowerCase();
    return matchesCategory && searchable.includes(term);
  });
  renderDeals(filtered);
}

async function loadDeals() {
  try {
    const response = await fetch("deals.json");
    allDeals = await response.json();
    renderCategories();
    renderDeals(allDeals);
  } catch (error) {
    grid.innerHTML = "<p>Deals could not be loaded yet.</p>";
  }
}

searchBtn.addEventListener("click", filterDeals);
searchInput.addEventListener("input", filterDeals);
clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  activeCategory = "All";
  renderCategories();
  renderDeals(allDeals);
});

loadDeals();
