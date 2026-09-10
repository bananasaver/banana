const categories = [
  ["Gaming", "gaming", "Gaming deals", "gaming.html"],
  ["Computing", "computing", "Computing, laptop and monitor deals", "computing.html"],
  ["Phones", "phones", "Phone deals", "phones.html"],
  ["Wearables", "wearables", "Smartwatch and wearable tech deals", "wearables.html"],
  ["Sound & Vision", "sound", "TVs, headphones, speakers and more", "sound-vision.html"],
  ["Home & Smart Tech", "home", "Smart appliances and connected home technology", "home-smart-tech.html"]
];

let allDeals = [];
let categoriesEl;
let grid;
let searchInput;
let searchBtn;
let clearSearch;
let noResults;

async function loadSiteComponents() {
  const mounts = [
    ["site-header", "components/header.html"],
    ["site-footer", "components/footer.html"]
  ];
  await Promise.all(mounts.map(async ([id, url]) => {
    const mount = document.getElementById(id);
    if (!mount) return;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      mount.innerHTML = await response.text();
    } catch (error) {
      console.error(`Could not load ${url}`, error);
    }
  }));
}

function bindPageElements() {
  categoriesEl = document.getElementById("categories");
  grid = document.getElementById("dealGrid");
  searchInput = document.getElementById("searchInput") || document.getElementById("siteSearch");
  searchBtn = document.getElementById("searchBtn") || document.getElementById("siteSearchButton");
  clearSearch = document.getElementById("clearSearch");
  noResults = document.getElementById("noResults");
}

function categoryIcon(type) {
  const icons = {
    gaming: `<svg viewBox="0 0 120 82" aria-hidden="true"><path d="M28 27c6-10 17-14 32-14s26 4 32 14l10 28c2 7-3 14-10 14-5 0-8-3-12-9l-5-7H45l-5 7c-4 6-7 9-12 9-7 0-12-7-10-14z" fill="#151515"/><path d="M38 36h16M46 28v16" stroke="#ffd400" stroke-width="4" stroke-linecap="round"/><circle cx="79" cy="31" r="4" fill="#ff4b55"/><circle cx="89" cy="38" r="4" fill="#4b8cff"/><circle cx="79" cy="45" r="4" fill="#ffd400"/><circle cx="69" cy="38" r="4" fill="#69c96b"/></svg>`,
    computing: `<svg viewBox="0 0 100 72" aria-hidden="true"><rect x="20" y="10" width="60" height="40" rx="4" fill="#222"/><rect x="25" y="15" width="50" height="30" rx="2" fill="#e9f4ff"/><path d="M12 55h76l-7 7H19z" fill="#111"/><path d="M45 55h10" stroke="#ffd400" stroke-width="3" stroke-linecap="round"/></svg>`,
    phones: `<svg viewBox="0 0 100 72" aria-hidden="true"><rect x="31" y="6" width="38" height="60" rx="7" fill="#111"/><rect x="35" y="12" width="30" height="48" rx="3" fill="#e9f4ff"/><circle cx="50" cy="62" r="2" fill="#ffd400"/></svg>`,
    wearables: `<svg viewBox="0 0 100 72" aria-hidden="true"><rect x="38" y="8" width="24" height="56" rx="8" fill="#111"/><rect x="34" y="18" width="32" height="36" rx="8" fill="#111"/><rect x="40" y="24" width="20" height="24" rx="4" fill="#e9f4ff"/><path d="M50 29v7l5 3" stroke="#ffd400" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
    sound: `<svg viewBox="0 0 100 72" aria-hidden="true"><path d="M27 39V30c0-14 10-23 23-23s23 9 23 23v9" fill="none" stroke="#111" stroke-width="7" stroke-linecap="round"/><rect x="19" y="34" width="15" height="24" rx="6" fill="#111"/><rect x="66" y="34" width="15" height="24" rx="6" fill="#111"/><path d="M43 28h14v20H43z" fill="#ffd400"/></svg>`,
    home: `<svg viewBox="0 0 100 72" aria-hidden="true"><path d="M13 33 50 8l37 25" fill="none" stroke="#111" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><rect x="23" y="31" width="54" height="31" rx="4" fill="#111"/><rect x="31" y="38" width="38" height="17" rx="3" fill="#ffd400"/><circle cx="39" cy="47" r="3" fill="#111"/><circle cx="61" cy="47" r="3" fill="#111"/></svg>`
  };
  return icons[type] || "";
}

function renderCategories() {
  if (!categoriesEl) return;
  categoriesEl.innerHTML = categories.map(([name, type, description, url]) => `
    <a class="category" href="${url}" aria-label="${description}">
      <span class="category-art">${categoryIcon(type)}</span>
      <span class="category-name">${name}</span>
    </a>
  `).join("") + `<a class="category-arrow" href="deals.html" aria-label="View all deals"><span>→</span></a>`;
}

function savingPercent(d) {
  return Math.round(((d.oldPrice - d.price) / d.oldPrice) * 100);
}

function renderDeals(deals) {
  if (!grid) return;
  grid.innerHTML = deals.map(d => `
    <article class="deal-card">
      <span class="badge ${d.badgeClass}">${d.badge}</span>
      <a class="product-image" href="deal.html?id=${d.id}">
        <img src="${d.image}" alt="${d.name}" loading="lazy">
      </a>
      <h3>${d.name}</h3>
      <div class="subtitle">${d.subtitle}</div>
      <div class="price">£${d.price.toFixed(2)} <span class="old-price">£${d.oldPrice.toFixed(2)}</span></div>
      <div class="saving">Save £${(d.oldPrice - d.price).toFixed(2)} (${savingPercent(d)}%)</div>
      <div class="card-bottom">
        <span class="retailer">${d.retailer}</span>
        <a class="view-deal" href="deal.html?id=${d.id}">View Deal</a>
      </div>
    </article>
  `).join("");
  if (noResults) noResults.hidden = deals.length !== 0;
}

async function loadDeals() {
  try {
    const response = await fetch("deals.json");
    allDeals = await response.json();
    renderCategories();
    renderDeals(allDeals);
  } catch (error) {
    if (grid) grid.innerHTML = "<p>Deal data could not be loaded. Please refresh.</p>";
  }
}

loadSiteComponents().then(() => {
  bindPageElements();
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const value = searchInput?.value.trim();
      if (value) window.location.href = `search.html?q=${encodeURIComponent(value)}`;
    });
  }
  if (searchInput) {
    searchInput.addEventListener("keydown", event => {
      if (event.key === "Enter" && searchInput.value.trim()) {
        window.location.href = `search.html?q=${encodeURIComponent(searchInput.value.trim())}`;
      }
    });
  }
  if (clearSearch) {
    clearSearch.addEventListener("click", () => {
      window.location.href = "deals.html";
    });
  }
  loadDeals();
});
