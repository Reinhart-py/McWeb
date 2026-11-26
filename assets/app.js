// Shared layout, search, cart, wishlist and UI effects (layout follows in.ajmal.com)
const ICON = {
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.5-9-9a4.8 4.8 0 0 1 9-3 4.8 4.8 0 0 1 9 3c-2 4.5-9 9-9 9z"/></svg>',
  bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 13H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  menu: '<svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  l: '<svg viewBox="0 0 24 24"><path d="m15 5-7 7 7 7"/></svg>',
  r: '<svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg>',
  trend: '<svg viewBox="0 0 24 24"><path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>',
  filter: '<svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/><circle cx="8" cy="6" r="2" fill="#fff"/><circle cx="16" cy="12" r="2" fill="#fff"/><circle cx="10" cy="18" r="2" fill="#fff"/></svg>',
  wa: '<svg viewBox="0 0 32 32"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6c-2 0-3.9-.5-5.6-1.5l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.8 1 3.9.8a3.3 3.3 0 0 0 2.1-1.5 2.7 2.7 0 0 0 .2-1.5c-.1-.2-.3-.3-.6-.5z"/></svg>',
  gift: '<svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="13"/><path d="M3 12h18M12 8v13M12 8S10 3 7.5 4 9 8 12 8zm0 0s2-5 4.5-4S15 8 12 8z"/></svg>',
  truck: '<svg viewBox="0 0 24 24"><path d="M2 6h12v10H2zM14 10h4l3 3v3h-7"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
  chat: '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H8l-4 4z"/></svg>',
};
const SOC = {
  ig: '<svg viewBox="0 0 24 24"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM12 2c-2.7 0-3 0-4.1.1-4 .2-5.6 1.8-5.8 5.8C2 9 2 9.3 2 12s0 3 .1 4.1c.2 4 1.8 5.6 5.8 5.8 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c4-.2 5.6-1.8 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c-.2-4-1.8-5.6-5.8-5.8C15 2 14.7 2 12 2z"/></svg>',
  tt: '<svg viewBox="0 0 24 24"><path d="M16.6 2h-3.3v13.4a2.9 2.9 0 1 1-2-2.8V9.2a6.3 6.3 0 1 0 5.3 6.2V8.6A7.9 7.9 0 0 0 21 10V6.7a4.6 4.6 0 0 1-4.4-4.7z"/></svg>',
  sc: '<svg viewBox="0 0 24 24"><path d="M12 2c3 0 5.3 2.3 5.3 5.4v2.4l1.6-.4c.6 0 1 .4.8.9-.3.6-1.9.9-2.2 1.3s.7 2.7 3.3 3.4c.4.1.4.6 0 .8-1 .5-2.1.4-2.3.8s-.1 1.1-.7 1.1c-.8 0-1.6-.4-2.8.2S14 22 12 22s-2.6-1.6-3.8-2.1-2-.2-2.8-.2c-.6 0-.5-.7-.7-1.1s-1.3-.3-2.3-.8c-.4-.2-.4-.7 0-.8 2.6-.7 3.6-3 3.3-3.4s-1.9-.7-2.2-1.3c-.2-.5.2-.9.8-.9l1.6.4V7.4C5.9 4.3 9 2 12 2z"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M17.8 3h3.1l-6.8 7.7 8 10.3h-6.2l-4.9-6.3L5.4 21H2.3l7.2-8.3L1.8 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/></svg>',
  fb: '<svg viewBox="0 0 24 24"><path d="M14 8V6c0-.9.6-1.1 1-1.1h2.7V1h-3.8C10 1 9.2 3.9 9.2 5.8V8H6.8v4h2.4v11h4.8V12h3.3l.4-4z"/></svg>',
};
const LINKS = {
  ig: "https://www.instagram.com/millionaireschoiceparfum/",
  tt: "https://www.tiktok.com/@millionaireschoiceparfum",
  sc: "https://www.snapchat.com/@mc.parfum",
  x: "https://x.com/MCParfum",
  fb: "https://www.facebook.com/millionaireschoiceparfum",
};
const waLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

