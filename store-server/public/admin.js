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
let currency = "";
const money = (n) => `${currency} ${Number(n || 0).toLocaleString("en-US")}`;
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

async function start() {
  try {
    const me = await api("me");
    $("#brand").textContent = me.store_name;
    document.title = me.store_name + " · Admin";
    $("#login").hidden = true; $("#app").hidden = false;
    route();
  } catch { showLogin(); }
}

/* ---------- views ---------- */
const VIEWS = { dashboard: viewDashboard, orders: viewOrders, products: viewProducts, settings: viewSettings };
function route() {
  const v = VIEWS[location.hash.slice(1)] ? location.hash.slice(1) : "dashboard";
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

function exportCsv(rows) {
  const head = ["Order", "Customer", "Phone", "City", "Payment", "Total", "Date", "Status", "Paid"];
  const data = [head, ...rows.map((o) => [o.name, o.customer_name, o.phone, o.city, o.payment_method, o.total, o.created, o.status, o.payment_status])];
  const csv = data.map((l) => l.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "orders.csv"; a.click();
}

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
  currency = d.currency;
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
  $(".dash", view).append(ordersBlock("Manage Orders", orders, 8));
}

async function viewOrders() {
  const [orders, d] = await Promise.all([api("orders"), api("dashboard")]);
  currency = d.currency;
  $("#view").innerHTML = "";
  $("#view").append(ordersBlock("All Orders", orders));
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
      <tr><td><b>Total</b></td><td></td><td><b>${money(o.total)}</b></td></tr></tbody></table></div>
    <div class="row2">
      <label class="field"><span>Status</span><select name="status">${STATUSES.map((s) => `<option ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}</select></label>
      <label class="field"><span>Payment</span><select name="payment_status">${["Unpaid", "Paid", "Refunded"].map((s) => `<option ${s === o.payment_status ? "selected" : ""}>${s}</option>`).join("")}</select></label>
    </div>
    <button class="btn save">Save</button>`);
  $(".save", p).onclick = async () => {
    await api("order", { name: o.name, status: $("[name=status]", p).value, payment_status: $("[name=payment_status]", p).value });
    toast("Saved"); closePanel(); route();
  };
}

/* ---------- products ---------- */
async function viewProducts() {
  const [list, d] = await Promise.all([api("products"), api("dashboard")]);
  currency = d.currency;
  $("#view").innerHTML = `
  <section class="card">
    <div class="head"><h3>Products</h3><div class="tools"><button class="btn add">Add product</button></div></div>
    <div class="twrap"><table>
      <thead><tr><th></th><th>Name</th><th>Code</th><th>Price</th><th>Stock</th><th>Shown</th></tr></thead>
      <tbody>${list.length ? list.map((p) => `
        <tr data-k="${esc(p.code)}">
          <td>${p.image ? `<img class="thumb" src="${esc(p.image)}" alt="">` : '<span class="thumb" style="display:inline-block"></span>'}</td>
          <td>${esc(p.name)}</td><td>${esc(p.code)}</td><td>${money(p.price)}</td><td>${p.stock}</td>
          <td><span class="chip">${p.active ? "Yes" : "No"}</span></td>
        </tr>`).join("") : '<tr><td colspan="6" class="empty">No products yet</td></tr>'}</tbody>
    </table></div>
  </section>`;
  $(".add").onclick = () => editProduct({ active: 1, stock: 0 });
  $("#view tbody").onclick = (e) => { const tr = e.target.closest("tr[data-k]"); if (tr) editProduct(list.find((p) => p.code === tr.dataset.k)); };
}
function editProduct(p) {
  const isNew = !p.code;
  const el = panel(`
    <h3>${isNew ? "Add product" : esc(p.name)}</h3>
    <label class="field"><span>Name</span><input name="name" value="${esc(p.name)}" required></label>
    <label class="field"><span>Code (same as the website product id)</span><input name="code" value="${esc(p.code)}" ${isNew ? "" : "readonly"}></label>
    <div class="row2">
      <label class="field"><span>Price</span><input name="price" type="number" min="0" step="0.01" value="${p.price ?? ""}"></label>
      <label class="field"><span>Old price (optional)</span><input name="compare_price" type="number" min="0" step="0.01" value="${p.compare_price || ""}"></label>
    </div>
    <div class="row2">
      <label class="field"><span>Stock</span><input name="stock" type="number" min="0" value="${p.stock ?? 0}"></label>
      <label class="field"><span>Shown on website</span><select name="active"><option value="1">Yes</option><option value="0" ${p.active ? "" : "selected"}>No</option></select></label>
    </div>
    <label class="field"><span>Image URL</span><input name="image" value="${esc(p.image)}"></label>
    <button class="btn save">Save</button>
    ${isNew ? "" : '<button class="btn ghost del">Delete product</button>'}`);
  const val = (n) => $(`[name=${n}]`, el).value;
  $(".save", el).onclick = async () => {
    try {
      await api("product", { name: val("name"), code: val("code"), price: val("price"), compare_price: val("compare_price"), stock: val("stock"), active: val("active"), image: val("image") });
      toast("Saved"); closePanel(); route();
    } catch (e) { toast(e.message); }
  };
  if ($(".del", el)) $(".del", el).onclick = async () => {
    if (!confirm(`Delete ${p.name}? This cannot be undone.`)) return;
    await api("product/delete", { code: p.code }); toast("Deleted"); closePanel(); route();
  };
}

/* ---------- settings ---------- */
async function viewSettings() {
  const s = await api("settings");
  const f = (k, label, type = "text") => `<label class="field"><span>${label}</span><input name="${k}" type="${type}" value="${esc(s[k])}"></label>`;
  const c = (k, label) => `<label class="check"><input type="checkbox" name="${k}" ${s[k] === "1" ? "checked" : ""}>${label}</label>`;
  $("#view").innerHTML = `
  <section class="card"><form class="form" id="setForm">
    <h3>Store</h3>
    ${f("store_name", "Store name")}
    <div class="row2">${f("currency", "Currency (e.g. AED, USD)")}${f("whatsapp_number", "WhatsApp number (country code, no +)")}</div>
    ${f("site_url", "Website address (e.g. https://mystore.com)")}
    ${f("allow_origin", "Website allowed to call this server (* = any)")}
    <h3>Payment options</h3>
    ${c("enable_cash_on_delivery", "Cash on delivery")}
    ${c("enable_card", "Card payment (Stripe)")}
    ${f("stripe_secret_key", "Stripe secret key", "password")}
    ${f("stripe_webhook_secret", "Stripe webhook signing secret", "password")}
    <p class="muted" style="margin:0">Stripe webhook URL: <b>${esc(location.origin)}/api/method/store_admin.api.stripe_webhook</b> (event: checkout.session.completed)</p>
    <h3>Admin password</h3>
    ${f("new_password", "New password (leave empty to keep)", "password")}
    <div><button class="btn" type="submit">Save settings</button></div>
  </form></section>`;
  $("#setForm").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target), body = Object.fromEntries(fd);
    body.enable_cash_on_delivery = fd.get("enable_cash_on_delivery") ? "1" : "0";
    body.enable_card = fd.get("enable_card") ? "1" : "0";
    try { await api("settings", body); toast("Saved"); viewSettings(); } catch (err) { toast(err.message); }
  };
}

start();
