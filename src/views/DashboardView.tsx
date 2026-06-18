import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { User, Order, Product } from '../types';
import { SlidersHorizontal, ShieldCheck, Mail, Calendar, Sparkles, UserCheck, ShoppingBag, Plus, Trash2, CheckCircle, Truck, PackageCheck, Send, Edit } from 'lucide-react';

interface DashboardViewProps {
  navigate: (path: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ navigate }) => {
  const {
    user, allUsers, orders, products, addProduct, deleteProduct, updateProduct, updateOrderStatus, deleteOrder, updateProfile
  } = useStore();

  if (!user) {
    return (
      <div className="py-20 text-center max-w-sm mx-auto space-y-6">
        <div className="text-4xl">🔐</div>
        <div>
          <h2 className="font-display font-black text-2xl text-gray-900">Access Restricted</h2>
          <p className="text-sm text-gray-500 font-semibold mt-1">Please sign in to access your user or administrative dashboard.</p>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3.5 bg-[#008D7F] hover:bg-[#9c1343] text-white font-extrabold text-xs rounded-xl transition shadow"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  // Active tab depends on role
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (user.role === 'admin') return 'users';
    if (user.role === 'delivery') return 'my-order';
    return 'dashboard';
  });

  // Profile forms state
  const [pName, setPName] = useState(user.name);
  const [pPhoto, setPPhoto] = useState(user.photoURL || '');

  // Add Product form states
  const [prodTitle, setProdTitle] = useState('');
  const [prodCat, setProdCat] = useState('Earrings');
  const [prodSubCat, setProdSubCat] = useState('Earrings');
  const [prodPrice, setProdPrice] = useState(100);
  const [prodQty, setProdQty] = useState(50);
  const [prodDesc, setProdDesc] = useState('');
  const [prodImg, setProdImg] = useState('https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300');

  // Edit states for assigning delivery man
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [selectedDelMan, setSelectedDelMan] = useState('');
  const [delDate, setDelDate] = useState('');

  const deliveryMen = allUsers.filter(u => u.role === 'delivery');

  // Calculate dashboard stats for customer user
  const userOrders = orders.filter(o => o.email.toLowerCase() === user.email.toLowerCase());
  const userCompleted = userOrders.filter(o => o.status === 'completed');
  const userOnTheWay = userOrders.filter(o => o.status === 'onTheWay');
  const userPending = userOrders.filter(o => o.status === 'pending');
  const userTotalSpent = userCompleted.reduce((sum, o) => sum + o.total, 0);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: pName, photoURL: pPhoto });
    alert('Profile updated successfully!');
  };

  const handleProductCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle || !prodDesc) {
      alert('Please specify name and features.');
      return;
    }
    addProduct({
      title: prodTitle,
      category: prodCat,
      sub_category: prodSubCat,
      price: Number(prodPrice),
      quantity: Number(prodQty),
      description: prodDesc,
      gallery: [prodImg],
      currency: 'BDT'
    });
    alert(`Success! "${prodTitle}" added to the shop catalog!`);
    
    // reset form
    setProdTitle('');
    setProdDesc('');
    setProdPrice(100);
    setProdQty(50);
  };

  const handleAssignDelivery = (orderId: string) => {
    if (!selectedDelMan || !delDate) {
      alert('Please specify delivery personnel and date!');
      return;
    }
    updateOrderStatus(orderId, 'onTheWay', selectedDelMan, delDate);
    setAssigningId(null);
    setSelectedDelMan('');
    setDelDate('');
    alert('Order transitioned to logistics "On The Way" successfully!');
  };

  const handleMarkDelivered = (orderId: string) => {
    updateOrderStatus(orderId, 'completed');
    alert('Congratulations! Order delivered and closed successfully.');
  };

  return (
    <div className="space-y-10 pb-20 text-left">
      
      {/* Profile Welcome space */}
      <section className="bg-slate-9 border border-slate-100 p-6 md:p-8 rounded-3xl relative overflow-hidden flex flex-col sm:flex-row items-center gap-6 shadow-sm bg-stone-50">
        <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow shrink-0 bg-slate-200">
          <img
            src={user.photoURL || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-1 flex-1 text-center sm:text-left">
          <span className="text-[10px] font-extrabold text-[#008D7F] bg-teal-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {user.role} workspace
          </span>
          <h1 className="font-display font-black text-2xl text-gray-900">{user.name}</h1>
          <p className="text-xs font-semibold text-gray-400 flex items-center justify-center sm:justify-start gap-1">
            <Mail className="w-3.5 h-3.5" /> {user.email}
          </p>
        </div>

        <div className="text-center sm:text-right text-[10px] text-gray-400 font-bold uppercase tracking-wider space-y-1 bg-white border border-gray-100 p-4 rounded-2xl shadow-inner shrink-0 leading-relaxed">
          <span>Seeded Dashboard Testing Account</span>
          <p className="text-xs text-[#008D7F] font-black tracking-normal">Fully Interactive & Responsive</p>
        </div>
      </section>

      {/* Grid Menu Tabs Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Navigation Links depending/acting on active role */}
        <div className="lg:col-span-3 bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2 border-l-2 border-[#008D7F] mb-3">
            Menu Navigation
          </h2>

          <nav className="flex flex-col gap-1.5 text-xs font-bold text-gray-500">
            {user.role === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'users' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Users List ({allUsers.length})
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'orders' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  Active Orders ({orders.filter(o => o.status !== 'completed').length})
                </button>

                <button
                  onClick={() => setActiveTab('completed')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'completed' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <PackageCheck className="w-4 h-4" />
                  Order Completed ({orders.filter(o => o.status === 'completed').length})
                </button>

                <button
                  onClick={() => setActiveTab('product-create')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'product-create' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <Plus className="w-4.5 h-4.5" />
                  Add Products Create
                </button>
              </>
            )}

            {user.role === 'delivery' && (
              <>
                <button
                  onClick={() => setActiveTab('my-order')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'my-order' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  Assignments On Way ({orders.filter(o => o.deliveryMan === user.name && o.status === 'onTheWay').length})
                </button>

                <button
                  onClick={() => setActiveTab('my-completed')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'my-completed' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  My Completed Deliveries ({orders.filter(o => o.deliveryMan === user.name && o.status === 'completed').length})
                </button>

                <button
                  onClick={() => setActiveTab('my-profile')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'my-profile' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <Edit className="w-4 h-4" />
                  My Profile Details
                </button>
              </>
            )}

            {user.role === 'user' && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'dashboard' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Purchases Dashboard
                </button>

                <button
                  onClick={() => setActiveTab('my-profile')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors duration-150 flex items-center gap-2 ${
                    activeTab === 'my-profile' ? 'bg-teal-50 text-[#008D7F]' : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile settings
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Right Side Pane: Tab values rendered cleanly */}
        <div className="lg:col-span-9 bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm min-h-[450px]">
          
          {/* USER CUSTOMER TAB: DASHBOARD */}
          {activeTab === 'dashboard' && user.role === 'user' && (
            <div className="space-y-8">
              <div className="border-b border-gray-50 pb-3">
                <h3 className="font-display font-black text-lg text-gray-900">Purchases & History Logs</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Control, cancel, or trace active invoices securely.</p>
              </div>

              {/* Stats overview boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-gray-100 p-5 rounded-2xl text-left">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Spent</span>
                  <p className="font-display font-black text-2xl text-[#008D7F] mt-1">৳{userTotalSpent.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 border border-gray-100 p-5 rounded-2xl text-left">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">On The Way</span>
                  <p className="font-display font-black text-2xl text-blue-600 mt-1">{userOnTheWay.length} items</p>
                </div>
                <div className="bg-slate-50 border border-gray-100 p-5 rounded-2xl text-left">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Orders</span>
                  <p className="font-display font-black text-2xl text-amber-600 mt-1">{userPending.length} items</p>
                </div>
              </div>

              {/* Orders List for user */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Your transactions</h4>
                
                {userOrders.length === 0 ? (
                  <div className="bg-slate-50 border border-gray-100 p-12 rounded-2xl text-center text-xs text-gray-400 font-semibold">
                    You haven't placed any orders yet. Head to shop to purchase jewellery combos!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((o) => (
                      <div key={o._id} className="border border-gray-100 rounded-2xl p-5 space-y-4 text-xs font-semibold">
                        <div className="flex flex-wrap justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100 gap-2">
                          <div>
                            <p className="font-bold text-gray-700">Order Reference ID: <span className="text-[#008D7F] font-black">{o._id}</span></p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Date: {o.date}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            o.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                            o.status === 'onTheWay' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {o.status}
                          </span>
                        </div>

                        {/* order items list */}
                        <div className="space-y-3 pl-1">
                          {o.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-center">
                              <div className="w-10 h-10 rounded border border-gray-50 overflow-hidden shrink-0 bg-slate-100">
                                <img src={item.image} alt="com" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-gray-750 line-clamp-1">{item.title}</p>
                                <p className="text-gray-400 text-[10px]">{item.quantity} units x ৳{item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order info foot block */}
                        <div className="border-t border-gray-50 pt-3 flex flex-wrap justify-between items-center text-xs gap-3">
                          <p className="text-gray-400 font-bold">Invoiced cod: <span className="font-display font-black text-sm text-gray-800">৳{o.total.toLocaleString()}</span></p>
                          {o.deliveryMan && (
                            <p className="text-gray-500 bg-gray-50 border border-gray-100/50 px-2 py-1 rounded-md text-[10px]">
                              🚚 Delivery logistics: <strong className="text-gray-700">{o.deliveryMan}</strong> ({o.deliveryDate})
                            </p>
                          )}
                          {o.status === 'pending' && (
                            <button
                              onClick={() => {
                                if (window.confirm("Are you sure? You won't be able to revert this!")) {
                                  deleteOrder(o._id);
                                  alert('Order canceled successfully.');
                                }
                              }}
                              className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-[10px] font-bold leading-normal border border-rose-100 active:scale-95 transition"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SHARED EDIT PROFILE TAB */}
          {activeTab === 'my-profile' && (
            <div className="space-y-6">
              <div className="border-b border-gray-50 pb-3">
                <h3 className="font-display font-black text-lg text-gray-900">Personal Info Details</h3>
                <p className="text-xs text-[#008D7F] font-bold uppercase mt-0.5">{user.role} profile workspace</p>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-sm">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#008D7F] font-semibold text-gray-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avatar Image URL</label>
                  <input
                    type="text"
                    value={pPhoto}
                    onChange={(e) => setPPhoto(e.target.value)}
                    className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#008D7F] font-semibold text-gray-800"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#008D7F] hover:bg-[#981849] text-white font-extrabold text-xs rounded-xl transition shadow"
                >
                  Save Profile Updates
                </button>
              </form>
            </div>
          )}

          {/* ADMIN TABS: USER LIST */}
          {activeTab === 'users' && user.role === 'admin' && (
            <div className="space-y-6">
              <div className="border-b border-gray-50 pb-3">
                <h3 className="font-display font-black text-lg text-gray-900">User accounts Directory ({allUsers.length})</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Directory listing of customers, administrator, and active logistics boy accounts.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold select-none border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-gray-400 border-b border-gray-100 select-none">
                      <th className="p-4 uppercase tracking-wider">Member Details</th>
                      <th className="p-4 uppercase tracking-wider">Email coordinate</th>
                      <th className="p-4 uppercase tracking-wider">Registered Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {allUsers.map((u, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-4 flex items-center gap-3">
                          <img src={u.photoURL} alt="a" className="w-9 h-9 rounded-full object-cover shadow border border-white" />
                          <span className="font-bold text-gray-800">{u.name}</span>
                        </td>
                        <td className="p-4 text-gray-400 font-semibold">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'admin' ? 'bg-red-50 text-red-700 border border-red-100' :
                            u.role === 'delivery' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ADMIN TABS: ACTIVE ORDERS CONTROL */}
          {activeTab === 'orders' && user.role === 'admin' && (
            <div className="space-y-6">
              <div className="border-b border-gray-50 pb-3">
                <h3 className="font-display font-black text-lg text-gray-900">Active Invoices Coordinator</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Admin panel to dispatch pending parcels or inspect logistics delivery dates.</p>
              </div>

              <div className="space-y-4">
                {orders.filter(o => o.status !== 'completed').length === 0 ? (
                  <div className="bg-slate-50 border border-gray-100 p-12 rounded-2xl text-center text-xs text-gray-440">
                    No active/pending orders left. Everything is delivered!
                  </div>
                ) : (
                  orders.filter(o => o.status !== 'completed').map((o) => (
                    <div key={o._id} className="border border-gray-100 rounded-2xl p-5 space-y-4 text-xs">
                      
                      <div className="flex flex-wrap justify-between items-center bg-gray-50 p-3 rounded-xl gap-2 font-bold select-none border border-gray-105">
                        <div>
                          <p className="text-gray-800">Order: <span className="text-[#008D7F] font-black">{o._id}</span></p>
                          <p className="text-[9px] text-gray-400 mt-0.5">Date: {o.date} | Cost: ৳{o.total.toLocaleString()}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider ${
                            o.status === 'onTheWay' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {o.status}
                          </span>
                          
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure? You won't be able to revert this!")) {
                                deleteOrder(o._id);
                                alert('Order record deleted.');
                              }
                            }}
                            className="p-1 text-rose-400 hover:text-rose-600 outline-none"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* address sheet */}
                      <div className="grid grid-cols-2 gap-4 text-left border-b border-gray-50 pb-3 font-semibold text-[11px] text-gray-500">
                        <div>
                          <p className="font-bold text-gray-700">Billing Coordinate</p>
                          <p className="mt-1">{o.name} ({o.phone})</p>
                          <p className="text-[10px] text-gray-400">{o.email}</p>
                        </div>
                        <div>
                          <p className="font-bold text-gray-700">Street Coordinates</p>
                          <p className="mt-1 leading-relaxed text-[10px]">{o.address}</p>
                          {o.notes && <p className="mt-1 italic text-amber-600 block text-[9px]">Notes: {o.notes}</p>}
                        </div>
                      </div>

                      {/* delivery assign drop */}
                      <div className="space-y-3">
                        <p className="font-extrabold text-[#008D7F] uppercase tracking-wider text-[10px]">Logistics Distribution</p>
                        
                        {o.deliveryMan ? (
                          <div className="flex flex-wrap items-center justify-between gap-3 bg-teal-50/50 p-3 rounded-lg border border-teal-100">
                            <div>
                              <p className="font-bold text-gray-700">Assigned Logistics: <span className="text-[#008D7F]">{o.deliveryMan}</span></p>
                              <p className="text-[10px] text-gray-400 mt-0.5">Assigned Target Date: {o.deliveryDate}</p>
                            </div>
                            
                            <button
                              onClick={() => handleMarkDelivered(o._id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 font-extrabold text-[10px] text-white rounded-lg transition active:scale-95"
                            >
                              ✓ Force Delivered
                            </button>
                          </div>
                        ) : (
                          <div>
                            {assigningId === o._id ? (
                              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-gray-400 uppercase">Select delivery boy</label>
                                  <select
                                    value={selectedDelMan}
                                    onChange={(e) => setSelectedDelMan(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-[11px] font-bold"
                                  >
                                    <option value="">-- Choose --</option>
                                    {deliveryMen.map(d => (
                                      <option key={d.email} value={d.name}>{d.name}</option>
                                    ))}
                                  </select>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-gray-400 uppercase">Est Delivery Date</label>
                                  <input
                                    type="date"
                                    value={delDate}
                                    onChange={(e) => setDelDate(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-[11px] font-bold"
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleAssignDelivery(o._id)}
                                    className="flex-1 py-2 bg-[#008D7F] text-white font-bold text-[10px] rounded active:scale-95 transition"
                                  >
                                    Dispatch
                                  </button>
                                  <button
                                    onClick={() => setAssigningId(null)}
                                    className="px-2.5 py-2 bg-gray-200 text-gray-600 font-bold text-[10px] rounded"
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setAssigningId(o._id);
                                  setSelectedDelMan('');
                                  setDelDate('');
                                }}
                                className="px-4 py-2 bg-[#008D7F] hover:bg-[#9c1343] text-white font-bold text-[10px] rounded-lg transition active:scale-95"
                              >
                                🚚 Assign Delivery Log boy & Date
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ADMIN TABS: ORDER COMPLETED */}
          {activeTab === 'completed' && user.role === 'admin' && (
            <div className="space-y-6">
              <div className="border-b border-gray-50 pb-3">
                <h3 className="font-display font-black text-lg text-gray-900">Historic Delivered Transactions</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Logs of orders marked as completed and delivered to customer doorsteps.</p>
              </div>

              <div className="space-y-4">
                {orders.filter(o => o.status === 'completed').length === 0 ? (
                  <div className="bg-slate-50 border border-gray-100 p-12 rounded-2xl text-center text-xs text-gray-450 font-semibold">
                    No historic orders recorded.
                  </div>
                ) : (
                  orders.filter(o => o.status === 'completed').map((o) => (
                    <div key={o._id} className="border border-gray-100 rounded-2xl p-5 space-y-3 text-xs font-semibold text-gray-500">
                      <div className="flex justify-between items-center bg-[#008d7f0e] px-3.5 py-2.5 rounded-xl border border-teal-50 text-[11px]">
                        <div>
                          <p className="font-bold text-gray-800">Order ID: <span className="text-[#008D7F] font-black">{o._id}</span></p>
                          <p className="text-[9px] text-gray-450 mt-0.5">Approved and Delivered: {o.deliveryDate}</p>
                        </div>
                        
                        <span className="text-[10px] font-black text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                          ✓ Completed
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-1">
                        <div>
                          <p className="text-gray-800 font-bold">{o.name}</p>
                          <p className="text-[10px] text-gray-450 mt-0.5">{o.email} | {o.phone}</p>
                        </div>
                        <p className="font-display font-black text-gray-800 text-sm">
                          ৳{o.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ADMIN TABS: ADD PRODUCTS CREATE */}
          {activeTab === 'product-create' && user.role === 'admin' && (
            <div className="space-y-6">
              <div className="border-b border-gray-50 pb-3">
                <h3 className="font-display font-black text-lg text-gray-900">Create New Collection Product</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Introduce beautiful handicraft jewelry sets or cooling fans into our listings instantly.</p>
              </div>

              <form onSubmit={handleProductCreateSubmit} className="space-y-4 max-w-xl text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name / Title *</label>
                  <input
                    type="text"
                    required
                    value={prodTitle}
                    onChange={(e) => setProdTitle(e.target.value)}
                    className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#008D7F] text-gray-800"
                    placeholder="e.g. Traditional oxidised jhumka combo sets, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category Select *</label>
                    <select
                      value={prodCat}
                      onChange={(e) => {
                        setProdCat(e.target.value);
                        setProdSubCat(e.target.value);
                      }}
                      className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#008D7F] text-gray-650"
                    >
                      <option value="Earrings">Earrings</option>
                      <option value="Jewelry Set">Jewelry Set</option>
                      <option value="Kids Jewelry Sets">Kids Jewelry Sets</option>
                      <option value="Mini Fan">Mini Fan</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unit Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={prodQty}
                      onChange={(e) => setProdQty(Number(e.target.value))}
                      className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#008D7F] text-gray-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Price (BDT ৳) *</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#008D7F] text-gray-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Image Banner URL *</label>
                    <input
                      type="text"
                      required
                      value={prodImg}
                      onChange={(e) => setProdImg(e.target.value)}
                      className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#008D7F] text-gray-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Detailed Description Features *</label>
                  <textarea
                    required
                    rows={4}
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="w-full bg-slate-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-xs font-semibold focus:outline-none focus:border-[#008D7F] text-gray-800"
                    placeholder="Provide features like: Hypoallergenic hooks, oxidised silver beaded fringing, rechargeable battery details, etc."
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#008D7F] hover:bg-[#9c1343] text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 pr-8 mt-2"
                >
                  <Plus className="w-4.5 h-4.5" />
                  Save as active product listing
                </button>
              </form>
            </div>
          )}

          {/* DELIVERY TABS: ACTIVE MY ORDER LOGS */}
          {activeTab === 'my-order' && user.role === 'delivery' && (
            <div className="space-y-6">
              <div className="border-b border-gray-50 pb-3">
                <h3 className="font-display font-black text-lg text-gray-900">Active Delivery Workload</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5 font-sans">Active deliveries dispatched or assigned to your cargo account.</p>
              </div>

              <div className="space-y-4">
                {orders.filter(o => o.deliveryMan === user.name && o.status === 'onTheWay').length === 0 ? (
                  <div className="bg-slate-50 border border-gray-100 p-12 rounded-2xl text-center text-xs text-gray-430 select-none">
                    No active assignments given. You have coordinates fully delivered!
                  </div>
                ) : (
                  orders.filter(o => o.deliveryMan === user.name && o.status === 'onTheWay').map((o) => (
                    <div key={o._id} className="border border-gray-100 rounded-2xl p-5 space-y-4 text-xs font-semibold">
                      
                      <div className="flex justify-between items-center bg-blue-50/50 px-3.5 py-2 rounded-xl text-blue-800 border border-blue-100">
                        <div>
                          <p className="font-bold flex items-center gap-1">Order: <span className="font-black">{o._id}</span></p>
                          <p className="text-[9px] text-gray-400 mt-0.5">Assigned Target date: {o.deliveryDate}</p>
                        </div>
                        
                        <span className="text-[10px] font-black bg-blue-100 px-2 py-0.5 rounded uppercase tracking-wider">
                          On The Way
                        </span>
                      </div>

                      {/* address block */}
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-550 border-b border-gray-50 pb-3">
                        <div>
                          <p className="font-bold text-gray-700">Billing details</p>
                          <p className="mt-1">{o.name} ({o.phone})</p>
                        </div>
                        
                        <div>
                          <p className="font-bold text-gray-700">Delivery Address</p>
                          <p className="mt-1 leading-normal text-[10px] text-gray-400 font-bold">{o.address}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 select-none">
                        <p className="text-gray-400">Total cash due: <strong className="text-gray-800 text-sm font-display font-black">৳{o.total.toLocaleString()}</strong></p>
                        
                        <button
                          onClick={() => handleMarkDelivered(o._id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-lg transition"
                        >
                          ✓ Confirm Delivered & Cash Collected
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* DELIVERY TABS: MY COMPLETED HISTORY */}
          {activeTab === 'my-completed' && user.role === 'delivery' && (
            <div className="space-y-6">
              <div className="border-b border-gray-50 pb-3">
                <h3 className="font-display font-black text-lg text-gray-900">Historic Deliveries closed</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Parcels you delivered successfully and marked closed historically.</p>
              </div>

              <div className="space-y-4">
                {orders.filter(o => o.deliveryMan === user.name && o.status === 'completed').length === 0 ? (
                  <div className="bg-slate-50 border border-gray-100 p-12 rounded-2xl text-center text-xs text-gray-430 select-none">
                    No historic closed items reported.
                  </div>
                ) : (
                  orders.filter(o => o.deliveryMan === user.name && o.status === 'completed').map((o) => (
                    <div key={o._id} className="border border-gray-100 rounded-2xl p-5 space-y-3 text-xs font-semibold text-gray-500">
                      
                      <div className="flex justify-between items-center bg-emerald-50 px-3.5 py-2 rounded-xl text-emerald-850 border border-emerald-100 text-[10px]">
                        <div>
                          <p className="font-bold">Order ID: <span className="font-black text-[#008D7F]">{o._id}</span></p>
                          <p className="text-[9px] text-gray-400 mt-0.5">Completed Date: {o.deliveryDate}</p>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded uppercase font-display">
                          Delivered
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-800 font-bold">{o.name}</p>
                          <p className="text-[9px] text-gray-400">{o.email} | {o.phone}</p>
                        </div>
                        
                        <p className="font-display font-black text-gray-800 text-xs">
                          ৳{o.total.toLocaleString()}
                        </p>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

      </section>

    </div>
  );
};
