const categories = [
  {
    slug: "laptops",
    value: "laptops",
    name: "Laptops & PCs",
    type: "grid", // "grid" = 4 image grid like Laptops, "single" = one big image
    linkText: "See all laptops",
    showInHero: true, // Top 3 category cards (4th spot is Sign in card)
    showInPopular: true, // Popular Categories section at bottom
    order: 1,
  },
  {
    slug: "smartphones",
    value: "smartphones",
    name: "Smartphones",
    type: "single",
    linkText: "Shop smartphones",
    showInHero: true,
    showInPopular: true,
    order: 2,
  },
  {
    slug: "accessories",
    value: "accessories",
    name: "Accessories",
    type: "single",
    linkText: "Shop accessories",
    showInHero: false,
    showInPopular: true,
    order: 3,
  },
  {
    slug: "audio",
    value: "audio",
    name: "Audio & Headphones",
    type: "single",
    linkText: "Shop audio",
    showInHero: false,
    showInPopular: true,
    order: 4,
  },
  {
    slug: "gaming",
    value: "gaming",
    name: "Gaming Accessories",
    type: "single",
    linkText: "Shop gaming",
    showInHero: true,
    showInPopular: true,
    order: 5,
  },
  {
    slug: "cameras",
    value: "cameras",
    name: "Cameras & Photography",
    type: "single",
    linkText: "Shop cameras",
    showInHero: true,
    showInPopular: true,
    order: 6,
  },
  {
    slug: "wearables",
    value: "wearables",
    name: "Wearables & Smartwatches",
    type: "single",
    linkText: "Shop wearables",
    showInHero: false,
    showInPopular: true,
    order: 7,
  },
];

export default categories;