/* ---------- header / footer ---------- */
function layout(active, overHero = false) {
  const nav = [["index.html", "Home"], ["shop.html?c=all", "Shop All"], ["shop.html?c=signature", "Signature"], ["shop.html?c=gifting", "Gifting"], ["product.html?id=trial-kit", "Trial Kit"], ["shop.html?c=limited", "Limited Edition"], ["about.html", "Our Story"], ["contact.html", "Contact Us"]];
  const navHtml = nav.map(([h, t]) => `<a href="${h}" class="${active === t ? "act" : ""}">${t}</a>`).join("");
  document.body.insertAdjacentHTML("afterbegin", `
  <a class="announce" href="product.html?id=trial-kit">✨ New to MC? Try all 7 scents with our Trial Kit, just AED 200 ✨</a>
  <header class="site${overHero ? " over" : ""}">
    <div class="hwrap">
      <button class="burger" aria-label="Menu" onclick="document.body.classList.add('nav-open')">${ICON.menu}</button>
      <a class="logo" href="index.html"><img class="lg-dark" src="${LOGO_BLACK}" alt="Millionaires Choice Parfum"><img class="lg-light" src="${LOGO_WHITE}" alt=""></a>
      <div class="hmain">
        <div class="hrow">
          <div class="search" id="search">
            <input id="q" autocomplete="off" placeholder="Search for " aria-label="Search">
            <button class="sbtn" aria-label="Search" onclick="document.getElementById('q').focus()">${ICON.search}</button>
            <div class="sdrop" id="sdrop"></div>
          </div>
          <div class="icons">
            <a href="shop.html?c=all&wish=1" aria-label="Wishlist">${ICON.heart}<span class="badge" id="wishCount">0</span></a>
            <button aria-label="Cart" onclick="openCart()">${ICON.bag}<span class="badge" id="cartCount">0</span></button>
          </div>
        </div>
        <nav class="main">${navHtml}</nav>
      </div>
    </div>
  </header>
  <div class="mnav"><img src="${LOGO_BLACK}" style="height:60px;margin-bottom:16px" alt="">${navHtml}</div>`);

  document.body.insertAdjacentHTML("beforeend", `
  <footer class="site">
    <div class="wrap">
      <div class="foot">
        <div><h4>Shop by Category</h4><a href="shop.html?c=parfum">Parfum Collection</a><a href="shop.html?c=limited">Limited Edition</a><a href="product.html?id=travel-kit">Travel Kit</a><a href="product.html?id=trial-kit">Trial Kit</a><a href="shop.html?c=gifting">Gift Sets</a><a href="shop.html?c=all">All Perfumes</a></div>
        <div><h4>Customer Service</h4><a href="contact.html">Contact Us</a><a href="${waLink("Hi, I want to track my order")}" target="_blank" rel="noopener">Order Tracking</a><a href="policy.html?p=shipping">Shipping &amp; Delivery</a><a href="policy.html?p=returns">Return &amp; Refund Policy</a></div>
        <div><h4>Legal &amp; Policies</h4><a href="policy.html?p=privacy">Privacy Policy</a><a href="policy.html?p=terms">Terms of Use</a><a href="policy.html?p=cruelty">Cruelty-Free Promise</a></div>
        <div><h4>Our Story</h4><a href="about.html">About Millionaires Choice</a></div>
        <div class="fcontact"><h4>Contact Us</h4><p>Email: <a href="mailto:enquiry@jataniageneraltrading.com">enquiry@jataniageneraltrading.com</a></p><p>Call: <a href="tel:+97145919749">+971 4 591 9749</a></p><p>WhatsApp: <a href="${waLink("Hi")}" target="_blank" rel="noopener">+971 50 590 2665</a></p></div>
      </div>
      <div class="foot2">
        <div>
          <img class="flogo" src="${LOGO_WHITE}" alt="Millionaires Choice Parfum">
          <div class="social">${Object.keys(LINKS).map((k) => `<a href="${LINKS[k]}" target="_blank" rel="noopener" aria-label="${k}">${SOC[k]}</a>`).join("")}</div>
          <p class="fsub">Get new launches and special offers by email</p>
          <form class="fmail" onsubmit="event.preventDefault();location.href='mailto:enquiry@jataniageneraltrading.com?subject='+encodeURIComponent('Subscribe me to MC offers')+'&body='+encodeURIComponent('Please add '+this.e.value+' to your offers list.')">
            <input name="e" type="email" required placeholder="Your Email" aria-label="Your email"><button aria-label="Subscribe">→</button>
          </form>
        </div>
        <p class="faddr">Jatania General Trading LLC<br>Office 903, Capricorn Tower, Sheikh Zayed Road, Dubai, United Arab Emirates</p>
      </div>
      <div class="copy">© ${new Date().getFullYear()}, Millionaires Choice Parfum</div>
    </div>
  </footer>
  <a class="wa" href="${waLink("Hi, I want to order a Millionaires Choice parfum")}" target="_blank" aria-label="WhatsApp">${ICON.wa}</a>
  <div class="drawer-bg" onclick="closeAll()"></div>
  <aside class="drawer"><div class="hd"><h3>Your Bag</h3><button onclick="closeAll()" style="font-size:24px">×</button></div><div class="bd" id="cartBody"></div><div class="ft" id="cartFoot"></div></aside>
  <div class="toast" id="toast"></div>`);

  initSearch();
  updateCounts();
}

