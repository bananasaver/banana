const categories = [
  ["Gaming", "gaming", "Gaming deals"],
  ["Computing", "computing", "Computing and laptop deals"],
  ["Mobile & Wearables", "phones", "Phones, tablets, smartwatches and wearable tech"],
  ["Sound & Vision", "sound", "Headphones, TVs, speakers and more"],
  ["Home & Smart Tech", "home", "Smart appliances and home technology"]
];


let allDeals = [];
let activeCategory = "All";

const categoriesEl = document.getElementById("categories");
const grid = document.getElementById("dealGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearSearch = document.getElementById("clearSearch");
const noResults = document.getElementById("noResults");

function categoryIcon(type) {
  const icons = {
    gaming: `
      <svg viewBox="0 0 100 72" aria-hidden="true">
        <rect x="19" y="17" width="62" height="40" rx="17" fill="#111"/>
        <path d="M34 36h12M40 30v12" stroke="#ffd400" stroke-width="4" stroke-linecap="round"/>
        <circle cx="65" cy="31" r="4" fill="#ffd400"/>
        <circle cx="73" cy="39" r="4" fill="#ffd400"/>
        <path d="M25 51 18 61M75 51l7 10" stroke="#111" stroke-width="5" stroke-linecap="round"/>
      </svg>`,
    computing: `
      <svg viewBox="0 0 100 72" aria-hidden="true">
        <rect x="20" y="10" width="60" height="40" rx="4" fill="#222"/>
        <rect x="25" y="15" width="50" height="30" rx="2" fill="#e9f4ff"/>
        <path d="M12 55h76l-7 7H19z" fill="#111"/>
        <path d="M45 55h10" stroke="#ffd400" stroke-width="3" stroke-linecap="round"/>
      </svg>`,
    phones: `
      <svg viewBox="0 0 100 72" aria-hidden="true">
        <rect x="27" y="8" width="31" height="56" rx="6" fill="#111"/>
        <rect x="31" y="14" width="23" height="43" rx="3" fill="#e9f4ff"/>
        <circle cx="42.5" cy="60" r="1.8" fill="#ffd400"/>
        <circle cx="73" cy="36" r="19" fill="#111"/>
        <circle cx="73" cy="36" r="14" fill="#e9f4ff"/>
        <path d="M73 24v12l8 6" stroke="#ffd400" stroke-width="3" fill="none" stroke-linecap="round"/>
      </svg>`,
    sound: `
      <svg viewBox="0 0 100 72" aria-hidden="true">
        <rect x="18" y="10" width="64" height="45" rx="5" fill="#111"/>
        <rect x="23" y="15" width="54" height="35" rx="3" fill="#e9f4ff"/>
        <path d="M31 60h38" stroke="#111" stroke-width="6" stroke-linecap="round"/>
        <path d="M29 33v-4c0-9 7-15 15-15s15 6 15 15v4" fill="none" stroke="#ffd400" stroke-width="5" stroke-linecap="round"/>
        <rect x="24" y="30" width="10" height="18" rx="4" fill="#ffd400"/>
        <rect x="56" y="30" width="10" height="18" rx="4" fill="#ffd400"/>
      </svg>`,
    home: `
      <svg viewBox="0 0 100 72" aria-hidden="true">
        <path d="M13 33 50 8l37 25" fill="none" stroke="#111" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="23" y="31" width="54" height="31" rx="4" fill="#111"/>
        <rect x="31" y="38" width="38" height="17" rx="3" fill="#ffd400"/>
        <circle cx="39" cy="47" r="3" fill="#111"/><circle cx="61" cy="47" r="3" fill="#111"/>
        <path d="M73 19c4-4 10-4 14 0M76 23c2-2 6-2 8 0" fill="none" stroke="#ffd400" stroke-width="3" stroke-linecap="round"/>
      </svg>`
  };
  return icons[type];
}


function renderCategories() {
  categoriesEl.innerHTML = categories.map(([name, type, description]) => `
    <button class="category ${activeCategory === name ? "active" : ""}" data-category="${name}" aria-label="${description}">
      <span class="category-art">${categoryIcon(type)}</span>
      <span class="category-name">${name}</span>
    </button>
  `).join("") + `
    <button class="category-arrow" aria-label="View all categories" title="View all categories"><span>→</span></button>
  `;

  categoriesEl.querySelectorAll(".category").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.category;
      renderCategories();
      filterDeals();
      document.getElementById("deals").scrollIntoView({behavior:"smooth", block:"start"});
    });
  });

  categoriesEl.querySelector(".category-arrow")?.addEventListener("click", () => {
    activeCategory = "All";
    searchInput.value = "";
    renderCategories();
    renderDeals(allDeals);
    document.getElementById("deals").scrollIntoView({behavior:"smooth", block:"start"});
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
