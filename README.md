# Millionaires Choice Parfum — Website

`mc-site` is a new website for **Millionaires Choice Parfum** (Dubai). It is a pitch demo made by our IT team to show the brand what a modern, luxury online store can look like.

The layout and feel follow [in.ajmal.com](https://in.ajmal.com/). All products, prices, logos and policy text come from MC's own site, [millionaireschoiceparfum.com](https://millionaireschoiceparfum.com/).

It is a **plain HTML + CSS + JavaScript** site. There is no build step, no framework and nothing to install. Open it in any web server and it works.

---

## Contents

* [What's Inside](#whats-inside)
* [Quick Start (30 seconds)](#quick-start-30-seconds)
* [Run It on Your Computer](#run-it-on-your-computer)
  * [Windows PowerShell](#windows-powershell)
  * [Windows: double-click (no commands)](#windows-double-click-no-commands)
  * [Mac / Linux Terminal](#mac--linux-terminal)
  * [Android: Termux](#android-termux)
  * [VS Code: Live Server](#vs-code-live-server)
* [Put It Online (Deploy)](#put-it-online-deploy)
  * [Netlify Drop (easiest, free)](#netlify-drop-easiest-free)
  * [GitHub + GitHub Pages (free)](#github--github-pages-free)
  * [Netlify from GitHub (auto-update)](#netlify-from-github-auto-update)
  * [Vercel](#vercel)
  * [Cloudflare Pages](#cloudflare-pages)
  * [Normal web hosting (cPanel / FTP)](#normal-web-hosting-cpanel--ftp)
  * [Use your own domain](#use-your-own-domain)
* [How to Edit Things](#how-to-edit-things)
* [Folder Map](#folder-map)
* [Known Limits](#known-limits)
* [FAQ / Problems](#faq--problems)

---

## What's Inside

| Page | File | What it does |
|---|---|---|
| Home | `index.html` | Full-screen hero slider (slides right to left), bestsellers with tabs, category tiles, Watch & Shop, Luxury Gifting banner, Shop by Notes, picks, mood tiles, new arrivals |
| Collection | `shop.html?c=winter` | Banner, filters (category, notes, mood, price), sort, product grid |
| Product | `product.html?id=mc1` | Photo gallery with zoom, price, free gift note, add to cart, order on WhatsApp, notes, how to use |
| Our Story | `about.html` | Real founder story from MC |
| Contact | `contact.html` | WhatsApp, phone, email, office, message form (sends on WhatsApp), Google Map |
| Policies | `policy.html?p=privacy` | Privacy, Terms, Shipping, Returns, Cruelty-Free (MC's real text) |

**Features on every page**

* Thin top line pitching the **Trial Kit (AED 200)**
* Wide search bar with a **typing animation** ("Search for MC1…") and an Ajmal-style dropdown (trending searches, top products, live results)
* Cart drawer and wishlist (saved in the visitor's browser)
* **Checkout on WhatsApp**: the cart is sent as a WhatsApp message to the MC team
* Floating WhatsApp button
* Works on phones, tablets and desktops

---

## Quick Start (30 seconds)

1. Unzip the folder.
2. Open a terminal **inside** the `mc-site` folder.
3. Run:

```
python -m http.server 8765
```

4. Open **http://localhost:8765** in your browser.

> **Why not just double-click `index.html`?**
> It mostly works, but some browsers block things on `file://` pages. A tiny local server is safer. See the double-click option below if you have no Python.

---

## Run It on Your Computer

### Windows PowerShell

1. Install Python if you don't have it: open PowerShell and run `winget install Python.Python.3.12` (or get it from [python.org](https://www.python.org/downloads/)). Close and reopen PowerShell after.
2. Go to the folder and start the server:

```powershell
cd "$HOME\Downloads\mc-site"
python -m http.server 8765
```

3. Open **http://localhost:8765**.
4. To stop it, press **Ctrl + C** in PowerShell.

**No Python? Use Node.js instead:**

```powershell
npx serve . -l 8765
```

### Windows: double-click (no commands)

Right-click `index.html` → **Open with** → Chrome or Edge.
Everything shows up. The Google Map and WhatsApp links need internet.

### Mac / Linux Terminal

```bash
cd ~/Downloads/mc-site
python3 -m http.server 8765
```

Open **http://localhost:8765**. Stop with **Ctrl + C**.

### Android: Termux

1. Install **Termux** from F-Droid (the Play Store version is old).
2. In Termux:

```bash
pkg update && pkg install python unzip
termux-setup-storage          # tap "Allow" so Termux can see your Downloads
cd ~/storage/downloads
unzip mc-site.zip
cd mc-site
python -m http.server 8765
```

3. Open **http://localhost:8765** in your phone's browser.

**Show it to someone on the same Wi-Fi:** run `ifconfig` in Termux, find your phone's IP (like `192.168.1.20`), and they open `http://192.168.1.20:8765`.

### VS Code: Live Server

1. Open the `mc-site` folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` → **Open with Live Server**. The page reloads every time you save.

---

## Put It Online (Deploy)

The site is just files, so any static host works. Pick one.

### Netlify Drop (easiest, free)

No account setup, no Git, about 1 minute.

1. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)**.
2. Drag the whole **`mc-site` folder** onto the page.
3. You get a live link like `https://mc-parfum-demo.netlify.app`.
4. Sign in (free) to keep it and to rename the link.

To update: drag the folder again in **Site → Deploys**.

### GitHub + GitHub Pages (free)

1. Make a new repository on [github.com/new](https://github.com/new), for example `mc-site`.
2. In PowerShell (needs [Git](https://git-scm.com/downloads)):

```powershell
cd "$HOME\Downloads\mc-site"
git init
git add .
git commit -m "First version of MC website"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/mc-site.git
git push -u origin main
```

3. On GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / root → Save**.
4. After about 1 minute it is live at `https://YOUR-NAME.github.io/mc-site/`.

**No terminal?** On the new repo page click **"uploading an existing file"** and drag all files in (keep the `assets` folder).

### Netlify from GitHub (auto-update)

Every time you push to GitHub, the site updates by itself.

1. Push the site to GitHub (see above).
2. In Netlify: **Add new site → Import an existing project → GitHub** → pick the repo.
3. Build command: **leave empty**. Publish directory: **`.`** (a dot).
4. Click **Deploy**.

### Vercel

1. Push to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) → import the repo.
3. Framework preset: **Other**. Build command: **empty**. Output folder: **`.`**.
4. Click **Deploy**.

Or from a terminal: `npx vercel` inside the folder and answer the questions.

### Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages → Create → Pages**.
2. Either **connect your GitHub repo** or **upload the folder** directly.
3. Build command: **none**. Output directory: **`/`**.

### Normal web hosting (cPanel / FTP)

1. Open **File Manager** in cPanel (or connect with FileZilla).
2. Go to `public_html`.
3. Upload **everything inside** `mc-site` (not the folder itself, its contents), including the `assets` folder.
4. Visit your domain.

### Use your own domain

* **Netlify:** Site → Domain management → Add a domain, then follow the DNS steps it shows.
* **GitHub Pages:** Settings → Pages → Custom domain, then add a `CNAME` record at your domain provider pointing to `YOUR-NAME.github.io`.
* **Vercel / Cloudflare:** Project → Domains → Add.

HTTPS (the lock icon) is free and automatic on all of these.

---

## How to Edit Things

| I want to change… | Edit this |
|---|---|
| Product names, prices, notes, photos | `assets/data.js` → `PRODUCTS` |
| Hero slides (order, image, link) | `assets/data.js` → `HERO` |
| Collection pages (winter, gifting…) | `assets/data.js` → `COLLECTIONS` |
| Trending search words | `assets/data.js` → `TRENDING` |
| WhatsApp number | `assets/data.js` → `WHATSAPP` (country code, no `+`) |
| Top line text, menu, footer | `assets/app.js` → `layout()` |
| Search typing words | `assets/app.js` → `initSearch()` → `words` |
| Colors, fonts, sizes | `assets/style.css` (colors at the top in `:root`) |
| Policy pages | `assets/pages.js` → `POLICIES` |
| Home page sections | `index.html` |

**Add a video to "Watch & Shop":** put `mc1.mp4` in `assets/reels/`, then in `index.html` set
`const REEL_VIDEOS = { mc1: "assets/reels/mc1.mp4" };`

**Image sizes that look good:** hero 1920 × 1080, reels 720 × 1280, notes 640 × 480. Keep each image under 300 KB.

---

## Folder Map

```
mc-site/
├── index.html        Home
├── shop.html         Collection page (?c=all|signature|parfum|winter|gifting|limited)
├── product.html      Product page (?id=mc1 … mc6, mc-le, travel-kit, trial-kit)
├── about.html        Our Story
├── contact.html      Contact
├── policy.html       Policies (?p=privacy|terms|shipping|returns|cruelty)
├── assets/
│   ├── style.css     All styles
│   ├── app.js        Header, search, cart, footer, product card
│   ├── data.js       Products, hero, collections (edit content here)
│   ├── pages.js      Policy text (from MC's website)
│   ├── hero/         Hero + Luxury Gifting banners (made in Google Flow)
│   ├── reels/        Watch & Shop vertical photos (made in Google Flow)
│   └── notes/        Shop by Notes photos (made in Google Flow)
├── README.md         This file
├── CHANGELOG.md      What changed
└── HANDOFF.md        Full notes for the next person / AI
```

---

## Known Limits

* **No real payment yet.** Checkout sends the order on WhatsApp. For card payments, connect Shopify, WooCommerce or Stripe.
* **Product photos load from MC's current website** (`millionaireschoiceparfum.com`). If they change their site, those photos break. Download them into `assets/` before going live.
* **Email signup** opens the visitor's email app with a message to MC. A real newsletter needs Mailchimp, Klaviyo or similar.
* **No videos yet** in Watch & Shop (photos for now).
* **Hero banners are desktop images.** On phones they show smaller. Phone-shaped banners can be made later.
* Cart and wishlist live in the visitor's browser only.

---

## FAQ / Problems

**The page is blank or styles are missing.**
Make sure you started the server **inside** the `mc-site` folder (the one with `index.html`).

**`python` is not recognized.**
Install Python and tick **"Add Python to PATH"**, or use `npx serve . -l 8765`.

**Port 8765 is busy.**
Use another number: `python -m http.server 9000` → open `http://localhost:9000`.

**Product photos don't show.**
You are offline. Those photos come from MC's live website.

**GitHub Pages shows 404.**
Wait 1–2 minutes, and check that `index.html` is in the root of the repo, not inside a sub-folder.
