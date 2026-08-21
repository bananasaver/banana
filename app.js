const categories = [
  ["Kitchen Tech", "KT", "Kitchen tech deals"],
  ["Home Tech", "HT", "Smart home and home tech"],
  ["Office Tech", "OT", "Office and productivity tech"],
  ["Gaming", "GM", "Gaming deals"]
];

let allDeals = [];
let activeCategory = "All";

const categoriesEl = document.getElementById("categories");
const grid = document.getElementById("dealGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearSearch = document.getElementById("clearSearch");
const noResults = document.getElementById("noResults");

function categoryIcon(code) {
  const icons = {
    KT: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v14H5z"></path><path d="M8 9h8M8 12h8M8 15h5"></path></svg>',
    HT: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-7 9 7v9H3z"></path><path d="M9 20v-6h6v6"></path></svg>',
    OT: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="11" rx="1"></rect><path d="M8 20h8M12 16v4"></path></svg>',
    GM: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9h10a4 4 0 0 1 4 4l-1 5a2 2 0 0 1-3.5.8L14 16H10l-2.5 2.8A2 2 0 0 1 4 18l-1-5a4 4 0 0 1 4-4z"></path><path d="M7 12v4M5 14h4M16.5 13h.01M19 15h.01"></path></svg>'
  };
  return icons[code] || icons.HT;
}

function renderCategories() {
  categoriesEl.innerHTML = categories.map(([name, code, description]) => `
    <button class="category ${activeCategory === name ? "active" : ""}" data-category="${name}" aria-label="${description}">
      <span class="icon">${categoryIcon(code)}</span><span>${name}</span>
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
