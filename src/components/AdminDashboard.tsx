import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from 'recharts';
import { 
  Users, 
  Package, 
  Tags, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle, 
  Trash2, 
  Ticket, 
  RefreshCw 
} from 'lucide-react';
import { Product, Order, Coupon, Review } from '../types';

interface AdminDashboardProps {
  onNotificationTriggered: (title: string, text: string) => void;
}

export default function AdminDashboard({ onNotificationTriggered }: AdminDashboardProps) {
  const [metrics, setMetrics] = useState({
    totalUsers: 2,
    totalProducts: 7,
    totalCategories: 10,
    totalOrders: 2,
    revenue: 344,
    pendingOrders: 0
  });

  const [salesData, setSalesData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [editStockId, setEditStockId] = useState<string | null>(null);
  const [newStockVal, setNewStockVal] = useState<number>(0);

  // New Coupon Form States
  const [newCoupCode, setNewCoupCode] = useState('');
  const [newCoupType, setNewCoupType] = useState<'Percentage' | 'Flat' | 'FreeShipping'>('Percentage');
  const [newCoupVal, setNewCoupVal] = useState(10);
  const [newCoupMin, setNewCoupMin] = useState(50);

  // New Product Form States
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('electronics');
  const [newProdPrice, setNewProdPrice] = useState(99);
  const [newProdQty, setNewProdQty] = useState(15);
  const [newProdBrand, setNewProdBrand] = useState('Brand');
  const [newProdDesc, setNewProdDesc] = useState('Product description details.');

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch report metrics
      const rRes = await fetch('/api/admin/reports');
      const rData = await rRes.json();
      
      setMetrics(rData.metrics);
      setSalesData(rData.salesChart);
      setCategoryData(rData.categoryRevenue);

      // Fetch dynamic products
      const pRes = await fetch('/api/products');
      const pData = await pRes.json();
      setProducts(pData);

      // Fetch dynamic orders
      const oRes = await fetch('/api/orders');
      const oData = await oRes.json();
      setOrders(oData);

      // Fetch coupons
      const cRes = await fetch('/api/coupons');
      const cData = await cRes.json();
      setCoupons(cData);

      // Fetch reviews
      const rvsRes = await fetch('/api/reviews');
      const rvsData = await rvsRes.json();
      setReviews(rvsData);
    } catch (e) {
      console.error("Error loading admin datasets", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStock = async (prodId: string, qty: number) => {
    try {
      const res = await fetch(`/api/products/${prodId}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: qty })
      });
      if (res.ok) {
        onNotificationTriggered("Stock Synchronized", `Product stock modified successfully to ${qty}.`);
        setEditStockId(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        onNotificationTriggered("Order Processed", `Order #${orderId} status code marked as: ${status}.`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupCode) return;
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCoupCode,
          type: newCoupType,
          value: newCoupVal,
          minBillValue: newCoupMin
        })
      });
      if (res.ok) {
        onNotificationTriggered("Coupon Initialized", `Discount Coupon ${newCoupCode.toUpperCase()} created successfully.`);
        setNewCoupCode('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProdName,
          category: newProdCategory,
          price: Number(newProdPrice),
          quantity: Number(newProdQty),
          brand: newProdBrand,
          description: newProdDesc
        })
      });
      if (res.ok) {
        onNotificationTriggered("Catalog Unified", `Product '${newProdName}' injected into Category '${newProdCategory}'`);
        setNewProdName('');
        setNewProdDesc('Product description details.');
        setShowAddProduct(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleCoupon = async (code: string) => {
    try {
      const res = await fetch(`/api/coupons/${code}/toggle`, { method: 'PUT' });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onNotificationTriggered("Review Moderated", "Spam message purged from feedback feed.");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

  return (
    <div className="space-y-6 font-sans text-zinc-100">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#18181b] p-6 rounded-2xl border border-[#27272a] shadow-lg gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Admin Control Center & Analytical Insights</h1>
          <p className="text-sm text-zinc-400">Monitor live commerce metrics, manage warehouses, validate coupons, and moderate community reviews.</p>
        </div>
        <button 
          onClick={fetchData}
          className="p-2 px-3 border border-[#27272a] hover:border-[#3f3f46] hover:bg-[#27272a] rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-zinc-300 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Synchronize Logs
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-[#18181b] p-4 rounded-xl border border-[#27272a] shadow-md hover:border-[#3f3f46] transition-all flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/10 text-blue-400 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 block font-medium">Total Users</span>
            <span className="text-lg font-bold text-white font-mono">{metrics.totalUsers}</span>
          </div>
        </div>

        <div className="bg-[#18181b] p-4 rounded-xl border border-[#27272a] shadow-md hover:border-[#3f3f46] transition-all flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600/10 text-emerald-400 rounded-lg">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 block font-medium">Products</span>
            <span className="text-lg font-bold text-white font-mono">{metrics.totalProducts}</span>
          </div>
        </div>

        <div className="bg-[#18181b] p-4 rounded-xl border border-[#27272a] shadow-md hover:border-[#3f3f46] transition-all flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600/10 text-indigo-400 rounded-lg">
            <Tags className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 block font-medium">Categories</span>
            <span className="text-lg font-bold text-white font-mono">{metrics.totalCategories}</span>
          </div>
        </div>

        <div className="bg-[#18181b] p-4 rounded-xl border border-[#27272a] shadow-md hover:border-[#3f3f46] transition-all flex items-center gap-3">
          <div className="p-2.5 bg-amber-600/10 text-amber-400 rounded-lg">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 block font-medium">Total Orders</span>
            <span className="text-lg font-bold text-white font-mono">{metrics.totalOrders}</span>
          </div>
        </div>

        <div className="bg-[#18181b] p-4 rounded-xl border border-[#27272a] shadow-md hover:border-[#3f3f46] transition-all flex items-center gap-3">
          <div className="p-2.5 bg-pink-600/10 text-pink-400 rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 block font-medium">Gross Revenue</span>
            <span className="text-lg font-bold text-white font-mono">${metrics.revenue.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-[#18181b] p-4 rounded-xl border border-[#27272a] shadow-md hover:border-[#3f3f46] transition-all flex items-center gap-3">
          <div className="p-2.5 bg-purple-600/10 text-purple-400 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 block font-medium">Active Holding</span>
            <span className="text-lg font-bold text-white font-mono">{metrics.pendingOrders}</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Sales Trend LineChart */}
        <div className="md:col-span-2 bg-[#18181b] p-6 rounded-2xl border border-[#27272a] shadow-lg space-y-4">
          <div className="flex justify-between items-center border-b border-[#27272a]/50 pb-3">
            <h3 className="text-sm font-semibold text-white">Gross Sales Pipeline Timeline</h3>
            <span className="text-[10px] uppercase font-bold text-zinc-400 bg-[#0c0c0e] border border-[#27272a] p-1 px-2 rounded">Daily (Live Feed)</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#52525b" fontSize={11} />
                <YAxis stroke="#52525b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0c0c0e', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Line type="monotone" dataKey="sales" name="Sales ($Value)" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2 }} />
                <Line type="monotone" dataKey="orders" name="Order Volumes" stroke="#10B981" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categorical share PieChart */}
        <div className="bg-[#18181b] p-6 rounded-2xl border border-[#27272a] shadow-lg space-y-4 flex flex-col">
          <div className="border-b border-[#27272a]/50 pb-3">
            <h3 className="text-sm font-semibold text-white">Catalogue Density Share</h3>
          </div>
          <div className="flex-1 h-44 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value} goods`, props.payload.name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-white font-mono">{products.length}</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">SKU Units</span>
            </div>
          </div>
          
          {/* Pie Legends */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-zinc-400 overflow-y-auto max-h-20 max-w-full">
            {categoryData.slice(0, 6).map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full block" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="truncate">{entry.name} ({entry.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Control Blocks */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Ordered logs and Status timeline controller */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Actions */}
          <div className="bg-[#18181b] p-6 rounded-2xl border border-[#27272a] shadow-lg space-y-4">
            <div className="flex justify-between items-center border-b border-[#27272a]/50 pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-emerald-400" /> Active Purchase Order Timelines Hub
              </h3>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] px-2.5 py-0.5 rounded-full font-semibold">
                {orders.length} in queue
              </span>
            </div>

            <div className="divide-y divide-[#27272a]/50 max-h-96 overflow-y-auto pr-1">
              {orders.map(order => (
                <div key={order.id} className="py-3.5 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{order.id}</span>
                      <span className="text-[11px] text-zinc-500">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Purchased: <span className="font-semibold text-zinc-200">{order.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}</span>
                    </p>
                    <p className="text-xs text-zinc-500">
                      Deliver to: <span className="font-medium text-zinc-300">{order.address.fullName}, {order.address.city}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-bold block text-white font-mono">${order.payableAmount}</span>
                      <span className="text-[10px] text-zinc-500 font-medium">{order.paymentMethod} • {order.paymentStatus}</span>
                    </div>
                    
                    <select 
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className="border border-[#27272a] text-xs rounded-lg p-1.5 px-2 bg-[#0c0c0e] hover:bg-[#1f1f23] cursor-pointer text-zinc-200 font-medium outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warehouse and Inventory monitors */}
          <div className="bg-[#18181b] p-6 rounded-2xl border border-[#27272a] shadow-lg space-y-4">
            <div className="flex justify-between items-center border-b border-[#27272a]/50 pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Package className="w-4 h-4 text-blue-400" /> Catalog Inventory & Warehouse Stock
              </h3>
              <button 
                onClick={() => setShowAddProduct(!showAddProduct)}
                className="p-1 px-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition"
              >
                + Add Dynamic Product
              </button>
            </div>

            {showAddProduct && (
              <form onSubmit={handleCreateProduct} className="p-4 bg-[#0c0c0e] border border-[#27272a] rounded-xl space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Product Name</label>
                    <input 
                      type="text" 
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="e.g., Stryder Aero Plus Edition"
                      required
                      className="w-full bg-[#18181b] border border-[#27272a] text-white rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Category</label>
                    <select 
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="w-full bg-[#18181b] border border-[#27272a] text-zinc-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    >
                      <option value="electronics">Electronics</option>
                      <option value="fashion">Fashion</option>
                      <option value="footwear">Footwear</option>
                      <option value="beauty">Beauty</option>
                      <option value="home-appliances">Home Appliances</option>
                      <option value="grocery">Grocery</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Price ($)</label>
                    <input 
                      type="number" 
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      required
                      className="w-full bg-[#18181b] border border-[#27272a] text-white rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Starting Stock Qty</label>
                    <input 
                      type="number" 
                      value={newProdQty}
                      onChange={(e) => setNewProdQty(Number(e.target.value))}
                      required
                      className="w-full bg-[#18181b] border border-[#27272a] text-white rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <button 
                    type="submit"
                    className="p-1.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Save to Catalog
                  </button>
                </div>
              </form>
            )}

            <div className="divide-y divide-[#27272a]/50 max-h-96 overflow-y-auto pr-1">
              {products.map(p => (
                <div key={p.id} className="py-3 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded bg-[#0c0c0e] border border-[#27272a] flex-shrink-0" />
                    <div>
                      <span className="font-bold text-white block text-ellipsis max-w-[180px] sm:max-w-xs overflow-hidden whitespace-nowrap">{p.name}</span>
                      <span className="text-[10px] text-zinc-500 font-semibold">{p.category.toUpperCase()} • {p.brand}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {p.quantity <= 10 ? (
                        <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Low Stock ({p.quantity})
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5 font-bold">
                          Safe ({p.quantity} units)
                        </span>
                      )}
                    </div>

                    {editStockId === p.id ? (
                      <div className="flex items-center gap-1.5">
                        <input 
                          type="number" 
                          defaultValue={p.quantity}
                          onChange={(e) => setNewStockVal(Number(e.target.value))}
                          className="w-14 items-center bg-[#0c0c0e] border border-[#27272a] text-white rounded p-1 text-xs text-center outline-none"
                        />
                        <button 
                          onClick={() => handleUpdateStock(p.id, newStockVal)}
                          className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded cursor-pointer text-xs"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setEditStockId(null)}
                          className="text-zinc-500 hover:text-white p-1 font-medium cursor-pointer"
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          setEditStockId(p.id);
                          setNewStockVal(p.quantity);
                        }}
                        className="p-1 px-2.5 border border-[#27272a] hover:bg-[#27272a] rounded text-[11px] font-semibold text-blue-400 hover:text-blue-300 cursor-pointer"
                      >
                        Refill Stock
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coupon validation and review spam moderation */}
        <div className="space-y-6">
          
          {/* Coupons List */}
          <div className="bg-[#18181b] p-6 rounded-2xl border border-[#27272a] shadow-lg space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Ticket className="w-4 h-4 text-emerald-400" /> Code Coupons Control
            </h3>

            {/* Quick add coupon form */}
            <form onSubmit={handleCreateCoupon} className="p-3 bg-[#0c0c0e] rounded-xl space-y-2 border border-[#27272a]">
              <div className="flex gap-1.5">
                <input 
                  type="text"
                  placeholder="CODE (e.g. MEGA50)" 
                  value={newCoupCode}
                  onChange={(e) => setNewCoupCode(e.target.value)}
                  className="bg-[#18181b] border text-xs p-1.5 rounded-lg border-[#27272a] text-white outline-none w-1/2 flex-1"
                />
                <select 
                  value={newCoupType}
                  onChange={(e) => setNewCoupType(e.target.value as any)}
                  className="bg-[#18181b] border text-xs p-1.5 rounded-lg border-[#27272a] text-zinc-300 outline-none"
                >
                  <option value="Percentage">% Sale</option>
                  <option value="Flat">Flat Cash</option>
                  <option value="FreeShipping">Free Ship</option>
                </select>
              </div>
              <div className="flex gap-1.5">
                <input 
                  type="number" 
                  placeholder="Discount Value"
                  value={newCoupVal}
                  onChange={(e) => setNewCoupVal(Number(e.target.value))}
                  className="bg-[#18181b] border text-xs p-1.5 rounded-lg border-[#27272a] text-white outline-none w-1/2"
                />
                <input 
                  type="number" 
                  placeholder="Min buying bill"
                  value={newCoupMin}
                  onChange={(e) => setNewCoupMin(Number(e.target.value))}
                  className="bg-[#18181b] border text-xs p-1.5 rounded-lg border-[#27272a] text-white outline-none w-1/2"
                />
              </div>
              <button 
                type="submit"
                className="w-full p-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
              >
                Register Promo Code
              </button>
            </form>

            <div className="divide-y divide-[#27272a]/50">
              {coupons.map(c => (
                <div key={c.code} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono text-xs font-bold text-white">{c.code}</span>
                    <span className="text-[10px] text-zinc-500 block">
                      {c.type === 'Percentage' ? `${c.value}% off` : c.type === 'Flat' ? `$${c.value} direct` : 'Free Shipping'} • Min bill: ${c.minBillValue}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleToggleCoupon(c.code)}
                    className={`p-1 px-2.5 rounded text-[10px] font-semibold transition cursor-pointer ${c.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'}`}
                  >
                    {c.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Review moderation */}
          <div className="bg-[#18181b] p-6 rounded-2xl border border-[#27272a] shadow-lg space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" /> Feedback Moderation Hub
            </h3>

            <div className="divide-y divide-[#27272a]/50 max-h-72 overflow-y-auto pr-1">
              {reviews.map(r => (
                <div key={r.id} className="py-3 space-y-1 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-zinc-200">{r.userName}</span>
                      <span className="text-[10px] text-zinc-500 block mb-1">Product: {r.productName}</span>
                    </div>
                    {r.isSpam ? (
                      <span className="text-[9px] uppercase font-extrabold bg-red-500/15 text-red-400 p-0.5 px-2 rounded flex items-center border border-red-500/20 gap-0.5">
                        <ShieldAlert className="w-2.5 h-2.5" /> Probable Spam
                      </span>
                    ) : (
                      <span className="text-xs text-amber-400 font-bold">★ {r.rating}</span>
                    )}
                  </div>
                  <p className="text-zinc-400 leading-relaxed italic text-[11px]">"{r.comment}"</p>
                  <div className="flex justify-end gap-2 text-[10px] pt-1">
                    {r.isSpam && (
                      <button 
                        onClick={() => handleDeleteReview(r.id)}
                        className="text-red-400 hover:text-white font-bold flex items-center gap-0.5 cursor-pointer bg-red-500/10 hover:bg-red-600 border border-red-500/20 p-1 px-2 rounded"
                      >
                        <Trash2 className="w-3 h-3" /> Purge Spam
                      </button>
                    )}
                    {!r.isSpam && (
                      <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-1 px-1.5 rounded font-medium flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" /> Verified Post
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