/* ---------- search: typing placeholder + Ajmal-style dropdown ---------- */
function initSearch() {
  const q = document.getElementById("q"), drop = document.getElementById("sdrop"), box = document.getElementById("search");
  // typing animation: "Search for M", "Search for MC", "Search for MC1" ... then erase
  const words = ["MC1", "Oud", "Rose", "Trial Kit", "Gift Set", "Amber"];
  let w = 0, c = 0, dir = 1;
  setInterval(() => {
    if (document.activeElement === q || q.value) return;
    c += dir;
    if (c > words[w].length) { dir = -1; c = words[w].length; return; }
    if (c < 0) { dir = 1; c = 0; w = (w + 1) % words.length; }
    q.placeholder = "Search for " + words[w].slice(0, c);
  }, 160);

  const chip = (t) => `<button class="chip" onclick="setSearch('${t}')">${ICON.trend}${t}</button>`;
  const mini = (p) => `<a class="mini-card" href="product.html?id=${p.id}"><div class="im"><img src="${p.imgs[0]}" alt=""></div><b>${p.name}</b><span class="off">${off(p)}% off</span><span class="pr"><s>${aed(p.was)}</s> ${aed(p.price)}</span></a>`;
  const render = () => {
    const v = q.value.trim().toLowerCase();
    if (!v) {
      drop.innerHTML = `<h5>Trending Searches</h5><div class="chips">${TRENDING.map(chip).join("")}</div>
        <h5>Top Products</h5><div class="minis">${["mc1", "mc-le", "trial-kit", "mc6"].map((id) => mini(byId(id))).join("")}</div>`;
      return;
    }
    const hits = PRODUCTS.filter((p) => [p.name, p.family, p.short, Object.values(p.notes).join(" "), p.tags.join(" ")].join(" ").toLowerCase().includes(v));
    const cats = Object.entries(COLLECTIONS).filter(([k, c]) => k !== "all" && PRODUCTS.some((p) => c.match(p) && hits.includes(p))).slice(0, 4);
    const sugg = TRENDING.filter((t) => t.toLowerCase().includes(v) || hits.some((p) => p.name === t));
    drop.innerHTML = (cats.length ? `<h5>Categories</h5><div class="chips">${cats.map(([k, c]) => `<a class="chip" href="shop.html?c=${k}">${c.name}</a>`).join("")}</div>` : "") +
      (sugg.length ? `<h5>Trending Searches</h5><div class="chips">${sugg.map(chip).join("")}</div>` : "") +
      `<h5>Search Results</h5>` + (hits.length ? `<div class="minis">${hits.map(mini).join("")}</div>` : `<p class="none">No match for "${q.value}". Try "rose", "oud" or "gift".</p>`);
  };
  q.addEventListener("focus", () => { render(); box.classList.add("open"); });
  q.addEventListener("input", render);
  q.addEventListener("keydown", (e) => { if (e.key === "Enter") { const h = drop.querySelector(".mini-card"); if (h) location.href = h.href; } });
  document.addEventListener("click", (e) => { if (!box.contains(e.target)) box.classList.remove("open"); });
  window.setSearch = (t) => { q.value = t; render(); q.focus(); };
}

/* ---------- storage helpers (safe if blocked) ---------- */
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
let cart = store.get("mc_cart", []);
let wish = store.get("mc_wish", []);

