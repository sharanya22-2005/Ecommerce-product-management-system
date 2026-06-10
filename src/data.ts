import { Product, Category, Coupon } from "./types";

export const categories: Category[] = [
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
];

export const sampleProducts: Product[] = [
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
    description: "Active Hybrid Noise Cancelling wireless over-ear headphones with custom spatial audio drivers and dynamic head-tracking capabilities. Over 50 hours of wireless Bluetooth playback with an premium aluminium alloy lightweight body.",
    category: "electronics",
    brand: "VocalNoise",
    sku: "VN-SP2-SLVR",
    price: 299,
    discountPrice: 249,
    quantity: 12, // Needs stock warning!
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
    quantity: 8, // Low Stock Alert!
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
  }
];

export const sampleCoupons: Coupon[] = [
  { code: "SMART20", type: "Percentage", value: 20, expiryDate: "2026-12-31", minBillValue: 100, isActive: true },
  { code: "FLAT50", type: "Flat", value: 50, expiryDate: "2026-08-30", minBillValue: 200, isActive: true },
  { code: "FREESHIP", type: "FreeShipping", value: 0, expiryDate: "2026-10-15", minBillValue: 50, isActive: true },
  { code: "ADMINTEST", type: "Percentage", value: 100, expiryDate: "2026-12-31", minBillValue: 10, isActive: true }
];

export const flutterCodeSnippets = {
  projectTree: `
smartcommerce_mobile/
├── android/
├── ios/
├── lib/
│   ├── main.dart                  # App bootstrap, Route management, Dark/Light Themes
│   ├── models/
│   │   ├── user.dart              # User Authentication Profile representation 
│   │   ├── product.dart           # E-commerce product properties & schema details
│   │   ├── order.dart             # Purchase parameters & active visual timeline
│   │   └── cart.dart              # Dynamic cart count and items tracking
│   ├── services/
│   │   ├── api_service.dart       # Centralized HTTP Client, JWT token auto-injector
│   │   ├── fcm_service.dart       # Firebase Push Notifications handler
│   │   └── payment_service.dart   # Razorpay SDK and card checkouts integration
│   ├── providers/
│   │   ├── auth_provider.dart     # Dynamic Login, OTP verifier and Session manager
│   │   ├── cart_provider.dart     # Shopping cart actions (add, sync, checkout)
│   │   └── product_provider.dart  # Smart filters, search, and AI recommended systems
│   └── screens/
│       ├── splash_screen.dart     # Fast bootstrap splash screen
│       ├── login_screen.dart      # JWT Credentials Login page
│       ├── register_screen.dart   # Customer Mobile Signups & OTP fields
│       ├── home_screen.dart       # Scrollable product catalogs, categories, banners
│       ├── cart_screen.dart       # Cart items counter, coupon triggers
│       ├── product_details.dart   # High fidelity Image Swipe view, specs bento box
│       ├── chatbot_screen.dart    # Interactive real-time AI dialog agent
│       ├── checkout_screen.dart   # Shipping selectors & razorpay trigger
│       ├── orders_screen.dart     # visual pipeline step tracker, invoice downloader
│       └── admin_dashboard.dart   # Inventory controls, reports, stats for admin roles
├── pubspec.yaml                   # Razorpay, Firebase, Provider, and Flutter packages
└── README.md                      # Deployment specs and local setup metrics
  `,

  pubspec: `
name: smartcommerce_mobile
description: SmartCommerce - E-Commerce Product Management System Mobile App built on Flutter Material 3.
version: 1.0.0+1

environment:
  sdk: ">=3.2.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.5
  
  # State Management & DI
  provider: ^6.1.1
  flutter_riverpod: ^2.4.9
  
  # Network & Auth
  http: ^1.2.0
  flutter_secure_storage: ^9.0.0   # Persist JWT credentials safely on device keychain
  jwt_decoder: ^2.0.1
  
  # UI/UX & Animations
  cached_network_image: ^3.3.1     # Smooth remote assets buffering
  carousel_slider: ^4.2.1          # Elegant promo slider carousel
  flutter_spinkit: ^5.2.0          # Fluid animations loaders
  shimmer: ^3.0.0                  # Loading skeletons
  lucide_icons: ^0.320.0
  
  # Hardware & Services
  speech_to_text: ^6.3.0           # Voice search engine
  firebase_core: ^2.24.0
  firebase_messaging: ^14.7.10     # Live order tracing notifications FCM
  
  # Payments Integration
  razorpay_flutter: ^1.3.5         # Credit/Debit, Netbanking, native SDK gateway

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/banners/
    - assets/images/
    - assets/logo.png
  `,

  mainDart: `
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:smartcommerce_mobile/providers/auth_provider.dart';
import 'package:smartcommerce_mobile/providers/cart_provider.dart';
import 'package:smartcommerce_mobile/providers/product_provider.dart';
import 'package:smartcommerce_mobile/screens/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => ProductProvider()),
        ChangeNotifierProvider(create: (_) => CartProvider()),
      ],
      child: const SmartCommerceApp(),
    ),
  );
}

class SmartCommerceApp extends StatelessWidget {
  const SmartCommerceApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SmartCommerce',
      debugShowCheckedModeBanner: false,
      
      // Theme Configuration with Material 3 styling
      themeMode: ThemeMode.system, 
      theme: ThemeData(
        useMaterial3: true,
        fontFamily: 'Inter',
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0F172A), // Slate 900 primary
          brightness: Brightness.light,
          primary: const Color(0xFF0F172A),
          secondary: const Color(0xFF2563EB), // Blue 600
          background: const Color(0xFFF8FAFC), // Slate 50
        ),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        fontFamily: 'Inter',
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0F172A),
          brightness: Brightness.dark,
          primary: const Color(0xFFF8FAFC),
          secondary: const Color(0xFF3B82F6),
          background: const Color(0xFF020617), // Slate 950
        ),
      ),
      home: const SplashScreen(),
    );
  }
}
  `,

  apiService: `
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  static const String baseUrl = "https://your-flask-api-server.com/api";
  final _storage = const FlutterSecureStorage();

  // Helper to fetch request headers with JWT token attached
  Future<Map<String, String>> _getHeaders() async {
    final token = await _storage.read(key: "jwt_token");
    return {
      "Content-Type": "application/json",
      "Accept": "application/json",
      if (token != null) "Authorization": "Bearer $token",
    };
  }

  // GET Request
  Future<http.Response> get(String endpoint) async {
    final headers = await _getHeaders();
    return await http.get(Uri.parse("$baseUrl$endpoint"), headers: headers);
  }

  // POST Request
  Future<http.Response> post(String endpoint, Map<String, dynamic> body) async {
    final headers = await _getHeaders();
    return await http.post(
      Uri.parse("$baseUrl$endpoint"),
      headers: headers,
      body: jsonEncode(body),
    );
  }

  // PUT Request
  Future<http.Response> put(String endpoint, Map<String, dynamic> body) async {
    final headers = await _getHeaders();
    return await http.put(
      Uri.parse("$baseUrl$endpoint"),
      headers: headers,
      body: jsonEncode(body),
    );
  }

  // DELETE Request
  Future<http.Response> delete(String endpoint) async {
    final headers = await _getHeaders();
    return await http.delete(Uri.parse("$baseUrl$endpoint"), headers: headers);
  }
}
  `
};

