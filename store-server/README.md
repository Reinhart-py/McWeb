# Store Server

A small backend and admin panel for any online shop. It handles:

- orders
- products
- card payments (Stripe)
- cash on delivery
- WhatsApp orders

**No npm packages. No Docker. No database to install.** It only needs Node.js 22.5 or newer, because it uses Node's built-in SQLite. It works the same on Windows, macOS, Linux and Android (Termux).

## Run it

```bash
npm start
```

Open http://localhost:8800/admin/

- **First run:** the server prints a random admin password and also saves it in `data/first-password.txt`. Log in, then change it in **Settings**.
- **Termux:** run `pkg install nodejs`, then `npm start`.
- **Moving computers:** copy the whole folder, including `data/`. All orders and products live in `data/store.db`.

### Options (environment variables, all optional)

| Name | Default | What it does |
|---|---|---|
| `PORT` | `8800` | Port to listen on |
| `HOST` | `0.0.0.0` | Address to listen on |
| `DATA_DIR` | `./data` | Where the database is kept |
| `ADMIN_PASSWORD` | — | Sets or resets the admin password at start |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | — | Stripe keys (you can also set them in Settings) |

## Admin panel

- **Dashboard:**
  - quick stats
  - monthly chart (orders and paid)
  - pending orders
  - orders table with a Status filter and CSV export
- **Orders:** search, filter, and open an order to change its status or payment.
- **Products:** add, edit, hide or delete products.
- **Settings:**
  - store name, currency, WhatsApp number, website address
  - payment options
  - Stripe keys
  - admin password

Also: **Customers**, **Coupons** (percent or fixed, minimum order, use limit), **Reports** (sales by day, product and payment, CSV export), **stock tracking** with low-stock alerts, **shipping fee** with free-shipping limit, **categories**, a logo, and image upload or image URL for products. Turn each one on or off in **Settings → Features**. Uploaded images are saved in `data/uploads/`.

**Invoices:** open an order and press **Create invoice**. You get a printable invoice (or tax invoice) with your logo, company details, tax and totals. Print it or save it as a PDF. Each invoice keeps a copy of the order, so later changes don't alter it. **Orders → New order** adds phone or walk-in orders. The menu can be collapsed to icons only.

## Store config

`store.config.json` holds the first-run defaults:

- store name, currency, number format
- company details, tax, invoice prefix
- which product seed file to use

Point to a different file with `STORE_CONFIG=path/to/file.json npm start`. Anything saved in the admin Settings page takes priority over the file.

## Connect a website

The shop API uses the same paths as the Frappe app in `../store_admin`, so a website works with either backend.

| Call | Method | Use |
|---|---|---|
| `/api/method/store_admin.api.get_store_config` | GET | Store name, currency, which payments are on |
| `/api/method/store_admin.api.create_order` | POST JSON | `{customer_name, phone, email, address, city, notes, payment_method, items:[{id, qty}]}` |
| `/api/method/store_admin.api.order_status?order=ORD-00001` | GET | Order status and total |
| `/api/method/store_admin.api.stripe_webhook` | POST | Stripe sends payment results here |

- `payment_method` is one of `Card`, `Cash on Delivery` or `WhatsApp`.
- Prices always come from the server, never from the browser.
- Each product **code** must match the product id on the website.

**MC website:** in `mc-site/assets/data.js`, set `STORE_API = "https://your-server-address"`. When it is empty, checkout only offers WhatsApp.

## Card payments (Stripe)

1. In Settings:
   - turn on **Card payment**
   - paste the Stripe **secret key**
   - fill in **Website address** (customers come back to `order-success.html` after paying)
2. In the Stripe dashboard:
   - add a webhook to `https://your-server-address/api/method/store_admin.api.stripe_webhook`
   - use the event `checkout.session.completed`
   - paste its signing secret in Settings
3. Card payment needs the server on a public HTTPS address, for example any VPS, Render or Railway, or a Cloudflare Tunnel from your own machine.

## Use it for another shop

Edit `seed-products.json` (store name, currency, products) **before the first run**, or delete `data/store.db` to start fresh. You can also add products from the admin panel.
