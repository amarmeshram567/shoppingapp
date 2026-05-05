
const bag = 'https://images.pexels.com/photos/22432990/pexels-photo-22432990.jpeg'
const headphones = 'https://images.pexels.com/photos/8356854/pexels-photo-8356854.jpeg'
const sneakers = 'https://images.pexels.com/photos/1027130/pexels-photo-1027130.jpeg'
const watch = 'https://images.pexels.com/photos/29902786/pexels-photo-29902786.jpeg'
const sunglasses = 'https://images.pexels.com/photos/11882776/pexels-photo-11882776.jpeg'
const wallet = 'https://images.pexels.com/photos/20015771/pexels-photo-20015771.jpeg'
const perfume = 'https://images.pexels.com/photos/27382308/pexels-photo-27382308.jpeg'
const sweater = 'https://images.pexels.com/photos/30223988/pexels-photo-30223988.jpeg'



const longDesc = "Crafted from the finest materials with meticulous attention to detail, this piece embodies timeless elegance and contemporary design. Every stitch, every curve has been considered to deliver an experience that transcends the ordinary.";

export const products = [
  {
    id: "p1", name: "Heritage Leather Tote", brand: "Maison Lior", category: "Bags",
    price: 489, originalPrice: 620, rating: 4.8, reviews: 142,
    image: bag, hoverImage: wallet, images: [bag, wallet, sweater],
    badge: "Bestseller",
    colors: [{ name: "Cognac", hex: "#9C5A2C" }, { name: "Black", hex: "#1a1a1a" }, { name: "Cream", hex: "#E8DCC4" }],
    inStock: true, description: longDesc,
    specs: [{ label: "Material", value: "Full-grain Italian leather" }, { label: "Dimensions", value: "32 × 28 × 14 cm" }, { label: "Weight", value: "0.9 kg" }],
    tags: ["leather", "tote", "premium"],
  },
  {
    id: "p2", name: "Studio Pro Headphones", brand: "Acoustica", category: "Audio",
    price: 349, originalPrice: 449, rating: 4.9, reviews: 312,
    image: headphones, hoverImage: watch, images: [headphones, watch],
    badge: "Sale",
    colors: [{ name: "Matte Black", hex: "#1a1a1a" }, { name: "Stone", hex: "#A89F94" }],
    inStock: true, description: longDesc,
    specs: [{ label: "Driver", value: "40mm dynamic" }, { label: "Battery", value: "40 hours" }, { label: "Connectivity", value: "Bluetooth 5.3" }],
    tags: ["wireless", "noise-canceling"],
  },
  {
    id: "p3", name: "Minimalist Court Sneaker", brand: "Atelier 23", category: "Footwear",
    price: 220, rating: 4.7, reviews: 198,
    image: sneakers, hoverImage: bag, images: [sneakers, bag],
    badge: "New",
    colors: [{ name: "White", hex: "#F5F2EC" }, { name: "Sand", hex: "#D4C4A8" }],
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    inStock: true, description: longDesc,
    specs: [{ label: "Upper", value: "Smooth calfskin" }, { label: "Sole", value: "Italian rubber" }, { label: "Origin", value: "Handcrafted in Portugal" }],
    tags: ["sneaker", "minimal"],
  },
  {
    id: "p4", name: "Aurora Chronograph", brand: "Lior Horloger", category: "Watches",
    price: 1290, originalPrice: 1490, rating: 4.9, reviews: 88,
    image: watch, hoverImage: sunglasses, images: [watch, sunglasses],
    badge: "Limited",
    colors: [{ name: "Champagne Gold", hex: "#C9A867" }, { name: "Silver", hex: "#C0C0C0" }],
    inStock: true, description: longDesc,
    specs: [{ label: "Movement", value: "Swiss automatic" }, { label: "Case", value: "40mm stainless steel" }, { label: "Water Resist", value: "100m" }],
    tags: ["watch", "luxury"],
  },
  {
    id: "p5", name: "Aviator Gold Frame", brand: "Vue Optique", category: "Eyewear",
    price: 295, rating: 4.6, reviews: 76,
    image: sunglasses, hoverImage: perfume, images: [sunglasses, perfume],
    colors: [{ name: "Gold/Brown", hex: "#C9A867" }, { name: "Silver/Black", hex: "#444" }],
    inStock: true, description: longDesc,
    specs: [{ label: "Frame", value: "Titanium" }, { label: "Lenses", value: "Polarized" }, { label: "UV", value: "400 protection" }],
    tags: ["sunglasses"],
  },
  {
    id: "p6", name: "Bifold Card Wallet", brand: "Maison Lior", category: "Accessories",
    price: 145, rating: 4.7, reviews: 220,
    image: wallet, hoverImage: bag, images: [wallet, bag],
    badge: "Bestseller",
    colors: [{ name: "Cognac", hex: "#9C5A2C" }, { name: "Black", hex: "#1a1a1a" }, { name: "Olive", hex: "#5C5A3A" }],
    inStock: true, description: longDesc,
    specs: [{ label: "Material", value: "Full-grain leather" }, { label: "Slots", value: "8 cards + 2 bills" }],
    tags: ["wallet", "leather"],
  },
  {
    id: "p7", name: "Amber Nuit Eau de Parfum", brand: "Atelier Olfactif", category: "Beauty",
    price: 185, originalPrice: 220, rating: 4.8, reviews: 154,
    image: perfume, hoverImage: sweater, images: [perfume, sweater],
    badge: "Sale",
    colors: [{ name: "50ml", hex: "#C9824B" }, { name: "100ml", hex: "#9C5A2C" }],
    inStock: true, description: longDesc,
    specs: [{ label: "Notes", value: "Amber, Vanilla, Sandalwood" }, { label: "Volume", value: "50ml / 100ml" }],
    tags: ["fragrance"],
  },
  {
    id: "p8", name: "Cashmere Crewneck", brand: "Knitwerk", category: "Apparel",
    price: 320, rating: 4.8, reviews: 96,
    image: sweater, hoverImage: sneakers, images: [sweater, sneakers],
    badge: "New",
    colors: [{ name: "Sand", hex: "#D4C4A8" }, { name: "Charcoal", hex: "#3A3A3A" }, { name: "Ivory", hex: "#F5F2EC" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true, description: longDesc,
    specs: [{ label: "Composition", value: "100% Mongolian Cashmere" }, { label: "Care", value: "Hand wash cold" }],
    tags: ["sweater", "cashmere"],
  },
];

export const categories = [
  { id: "bags", name: "Bags", count: 24, image: bag },
  { id: "audio", name: "Audio", count: 18, image: headphones },
  { id: "footwear", name: "Footwear", count: 32, image: sneakers },
  { id: "watches", name: "Watches", count: 15, image: watch },
  { id: "eyewear", name: "Eyewear", count: 21, image: sunglasses },
  { id: "accessories", name: "Accessories", count: 47, image: wallet },
  { id: "beauty", name: "Beauty", count: 39, image: perfume },
  { id: "apparel", name: "Apparel", count: 64, image: sweater },
];

export const brands = ["Maison Lior", "Acoustica", "Atelier 23", "Lior Horloger", "Vue Optique", "Atelier Olfactif", "Knitwerk"];

export const testimonials = [
  { name: "Sophia Chen", role: "Creative Director", quote: "The quality is unmatched. Every piece feels like it was made just for me.", rating: 5 },
  { name: "Marcus Aldridge", role: "Architect", quote: "Timeless design meets impeccable craftsmanship. My new go-to brand.", rating: 5 },
  { name: "Elena Petrova", role: "Photographer", quote: "Packaging, product, service — everything is considered. Worth every cent.", rating: 5 },
  { name: "James Okonkwo", role: "Designer", quote: "I've never received compliments like this. The leather goods are extraordinary.", rating: 5 },
];

export const blogPosts = [
  { id: "b1", title: "The Quiet Luxury of Considered Design", excerpt: "Why restraint is the new statement in modern fashion.", image: bag, date: "Apr 12, 2026", category: "Style" },
  { id: "b2", title: "Inside Our Leather Atelier", excerpt: "A look behind the scenes at our Florentine workshop.", image: wallet, date: "Apr 04, 2026", category: "Craft" },
  { id: "b3", title: "Building a Capsule Wardrobe", excerpt: "Eight pieces. Infinite combinations. Zero compromises.", image: sweater, date: "Mar 28, 2026", category: "Guide" },
];


