import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ShoppingCart, Package, DollarSign, Clock, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const token = localStorage.getItem('admin_token');
  
  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ['admin_dashboard'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/v1/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    }
  });

  if (isLoading) return <div className="p-8 text-center">Loading dashboard...</div>;
  if (isError) {
    const isAuthError = (error as any)?.response?.status === 401;
    return (
      <div className="p-8 text-center text-red-600">
        <h3 className="text-xl font-bold mb-2">Error loading dashboard</h3>
        <p>{isAuthError ? "Your session has expired. Please log out and log in again." : (error as Error).message}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="bg-blue-100 p-4 rounded-lg mr-4">
            <DollarSign className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">৳ {stats?.total_revenue}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="bg-green-100 p-4 rounded-lg mr-4">
            <ShoppingCart className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.total_orders}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="bg-purple-100 p-4 rounded-lg mr-4">
            <Package className="text-purple-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.total_products}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="bg-yellow-100 p-4 rounded-lg mr-4">
            <Clock className="text-yellow-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.pending_orders}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="bg-indigo-100 p-4 rounded-lg mr-4">
            <RefreshCw className="text-indigo-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Processing</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.processing_orders}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