function updateCounts() {
  const c = document.getElementById("cartCount"), w = document.getElementById("wishCount");
  if (c) c.textContent = cart.reduce((s, i) => s + i.q, 0);
  if (w) w.textContent = wish.length;
}
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("on");
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("on"), 2200);
}
function addToCart(id, q = 1) {
  const it = cart.find((i) => i.id === id);
  it ? (it.q += q) : cart.push({ id, q });
  store.set("mc_cart", cart); updateCounts(); renderCart(); openCart();
}
function setQty(id, d) {
  const it = cart.find((i) => i.id === id);
  if (!it) return;
  it.q += d;
  if (it.q <= 0) cart = cart.filter((i) => i.id !== id);
  store.set("mc_cart", cart); updateCounts(); renderCart();
}
function toggleWish(id) {
  wish = wish.includes(id) ? wish.filter((x) => x !== id) : [...wish, id];
  store.set("mc_wish", wish); updateCounts();
  document.querySelectorAll(`.wish[data-id="${id}"]`).forEach((b) => b.classList.toggle("on", wish.includes(id)));
  toast(wish.includes(id) ? "Added to wishlist" : "Removed from wishlist");
}
function renderCart() {
  const body = document.getElementById("cartBody"), foot = document.getElementById("cartFoot");
  if (!cart.length) { body.innerHTML = `<div class="empty">Your bag is empty.<br><br><a class="btn-dark" href="shop.html?c=all">Shop Now</a></div>`; foot.innerHTML = ""; return; }
  const total = cart.reduce((s, i) => s + byId(i.id).price * i.q, 0);
  const hasParfum = cart.some((i) => byId(i.id).type === "parfum");
  body.innerHTML = cart.map((i) => { const p = byId(i.id); return `
    <div class="ci"><img src="${p.imgs[0]}" alt=""><div class="x"><b>${p.name}</b><div class="price" style="justify-content:flex-start">${aed(p.price)} <s>${aed(p.was)}</s></div>
    <div class="qty"><button onclick="setQty('${p.id}',-1)">−</button><span>${i.q}</span><button onclick="setQty('${p.id}',1)">+</button></div></div>
    <button class="rm" onclick="setQty('${p.id}',-${i.q})">Remove</button></div>`; }).join("") +
    (hasParfum ? `<div class="free">🎁 ${FREE_KIT_NOTE} Added free.</div>` : `<div class="free">Add any MC parfum and get a free Travel Kit.</div>`);
  const msg = "Hi, I want to order:\n" + cart.map((i) => `${byId(i.id).name} × ${i.q}`).join("\n") + `\nTotal: ${aed(total)}`;
  foot.innerHTML = `<div style="display:flex;justify-content:space-between;font-size:15px"><span>Subtotal</span><b style="font-weight:500">${aed(total)}</b></div>
    <a class="btn-dark" style="margin-top:12px;display:block;text-align:center" href="checkout.html">Checkout</a>
    <a class="btn-wa" style="margin-top:10px" href="${waLink(msg)}" target="_blank" rel="noopener">${ICON.wa} Order on WhatsApp</a>`;
}
function openCart() { renderCart(); document.body.classList.add("cart-open"); }
function closeAll() { document.body.classList.remove("cart-open", "nav-open"); }

/* ---------- product card (Ajmal sizes) ---------- */
function card(p) {
  const tag = p.isNew ? "New" : p.best ? "Bestseller" : "";
  return `<div class="card">
    <a class="pic" href="product.html?id=${p.id}">${tag ? `<span class="tag">${tag}</span>` : ""}
      <img class="a" src="${p.imgs[0]}" alt="${p.name}" loading="lazy">
      <img class="b" src="${p.imgs[1] || p.imgs[0]}" alt="" loading="lazy" onerror="this.src='${p.imgs[0]}'"></a>
    <button class="wish ${wish.includes(p.id) ? "on" : ""}" data-id="${p.id}" onclick="toggleWish('${p.id}')" aria-label="Wishlist">${ICON.heart}</button>
    <a class="info" href="product.html?id=${p.id}"><div class="fam">${p.family}</div><div class="nm">${p.name}</div>
      <div class="price">${aed(p.price)} <s>${aed(p.was)}</s> <span class="off">${off(p)}% Off</span></div></a>
    <button class="btn-cart" onclick="addToCart('${p.id}')">ADD TO CART</button>
  </div>`;
}

/* ---------- carousels / reveal ---------- */
function rowArrows() {
  document.querySelectorAll(".row-wrap").forEach((w) => {
    if (w.querySelector(".arrow")) return;
    const r = w.querySelector(".row");
    w.insertAdjacentHTML("beforeend", `<button class="arrow l" aria-label="Back">${ICON.l}</button><button class="arrow r" aria-label="Next">${ICON.r}</button>`);
    w.querySelector(".arrow.l").onclick = () => r.scrollBy({ left: -r.clientWidth * 0.8 });
    w.querySelector(".arrow.r").onclick = () => r.scrollBy({ left: r.clientWidth * 0.8 });
  });
}
function reveal() {
  const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: 0.12 });
  document.querySelectorAll(".rv").forEach((el) => io.observe(el));
}
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeAll(); document.getElementById("search")?.classList.remove("open"); } });