export const flaskCodeSnippets = {
  requirementsTxt: `
Flask==3.0.2
Flask-Cors==4.0.0
Flask-SQLAlchemy==3.1.1
PyJWT==2.8.0
bcrypt==4.1.2
PyMySQL==1.1.0       # MySQL database adapter
google-genai==2.4.0  # Real Gemini integration
cloudinary==1.38.0   # Image uploads handling
python-dotenv==1.0.1
gunicorn==21.2.0     # Production WSGI server
  `,

  appPy: `
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

# Load Local Settings
load_dotenv()

from models import db, User, Product, Order
from auth import token_required, has_role

app = Flask(__name__)
CORS(app)

# Database Configurations - MySQL via PyMySQL engine
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL', 
    'mysql+pymysql://root:secure_pwd@localhost:3306/smartcommerce_db'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'SUPER_JWT_SECRET_KEY_999!')

db.init_app(app)

# Create database tables within isolated context
with app.app_context():
    db.create_all()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "server": "Flask SmartCommerce Engine"}), 200

# AUTH: Register Customer
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Invalid credentials fields"}), 400
        
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"message": "User email already registered"}), 409
        
    new_user = User(
        name=data.get('name'),
        email=data['email'],
        mobile=data.get('mobile'),
        role='Customer'
    )
    new_user.set_password(data['password'])
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "Account initialized successfully"}), 201

# PROD: Retrieve Products (Filtered and Sorted)
@app.route('/api/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    search_query = request.args.get('search')
    sort_by = request.args.get('sort')
    
    query = Product.query
    if category:
        query = query.filter_by(category=category)
    if search_query:
        query = query.filter(Product.name.like(f"%{search_query}%"))
        
    # Apply user-requested sorting configs
    if sort_by == 'price_low_high':
        query = query.order_by(Product.price.asc())
    elif sort_by == 'price_high_low':
        query = query.order_by(Product.price.desc())
    else:
        query = query.order_by(Product.id.desc())
        
    products = query.all()
    return jsonify([p.to_dict() for p in products]), 200

# ADMIN: Create/Add Product (With Role restriction)
@app.route('/api/products', methods=['POST'])
@token_required
@has_role('Admin')
def add_product(current_user):
    data = request.get_json()
    new_prod = Product(
        name=data['name'],
        description=data['description'],
        category=data['category'],
        brand=data['brand'],
        sku=data['sku'],
        price=data['price'],
        quantity=data['quantity'],
        images=data.get('images', [])
    )
    db.session.add(new_prod)
    db.session.commit()
    return jsonify({"message": "Product created successfully", "product": new_prod.to_dict()}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
  `,

  authPy: `
import jwt
import datetime
from flask import request, jsonify, current_app
from functools import wraps
from models import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_val = request.headers['Authorization']
            if auth_val.startswith('Bearer '):
                token = auth_val.split(' ')[1]
                
        if not token:
            return jsonify({'message': 'Authorization header is missing or incorrect!'}), 401
            
        try:
            # Decode authorization JWT token using secret key
            data = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()
            if not current_user:
                return jsonify({'message': 'Authorized token user not found!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Authentication session expired, log in again'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid authentication signature!'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

def has_role(required_role):
    def decorator(f):
        @wraps(f)
        def decorated(current_user, *args, **kwargs):
            if current_user.role != required_role:
                return jsonify({'message': 'Unauthorized! Required Role: ' + required_role}), 403
            return f(current_user, *args, **kwargs)
        return decorated
    return decorator
  `
};

