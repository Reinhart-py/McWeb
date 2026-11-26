// Store admin panel. Plain JS, no build step.
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
const ICONS = {
  orders: '<path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
  money: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.5"/>',
};
const icon = (k) => `<svg viewBox="0 0 24 24">${ICONS[k] || ""}</svg>`;
let currency = "", locale = undefined, fmt = null;
function setMoney(cur, loc) {
  currency = cur; locale = loc || undefined;
  try { fmt = new Intl.NumberFormat(locale, { style: "currency", currency: cur }); } catch { fmt = null; }
}
const money = (n) => fmt ? fmt.format(Number(n || 0)) : `${currency} ${Number(n || 0).toLocaleString(locale)}`;
const day = (s) => (s || "").slice(0, 10);

async function api(path, body) {
  const r = await fetch("api/" + path, body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {});
  const j = await r.json().catch(() => ({}));
  if (r.status === 401 && path !== "login") { showLogin(); throw new Error("login"); }
  if (!r.ok) throw new Error(j.error || "Something went wrong");
  return j.message;
}
function toast(t) {
  const el = $("#toast"); el.textContent = t; el.classList.add("on");
  clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("on"), 2200);
}
function showLogin() { $("#app").hidden = true; $("#login").hidden = false; }

/* ---------- login ---------- */
$("#loginForm").onsubmit = async (e) => {
  e.preventDefault();
  $("#loginErr").textContent = "";
  try { await api("login", { password: e.target.password.value }); e.target.reset(); start(); }
  catch (err) { $("#loginErr").textContent = err.message; }
};
$("#logout").onclick = async () => { await api("logout", {}).catch(() => {}); showLogin(); };
$("#menuBtn").onclick = () => document.body.classList.toggle("nav-open");

let features = {};
const brandHtml = (b) => b.logo ? `<img src="${esc(b.logo)}" alt="${esc(b.store_name)}">` : esc(b.store_name);
async function start() {
  api("brand").then((b) => { $("#loginBrand").innerHTML = b.logo ? brandHtml(b) : ""; }).catch(() => {});
  try {
    const me = await api("me");
    features = me.features; setMoney(me.currency, me.locale);
    $("#brand").innerHTML = brandHtml(me);
    document.title = me.store_name + " · Admin";
    document.querySelectorAll("#nav a[data-f]").forEach((a) => (a.hidden = !features[a.dataset.f]));
    $("#login").hidden = true; $("#app").hidden = false;
    route();
  } catch { showLogin(); }
}

// Image field: upload a file or paste a URL
function imagePicker(holder, value) {
  holder.innerHTML = `
    <div class="imgpick">
      <div class="tabs"><button type="button" class="on" data-t="up">Upload</button><button type="button" data-t="url">Image URL</button></div>
      <div class="prev" title="Click or drop an image">${value ? `<img src="${esc(value)}" alt="">` : "Click or drop an image"}</div>
      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden>
      <input type="url" class="u" placeholder="https://…" value="${/^https?:/.test(value || "") ? esc(value) : ""}" hidden>
    </div>`;
  let current = value || "";
  const prev = $(".prev", holder), file = $("[type=file]", holder), u = $(".u", holder);
  const show = (src) => { current = src; prev.innerHTML = src ? `<img src="${esc(src)}" alt="">` : "Click or drop an image"; };
  const upload = (f) => {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return toast("Image must be under 5 MB");
    const rd = new FileReader();
    rd.onload = async () => {
      try { show((await api("upload", { data: rd.result })).url); toast("Image uploaded"); } catch (e) { toast(e.message); }
    };
    rd.readAsDataURL(f);
  };
  $(".tabs", holder).onclick = (e) => {
    const t = e.target.closest("button"); if (!t) return;
    holder.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("on", b === t));
    u.hidden = t.dataset.t !== "url";
  };
  prev.onclick = () => file.click();
  file.onchange = () => upload(file.files[0]);
  prev.ondragover = (e) => { e.preventDefault(); prev.classList.add("drag"); };
  prev.ondragleave = () => prev.classList.remove("drag");
  prev.ondrop = (e) => { e.preventDefault(); prev.classList.remove("drag"); upload(e.dataTransfer.files[0]); };
  u.oninput = () => show(u.value.trim());
  return { get: () => current, clear: () => show("") };
}

