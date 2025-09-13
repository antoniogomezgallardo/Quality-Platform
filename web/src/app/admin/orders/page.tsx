'use client';

import { useState, useEffect } from 'react';

interface Order {
  id: number;
  userId: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  orderItems: Array<{
    id: number;
    quantity: number;
    price: number;
    product: {
      name: string;
      category: string;
    };
  }>;
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setOrders([
          {
            id: 1,
            userId: 1,
            status: 'PENDING',
            total: 299.99,
            notes: 'Please handle with care',
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
            user: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
            },
            orderItems: [
              {
                id: 1,
                quantity: 1,
                price: 299.99,
                product: {
                  name: 'Premium Wireless Headphones',
                  category: 'Electronics',
                },
              },
            ],
          },
          {
            id: 2,
            userId: 2,
            status: 'CONFIRMED',
            total: 599.98,
            createdAt: '2024-01-16T10:00:00Z',
            updatedAt: '2024-01-16T11:30:00Z',
            user: {
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane.smith@example.com',
            },
            orderItems: [
              {
                id: 2,
                quantity: 1,
                price: 299.99,
                product: {
                  name: 'Premium Wireless Headphones',
                  category: 'Electronics',
                },
              },
              {
                id: 3,
                quantity: 1,
                price: 299.99,
                product: {
                  name: 'Smart Fitness Watch',
                  category: 'Electronics',
                },
              },
            ],
          },
          {
            id: 3,
            userId: 3,
            status: 'DELIVERED',
            total: 399.99,
            createdAt: '2024-01-10T10:00:00Z',
            updatedAt: '2024-01-14T16:00:00Z',
            user: {
              firstName: 'Bob',
              lastName: 'Johnson',
              email: 'bob.johnson@example.com',
            },
            orderItems: [
              {
                id: 4,
                quantity: 1,
                price: 399.99,
                product: {
                  name: 'Professional Coffee Maker',
                  category: 'Kitchen',
                },
              },
            ],
          },
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus as Order['status'], updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchTerm) ||
      order.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Track and manage customer orders</p>
        </div>
        
        {/* Order Stats */}
        <div className="flex space-x-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600">Total Orders</div>
            <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'PENDING').length}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by order ID, customer name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.user.firstName} {order.user.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{order.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.orderItems.slice(0, 2).map(item => item.product.name).join(', ')}
                      {order.orderItems.length > 2 && '...'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusColors[order.status]}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter 
                ? 'Try adjusting your filters or search terms.'
                : 'Orders will appear here as customers place them.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Order #{selectedOrder.id}</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Customer Information</h4>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.user.firstName} {selectedOrder.user.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{selectedOrder.user.email}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Order Items</h4>
                  <div className="mt-2 space-y-2">
                    {selectedOrder.orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                          <p className="text-xs text-gray-500">{item.product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-900">Qty: {item.quantity}</p>
                          <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="font-medium text-gray-900">${selectedOrder.total.toFixed(2)}</span>
                </div>
                
                {selectedOrder.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900">Notes</h4>
                    <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                  </div>
                )}
                
                <div className="text-xs text-gray-500">
                  <p>Created: {formatDate(selectedOrder.createdAt)}</p>
                  <p>Updated: {formatDate(selectedOrder.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}