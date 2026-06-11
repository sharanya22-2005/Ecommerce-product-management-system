import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Product, Category, Order, Address, Coupon, Review, Notification } from "./src/types";

// Setup server environment variables
const PORT = 3000;

// Lazy initialization of Gemini client
let aiInstance: any = null;
function getGeminiClient() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please add/configure it under Settings > Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// In-Memory Database State (for smooth, stateless workspace environments)
const dbState = {
  users: [
    { id: "user-1", name: "Sharanya Viswanathan", email: "pvsharanya21@gmail.com", password: "user123", mobile: "+91 9876543210", role: "Customer", gender: "Female", dob: "1998-05-12", profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
    { id: "admin-1", name: "Chief Commerce Admin", email: "admin@smartcommerce.com", password: "admin123", mobile: "+91 9999999999", role: "Admin", gender: "Male", dob: "1985-01-01", profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" }
  ],
  categories: [
    { id: "electronics", name: "Electronics", status: "enabled", icon: "Smartphone" },
    { id: "fashion", name: "Fashion", status: "enabled", icon: "Shirt" },
    { id: "footwear", name: "Footwear", status: "enabled", icon: "Footprints" },
    { id: "beauty", name: "Beauty", status: "enabled", icon: "Sparkles" },
    { id: "home-appliances", name: "Home Appliances", status: "enabled", icon: "Tv" },
    { id: "grocery", name: "Grocery", status: "enabled", icon: "ShoppingBag" },
    { id: "books", name: "Books", status: "enabled", icon: "BookOpen" },
    { id: "sports", name: "Sports", status: "enabled", icon: "Trophy" },
    { id: "furniture", name: "Furniture", status: "enabled", icon: "Sofa" },
    { id: "mobile-accessories", name: "Accessories", status: "enabled", icon: "Headphones" },
  ] as Category[],
  products: [
    {
      id: "prod-elec-1",
      name: "Quantum Ultra-Sync Smartphone 5G",
      description: "Experience absolute speed with the SmartCommerce flagship 5G mobile device. Fitted with an ultra-dynamic AMOLED 120Hz display, next-generation AI camera processing engine, and dual cooling vapor chambers for gaming. Long battery life with 120W flash charge.",
      category: "electronics",
      brand: "Quantum",
      sku: "QT-US5G-BLK-256",
      price: 899,
      discountPrice: 799,
      quantity: 45,
      images: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1565849904461-09a285041060?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80"
      ],
      specifications: {
        "Display": "6.7\" QHD+ AMOLED 120Hz",
        "Processor": "Snapdragon 8 Gen 3 (Octa-Core)",
        "RAM": "12GB LPDDR5X",
        "Storage": "256GB UFS 4.0",
        "Battery": "5000mAh with 120W Charging",
        "Camera": "50MP Main + 48MP Telephoto + 12MP Ultra-wide"
      },
      weight: "189g",
      dimensions: "163.1 x 74.2 x 7.9 mm",
      warranty: "1 Year International Brand Warranty",
      rating: 4.8,
      numReviews: 124,
      isBestseller: true,
      isTrending: true
    },
    {
      id: "prod-elec-2",
      name: "VocalNoise Studio Pro Gen-2 Headset",
      description: "Active Hybrid Noise Cancelling wireless over-ear headphones with custom spatial audio drivers and dynamic head-tracking capabilities. Over 50 hours of wireless Bluetooth playback with a premium aluminium alloy lightweight body.",
      category: "electronics",
      brand: "VocalNoise",
      sku: "VN-SP2-SLVR",
      price: 299,
      discountPrice: 249,
      quantity: 3, // Very low stock to trigger warnings!
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"
      ],
      specifications: {
        "Driver Size": "40mm Bio-Cellulose Dome Drivers",
        "Active Noise Cancellation": "Hybrid ANC (Up to 45dB Reduction)",
        "Connectivity": "Bluetooth 5.3 & 3.5mm Analog Audio",
        "Battery Life": "52 Hours ANC off, 40 Hours ANC on",
        "Codecs supported": "LDAC, AAC, SBC, aptX Adaptive"
      },
      weight: "250g",
      dimensions: "180 x 170 x 85 mm",
      warranty: "2 Years Brand Replacement Warranty",
      rating: 4.6,
      numReviews: 96,
      isTrending: true,
      isNew: true
    },
    {
      id: "prod-fash-1",
      name: "Classic Italian Leather Bomber Jacket - Antique Brown",
      description: "Tailored luxury Italian lambskin leather jacket with soft rib-knit trims, metallic premium zipper fittings, and quilted inside lining. Perfect tailored silhouette constructed by hand with natural high-durability finish.",
      category: "fashion",
      brand: "Sartorial",
      sku: "SART-BM-BRN-XL",
      price: 350,
      discountPrice: 280,
      quantity: 8, // Low Stock Alert flag
      images: [
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1521223890158-f9f7c3d5b504?w=600&auto=format&fit=crop&q=80"
      ],
      specifications: {
        "Material": "100% Genuine Lambskin Italian Leather",
        "Lining": "Satin Quilted Internal Liner with Dual pockets",
        "Fit": "Modern Regular Fit Bomber",
        "Hardware": "Branded heavy-gauge YKK metal closures"
      },
      weight: "1.2kg",
      dimensions: "Adjustable sizing profiles",
      warranty: "Lifetime stitching & zip hardware support",
      rating: 4.9,
      numReviews: 42,
      isBestseller: true
    },
    {
      id: "prod-foot-1",
      name: "Stryder Aero-Pace Breathable Running Shoes",
      description: "Highly cushioned advanced running sneakers featuring shock-absorbing polymer honeycombed soles, ultra-breathable engineered knit seamless uppers, and lightweight construction optimized for high-mileage training sessions.",
      category: "footwear",
      brand: "Stryder",
      sku: "STRY-AP-WHT-10",
      price: 120,
      discountPrice: 95,
      quantity: 50,
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80"
      ],
      specifications: {
        "Midsole Type": "Aero-Pace TPU High Rebound Foam",
        "Sole Hardness": "Duramax Carbonized Compound Rubber Sole",
        "Heel to Toe Drop": "8mm offset, optimized for neutral runners",
        "Upper material": "Double-knit engineered hydrophobic mesh"
      },
      weight: "240g",
      dimensions: "US Men Size 10 Footbed Size",
      warranty: "6 Months sole separation assurance",
      rating: 4.5,
      numReviews: 231,
      isTrending: true
    },
    {
      id: "prod-beauty-1",
      name: "GlowVera Retinol Hyaluronic Anti-Age Serum",
      description: "Gold Standard clinical overnight serum with 2.5% active, stabilized Micro-Encapsulated Retinol and organic Hyaluronic Acid + botanical Aloe extract. Clinically proven to minimize dark circles and fine lines elegantly while preserving skin moisture.",
      category: "beauty",
      brand: "GlowVera",
      sku: "GV-RHA-SER-30ML",
      price: 45,
      discountPrice: 35,
      quantity: 110,
      images: [
        "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"
      ],
      specifications: {
        "Active Concentration": "2.5% Pure Stabilized Micro Retinol",
        "Skin Compatibility": "Tested Dermatologically safe for all types",
        "Volume": "30ml / 1.01 fl. oz Premium glass pump bottle",
        "Key botanicals": "Organic Aloe, Green Tea, Witch Hazel, Jojoba"
      },
      weight: "85g",
      dimensions: "110 x 35 x 35 mm",
      warranty: "Dermatological safety certified, cruelty-free guarantee",
      rating: 4.7,
      numReviews: 184,
      isNew: true
    },
    {
      id: "prod-home-1",
      name: "Espresso master Touch One-Click Coffee Station",
      description: "Automated direct bean-to-cup espresso machine fitted with a high-resolution 5.5\" LCD color touch interface, 19-bar custom dual-pressure Italian pump system, and integrated automatic micro-foam milk texturer for easy lattes.",
      category: "home-appliances",
      brand: "EspressoMaster",
      sku: "EM-T1C-COF",
      price: 650,
      discountPrice: 580,
      quantity: 15,
      images: [
        "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80"
      ],
      specifications: {
        "Pump Pressure": "19 Bar Italian Solenoid Precision Pump",
        "Bean Hopper capacity": "350g Sealed Aroma-saver Chamber",
        "Grinder Type": "Hardened Conical Ceramic Burr Grinder (12 configurations)",
        "Heating Elements": "Dual Thermoblocks (Instant extraction & immediate steam)"
      },
      weight: "8.5kg",
      dimensions: "340 x 420 x 290 mm",
      warranty: "2 Years Brand Diagnostics and Maintenance Warranty",
      rating: 4.8,
      numReviews: 67,
      isBestseller: true
    },
    {
      id: "prod-furn-1",
      name: "Malmö Ergonomic Office Chair with Flex-Lumbar",
      description: "Premium Scandinavian style productivity desk chair with breathable mesh backing, multi-dimensional fluid-adjustable armrests, sync-tilt mechanism with locks, and advanced active supportive elastic lower back support pad.",
      category: "furniture",
      brand: "Malmö",
      sku: "MALM-ERGO-CHR",
      price: 240,
      discountPrice: 195,
      quantity: 22,
      images: [
        "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80"
      ],
      specifications: {
        "Structure Material": "Polished High-Tensile Cast Aluminum & Fiber Base",
        "Upholstery": "Zero-friction high tenacity breathable nylon mesh",
        "Gas Lift Mechanism": "SGS/BIFMA certified Class 4 high-load pneumatic cylinder",
        "Tilt capacity": "90 to 135 degrees customizable depth tension lock"
      },
      weight: "14.5kg",
      dimensions: "1250 x 640 x 600 mm",
      warranty: "3 Years Structural & Cushion Warranty",
      rating: 4.6,
      numReviews: 112,
      isTrending: true
    },
    {
      id: "prod-groc-1",
      name: "Artisan Ethiopian Yirgacheffe Coffee Beans (Single Origin)",
      description: "Light-medium roast whole organic coffee beans sourced directly from the high-altitude fields of Yirgacheffe, Ethiopia. Delivers exceptional floral notes, bright citrus acidity, and rich jasmine fragrance.",
      category: "grocery",
      brand: "Artisan Coffee",
      sku: "ART-ETH-YIRG-500",
      price: 28,
      discountPrice: 22,
      quantity: 150,
      images: [
        "https://images.unsplash.com/photo-1559056191-72147ef31e13?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80"
      ],
      specifications: {
        "Origin": "Yirgacheffe, Ethiopia (Single-Origin Specialty Grain)",
        "Roast Level": "Light-Medium Roast profiles",
        "Flavor Accents": "Meyer Lemon, Floral Tea, Mandarin Honey",
        "Package Net Weight": "500g (Vacuum Sealed Foil Valve Protective Pack)"
      },
      weight: "500g",
      dimensions: "220 x 110 x 60 mm",
      warranty: "Freshly roasted. Best consumed within 12 months.",
      rating: 4.9,
      numReviews: 83,
      isBestseller: true,
      isNew: true
    },
    {
      id: "prod-groc-2",
      name: "Gourmet Madagascar Organic Dark Chocolate (85% Cocoa Blend)",
      description: "Artisanal hand-tempered single-origin Madagascar cocoa bar. Infused with natural Bourbon vanilla, dynamic sea salt crystals, and a velvety smooth cocoa-butter profile.",
      category: "grocery",
      brand: "Chocolatier Royale",
      sku: "CHOC-85-MAD-100",
      price: 12,
      discountPrice: 9.5,
      quantity: 200,
      images: [
        "https://images.unsplash.com/photo-1549007994-cb92ca813bec?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1504973960431-1c467e159aa4?w=600&auto=format&fit=crop&q=80"
      ],
      specifications: {
        "Cocoa Mass percentage": "85% Single-Origin Madagascar Cocoa",
        "Ingredients": "Madagascar Cocoa Beans, Organic Sugar, Pure Cocoa Butter, Sea Salt, Vanilla",
        "Diets supported": "Gluten-Free, Certified Organic, Vegan Friendly",
        "Bar Net Weight": "100g premium golden foil wrapping"
      },
      weight: "100g",
      dimensions: "160 x 80 x 10 mm",
      warranty: "100% Organic, Fair Trade Sourced ingredient warranty",
      rating: 4.8,
      numReviews: 47,
      isTrending: true
    },
    {
      id: "prod-books-1",
      name: "Universal Design Systems: Principles and Custom Code",
      description: "The complete hardcover professional textbook for modern UX Designers and Software Architects. Learn tokenization, cross-framework layouts, component API patterns, fluid typography scaling, and real production Figma conversions.",
      category: "books",
      brand: "DesignTech Press",
      sku: "BK-UDS-2026",
      price: 55,
      discountPrice: 45,
      quantity: 75,
      images: [
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80"
      ],
      specifications: {
        "ISBN-13": "978-3-16-148410-0",
        "Cover Type": "Premium Linen Hardbound with Metallic Ribbon Marker",
        "Pages count": "480 Pages, printed in full-color soy oil inks",
        "Target Audience": "Senior UI/UX Designers, Frontend engineers, Tech Leads"
      },
      weight: "850g",
      dimensions: "240 x 170 x 32 mm",
      warranty: "Collectible Author signed edition guarantee",
      rating: 4.9,
      numReviews: 142,
      isBestseller: true
    },
    {
      id: "prod-books-2",
      name: "Astra Horizon: Science Fiction Short Stories",
      description: "Deluxe gilded anthology containing fifteen award-winning science fiction short stories exploring cybernetic intelligence, deep space exploration, and planetary Dyson spheres. Written by leading speculative novelists.",
      category: "books",
      brand: "Galaxy Press",
      sku: "BK-AH-GIL",
      price: 24,
      discountPrice: 19.99,
      quantity: 120,
      images: [
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80"
      ],
      specifications: {
        "Format": "Hardcover Gilded Page Edges with protective sleeve",
        "Edition Year": "2026 Collector's Edition Gold-Stamped",
        "Paper": "Acid-free archival grade ivory paper",
        "Publish Date": "March 2026"
      },
      weight: "620g",
      dimensions: "210 x 140 x 28 mm",
      warranty: "Archival paper guaranteed not to yellow for 50 years",
      rating: 4.7,
      numReviews: 31,
      isNew: true
    },
    {
      id: "prod-sports-1",
      name: "Stryder High-Density Alignment Yoga Mat",
      description: "Premium eco-friendly TPE yoga training mat featuring laser-engraved central alignment guide vectors, superior non-slip texture on both surfaces, and customized dual-layer thermal shock absorption system protecting sensitive joints.",
      category: "sports",
      brand: "Stryder",
      sku: "STRY-YGM-ALIGN-P",
      price: 65,
      discountPrice: 49,
      quantity: 80,
      images: [
        "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80"
      ],
      specifications: {
        "Thickness": "6mm Cushioning High-Responsive Memory Foam",
        "Material": "Eco-Friendly Recycled Biodegradable TPE (Non-Toxic, Latex-Free)",
        "Alignment Assist": "Laser Deep Engraved Linear vector guides",
        "Accessories included": "Woven nylon carry strap & breathable premium mesh kit sleeve"
      },
      weight: "1.1kg",
      dimensions: "1830 x 610 x 6 mm",
      warranty: "1 Year Non-Deformation & Core Peel Warranty",
      rating: 4.8,
      numReviews: 128,
      isBestseller: true
    },
    {
      id: "prod-sports-2",
      name: "Vortex Pro Carbon-Titanium Tennis Racket",
      description: "Ultra-lightweight advanced tennis racquet constructed from aerospace Carbon-Titanium composites. Specially engineered sweet-spot matrix delivers extreme energy return and heavy swing control for tournament players.",
      category: "sports",
      brand: "Vortex",
      sku: "VT-PCT-RACKET",
      price: 199,
      discountPrice: 175,
      quantity: 18,
      images: [
        "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1617083934555-ac7d4fee123e?w=600&auto=format&fit=crop&q=80"
      ],
      specifications: {
        "Composition weight": "285g Unstrung Pro Grade System",
        "Head Size": "100 sq. inches precision matrix layout",
        "Balance Config": "320mm / Head Light balance distribution",
        "Stringing template": "16 x 19 active open pattern for maximum ball spin"
      },
      weight: "285g",
      dimensions: "685 x 260 x 23 mm",
      warranty: "2 Years frame stress crack structural warranty",
      rating: 4.7,
      numReviews: 44,
      isTrending: true
    },
    {
      id: "prod-acc-1",
      name: "Helix Omnicharge 140W GaN Desktop Tower",
      description: "State-of-the-art Gallium Nitride multi-port high frequency desktop power brick. Integrates three USB-C PD3.1 ports and one smart USB-A port with digital power consumption display screen. Easily charge laptops, tablets and phones simultaneously.",
      category: "mobile-accessories",
      brand: "Helix",
      sku: "HX-OC-140GAN",
      price: 89,
      discountPrice: 69,
      quantity: 95,
      images: [
        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80"
      ],
      specifications: {
        "Total Power Output": "140W Max Dynamic Balancing Power Tech",
        "Gate Material": "Navitas Premium GaNFast Power Semiconductors",
        "Interface LCD screen": "Real-time Watts & Voltage draw distribution matrix display",
        "Protective layers": "Over-current, over-charge, and active dynamic temperature checking"
      },
      weight: "295g",
      dimensions: "110 x 42 x 38 mm",
      warranty: "18 Months Global Damage Liability & Replacement Warranty",
      rating: 4.8,
      numReviews: 119,
      isNew: true,
      isBestseller: true
    },
    {
      id: "prod-acc-2",
      name: "SnapMag Elite Magnetic Wireless Power Bank (10000mAh)",
      description: "Ultra-thin luxury leather back wireless battery pack. Snaps perfectly on magnetic phone systems to provide rapid 15W Qi2 wireless charging, with integrated kickstand for hands-free multimedia operations.",
      category: "mobile-accessories",
      brand: "Helix",
      sku: "HX-SM-EL-10K",
      price: 59,
      discountPrice: 45,
      quantity: 140,
      images: [
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80"
      ],
      specifications: {
        "Capacity detail": "10000mAh Lithium Polymer high density battery core",
        "Wireless Standard": "QI2 Magnetic Alignment technology (up to 15W transfer)",
        "Wired output": "USB-C Power Delivery 20W input/output port",
        "Casing material": "Anodized Aerospace Aluminium with Vegan Suede Backing"
      },
      weight: "165g",
      dimensions: "102 x 65 x 11.5 mm",
      warranty: "1 Year Battery capacity retentiveness warranty",
      rating: 4.6,
      numReviews: 72,
      isTrending: true
    },
    {
      id: "prod-fash-2",
      name: "French Linen Summer Midi Dress - Pure Olive",
      description: "Flowy, premium French linen dress featuring elegant functional shell buttons, customizable wrap-around waist tie, and hidden side seam utility pockets. Made with lightweight organic flax yarns breathable for summer heat.",
      category: "fashion",
      brand: "Sartorial",
      sku: "SART-FL-MDI-OLV-M",
      price: 150,
      discountPrice: 119,
      quantity: 35,
      images: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80"
      ],
      specifications: {
        "Composition details": "100% Certified Organic French Flax Linen",
        "Closure profile": "Environmentally sustainable real coconut husk shell buttons",
        "Pockets structure": "Double reinforced hidden side hip pockets",
        "Dye technology": "Azo-Free skin-safe premium reactive olive pigment dye"
      },
      weight: "420g",
      dimensions: "M (True-to-size flowy waist contouring)",
      warranty: "Guaranteed shrink-pre-shrunk yarn wash guarantee",
      rating: 4.7,
      numReviews: 29,
      isNew: true
    },
    {
      id: "prod-foot-2",
      name: "Classic Leather Dress Penny Loafers - Cognac Suede",
      description: "Timeless business casual dress shoes constructed with hand-stitched premium cognac suede leather. Anatomically optimized supportive foam bedding inserts wrapped with raw cork for personalized orthotic comfort.",
      category: "footwear",
      brand: "Sartorial",
      sku: "SART-PL-COG-09",
      price: 180,
      discountPrice: 135,
      quantity: 14,
      images: [
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=600&auto=format&fit=crop&q=80"
      ],
      specifications: {
        "External Leather": "Genuine Velveteen Finished Soft Italian Suede",
        "Insole Cushioning": "Cork-mix layered with slow-rebound polymer cell pads",
        "Sole compound": "Tread-rebound micro rubber composite preventing slip",
        "Construction style": "Blake Stitched frame (fully resolable construction)"
      },
      weight: "440g",
      dimensions: "US Men Size 9 Footbed width profile D",
      warranty: "1 Year leather tear and sewing warranty support",
      rating: 4.8,
      numReviews: 61,
      isBestseller: true
    },
    {
      id: "prod-home-2",
      name: "SilentAir H13 True HEPA Intelligent Purifier",
      description: "Advanced active home air quality purifier fitted with high efficiency medical-grade True HEPA filter capturing 99.97% of airborne pathogens, dust, pollens and odours. Integrates automatic PM2.5 monitoring and dynamic LED loop color indices.",
      category: "home-appliances",
      brand: "SilentAir",
      sku: "SA-H13-IPUR",
      price: 220,
      discountPrice: 179,
      quantity: 40,
      images: [
        "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80"
      ],
      specifications: {
        "Filter Standard": "Certified Medical-Grade True HEPA H13 Multi-layer setup",
        "CADR Rating": "320 m³/h volumetric output flow",
        "Decibels scale": "Silent Whispering night-quiet mode (19dB to 48dB)",
        "Tech Integration": "Real-time PM2.5 air-sensor, Auto Alexa & HomeKit remote link"
      },
      weight: "3.8kg",
      dimensions: "480 x 240 x 240 mm",
      warranty: "2 Years comprehensive electronics and motor coverage",
      rating: 4.8,
      numReviews: 95,
      isTrending: true
    }
  ] as Product[],

  orders: [
    {
      id: "SMC-2026-9041",
      date: "2026-06-08T10:15:30Z",
      status: "Delivered",
      items: [
        { productId: "prod-foot-1", productName: "Stryder Aero-Pace Running Shoes", productPrice: 95, quantity: 1, productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100" }
      ],
      total: 120,
      discountAmount: 25,
      payableAmount: 95,
      address: { id: "addr-1", fullName: "Sharanya Viswanathan", phone: "+91 9876543210", houseNumber: "Apt 4B, Harmony Towers", street: "IT Expressway, Sholinganallur", city: "Chennai", state: "Tamil Nadu", country: "India", pinCode: "600119" },
      paymentMethod: "UPI",
      paymentStatus: "Success"
    },
    {
      id: "SMC-2026-1182",
      date: "2026-06-09T14:22:15Z",
      status: "Shipped",
      items: [
        { productId: "prod-elec-2", productName: "VocalNoise Studio Pro Headset", productPrice: 249, quantity: 1, productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100" }
      ],
      total: 299,
      discountAmount: 50,
      payableAmount: 249,
      address: { id: "addr-1", fullName: "Sharanya Viswanathan", phone: "+91 9876543210", houseNumber: "Apt 4B, Harmony Towers", street: "IT Expressway, Sholinganallur", city: "Chennai", state: "Tamil Nadu", country: "India", pinCode: "600119" },
      paymentMethod: "Credit Card",
      paymentStatus: "Success"
    }
  ] as Order[],

  carts: {} as Record<string, { productId: string; quantity: number }[]>,
  wishlists: {} as Record<string, string[]>,
  addresses: {
    "user-1": [
      { id: "addr-1", fullName: "Sharanya Viswanathan", phone: "+91 9876543210", houseNumber: "Apt 4B, Harmony Towers", street: "IT Expressway, Sholinganallur", city: "Chennai", state: "Tamil Nadu", country: "India", pinCode: "600119" },
      { id: "addr-2", fullName: "Sharanya Viswanathan (Office)", phone: "+91 9876543210", houseNumber: "B-Block, Elite Tech Park", street: "OMR Road", city: "Chennai", state: "Tamil Nadu", country: "India", pinCode: "600096" }
    ]
  } as Record<string, Address[]>,

  coupons: [
    { code: "SMART20", type: "Percentage", value: 20, expiryDate: "2026-12-31", minBillValue: 100, isActive: true },
    { code: "FLAT50", type: "Flat", value: 50, expiryDate: "2026-08-30", minBillValue: 200, isActive: true },
    { code: "FREESHIP", type: "FreeShipping", value: 0, expiryDate: "2026-10-15", minBillValue: 50, isActive: true },
    { code: "ADMINTEST", type: "Percentage", value: 100, expiryDate: "2026-12-31", minBillValue: 10, isActive: true }
  ] as Coupon[],

  reviews: [
    { id: "rev-1", productId: "prod-elec-1", productName: "Quantum Ultra-Sync Smartphone 5G", userName: "Rohan Sharma", rating: 5, comment: "Absolutely brilliant phone! Charges in 15 minutes, camera detail is incredible. High quality product.", isSpam: false, date: "2026-06-01" },
    { id: "rev-2", productId: "prod-elec-1", productName: "Quantum Ultra-Sync Smartphone 5G", userName: "Deepa S.", rating: 4, comment: "Battery backup is average if you play 3D games constantly, but the 120W charging compensates perfectly. Recommended.", isSpam: false, date: "2026-06-03" },
    { id: "rev-3", productId: "prod-fash-1", productName: "Classic Italian Leather Bomber Jacket - Antique Brown", userName: "Aman Malhotra", rating: 5, comment: "Authentic premium leather. It smells amazing, stitching is precise, looks highly elegant. Sizing runs slightly snug.", isSpam: false, date: "2026-06-04" },
    { id: "rev-4", productId: "prod-elec-1", productName: "Quantum Ultra-Sync Smartphone 5G", userName: "Spam bot 300", rating: 1, comment: "!!! EARN $$$ EASY HOME ONLINE CLICKS NOW !!! CLICK SITE http://scammy-clicks.com !!!", isSpam: true, date: "2026-06-05" }
  ] as Review[],

  notifications: [
    { id: "notif-1", title: "Out for Delivery!", text: "Your order #SMC-2026-9041 containing Stryder Aero-Pace Running Shoes represents successful delivery attempts today.", date: "2026-06-08T09:00:00Z", isRead: true, type: "order" },
    { id: "notif-2", title: "Low Stock Alert: VocNoise Headset", text: "Product: 'VocalNoise Studio Pro Gen-2 Headset' (SKU: VN-SP2-SLVR) has only 3 pieces left in main inventory warehouse.", date: "2026-06-10T11:45:00Z", isRead: false, type: "inventory" },
    { id: "notif-3", title: "Super Coupon Active!", text: "Unlock 20% off all catalog items above $100 value with check-out code: SMART20.", date: "2026-06-10T08:00:00Z", isRead: false, type: "offer" }
  ] as Notification[]
};

async function startServer() {
  const app = express();
  app.use(express.json());

  // API - Auth Login
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = dbState.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials. Email not found in database." });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials. Incorrect password code." });
    }
    // Simulate JWT token return
    res.json({
      message: "Login successful",
      token: "simulated-jwt-header-for-" + user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        gender: user.gender,
        dob: user.dob,
        profilePic: user.profilePic
      }
    });
  });

  // API - Auth Google Email Check
  app.post("/api/auth/google", (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Google account email is required." });
    }
    const user = dbState.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(404).json({ message: "Email not found in database." });
    }
    res.json({
      message: "Google Sign-In successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        gender: user.gender,
        dob: user.dob,
        profilePic: user.profilePic
      }
    });
  });

  // API - Auth Google Instant Auto-Register
  app.post("/api/auth/google-register", (req, res) => {
    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Google email is required." });
    }
    const exists = dbState.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(409).json({ message: "Email is already registered on SmartCommerce." });
    }
    const userPart = email.split('@')[0];
    const cleanName = name || (userPart.charAt(0).toUpperCase() + userPart.slice(1));
    const newUser = {
      id: "user-" + (dbState.users.length + 1),
      name: cleanName,
      email: email.toLowerCase(),
      password: "google-auth-no-password",
      mobile: "+91 " + Math.floor(9000000000 + Math.random() * 999999999),
      role: "Customer" as const,
      gender: "Other",
      dob: "1999-01-01",
      profilePic: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(userPart)}`
    };
    dbState.users.push(newUser);
    res.status(201).json({
      message: "Google account registered and verified!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role,
        gender: newUser.gender,
        dob: newUser.dob,
        profilePic: newUser.profilePic
      }
    });
  });

  // API - Auth Register
  app.post("/api/auth/register", (req, res) => {
    const { name, email, mobile, password, gender, dob } = req.body;
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: "Missing required profile parameters." });
    }
    const exists = dbState.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(409).json({ message: "Email is already registered on SmartCommerce." });
    }
    const newUser = {
      id: "user-" + (dbState.users.length + 1),
      name,
      email,
      password,
      mobile,
      role: "Customer" as const,
      gender: gender || "Other",
      dob: dob || "1999-01-01",
      profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
    };
    dbState.users.push(newUser);
    res.status(201).json({
      message: "Account created successfully!",
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: "Customer" }
    });
  });

  // API - Reset Password
  app.post("/api/auth/reset-password", (req, res) => {
    const { target, password } = req.body;
    if (!target || !password) {
      return res.status(400).json({ message: "Parameters target and password are required." });
    }
    const user = dbState.users.find(u => 
      u.email.toLowerCase() === target.toLowerCase() || 
      u.mobile === target
    );
    if (!user) {
      return res.status(404).json({ message: "No matched registered account found." });
    }
    user.password = password;
    res.json({ message: "Password updated successfully!" });
  });

  // API - Update User Profile
  app.put("/api/auth/update-profile", (req, res) => {
    const { userId, name, mobile, gender, dob, profilePic } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required to update profile." });
    }
    const user = dbState.users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ message: "User not found to update." });
    }

    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    if (gender) user.gender = gender;
    if (dob) user.dob = dob;
    if (profilePic) user.profilePic = profilePic;

    res.json({
      message: "Profile updated successfully!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        gender: user.gender,
        dob: user.dob,
        profilePic: user.profilePic
      }
    });
  });

  // API - Retrieve Categories
  app.get("/api/categories", (req, res) => {
    res.json(dbState.categories);
  });

  // API - Retrieve Products
  app.get("/api/products", (req, res) => {
    let list = [...dbState.products];
    const { category, search, sorting } = req.query;

    if (category && category !== "all") {
      list = list.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
    }

    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }

    if (sorting) {
      if (sorting === "price_asc") {
        list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      } else if (sorting === "price_desc") {
        list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      } else if (sorting === "popular") {
        list.sort((a, b) => b.rating - a.rating);
      } else if (sorting === "newest") {
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      }
    }

    res.json(list);
  });

  // API - Get Single Product Detail
  app.get("/api/products/:id", (req, res) => {
    const p = dbState.products.find(prod => prod.id === req.params.id);
    if (!p) return res.status(404).json({ message: "Product not located." });
    res.json(p);
  });

  // API - Admin Add Product
  app.post("/api/products", (req, res) => {
    const data = req.body;
    const newId = "prod-" + data.category + "-" + (dbState.products.length + 1);
    const newProduct: Product = {
      id: newId,
      name: data.name,
      description: data.description,
      category: data.category,
      brand: data.brand,
      sku: data.sku || "SKU-" + Math.floor(Math.random() * 900000),
      price: Number(data.price),
      discountPrice: data.discountPrice ? Number(data.discountPrice) : undefined,
      quantity: Number(data.quantity) || 10,
      images: data.images && data.images.length ? data.images : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"],
      specifications: data.specifications || {},
      weight: data.weight || "0.5kg",
      dimensions: data.dimensions || "10x10x10 cm",
      warranty: data.warranty || "1 Year Brand",
      rating: 5,
      numReviews: 0,
      isNew: true
    };
    dbState.products.push(newProduct);
    res.status(201).json({ message: "Product added to catalog", product: newProduct });
  });

  // API - Admin Delete Product
  app.delete("/api/products/:id", (req, res) => {
    const idx = dbState.products.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: "Product not found" });
    dbState.products.splice(idx, 1);
    res.json({ message: "Product removed successfully" });
  });

  // API - Admin Update Product Stock (Inventory Control)
  app.put("/api/products/:id/stock", (req, res) => {
    const p = dbState.products.find(prod => prod.id === req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });
    p.quantity = Number(req.body.quantity);
    res.json({ message: "Stock quantity synchronized", product: p });
  });

  // API - Cart operations (User-specific)
  app.get("/api/cart/:userId", (req, res) => {
    const uId = req.params.userId;
    const items = dbState.carts[uId] || [];
    res.json(items);
  });

  app.post("/api/cart/:userId", (req, res) => {
    const uId = req.params.userId;
    const { productId, quantity } = req.body;
    if (!dbState.carts[uId]) dbState.carts[uId] = [];

    const existing = dbState.carts[uId].find(i => i.productId === productId);
    if (existing) {
      existing.quantity += quantity || 1;
    } else {
      dbState.carts[uId].push({ productId, quantity: quantity || 1 });
    }
    res.json(dbState.carts[uId]);
  });

  app.put("/api/cart/:userId", (req, res) => {
    const uId = req.params.userId;
    const { productId, quantity } = req.body;
    if (!dbState.carts[uId]) dbState.carts[uId] = [];

    const existing = dbState.carts[uId].find(i => i.productId === productId);
    if (existing) {
      existing.quantity = quantity;
      if (existing.quantity <= 0) {
        dbState.carts[uId] = dbState.carts[uId].filter(i => i.productId !== productId);
      }
    }
    res.json(dbState.carts[uId]);
  });

  app.delete("/api/cart/:userId/:productId", (req, res) => {
    const { userId, productId } = req.params;
    if (dbState.carts[userId]) {
      dbState.carts[userId] = dbState.carts[userId].filter(i => i.productId !== productId);
    }
    res.json(dbState.carts[userId] || []);
  });

  // API - Wishlist Operations
  app.get("/api/wishlist/:userId", (req, res) => {
    res.json(dbState.wishlists[req.params.userId] || []);
  });

  app.post("/api/wishlist/:userId", (req, res) => {
    const uId = req.params.userId;
    const { productId } = req.body;
    if (!dbState.wishlists[uId]) dbState.wishlists[uId] = [];
    if (!dbState.wishlists[uId].includes(productId)) {
      dbState.wishlists[uId].push(productId);
    }
    res.json(dbState.wishlists[uId]);
  });

  app.delete("/api/wishlist/:userId/:productId", (req, res) => {
    const { userId, productId } = req.params;
    if (dbState.wishlists[userId]) {
      dbState.wishlists[userId] = dbState.wishlists[userId].filter(id => id !== productId);
    }
    res.json(dbState.wishlists[userId] || []);
  });

  // API - Create Order & Reduce Inventory Stock
  app.post("/api/orders", (req, res) => {
    const { userId, items, address, total, discountAmount, payableAmount, paymentMethod } = req.body;
    if (!userId || !items || !items.length || !address) {
      return res.status(400).json({ message: "Invalid order payload fields." });
    }

    const orderId = "SMC-2026-" + Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString(),
      status: "Confirmed",
      items,
      total,
      discountAmount,
      payableAmount,
      address,
      paymentMethod,
      paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Success"
    };

    // Deduct stock for each item purchased and emit low stock alert notifications
    items.forEach((item: any) => {
      const prod = dbState.products.find(p => p.id === item.productId);
      if (prod) {
        prod.quantity = Math.max(0, prod.quantity - item.quantity);
        if (prod.quantity <= 5) {
          // Trigger automatic low stock alerts
          const notif: Notification = {
            id: "notif-stock-" + Date.now() + Math.random(),
            title: "Warehouse Stock Alert",
            text: `Critical! Product '${prod.name}' is running low (Current stock: ${prod.quantity}). Synchronize stock now.`,
            date: new Date().toISOString(),
            isRead: false,
            type: "inventory"
          };
          dbState.notifications.unshift(notif);
        }
      }
    });

    // Save order
    dbState.orders.unshift(newOrder);

    // Empty User Cart
    dbState.carts[userId] = [];

    // Order Success Notification
    const userNotif: Notification = {
      id: "notif-order-" + Date.now(),
      title: "Order Placed Successfully!",
      text: `Your purchase of ${items.length} item(s) (Order id: ${orderId}) is confirmed of value $${payableAmount}.`,
      date: new Date().toISOString(),
      isRead: false,
      type: "order"
    };
    dbState.notifications.unshift(userNotif);

    res.status(201).json({ message: "Order processed successfully!", order: newOrder });
  });

  // API - Retrieve User/Admin Orders
  app.get("/api/orders", (req, res) => {
    res.json(dbState.orders);
  });

  // API - Update Order Status (Admin Dashboard)
  app.put("/api/orders/:id", (req, res) => {
    const order = dbState.orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ message: "Order code not identified" });
    const { status } = req.body;
    order.status = status;

    // Trigger Notification for Status Update
    const notif: Notification = {
      id: "notif-status-" + Date.now(),
      title: `Order Status: ${status}`,
      text: `SmartCommerce order #${order.id} is now updated to: '${status}'.`,
      date: new Date().toISOString(),
      isRead: false,
      type: "order"
    };
    dbState.notifications.unshift(notif);

    res.json({ message: "Order status synchronized successfully.", order });
  });

  // API - Coupons validation
  app.post("/api/coupons/validate", (req, res) => {
    const { code, cartTotal } = req.body;
    if (!code) return res.status(400).json({ message: "Coupon code empty." });

    const coup = dbState.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coup) {
      return res.status(404).json({ message: "Invalid coupon. Coupon code does not exist." });
    }
    if (!coup.isActive) {
      return res.status(400).json({ message: "This coupon code has been deactivated by Admin." });
    }
    if (cartTotal < coup.minBillValue) {
      return res.status(400).json({ message: `Minimum cart value of $${coup.minBillValue} is required for this discount.` });
    }

    res.json({ message: "Coupon applied!", coupon: coup });
  });

  // API - Admin Create Coupon
  app.post("/api/coupons", (req, res) => {
    const { code, type, value, expiryDate, minBillValue } = req.body;
    if (!code || !type || value === undefined) {
      return res.status(400).json({ message: "Invalid coupon criteria parameters." });
    }
    const newCoupon: Coupon = {
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      expiryDate: expiryDate || "2026-12-31",
      minBillValue: Number(minBillValue) || 0,
      isActive: true
    };
    dbState.coupons.push(newCoupon);
    res.status(201).json({ message: "New coupon created successfully.", coupon: newCoupon });
  });

  // API - Admin Toggle Coupon Activations
  app.put("/api/coupons/:code/toggle", (req, res) => {
    const coup = dbState.coupons.find(c => c.code === req.params.code);
    if (!coup) return res.status(404).json({ message: "Coupon not found" });
    coup.isActive = !coup.isActive;
    res.json({ message: `Coupon turned ${coup.isActive ? "Active" : "Inactive"}`, coupon: coup });
  });

  app.get("/api/coupons", (req, res) => {
    res.json(dbState.coupons);
  });

  // API - Notifications Sync
  app.get("/api/notifications", (req, res) => {
    res.json(dbState.notifications);
  });

  app.post("/api/notifications/read-all", (req, res) => {
    dbState.notifications.forEach(n => n.isRead = true);
    res.json({ message: "All notifications designated read" });
  });

  // API - Manage Reviews & Moderate Spams
  app.get("/api/reviews", (req, res) => {
    res.json(dbState.reviews);
  });

  app.post("/api/reviews", (req, res) => {
    const { productId, rating, comment, userName } = req.body;
    const product = dbState.products.find(p => p.id === productId);
    if (!product) return res.status(404).json({ message: "Product context missing" });

    // Simple anti-spam heuristic logic
    const isSpam = comment.toLowerCase().includes("earn money") || comment.toLowerCase().includes("click site") || comment.toLowerCase().includes("http:") || comment.toLowerCase().includes("$$$") || comment.toLowerCase().includes("scam");

    const newRev: Review = {
      id: "rev-" + (dbState.reviews.length + 1),
      productId,
      productName: product.name,
      userName: userName || "Verified Customer",
      rating: Number(rating) || 5,
      comment,
      isSpam,
      date: new Date().toISOString().split('T')[0]
    };

    dbState.reviews.unshift(newRev);

    // Recalculate average ratings if not spam
    if (!isSpam) {
      const pReviews = dbState.reviews.filter(r => r.productId === productId && !r.isSpam);
      const sum = pReviews.reduce((acc, cr) => acc + cr.rating, 0);
      product.rating = Number((sum / pReviews.length).toFixed(1));
      product.numReviews = pReviews.length;
    }

    res.status(201).json({ message: "Review posted successfully!", review: newRev });
  });

  app.delete("/api/reviews/:id", (req, res) => {
    const idx = dbState.reviews.findIndex(r => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: "Review not identified" });
    dbState.reviews.splice(idx, 1);
    res.json({ message: "Review deleted successfully" });
  });

  // API - Address management
  app.get("/api/addresses/:userId", (req, res) => {
    res.json(dbState.addresses[req.params.userId] || []);
  });

  app.post("/api/addresses/:userId", (req, res) => {
    const uId = req.params.userId;
    const data = req.body;
    if (!dbState.addresses[uId]) dbState.addresses[uId] = [];

    const newAddr: Address = {
      id: "addr-" + Date.now(),
      fullName: data.fullName,
      phone: data.phone,
      houseNumber: data.houseNumber,
      street: data.street,
      city: data.city,
      state: data.state,
      country: data.country,
      pinCode: data.pinCode
    };

    dbState.addresses[uId].push(newAddr);
    res.status(201).json(newAddr);
  });

  app.delete("/api/addresses/:userId/:addressId", (req, res) => {
    const { userId, addressId } = req.params;
    if (!dbState.addresses[userId]) {
      return res.status(404).json({ message: "No addresses found." });
    }
    const idx = dbState.addresses[userId].findIndex(a => a.id === addressId);
    if (idx === -1) {
      return res.status(404).json({ message: "Address not found." });
    }
    dbState.addresses[userId].splice(idx, 1);
    res.json({ message: "Address deleted successfully", addresses: dbState.addresses[userId] });
  });

  // AI Chatbot with real server-side @google/genai orchestration
  app.post("/api/chatbot", async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Query message is required." });
    }

    try {
      // Lazy initialization of the Gemini client
      const ai = getGeminiClient();

      // Compile a comprehensive background context to keep the model fully grounded in SmartCommerce catalogue, orders, and addresses
      const itemsContext = dbState.products.map(p => `- ${p.name} ($${p.discountPrice || p.price}, ${p.quantity} stock, SKU: ${p.sku})`).join("\n");
      const orderContext = dbState.orders.map(o => `- Order #${o.id}: Status=${o.status}, Amount=$${o.payableAmount}, CourierAddress=${o.address.city}, Date=${o.date}`).join("\n");
      const couponsContext = dbState.coupons.filter(c => c.isActive).map(c => `- Code '${c.code}': ${c.type} discount, value $${c.value}`).join("\n");

      const systemInstruction = `
        You are the SmartCommerce AI Shopping Assistant, a polite and helpful assistant integrated into our Flutter e-commerce application.
        Provide professional, direct guidance about our catalog, orders, and services. Highlight discount coupons to encourage checkout!

        Current date: ${new Date().toISOString().split('T')[0]}

        Here is the live backend database state to ground your responses accurately. Do not make up fake orders or fake item prices!
        
        PRODUCTS IN STOCK:
        ${itemsContext}

        ACTIVE ORDERS:
        ${orderContext}

        AVAILABLE DISCOUNT COUPONS:
        ${couponsContext}

        RULES:
        1. Keep answers concise, helpful, and retail-oriented (max 3-4 sentences), formatted in clean markdown.
        2. Help customers search products, track order pipelines, or validate active coupon queries.
        3. If an order identifier matches one of the active orders, answer its exact status immediately.
        4. Do NOT disclose backend database technical details like 'dbState'. Always talk as a friendly store representative.
      `;

      // Structure conversational history for standard Gemini contents format
      const contents = [];
      if (history && history.length) {
        history.forEach((h: { sender: 'user' | 'bot' | 'system', text: string }) => {
          contents.push({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          });
        });
      }
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      // Execute generateContent query using gemini-3.5-flash
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });

      const textOutput = response.text || "I was unable to formulate a response. Let me know if I can assist with product search or order status.";
      res.json({ text: textOutput });
    } catch (err: any) {
      console.error("Gemini API backend error:", err);
      // Fallback message with context guidelines
      let errMsg = "AI chatbot operates on a live server-side key. Please configure GEMINI_API_KEY inside Settings > Secrets.";
      if (err.message && !err.message.includes("GEMINI_API_KEY")) {
        errMsg = `Error conducting intelligent synthesis: ${err.message}`;
      }
      res.json({
        text: `**SmartCommerce Assistant (Offline Mode)**:\n\nHello! I notice the server environment might have some configuration issues. \n\n${errMsg}\n\n*Heuristic Help*: I am currently stocked with the **Quantum 5G Smartphone**, **VocalNoise Suite Headset**, and **Aero-Pace Runner shoes** in our active catalogue.`
      });
    }
  });

  // Admin and Analytical Reports endpoints
  app.get("/api/admin/reports", (req, res) => {
    // Generate analytics based on items
    const totalUsers = dbState.users.length;
    const totalProducts = dbState.products.length;
    const totalCategories = dbState.categories.length;
    const totalOrders = dbState.orders.length;
    
    const revenue = dbState.orders
      .filter(o => o.status !== "Cancelled")
      .reduce((acc, o) => acc + o.payableAmount, 0);

    const pendingOrders = dbState.orders.filter(o => o.status === "Pending" || o.status === "Confirmed").length;

    // Charts
    const salesChart = [
      { name: "Mon", sales: 180, orders: 2 },
      { name: "Tue", sales: 320, orders: 3 },
      { name: "Wed", sales: 140, orders: 1 },
      { name: "Thu", sales: 450, orders: 4 },
      { name: "Fri", sales: 290, orders: 2 },
      { name: "Sat", sales: 620, orders: 5 },
      { name: "Sun", sales: dbState.orders.length ? revenue * 0.4 : 350, orders: dbState.orders.length }
    ];

    const categoryRevenue = dbState.categories.map(c => {
      // count active goods
      const pCount = dbState.products.filter(p => p.category === c.id).length;
      return { name: c.name, value: pCount * 25, count: pCount };
    });

    res.json({
      metrics: {
        totalUsers,
        totalProducts,
        totalCategories,
        totalOrders,
        revenue,
        pendingOrders
      },
      salesChart,
      categoryRevenue,
      lowStockProducts: dbState.products.filter(p => p.quantity <= 10)
    });
  });

  // Serve static files in development & production
  // Setup Vite middleware on development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind to port 3000 as mandatory
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartCommerce Server Running on port ${PORT}`);
  });
}

startServer();
