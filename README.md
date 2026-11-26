# McWeb — Millionaires Choice Parfum Website

**McWeb** is a new website for **Millionaires Choice Parfum** (Dubai), built as a pitch demo.

* The look and feel follow [in.ajmal.com](https://in.ajmal.com/).
* All products, prices, logos and policy text come from MC's own site, [millionaireschoiceparfum.com](https://millionaireschoiceparfum.com/).
* It is **plain HTML + CSS + JavaScript**. There's no build step, no framework and nothing to install.

**Repo:** https://github.com/Reinhart-py/McWeb
**Live demo (after GitHub Pages is on):** https://reinhart-py.github.io/McWeb/

---

## Contents

* [What's Inside](#whats-inside)
* [Quick Start](#quick-start)
* [Run It on Your Computer](#run-it-on-your-computer)
  * [Windows PowerShell](#windows-powershell)
  * [Mac / Linux Terminal](#mac--linux-terminal)
  * [Android: Termux](#android-termux)
  * [VS Code: Live Server](#vs-code-live-server)
  * [No Git? Download the ZIP](#no-git-download-the-zip)
* [Put It Online (Deploy)](#put-it-online-deploy)
  * [GitHub Pages (free)](#github-pages-free)
  * [Netlify (free, auto-updates)](#netlify-free-auto-updates)
  * [Vercel](#vercel)
  * [Cloudflare Pages](#cloudflare-pages)
  * [Normal web hosting (cPanel / FTP)](#normal-web-hosting-cpanel--ftp)
  * [Use your own domain](#use-your-own-domain)
* [Make Changes and Push](#make-changes-and-push)
* [How to Edit Things](#how-to-edit-things)
* [Folder Map](#folder-map)
* [Known Limits](#known-limits)
* [FAQ / Problems](#faq--problems)

---

## What's Inside

| Page | File | What it does |
|---|---|---|
| Home | `index.html` | Full-screen hero slider (moves right to left), bestsellers, category tiles, Watch & Shop, Luxury Gifting banner, Shop by Notes, new arrivals |
| Collection | `shop.html?c=winter` | Banner, filters (category, notes, mood, price), sort, product grid |
| Product | `product.html?id=mc1` | Photo gallery with zoom, price, free gift note, add to cart, order on WhatsApp |
| Our Story | `about.html` | Real founder story from MC |
| Contact | `contact.html` | WhatsApp, phone, email, office, message form (sends on WhatsApp), Google Map |
| Policies | `policy.html?p=privacy` | Privacy, Terms, Shipping, Returns, Cruelty-Free (MC's real text) |

**On every page:**

* A thin top line promoting the **Trial Kit (AED 200)**
* A wide search bar with a **typing animation** and a dropdown of popular searches, top products and live results
* A cart and wishlist, saved in the visitor's browser
* **Checkout on WhatsApp**, which sends the cart to the MC team
* A floating WhatsApp button
* A layout that works on phones, tablets and desktops

---

## Quick Start

```bash
git clone https://github.com/Reinhart-py/McWeb.git
cd McWeb
python -m http.server 8765
```

Then open **http://localhost:8765**. Stop the server with **Ctrl + C**.

---

## Run It on Your Computer

You only need **Git** (to download the code) and **Python** (for a tiny local server).

### Windows PowerShell

1. Install Git and Python (one time only):

```powershell
winget install Git.Git
```

```powershell
winget install Python.Python.3.12
```

Close and reopen PowerShell after installing.

2. Download the project and start it:

```powershell
cd $HOME\Documents
```

```powershell
git clone https://github.com/Reinhart-py/McWeb.git
```

```powershell
cd McWeb
```

```powershell
python -m http.server 8765
```

3. Open **http://localhost:8765**.

**No Python? Use Node.js instead:**

```powershell
npx serve . -l 8765
```

**Get the latest changes later:**

```powershell
git pull
```

### Mac / Linux Terminal

```bash
git clone https://github.com/Reinhart-py/McWeb.git
cd McWeb
python3 -m http.server 8765
```

Open **http://localhost:8765**.

(Mac: if `git` is missing, run `xcode-select --install`. Linux: `sudo apt install git python3`.)

### Android: Termux

1. Install **Termux** from F-Droid. The Play Store version is old.
2. In Termux:

```bash
pkg update && pkg install git python
git clone https://github.com/Reinhart-py/McWeb.git
cd McWeb
python -m http.server 8765
```

3. Open **http://localhost:8765** in your phone's browser.

**Show it to someone on the same Wi-Fi:** run `ifconfig` in Termux and find your phone's IP (like `192.168.1.20`). They open `http://192.168.1.20:8765`.

### VS Code: Live Server

1. Clone the repo, as shown above, or use **VS Code → Clone Git Repository** and paste `https://github.com/Reinhart-py/McWeb.git`.
2. Install the **Live Server** extension.
3. Right-click `index.html` → **Open with Live Server**. The page reloads every time you save.

### No Git? Download the ZIP

1. On the [repo page](https://github.com/Reinhart-py/McWeb), click the green **Code** button → **Download ZIP**.
2. Unzip it. The folder is called `McWeb-main`.
3. Open a terminal in that folder and run `python -m http.server 8765`.

---

## Put It Online (Deploy)

The site is just files, so any static host works. Since the code is already on GitHub, these are the easiest options.

### GitHub Pages (free)

1. Go to the repo → **Settings** → **Pages**.
2. **Source:** Deploy from a branch.
3. **Branch:** `main`, folder **`/ (root)`** → **Save**.
4. Wait 1–2 minutes. The site is live at **https://reinhart-py.github.io/McWeb/**.

Every `git push` to `main` updates the live site automatically.

### Netlify (free, auto-updates)

1. Log in at [app.netlify.com](https://app.netlify.com) with GitHub.
2. **Add new site** → **Import an existing project** → **GitHub** → choose **Reinhart-py/McWeb**.
3. **Build command:** leave empty. **Publish directory:** `.` (a dot).
4. Click **Deploy**. You get a link like `https://mcweb.netlify.app`, and you can rename it in Site settings.

Every push to GitHub redeploys the site by itself.

### Vercel

1. Go to [vercel.com/new](https://vercel.com/new) → **Import** → **Reinhart-py/McWeb**.
2. **Framework preset:** Other. **Build command:** empty. **Output directory:** `.`
3. Click **Deploy**.

### Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Pick **Reinhart-py/McWeb**.
3. **Build command:** none. **Output directory:** `/`
4. Click **Save and Deploy**.

### Normal web hosting (cPanel / FTP)

1. Download the repo as a ZIP (see above) and unzip it.
2. In cPanel, open **File Manager** → `public_html`, or connect with FileZilla.
3. Upload **everything inside** the folder, including `assets/`. Upload the contents, not the folder itself.
4. Visit your domain.

### Use your own domain

* **GitHub Pages:** Settings → Pages → **Custom domain**. At your domain provider, add a `CNAME` record pointing to `reinhart-py.github.io`.
* **Netlify / Vercel / Cloudflare:** Project → **Domains** → Add, then follow the DNS steps it shows.

HTTPS (the lock icon) is free and turns on automatically on all of these.

---

## Make Changes and Push

```bash
git pull                          # get the newest version first
# ...edit files...
git add .
git commit -m "Short note about what you changed"
git push
```

If GitHub Pages, Netlify, Vercel or Cloudflare is connected, the live site updates within a minute.

**First push from a new computer?** Git asks you to log in. In the browser window that opens, sign in to GitHub, or use a [personal access token](https://github.com/settings/tokens) as the password.

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

**Add a video to "Watch & Shop":** put `mc1.mp4` in `assets/reels/`. Then in `index.html`, set
`const REEL_VIDEOS = { mc1: "assets/reels/mc1.mp4" };`

**Good image sizes:** hero 1920 × 1080, reels 720 × 1280, notes 640 × 480. Keep each image under 300 KB.

---

## Folder Map

```
McWeb/
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
│   ├── hero/         Hero + Luxury Gifting banners
│   ├── reels/        Watch & Shop vertical photos
│   └── notes/        Shop by Notes photos
├── README.md         This file
├── CHANGELOG.md      What changed in each version
└── HANDOFF.md        Full notes for the next person or AI
```

---

## Known Limits

* **No card payment yet.** Checkout sends the order on WhatsApp. For card payments, connect Shopify, WooCommerce or Stripe.
* **Product photos load from MC's current website** (`millionaireschoiceparfum.com`). If that site changes, those photos break. Copy them into `assets/` before going live.
* **Email signup** opens the visitor's email app with a message to MC. A real newsletter needs Mailchimp, Klaviyo or similar.
* **No videos yet** in Watch & Shop. It shows photos for now.
* **Hero banners are made for desktop.** On phones they show smaller.
* The cart and wishlist are saved only in the visitor's own browser.

---

## FAQ / Problems

**`git` or `python` is not recognized.**
Install them (see [Windows PowerShell](#windows-powershell)), then close and reopen the terminal. On Windows, tick **"Add Python to PATH"** during setup.

**The page is blank or the styles are missing.**
Start the server **inside** the `McWeb` folder, where `index.html` is.

**Port 8765 is busy.**
Use another number: `python -m http.server 9000`, then open `http://localhost:9000`.

**Product photos don't show.**
You're offline. Those photos come from MC's live website.

**GitHub Pages shows a 404 error.**
Wait 1–2 minutes. Check that `index.html` is in the **root** of the repo, not inside a sub-folder like `mc-site/`.

**`git push` is rejected.**
Run `git pull` first, then push again.
