/**
 * SmartCommerce TS Types definition
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  sku: string;
  price: number;
  discountPrice?: number;
  quantity: number; // Stock quantity
  images: string[];
  specifications: Record<string, string>;
  weight: string;
  dimensions: string;
  warranty: string;
  rating: number;
  numReviews: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isTrending?: boolean;
}

export interface Category {
  id: string;
  name: string;
  status: 'enabled' | 'disabled';
  icon: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  productImage: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned';
  items: OrderItem[];
  total: number;
  discountAmount: number;
  payableAmount: number;
  address: Address;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Success' | 'Failed' | 'Refunded';
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  rating: number;
  comment: string;
  isSpam: boolean;
  date: string;
  image?: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
}

export interface Coupon {
  code: string;
  type: 'Percentage' | 'Flat' | 'FreeShipping';
  value: number;
  expiryDate: string;
  minBillValue: number;
  isActive: boolean;
}

export interface Notification {
  id: string;
  title: string;
  text: string;
  date: string;
  isRead: boolean;
  type: 'order' | 'offer' | 'inventory';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
}
