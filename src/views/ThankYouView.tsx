import React from 'react';
import { useStore } from '../context/StoreContext';
import { Star, CheckCircle, ArrowRight, LayoutDashboard } from 'lucide-react';

interface ThankYouViewProps {
  navigate: (path: string) => void;
}

export const ThankYouView: React.FC<ThankYouViewProps> = ({ navigate }) => {
  const { orders } = useStore();
  const lastOrderId = localStorage.getItem('eb_last_order_id') || '';
  const order = orders.find(o => o._id === lastOrderId);

  return (
    <div className="py-20 max-w-xl mx-auto space-y-8 text-center">
      
      {/* Check icon */}
      <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto shadow-inner text-emerald-500">
        <CheckCircle className="w-16 h-16" />
      </div>

      <div className="space-y-3">
        <h1 className="font-display font-black text-2xl sm:text-3xl text-gray-900">
          Order Confirmed securely!
        </h1>
        <p className="text-sm text-gray-500 font-semibold max-w-md mx-auto leading-relaxed">
          Thank you for support the cottage artisans. Your cash-on-delivery order has been logged into our queue successfully.
        </p>
      </div>

      {order && (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 text-left space-y-4 shadow-sm">
          <div className="border-b border-gray-50 pb-3 flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Invoice Details</span>
            <span className="text-xs font-black text-[#008D7F]">{order._id}</span>
          </div>
          
          <div className="space-y-2 text-xs font-semibold text-gray-500">
            <div className="flex justify-between">
              <span>Customer Name</span>
              <span className="text-gray-800 font-bold">{order.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Phone</span>
              <span className="text-gray-800 font-bold">{order.phone}</span>
            </div>
            <div className="flex justify-between">
              <span>Street Address</span>
              <span className="text-gray-800 font-bold text-right truncate max-w-xs">{order.address}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Bill (COD)</span>
              <span className="text-[#008D7F] font-black">৳{order.total.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-dashed border-emerald-200">
            <p className="text-[9px] text-emerald-800 leading-relaxed font-bold">
              🚚 Estimation: Standard Uttara logistics boy will reach your given coordinates under 24 to 48 hours for delivery. Keep cash ready.
            </p>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-4 bg-gradient-to-r from-[#008D7F] to-[#017267] text-white hover:opacity-90 rounded-xl font-bold text-xs shadow-md shadow-[#008D7F]/10 flex items-center justify-center gap-1.5 transition"
        >
          <LayoutDashboard className="w-4 h-4" />
          Track Order in Dashboard
        </button>

        <button
          onClick={() => navigate('/')}
          className="px-6 py-4 bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 rounded-xl font-bold text-xs shadow-sm transition"
        >
          Continue Browse
        </button>
      </div>

    </div>
  );
};
