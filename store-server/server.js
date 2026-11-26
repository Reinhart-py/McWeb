// Store server: shop API + admin panel. Node 22.5+ only, no npm packages.
// Runs the same on Windows, macOS, Linux and Termux:  npm start
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8800);
const HOST = process.env.HOST || "0.0.0.0";
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, "data");
fs.mkdirSync(DATA_DIR, { recursive: true });

/* ---------- database ---------- */
const db = new DatabaseSync(path.join(DATA_DIR, "store.db"));
db.exec(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
CREATE TABLE IF NOT EXISTS products (
  code TEXT PRIMARY KEY, name TEXT NOT NULL, price REAL NOT NULL DEFAULT 0,
  compare_price REAL DEFAULT 0, stock INTEGER DEFAULT 0, active INTEGER DEFAULT 1, image TEXT DEFAULT '');
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE,
  customer_name TEXT, phone TEXT, email TEXT, address TEXT, city TEXT, notes TEXT,
  status TEXT DEFAULT 'Pending', payment_method TEXT, payment_status TEXT DEFAULT 'Unpaid',
  total REAL DEFAULT 0, stripe_session_id TEXT, source TEXT DEFAULT 'Website',
  created TEXT DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS order_items (
  order_name TEXT, code TEXT, name TEXT, qty INTEGER, rate REAL, amount REAL);
`);

const DEFAULTS = {
  store_name: "My Store", currency: "AED", whatsapp_number: "", site_url: "",
  allow_origin: "*", enable_cash_on_delivery: "1", enable_card: "0",
  stripe_secret_key: process.env.STRIPE_SECRET_KEY || "",
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET || "",
};
const getSetting = (k) => db.prepare("SELECT value FROM settings WHERE key=?").get(k)?.value ?? DEFAULTS[k] ?? "";
const setSetting = (k, v) => db.prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(k, String(v ?? ""));

// First run: load products from seed-products.json (edit that file for another store)
if (!db.prepare("SELECT COUNT(*) n FROM products").get().n) {
  const seedFile = path.join(ROOT, "seed-products.json");
  if (fs.existsSync(seedFile)) {
    const seed = JSON.parse(fs.readFileSync(seedFile, "utf8"));
    for (const [k, v] of Object.entries(seed.settings || {})) setSetting(k, v);
    const ins = db.prepare("INSERT INTO products(code,name,price,compare_price,stock,active,image) VALUES(?,?,?,?,?,1,?)");
    for (const p of seed.products || []) ins.run(p.code, p.name, p.price, p.compare_price || 0, p.stock ?? 100, p.image || "");
  }
}

/* ---------- admin password ---------- */
const hashPw = (pw, salt = crypto.randomBytes(16).toString("hex")) =>
  salt + ":" + crypto.scryptSync(pw, salt, 32).toString("hex");
const checkPw = (pw, stored) => {
  const [salt, h] = String(stored).split(":");
  if (!salt || !h) return false;
  const a = Buffer.from(hashPw(pw, salt).split(":")[1], "hex"), b = Buffer.from(h, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};
if (process.env.ADMIN_PASSWORD) setSetting("admin_password", hashPw(process.env.ADMIN_PASSWORD));
if (!getSetting("admin_password")) {
  const pw = crypto.randomBytes(6).toString("base64url");
  setSetting("admin_password", hashPw(pw));
  fs.writeFileSync(path.join(DATA_DIR, "first-password.txt"), pw + "\n");
  console.log(`\n  First admin password: ${pw}\n  (also saved in data/first-password.txt — change it in Settings)\n`);
}
const sessions = new Map(); // token -> expiry ms
const SESSION_MS = 12 * 60 * 60 * 1000;

/* ---------- helpers ---------- */
const STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
const PAY_STATUSES = ["Unpaid", "Paid", "Refunded"];
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon" };

function send(res, code, body, headers = {}) {
  const isObj = typeof body === "object" && !Buffer.isBuffer(body);
  res.writeHead(code, { "Content-Type": isObj ? "application/json" : "text/plain; charset=utf-8", ...headers });
  res.end(isObj ? JSON.stringify(body) : body);
}
const ok = (res, message, h) => send(res, 200, { message }, h);
const fail = (res, code, error, h) => send(res, code, { error }, h);

function readBody(req, limit = 1e6) {
  return new Promise((resolve, reject) => {
    const chunks = []; let size = 0;
    req.on("data", (c) => { size += c.length; if (size > limit) { reject(new Error("too big")); req.destroy(); } else chunks.push(c); });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}
function parseBody(raw, type = "") {
  const s = raw.toString("utf8");
  if (!s) return {};
  if (type.includes("application/json")) return JSON.parse(s);
  return Object.fromEntries(new URLSearchParams(s));
}
const cookies = (req) => Object.fromEntries((req.headers.cookie || "").split(";").map((c) => c.trim().split("=").map(decodeURIComponent)).filter((p) => p[0]));
function isAdmin(req) {
  const t = cookies(req).sa_session, exp = t && sessions.get(t);
  if (!exp || exp < Date.now()) { if (t) sessions.delete(t); return false; }
  return true;
}
const clean = (v, max = 300) => String(v ?? "").trim().slice(0, max);
const money = (n) => Math.round(Number(n || 0) * 100) / 100;

/* ---------- shop logic ---------- */
function storeConfig() {
  return {
    store_name: getSetting("store_name"), currency: getSetting("currency"),
    whatsapp_number: getSetting("whatsapp_number"),
    payment_options: {
      cash_on_delivery: getSetting("enable_cash_on_delivery") === "1",
      card: getSetting("enable_card") === "1" && !!getSetting("stripe_secret_key"),
    },
  };
}

async function createOrder(b) {
  const customer_name = clean(b.customer_name, 120), phone = clean(b.phone, 30);
  const address = clean(b.address, 500), city = clean(b.city, 80);
  const payment_method = clean(b.payment_method, 30);
  if (!customer_name || !phone || !address || !city) throw new Error("Please fill name, phone, address and city.");
  const cfg = storeConfig().payment_options;
  const allowed = { "Card": cfg.card, "Cash on Delivery": cfg.cash_on_delivery, "WhatsApp": true };
  if (!allowed[payment_method]) throw new Error("This payment option is not available.");

  let items = b.items;
  if (typeof items === "string") items = JSON.parse(items);
  if (!Array.isArray(items) || !items.length || items.length > 50) throw new Error("Your bag is empty.");
  const lines = items.map((i) => {
    const qty = parseInt(i.qty, 10);
    if (!(qty >= 1 && qty <= 20)) throw new Error("Quantity must be 1 to 20.");
    const p = db.prepare("SELECT * FROM products WHERE code=? AND active=1").get(clean(i.id, 80));
    if (!p) throw new Error("A product in your bag is no longer available.");
    return { code: p.code, name: p.name, qty, rate: p.price, amount: money(p.price * qty) };
  });
  const total = money(lines.reduce((s, l) => s + l.amount, 0));

  db.exec("BEGIN");
  let name;
  try {
    const r = db.prepare(`INSERT INTO orders(customer_name,phone,email,address,city,notes,payment_method,total)
      VALUES(?,?,?,?,?,?,?,?)`).run(customer_name, phone, clean(b.email, 120), address, city, clean(b.notes, 1000), payment_method, total);
    name = "ORD-" + String(r.lastInsertRowid).padStart(5, "0");
    db.prepare("UPDATE orders SET name=? WHERE id=?").run(name, r.lastInsertRowid);
    const ins = db.prepare("INSERT INTO order_items(order_name,code,name,qty,rate,amount) VALUES(?,?,?,?,?,?)");
    for (const l of lines) ins.run(name, l.code, l.name, l.qty, l.rate, l.amount);
    db.exec("COMMIT");
  } catch (e) { db.exec("ROLLBACK"); throw e; }

  const out = { order: name, total, currency: getSetting("currency") };
  if (payment_method === "Card") out.checkout_url = await stripeCheckout(name, lines, clean(b.email, 120));
  return out;
}

async function stripeCheckout(order, lines, email) {
  const site = getSetting("site_url").replace(/\/$/, "");
  if (!site) throw new Error("Card payment is not set up (site URL missing).");
  const f = new URLSearchParams({
    mode: "payment", client_reference_id: order, "metadata[order]": order,
    success_url: `${site}/order-success.html?order=${order}`,
    cancel_url: `${site}/checkout.html?cancelled=1`,
  });
  if (email) f.set("customer_email", email);
  lines.forEach((l, i) => {
    f.set(`line_items[${i}][quantity]`, l.qty);
    f.set(`line_items[${i}][price_data][currency]`, getSetting("currency").toLowerCase());
    f.set(`line_items[${i}][price_data][unit_amount]`, Math.round(l.rate * 100));
    f.set(`line_items[${i}][price_data][product_data][name]`, l.name);
  });
  const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST", body: f,
    headers: { Authorization: `Bearer ${getSetting("stripe_secret_key")}` },
  });
  const j = await r.json();
  if (!r.ok) { console.error("Stripe:", j.error?.message); throw new Error("Card payment could not start. Please try another option."); }
  db.prepare("UPDATE orders SET stripe_session_id=? WHERE name=?").run(j.id, order);
  return j.url;
}

function stripeWebhook(raw, sigHeader) {
  const secret = getSetting("stripe_webhook_secret");
  if (!secret) throw new Error("webhook secret not set");
  const parts = Object.fromEntries(String(sigHeader || "").split(",").map((p) => p.split("=")));
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > 300) throw new Error("bad timestamp");
  const expected = crypto.createHmac("sha256", secret).update(`${t}.${raw.toString("utf8")}`).digest();
  const sigs = String(sigHeader).split(",").filter((p) => p.startsWith("v1=")).map((p) => Buffer.from(p.slice(3), "hex"));
  if (!sigs.some((s) => s.length === expected.length && crypto.timingSafeEqual(s, expected))) throw new Error("bad signature");
  const ev = JSON.parse(raw.toString("utf8"));
  if (ev.type === "checkout.session.completed" && ev.data?.object?.payment_status === "paid") {
    const s = ev.data.object, order = s.metadata?.order || s.client_reference_id;
    db.prepare("UPDATE orders SET payment_status='Paid', status=CASE WHEN status='Pending' THEN 'Confirmed' ELSE status END WHERE name=? AND stripe_session_id=?").run(order, s.id);
  }
}

/* ---------- admin data ---------- */
function dashboard() {
  const one = (sql, ...a) => db.prepare(sql).get(...a);
  const cur = getSetting("currency");
  const total = one("SELECT COUNT(*) n FROM orders").n;
  const revenue = one("SELECT COALESCE(SUM(total),0) s FROM orders WHERE payment_status='Paid'").s;
  const paid = one("SELECT COUNT(*) n FROM orders WHERE payment_status='Paid'").n;
  const customers = one("SELECT COUNT(DISTINCT phone) n FROM orders").n;
  const pending = one("SELECT COUNT(*) n FROM orders WHERE status='Pending'").n;
  const cancelled = one("SELECT COUNT(*) n FROM orders WHERE status='Cancelled'").n;
  const week = one("SELECT COUNT(*) n FROM orders WHERE created >= datetime('now','-7 days')").n;

  const year = String(new Date().getFullYear());
  const months = db.prepare(`SELECT CAST(strftime('%m',created) AS INTEGER) m, COUNT(*) n,
    SUM(payment_status='Paid') p FROM orders WHERE strftime('%Y',created)=? GROUP BY m`).all(year);
  const orders = Array(12).fill(0), paidArr = Array(12).fill(0);
  for (const r of months) { orders[r.m - 1] = r.n; paidArr[r.m - 1] = r.p || 0; }

  return {
    currency: cur, week_orders: week,
    stats: [
      { label: "Total Orders", value: total, icon: "orders" },
      { label: "Revenue", value: `${cur} ${Number(revenue).toLocaleString("en-US")}`, icon: "money" },
      { label: "Paid Orders", value: paid, icon: "check", active: true },
      { label: "Customers", value: customers, icon: "users" },
      { label: "Pending", value: pending, icon: "clock" },
      { label: "Cancelled", value: cancelled, icon: "alert" },
    ],
    chart: { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], orders, paid: paidArr },
    pending: db.prepare("SELECT name,customer_name,total,payment_method,created FROM orders WHERE status='Pending' ORDER BY id DESC LIMIT 4").all(),
  };
}
function listOrders(q) {
  const where = [], args = [];
  if (STATUSES.includes(q.get("status"))) { where.push("status=?"); args.push(q.get("status")); }
  if (q.get("q")) { where.push("(name LIKE ? OR customer_name LIKE ? OR phone LIKE ?)"); const s = `%${q.get("q")}%`; args.push(s, s, s); }
  return db.prepare(`SELECT name,customer_name,phone,city,status,payment_method,payment_status,total,created FROM orders
    ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY id DESC LIMIT 500`).all(...args);
}
const SETTING_KEYS = ["store_name", "currency", "whatsapp_number", "site_url", "allow_origin", "enable_cash_on_delivery", "enable_card", "stripe_secret_key", "stripe_webhook_secret"];
const SECRET_KEYS = ["stripe_secret_key", "stripe_webhook_secret"];

/* ---------- routes ---------- */
const API = "/api/method/store_admin.api.";

async function handle(req, res) {
  const url = new URL(req.url, "http://x");
  const p = url.pathname;
  const cors = { "Access-Control-Allow-Origin": getSetting("allow_origin") || "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "GET, POST, OPTIONS" };

  // Public shop API (same paths as the Frappe app, so the website works with either)
  if (p.startsWith(API)) {
    if (req.method === "OPTIONS") return send(res, 204, "", cors);
    const fn = p.slice(API.length);
    try {
      if (fn === "get_store_config") return ok(res, storeConfig(), cors);
      if (fn === "order_status") {
        const o = db.prepare("SELECT name,status,payment_status,total FROM orders WHERE name=?").get(clean(url.searchParams.get("order"), 20));
        return o ? ok(res, o, cors) : fail(res, 404, "Order not found", cors);
      }
      if (fn === "create_order" && req.method === "POST") {
        const raw = await readBody(req);
        return ok(res, await createOrder(parseBody(raw, req.headers["content-type"])), cors);
      }
      if (fn === "stripe_webhook" && req.method === "POST") {
        stripeWebhook(await readBody(req), req.headers["stripe-signature"]);
        return ok(res, "ok");
      }
      return fail(res, 404, "Not found", cors);
    } catch (e) { return fail(res, 400, e.message, cors); }
  }

  // Admin login
  if (p === "/admin/api/login" && req.method === "POST") {
    const b = parseBody(await readBody(req), req.headers["content-type"]);
    if (!checkPw(String(b.password || ""), getSetting("admin_password"))) {
      await new Promise((r) => setTimeout(r, 800));
      return fail(res, 401, "Wrong password");
    }
    const t = crypto.randomBytes(24).toString("hex");
    sessions.set(t, Date.now() + SESSION_MS);
    return ok(res, "ok", { "Set-Cookie": `sa_session=${t}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_MS / 1000}` });
  }
  if (p === "/admin/api/logout") {
    sessions.delete(cookies(req).sa_session);
    return ok(res, "ok", { "Set-Cookie": "sa_session=; Path=/; Max-Age=0" });
  }

  // Admin API (login needed)
  if (p.startsWith("/admin/api/")) {
    if (!isAdmin(req)) return fail(res, 401, "Please log in");
    const b = req.method === "POST" ? parseBody(await readBody(req), req.headers["content-type"]) : {};
    const r = p.slice("/admin/api/".length);
    try {
      if (r === "me") return ok(res, { store_name: getSetting("store_name") });
      if (r === "dashboard") return ok(res, dashboard());
      if (r === "orders") return ok(res, listOrders(url.searchParams));
      if (r === "order" && req.method === "GET") {
        const o = db.prepare("SELECT * FROM orders WHERE name=?").get(url.searchParams.get("name"));
        if (!o) return fail(res, 404, "Not found");
        o.items = db.prepare("SELECT code,name,qty,rate,amount FROM order_items WHERE order_name=?").all(o.name);
        return ok(res, o);
      }
      if (r === "order" && req.method === "POST") {
        if (b.status && !STATUSES.includes(b.status)) throw new Error("Bad status");
        if (b.payment_status && !PAY_STATUSES.includes(b.payment_status)) throw new Error("Bad payment status");
        db.prepare("UPDATE orders SET status=COALESCE(?,status), payment_status=COALESCE(?,payment_status) WHERE name=?")
          .run(b.status || null, b.payment_status || null, clean(b.name, 20));
        return ok(res, "saved");
      }
      if (r === "products") return ok(res, db.prepare("SELECT * FROM products ORDER BY name").all());
      if (r === "product" && req.method === "POST") {
        const code = clean(b.code, 80).toLowerCase().replace(/[^a-z0-9-_]/g, "-");
        if (!code || !clean(b.name)) throw new Error("Code and name are needed.");
        db.prepare(`INSERT INTO products(code,name,price,compare_price,stock,active,image) VALUES(?,?,?,?,?,?,?)
          ON CONFLICT(code) DO UPDATE SET name=excluded.name, price=excluded.price, compare_price=excluded.compare_price,
          stock=excluded.stock, active=excluded.active, image=excluded.image`)
          .run(code, clean(b.name, 120), money(b.price), money(b.compare_price), parseInt(b.stock, 10) || 0, String(b.active) === "0" ? 0 : 1, clean(b.image, 500));
        return ok(res, "saved");
      }
      if (r === "product/delete" && req.method === "POST") {
        db.prepare("DELETE FROM products WHERE code=?").run(clean(b.code, 80));
        return ok(res, "deleted");
      }
      if (r === "settings" && req.method === "GET") {
        return ok(res, Object.fromEntries(SETTING_KEYS.map((k) => [k, SECRET_KEYS.includes(k) ? (getSetting(k) ? "••••••" : "") : getSetting(k)])));
      }
      if (r === "settings" && req.method === "POST") {
        for (const k of SETTING_KEYS) {
          if (!(k in b)) continue;
          if (SECRET_KEYS.includes(k) && (b[k] === "••••••")) continue;
          setSetting(k, clean(b[k], 300));
        }
        if (b.new_password) {
          if (String(b.new_password).length < 8) throw new Error("Password must be at least 8 characters.");
          setSetting("admin_password", hashPw(String(b.new_password)));
        }
        return ok(res, "saved");
      }
      return fail(res, 404, "Not found");
    } catch (e) { return fail(res, 400, e.message); }
  }

  // Admin static files
  if (p === "/" || p === "/admin") { res.writeHead(302, { Location: "/admin/" }); return res.end(); }
  if (p.startsWith("/admin/")) {
    const rel = p === "/admin/" ? "admin.html" : p.slice(7);
    const file = path.join(ROOT, "public", path.normalize(rel).replace(/^(\.\.[\\/])+/, ""));
    if (!file.startsWith(path.join(ROOT, "public")) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return fail(res, 404, "Not found");
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-cache" });
    return fs.createReadStream(file).pipe(res);
  }
  return fail(res, 404, "Not found");
}

http.createServer((req, res) => {
  handle(req, res).catch((e) => { console.error(e); if (!res.headersSent) fail(res, 500, "Server error"); });
}).listen(PORT, HOST, () => {
  console.log(`Store server running: http://localhost:${PORT}/admin/`);
});