/* ---------- views ---------- */
const VIEWS = { dashboard: viewDashboard, orders: viewOrders, invoices: viewInvoices, products: viewProducts, customers: viewCustomers, coupons: viewCoupons, reports: viewReports, settings: viewSettings };
function route() {
  let v = VIEWS[location.hash.slice(1)] ? location.hash.slice(1) : "dashboard";
  if (features[v] === false) v = "dashboard";
  closePanel();
  document.querySelectorAll("#nav a").forEach((a) => a.classList.toggle("on", a.dataset.v === v));
  $("#title").textContent = v[0].toUpperCase() + v.slice(1);
  document.body.classList.remove("nav-open");
  VIEWS[v]().catch((e) => e.message !== "login" && toast(e.message));
}
addEventListener("hashchange", route);

function orderTable(rows) {
  return rows.length ? rows.map((o) => `
    <tr data-k="${esc(o.name)}">
      <td>${esc(o.name)}</td><td>${esc(o.customer_name)}</td><td>${esc(o.payment_method)}</td>
      <td>${money(o.total)}</td><td>${esc(day(o.created))}</td>
      <td><span class="chip">${esc(o.status)}</span></td><td><span class="chip">${esc(o.payment_status)}</span></td>
    </tr>`).join("") : `<tr><td colspan="7" class="empty">No orders yet</td></tr>`;
}
const ORDER_HEAD = `<thead><tr><th>Order</th><th>Customer</th><th>Payment</th><th>Total</th><th>Date</th><th>Status</th><th>Paid</th></tr></thead>`;

