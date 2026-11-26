# HANDOFF — read this first

This file is for the next person or AI session. It has everything needed to continue without the old chat.

---

## 1. The big picture

* **Who we are:** an IT company (CRM, custom websites, Meta ads, lead generation). Owner email domain: 7strokes.ae.
* **The client we are pitching:** **Millionaires Choice Parfum (MC)**, Dubai.
  * Site: https://millionaireschoiceparfum.com/ (WordPress + WooCommerce)
  * Distributor: **Jatania General Trading LLC**, Office 903, Capricorn Tower, Sheikh Zayed Road, Dubai
  * Phone +971 4 591 9749 · WhatsApp +971 50 590 2665 · enquiry@jataniageneraltrading.com
  * Founder: George Jatania (40+ years, ex-Lornamead, owned Yardley of London). Made with French Master Perfumers. Cruelty-free.
  * Socials: Instagram @millionaireschoiceparfum (~6.7k, posts rarely), TikTok @millionaireschoiceparfum, Snapchat @mc.parfum, X @MCParfum, Facebook millionaireschoiceparfum
* **What this folder is:** a rebuilt MC website, used as a **pitch demo**. Goal: copy the **UI/UX of https://in.ajmal.com/** as closely as possible, but with MC's products, logo and content.

### Our pitch to MC (from the first analysis)
Their weak points: no WhatsApp button or live chat, no email/SMS capture, no reviews, no real Arabic site, thin product pages and SEO, no blog, rare social posts, contact page with no form.
What we sell, best first:
1. Meta + TikTok ads pushing the **AED 200 Trial Kit** as the "try first" offer, then upsell full bottles.
2. **WhatsApp CRM** (all leads in one place, auto replies, follow-ups, abandoned cart).
3. **This new website** (WhatsApp ordering, reviews, Arabic, SEO).
4. Social media content + influencers.

---

## 2. The user's rules (follow these!)

