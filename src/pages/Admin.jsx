// src/components/Admin.jsx
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import Loader from '../components/Loader';

// Importing icons for UI enhancements
import { 
  FiSearch, 
  FiFilter, 
  FiChevronDown, 
  FiChevronUp, 
  FiDollarSign, 
  FiPackage, 
  FiUser, 
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiShoppingBag
} from "react-icons/fi";

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersQuery = query(
          collection(db, "orders"),
          orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(ordersQuery);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || null,
        }));
        
        setOrders(ordersData);
        setFilteredOrders(ordersData);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  // Handle filtering and searching
  useEffect(() => {
    let result = orders;
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(term) ||
        order.customer?.name?.toLowerCase().includes(term) ||
        order.customer?.email?.toLowerCase().includes(term) ||
        order.customer?.phone?.includes(term) ||
        order.items?.some(item => item.name.toLowerCase().includes(term))
      ); // Added missing closing parenthesis here
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return "bg-green-100 text-green-800";
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'failed':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <FiCheckCircle className="mr-1" />;
      case 'pending':
        return <FiClock className="mr-1" />;
      case 'failed':
        return <FiXCircle className="mr-1" />;
      default:
        return <FiClock className="mr-1" />;
    }
  };

  if (loading) {
    return <Loader onComplete={() => setLoading(false)} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8 flex flex-col items-center justify-center">
        <div className="bg-red-100 p-4 rounded-full mb-4">
          <FiXCircle className="text-red-600 text-2xl" />
        </div>
        <p className="text-lg text-gray-700 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <FiShoppingBag className="mr-2" />
            Order Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 w-64"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
              <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="bg-black p-2 rounded-full mr-3">
                <FiShoppingBag className="text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-xl font-bold">{orders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="bg-black p-2 rounded-full mr-3">
                <FiDollarSign className="text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-xl font-bold">
                  ₦{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="bg-black p-2 rounded-full mr-3">
                <FiUser className="text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Customers</p>
                <p className="text-xl font-bold">
                  {new Set(orders.map(order => order.customer?.email)).size}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="bg-black p-2 rounded-full mr-3">
                <FiPackage className="text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Products Sold</p>
                <p className="text-xl font-bold">
                  {orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="px-6 py-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    Order ID
                    {sortConfig.key === "id" && (
                      sortConfig.direction === "asc" ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    <FiCalendar className="mr-1" />
                    Date
                    {sortConfig.key === "createdAt" && (
                      sortConfig.direction === "asc" ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FiUser className="mr-1" />
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FiPackage className="mr-1" />
                  Items
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("total")}
                >
                  <div className="flex items-center">
                    <FiDollarSign className="mr-1" />
                    Amount
                    {sortConfig.key === "total" && (
                      sortConfig.direction === "asc" ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center justify-center py-12">
                      <FiPackage className="text-gray-400 text-4xl mb-4" />
                      <p className="text-gray-500">No orders found</p>
                      <p className="text-gray-400 text-sm mt-2">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {order.createdAt?.toLocaleDateString() || "N/A"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {order.createdAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.items?.length} items
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items?.reduce((sum, item) => sum + item.quantity, 0)} units
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₦{order.total?.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => toggleOrderDetails(order.id)}
                          className="text-black hover:text-gray-700"
                        >
                          {expandedOrder === order.id ? (
                            <FiChevronUp className="text-xl" />
                          ) : (
                            <FiChevronDown className="text-xl" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedOrder === order.id && (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Customer Information */}
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h3 className="font-semibold mb-3 flex items-center">
                                <FiUser className="mr-2" />
                                Customer Information
                              </h3>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-xs text-gray-500">Name</p>
                                  <p>{order.customer?.name || 'No name provided'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Email</p>
                                  <p>{order.customer?.email || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Phone</p>
                                  <p>{order.customer?.phone || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Address</p>
                                  <p>{order.customer?.address || 'N/A'}</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Order Summary */}
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h3 className="font-semibold mb-3 flex items-center">
                                <FiDollarSign className="mr-2" />
                                Order Summary
                              </h3>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span>Subtotal</span>
                                  <span>₦{order.total?.toLocaleString() || '0'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Shipping</span>
                                  <span>₦0</span>
                                </div>
                                <div className="flex justify-between font-bold border-t pt-2 mt-2">
                                  <span>Total</span>
                                  <span>₦{order.total?.toLocaleString() || '0'}</span>
                                </div>
                                <div className="mt-4">
                                  <p className="text-xs text-gray-500">Payment Method</p>
                                  <p>Paystack</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Transaction Reference</p>
                                  <p className="truncate">{order.paystackRef || 'N/A'}</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Items */}
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h3 className="font-semibold mb-3 flex items-center">
                                <FiPackage className="mr-2" />
                                Items ({order.items?.length || 0})
                              </h3>
                              <div className="space-y-3 max-h-60 overflow-y-auto">
                                {order.items?.map((item, index) => (
                                  <div key={index} className="flex items-center border-b pb-3 last:border-0">
                                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mr-3" />
                                    <div className="flex-1">
                                      <p className="font-medium">{item.name}</p>
                                      <div className="flex justify-between text-sm mt-1">
                                        <span>₦{item.price?.toLocaleString()} × {item.quantity}</span>
                                        <span className="font-medium">
                                          ₦{(item.price * item.quantity)?.toLocaleString()}
                                        </span>
                                      </div>
                                      {item.color && (
                                        <div className="flex items-center mt-1">
                                          <span className="text-xs text-gray-500 mr-2">Color:</span>
                                          <div 
                                            className="w-4 h-4 rounded-full border border-gray-300" 
                                            style={{ backgroundColor: item.color }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{' '}
            <span className="font-medium">{filteredOrders.length}</span> results
          </p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;