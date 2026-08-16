import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Package, RefreshCw } from "lucide-react";

interface OrderItem {
  productName: string;
  price: number;
  image: string;
  productID: string;
  sizes?: {
    size: string;
    quantity: number;
  }[];
}

interface Order {
  _id: string;

  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    postCode?: number;
    country: string;
    countryCode: string;
    shippingFee: number;
    shippingMethod?: string;
  };

  orderItems: OrderItem[];

  paymentInfo: {
    reference: string;
    gateway: string;
    channel?: string;
    status?: string;
  };

  paidAt?: string;
  createdAt?: string;

  taxPrice: number;
  total_items: number;
  subtotal: number;
  total_amount: number;

  orderStatus: "pending" | "shipped" | "completed" | "failed";

  deliveredAt?: string;
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/order`,
        {
          withCredentials: true,
        },
      );

      const receivedOrders =
        response.data.data?.orders ||
        response.data.orders ||
        response.data.data ||
        [];

      setOrders(Array.isArray(receivedOrders) ? receivedOrders : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-purple-900">
          <Loader2 className="animate-spin" size={28} />
          <span className="font-semibold">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <Package className="text-purple-900" size={32} />

            <h1 className="text-3xl md:text-4xl font-black text-purple-950">
              Orders
            </h1>
          </div>

          <p className="text-gray-500 mt-2">
            View and manage customer orders made through Stripe.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center justify-center gap-2 bg-purple-900 hover:bg-purple-800 text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          <RefreshCw size={18} />
          Refresh Orders
        </button>
      </div>

      {/* Error */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 mb-6">
          {error}
        </div>
      )}

      {/* No Orders */}

      {!error && orders.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Package size={55} className="mx-auto text-gray-300 mb-5" />

          <h2 className="text-2xl font-bold text-gray-800">No orders yet</h2>

          <p className="text-gray-500 mt-2">
            Successful Stripe orders will appear here automatically.
          </p>
        </div>
      )}

      {/* Orders */}

      {orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Order Header */}

              <div className="p-6 border-b bg-gray-50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                      Order ID
                    </p>

                    <p className="font-mono text-sm text-gray-700 mt-1 break-all">
                      {order._id}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${getStatusClasses(
                        order.orderStatus,
                      )}`}
                    >
                      {order.orderStatus}
                    </span>

                    <span className="px-4 py-2 rounded-full text-sm font-bold bg-purple-100 text-purple-700 capitalize">
                      {order.paymentInfo?.status || "unknown"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer + Payment */}

              <div className="grid md:grid-cols-2 gap-8 p-6 border-b">
                <div>
                  <h3 className="font-bold text-purple-950 mb-4">Customer</h3>

                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {order.shippingInfo.firstName}{" "}
                      {order.shippingInfo.lastName}
                    </p>

                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      {order.shippingInfo.email}
                    </p>

                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      {order.shippingInfo.phoneNumber}
                    </p>

                    <p>
                      <span className="font-semibold">Address:</span>{" "}
                      {order.shippingInfo.address}, {order.shippingInfo.city},{" "}
                      {order.shippingInfo.state}, {order.shippingInfo.country}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-purple-950 mb-4">Payment</h3>

                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-semibold">Gateway:</span>{" "}
                      {order.paymentInfo?.gateway || "—"}
                    </p>

                    <p>
                      <span className="font-semibold">Channel:</span>{" "}
                      {order.paymentInfo?.channel || "—"}
                    </p>

                    <p>
                      <span className="font-semibold">Stripe Reference:</span>{" "}
                      <span className="font-mono text-xs break-all">
                        {order.paymentInfo?.reference || "—"}
                      </span>
                    </p>

                    <p>
                      <span className="font-semibold">Paid:</span>{" "}
                      {formatDate(order.paidAt)}
                    </p>

                    <p>
                      <span className="font-semibold">Order Date:</span>{" "}
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Products */}

              <div className="p-6 border-b">
                <h3 className="font-bold text-purple-950 mb-5">Products</h3>

                <div className="space-y-4">
                  {order.orderItems?.map((item, index) => (
                    <div
                      key={`${item.productID}-${index}`}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 border rounded-xl p-4"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center">
                          <Package className="text-gray-400" />
                        </div>
                      )}

                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">
                          {item.productName}
                        </h4>

                        <p className="text-sm text-gray-500 mt-1">
                          Product ID: {item.productID}
                        </p>

                        {item.sizes && item.sizes.length > 0 && (
                          <div className="mt-2 text-sm text-gray-600">
                            {item.sizes.map((size) => (
                              <span key={size.size} className="mr-3">
                                {size.size}: {size.quantity}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-purple-900">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}

              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                  <div className="text-sm text-gray-600">
                    <p>
                      <span className="font-semibold">Items:</span>{" "}
                      {order.total_items}
                    </p>

                    <p className="mt-1">
                      <span className="font-semibold">Subtotal:</span>{" "}
                      {formatCurrency(order.subtotal)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Paid</p>

                    <p className="text-3xl font-black text-purple-950">
                      {formatCurrency(order.total_amount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
