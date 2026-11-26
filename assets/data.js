// Product data taken from millionaireschoiceparfum.com (prices in AED)
const IMG = "https://millionaireschoiceparfum.com/wp-content/uploads/";
const LOGO_BLACK = IMG + "2025/03/mc-logo-london-black.png";
const LOGO_WHITE = IMG + "2022/05/cropped-mc-logo-london.png";
const BANNERS = [
  IMG + "2025/11/home-page-banner-new-1-1.jpg",
  IMG + "2025/11/home-page-banner-new-1-2.jpg",
  IMG + "2025/11/home-page-banner-new-1-3.jpg",
];
// Full-screen hero slides. "cap" adds text on the left (use it on images that leave the left side empty).
// When the new Flow images are ready, swap img paths to "assets/hero/hero-1.jpg" etc. and add caps.
// Full-screen hero slides. The headline text is part of each picture (like Ajmal), so each slide just links somewhere.
const HERO = [
  { img: "assets/hero/hero-winter.jpg", alt: "Warm up to winter luxury. Rich, warm scents for cold days.", link: "shop.html?c=winter" },
  { img: "assets/hero/hero-signature.jpg", alt: "Our Signature scents. Six rich scents, made to be remembered.", link: "shop.html?c=signature" },
  { img: "assets/hero/hero-trial.jpg", alt: "Try all seven scents. Trial Kit for just AED 200.", link: "product.html?id=trial-kit" },
  { img: "assets/hero/hero-gifting.jpg", alt: "The gift of luxury. Perfume gifts for every special moment.", link: "shop.html?c=gifting" },
];
// Collection pages opened from the hero and the menu
const COLLECTIONS = {
  all: { name: "All", title: "ALL PERFUMES", banner: "assets/hero/hero-signature.jpg", match: () => true },
  signature: { name: "Signature", title: "OUR SIGNATURE", banner: "assets/hero/hero-signature.jpg", match: (p) => p.type !== "kit" },
  parfum: { name: "Parfum", title: "PARFUM COLLECTION", banner: "assets/hero/hero-signature.jpg", match: (p) => p.type === "parfum" },
  winter: { name: "Winter", title: "WINTER PICKS", banner: "assets/hero/hero-winter.jpg", match: (p) => p.tags.includes("warm") },
  gifting: { name: "Gifting", title: "GIFTING", banner: "assets/hero/hero-gifting.jpg", match: (p) => p.type !== "parfum" },
  limited: { name: "Limited", title: "LIMITED EDITION", banner: "assets/hero/hero-signature.jpg", match: (p) => p.type === "limited" },
};
const TRENDING = ["MC1", "Oud", "Rose", "Trial Kit", "Gift Set", "Amber", "Limited Edition", "Travel Kit"];
const COLLECTION_IMG = "assets/collection/parfum-collection.jpg";
const WHATSAPP = "971505902665";

