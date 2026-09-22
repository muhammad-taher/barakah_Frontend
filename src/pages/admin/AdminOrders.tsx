import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

export default function AdminOrders() {
  const token = localStorage.getItem('admin_token');
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  
  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ['admin_orders'],
    queryFn: async () => {
      const res = await axios.get('http://127.0.0.1:5000/api/v1/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    }
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      return axios.put(`http://127.0.0.1:5000/api/v1/admin/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin_dashboard'] });
    }
  });

  if (isLoading) return <div className="p-8 text-center">Loading orders...</div>;
  if (isError) {
    const isAuthError = (error as any)?.response?.status === 401;
    return (
      <div className="p-8 text-center text-red-600">
        <h3 className="text-xl font-bold mb-2">Error loading orders</h3>
        <p>{isAuthError ? "Your session has expired. Please log out and log in again." : (error as Error).message}</p>
      </div>
    );
  }

  const filteredOrders = orders?.filter((o: any) => {
    const q = searchQuery.toLowerCase();
    return (
      o.customer_name?.toLowerCase().includes(q) ||
      o.phone?.toLowerCase().includes(q) ||
      o.order_number?.toLowerCase().includes(q)
    );
  });

  const toggleExpand = (id: number) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Order Management</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search name, phone, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-80"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 w-10"></th>
                <th className="p-4 font-semibold text-gray-600">#</th>
                <th className="p-4 font-semibold text-gray-600">Order ID</th>
                <th className="p-4 font-semibold text-gray-600">Customer</th>
                <th className="p-4 font-semibold text-gray-600">Phone</th>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">Total</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders?.map((o: any, index: number) => (
                <React.Fragment key={o.id}>
                  <tr className={`border-b hover:bg-gray-50 cursor-pointer ${expandedOrderId === o.id ? 'bg-blue-50' : ''}`} onClick={() => toggleExpand(o.id)}>
                    <td className="p-4 text-gray-400">
                      {expandedOrderId === o.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </td>
                    <td className="p-4 text-gray-500">{index + 1}</td>
                    <td className="p-4 font-medium">{o.order_number}</td>
                    <td className="p-4">{o.customer_name}</td>
                    <td className="p-4 text-gray-600">{o.phone}</td>
                    <td className="p-4 text-sm text-gray-600">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="p-4 font-semibold">৳ {o.total_amount}</td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${o.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${o.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                        ${o.status === 'Processing' ? 'bg-blue-100 text-blue-800' : ''}
                        ${o.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <select 
                        value={o.status}
                        onChange={(e) => updateStatus.mutate({ id: o.id, status: e.target.value })}
                        className="text-sm border rounded p-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                  
                  {expandedOrderId === o.id && (
                    <tr className="bg-gray-50 border-b">
                      <td colSpan={9} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Customer Details</h4>
                            <p className="text-sm text-gray-600 mb-1"><span className="font-medium text-gray-700">Name:</span> {o.customer_name}</p>
                            <p className="text-sm text-gray-600 mb-1"><span className="font-medium text-gray-700">Phone:</span> {o.phone}</p>
                            <p className="text-sm text-gray-600"><span className="font-medium text-gray-700">Address:</span> {o.address || 'No address provided'}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Order Items</h4>
                            {o.items && o.items.length > 0 ? (
                              <ul className="space-y-2">
                                {o.items.map((item: any, i: number) => (
                                  <li key={i} className="flex justify-between text-sm text-gray-600 border-b border-gray-200 pb-1 last:border-0 last:pb-0">
                                    <span>{item.product_name} x {item.quantity}</span>
                                    <span>৳ {(item.quantity * item.unit_price).toLocaleString()}</span>
                                  </li>
                                ))}
                                <li className="flex justify-between text-sm font-semibold text-gray-800 pt-1">
                                  <span>Total</span>
                                  <span>৳ {o.total_amount?.toLocaleString()}</span>
                                </li>
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-500">No items data available.</p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredOrders?.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500">No orders found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
