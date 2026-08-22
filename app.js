const categories = [
  ["Gaming", "gaming", "Gaming deals"],
  ["Computing", "computing", "Computing and laptop deals"],
  ["Phones & Wearables", "phones", "Phones, smartwatches and wearable tech"],
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
      <svg viewBox="0 0 120 82" aria-hidden="true">
        <path d="M28 27c6-10 17-14 32-14s26 4 32 14l10 28c2 7-3 14-10 14-5 0-8-3-12-9l-5-7H45l-5 7c-4 6-7 9-12 9-7 0-12-7-10-14z" fill="#151515"/>
        <path d="M38 36h16M46 28v16" stroke="#ffd400" stroke-width="4" stroke-linecap="round"/>
        <circle cx="79" cy="31" r="4" fill="#ff4b55"/>
        <circle cx="89" cy="38" r="4" fill="#4b8cff"/>
        <circle cx="79" cy="45" r="4" fill="#ffd400"/>
        <circle cx="69" cy="38" r="4" fill="#69c96b"/>
        <circle cx="61" cy="53" r="6" fill="#343434"/>
        <circle cx="61" cy="53" r="3" fill="#777"/>
        <circle cx="78" cy="53" r="6" fill="#343434"/>
        <circle cx="78" cy="53" r="3" fill="#777"/>
        <rect x="55" y="28" width="10" height="4" rx="2" fill="#333"/>
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
        <path d="M27 39V30c0-14 10-23 23-23s23 9 23 23v9" fill="none" stroke="#111" stroke-width="7" stroke-linecap="round"/>
        <rect x="19" y="34" width="15" height="24" rx="6" fill="#111"/>
        <rect x="66" y="34" width="15" height="24" rx="6" fill="#111"/>
        <path d="M43 28h14v20H43z" fill="#ffd400"/>
      </svg>`,
    home: `
      <svg viewBox="0 0 100 72" aria-hidden="true">
        <path d="M13 33 50 8l37 25" fill="none" stroke="#111" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="23" y="31" width="54" height="31" rx="4" fill="#111"/>
        <rect x="31" y="38" width="38" height="17" rx="3" fill="#ffd400"/>
        <circle cx="39" cy="47" r="3" fill="#111"/><circle cx="61" cy="47" r="3" fill="#111"/>
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