* **Easy English.** Short, simple words. The user wants a 5th grader to understand. Same for any text on the site, but it must still **feel luxury**.
* **No fake stuff.** No fake reviews, ratings, celebrity names, blog posts, policy text, numbers or "coming soon" pages. Every link must go to a real, working page. Real content only (take it from MC's site).
* **Copy Ajmal's UI/UX exactly** (layout, sizes, fonts, animations), but **never copy Ajmal's text or products**. Write our own wording.
* **Never change MC's logo or product names.** Logo is their identity.
* **Product images must match the real MC bottles** (rectangular clear glass, gold dome cap, red-and-navy crest medallion with gold lions, "MC1"… in gold). MC4 has a matte gold egg-shaped cap.
* **Save tokens and time.** Short answers. Don't over-explain.
* Use the user's **regular Chrome** (Claude in Chrome extension) for web work, **not** the Flow MCP's separate Chrome profile (user dislikes logging into a guest profile).

---

## 3. How the site works

Plain HTML/CSS/JS. No build. Open any page through a local server (`python -m http.server 8765` inside this folder).

| File | Role |
|---|---|
| `assets/data.js` | **All content**: `PRODUCTS` (9 items), `HERO`, `COLLECTIONS`, `TRENDING`, `WHATSAPP`, logo URLs |
| `assets/app.js` | `layout(activeName, overHero)` injects top line + header + footer + cart on every page. Also search (`initSearch`), cart, wishlist, `card()` product card |
| `assets/pages.js` | `POLICIES` (privacy, terms, shipping, returns, cruelty), generated from MC's real pages |
| `assets/style.css` | All styles. Ajmal measurements are in the comments |
| `index.html` | Home + hero slider code (right-to-left `go(n, dir)`) |
| `shop.html?c=` | Collection (keys in `COLLECTIONS`) |
| `product.html?id=` | Product page |
| `policy.html?p=` | Policy page |

**Products (AED, sale / was):** MC1–MC6 960/1,200 · MC Limited Edition 1,920/2,400 · Travel Kit (6 × 10 ml) 640/800 · Trial Kit (7 × 3 ml) 200/250. Every parfum comes with a free Travel Kit.
Product photos are **hot-linked** from `millionaireschoiceparfum.com/wp-content/uploads/...` (see `IMG` in data.js).

---

## 4. Ajmal measurements we matched (desktop 1536 px)

* Top line: 34 px tall, #e6e6e6, 13–16 px text.
* Header: **not sticky**. On home it is `position:absolute` over the hero. Logo ~70 × 85. Content width ~1200 px.
* Search: **859 × 40**, white, radius 100 px, 16 px text, typing placeholder "Search for K/Ku/Kuro…" erased and retyped. Dropdown: white panel, "Trending Searches" grey chips + "Top Products" 4 cards; while typing: Categories, Trending, Search Results.
* Menu: 14 px, weight 300, normal case, white on hero, "|" between items.
* Icons 20 px. Hero arrows: black circles, white chevrons.
* Hero: full screen (~100vh), 4 slides, **text is baked into the images**, slides **right to left**, autoplay.
* Section titles: Philosopher 24 px uppercase. Tabs: 16 px light, active has cream background.
* Product card: 265 × 471, background **#fcf8ef**, small grey family line, 16 px name, 13 px price with strike + green "% Off", 43 px outlined "ADD TO CART".
* Luxury Gifting banner: full width, 622 px tall.
* Collection page: banner, gold uppercase title, "Filters" sidebar with accordions, "Showing X out of Y products", sort select, 4-column grid. (User asked to **remove** the category tab row.)
* Footer: tan (#bf8b57), white text, 5 columns (Shop by Category, Customer Service, Legal & Policies, Our Story, Contact Us), then white logo, social icons, email box, centered copyright.
* Fonts: **Philosopher** (headings) + **Alexandria** (body), from Google Fonts.

---

## 5. Images and how they were made

All AI images were made in **Google Flow** (flow.google.com, project "Nov 26 - 13:00", Nano Banana 2.1, **0 credits** for images), using MC's real product photos as references so the bottles stay accurate.

* `assets/hero/` — hero-winter (scarf on MC1, earmuffs on MC6), hero-signature, hero-trial, hero-gifting, lux-gifting. Made with Ajmal's matching banner as a **layout/style reference** + MC bottle photos. Prompts said "same layout and typography style, new products and new text, spell every word exactly".
* `assets/reels/` — 9:16 photos for Watch & Shop.
* `assets/notes/` — 4:3 ingredient photos on cream.
* Downloads come as 2K into `~/Downloads`; resized with PowerShell System.Drawing (hero 1920 wide, reels 720, notes 640).

**Flow tips learned:**
* Drive Flow through **Claude in Chrome** in the user's normal Chrome.
* To upload: patch `HTMLInputElement.prototype.click` so the file input doesn't open a native picker, append it to the body, then use `file_upload`.
* Attach references by searching the asset picker ("Add ingredients" → search box) and clicking the first option.
* Use a **real click** on the send arrow. JS-only clicks sometimes trigger Flow's "unusual activity" error.
* **Video generation is blocked** by Flow's bot check when started by the extension (0 credits were charged). The user said to **skip videos for now**. Veo 3.1 Lite = 10 credits per 8 s clip if the user clicks Generate themselves.

---

## 6. Open TODO list

1. **Videos** for Watch & Shop (6 clips, ~60 credits with Veo Lite). The user must press Generate in Flow, or skip.
2. **Phone-shaped hero banners** (Ajmal has separate mobile banners).
3. **Self-host product photos** (currently hot-linked from MC's site).
4. **Real checkout** (Shopify / WooCommerce / Stripe). Now it's WhatsApp checkout.
5. **Newsletter** service (now a mailto link).
6. **Arabic version**, reviews widget (real reviews only), CRM + Meta pixel when MC signs.
7. Cards are slightly narrower than Ajmal (218 vs 265 px at 1440 wide). Could widen the container to ~1360 px.

---

## 7. Things that are NOT in the zip

* `refs/` folder (reference photos, including Ajmal's banners used only as style references) stays on the original machine at `C:\Users\R42\Downloads\softwares\research\mc-site\refs`. Not needed to run the site. **Don't publish Ajmal's images.**
* `.claude/launch.json` (preview server config for Claude Code: `python -m http.server 8765 --directory mc-site`).
