async function loadSiteComponents() {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");

  if (header) {
    try {
      const response = await fetch("components/header.html");

      if (!response.ok) {
        throw new Error("Could not load header");
      }

      header.innerHTML = await response.text();

      const searchInput = document.getElementById("siteSearch");
      const searchButton = document.getElementById("siteSearchButton");

      function performSiteSearch() {
        const query = searchInput?.value.trim();

        if (query) {
          window.location.href =
            "search.html?q=" + encodeURIComponent(query);
        }
      }

      searchButton?.addEventListener("click", performSiteSearch);

      searchInput?.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          performSiteSearch();
        }
      });

    } catch (error) {
      console.error("Header failed to load:", error);
    }
  }

  if (footer) {
    try {
      const response = await fetch("components/footer.html");

      if (!response.ok) {
        throw new Error("Could not load footer");
      }

      footer.innerHTML = await response.text();

    } catch (error) {
      console.error("Footer failed to load:", error);
    }
  }
}

loadSiteComponents();
const categories = [
  ["Gaming", "gaming", "Gaming deals", "gaming.html"],
  ["Computing", "computing", "Computing, laptop and monitor deals", "computing.html"],
  ["Phones & Wearables", "phones", "Phones, smartwatches and wearable tech", "phones.html"],
  ["Sound & Vision", "sound", "TVs, headphones, speakers and more", "sound-vision.html"],
  ["Home & Smart Tech", "home", "Smart appliances and connected home technology", "home-smart-tech.html"]
];
let allDeals=[];
const categoriesEl=document.getElementById('categories');
const grid=document.getElementById('dealGrid');
const searchInput=document.getElementById('searchInput');
const searchBtn=document.getElementById('searchBtn');
const clearSearch=document.getElementById('clearSearch');
const noResults=document.getElementById('noResults');
function categoryIcon(type){const icons={
 gaming:`<svg viewBox="0 0 120 82" aria-hidden="true"><path d="M28 27c6-10 17-14 32-14s26 4 32 14l10 28c2 7-3 14-10 14-5 0-8-3-12-9l-5-7H45l-5 7c-4 6-7 9-12 9-7 0-12-7-10-14z" fill="#151515"/><path d="M38 36h16M46 28v16" stroke="#ffd400" stroke-width="4" stroke-linecap="round"/><circle cx="79" cy="31" r="4" fill="#ff4b55"/><circle cx="89" cy="38" r="4" fill="#4b8cff"/><circle cx="79" cy="45" r="4" fill="#ffd400"/><circle cx="69" cy="38" r="4" fill="#69c96b"/></svg>`,
 computing:`<svg viewBox="0 0 100 72" aria-hidden="true"><rect x="20" y="10" width="60" height="40" rx="4" fill="#222"/><rect x="25" y="15" width="50" height="30" rx="2" fill="#e9f4ff"/><path d="M12 55h76l-7 7H19z" fill="#111"/><path d="M45 55h10" stroke="#ffd400" stroke-width="3" stroke-linecap="round"/></svg>`,
 phones:`<svg viewBox="0 0 100 72" aria-hidden="true"><rect x="27" y="8" width="31" height="56" rx="6" fill="#111"/><rect x="31" y="14" width="23" height="43" rx="3" fill="#e9f4ff"/><circle cx="73" cy="36" r="19" fill="#111"/><circle cx="73" cy="36" r="14" fill="#e9f4ff"/><path d="M73 24v12l8 6" stroke="#ffd400" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
 sound:`<svg viewBox="0 0 100 72" aria-hidden="true"><path d="M27 39V30c0-14 10-23 23-23s23 9 23 23v9" fill="none" stroke="#111" stroke-width="7" stroke-linecap="round"/><rect x="19" y="34" width="15" height="24" rx="6" fill="#111"/><rect x="66" y="34" width="15" height="24" rx="6" fill="#111"/><path d="M43 28h14v20H43z" fill="#ffd400"/></svg>`,
 home:`<svg viewBox="0 0 100 72" aria-hidden="true"><path d="M13 33 50 8l37 25" fill="none" stroke="#111" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><rect x="23" y="31" width="54" height="31" rx="4" fill="#111"/><rect x="31" y="38" width="38" height="17" rx="3" fill="#ffd400"/><circle cx="39" cy="47" r="3" fill="#111"/><circle cx="61" cy="47" r="3" fill="#111"/></svg>`};return icons[type]}
function renderCategories(){if(!categoriesEl)return;categoriesEl.innerHTML=categories.map(([name,type,description,url])=>`<a class="category" href="${url}" aria-label="${description}"><span class="category-art">${categoryIcon(type)}</span><span class="category-name">${name}</span></a>`).join('')+`<a class="category-arrow" href="deals.html" aria-label="View all deals"><span>→</span></a>`}
function savingPercent(d){return Math.round(((d.oldPrice-d.price)/d.oldPrice)*100)}
function renderDeals(deals){if(!grid)return;grid.innerHTML=deals.map(d=>`<article class="deal-card"><span class="badge ${d.badgeClass}">${d.badge}</span><a class="product-image" href="deal.html?id=${d.id}"><img src="${d.image}" alt="${d.name}" loading="lazy"></a><h3>${d.name}</h3><div class="subtitle">${d.subtitle}</div><div class="price">£${d.price.toFixed(2)} <span class="old-price">£${d.oldPrice.toFixed(2)}</span></div><div class="saving">Save £${(d.oldPrice-d.price).toFixed(2)} (${savingPercent(d)}%)</div><div class="card-bottom"><span class="retailer">${d.retailer}</span><a class="view-deal" href="deal.html?id=${d.id}">View Deal</a></div></article>`).join('');if(noResults)noResults.hidden=deals.length!==0}
function filterDeals(){const term=(searchInput?.value||'').trim().toLowerCase();const filtered=allDeals.filter(d=>`${d.name} ${d.subtitle} ${d.category} ${d.retailer}`.toLowerCase().includes(term));renderDeals(filtered)}
async function loadDeals(){try{const r=await fetch('deals.json');allDeals=await r.json();renderCategories();renderDeals(allDeals)}catch(e){if(grid)grid.innerHTML='<p>Deal data could not be loaded. Please refresh.</p>'}}
if(searchBtn)searchBtn.addEventListener('click',()=>{if(searchInput?.value.trim())window.location.href=`search.html?q=${encodeURIComponent(searchInput.value.trim())}`});
if(searchInput)searchInput.addEventListener('keydown',e=>{if(e.key==='Enter'&&searchInput.value.trim())window.location.href=`search.html?q=${encodeURIComponent(searchInput.value.trim())}`});
if(clearSearch)clearSearch.addEventListener('click',()=>{window.location.href='deals.html'});
loadDeals();
