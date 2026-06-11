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
  ShieldCheck,
  Percent, 
  Eye, 
  EyeOff,
  Star, 
  CreditCard, 
  UserCheck, 
  PlusCircle, 
  Home as HomeIcon,
  BadgeAlert,
  Loader2,
  Mail,
  Calendar,
  MapPin
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
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // OTP Verification state
  const [otpPurpose, setOtpPurpose] = useState<'register' | 'forgot' | null>(null);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [forgotTarget, setForgotTarget] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [resetCompleted, setResetCompleted] = useState(false);

  // Edit profile states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileMobile, setProfileMobile] = useState('');
  const [profileGender, setProfileGender] = useState('Other');
  const [profileDob, setProfileDob] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [profileMsg, setProfileMsg] = useState('');

  // Google Sign-In state variables
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');
  const [googleAuthError, setGoogleAuthError] = useState('');
  const [googleAccountNotFound, setGoogleAccountNotFound] = useState(false);
  const [loginEmailNotFound, setLoginEmailNotFound] = useState(false);

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
  
  // High-fidelity Multi-step Payment flow state
  const [paymentSubStep, setPaymentSubStep] = useState<'select' | 'qrcode' | 'otp_verify'>('select');
  const [upiUtgRef, setUpiUtgRef] = useState('');
  const [cardOtpInput, setCardOtpInput] = useState('');
  const [sentCardOtp, setSentCardOtp] = useState('');
  const [paymentTimeRemaining, setPaymentTimeRemaining] = useState(180);
  const [paymentError, setPaymentError] = useState('');

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
      if (currentUser) {
        setMobileScreen('home');
      } else {
        setMobileScreen('login');
      }
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
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfileMobile(currentUser.mobile || '');
      setProfileGender(currentUser.gender || 'Other');
      setProfileDob(currentUser.dob || '1999-01-01');
      setProfilePic(currentUser.profilePic || '');
    }
  }, [currentUser]);

  // Payment Countdown Timer effect
  useEffect(() => {
    if (paymentSubStep !== 'qrcode') return;
    if (paymentTimeRemaining <= 0) return;

    const timer = setInterval(() => {
      setPaymentTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentSubStep, paymentTimeRemaining]);

  // Update Profile details call
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg('');
    if (!currentUser) return;
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          name: profileName,
          mobile: profileMobile,
          gender: profileGender,
          dob: profileDob,
          profilePic: profilePic
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        setProfileMsg("Profile updated successfully!");
        onNotificationTriggered("Profile Updated", "Your changes have been saved to database.");
        setIsEditingProfile(false);
      } else {
        setProfileMsg(data.message || "Failed to update profile details.");
      }
    } catch (err) {
      setProfileMsg("Failed to reach server.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setMobileScreen('login');
    onNotificationTriggered("Logged Out", "You have secure logged out.");
  };

  // Chat scroll anchor
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatLoading]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoginEmailNotFound(false);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setLoginEmailNotFound(false);
        setCurrentUser(data.user);
        onNotificationTriggered("Login Successful", `Welcome back, ${data.user.name}!`);
        setMobileScreen('home');
      } else {
        setAuthError(data.message || "Login failed");
        if (data.message && data.message.toLowerCase().includes("not found")) {
          setLoginEmailNotFound(true);
        }
      }
    } catch (err) {
      setAuthError("Server offline or host connection failure");
    }
  };

  // Instant Register & Login helper for personal emails
  const handleInstantRegisterAndLogin = async () => {
    setAuthError('');
    setLoginEmailNotFound(false);
    if (!loginEmail) return;

    try {
      const userPart = loginEmail.split('@')[0];
      const cleanName = userPart.charAt(0).toUpperCase() + userPart.slice(1);
      const tempPass = loginPassword || "user123";

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: loginEmail,
          mobile: "+91 " + Math.floor(9000000000 + Math.random() * 999999999),
          password: tempPass
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        onNotificationTriggered("Instant Account Registered", `Welcome! Auto-created password: "${tempPass}"`);
        // Immediately log them in
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: loginEmail, password: tempPass })
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) {
          setCurrentUser(loginData.user);
          setMobileScreen('home');
        }
      } else {
        setAuthError(data.message || "Auto-registration failed");
      }
    } catch (err) {
      setAuthError("Failed to auto-register.");
    }
  };

  // Google login query
  const handleGoogleLoginSubmit = async (email: string) => {
    setGoogleAuthError('');
    setGoogleAccountNotFound(false);
    
    if (!email) {
      setGoogleAuthError('Please enter high-security Google Account Email address.');
      return;
    }

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        onNotificationTriggered("Google Sign-In Successful", `Authenticated with Google as ${data.user.name}!`);
        setGoogleModalOpen(false);
        setMobileScreen('home');
      } else {
        if (res.status === 404) {
          setGoogleAccountNotFound(true);
          setGoogleAuthError("Email not found in database.");
        } else {
          setGoogleAuthError(data.message || "Google authentication failed.");
        }
      }
    } catch (err) {
      setGoogleAuthError("Failed to reach auth gateway.");
    }
  };

  // Google dynamic registration action
  const handleGoogleRegisterSubmit = async (email: string, name: string) => {
    setGoogleAuthError('');
    try {
      const res = await fetch('/api/auth/google-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        onNotificationTriggered("Google Account Created", `Successfully verified and logged in!`);
        setGoogleModalOpen(false);
        setMobileScreen('home');
      } else {
        setGoogleAuthError(data.message || "Google registration aborted.");
      }
    } catch (err) {
      setGoogleAuthError("Gateway connection timeout.");
    }
  };

  // Register handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!regName || !regEmail || !regMobile || !regPassword) {
      setAuthError('Please fill out all registration parameters.');
      return;
    }

    try {
      // Generate a dynamic 4-digit code
      const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(generatedCode);
      setOtpPurpose('register');
      setOtpInput('');
      setOtpVerified(false);
      setResetCompleted(false);

      onNotificationTriggered(
        "SMS OTP Sent",
        `Verification OTP code [${generatedCode}] dispatched to ${regMobile || "your mobile"}.`
      );
      setMobileScreen('verify-otp');
    } catch (err) {
      setAuthError("Failed to dispatch registration OTP.");
    }
  };

  // Complete OTP verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (otpInput !== generatedOtp) {
      setAuthError('Incorrect verification security OTP passcode. Please check notification tray.');
      return;
    }

    if (otpPurpose === 'register') {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: regName, email: regEmail, mobile: regMobile, password: regPassword })
        });
        const data = await res.json();
        if (res.ok) {
          onNotificationTriggered("Registered Successful", `Account created and verified! Welcome ${regName}.`);
          // Set as currently active
          setCurrentUser(data.user);
          setMobileScreen('home');
          // Clear inputs
          setRegName('');
          setRegEmail('');
          setRegMobile('');
          setRegPassword('');
        } else {
          setAuthError(data.message || "Registration failed");
          // Fallback back to register screen
          setMobileScreen('register');
        }
      } catch (err) {
        setAuthError("Server endpoint connection failure");
      }
    } else if (otpPurpose === 'forgot') {
      setOtpVerified(true);
    }
  };

  // Handle password reset after entering correct security OTP
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!newPassword || !confirmNewPassword) {
      setAuthError('Please input both password fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setAuthError('Passwords matching failed. Try again.');
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: forgotTarget, password: newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        onNotificationTriggered("Credentials Decoded", "Password update is fully saved inside system DBState!");
        setResetCompleted(true);
        // Pre-fill login details for their convenience
        setLoginEmail(forgotTarget);
        setLoginPassword(newPassword);
      } else {
        setAuthError(data.message || "Credentials update aborted.");
      }
    } catch (err) {
      setAuthError("Failed to update reset credentials.");
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

  // Delete Address helper
  const handleDeleteAddress = async (addressId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/addresses/${currentUser.id}/${addressId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        onNotificationTriggered("Address Removed", "Delivery destination has been deleted.");
        if (selectedAddressId === addressId) {
          setSelectedAddressId('');
        }
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
  const handleExecuteConfirmOrder = async (confirmedMethod?: string) => {
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
    const finalAmount = Math.max(1, subtotal - discount);

    setOrderProcessing(true);
    setPaymentError('');

    try {
      const selectedMethodLabel = confirmedMethod || (paymentMethod === 'COD' 
        ? 'Cash on Delivery' 
        : paymentMethod === 'UPI' 
          ? 'UPI QR Code Gateway' 
          : 'Secured Credit Card');

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          items: itemsPayload,
          address: addr,
          total: subtotal,
          discountAmount: discount,
          payableAmount: finalAmount,
          paymentMethod: selectedMethodLabel,
          upiUtr: paymentMethod === 'UPI' ? upiUtgRef : undefined
        })
      });
      
      if (res.ok) {
        setOrderSuccess('success');
        setCartItems([]);
        setAppliedCoupon(null);
        setCouponCode('');
        setPaymentSubStep('select'); // Reset substeps
        onNotificationTriggered("Order Placed", `Your shipment of value $${finalAmount} has been registered successfully.`);
        fetchCartAndWishlist();
        fetchOrders();
      } else {
        setOrderSuccess('fail');
        setPaymentError('Server rejected the transaction registry. Please try again.');
      }
    } catch (e) {
      setOrderSuccess('fail');
      setPaymentError('Connection timed out during authorization.');
    } finally {
      setOrderProcessing(false);
    }
  };

  const handleInitiatePayment = () => {
    if (!currentUser || !selectedAddressId) return;
    setPaymentError('');

    const subtotal = getCartSubtotal();
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'Percentage') {
        discount = Math.round(subtotal * (appliedCoupon.value / 100));
      } else {
        discount = appliedCoupon.value;
      }
    }
    const finalAmount = Math.max(1, subtotal - discount);

    if (paymentMethod === 'UPI') {
      // Transition to QR code substep
      setPaymentSubStep('qrcode');
      setPaymentTimeRemaining(180); // Reset timer to 3 mins
      const randomUTR = "6" + Math.floor(10000000000 + Math.random() * 90000000000);
      setUpiUtgRef(randomUTR);
      
      onNotificationTriggered(
        "Scan to Pay", 
        `Please scan the generated secure UPI QR Code for $${finalAmount}.`
      );
    } else if (paymentMethod === 'Card') {
      // Validate simulated card
      if (!razorpayCardNo || razorpayCardNo.replace(/\s/g, '').length < 15) {
        setPaymentError('Please enter a valid Credit/Debit card number.');
        return;
      }
      
      // Generate secure transaction OTP
      const freshOtp = String(Math.floor(100000 + Math.random() * 900000));
      setSentCardOtp(freshOtp);
      setCardOtpInput('');
      setPaymentSubStep('otp_verify');

      // Send simulated verification code push alert
      setTimeout(() => {
        onNotificationTriggered(
          "🔐 payment SafeKey OTP", 
          `Your secure payment transaction of $${finalAmount} OTP code is: ${freshOtp}`
        );
      }, 900);
    } else {
      // COD directly places order
      handleExecuteConfirmOrder('Cash on Delivery');
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
            <div className="flex-1 p-6 flex flex-col justify-center space-y-5 shadow-inner">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold">Welcome Back!</h3>
                <p className="text-xs text-slate-400">SmartCommerce Retail Gateway</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {authError && (
                  <div className={`p-3 rounded-2xl text-xs text-center border font-medium space-y-2 ${phoneTheme === 'dark' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                    <p>{authError}</p>
                    {loginEmailNotFound && (
                      <div className="pt-2 border-t border-rose-500/20 flex flex-col items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 block font-normal">This email isn't in our system yet. Avoid manual forms?</span>
                        <button
                          type="button"
                          onClick={handleInstantRegisterAndLogin}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-md transition cursor-pointer"
                        >
                          ⚡ Quick Register & Log In Now
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Personal Email address</label>
                  <input 
                    type="email" 
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      setLoginEmailNotFound(false);
                    }}
                    required
                    placeholder="customer@example.com"
                    className={`w-full p-2 text-xs rounded-xl border outline-none ${phoneTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-zinc-900'}`}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block">Password</label>
                    <button type="button" onClick={() => setMobileScreen('forgot')} className="text-[10px] text-blue-500 font-bold hover:underline">Forgot?</button>
                  </div>
                  <div className="relative">
                    <input 
                      type={showLoginPassword ? "text" : "password"} 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className={`w-full p-2 pr-8 text-xs rounded-xl border outline-none ${phoneTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-zinc-900'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl text-xs font-bold shadow-lg transition cursor-pointer"
                >
                  Sign In with Credentials
                </button>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">or use google</span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                </div>

                <button 
                  type="button"
                  onClick={() => {
                    setGoogleModalOpen(true);
                    setGoogleAuthError('');
                    setGoogleAccountNotFound(false);
                    setGoogleEmailInput(loginEmail); 
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-zinc-900 border border-slate-300 dark:border-slate-800 p-2.5 rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
                >
                  <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.65-.63-1.04-1.44-1.04-2.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.4 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </form>

              <div className="text-center text-xs space-y-2">
                <span className="text-slate-400">Don't have an account? </span>
                <button onClick={() => setMobileScreen('register')} className="text-blue-500 font-bold hover:underline">Register Now</button>
                
                {/* Seed user tips */}
                <div className="p-3 bg-blue-500/10 rounded-xl text-[10px] text-slate-400 text-left border border-blue-500/20 space-y-2">
                  <span className="font-bold text-blue-400 block uppercase tracking-wider text-[9px]">Tap to Quick-Fill Demo Accounts:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('pvsharanya21@gmail.com');
                      setLoginPassword('user123');
                    }}
                    className="w-full flex justify-between items-center text-left bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-805 hover:border-zinc-700 p-1.5 rounded cursor-pointer transition text-zinc-300"
                  >
                    <span>👤 Customer: <span className="font-bold text-white">pvsharanya21@gmail.com</span></span>
                    <span className="bg-blue-900/40 text-blue-300 px-1.5 py-0.5 rounded text-[8px] font-mono">Fill</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('admin@smartcommerce.com');
                      setLoginPassword('admin123');
                    }}
                    className="w-full flex justify-between items-center text-left bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-805 hover:border-zinc-700 p-1.5 rounded cursor-pointer transition text-zinc-300"
                  >
                    <span>🛡️ Admin: <span className="font-bold text-white">admin@smartcommerce.com</span></span>
                    <span className="bg-blue-900/40 text-blue-300 px-1.5 py-0.5 rounded text-[8px] font-mono">Fill</span>
                  </button>
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
                {authError && <div className="p-2 bg-rose-500/10 text-rose-400 rounded text-xs text-center border border-rose-500/20 font-medium">{authError}</div>}
                <input 
                  type="text" 
                  placeholder="e.g. customer@example.com or mobile" 
                  value={forgotTarget}
                  onChange={(e) => setForgotTarget(e.target.value)}
                  className={`w-full p-2.5 text-xs rounded-xl border outline-none ${phoneTheme === 'dark' ? 'bg-[#18181b] border-slate-800 text-zinc-100' : 'bg-white text-zinc-900'}`}
                />
                <button 
                  onClick={() => {
                    if (!forgotTarget) {
                      setAuthError('Please enter a registered email or mobile number.');
                      return;
                    }
                    setAuthError('');
                    const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
                    setGeneratedOtp(generatedCode);
                    setOtpPurpose('forgot');
                    setOtpInput('');
                    setOtpVerified(false);
                    setResetCompleted(false);
                    onNotificationTriggered("Verifiable SMS Sent", `Recovery code [${generatedCode}] was dispatched to security devices connected to ${forgotTarget}.`);
                    setMobileScreen('verify-otp');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl text-xs font-bold cursor-pointer transition shadow-md"
                >
                  Send OTP Verification Code
                </button>
                <button 
                  onClick={() => {
                    setAuthError('');
                    setMobileScreen('login');
                  }} 
                  className="w-full text-xs text-slate-400 hover:underline"
                >
                  Cancel
                </button>
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
                  placeholder="Full Name (e.g. Alex Johnson)"
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
                <div className="relative w-full">
                  <input 
                    type={showRegPassword ? "text" : "password"} 
                    placeholder="Set Password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    className={`w-full p-2 pr-8 text-xs rounded-xl border outline-none ${phoneTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white text-zinc-900'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                
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

          {/* SCREEN: Dynamic OTP SMS Verification Screen */}
          {mobileScreen === 'verify-otp' && (
            <div className="flex-1 p-6 flex flex-col justify-center space-y-6">
              <div className="text-center space-y-1">
                <div className="mx-auto w-12 h-12 bg-blue-500/15 rounded-full flex items-center justify-center mb-2">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-base font-bold">
                  {!otpVerified ? 'Verify Mobile OTP' : 'Update Password'}
                </h3>
                <p className="text-xs text-slate-400">
                  {!otpVerified 
                    ? `Simulated Carrier SMS Authentication` 
                    : `Configure new password for your profile`
                  }
                </p>
              </div>

              {authError && (
                <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl text-xs text-center border border-rose-500/20 font-medium">
                  {authError}
                </div>
              )}

              {!otpVerified ? (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-center p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-1.5">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Security Destination</span>
                    <span className="text-xs font-semibold text-zinc-300">
                      {otpPurpose === 'register' ? regMobile : forgotTarget}
                    </span>
                    <div className="pt-2 border-t border-zinc-800/60 mt-1">
                      <span className="text-[9px] text-indigo-400 uppercase font-mono block">Simulated Device Carrier Tray Receipt:</span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full inline-block mt-1 animate-pulse font-mono">
                        SMC-OTP Code: {generatedOtp}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block text-center">Enter 4-Digit Passcode</label>
                    <input 
                      type="text" 
                      maxLength={4}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 1234"
                      required
                      className="w-full text-center p-3 text-lg tracking-widest font-bold rounded-xl border border-blue-500/10 bg-zinc-900/60 focus:border-blue-500 text-white outline-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl text-xs font-bold shadow-lg transition cursor-pointer"
                  >
                    Confirm & Verify Security OTP
                  </button>

                  <div className="text-center space-y-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        const newCode = Math.floor(1000 + Math.random() * 9000).toString();
                        setGeneratedOtp(newCode);
                        setOtpInput('');
                        onNotificationTriggered("New SMS Dispatched", `Resent verification security code is [${newCode}].`);
                      }}
                      className="text-xs text-blue-400 hover:underline block mx-auto cursor-pointer"
                    >
                      Resend OTP Code
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setAuthError('');
                        setMobileScreen(otpPurpose === 'register' ? 'register' : 'forgot');
                      }} 
                      className="text-xs text-zinc-500 hover:underline block mx-auto cursor-pointer"
                    >
                      Change Details
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {!resetCompleted ? (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block">Set New Password</label>
                        <div className="relative">
                          <input 
                            type={showNewPassword ? "text" : "password"} 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full p-2.5 pr-9 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-white outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                          >
                            {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block">Confirm New Password</label>
                        <div className="relative">
                          <input 
                            type={showConfirmNewPassword ? "text" : "password"} 
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full p-2.5 pr-9 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-white outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                          >
                            {showConfirmNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl text-xs font-bold shadow-lg transition cursor-pointer"
                      >
                        Update Account Password
                      </button>
                    </form>
                  ) : (
                    <div className="text-center space-y-4 py-4">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-400 font-bold text-lg">
                        ✓
                      </div>
                      <p className="text-xs text-zinc-300">
                        Password updated successfully! You can now authenticate.
                      </p>
                      <button 
                        onClick={() => {
                          setAuthError('');
                          setOtpVerified(false);
                          setResetCompleted(false);
                          setMobileScreen('login');
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl text-xs font-bold shadow-lg transition cursor-pointer"
                      >
                        Navigate to Account Login
                      </button>
                    </div>
                  )}
                </div>
              )}
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
                          placeholder="Full Name (e.g., Alex)" 
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
                            className={`p-3 rounded-xl border relative cursor-pointer transition-all duration-200 hover:border-slate-700 ${selectedAddressId === a.id ? 'bg-indigo-500/10 border-indigo-550' : 'bg-slate-900 border-slate-800'}`}
                          >
                            <div className="flex justify-between items-center mb-1 font-bold text-xs text-slate-100">
                              <span>{a.fullName}</span>
                              <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                <button 
                                  onClick={() => handleDeleteAddress(a.id)}
                                  className="text-slate-500 hover:text-rose-400 p-1 rounded-md hover:bg-rose-500/10 transition cursor-pointer"
                                  title="Delete this address"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                {selectedAddressId === a.id && <span className="text-[9.5px] bg-indigo-600 text-white px-2 py-0.5 rounded-lg">Active</span>}
                              </div>
                            </div>
                            <p className="text-slate-400 text-[10.5px] leading-relaxed pr-6">{a.houseNumber}, {a.street}, {a.city}, {a.pinCode}</p>
                            <span className="text-[9.5px] text-slate-500 block font-medium mt-1">Phone: {a.phone}</span>
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
                  {/* SUBSTEP A: CHOOSE OPTION */}
                  {paymentSubStep === 'select' && (
                    <div className="space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Secure Payment Gateway</span>
                          <span className="text-[9.5px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">PCI Compliant</span>
                        </div>
                        
                        {paymentError && (
                          <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg text-[9.5px] border border-rose-500/15 text-center font-bold">
                            ⚠️ {paymentError}
                          </div>
                        )}

                        <div className="space-y-2">
                          <button 
                            onClick={() => {
                              setPaymentMethod('UPI');
                              setPaymentError('');
                            }}
                            className={`w-full p-3 rounded-xl border flex items-center justify-between cursor-pointer text-left ${paymentMethod === 'UPI' ? 'bg-indigo-500/10 border-indigo-500' : 'bg-slate-900 border-slate-800'}`}
                          >
                            <div>
                              <span className="font-bold text-xs block text-slate-100">UPI / GPay / PhonePe</span>
                              <span className="text-[9px] text-slate-400">Generate on-screen scannable QR Code</span>
                            </div>
                            <span className="text-[8px] bg-emerald-500/15 text-emerald-400 px-1 rounded uppercase font-black tracking-wide">Popular</span>
                          </button>

                          <button 
                            onClick={() => {
                              setPaymentMethod('Card');
                              setPaymentError('');
                            }}
                            className={`w-full p-3 rounded-xl border flex items-center justify-between cursor-pointer text-left ${paymentMethod === 'Card' ? 'bg-indigo-500/10 border-indigo-500' : 'bg-slate-900 border-slate-800'}`}
                          >
                            <div>
                              <span className="font-bold text-xs block text-slate-100">Credit / Debit Card</span>
                              <span className="text-[9px] text-slate-400 flex items-center gap-1"><CreditCard className="w-3.5 h-3.5 text-slate-400" /> Secure 3-D authentication</span>
                            </div>
                            <span className="text-[8px] bg-sky-500/15 text-sky-400 px-1 rounded uppercase font-black tracking-wide">Instant</span>
                          </button>

                          <button 
                            onClick={() => {
                              setPaymentMethod('COD');
                              setPaymentError('');
                            }}
                            className={`w-full p-3 rounded-xl border flex items-center justify-between cursor-pointer text-left ${paymentMethod === 'COD' ? 'bg-indigo-500/10 border-indigo-500' : 'bg-slate-900 border-slate-800'}`}
                          >
                            <div>
                              <span className="font-bold text-xs block text-slate-100">Cash on Delivery (COD)</span>
                              <span className="text-[9px] text-slate-400">Pay cash or QR codes upon parcel delivery</span>
                            </div>
                            <span className="text-[8.5px] text-slate-500">Traditional</span>
                          </button>
                        </div>

                        {paymentMethod === 'Card' && (
                          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2.5">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-bold text-indigo-400 block uppercase tracking-wider">Debit/Credit Card Credentials</span>
                              <div className="flex gap-1">
                                <span className="text-[7.5px] uppercase bg-slate-950 px-1 font-extrabold text-slate-500">VISA</span>
                                <span className="text-[7.5px] uppercase bg-slate-950 px-1 font-extrabold text-slate-500">MC</span>
                                <span className="text-[7.5px] uppercase bg-slate-950 px-1 font-extrabold text-slate-500">RU</span>
                              </div>
                            </div>
                            
                            <div className="space-y-0.5">
                              <label className="text-[8px] text-slate-400 uppercase font-black tracking-widest block">Number on Card</label>
                              <input 
                                type="text" 
                                value={razorpayCardNo}
                                onChange={(e) => setRazorpayCardNo(e.target.value)}
                                placeholder="4111 2222 3333 4444"
                                className="w-full bg-slate-950 border border-slate-800 p-1.5 focus:border-indigo-500 outline-none rounded-lg text-[11px] text-slate-100 font-mono tracking-widest"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-0.5">
                                <label className="text-[8px] text-slate-400 uppercase font-black tracking-widest block">Expiration</label>
                                <input type="text" placeholder="12/28" defaultValue="12/28" className="w-full bg-slate-950 border border-slate-800 p-1.5 outline-none rounded-lg text-[11px] text-slate-150 font-mono" />
                              </div>
                              <div className="space-y-0.5">
                                <label className="text-[8px] text-slate-400 uppercase font-black tracking-widest block">Security CVV</label>
                                <input 
                                  type="text" 
                                  maxLength={3}
                                  value={razorpayCvv}
                                  onChange={(e) => setRazorpayCvv(e.target.value)}
                                  placeholder="123" 
                                  className="w-full bg-slate-950 border border-slate-800 p-1.5 focus:border-indigo-500 outline-none rounded-lg text-[11px] text-slate-100 font-mono" 
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {orderProcessing ? (
                        <div className="flex items-center justify-center p-3 text-indigo-400 font-semibold gap-2 bg-slate-900 border border-slate-850 rounded-xl">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-[11px]">Connecting Secure Payment Pipeline...</span>
                        </div>
                      ) : (
                        <button 
                          onClick={handleInitiatePayment}
                          className="w-full bg-indigo-600 hover:bg-indigo-750 text-white p-2.5 rounded-xl text-xs font-bold mt-2 cursor-pointer shadow-md text-center"
                        >
                          {paymentMethod === 'COD' ? '🚚 Complete Cash Purchase' : `💳 Securely Pay $${Math.max(1, getCartSubtotal() - (appliedCoupon ? (appliedCoupon.type === 'Percentage' ? Math.round(getCartSubtotal() * (appliedCoupon.value / 100)) : appliedCoupon.value) : 0))} NOW`}
                        </button>
                      )}
                    </div>
                  )}

                  {/* SUBSTEP B: UPI SCANNER QR CODE */}
                  {paymentSubStep === 'qrcode' && (
                    <div className="space-y-3.5 flex-1 flex flex-col justify-between">
                      <div className="space-y-2.5 text-center">
                        <div className="flex justify-between items-center text-left border-b border-indigo-950 pb-1">
                          <div>
                            <span className="text-[8px] uppercase font-black text-indigo-400 block tracking-widest">BHIM Unified Payments Interface</span>
                            <h4 className="font-bold text-xs text-slate-100">Secure UPI QR Gateway</h4>
                          </div>
                          
                          {/* Countdown Timer */}
                          <div className="text-right">
                            <span className="block text-[7.5px] uppercase font-black text-slate-500">Code Validity</span>
                            <span className={`text-[10px] font-black font-mono px-1 py-0.5 rounded ${paymentTimeRemaining < 60 ? 'bg-rose-500/10 text-rose-400 animate-pulse' : 'bg-blue-500/10 text-blue-400'}`}>
                              ⏱️ {Math.floor(paymentTimeRemaining / 60)}:{String(paymentTimeRemaining % 60).padStart(2, '0')}
                            </span>
                          </div>
                        </div>

                        {/* Interactive dynamic QR code */}
                        {paymentTimeRemaining <= 0 ? (
                          <div className="w-36 h-36 mx-auto rounded-xl border border-rose-500/20 bg-rose-950/10 flex flex-col justify-center items-center p-3 text-center space-y-1">
                            <BadgeAlert className="w-8 h-8 text-rose-500" />
                            <span className="text-[10px] font-bold text-rose-400">QR Code Expired</span>
                            <button 
                              onClick={() => {
                                setPaymentTimeRemaining(180);
                                setUpiUtgRef("6" + Math.floor(10000000000 + Math.random() * 90000000000));
                              }}
                              className="text-[8px] uppercase underline bg-slate-900 border border-slate-800 p-1 rounded font-bold"
                            >
                              Refresh Code
                            </button>
                          </div>
                        ) : (
                          <div className="relative inline-block mx-auto">
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=0f172a&data=${encodeURIComponent('upi://pay?pa=smartcommerce@okaxis&pn=SmartCommerce%20Retail&cu=INR&tn=OrderRef' + upiUtgRef + '&am=' + Math.max(1, getCartSubtotal() - (appliedCoupon ? (appliedCoupon.type === 'Percentage' ? Math.round(getCartSubtotal() * (appliedCoupon.value / 100)) : appliedCoupon.value) : 0)))}`}
                              alt="UPI Merchant Payment QR Code" 
                              className="w-36 h-36 mx-auto rounded-2xl border-4 border-slate-950 p-2 bg-white shadow-xl transition hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full border shadow-sm">
                              <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.65-.63-1.04-1.44-1.04-2.63z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.4 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                              </svg>
                            </div>
                          </div>
                        )}

                        <div className="space-y-0.5 max-w-[240px] mx-auto leading-tight text-[10px] text-slate-350">
                          <p className="font-black text-slate-100">
                            Pay: <span className="text-emerald-400 font-extrabold">${Math.max(1, getCartSubtotal() - (appliedCoupon ? (appliedCoupon.type === 'Percentage' ? Math.round(getCartSubtotal() * (appliedCoupon.value / 100)) : appliedCoupon.value) : 0))}</span>
                          </p>
                          <p className="text-[9px] text-slate-400 font-semibold">Beneficiary: <span className="font-bold text-slate-200">SmartCommerce Retail Pvt Ltd</span></p>
                          <p className="text-[8px] text-slate-500">Scan QR via Google Pay, GPay, G-Suite, PhonePe, Paytm, or BHIM.</p>
                        </div>

                        {/* UTR Input Block */}
                        <div className="bg-slate-950 p-2 border border-slate-900 rounded-xl space-y-1.5 text-left max-w-[250px] mx-auto">
                          <div className="flex justify-between items-center">
                            <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">UPI UTR / Reference ID</label>
                            <span className="text-[7.5px] uppercase font-bold text-emerald-400 px-1 bg-emerald-500/10 rounded">Auto-Synced</span>
                          </div>
                          
                          <input 
                            type="text"
                            placeholder="Enter 12 digit Transaction Ref"
                            value={upiUtgRef}
                            onChange={(e) => setUpiUtgRef(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 p-1 text-[11px] rounded outline-none text-slate-100 font-mono tracking-wider"
                          />
                          <p className="text-[7px] text-slate-500 leading-none">UTR serves as proof of payment to finalize dispatch logs securely.</p>
                        </div>
                      </div>

                      {orderProcessing ? (
                        <div className="flex items-center justify-center p-2.5 text-indigo-400 font-semibold gap-2 bg-slate-900 border border-slate-850 rounded-xl mt-1">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span className="text-[10px]">Verifying Settlement Logs...</span>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentSubStep('select');
                              setPaymentError('');
                            }}
                            className="w-1/3 border border-slate-800 hover:bg-slate-900 p-2 rounded-xl text-[10px] font-bold text-slate-300 text-center cursor-pointer"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={() => handleExecuteConfirmOrder()}
                            disabled={paymentTimeRemaining <= 0}
                            className="w-2/3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 disabled:text-slate-500 text-white p-2 rounded-xl text-[10px] font-bold text-center cursor-pointer shadow-md"
                          >
                            ✓ Validate & Place Order
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SUBSTEP C: SECURE CREDIT CARD OTP CHECK */}
                  {paymentSubStep === 'otp_verify' && (
                    <div className="space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-3.5">
                        <div className="flex items-center gap-1.5 border-b border-indigo-950 pb-1.5 text-left">
                          <div className="p-1 bg-indigo-500/15 text-indigo-400 rounded">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[7.5px] uppercase font-black text-indigo-455 block tracking-widest">3D-Secure safe-vault</span>
                            <h4 className="font-bold text-xs text-slate-100">ShieldCheck Mastercard SafeKey</h4>
                          </div>
                        </div>

                        {paymentError && (
                          <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg text-[9.5px] border border-rose-500/15 text-center font-bold">
                            ⚠️ {paymentError}
                          </div>
                        )}

                        <div className="space-y-2 text-center">
                          <p className="text-[10px] text-slate-300 px-1 leading-snug">
                            An encrypted passcode (SafeKey) has been transmitted directly to registered line associated with Credit Card.
                          </p>

                          {/* Quick Autofill Helper for Testing */}
                          <div className="inline-block">
                            <button
                              type="button"
                              onClick={() => {
                                setCardOtpInput(sentCardOtp);
                                setPaymentError('');
                              }}
                              className="bg-indigo-500/10 hover:bg-indigo-500/15 text-indigo-400 border border-indigo-500/15 p-1 px-3.5 rounded-full text-[9px] font-bold tracking-wide cursor-pointer transition animate-bounce py-1.5"
                            >
                              🔑 Quick Autofill Code: <b>{sentCardOtp}</b>
                            </button>
                          </div>

                          <div className="space-y-1 max-w-[200px] mx-auto text-left pt-2">
                            <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider block text-center">Enter 6-Digit SafeKey OTP</label>
                            <input 
                              type="text"
                              maxLength={6}
                              placeholder="e.g. 123456"
                              value={cardOtpInput}
                              onChange={(e) => {
                                setCardOtpInput(e.target.value);
                                setPaymentError('');
                              }}
                              className="w-full bg-slate-950 border border-slate-800 text-center font-mono tracking-widest focus:border-indigo-500 outline-none p-2 rounded-xl text-sm text-slate-100"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const freshOtp = String(Math.floor(100000 + Math.random() * 900000));
                              setSentCardOtp(freshOtp);
                              setPaymentError('');
                              onNotificationTriggered(
                                "🔐 payment SafeKey OTP Resent", 
                                `Your secure payment transaction OTP code is: ${freshOtp}`
                              );
                            }}
                            className="inline-block text-[8.5px] text-slate-450 hover:text-indigo-400 underline pt-1 cursor-pointer"
                          >
                            Resend Verification Code
                          </button>
                        </div>
                      </div>

                      {orderProcessing ? (
                        <div className="flex items-center justify-center p-3 text-indigo-400 font-semibold gap-2 bg-slate-900 border border-slate-850 rounded-xl">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-[11px]">Authorizing Credit Settlement...</span>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentSubStep('select');
                              setPaymentError('');
                            }}
                            className="w-1/3 border border-slate-800 hover:bg-slate-900 p-2 rounded-xl text-[10px] font-bold text-slate-300 text-center cursor-pointer"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (cardOtpInput.trim() !== sentCardOtp) {
                                setPaymentError('Invalid verification passcode. Choose Quick Autofill above to bypass.');
                                return;
                              }
                              handleExecuteConfirmOrder();
                            }}
                            className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl text-[10px] font-bold text-center cursor-pointer shadow-md"
                          >
                            ✓ Validate Code & Order
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SUCCESS AND FAIL STATS DRAWER (STILL INTEGRATED) */}
                  {orderSuccess === 'success' && (
                    <div className="p-3 bg-emerald-950/20 text-emerald-400 border border-emerald-900/30 text-center rounded-xl font-bold space-y-1.5 mt-2 animate-fade-in">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-xs">✓</div>
                      <span>Order Done & Captured!</span>
                      <p className="text-[8.5px] text-slate-400 font-normal">Your order was verified by safe payment server.</p>
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
                  )}
                  
                  {orderSuccess === 'fail' && (
                    <div className="p-3 bg-rose-950/20 text-rose-400 border border-rose-900/30 text-center rounded-xl font-bold space-y-1.5 mt-2 animate-fade-in">
                      <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto text-xs">✕</div>
                      <span>Transaction Failed</span>
                      <p className="text-[8.5px] text-slate-400 font-normal">{paymentError || 'Authorizer rejected transaction requests.'}</p>
                      <button 
                        onClick={() => {
                          setOrderSuccess(null);
                          setPaymentSubStep('select');
                        }}
                        className="p-1 px-4 bg-rose-600 text-white rounded text-[10px] uppercase font-bold block mx-auto cursor-pointer"
                      >
                        Try Again
                      </button>
                    </div>
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

          {/* SCREEN: USER PROFILE SCREEN */}
          {mobileScreen === 'profile' && currentUser && (
            <div className="space-y-4 px-4 flex-1 pb-16 overflow-y-auto max-h-[510px] no-scrollbar">
              <div className="flex items-center justify-between border-b border-indigo-950 pb-2.5">
                <div className="flex items-center gap-2">
                  <button onClick={() => setMobileScreen('home')} className="p-1 hover:bg-slate-900 rounded-lg cursor-pointer transition">
                    <ArrowLeft className="w-4 h-4 text-slate-400" />
                  </button>
                  <h3 className="font-extrabold text-[12px] uppercase text-indigo-400 tracking-wider">Premium Member Card</h3>
                </div>
                <span className="text-[8px] uppercase tracking-widest leading-none font-bold bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded">
                  ID: #{currentUser.id ? currentUser.id.slice(0, 6) : "GUEST"}
                </span>
              </div>

              {/* VIP Profile Card Summary Header */}
              <div className="relative bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-800/40 rounded-3xl p-4 shadow-xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl -z-10 group-hover:bg-indigo-600/15 transition-all duration-300"></div>
                <div className="flex items-start gap-3.5">
                  <div className="relative">
                    <img 
                      src={currentUser.profilePic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(currentUser.email || 'guest')}`} 
                      alt={currentUser.name} 
                      className="w-14 h-14 rounded-2xl border-2 border-indigo-500 hover:border-indigo-400 object-cover bg-slate-950 shadow-md transition-all duration-300" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full flex items-center justify-center shadow-lg" title="Secured connection">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className="font-black text-xs text-slate-100 truncate leading-tight tracking-tight">{currentUser.name}</h4>
                      <Sparkles className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{currentUser.email}</p>
                    
                    {/* Membership Badge depending on orders.length */}
                    <div className="inline-block mt-2">
                      {orders.length >= 3 ? (
                        <span className="inline-flex items-center gap-1 text-[8px] uppercase tracking-widest font-black bg-gradient-to-r from-amber-500/20 to-yellow-600/25 border border-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-full shadow-sm">
                          👑 GOLD CLUB ELITE
                        </span>
                      ) : orders.length >= 1 ? (
                        <span className="inline-flex items-center gap-1 text-[8px] uppercase tracking-widest font-black bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-0.5 rounded-full shadow-sm">
                          🥈 SILVER INSIDER TIER
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[8px] uppercase tracking-widest font-black bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full shadow-sm">
                          🌱 PROACTIVE MEMBER
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {profileMsg && (
                <div className="p-2.5 rounded-xl text-[10px] text-center border font-bold text-emerald-400 bg-emerald-500/10 border-emerald-500/25 animate-pulse">
                  ✓ {profileMsg}
                </div>
              )}

              {/* Stats Grid Counters - PREMIUM RENDER */}
              <div className="grid grid-cols-3 gap-2 text-center border-b border-indigo-950 pb-4">
                <div className="bg-slate-900/60 border border-slate-850 hover:border-indigo-900/40 rounded-2xl p-2.5 transition">
                  <span className="block text-slate-400 text-[8px] font-black uppercase tracking-wider">Total Purchases</span>
                  <span className="text-[11px] font-black text-indigo-400 block mt-1">{orders.length} Trxs</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-850 hover:border-indigo-900/40 rounded-2xl p-2.5 transition">
                  <span className="block text-slate-400 text-[8px] font-black uppercase tracking-wider">Active Cart</span>
                  <span className="text-[11px] font-black text-amber-400 block mt-1">{cartCount} Items</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-850 hover:border-indigo-900/40 rounded-2xl p-2.5 transition">
                  <span className="block text-slate-400 text-[8px] font-black uppercase tracking-wider">Destinations</span>
                  <span className="text-[11px] font-black text-emerald-400 block mt-1">{addresses.length} Saved</span>
                </div>
              </div>

              {/* EDIT / VIEW MODE CONTROLLER */}
              {!isEditingProfile ? (
                <div className="space-y-4">
                  
                  {/* Read-Only Details Area - PREMIUM DESIGN with icons */}
                  <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-3.5 space-y-3">
                    <span className="text-[8.5px] font-black tracking-widest text-slate-500 uppercase block">Account Credentials</span>
                    
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-[10.5px] py-1 border-b border-slate-850">
                        <span className="text-slate-400 font-medium flex items-center gap-1.5 text-[10px]">
                          <User className="w-3.5 h-3.5 text-indigo-400" /> Full Name
                        </span>
                        <span className="font-extrabold text-slate-200">{currentUser.name || 'Not provided'}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-[10.5px] py-1 border-b border-slate-850 text-left">
                        <span className="text-slate-400 font-medium flex items-center gap-1.5 shrink-0 text-[10px]">
                          <Mail className="w-3.5 h-3.5 text-indigo-400" /> Registered Email
                        </span>
                        <span className="font-extrabold text-slate-200 truncate pl-4">{currentUser.email || 'Not provided'}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-[10.5px] py-1 border-b border-slate-850">
                        <span className="text-slate-400 font-medium flex items-center gap-1.5 text-[10px]">
                          <CreditCard className="w-3.5 h-3.5 text-indigo-400" /> Phone Contact
                        </span>
                        <span className="font-extrabold text-slate-200">{currentUser.mobile || 'Not provided'}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-[10.5px] py-1 border-b border-slate-850">
                        <span className="text-slate-400 font-medium flex items-center gap-1.5 text-[10px]">
                          <Heart className="w-3.5 h-3.5 text-indigo-400" /> Gender Selection
                        </span>
                        <span className="font-extrabold text-slate-200 uppercase tracking-wide text-[9.5px] bg-slate-950 px-2 py-0.5 rounded text-indigo-300 border border-indigo-950">{currentUser.gender || 'Other'}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-[10.5px] py-1">
                        <span className="text-slate-400 font-medium flex items-center gap-1.5 text-[10px]">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Date of Birth
                        </span>
                        <span className="font-extrabold text-slate-200">{currentUser.dob || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => {
                        setIsEditingProfile(true);
                        setProfileMsg('');
                      }}
                      className="flex-1 bg-indigo-650 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-[11px] font-black transition cursor-pointer text-center shadow-lg hover:scale-[1.01]"
                    >
                      ✏ Modify Account Info
                    </button>
                    <button
                      onClick={handleLogout}
                      className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 border border-rose-550/20 p-2.5 px-4 rounded-xl text-[11px] font-bold transition cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>

                  {/* Saved addresses lists shortcut - WITH DELETE COMPONENT */}
                  <div className="space-y-2 pt-2.5 border-t border-slate-900">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Saved delivery points</span>
                      <span className="text-[8px] bg-indigo-500/10 text-indigo-350 font-black px-1.5 rounded">{addresses.length} Active</span>
                    </div>

                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1 no-scrollbar">
                      {addresses.length === 0 ? (
                        <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl text-center">
                          <p className="text-[10px] text-slate-500 italic">No delivery destinations configured yet.</p>
                          <button onClick={() => setMobileScreen('cart')} className="text-[9px] mt-1 underline text-indigo-400 font-bold">Add One Now</button>
                        </div>
                      ) : (
                        addresses.map((a, idx) => (
                          <div key={a.id || idx} className="p-2.5 bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-xl flex justify-between items-center text-[10px] gap-2 shadow-sm transition">
                            <div className="leading-snug min-w-0 flex-1">
                              <span className="font-extrabold block text-slate-100 truncate">{a.fullName}</span>
                              <span className="text-slate-400 block text-[9.5px] truncate">{a.houseNumber}, {a.street}, {a.city}</span>
                              <span className="text-slate-500 block text-[9px] font-medium">PIN: {a.pinCode} | Phone: {a.phone}</span>
                            </div>
                            
                            {/* DELETE BUTTON */}
                            <button 
                              onClick={() => handleDeleteAddress(a.id)}
                              className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition shrink-0 cursor-pointer"
                              title="Delete Address"
                            >
                              <Trash2 className="w-3.5 h-3.5 border-none" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                /* Interactive Edit Form */
                <form onSubmit={handleUpdateProfile} className="bg-slate-955 border border-slate-850 p-4 rounded-3xl space-y-3.5 shadow-xl">
                  <div className="border-b border-slate-850 pb-1.5">
                    <span className="text-[10px] font-black text-indigo-400 block uppercase tracking-wider">Edit Account Information</span>
                    <p className="text-[8px] text-slate-400 mt-0.5">Custom edits immediately reflect in database records.</p>
                  </div>

                  {/* PRESET AVATAR SELECTOR (High Fidelity Addition for "looking type" premium finish) */}
                  <div className="space-y-1 bg-slate-950/60 p-2 border border-slate-900 rounded-2xl animate-fade-in">
                    <label className="text-[8px] uppercase tracking-widest font-black text-indigo-400 block">⚡ Quick Portrait Presets</label>
                    <div className="flex gap-2 justify-between py-1 px-1">
                      {[
                        { name: "Sia", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sia" },
                        { name: "Kaelen", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Kaelen" },
                        { name: "Evelyn", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Evelyn" },
                        { name: "Maximus", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Maximus" },
                        { name: "Ruby", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ruby" }
                      ].map((avatarItem) => (
                        <button
                          key={avatarItem.name}
                          type="button"
                          onClick={() => setProfilePic(avatarItem.url)}
                          className={`relative p-0.5 rounded-xl border-2 transition ${profilePic === avatarItem.url ? 'border-indigo-500 bg-indigo-500/10 scale-105' : 'border-slate-800 hover:border-slate-700 bg-slate-900'}`}
                          title={`Select seed: ${avatarItem.name}`}
                        >
                          <img 
                            src={avatarItem.url} 
                            alt={avatarItem.name} 
                            className="w-8 h-8 rounded-lg object-cover" 
                            referrerPolicy="no-referrer"
                          />
                          {profilePic === avatarItem.url && (
                            <span className="absolute -top-1 -right-1 bg-indigo-500 text-white rounded-full p-0.5 text-[6px] font-black">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-0.5">
                    <label className="text-[8.5px] uppercase font-bold text-slate-400 block">Your Name</label>
                    <input 
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      required
                      placeholder="e.g. Alex Johnson"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg p-1.5 text-[11px] outline-none text-slate-200 transition"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[8.5px] uppercase font-bold text-slate-400 block">Mobile No.</label>
                    <input 
                      type="text"
                      value={profileMobile}
                      onChange={(e) => setProfileMobile(e.target.value)}
                      required
                      placeholder="e.g. +91 9876543210"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg p-1.5 text-[11px] outline-none text-slate-200 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="space-y-0.5">
                      <label className="text-[8.5px] uppercase font-bold text-slate-400 block">Gender</label>
                      <select
                        value={profileGender}
                        onChange={(e) => setProfileGender(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg p-1.5 text-[11px] outline-none text-slate-200"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div className="space-y-0.5">
                      <label className="text-[8.5px] uppercase font-bold text-slate-400 block">Date of Birth</label>
                      <input 
                        type="date"
                        value={profileDob}
                        onChange={(e) => setProfileDob(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg p-1.5 text-[11px] outline-none text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[8.5px] uppercase font-bold text-slate-400 block">Custom Portrait Image URL</label>
                    <input 
                      type="url"
                      value={profilePic}
                      onChange={(e) => setProfilePic(e.target.value)}
                      placeholder="Or paste custom unsplash url..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg p-1.5 text-[11px] outline-none text-slate-250 placeholder-slate-600 font-mono text-[9px] truncate"
                    />
                  </div>

                  <div className="flex gap-2 pt-1.5">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="w-1/2 border border-slate-800 p-1.5 rounded-lg text-[11px] font-semibold text-slate-300 hover:bg-slate-850 cursor-pointer transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded-lg text-[11px] font-extrabold cursor-pointer transition shadow-md"
                    >
                      ✓ Apply Changes
                    </button>
                  </div>
                </form>
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
        {['home', 'categories', 'cart', 'orders', 'details', 'chatbot', 'profile'].includes(mobileScreen) && (
          <div className="absolute bottom-0 inset-x-0 h-12 bg-slate-950 border-t border-slate-900 flex justify-around items-center text-slate-500">
            <button 
              onClick={() => setMobileScreen('home')}
              className={`flex flex-col items-center cursor-pointer ${mobileScreen === 'home' ? 'text-blue-400' : 'hover:text-slate-300'}`}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="text-[8.5px] font-bold">Home</span>
            </button>
            <button 
              onClick={() => setMobileScreen('categories')}
              className={`flex flex-col items-center cursor-pointer ${mobileScreen === 'categories' ? 'text-blue-400' : 'hover:text-slate-300'}`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="text-[8.5px] font-bold">Category</span>
            </button>
            <button 
              onClick={() => setMobileScreen('cart')}
              className={`flex flex-col items-center cursor-pointer relative ${mobileScreen === 'cart' ? 'text-blue-400' : 'hover:text-slate-300'}`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="text-[8.5px] font-bold">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-blue-500 text-white text-[7px] font-black rounded-full h-3.5 w-3.5 flex items-center justify-center border border-slate-950">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setMobileScreen('orders')}
              className={`flex flex-col items-center cursor-pointer ${mobileScreen === 'orders' ? 'text-blue-400' : 'hover:text-slate-300'}`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="text-[8.5px] font-bold">Orders</span>
            </button>
            <button 
              onClick={() => {
                setMobileScreen('profile');
                setIsEditingProfile(false);
                setProfileMsg('');
              }}
              className={`flex flex-col items-center cursor-pointer ${mobileScreen === 'profile' ? 'text-blue-400' : 'hover:text-slate-300'}`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="text-[8.5px] font-bold">Profile</span>
            </button>
          </div>
        )}

        {/* GOOGLE ACCOUNTS SIGN-IN MODAL OVERLAY */}
        {googleModalOpen && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className={`w-full max-w-[290px] p-4.5 rounded-3xl border shadow-2xl space-y-4 text-left transition ${phoneTheme === 'dark' ? 'bg-[#18181b] border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
              
              {/* Header */}
              <div className="text-center relative">
                <button 
                  onClick={() => {
                    setGoogleModalOpen(false);
                    setGoogleAuthError('');
                    setGoogleAccountNotFound(false);
                  }}
                  className="absolute right-0 top-0 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer font-bold text-xs"
                >
                  ✕
                </button>
                <div className="flex justify-center mb-1">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.65-.63-1.04-1.44-1.04-2.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.4 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <h4 className="text-xs font-bold">Sign in with Google</h4>
                <p className="text-[9px] text-slate-400">to continue to SmartCommerce</p>
              </div>

              {googleAuthError && (
                <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg text-[9px] text-center border border-rose-500/20 font-medium">
                  {googleAuthError}
                </div>
              )}

              {/* Body */}
              {!googleAccountNotFound ? (
                <div className="space-y-3">
                  <div className="space-y-1.5 text-left">
                    <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">Tap to Choose Account</span>
                    
                    {/* Active developer email */}
                    <button
                      type="button"
                      onClick={() => {
                        setGoogleEmailInput('pvsharanya21@gmail.com');
                        handleGoogleLoginSubmit('pvsharanya21@gmail.com');
                      }}
                      className="w-full flex items-center gap-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-1.5 rounded-xl text-left hover:bg-slate-250 dark:hover:bg-zinc-800 transition text-[11px] cursor-pointer"
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[10px] uppercase">
                        S
                      </div>
                      <div className="leading-none">
                        <span className="font-semibold block text-[10px] text-neutral-800 dark:text-zinc-200">Sharanya Viswanathan</span>
                        <span className="text-[8px] text-slate-400">pvsharanya21@gmail.com</span>
                      </div>
                    </button>

                    {/* Standard admin email */}
                    <button
                      type="button"
                      onClick={() => {
                        setGoogleEmailInput('admin@smartcommerce.com');
                        handleGoogleLoginSubmit('admin@smartcommerce.com');
                      }}
                      className="w-full flex items-center gap-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-1.5 rounded-xl text-left hover:bg-slate-250 dark:hover:bg-zinc-800 transition text-[11px] cursor-pointer"
                    >
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px] uppercase">
                        A
                      </div>
                      <div className="leading-none">
                        <span className="font-semibold block text-[10px] text-neutral-800 dark:text-zinc-200">Chief Admin</span>
                        <span className="text-[8px] text-slate-400">admin@smartcommerce.com</span>
                      </div>
                    </button>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-zinc-805">
                    <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider text-left">Or Use Personal Email G-Suite</span>
                    <input 
                      type="email"
                      placeholder="e.g. user@gmail.com"
                      value={googleEmailInput}
                      onChange={(e) => {
                        setGoogleEmailInput(e.target.value);
                        setGoogleAuthError('');
                        setGoogleAccountNotFound(false);
                      }}
                      className={`w-full p-2 text-[11px] rounded-lg border outline-none ${phoneTheme === 'dark' ? 'bg-[#121214] border-zinc-800 text-white' : 'bg-white border-slate-300 text-zinc-900'}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleGoogleLoginSubmit(googleEmailInput)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg text-[11px] font-bold transition cursor-pointer"
                    >
                      Authenticate Google Email
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-2.5 text-center text-[11px] space-y-1 text-amber-500 dark:text-amber-400">
                    <p className="font-bold">Email not found in database</p>
                    <p className="text-[9px] text-slate-400">
                      The security key <b>{googleEmailInput}</b> is not registered.
                    </p>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[8px] uppercase font-bold text-slate-400 block">Provide Your Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Alex Johnson"
                      value={googleNameInput}
                      onChange={(e) => setGoogleNameInput(e.target.value)}
                      className={`w-full p-2 text-[11px] rounded-lg border outline-none ${phoneTheme === 'dark' ? 'bg-[#121214] border-zinc-800 text-white' : 'bg-white border-slate-300 text-zinc-900'}`}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGoogleAccountNotFound(false);
                        setGoogleAuthError('');
                      }}
                      className="w-1/2 border border-slate-300 dark:border-zinc-800 p-2 rounded-lg text-[11px] font-bold text-slate-450 dark:text-zinc-300 cursor-pointer shadow-sm text-center"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGoogleRegisterSubmit(googleEmailInput, googleNameInput)}
                      className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg text-[11px] font-bold transition cursor-pointer shadow-md text-center"
                    >
                      Quick Sign Up
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