function csv(filename, head, rows) {
  const text = [head, ...rows].map((l) => l.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/csv" }));
  a.download = filename; a.click();
}
const exportCsv = (rows) => csv("orders.csv", ["Order", "Customer", "Phone", "City", "Payment", "Total", "Date", "Status", "Paid"],
  rows.map((o) => [o.name, o.customer_name, o.phone, o.city, o.payment_method, o.total, o.created, o.status, o.payment_status]));

function ordersBlock(title, rows, limit) {
  const el = document.createElement("section");
  el.className = "card";
  el.innerHTML = `
    <div class="head"><h3>${title}</h3>
      <div class="tools">
        ${limit ? "" : '<input type="search" class="q" placeholder="Search name, phone, order">'}
        <select class="st"><option value="">Status</option>${STATUSES.map((s) => `<option>${s}</option>`).join("")}</select>
        <button class="btn exp">Export</button>
      </div></div>
    <div class="twrap"><table>${ORDER_HEAD}<tbody></tbody></table></div>`;
  let shown = rows;
  const draw = () => {
    const st = $(".st", el).value, q = ($(".q", el)?.value || "").toLowerCase();
    shown = rows.filter((o) => (!st || o.status === st) &&
      (!q || [o.name, o.customer_name, o.phone].some((v) => String(v || "").toLowerCase().includes(q))));
    $("tbody", el).innerHTML = orderTable(limit ? shown.slice(0, limit) : shown);
  };
  $(".st", el).onchange = draw;
  if ($(".q", el)) $(".q", el).oninput = draw;
  $(".exp", el).onclick = () => exportCsv(shown);
  $("tbody", el).onclick = (e) => { const tr = e.target.closest("tr[data-k]"); if (tr) openOrder(tr.dataset.k); };
  draw();
  return el;
}

async function viewDashboard() {
  const [d, orders] = await Promise.all([api("dashboard"), api("orders")]);
  let active = Math.max(0, d.stats.findIndex((s) => s.active));
  const max = Math.max(1, ...d.chart.orders, ...d.chart.paid);
  const view = $("#view");
  view.innerHTML = `
  <div class="dash">
    <section class="card">
      <h2>Quick Stats</h2>
      <p class="sub">${d.week_orders} new orders in the last 7 days</p>
      <div class="stats"></div>
    </section>
    <div class="grid2">
      <section class="card">
        <div class="head"><h3>Statistics ${new Date().getFullYear()}</h3>
          <span class="legend"><i class="dark"></i>Orders<i class="light"></i>Paid</span></div>
        <div class="bars">${d.chart.labels.map((m, i) => `
          <div class="col">
            <div class="pair"><span class="bar dark" style="height:${(d.chart.orders[i] / max) * 100}%"></span><span class="bar light" style="height:${(d.chart.paid[i] / max) * 100}%"></span></div>
            <div class="month">${m}</div>
            <div class="tip">${d.chart.orders[i]} orders · ${d.chart.paid[i]} paid</div>
          </div>`).join("")}</div>
      </section>
      <section class="card">
        <div class="head"><h3>Pending Orders</h3><a class="link" href="#orders">See all</a></div>
        <div class="plist">${d.pending.length ? d.pending.map((o) => `
          <div class="prow" data-k="${esc(o.name)}">
            <span class="avatar">${esc((o.customer_name || "?")[0].toUpperCase())}</span>
            <span class="pinfo"><b>${esc(o.customer_name)}</b><small>${esc(o.name)} · ${money(o.total)}</small></span>
            <span class="chip">Pending</span>
          </div>`).join("") : '<div class="empty">No pending orders</div>'}</div>
      </section>
    </div>
  </div>`;
  const drawStats = () => {
    $(".stats", view).innerHTML = d.stats.map((s, i) => `
      <div class="stat ${i === active ? "on" : ""}" data-i="${i}">
        <span class="ico">${icon(s.icon)}</span><div class="num">${esc(s.value)}</div><div class="lbl">${esc(s.label)}</div>
      </div>`).join("");
  };
  $(".stats", view).onclick = (e) => { const s = e.target.closest(".stat"); if (s) { active = +s.dataset.i; drawStats(); } };
  $(".plist", view).onclick = (e) => { const r = e.target.closest(".prow"); if (r) openOrder(r.dataset.k); };
  drawStats();
  if (d.low_stock.length || d.top_products.length) {
    const g = document.createElement("div");
    g.className = "grid2";
    g.innerHTML = `
      <section class="card"><div class="head"><h3>Best Sellers</h3>${features.reports ? '<a class="link" href="#reports">Reports</a>' : ""}</div>
        ${d.top_products.length ? `<table><thead><tr><th>Product</th><th>Sold</th><th>Sales</th></tr></thead><tbody>${d.top_products.map((p) =>
          `<tr><td>${esc(p.name)}</td><td>${p.qty}</td><td>${money(p.amount)}</td></tr>`).join("")}</tbody></table>` : '<div class="empty">No sales yet</div>'}</section>
      <section class="card"><div class="head"><h3>Low Stock</h3><a class="link" href="#products">Products</a></div>
        ${d.low_stock.length ? d.low_stock.map((p) => `<div class="prow"><span class="avatar">${p.image ? `<img class="thumb" style="width:40px;height:40px;border-radius:50%" src="${esc(p.image)}" alt="">` : esc(p.name[0])}</span>
          <span class="pinfo"><b>${esc(p.name)}</b><small>${esc(p.code)}</small></span><span class="chip">${p.stock} left</span></div>`).join("") : '<div class="empty">All products in stock</div>'}</section>`;
    $(".dash", view).append(g);
  }
  $(".dash", view).append(ordersBlock("Manage Orders", orders, 8));
}

async function viewCustomers() {
  const list = await api("customers");
  $("#view").innerHTML = `<section class="card">
    <div class="head"><h3>Customers</h3><div class="tools"><input type="search" class="q" placeholder="Search name, phone, email"><button class="btn exp">Export</button></div></div>
    <div class="twrap"><table><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>City</th><th>Orders</th><th>Spent</th><th>Last order</th></tr></thead><tbody></tbody></table></div></section>`;
  let shown = list;
  const draw = () => {
    const q = $(".q").value.toLowerCase();
    shown = list.filter((c) => !q || [c.name, c.phone, c.email].some((v) => String(v || "").toLowerCase().includes(q)));
    $("#view tbody").innerHTML = shown.length ? shown.map((c) => `<tr><td>${esc(c.name)}</td><td><a href="tel:${esc(c.phone)}">${esc(c.phone)}</a></td>
      <td>${esc(c.email) || "—"}</td><td>${esc(c.city)}</td><td>${c.orders}</td><td>${money(c.spent)}</td><td>${esc(day(c.last_order))}</td></tr>`).join("")
      : '<tr><td colspan="7" class="empty">No customers yet</td></tr>';
  };
  $(".q").oninput = draw;
  $(".exp").onclick = () => csv("customers.csv", ["Name", "Phone", "Email", "City", "Orders", "Spent", "Last order"],
    shown.map((c) => [c.name, c.phone, c.email, c.city, c.orders, c.spent, c.last_order]));
  draw();
}

async function viewCoupons() {
  const list = await api("coupons");
  $("#view").innerHTML = `<section class="card">
    <div class="head"><h3>Coupons</h3><div class="tools"><button class="btn add">Add coupon</button></div></div>
    <div class="twrap"><table><thead><tr><th>Code</th><th>Discount</th><th>Min. order</th><th>Used</th><th>Active</th></tr></thead><tbody>
    ${list.length ? list.map((c) => `<tr data-k="${esc(c.code)}"><td><b>${esc(c.code)}</b></td><td>${c.kind === "percent" ? c.value + "%" : money(c.value)}</td>
      <td>${c.min_total ? money(c.min_total) : "—"}</td><td>${c.used}${c.max_uses ? " / " + c.max_uses : ""}</td><td><span class="chip">${c.active ? "Yes" : "No"}</span></td></tr>`).join("")
      : '<tr><td colspan="5" class="empty">No coupons yet</td></tr>'}</tbody></table></div></section>`;
  $(".add").onclick = () => editCoupon({ kind: "percent", active: 1 });
  $("#view tbody").onclick = (e) => { const tr = e.target.closest("tr[data-k]"); if (tr) editCoupon(list.find((c) => c.code === tr.dataset.k)); };
}
function editCoupon(c) {
  const isNew = !c.code;
  const el = panel(`
    <h3>${isNew ? "Add coupon" : esc(c.code)}</h3>
    <label class="field"><span>Code</span><input name="code" value="${esc(c.code)}" ${isNew ? "" : "readonly"} placeholder="SAVE10"></label>
    <div class="row2">
      <label class="field"><span>Type</span><select name="kind"><option value="percent">Percent</option><option value="fixed" ${c.kind === "fixed" ? "selected" : ""}>Fixed amount</option></select></label>
      <label class="field"><span>Value</span><input name="value" type="number" min="0" step="0.01" value="${c.value ?? ""}"></label>
    </div>
    <div class="row2">
      <label class="field"><span>Minimum order</span><input name="min_total" type="number" min="0" step="0.01" value="${c.min_total || ""}"></label>
      <label class="field"><span>Max uses (0 = no limit)</span><input name="max_uses" type="number" min="0" value="${c.max_uses || 0}"></label>
    </div>
    <label class="field"><span>Active</span><select name="active"><option value="1">Yes</option><option value="0" ${c.active ? "" : "selected"}>No</option></select></label>
    <button class="btn save">Save</button>${isNew ? "" : '<button class="btn ghost del">Delete coupon</button>'}`);
  const v = (n) => $(`[name=${n}]`, el).value;
  $(".save", el).onclick = async () => {
    try { await api("coupon", { code: v("code"), kind: v("kind"), value: v("value"), min_total: v("min_total"), max_uses: v("max_uses"), active: v("active") }); toast("Saved"); closePanel(); route(); }
    catch (e) { toast(e.message); }
  };
  if ($(".del", el)) $(".del", el).onclick = async () => {
    if (!confirm(`Delete coupon ${c.code}?`)) return;
    await api("coupon/delete", { code: c.code }); toast("Deleted"); closePanel(); route();
  };
}

async function viewReports() {
  const iso = (d) => d.toISOString().slice(0, 10);
  const now = new Date(), from0 = iso(new Date(now.getFullYear(), now.getMonth(), 1)), to0 = iso(now);
  $("#view").innerHTML = `<div class="dash">
    <section class="card"><div class="head"><h3>Sales report</h3><div class="tools">
      <input type="date" class="f" value="${from0}"><input type="date" class="t" value="${to0}"><button class="btn go">Show</button><button class="btn ghost exp">Export</button></div></div>
      <div class="stats rs"></div></section>
    <div class="grid2"><section class="card"><div class="head"><h3>By product</h3></div><div class="twrap bp"></div></section>
      <section class="card"><div class="head"><h3>By payment</h3></div><div class="twrap bpay"></div></section></div>
    <section class="card"><div class="head"><h3>By day</h3></div><div class="twrap bd"></div></section></div>`;
  let rep;
  const tbl = (head, rows) => rows.length ? `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r) =>
    `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>` : '<div class="empty">No sales in this period</div>';
  const load = async () => {
    rep = await api(`reports?from=${$(".f").value}&to=${$(".t").value}`);
    const s = rep.summary;
    $(".rs").innerHTML = [["Orders", s.orders, "orders"], ["Sales", money(s.sales), "money"], ["Paid", money(s.paid), "check"],
      ["Discounts", money(s.discounts), "alert"], ["Shipping", money(s.shipping), "clock"]].map(([l, v, i], n) =>
      `<div class="stat ${n === 1 ? "on" : ""}"><span class="ico">${icon(i)}</span><div class="num">${esc(v)}</div><div class="lbl">${l}</div></div>`).join("");
    $(".bp").innerHTML = tbl(["Product", "Sold", "Sales"], rep.by_product.map((p) => [esc(p.name), p.qty, money(p.amount)]));
    $(".bpay").innerHTML = tbl(["Payment", "Orders", "Sales"], rep.by_payment.map((p) => [esc(p.payment_method), p.orders, money(p.sales)]));
    $(".bd").innerHTML = tbl(["Day", "Orders", "Sales"], rep.by_day.map((d) => [d.day, d.orders, money(d.sales)]));
  };
  $(".go").onclick = () => load().catch((e) => toast(e.message));
  $(".exp").onclick = () => csv("sales-report.csv", ["Day", "Orders", "Sales"], rep.by_day.map((d) => [d.day, d.orders, d.sales]));
  await load();
}

async function viewOrders() {
  const orders = await api("orders");
  $("#view").innerHTML = "";
  const b = ordersBlock("All Orders", orders);
  $(".tools", b).insertAdjacentHTML("afterbegin", '<button class="btn neworder">New order</button>');
  $(".neworder", b).onclick = () => newOrder().catch((e) => toast(e.message));
  $("#view").append(b);
}

/* ---------- side panel ---------- */
function panel(html) {
  closePanel();
  document.body.insertAdjacentHTML("beforeend", `<div class="panel-bg"></div><aside class="panel"><button class="x" aria-label="Close">×</button>${html}</aside>`);
  $(".panel-bg").onclick = closePanel; $(".panel .x").onclick = closePanel;
  return $(".panel");
}
function closePanel() { document.querySelectorAll(".panel,.panel-bg").forEach((e) => e.remove()); }

async function openOrder(name) {
  const o = await api("order?name=" + encodeURIComponent(name));
  const p = panel(`
    <h3>${esc(o.name)}</h3>
    <dl class="kv">
      <dt>Customer</dt><dd>${esc(o.customer_name)}</dd>
      <dt>Phone</dt><dd><a href="tel:${esc(o.phone)}">${esc(o.phone)}</a></dd>
      <dt>Email</dt><dd>${esc(o.email) || "—"}</dd>
      <dt>Address</dt><dd>${esc(o.address)}, ${esc(o.city)}</dd>
      <dt>Notes</dt><dd>${esc(o.notes) || "—"}</dd>
      <dt>Payment</dt><dd>${esc(o.payment_method)}</dd>
      <dt>Date</dt><dd>${esc(o.created)}</dd>
    </dl>
    <div class="twrap"><table><thead><tr><th>Item</th><th>Qty</th><th>Amount</th></tr></thead><tbody>
      ${o.items.map((i) => `<tr><td>${esc(i.name)}</td><td>${i.qty}</td><td>${money(i.amount)}</td></tr>`).join("")}
      </tbody></table></div>
    <div>
      ${o.subtotal ? `<div class="sumrow"><span class="muted">Subtotal</span><span>${money(o.subtotal)}</span></div>` : ""}
      ${o.discount ? `<div class="sumrow"><span class="muted">Discount ${esc(o.coupon)}</span><span>− ${money(o.discount)}</span></div>` : ""}
      ${o.shipping ? `<div class="sumrow"><span class="muted">Shipping</span><span>${money(o.shipping)}</span></div>` : ""}
      ${o.tax ? `<div class="sumrow"><span class="muted">Tax${o.subtotal + o.shipping - o.discount === o.total ? " (included)" : ""}</span><span>${money(o.tax)}</span></div>` : ""}
      <div class="sumrow"><b>Total</b><b>${money(o.total)}</b></div>
    </div>
    <div class="row2">
      <label class="field"><span>Status</span><select name="status">${STATUSES.map((s) => `<option ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}</select></label>
      <label class="field"><span>Payment</span><select name="payment_status">${["Unpaid", "Paid", "Refunded"].map((s) => `<option ${s === o.payment_status ? "selected" : ""}>${s}</option>`).join("")}</select></label>
    </div>
    <label class="field"><span>Staff note</span><textarea name="admin_note" rows="2">${esc(o.admin_note)}</textarea></label>
    <div class="row2"><button class="btn save">Save</button>${features.invoices ? `<button class="btn ghost inv">${o.invoice ? "View invoice" : "Create invoice"}</button>` : ""}</div>`);
  if ($(".inv", p)) $(".inv", p).onclick = async () => {
    try { const n = o.invoice || (await api("invoice", { order: o.name })).name; location.href = "invoice.html?name=" + encodeURIComponent(n); } catch (e) { toast(e.message); }
  };
  $(".save", p).onclick = async () => {
    try {
      await api("order", { name: o.name, status: $("[name=status]", p).value, payment_status: $("[name=payment_status]", p).value, admin_note: $("[name=admin_note]", p).value });
      toast("Saved"); closePanel(); route();
    } catch (e) { toast(e.message); }
  };
}

/* ---------- products ---------- */
async function viewProducts() {
  const list = await api("products");
  const cats = [...new Set(list.map((p) => p.category).filter(Boolean))].sort();
  $("#view").innerHTML = `
  <section class="card">
    <div class="head"><h3>Products</h3><div class="tools">
      <input type="search" class="q" placeholder="Search products">
      ${features.categories && cats.length ? `<select class="cat"><option value="">All categories</option>${cats.map((c) => `<option>${esc(c)}</option>`).join("")}</select>` : ""}
      <button class="btn add">Add product</button></div></div>
    <div class="twrap"><table>
      <thead><tr><th></th><th>Name</th><th>Code</th>${features.categories ? "<th>Category</th>" : ""}<th>Price</th>${features.inventory ? "<th>Stock</th>" : ""}<th>Shown</th></tr></thead>
      <tbody></tbody></table></div>
  </section>`;
  const draw = () => {
    const q = $(".q").value.toLowerCase(), c = $(".cat")?.value || "";
    const rows = list.filter((p) => (!c || p.category === c) && (!q || (p.name + " " + p.code).toLowerCase().includes(q)));
    $("#view tbody").innerHTML = rows.length ? rows.map((p) => `
      <tr data-k="${esc(p.code)}">
        <td>${p.image ? `<img class="thumb" src="${esc(p.image)}" alt="">` : '<span class="thumb" style="display:inline-block"></span>'}</td>
        <td>${esc(p.name)}</td><td>${esc(p.code)}</td>${features.categories ? `<td>${esc(p.category) || "—"}</td>` : ""}<td>${money(p.price)}</td>
        ${features.inventory ? `<td>${p.stock}</td>` : ""}<td><span class="chip">${p.active ? "Yes" : "No"}</span></td>
      </tr>`).join("") : '<tr><td colspan="7" class="empty">No products</td></tr>';
  };
  $(".q").oninput = draw;
  if ($(".cat")) $(".cat").onchange = draw;
  $(".add").onclick = () => editProduct({ active: 1, stock: 0 }, cats);
  $("#view tbody").onclick = (e) => { const tr = e.target.closest("tr[data-k]"); if (tr) editProduct(list.find((p) => p.code === tr.dataset.k), cats); };
  draw();
}
function editProduct(p, cats) {
  const isNew = !p.code;
  const el = panel(`
    <h3>${isNew ? "Add product" : esc(p.name)}</h3>
    <div class="field"><span>Image</span><div class="img"></div></div>
    <label class="field"><span>Name</span><input name="name" value="${esc(p.name)}" required></label>
    <label class="field"><span>Code (same as the website product id)</span><input name="code" value="${esc(p.code)}" ${isNew ? "" : "readonly"}></label>
    <div class="row2">
      <label class="field"><span>Price</span><input name="price" type="number" min="0" step="0.01" value="${p.price ?? ""}"></label>
      <label class="field"><span>Old price</span><input name="compare_price" type="number" min="0" step="0.01" value="${p.compare_price || ""}"></label>
    </div>
    <div class="row2">
      ${features.inventory ? `<label class="field"><span>Stock</span><input name="stock" type="number" min="0" value="${p.stock ?? 0}"></label>` : `<input name="stock" type="hidden" value="${p.stock ?? 0}">`}
      <label class="field"><span>Shown on website</span><select name="active"><option value="1">Yes</option><option value="0" ${p.active ? "" : "selected"}>No</option></select></label>
    </div>
    ${features.categories ? `<label class="field"><span>Category</span><input name="category" list="catlist" value="${esc(p.category)}"><datalist id="catlist">${cats.map((c) => `<option value="${esc(c)}">`).join("")}</datalist></label>` : `<input name="category" type="hidden" value="${esc(p.category)}">`}
    <label class="field"><span>Description</span><textarea name="description" rows="3">${esc(p.description)}</textarea></label>
    <button class="btn save">Save</button>
    ${isNew ? "" : '<button class="btn ghost del">Delete product</button>'}`);
  const img = imagePicker($(".img", el), p.image);
  const val = (n) => $(`[name=${n}]`, el).value;
  $(".save", el).onclick = async () => {
    try {
      await api("product", { name: val("name"), code: val("code"), price: val("price"), compare_price: val("compare_price"), stock: val("stock"),
        active: val("active"), image: img.get(), category: val("category"), description: val("description") });
      toast("Saved"); closePanel(); route();
    } catch (e) { toast(e.message); }
  };
  if ($(".del", el)) $(".del", el).onclick = async () => {
    if (!confirm(`Delete ${p.name}? This cannot be undone.`)) return;
    await api("product/delete", { code: p.code }); toast("Deleted"); closePanel(); route();
  };
}

/* ---------- settings ---------- */
/* ---------- invoices ---------- */
async function viewInvoices() {
  const list = await api("invoices");
  $("#view").innerHTML = `<section class="card">
    <div class="head"><h3>Invoices</h3><div class="tools"><input type="search" class="q" placeholder="Search invoice, order, customer"><button class="btn exp">Export</button></div></div>
    <div class="twrap"><table><thead><tr><th>Invoice</th><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Paid</th></tr></thead><tbody></tbody></table></div></section>`;
  let shown = list;
  const draw = () => {
    const q = $(".q").value.toLowerCase();
    shown = list.filter((i) => !q || [i.name, i.order_name, i.customer_name].some((v) => String(v || "").toLowerCase().includes(q)));
    $("#view tbody").innerHTML = shown.length ? shown.map((i) => `<tr data-k="${esc(i.name)}"><td><b>${esc(i.name)}</b></td><td>${esc(i.order_name)}</td>
      <td>${esc(i.customer_name)}</td><td>${esc(day(i.created))}</td><td>${money(i.total)}</td><td><span class="chip">${esc(i.payment_status)}</span></td></tr>`).join("")
      : '<tr><td colspan="6" class="empty">No invoices yet. Open an order and press "Create invoice".</td></tr>';
  };
  $(".q").oninput = draw;
  $(".exp").onclick = () => csv("invoices.csv", ["Invoice", "Order", "Customer", "Date", "Total", "Paid"],
    shown.map((i) => [i.name, i.order_name, i.customer_name, i.created, i.total, i.payment_status]));
  $("#view tbody").onclick = (e) => { const tr = e.target.closest("tr[data-k]"); if (tr) location.href = "invoice.html?name=" + encodeURIComponent(tr.dataset.k); };
  draw();
}

/* ---------- new order (phone / walk-in) ---------- */
async function newOrder() {
  const products = (await api("products")).filter((p) => p.active);
  const opts = products.map((p) => `<option value="${esc(p.code)}">${esc(p.name)} · ${money(p.price)}</option>`).join("");
  const row = () => `<div class="row2 line"><select class="pr">${opts}</select><input class="qt" type="number" min="1" max="20" value="1"></div>`;
  const el = panel(`
    <h3>New order</h3>
    <div class="row2"><label class="field"><span>Name</span><input name="customer_name"></label><label class="field"><span>Phone</span><input name="phone"></label></div>
    <label class="field"><span>Email</span><input name="email" type="email"></label>
    <div class="row2"><label class="field"><span>Address</span><input name="address"></label><label class="field"><span>City</span><input name="city"></label></div>
    <div class="field"><span>Products</span><div class="lines">${row()}</div><button type="button" class="btn ghost addl">Add another product</button></div>
    <div class="row2">
      <label class="field"><span>Payment</span><select name="payment_method">${["Cash on Delivery", "Cash", "Card", "Bank Transfer", "WhatsApp"].map((x) => `<option>${x}</option>`).join("")}</select></label>
      ${features.coupons ? '<label class="field"><span>Coupon</span><input name="coupon"></label>' : ""}
    </div>
    <label class="field"><span>Notes</span><textarea name="notes" rows="2"></textarea></label>
    <button class="btn save">Create order</button>`);
  $(".addl", el).onclick = () => $(".lines", el).insertAdjacentHTML("beforeend", row());
  $(".save", el).onclick = async () => {
    const v = (n) => $(`[name=${n}]`, el)?.value || "";
    const items = [...el.querySelectorAll(".line")].map((l) => ({ id: $(".pr", l).value, qty: $(".qt", l).value }));
    try {
      const r = await api("order/new", { customer_name: v("customer_name"), phone: v("phone"), email: v("email"), address: v("address"), city: v("city"),
        payment_method: v("payment_method"), coupon: v("coupon"), notes: v("notes"), items });
      toast(`Order ${r.order} created`); closePanel(); route();
    } catch (e) { toast(e.message); }
  };
}

/* ---------- sidebar collapse ---------- */
function setupSidebar() {
  document.querySelectorAll("#nav a, #logout").forEach((a) => {
    if (a.querySelector(".label")) return;
    const text = [...a.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim());
    text.forEach((n) => { const s = document.createElement("span"); s.className = "label"; s.textContent = n.textContent.trim(); n.replaceWith(s); });
  });
  let collapsed = false;
  try { collapsed = localStorage.getItem("sa_collapsed") === "1"; } catch {}
  document.body.classList.toggle("collapsed", collapsed);
  $("#collapseBtn").onclick = () => {
    const c = document.body.classList.toggle("collapsed");
    try { localStorage.setItem("sa_collapsed", c ? "1" : "0"); } catch {}
  };
}

/* ---------- settings ---------- */
const FEATURE_NAMES = { customers: "Customers", coupons: "Coupons", inventory: "Stock tracking", shipping: "Shipping fees", categories: "Categories",
  reports: "Reports", invoices: "Invoices", tax: "Tax" };
async function viewSettings() {
  const s = await api("settings");
  const f = (k, label, type = "text", extra = "") => `<label class="field"><span>${label}</span><input name="${k}" type="${type}" value="${esc(s[k])}" ${extra}></label>`;
  const c = (k, label) => `<label class="check"><input type="checkbox" name="${k}" ${s[k] === "1" ? "checked" : ""}>${label}</label>`;
  $("#view").innerHTML = `
  <form id="setForm" class="setgrid">
    <section class="card"><h3>Store</h3>
      <div class="field"><span>Logo (PNG recommended)</span><div class="logo"></div></div>
      ${f("store_name", "Store name")}
      <div class="row2">${f("currency", "Currency code (AED, USD, EUR…)", "text", 'maxlength="3" style="text-transform:uppercase"')}${f("locale", "Number format (en-US, en-AE, fr-FR…)")}</div>
      ${f("site_url", "Website address", "url")}
      ${f("allow_origin", "Allowed website (* = any)")}
    </section>
    <section class="card"><h3>Company details</h3>
      ${f("company_address", "Address")}
      <div class="row2">${f("company_phone", "Phone")}${f("company_email", "Email", "email")}</div>
      ${f("whatsapp_number", "WhatsApp number")}
      <h3>Invoices</h3>
      <div class="row2">${f("invoice_prefix", "Invoice number prefix")}${f("tax_number", "Tax / VAT number")}</div>
      ${f("invoice_note", "Note at the bottom of invoices")}
    </section>
    <section class="card"><h3>Features</h3>
      <div class="switches">${Object.entries(FEATURE_NAMES).map(([k, l]) => c("feature_" + k, l)).join("")}</div>
      <h3>Tax</h3>
      <div class="row2">${f("tax_label", "Tax name (VAT, GST…)")}${f("tax_rate", "Tax rate %", "number", 'min="0" max="100" step="0.01"')}</div>
      ${c("tax_included", "Prices already include tax")}
      <h3>Shipping and stock</h3>
      <div class="row2">${f("shipping_fee", "Shipping fee", "number", 'min="0" step="0.01"')}${f("free_shipping_over", "Free shipping over (0 = never)", "number", 'min="0" step="0.01"')}</div>
      ${f("low_stock", "Low stock alert at", "number", 'min="0"')}
    </section>
    <section class="card"><h3>Payments</h3>
      <div class="switches">${c("enable_card", "Card (Stripe)")}${c("enable_cash_on_delivery", "Cash on delivery")}${c("enable_whatsapp", "WhatsApp order")}</div>
      ${f("stripe_secret_key", "Stripe secret key", "password", 'autocomplete="off"')}
      ${f("stripe_webhook_secret", "Stripe webhook secret", "password", 'autocomplete="off"')}
      <p class="muted" style="margin:0">Webhook URL: <b>${esc(location.origin)}/api/method/store_admin.api.stripe_webhook</b> · event <b>checkout.session.completed</b></p>
      <h3>Admin password</h3>
      ${f("new_password", "New password", "password", 'autocomplete="new-password" placeholder="Leave empty to keep"')}
    </section>
    <div class="setsave"><button class="btn" type="submit">Save settings</button></div>
  </form>`;
  const logo = imagePicker($(".logo"), s.logo);
  $("#setForm").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target), body = Object.fromEntries(fd);
    for (const k of ["enable_card", "enable_cash_on_delivery", "enable_whatsapp", "tax_included", ...Object.keys(FEATURE_NAMES).map((x) => "feature_" + x)]) body[k] = fd.get(k) ? "1" : "0";
    body.currency = String(body.currency || "").toUpperCase();
    body.logo = logo.get();
    try { await api("settings", body); toast("Saved"); start(); } catch (err) { toast(err.message); }
  };
}

setupSidebar();
start();