const PRODUCTS = [
  { id: "mc1", name: "MC1", type: "parfum", family: "Woody · Fresh", price: 960, was: 1200,
    imgs: [IMG + "2022/01/product-1-1.jpg", IMG + "2022/01/product-1-2.jpg"],
    short: "Fresh and woody. Bright citrus on top, warm amber at the end.",
    notes: { Top: "Bergamot, Mandarin, Pink Pepper", Heart: "Cedar, Sandalwood", Base: "Amber, Patchouli, Vetiver" },
    tags: ["woody", "fresh"], best: true },
  { id: "mc2", name: "MC2", type: "parfum", family: "Oud · Smoky", price: 960, was: 1200,
    imgs: [IMG + "2022/01/product-2-1.jpg", IMG + "2022/01/product-2-2.jpg"],
    short: "Deep and smoky. Oud and leather with a soft jasmine heart.",
    notes: { Top: "Labdanum", Heart: "Jasmine, Sandalwood, Leather, Oud", Base: "Patchouli, Ambrox, Cypriol" },
    tags: ["oud", "bold"], best: true },
  { id: "mc3", name: "MC3", type: "parfum", family: "Floral · Spicy", price: 960, was: 1200,
    imgs: [IMG + "2022/01/product-3-1.jpg", IMG + "2022/01/product-3-2.jpg"],
    short: "Soft and bright. Pear and cinnamon open into warm flowers.",
    notes: { Top: "Pear, Cinnamon, Black Pepper", Heart: "Oriental Flowers", Base: "Soft Woods" },
    tags: ["floral", "soft"], best: true },
  { id: "mc4", name: "MC4", type: "parfum", family: "Leather · Amber", price: 960, was: 1200,
    imgs: [IMG + "2022/01/product-4-1.jpg", IMG + "2022/01/product-4-2.jpg"],
    short: "Rich and spicy. Saffron and suede with smoky frankincense.",
    notes: { Top: "Saffron, Raspberry, Suede", Heart: "Amber Wood, Musk", Base: "Frankincense, Leather" },
    tags: ["spicy", "bold"], best: true },
  { id: "mc5", name: "MC5", type: "parfum", family: "Floral · Oriental", price: 960, was: 1200,
    imgs: [IMG + "2022/01/product-5-1.jpg", IMG + "2022/01/product-5-2.jpg"],
    short: "Warm and floral. Fruity spice with orange blossom and amber.",
    notes: { Top: "Fruits, Spices", Heart: "Sandal, Orange Blossom", Base: "Amber" },
    tags: ["floral", "soft"] },
  { id: "mc6", name: "MC6", type: "parfum", family: "Rose · Musk", price: 960, was: 1200,
    imgs: [IMG + "2022/01/product-6-1.jpg", IMG + "2022/01/product-6-2.jpg"],
    short: "Creamy rose with violet, smoky woods and musk.",
    notes: { Top: "Creamy Rose", Heart: "Violet", Base: "Smoky Woods, Musk" },
    tags: ["rose", "floral"], best: true },
  { id: "mc-le", name: "MC Limited Edition", type: "limited", family: "Woody · Warm", price: 1920, was: 2400,
    imgs: [IMG + "2022/01/product-7-1.jpg", IMG + "2022/01/product-7-2.jpg", IMG + "2022/01/product-7-4.jpg", IMG + "2022/01/product-7-5.jpg"],
    short: "Our special edition. Strong, warm patchouli and rosewood.",
    notes: { Top: "Patchouli", Heart: "Rosewood", Base: "Deep Woods" },
    tags: ["woody", "bold"], best: true, isNew: true },
  { id: "travel-kit", name: "Travel Kit", type: "kit", family: "6 × 10 ml", price: 640, was: 800,
    imgs: [IMG + "2022/02/product-travel-1.jpg", IMG + "2022/02/product-travel-2.jpg", IMG + "2022/02/product-travel-3.jpg", IMG + "2022/02/product-travel-4.jpg"],
    short: "All six MC scents in 10 ml bottles. Easy to carry.",
    notes: { Inside: "MC1, MC2, MC3, MC4, MC5, MC6", Size: "6 × 10 ml" },
    tags: ["gift"], isNew: true },
  { id: "trial-kit", name: "Trial Kit", type: "kit", family: "7 × 3 ml", price: 200, was: 250,
    imgs: [IMG + "2023/01/trial-kit-Image-600x600-1.jpg"],
    short: "Not sure which one? Try all 7 scents first.",
    notes: { Inside: "7 MC scents", Size: "7 × 3 ml" },
    tags: ["gift"], best: true, isNew: true },
];

const FREE_KIT_NOTE = "Free Travel Kit (6 × 10 ml) with every MC parfum.";
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const off = (p) => Math.round((1 - p.price / p.was) * 100);
const aed = (n) => "AED " + n.toLocaleString("en-US");
["mc1", "mc2", "mc4", "mc6", "mc-le"].forEach((id) => byId(id).tags.push("warm"));
