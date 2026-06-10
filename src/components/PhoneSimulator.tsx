import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Grid, 
  ShoppingCart, 
  ShoppingBag, 
  User, 
  Search, 
  Mic, 
  Heart, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  Send, 
  MessageSquare, 
  Check, 
  ChevronRight, 
  SlidersHorizontal, 
  Wifi, 
  Battery, 
  Sparkles, 
  Percent, 
  Eye, 
  Star, 
  CreditCard, 
  UserCheck, 
  PlusCircle, 
  Home as HomeIcon,
  BadgeAlert,
  Loader2
} from 'lucide-react';
import { Product, Category, CartItem, Order, Address, Coupon, Review, Notification, ChatMessage } from '../types';

interface PhoneSimulatorProps {
  currentUser: any;
  setCurrentUser: (user: any) => void;
  onNotificationTriggered: (title: string, text: string) => void;
}

export default function PhoneSimulator({ currentUser, setCurrentUser, onNotificationTriggered }: PhoneSimulatorProps) {
  // Mobile UI state
  const [mobileScreen, setMobileScreen] = useState<'splash' | 'login' | 'register' | 'forgot' | 'home' | 'categories' | 'details' | 'cart' | 'checkout' | 'orders' | 'profile' | 'chatbot'>('splash');
  const [phoneTheme, setPhoneTheme] = useState<'light' | 'dark'>('dark');
  
  // Data State synced with express backend
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartItems, setCartItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Selected targets
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('popular');
  const [cartCount, setCartCount] = useState(0);

  // Chatbot state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auth Inputs
  const [loginEmail, setLoginEmail] = useState('pvsharanya21@gmail.com');
  const [loginPassword, setLoginPassword] = useState('user123');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Checkout flows
  const [checkoutStep, setCheckoutStep] = useState<'address' | 'review' | 'payment'>('address');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponErr, setCouponErr] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  const [razorpayOpen, setRazorpayOpen] = useState(false);
  const [razorpayCardNo, setRazorpayCardNo] = useState('4111 2222 3333 4444');
  const [razorpayCvv, setRazorpayCvv] = useState('123');
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<'success' | 'fail' | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Address form fields
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrHouse, setAddrHouse] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrZip, setAddrZip] = useState('');

  // Write review fields
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewProduct, setReviewProduct] = useState<string>('');
  const [activeProdTab, setActiveProdTab] = useState<'specs' | 'reviews'>('specs');

  // Swipe Gallery state
  const [detailImgIdx, setDetailImgIdx] = useState(0);

  // Sync state with back-end APIs
  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/products?category=${activeCategory}&search=${searchQuery}&sorting=${sortOption}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) setCategories(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCartAndWishlist = async () => {
    if (!currentUser) return;
    try {
      const cartRes = await fetch(`/api/cart/${currentUser.id}`);
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        setCartItems(cartData);
        setCartCount(cartData.reduce((acc: number, item: any) => acc + item.quantity, 0));
      }

      const wishRes = await fetch(`/api/wishlist/${currentUser.id}`);
      if (wishRes.ok) setWishlist(await wishRes.json());

      const addrRes = await fetch(`/api/addresses/${currentUser.id}`);
      if (addrRes.ok) {
        const addrs = await addrRes.json();
        setAddresses(addrs);
        if (addrs.length && !selectedAddressId) {
          setSelectedAddressId(addrs[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOrders = async () => {
    try {
      const oRes = await fetch('/api/orders');
      if (oRes.ok) {
        const allOrders = await oRes.json();
        // filter user's orders
        if (currentUser) {
          setOrders(allOrders);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchNotifications = async () => {
    try {
      const nRes = await fetch('/api/notifications');
      if (nRes.ok) setNotifications(await nRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  // Run initializations
  useEffect(() => {
    // Start splash delay
    const timer = setTimeout(() => {
      setMobileScreen('login');
    }, 2200);

    fetchProducts();
    fetchCategories();
    fetchNotifications();

    return () => clearTimeout(timer);
  }, []);

  // Sync details on variable change
  useEffect(() => {
    fetchProducts();
  }, [activeCategory, sortOption]);

  useEffect(() => {
    fetchCartAndWishlist();
    fetchOrders();
  }, [currentUser]);

  // Chat scroll anchor
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatLoading]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        onNotificationTriggered("Login Successful", `Welcome back, ${data.user.name}!`);
        setMobileScreen('home');
      } else {
        setAuthError(data.message || "Login failed");
      }
    } catch (err) {
      setAuthError("Server offline or host connection failure");
    }
  };

  // Register handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, mobile: regMobile, password: regPassword })
      });
      const data = await res.json();
      if (res.ok) {
        onNotificationTriggered("Account Created", "Registration OTP verification simulated successful!");
        setLoginEmail(regEmail);
        setLoginPassword(regPassword);
        setMobileScreen('login');
      } else {
        setAuthError(data.message || "Registration failed");
      }
    } catch (err) {
      setAuthError("Endpoint connectivity failure");
    }
  };

  // Cart operations helper
  const handleAddToCart = async (productId: string, qty: number = 1) => {
    if (!currentUser) {
      setMobileScreen('login');
      return;
    }
    try {
      const res = await fetch(`/api/cart/${currentUser.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: qty })
      });
      if (res.ok) {
        onNotificationTriggered("Cart Updated", "Item appended to your checkout drawer.");
        fetchCartAndWishlist();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateCartQty = async (productId: string, currentQty: number, offset: number) => {
    if (!currentUser) return;
    const targetQty = currentQty + offset;
    try {
      const res = await fetch(`/api/cart/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: targetQty })
      });
      if (res.ok) {
        fetchCartAndWishlist();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveFromCart = async (productId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/cart/${currentUser.id}/${productId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        onNotificationTriggered("Item Removed", "Product deleted from your active cart list.");
        fetchCartAndWishlist();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleWishlist = async (productId: string) => {
    if (!currentUser) {
      setMobileScreen('login');
      return;
    }
    try {
      const isWish = wishlist.includes(productId);
      if (isWish) {
        const res = await fetch(`/api/wishlist/${currentUser.id}/${productId}`, { method: 'DELETE' });
        if (res.ok) {
          setWishlist(prev => prev.filter(id => id !== productId));
          onNotificationTriggered("Wishlist Cleared", "Item removed from favorites.");
        }
      } else {
        const res = await fetch(`/api/wishlist/${currentUser.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
        });
        if (res.ok) {
          setWishlist(prev => [...prev, productId]);
          onNotificationTriggered("Wishlist Added", "Product bookmarks synced successfully.");
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add Address helper
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !addrName || !addrPhone || !addrCity) return;
    try {
      const res = await fetch(`/api/addresses/${currentUser.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: addrName,
          phone: addrPhone,
          houseNumber: addrHouse,
          street: addrStreet,
          city: addrCity,
          state: "Delhi N.C.R.",
          country: "India",
          pinCode: addrZip
        })
      });
      if (res.ok) {
        onNotificationTriggered("Address Integrated", "New delivery destination address register complete!");
        setShowAddressForm(false);
        setAddrName('');
        setAddrPhone('');
        fetchCartAndWishlist();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Coupons code apply
  const handleApplyCoupon = async () => {
    setCouponErr('');
    const total = getCartSubtotal();
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, cartTotal: total })
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedCoupon(data.coupon);
        onNotificationTriggered("Coupon Applied!", `Smart Discount of $${data.coupon.value} approved.`);
      } else {
        setCouponErr(data.message);
      }
    } catch (e) {
      setCouponErr("Coupon server checkout unavailable");
    }
  };

  // Chatbot core service logic client-side trigger
  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      sender: "user",
      text: chatInput,
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          // Limit history items to avoid massive logs payload
          history: chatHistory.slice(-6).map(h => ({ sender: h.sender, text: h.text }))
        })
      });
      const data = await res.json();
      const botMsg: ChatMessage = {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: data.text,
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  // Checkout purchase logic
  const handleConfirmOrder = async () => {
    if (!currentUser || !selectedAddressId) return;
    
    // Compile items
    const itemsPayload = cartItems.map(item => {
      const prod = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        productName: prod?.name || "Product SKU Item",
        productPrice: prod?.discountPrice || prod?.price || 10,
        quantity: item.quantity,
        productImage: prod?.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"
      };
    });

    const subtotal = getCartSubtotal();
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'Percentage') {
        discount = Math.round(subtotal * (appliedCoupon.value / 100));
      } else {
        discount = appliedCoupon.value;
      }
    }

    const addr = addresses.find(a => a.id === selectedAddressId) || addresses[0];

    setOrderProcessing(true);
    setRazorpayOpen(false);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          items: itemsPayload,
          address: addr,
          total: subtotal,
          discountAmount: discount,
          payableAmount: Math.max(1, subtotal - discount),
          paymentMethod: paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod === 'UPI' ? 'UPI Gateway' : 'Credit Card'
        })
      });
      
      if (res.ok) {
        setOrderSuccess('success');
        setCartItems([]);
        setAppliedCoupon(null);
        setCouponCode('');
        fetchCartAndWishlist();
        fetchOrders();
      } else {
        setOrderSuccess('fail');
      }
    } catch (e) {
      setOrderSuccess('fail');
    } finally {
      setOrderProcessing(false);
    }
  };

  // Review posting handler
  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !reviewComment.trim()) return;
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          rating: reviewRating,
          comment: reviewComment,
          userName: currentUser ? currentUser.name : "Verified Buyer"
        })
      });
      if (res.ok) {
        onNotificationTriggered("Review Shared", "Feedback submitted to spam analysis moderation center.");
        setReviewComment('');
        // Refresh product details
        const detRes = await fetch(`/api/products/${selectedProduct.id}`);
        if (detRes.ok) setSelectedProduct(await detRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper selectors
  const getProductQtyInCart = (id: string): number => {
    return cartItems.find(i => i.productId === id)?.quantity || 0;
  };

  const getCartSubtotal = (): number => {
    return cartItems.reduce((acc, item) => {
      const prod = products.find(p => p.id === item.productId);
      const price = prod?.discountPrice || prod?.price || 0;
      return acc + (price * item.quantity);
    }, 0);
  };

  const currentLocalTime = "13:02";

  // Recommended products engine client-side projection
  const getPersonalizedRecommendations = (): Product[] => {
    if (!products.length) return [];
    // Take categories user has in cart or wishlist, else defaults trending
    let preferredCategories: string[] = [];
    cartItems.forEach(i => {
      const p = products.find(prod => prod.id === i.productId);
      if (p) preferredCategories.push(p.category);
    });
    const uniqueCats = Array.from(new Set(preferredCategories));
    
    if (uniqueCats.length) {
      return products.filter(p => uniqueCats.includes(p.category)).slice(0, 3);
    }
    // Fallback: Best sellers / isNew
    return products.filter(p => p.isBestseller || p.isNew).slice(0, 3);
  };

  return (
    <div className="flex flex-col items-center select-none font-sans text-zinc-100">
      
      {/* Top Controller Toggles */}
      <div className="mb-4 flex flex-wrap gap-3 w-full justify-center text-xs">
        <div className="flex items-center gap-1.5 bg-[#18181b] px-3 py-1.5 rounded-full border border-[#27272a] text-zinc-300 shadow-lg">
          <span className="font-semibold text-zinc-400">Simulated UI Theme:</span>
          <button 
            onClick={() => setPhoneTheme('light')}
            className={`px-2 py-0.5 rounded cursor-pointer font-bold transition-all text-[11px] ${phoneTheme === 'light' ? 'bg-blue-600 text-white' : 'hover:bg-[#27272a] text-zinc-400 hover:text-white'}`}
          >
            Light
          </button>
          <button 
            onClick={() => setPhoneTheme('dark')}
            className={`px-2 py-0.5 rounded cursor-pointer font-bold transition-all text-[11px] ${phoneTheme === 'dark' ? 'bg-blue-600 text-white' : 'hover:bg-[#27272a] text-zinc-400 hover:text-white'}`}
          >
            Dark
          </button>
        </div>

        {currentUser && (
          <div className="flex items-center gap-1.5 text-[11px] bg-emerald-500/10 text-emerald-400 p-1.5 px-3 rounded-full border border-emerald-500/20 shadow-md">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            Active Role: <span className="font-bold">{currentUser.role === 'Admin' ? 'Admin Override' : 'Customer Profile'}</span>
          </div>
        )}
      </div>

      {/* Visual Phone Shell */}
      <div className={`w-[360px] h-[720px] rounded-[48px] border-[12px] overflow-hidden flex flex-col relative shadow-2xl transition duration-300 ${phoneTheme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'}`}>
        
        {/* Phonewatch Notch Screen */}
        <div className="absolute top-0 inset-x-0 h-6 bg-slate-950 flex items-center justify-between px-6 z-50 text-white text-[11px] font-medium leading-none">
          <span>{currentLocalTime}</span>
          <div className="w-[110px] h-4 bg-black rounded-b-xl absolute left-1/2 -translate-x-1/2 top-0 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full mr-2"></div>
            <div className="w-14 h-1.5 bg-slate-900 rounded-full"></div>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Dynamic Mobile Screen Flowports */}
        <div className={`flex-1 pt-6 pb-12 overflow-y-auto flex flex-col ${phoneTheme === 'dark' ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
          
          {/* SCREEN: Splash screen */}
          {mobileScreen === 'splash' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white animate-pulse">
              <div className="p-4 bg-white/5 rounded-3xl border border-white/10 mb-4 shadow-xl">
                <Sparkles className="w-12 h-12 text-blue-400" />
              </div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-emerald-400 bg-clip-text text-transparent">SmartCommerce</h1>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">E-Commerce Ecosystem</p>
              <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Loading Secure JWT Session</span>
              </div>
            </div>
          )}

          {/* SCREEN: Login dashboard */}
          {mobileScreen === 'login' && (
            <div className="flex-1 p-6 flex flex-col justify-center space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold">Welcome Back!</h3>
                <p className="text-xs text-slate-400">SmartCommerce Retail Gateway</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {authError && <div className="p-2 bg-rose-50 text-rose-700 rounded text-xs text-center border border-rose-100 font-medium">{authError}</div>}
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</label>
                  <input 
                    type="email" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className={`w-full p-2 text-xs rounded-xl border outline-none ${phoneTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block">Password</label>
                    <button type="button" onClick={() => setMobileScreen('forgot')} className="text-[10px] text-blue-500 font-bold hover:underline">Forgot?</button>
                  </div>
                  <input 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className={`w-full p-2 text-xs rounded-xl border outline-none ${phoneTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl text-xs font-bold shadow-lg transition cursor-pointer"
                >
                  Sign In with Credentials
                </button>
              </form>

              <div className="text-center text-xs space-y-2">
                <span className="text-slate-400">Don't have an account? </span>
                <button onClick={() => setMobileScreen('register')} className="text-blue-500 font-bold hover:underline">Register Now</button>
                
                {/* Seed user tips */}
                <div className="p-3 bg-blue-500/5 rounded-xl text-[10px] text-slate-400 text-left border border-blue-500/10 space-y-1">
                  <span className="font-bold text-blue-400 block">Simulated Demo Logins:</span>
                  <div className="flex justify-between text-slate-300">
                    <span>Customer email: pvsharanya21@gmail.com</span>
                    <span className="font-bold text-white">user123</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Admin email: admin@smartcommerce.com</span>
                    <span className="font-bold text-white">admin123</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN: Forgot Password simulation */}
          {mobileScreen === 'forgot' && (
            <div className="flex-1 p-6 flex flex-col justify-center space-y-4">
              <h3 className="text-base font-bold text-center">Reset Account Credentials</h3>
              <p className="text-xs text-slate-400 text-center">Input your mobile number or email address registered, we will trigger simulated verification OTP sms code right away.</p>
              
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="pvsharanya21@gmail.com" 
                  className={`w-full p-2.5 text-xs rounded-xl border outline-none ${phoneTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}
                />
                <button 
                  onClick={() => {
                    onNotificationTriggered("Verifiable SMS Sent", "Code [SMC-5011] was dispatched to registered devices.");
                    setMobileScreen('login');
                  }}
                  className="w-full bg-blue-600 text-white p-2.5 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Send OTP Verification Code
                </button>
                <button onClick={() => setMobileScreen('login')} className="w-full text-xs text-slate-400 hover:underline">Cancel</button>
              </div>
            </div>
          )}

          {/* SCREEN: Registration user form */}
          {mobileScreen === 'register' && (
            <div className="flex-1 p-6 flex flex-col justify-center space-y-4">
              <div className="text-center">
                <h3 className="text-base font-bold">Initialize New Wallet</h3>
                <p className="text-xs text-slate-400">Join SmartCommerce retail nodes</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Full Name (e.g. Sharanya V.)"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                  className={`w-full p-2 text-xs rounded-xl border outline-none ${phoneTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}
                />
                <input 
                  type="email" 
                  placeholder="Email ID"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  className={`w-full p-2 text-xs rounded-xl border outline-none ${phoneTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}
                />
                <input 
                  type="text" 
                  placeholder="Mobile (e.g. +91 9988776655)"
                  value={regMobile}
                  onChange={(e) => setRegMobile(e.target.value)}
                  required
                  className={`w-full p-2 text-xs rounded-xl border outline-none ${phoneTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}
                />
                <input 
                  type="password" 
                  placeholder="Set Password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  className={`w-full p-2 text-xs rounded-xl border outline-none ${phoneTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}
                />
                
                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white p-2.5 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Verify via Mobile OTP
                </button>
              </form>

              <button onClick={() => setMobileScreen('login')} className="text-xs text-blue-500 hover:underline text-center">Back to Sign In</button>
            </div>
          )}

          {/* SCREEN: HOME PAGE (The central retail browse carousel) */}
          {mobileScreen === 'home' && (
            <div className="space-y-5">
              
              {/* Header Navigation Area */}
              <div className="px-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Deliver to</span>
                  <p className="text-xs font-bold text-slate-300 truncate max-w-[150px]">
                    {addresses.length ? `${addresses[0].fullName}, ${addresses[0].city}` : "Register Address"}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setMobileScreen('chatbot')}
                    className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-full text-blue-400 border border-blue-500/10 cursor-pointer relative"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentUser(null);
                      setMobileScreen('login');
                    }}
                    className="p-1.5 bg-rose-500/10 rounded-full text-rose-400 hover:text-rose-500 cursor-pointer text-xs font-bold"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Search Bar Block with Voice Search Indicator */}
              <div className="px-4">
                <div className={`p-2 rounded-2xl flex items-center gap-2 border ${phoneTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Search phones, sneakers, jackets..." 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      fetchProducts();
                    }}
                    className="bg-transparent outline-none text-xs w-full text-slate-200 placeholder-slate-500"
                  />
                  <button 
                    onClick={() => {
                      setSearchQuery("Quantum 5G");
                      fetchProducts();
                      onNotificationTriggered("Voice Search Activated", "Personalized auto-predictions fetched: Quantum.");
                    }}
                    className="text-indigo-400 hover:text-indigo-500 flex-shrink-0 cursor-pointer"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>

                {searchQuery && (
                  <div className="mt-2 text-[10px] text-slate-400 flex justify-between">
                    <span>Smart Search Confidence: <b className="text-emerald-400">98.2%</b></span>
                    <button onClick={() => { setSearchQuery(''); fetchProducts(); }} className="text-red-400">Clear</button>
                  </div>
                )}
              </div>

              {/* Special Offers Banner slider (Static gorgeous layout) */}
              <div className="px-4">
                <div className="relative h-28 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-900 text-white p-4 flex flex-col justify-center space-y-1 shadow-md">
                  <div className="absolute right-2 bottom-0 opacity-10">
                    <Sparkles className="w-24 h-24 text-white" />
                  </div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-900/40 p-0.5 px-2 rounded-full self-start">Special Launch Discount</span>
                  <h4 className="text-sm font-bold tracking-tight">Super Saver: 20% Discount</h4>
                  <p className="text-[10px] text-slate-300">Apply coupon code <code className="font-mono font-bold text-white uppercase bg-white/10 px-1 rounded">SMART20</code> on bill</p>
                </div>
              </div>

              {/* Horizontal categories list */}
              <div className="space-y-2">
                <div className="px-4 flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Shop Categories</h4>
                  <button onClick={() => setMobileScreen('categories')} className="text-xs text-blue-400 font-semibold cursor-pointer">View All</button>
                </div>
                
                <div className="flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
                  <button 
                    onClick={() => setActiveCategory('all')}
                    className={`p-1.5 px-3 rounded-full text-[11px] font-semibold flex-shrink-0 transition cursor-pointer ${activeCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                  >
                    All items
                  </button>
                  {categories.map(c => (
                    <button 
                      key={c.id}
                      onClick={() => setActiveCategory(c.id)}
                      className={`p-1.5 px-3 rounded-full text-[11px] font-semibold flex-shrink-0 transition cursor-pointer ${activeCategory === c.id ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product list catalog */}
              <div className="px-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Featured collection</h4>
                  
                  <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-transparent border-none text-[11px] text-blue-400 font-semibold outline-none cursor-pointer"
                  >
                    <option value="popular">Best rated</option>
                    <option value="price_asc">Price: Low-High</option>
                    <option value="price_desc">Price: High-Low</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {products.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => {
                        setSelectedProduct(p);
                        setDetailImgIdx(0);
                        setMobileScreen('details');
                      }}
                      className="p-2 border border-slate-900 rounded-2xl bg-slate-900/30 cursor-pointer space-y-1.5 hover:scale-[1.01] transition-transform"
                    >
                      <div className="relative h-24 rounded-xl overflow-hidden bg-slate-900">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleWishlist(p.id);
                          }}
                          className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-black/80 text-rose-500 rounded-full"
                        >
                          <Heart className={`w-3 h-3 ${wishlist.includes(p.id) ? 'fill-rose-500' : ''}`} />
                        </button>
                        {p.discountPrice && (
                          <div className="absolute bottom-1.5 left-1.5 bg-emerald-600 text-[8px] text-white font-black px-1 rounded uppercase">Offer</div>
                        )}
                      </div>
                      
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-blue-400 uppercase font-black tracking-widest">{p.brand}</span>
                        <h5 className="text-[11px] font-bold truncate text-slate-200">{p.name}</h5>
                        <div className="flex gap-1.5 items-center">
                          <span className="text-xs font-bold text-slate-100">${p.discountPrice || p.price}</span>
                          {p.discountPrice && (
                            <span className="text-[10px] text-slate-500 line-through">${p.price}</span>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-amber-500 font-bold">★ {p.rating}</span>
                          <span className="text-slate-400">{p.quantity} left</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic recommendation modules */}
              <div className="px-4 py-1 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" /> AI Product Recommendations
                </h4>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {getPersonalizedRecommendations().map(p => (
                    <div 
                      key={p.id}
                      onClick={() => {
                        setSelectedProduct(p);
                        setDetailImgIdx(0);
                        setMobileScreen('details');
                      }}
                      className="p-1 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs flex items-center gap-2 flex-shrink-0 cursor-pointer"
                    >
                      <img src={p.images[0]} alt="" className="w-8 h-8 rounded object-cover" />
                      <div>
                        <span className="font-bold text-slate-200 block text-ellipsis max-w-[120px] overflow-hidden whitespace-nowrap">{p.name}</span>
                        <span className="text-[9px] text-emerald-400 font-semibold">${p.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* SCREEN: Category Selector Dashboard */}
          {mobileScreen === 'categories' && (
            <div className="space-y-4 px-4">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                <button onClick={() => setMobileScreen('home')} className="p-1 cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
                <h3 className="font-bold">E-Commerce Categories</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {categories.map(c => (
                  <button 
                    key={c.id}
                    onClick={() => {
                      setActiveCategory(c.id);
                      setMobileScreen('home');
                    }}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-2 hover:bg-slate-800 text-left cursor-pointer"
                  >
                    <span className="font-bold text-xs text-slate-200">{c.name}</span>
                    <span className="text-[10px] text-slate-500">Explore Catalog</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN: Product detailswipe bento bpx specs list */}
          {mobileScreen === 'details' && selectedProduct && (
            <div className="space-y-4 px-4 pb-4">
              
              {/* Image banner header navigation */}
              <div className="flex justify-between items-center">
                <button onClick={() => setMobileScreen('home')} className="p-1 bg-black/40 text-white rounded-full cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
                <span className="text-xs uppercase font-bold text-slate-400">Product details</span>
                <button onClick={() => handleToggleWishlist(selectedProduct.id)} className="p-1.5 bg-black/40 text-rose-500 rounded-full">
                  <Heart className={`w-5 h-5 ${wishlist.includes(selectedProduct.id) ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Multiple Image Swipe Gallery indicators */}
              <div className="relative h-48 bg-slate-900 rounded-2xl overflow-hidden shadow">
                <img src={selectedProduct.images[detailImgIdx]} alt="" className="w-full h-full object-cover" />
                
                {/* Swipe selectors */}
                {selectedProduct.images.length > 1 && (
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {selectedProduct.images.map((img, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setDetailImgIdx(idx)}
                        className={`w-2 h-2 rounded-full cursor-pointer ${detailImgIdx === idx ? 'bg-blue-500 w-4' : 'bg-white/40'}`}
                      ></button>
                    ))}
                  </div>
                )}
              </div>

              {/* Name Details */}
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] bg-slate-900 text-blue-400 p-0.5 px-2 rounded font-black tracking-widest">{selectedProduct.brand}</span>
                  <div className="flex gap-1.5 items-center">
                    <span className="text-xs text-slate-400">Rating:</span>
                    <span className="text-xs text-amber-500 font-bold block">★ {selectedProduct.rating}</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-100">{selectedProduct.name}</h3>
                
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-lg font-black text-slate-100">${selectedProduct.discountPrice || selectedProduct.price}</span>
                  {selectedProduct.discountPrice && (
                    <span className="text-xs text-slate-500 line-through">${selectedProduct.price}</span>
                  )}
                </div>
              </div>

              {/* Tab selector specs or reviews */}
              <div className="flex gap-2 border-b border-slate-900">
                <button 
                  onClick={() => setActiveProdTab('specs')}
                  className={`pb-2 text-xs font-bold transition flex-1 text-center cursor-pointer ${activeProdTab === 'specs' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-slate-400'}`}
                >
                  Specifications
                </button>
                <button 
                  onClick={() => setActiveProdTab('reviews')}
                  className={`pb-2 text-xs font-bold transition flex-1 text-center cursor-pointer ${activeProdTab === 'reviews' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-slate-400'}`}
                >
                  Reviews ({selectedProduct.numReviews || 0})
                </button>
              </div>

              {activeProdTab === 'specs' ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 leading-relaxed">{selectedProduct.description}</p>
                  
                  {/* Specifications table */}
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-900 text-xs">
                    <h5 className="font-bold text-slate-300 mb-2 uppercase text-[10px] tracking-wider text-blue-400">Specifications Bento</h5>
                    <div className="space-y-1.5 divide-y divide-slate-800/40 text-[11px]">
                      {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1 text-slate-300">
                          <span className="text-slate-400 font-medium">{key}</span>
                          <span className="font-bold text-slate-100 text-right max-w-[150px] truncate">{value}</span>
                        </div>
                      ))}
                      <div className="flex justify-between py-1 text-slate-300">
                        <span className="text-slate-400 font-medium">Warranty</span>
                        <span className="font-bold text-white text-right truncate max-w-[150px]">{selectedProduct.warranty}</span>
                      </div>
                      <div className="flex justify-between py-1 text-slate-300">
                        <span className="text-slate-400 font-medium">Weight</span>
                        <span className="font-bold text-white text-right">{selectedProduct.weight}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Write a review forms */}
                  <form onSubmit={handlePostReview} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-blue-400 block uppercase mb-1">Write a Review</span>
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map(val => (
                        <button 
                          key={val} 
                          type="button"
                          onClick={() => setReviewRating(val)}
                          className="p-0.5"
                        >
                          <Star className={`w-4 h-4 cursor-pointer ${reviewRating >= val ? 'fill-amber-500 text-amber-500' : 'text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                    <textarea 
                      placeholder="Comment review..." 
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs outline-none text-slate-200"
                    />
                    <button 
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-1.5 px-3.5 text-[11px] font-semibold cursor-pointer"
                    >
                      Submit Review
                    </button>
                  </form>

                  {/* Seeded or other buyer reviews */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Buyer reviews</span>
                    <div className="p-2.5 bg-slate-900/30 border border-slate-900 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span>Anjali Sen (Verified Buyer)</span>
                        <span className="text-amber-500">★ 5.0</span>
                      </div>
                      <p className="text-slate-400 italic">"This fits the specs list perfectly. Fast charge is very impressive, AMOLED screen colors pop beautifully!"</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button: Add to Cart */}
              <div className="pt-2">
                <button 
                  onClick={() => handleAddToCart(selectedProduct.id, 1)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-lg"
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Shopping Cart
                </button>
              </div>

            </div>
          )}

          {/* SCREEN: CART LIST */}
          {mobileScreen === 'cart' && (
            <div className="space-y-4 px-4 flex flex-col flex-1 pb-4">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                <button onClick={() => setMobileScreen('home')} className="p-1 cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
                <h3 className="font-bold">Active Shopping Cart</h3>
              </div>

              {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-12">
                  <ShoppingCart className="w-12 h-12 text-slate-600" />
                  <p className="text-xs text-slate-400">Your basket and shopping cart stands empty.</p>
                  <button onClick={() => setMobileScreen('home')} className="p-1.5 px-4 bg-blue-600 text-white text-xs font-semibold rounded-lg cursor-pointer">Shop now</button>
                </div>
              ) : (
                <div className="flex flex-col flex-1 space-y-4 justify-between">
                  {/* Cart Items list */}
                  <div className="space-y-3 overflow-y-auto max-h-[300px]">
                    {cartItems.map(item => {
                      const prod = products.find(p => p.id === item.productId);
                      if (!prod) return null;
                      return (
                        <div key={item.productId} className="flex justify-between items-center bg-slate-900/60 border border-slate-900 p-2.5 rounded-xl gap-3">
                          <img src={prod.images[0]} alt="" className="w-12 h-12 rounded object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-slate-100 text-[11px] truncate block">{prod.name}</span>
                            <span className="text-[10px] text-blue-400 block font-semibold">${prod.discountPrice || prod.price}</span>
                          </div>
                          
                          {/* Quantity selector */}
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleUpdateCartQty(item.productId, item.quantity, -1)}
                              className="p-1 bg-slate-800 text-white rounded cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateCartQty(item.productId, item.quantity, 1)}
                              className="p-1 bg-slate-800 text-white rounded cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => handleRemoveFromCart(item.productId)}
                              className="text-rose-400 hover:text-rose-500 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary and proceed blocks */}
                  <div className="space-y-3 bg-slate-950 p-3 rounded-2xl border border-slate-900">
                    
                    {/* Apply coupon */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Promotions Coupon Code</span>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="SMART20"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="bg-slate-900 border border-slate-800 outline-none text-xs p-1.5 rounded-lg flex-1 text-white uppercase"
                        />
                        <button 
                          onClick={handleApplyCoupon}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 text-[11px] font-bold rounded-lg cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {couponErr && <span className="text-[10px] text-red-400 font-medium block">{couponErr}</span>}
                      {appliedCoupon && (
                        <span className="text-[10px] text-emerald-400 font-bold block flex items-center gap-1">
                          ✔ Coupon Approved! Applied discount: {appliedCoupon.type === 'Percentage' ? `${appliedCoupon.value}%` : `$${appliedCoupon.value}`}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-xs pt-1.5 border-t border-slate-900 text-slate-300">
                      <div className="flex justify-between">
                        <span>Basket Subtotal</span>
                        <span className="font-bold">${getCartSubtotal()}</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Applied Promo Discount</span>
                          <span className="font-bold">
                            -${appliedCoupon.type === 'Percentage' 
                              ? Math.round(getCartSubtotal() * (appliedCoupon.value / 100)) 
                              : appliedCoupon.value}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Simulated GST & Courier Fees</span>
                        <span className="font-bold uppercase text-[9px] text-emerald-400">FREE SHIPPING</span>
                      </div>
                      <div className="flex justify-between text-white font-bold border-t border-slate-900 pt-1 text-sm">
                        <span>Total Payable</span>
                        <span>
                          ${Math.max(1, getCartSubtotal() - (appliedCoupon 
                            ? (appliedCoupon.type === 'Percentage' 
                                ? Math.round(getCartSubtotal() * (appliedCoupon.value / 100)) 
                                : appliedCoupon.value)
                            : 0))}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setCheckoutStep('address');
                        setMobileScreen('checkout');
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl text-xs font-bold tracking-wide mt-1 cursor-pointer text-center"
                    >
                      Proceed to Select Address
                    </button>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* SCREEN: CHECKOUT SYSTEM */}
          {mobileScreen === 'checkout' && (
            <div className="space-y-4 px-4 flex flex-col flex-1 pb-4 text-xs">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                <button onClick={() => setMobileScreen('cart')} className="p-1 cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
                <h3 className="font-bold">Checkout: Multi-step Portal</h3>
              </div>

              {/* Checkout timelines tabs */}
              <div className="grid grid-cols-3 gap-1 border-b border-slate-900 text-center pb-2 text-[10px] font-bold text-slate-400">
                <span className={checkoutStep === 'address' ? 'text-blue-400 border-b border-blue-500 pb-1' : ''}>1. Destination</span>
                <span className={checkoutStep === 'review' ? 'text-blue-400 border-b border-blue-500 pb-1' : ''}>2. Review</span>
                <span className={checkoutStep === 'payment' ? 'text-blue-400 border-b border-blue-500 pb-1' : ''}>3. Payment</span>
              </div>

              {/* STEP 1: SELECT ADDRESS */}
              {checkoutStep === 'address' && (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      <span>Delivery Destinations</span>
                      <button onClick={() => setShowAddressForm(!showAddressForm)} className="text-blue-400">+ Add New</button>
                    </div>

                    {showAddressForm && (
                      <form onSubmit={handleAddAddress} className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                        <input 
                          type="text" 
                          placeholder="Full Name (e.g., Sharanya)" 
                          required
                          value={addrName}
                          onChange={(e) => setAddrName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-xs"
                        />
                        <input 
                          type="text" 
                          placeholder="Phone Number" 
                          required
                          value={addrPhone}
                          onChange={(e) => setAddrPhone(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-xs"
                        />
                        <div className="flex gap-1">
                          <input 
                            type="text" 
                            placeholder="Flat/House No." 
                            required
                            value={addrHouse}
                            onChange={(e) => setAddrHouse(e.target.value)}
                            className="w-1/2 bg-slate-950 border border-slate-800 rounded p-1 text-xs"
                          />
                          <input 
                            type="text" 
                            placeholder="ZIP/Pin Code" 
                            required
                            value={addrZip}
                            onChange={(e) => setAddrZip(e.target.value)}
                            className="w-1/2 bg-slate-950 border border-slate-800 rounded p-1 text-xs"
                          />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Street Address, Area" 
                          required
                          value={addrStreet}
                          onChange={(e) => setAddrStreet(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-xs"
                        />
                        <input 
                          type="text" 
                          placeholder="City" 
                          required
                          value={addrCity}
                          onChange={(e) => setAddrCity(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-xs"
                        />
                        <button type="submit" className="w-full p-1 bg-blue-600 text-white rounded text-xs font-semibold">Save Address</button>
                      </form>
                    )}

                    <div className="space-y-2 max-h-52 overflow-y-auto">
                      {addresses.length === 0 ? (
                        <p className="text-slate-400 text-center py-4">No saved addresses located. Please create one to complete checkout.</p>
                      ) : (
                        addresses.map(a => (
                          <div 
                            key={a.id}
                            onClick={() => setSelectedAddressId(a.id)}
                            className={`p-3 rounded-xl border cursor-pointer ${selectedAddressId === a.id ? 'bg-blue-500/10 border-blue-500' : 'bg-slate-900 border-slate-800'}`}
                          >
                            <div className="flex justify-between items-center mb-1 font-bold">
                              <span>{a.fullName}</span>
                              {selectedAddressId === a.id && <span className="text-[10px] bg-blue-600 text-white p-0.5 px-2 rounded">Active</span>}
                            </div>
                            <p className="text-slate-400 text-[11px] leading-relaxed">{a.houseNumber}, {a.street}, {a.city}, {a.pinCode}</p>
                            <span className="text-[10px] text-slate-500 block font-medium mt-1">Phone: {a.phone}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <button 
                    disabled={!selectedAddressId}
                    onClick={() => setCheckoutStep('review')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl text-xs font-bold disabled:bg-slate-800 disabled:text-slate-500 mt-2 cursor-pointer"
                  >
                    Proceed to Order Review
                  </button>
                </div>
              )}

              {/* STEP 2: REVIEW CART */}
              {checkoutStep === 'review' && (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Summary of Goods</span>
                    
                    <div className="space-y-2 max-h-52 overflow-y-auto">
                      {cartItems.map(item => {
                        const prod = products.find(p => p.id === item.productId);
                        if (!prod) return null;
                        return (
                          <div key={item.productId} className="flex justify-between items-center text-xs text-slate-300">
                            <span>{prod.name} (x{item.quantity})</span>
                            <span className="font-bold">${(prod.discountPrice || prod.price) * item.quantity}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Recipient Delivery Address</span>
                      {addresses.find(a => a.id === selectedAddressId) ? (
                        <>
                          <p className="font-bold">{addresses.find(a => a.id === selectedAddressId)?.fullName}</p>
                          <p className="text-slate-400">{addresses.find(a => a.id === selectedAddressId)?.houseNumber}, {addresses.find(a => a.id === selectedAddressId)?.city}</p>
                        </>
                      ) : (
                        <p className="text-red-400">Please select an address first.</p>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => setCheckoutStep('payment')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl text-xs font-bold mt-2 cursor-pointer"
                  >
                    Select Payment Method
                  </button>
                </div>
              )}

              {/* STEP 3: SELECT PAYMENT METHOD & CONFIRM */}
              {checkoutStep === 'payment' && (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Secure Payment Gateway</span>
                    
                    <div className="space-y-2">
                      <button 
                        onClick={() => setPaymentMethod('UPI')}
                        className={`w-full p-3 rounded-xl border flex items-center justify-between cursor-pointer ${paymentMethod === 'UPI' ? 'bg-blue-500/10 border-blue-500' : 'bg-slate-900 border-slate-800'}`}
                      >
                        <span className="font-bold">UPI / GPay / PhonePe</span>
                        <span className="text-[10px] text-emerald-400 uppercase font-black">Direct QR code</span>
                      </button>

                      <button 
                        onClick={() => setPaymentMethod('Card')}
                        className={`w-full p-3 rounded-xl border flex items-center justify-between cursor-pointer ${paymentMethod === 'Card' ? 'bg-blue-500/10 border-blue-500' : 'bg-slate-900 border-slate-800'}`}
                      >
                        <span className="font-bold flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> Credit / Debit Card</span>
                        <span className="text-[10px] text-slate-400">Visa / Mastercard</span>
                      </button>

                      <button 
                        onClick={() => setPaymentMethod('COD')}
                        className={`w-full p-3 rounded-xl border flex items-center justify-between cursor-pointer ${paymentMethod === 'COD' ? 'bg-blue-500/10 border-blue-500' : 'bg-slate-900 border-slate-800'}`}
                      >
                        <span className="font-bold">Cash on Delivery (COD)</span>
                        <span className="text-[10px] text-slate-400">Pay at Door step</span>
                      </button>
                    </div>

                    {paymentMethod === 'Card' && (
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                        <span className="text-[10px] font-bold text-blue-400 block uppercase">Simulated Card Details (Razorpay)</span>
                        <input 
                          type="text" 
                          value={razorpayCardNo}
                          onChange={(e) => setRazorpayCardNo(e.target.value)}
                          placeholder="Card No"
                          className="w-full bg-slate-950 border border-slate-800 p-1 rounded text-xs text-white"
                        />
                        <div className="flex gap-1">
                          <input type="text" placeholder="EXP MM/YY" defaultValue="12/28" className="w-1/2 bg-slate-950 border border-slate-800 p-1 rounded text-xs text-white" />
                          <input 
                            type="text" 
                            value={razorpayCvv}
                            onChange={(e) => setRazorpayCvv(e.target.value)}
                            placeholder="CVV" 
                            className="w-1/2 bg-slate-950 border border-slate-800 p-1 rounded text-xs text-white" 
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {orderProcessing ? (
                    <div className="flex items-center justify-center p-3 text-blue-400 font-semibold gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Syncing Secure payment...</span>
                    </div>
                  ) : orderSuccess === 'success' ? (
                    <div className="p-3 bg-emerald-900/20 text-emerald-400 border border-emerald-900 text-center rounded-xl font-bold space-y-1.5 mt-2">
                      <span>Order #SMC Done!</span>
                      <button 
                        onClick={() => {
                          setOrderSuccess(null);
                          setMobileScreen('orders');
                        }}
                        className="p-1 px-4 bg-emerald-600 text-white rounded text-[10px] uppercase font-bold block mx-auto cursor-pointer"
                      >
                        Track Order Pipeline
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={handleConfirmOrder}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl text-xs font-bold mt-2 cursor-pointer"
                    >
                      Authorize Order Payment
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SCREEN: ORDERS TRACKING (The visual step tracking timeline) */}
          {mobileScreen === 'orders' && (
            <div className="space-y-4 px-4 pb-4">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                <button onClick={() => setMobileScreen('home')} className="p-1 cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
                <h3 className="font-bold">Your Orders Timeline</h3>
              </div>

              {orders.length === 0 ? (
                <p className="text-slate-400 text-center py-12">No orders recorded in previous transactions database.</p>
              ) : (
                <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
                  {orders.map(order => (
                    <div key={order.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                      <div className="flex justify-between items-center font-bold">
                        <span className="font-mono text-xs text-blue-400">{order.id}</span>
                        <span className="text-[10px] text-slate-400">{new Date(order.date).toLocaleDateString()}</span>
                      </div>

                      <div className="text-[11px] text-slate-300">
                        Items: <span className="font-bold text-white">{order.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}</span>
                      </div>

                      {/* Visual Timeline progress bar pipeline */}
                      <div className="space-y-2 pt-1 border-t border-slate-800">
                        <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase">
                          <span>Timeline Stage:</span>
                          <span className="text-blue-400 font-bold">{order.status}</span>
                        </div>
                        
                        <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden flex">
                          <div 
                            className="bg-blue-500 h-full rounded-full transition-all"
                            style={{ 
                              width: order.status === 'Pending' ? '12.5%' :
                                     order.status === 'Confirmed' ? '25%' :
                                     order.status === 'Packed' ? '37.5%' :
                                     order.status === 'Shipped' ? '50%' :
                                     order.status === 'Out for Delivery' ? '75%' : 
                                     order.status === 'Delivered' ? '100%' : '0%'
                            }}
                          ></div>
                        </div>

                        {/* Interactive state tags */}
                        <div className="grid grid-cols-4 gap-1 text-[8px] font-black uppercase text-center text-slate-500 leading-none">
                          <span className={['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'text-blue-400' : ''}>Confirmed</span>
                          <span className={['Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'text-blue-400' : ''}>Packed</span>
                          <span className={['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'text-blue-400' : ''}>Shipped</span>
                          <span className={order.status === 'Delivered' ? 'text-emerald-400' : ''}>Delivered</span>
                        </div>
                      </div>

                      <div className="flex justify-between text-[10px] items-center text-slate-400 pt-1 border-t border-slate-800/40">
                        <span>Paid via: <b className="text-white">{order.paymentMethod}</b></span>
                        <span className="font-bold text-white">${order.payableAmount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SCREEN: INTELLIGENT AI CHATBOT SCREEN */}
          {mobileScreen === 'chatbot' && (
            <div className="flex-1 flex flex-col justify-between h-full">
              
              {/* Chat Title header */}
              <div className="px-4 py-2 border-b border-slate-900 bg-slate-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => setMobileScreen('home')} className="p-1 cursor-pointer"><ArrowLeft className="w-5 h-5 text-slate-400" /></button>
                  <div>
                    <h4 className="font-bold text-xs text-slate-200">Commerce AI Assistant</h4>
                    <span className="text-[8px] uppercase tracking-wider text-emerald-400 block font-black">Connected to Server</span>
                  </div>
                </div>
                <button 
                  onClick={() => setChatHistory([{ id: 'h1', sender: 'system', text: "Hello! I am grounded on the active catalog and coupon libraries. Search for products or query shipping dates!", timestamp: new Date().toISOString() }])}
                  className="text-[10px] text-rose-400 font-semibold"
                >
                  Clear Chat
                </button>
              </div>

              {/* Messaging logs view */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[460px] no-scrollbar">
                {chatHistory.length === 0 && (
                  <div className="space-y-4 text-center py-6 text-slate-400">
                    <MessageSquare className="w-8 h-8 text-indigo-400 mx-auto animate-bounce" />
                    <p className="text-xs">Ask our smart assistant about current orders, in-stock products, active coupons, or checkout directions!</p>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      <button onClick={() => { setChatInput("Do you have 5G phone?"); }} className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 p-1 px-3.5 rounded-full cursor-pointer hover:bg-slate-800">Do you have 5G phones?</button>
                      <button onClick={() => { setChatInput("Are there active coupons?"); }} className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 p-1 px-3.5 rounded-full cursor-pointer hover:bg-slate-800">Active Coupons?</button>
                      <button onClick={() => { setChatInput("Cancel order SMC-2026-1182"); }} className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 p-1 px-3.5 rounded-full cursor-pointer hover:bg-slate-800">Track Orders</button>
                    </div>
                  </div>
                )}

                {chatHistory.map((m) => (
                  <div 
                    key={m.id}
                    className={`flex flex-col max-w-[85%] rounded-xl p-2.5 text-xs ${
                      m.sender === 'user' 
                        ? 'bg-blue-600 text-white ml-auto rounded-tr-none' 
                        : m.sender === 'system'
                        ? 'bg-slate-950 text-slate-400 border border-slate-900 mx-auto text-center font-medium'
                        : 'bg-slate-900 text-slate-200 mr-auto rounded-tl-none border border-slate-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                    <span className="text-[8px] text-slate-500 self-end mt-1">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))}

                {chatLoading && (
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 text-slate-400 text-xs self-start mr-auto animate-pulse flex items-center gap-1.5 font-medium">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    <span>AI Assistant thinking...</span>
                  </div>
                )}
                <div ref={chatBottomRef}></div>
              </div>

              {/* Chat Send interface footer */}
              <div className="p-3 border-t border-slate-900 bg-slate-950 flex gap-2 items-center">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendChatMessage();
                  }}
                  placeholder="Ask customer AI..."
                  className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none flex-1 placeholder-slate-500"
                />
                <button 
                  onClick={handleSendChatMessage}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

        </div>

        {/* BOTTOM NAVIGATION DRAWER BAR (Persistent highlight indicators) */}
        {['home', 'categories', 'cart', 'orders', 'details', 'chatbot'].includes(mobileScreen) && (
          <div className="absolute bottom-0 inset-x-0 h-12 bg-slate-950 border-t border-slate-900 flex justify-around items-center text-slate-500">
            <button 
              onClick={() => setMobileScreen('home')}
              className={`flex flex-col items-center cursor-pointer ${mobileScreen === 'home' ? 'text-blue-400' : 'hover:text-slate-300'}`}
            >
              <Home className="w-4 h-4" />
              <span className="text-[9px] font-bold">Home</span>
            </button>
            <button 
              onClick={() => setMobileScreen('categories')}
              className={`flex flex-col items-center cursor-pointer ${mobileScreen === 'categories' ? 'text-blue-400' : 'hover:text-slate-300'}`}
            >
              <Grid className="w-4 h-4" />
              <span className="text-[9px] font-bold">Category</span>
            </button>
            <button 
              onClick={() => setMobileScreen('cart')}
              className={`flex flex-col items-center cursor-pointer relative ${mobileScreen === 'cart' ? 'text-blue-400' : 'hover:text-slate-300'}`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-[9px] font-bold">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-blue-500 text-white text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center border border-slate-950">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setMobileScreen('orders')}
              className={`flex flex-col items-center cursor-pointer ${mobileScreen === 'orders' ? 'text-blue-400' : 'hover:text-slate-300'}`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-[9px] font-bold">Orders</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
