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
* [Open It on Other Devices (Same Wi-Fi)](#open-it-on-other-devices-same-wi-fi)
* [npm run dev / npm run host](#npm-run-dev--npm-run-host)
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

You need **Git** and **Node.js** (it comes with `npm` and `npx`).

```bash
git clone https://github.com/Reinhart-py/McWeb.git
cd McWeb
npx vite --host 0.0.0.0 --port 5173
```

Vite prints two links:

```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.20:5173/   ← open this on your phone, laptop or TV (same Wi-Fi)
```

Stop the server with **Ctrl + C**. The first run asks `Ok to proceed? (y)`. Type **y**.

---

## Open It on Other Devices (Same Wi-Fi)

`--host 0.0.0.0` means "let every device on my Wi-Fi open this". Without it, only your own device can see the site.

**1. Start a server** inside the `McWeb` folder. Pick any one:

| Tool | Command | Port |
|---|---|---|
| **Vite** (best: live reload, prints the Wi-Fi link) | `npx vite --host 0.0.0.0 --port 5173` | 5173 |
| **serve** | `npx serve . -l tcp://0.0.0.0:3000` | 3000 |
| **http-server** | `npx http-server . -a 0.0.0.0 -p 8080 -c-1` | 8080 |
| **live-server** (auto reload) | `npx live-server --host=0.0.0.0 --port=8080` | 8080 |
| **Python** (no Node.js) | `python -m http.server 8765 --bind 0.0.0.0` | 8765 |

**2. Find your IP address** (Vite already shows it as the **Network:** link):

| Device | Command | Look for |
|---|---|---|
| Windows | `ipconfig` | **IPv4 Address**, like `192.168.1.20` |
| Mac | `ipconfig getifaddr en0` | the number it prints |
| Linux | `hostname -I` | the first number |
| Termux | `ifconfig` | `inet` under `wlan0` |

**3. On the other device** (same Wi-Fi), open `http://YOUR-IP:PORT`, for example `http://192.168.1.20:5173`.

**Not opening on the other device?**
* **Windows** may show a firewall popup the first time. Click **Allow access** with *Private networks* ticked.
* Both devices must be on the **same Wi-Fi**. Guest Wi-Fi and some office Wi-Fi block devices from seeing each other.
* Type `http://`, not `https://`.
* Phone hotspot: start the server on the laptop that is connected to the phone's hotspot, then open the laptop's IP on the phone.

---

## npm run dev / npm run host

The site doesn't need a `package.json`, so the repo has none yet. If you want short `npm run …` commands, create a file called **`package.json`** in the `McWeb` folder:

```json
{
  "name": "mcweb",
  "private": true,
  "scripts": {
    "dev": "vite --port 5173",
    "host": "vite --host 0.0.0.0 --port 5173",
    "serve": "serve . -l tcp://0.0.0.0:3000"
  },
  "devDependencies": {
    "serve": "^14.2.4",
    "vite": "^5.4.11"
  }
}
```

And a file called **`.gitignore`** with one line, so the installed packages don't go to GitHub:

```
node_modules/
```

Then:

```bash
npm install        # one time only
npm run dev        # only this device:   http://localhost:5173
npm run host       # whole Wi-Fi:       http://YOUR-IP:5173
npm run serve      # simple server:     http://YOUR-IP:3000
```

> **Why not Next.js?** McWeb is plain HTML, so Next.js would mean rewriting every page. Vite gives you the same `npm run dev` feel and Wi-Fi sharing without changing any code.

---

## Run It on Your Computer

You need **Git** (to download the code) and **Node.js** (for the server). Python works too if you don't have Node.js.

### Windows PowerShell

1. Install Git and Node.js (one time only):

```powershell
winget install Git.Git
```

```powershell
winget install OpenJS.NodeJS.LTS
```

Close and reopen PowerShell after installing. Check that they work with `node -v` and `git --version`.

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
npx vite --host 0.0.0.0 --port 5173
```

3. Open **http://localhost:5173** on this PC, or the **Network:** link on any device on your Wi-Fi.

**No Node.js? Use Python instead:**

```powershell
python -m http.server 8765 --bind 0.0.0.0
```

**PowerShell says "running scripts is disabled"** when you use `npx`? Run this once, then try again:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

**Get the latest changes later:**

```powershell
git pull
```

### Mac / Linux Terminal

```bash
git clone https://github.com/Reinhart-py/McWeb.git
cd McWeb
npx vite --host 0.0.0.0 --port 5173
```

Open **http://localhost:5173**, or the **Network:** link on another device.

(Mac: install Node.js from [nodejs.org](https://nodejs.org) or `brew install node`, and if `git` is missing run `xcode-select --install`. Linux: `sudo apt install git nodejs npm`.)

### Android: Termux

Turn your phone into the server. Everyone on the same Wi-Fi can then open the site.

1. Install **Termux** from F-Droid. The Play Store version is old.
2. In Termux:

```bash
pkg update && pkg upgrade -y
pkg install git nodejs-lts -y
git clone https://github.com/Reinhart-py/McWeb.git
cd McWeb
npx vite --host 0.0.0.0 --port 5173
```

3. Vite shows two links:
   * **Local:** `http://localhost:5173` → open it in your phone's browser
   * **Network:** `http://192.168.x.x:5173` → open it on any laptop or phone on the same Wi-Fi

**Other Termux options:**

```bash
npx serve . -l tcp://0.0.0.0:3000          # simple and light
npx http-server . -a 0.0.0.0 -p 8080 -c-1  # no caching, good while editing
```

**Termux tips:**
* Can't see your IP? Run `ifconfig` and look for `inet` under `wlan0`. If `ifconfig` is missing, run `pkg install net-tools`.
* Keep the server running when the screen turns off: pull down the notification and tap **Acquire wakelock**, or run `termux-wake-lock`.
* Using `npm run host`? Add the `package.json` from [npm run dev / npm run host](#npm-run-dev--npm-run-host), run `npm install`, then `npm run host`.

### VS Code: Live Server

1. Clone the repo, as shown above, or use **VS Code → Clone Git Repository** and paste `https://github.com/Reinhart-py/McWeb.git`.
2. Install the **Live Server** extension.
3. Right-click `index.html` → **Open with Live Server**. The page reloads every time you save.

### No Git? Download the ZIP

1. On the [repo page](https://github.com/Reinhart-py/McWeb), click the green **Code** button → **Download ZIP**.
2. Unzip it. The folder is called `McWeb-main`.
3. Open a terminal in that folder and run `npx vite --host 0.0.0.0 --port 5173`, or `python -m http.server 8765 --bind 0.0.0.0`.

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

**`git`, `node`, `npx` or `python` is not recognized.**
Install them (see [Windows PowerShell](#windows-powershell)), then close and reopen the terminal.

**The page is blank or the styles are missing.**
Start the server **inside** the `McWeb` folder, where `index.html` is.

**The port is busy.**
Use another number, for example `npx vite --host 0.0.0.0 --port 4000`, then open `http://localhost:4000`.

**My phone can't open the Network link.**
See [Open It on Other Devices](#open-it-on-other-devices-same-wi-fi). It's usually the Windows firewall, guest Wi-Fi, or a missing `--host 0.0.0.0`.

**Termux: `npx vite` fails or is very slow.**
Run `pkg upgrade` and `pkg install nodejs-lts`, then try again. Or use the lighter `npx serve . -l tcp://0.0.0.0:3000`.

**Product photos don't show.**
You're offline. Those photos come from MC's live website.

**GitHub Pages shows a 404 error.**
Wait 1–2 minutes. Check that `index.html` is in the **root** of the repo, not inside a sub-folder like `mc-site/`.

**`git push` is rejected.**
Run `git pull` first, then push again.