export const mysqlSchemaSql = `
-- SmartCommerce Relational Database Layout
-- Target Provider: MySQL v8.0+

CREATE DATABASE IF NOT EXISTS smartcommerce_db;
USE smartcommerce_db;

-- 1. Users Table (Core authentications & profiles)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    mobile VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Customer', 'Admin', 'DeliveryPartner') DEFAULT 'Customer',
    gender ENUM('Male', 'Female', 'Other') NULL,
    dob DATE NULL,
    profile_pic VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- 2. Categories Table
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('enabled', 'disabled') DEFAULT 'enabled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Products Table
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id VARCHAR(50) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2) DEFAULT NULL,
    quantity INT NOT NULL DEFAULT 0, -- Active Stock Available
    weight VARCHAR(50) NULL,
    dimensions VARCHAR(100) NULL,
    warranty VARCHAR(100) NULL,
    rating DECIMAL(2,1) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_prod_category (category_id),
    INDEX idx_prod_sku (sku)
) ENGINE=InnoDB;

-- 4. ProductImages Table
CREATE TABLE product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Inventory Table (Detailed Warehouse Stock tracking)
CREATE TABLE inventory (
    product_id VARCHAR(50) PRIMARY KEY,
    current_stock INT NOT NULL DEFAULT 0,
    reserved_stock INT NOT NULL DEFAULT 0, -- Cart reserves or unpaid holds
    sold_stock INT NOT NULL DEFAULT 0,
    low_stock_limit INT NOT NULL DEFAULT 10,
    warehouse_location VARCHAR(100) DEFAULT 'Main Warehouse - Aisle 4',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Wishlist Table
CREATE TABLE wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_wish_record (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Addresses Table
CREATE TABLE addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    house_number VARCHAR(100) NOT NULL,
    street VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    pin_code VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Coupons Table
CREATE TABLE coupons (
    code VARCHAR(30) PRIMARY KEY,
    type ENUM('Percentage', 'Flat', 'FreeShipping') NOT NULL,
    value DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    expiry_date DATE NOT NULL,
    min_bill_value DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    usage_limit INT DEFAULT 1000,
    usage_count INT DEFAULT 0
) ENGINE=InnoDB;

-- 9. Orders Table
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    user_id INT NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned') DEFAULT 'Pending',
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    payable_amount DECIMAL(10,2) NOT NULL,
    address_id INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- CreditCard, UPI, COD
    coupon_applied VARCHAR(30) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE RESTRICT,
    FOREIGN KEY (coupon_applied) REFERENCES coupons(code) ON DELETE SET NULL,
    INDEX idx_order_user (user_id)
) ENGINE=InnoDB;

-- 10. OrderItems Table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 11. Payments Table
CREATE TABLE payments (
    id VARCHAR(100) PRIMARY KEY, -- Transaction ID (e.g., Razorpay pay_id)
    order_id VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    method VARCHAR(50) NOT NULL,
    status ENUM('Pending', 'Success', 'Failed', 'Refunded') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 12. Reviews Table
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    rating TINYINT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    is_spam BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_rev_product (product_id)
) ENGINE=InnoDB;

-- 13. Notifications Table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    text VARCHAR(255) NOT NULL,
    type ENUM('order', 'offer', 'inventory') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
`;
