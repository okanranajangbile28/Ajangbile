import { useEffect, useState } from "react";
import axios from "axios";
import {
  Loader2,
  Package,
  RefreshCw,
  Landmark,
  FileImage,
  ExternalLink,
  Clock,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";

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

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  postCode?: number | string;
  country: string;
  countryCode: string;
  shippingFee: number;
  shippingMethod?: string;
}

interface PaymentInfo {
  reference: string;
  gateway: string;
  channel?: string;
  status?: string;
}

interface Order {
  _id: string;

  shippingInfo: ShippingInfo;

  orderItems: OrderItem[];

  paymentInfo: PaymentInfo;

  paidAt?: string;
  createdAt?: string;

  taxPrice: number;
  total_items: number;
  subtotal: number;
  total_amount: number;

  orderStatus: "pending" | "shipped" | "completed" | "failed";

  deliveredAt?: string;

  // ======================================================
  // BANK TRANSFER FIELDS
  // ======================================================

  bankTransferReceipt?: string;

  bankTransferReference?: string;

  bankTransferStatus?: string;

  bankTransferDate?: string;

  bankTransferVerifiedAt?: string;

  bankTransferVerifiedBy?: string;

  additionalInfo?: string;
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================================
  // VERIFYING BANK TRANSFER
  // ======================================================

  const [verifyingOrderId, setVerifyingOrderId] = useState<string | null>(null);

  // ======================================================
  // FETCH ORDERS
  // ======================================================

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

      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Unable to load orders."
          : "Unable to load orders.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ======================================================
  // VERIFY BANK TRANSFER PAYMENT
  // ======================================================

  const verifyBankTransfer = async (orderId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to verify this bank transfer payment?\n\nOnly continue if you have confirmed that the payment has actually been received.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setVerifyingOrderId(orderId);
      setError("");

      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/order/bank-transfer/${orderId}/verify`,
        {},
        {
          withCredentials: true,
        },
      );

      const updatedOrder = response.data?.order;

      // --------------------------------------------------
      // UPDATE THE ORDER ON SCREEN
      // --------------------------------------------------

      setOrders((currentOrders) =>
        currentOrders.map((order) => {
          if (order._id !== orderId) {
            return order;
          }

          return {
            ...order,

            bankTransferStatus: updatedOrder?.bankTransferStatus || "Verified",

            paidAt: updatedOrder?.paidAt || new Date().toISOString(),

            orderStatus: updatedOrder?.orderStatus || "pending",

            paymentInfo: {
              ...order.paymentInfo,
              status: updatedOrder?.paymentStatus || "paid",
            },
          };
        }),
      );

      alert(
        response.data?.message ||
          "Bank transfer payment verified successfully.",
      );
    } catch (err) {
      console.error("Failed to verify bank transfer:", err);

      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ||
          "Unable to verify bank transfer payment."
        : "Unable to verify bank transfer payment.";

      setError(message);

      alert(message);
    } finally {
      setVerifyingOrderId(null);
    }
  };

  // ======================================================
  // CURRENCY
  // ======================================================

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(amount) || 0);
  };

  // ======================================================
  // DATE
  // ======================================================

  const formatDate = (date?: string) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ======================================================
  // ORDER STATUS
  // ======================================================

  const getStatusClasses = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "failed":
        return "bg-red-100 text-red-700";

      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // ======================================================
  // PAYMENT STATUS
  // ======================================================

  const getPaymentStatusClasses = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "completed":
      case "success":
        return "bg-green-100 text-green-700";

      case "failed":
        return "bg-red-100 text-red-700";

      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // ======================================================
  // CHECK BANK TRANSFER
  // ======================================================

  const isBankTransfer = (order: Order) => {
    return (
      order.paymentInfo?.gateway?.toLowerCase() === "bank_transfer" ||
      order.paymentInfo?.channel?.toLowerCase() === "bank_transfer" ||
      Boolean(order.bankTransferReceipt) ||
      Boolean(order.bankTransferReference)
    );
  };

  // ======================================================
  // CHECK VERIFIED
  // ======================================================

  const isBankTransferVerified = (order: Order) => {
    return (
      order.bankTransferStatus?.toLowerCase() === "verified" ||
      order.paymentInfo?.status?.toLowerCase() === "paid"
    );
  };

  // ======================================================
  // LOADING
  // ======================================================

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

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <Package className="text-purple-900" size={32} />

            <h1 className="text-3xl md:text-4xl font-black text-purple-950">
              Orders
            </h1>
          </div>

          <p className="text-gray-500 mt-2">
            View and manage customer orders, Stripe payments, and bank transfer
            payments.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-purple-900 hover:bg-purple-800 text-white px-5 py-3 rounded-xl font-semibold transition disabled:opacity-60"
        >
          <RefreshCw size={18} />
          Refresh Orders
        </button>
      </div>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 mb-6">
          {error}
        </div>
      )}

      {/* ==================================================
          NO ORDERS
      ================================================== */}

      {!error && orders.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Package size={55} className="mx-auto text-gray-300 mb-5" />

          <h2 className="text-2xl font-bold text-gray-800">No orders yet</h2>

          <p className="text-gray-500 mt-2">
            Customer orders will appear here automatically.
          </p>
        </div>
      )}

      {/* ==================================================
          ORDERS
      ================================================== */}

      {orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => {
            const bankTransfer = isBankTransfer(order);
            const verified = isBankTransferVerified(order);
            const verifying = verifyingOrderId === order._id;

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* ==================================================
                    ORDER HEADER
                ================================================== */}

                <div className="p-6 border-b bg-gray-50">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                        Order ID
                      </p>

                      <p className="font-mono text-sm text-gray-700 mt-1 break-all">
                        {order._id}
                      </p>

                      {order.createdAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Created: {formatDate(order.createdAt)}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* ORDER STATUS */}

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${getStatusClasses(
                          order.orderStatus,
                        )}`}
                      >
                        {order.orderStatus}
                      </span>

                      {/* PAYMENT STATUS */}

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${getPaymentStatusClasses(
                          order.paymentInfo?.status,
                        )}`}
                      >
                        Payment: {order.paymentInfo?.status || "unknown"}
                      </span>

                      {/* PAYMENT METHOD */}

                      {bankTransfer ? (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-purple-100 text-purple-800">
                          <Landmark size={16} />
                          Bank Transfer
                        </span>
                      ) : (
                        <span className="px-4 py-2 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                          Stripe / Card
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ==================================================
                    BANK TRANSFER ALERT
                ================================================== */}

                {bankTransfer && (
                  <div
                    className={`p-6 border-b ${
                      verified
                        ? "bg-green-50 border-green-200"
                        : "bg-yellow-50 border-yellow-200"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                      <div className="flex gap-3">
                        {verified ? (
                          <CheckCircle
                            className="text-green-700 shrink-0"
                            size={24}
                          />
                        ) : (
                          <Landmark
                            className="text-yellow-700 shrink-0"
                            size={24}
                          />
                        )}

                        <div>
                          <h3
                            className={`font-black ${
                              verified ? "text-green-900" : "text-yellow-900"
                            }`}
                          >
                            {verified
                              ? "Bank Transfer Payment Verified"
                              : "Bank Transfer Payment"}
                          </h3>

                          <p
                            className={`text-sm mt-1 ${
                              verified ? "text-green-800" : "text-yellow-800"
                            }`}
                          >
                            {verified
                              ? "This payment has been verified and the customer has been notified."
                              : "Verify the payment receipt before processing this order."}
                          </p>
                        </div>
                      </div>

                      {/* VERIFY BUTTON */}

                      {!verified && (
                        <button
                          type="button"
                          onClick={() => verifyBankTransfer(order._id)}
                          disabled={verifying}
                          className="inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl font-bold transition disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {verifying ? (
                            <>
                              <Loader2 size={18} className="animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <ShieldCheck size={18} />
                              Verify Payment
                            </>
                          )}
                        </button>
                      )}

                      {verified && (
                        <span className="inline-flex items-center justify-center gap-2 bg-green-100 text-green-700 px-5 py-3 rounded-xl font-bold whitespace-nowrap">
                          <CheckCircle size={18} />
                          Payment Verified
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* ==================================================
                    CUSTOMER + PAYMENT
                ================================================== */}

                <div className="grid md:grid-cols-2 gap-8 p-6 border-b">
                  {/* CUSTOMER */}

                  <div>
                    <h3 className="font-bold text-purple-950 mb-4">Customer</h3>

                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {order.shippingInfo?.firstName}{" "}
                        {order.shippingInfo?.lastName}
                      </p>

                      <p>
                        <span className="font-semibold">Email:</span>{" "}
                        {order.shippingInfo?.email}
                      </p>

                      <p>
                        <span className="font-semibold">Phone:</span>{" "}
                        {order.shippingInfo?.phoneNumber}
                      </p>

                      <p>
                        <span className="font-semibold">Address:</span>{" "}
                        {order.shippingInfo?.address},{" "}
                        {order.shippingInfo?.city}, {order.shippingInfo?.state},{" "}
                        {order.shippingInfo?.country}
                      </p>

                      {order.shippingInfo?.shippingMethod && (
                        <p>
                          <span className="font-semibold">Shipping:</span>{" "}
                          {order.shippingInfo.shippingMethod}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* PAYMENT */}

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
                        <span className="font-semibold">
                          Payment Reference:
                        </span>{" "}
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

                {/* ==================================================
                    BANK TRANSFER INFORMATION
                ================================================== */}

                {bankTransfer && (
                  <div className="p-6 border-b">
                    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-purple-900 text-white flex items-center justify-center">
                          <Landmark size={22} />
                        </div>

                        <div>
                          <h3 className="font-black text-purple-950 text-xl">
                            Bank Transfer Details
                          </h3>

                          <p className="text-sm text-gray-500">
                            Payment verification information
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        {/* BANK TRANSFER REFERENCE */}

                        <div className="bg-white rounded-xl p-4 border border-purple-100">
                          <p className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                            Bank Transfer Reference
                          </p>

                          <p className="font-mono font-bold text-purple-900 mt-2 break-all">
                            {order.bankTransferReference ||
                              order.paymentInfo?.reference ||
                              "—"}
                          </p>
                        </div>

                        {/* BANK TRANSFER STATUS */}

                        <div className="bg-white rounded-xl p-4 border border-purple-100">
                          <p className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                            Transfer Status
                          </p>

                          <div className="mt-2">
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${
                                verified
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {verified ? (
                                <CheckCircle size={16} />
                              ) : (
                                <Clock size={16} />
                              )}

                              {order.bankTransferStatus || "Pending"}
                            </span>
                          </div>
                        </div>

                        {/* TRANSFER DATE */}

                        <div className="bg-white rounded-xl p-4 border border-purple-100">
                          <p className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                            Transfer Date
                          </p>

                          <p className="font-semibold text-gray-800 mt-2">
                            {formatDate(order.bankTransferDate)}
                          </p>
                        </div>

                        {/* VERIFIED DATE */}

                        {order.bankTransferVerifiedAt && (
                          <div className="bg-white rounded-xl p-4 border border-green-100">
                            <p className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                              Verified Date
                            </p>

                            <p className="font-semibold text-green-700 mt-2">
                              {formatDate(order.bankTransferVerifiedAt)}
                            </p>
                          </div>
                        )}

                        {/* VERIFIED BY */}

                        {order.bankTransferVerifiedBy && (
                          <div className="bg-white rounded-xl p-4 border border-green-100">
                            <p className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                              Verified By
                            </p>

                            <p className="font-semibold text-gray-800 mt-2 break-all">
                              {order.bankTransferVerifiedBy}
                            </p>
                          </div>
                        )}

                        {/* RECEIPT */}

                        <div className="bg-white rounded-xl p-4 border border-purple-100">
                          <p className="text-xs uppercase tracking-wide text-gray-400 font-bold mb-3">
                            Payment Receipt
                          </p>

                          {order.bankTransferReceipt ? (
                            <a
                              href={order.bankTransferReceipt}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-purple-900 hover:bg-purple-800 text-white px-4 py-2.5 rounded-lg font-bold transition"
                            >
                              <FileImage size={18} />
                              View Receipt
                              <ExternalLink size={16} />
                            </a>
                          ) : (
                            <p className="text-red-600 font-semibold">
                              No receipt uploaded
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ==================================================
                    PRODUCTS
                ================================================== */}

                <div className="p-6 border-b">
                  <h3 className="font-bold text-purple-950 mb-5">Products</h3>

                  <div className="space-y-4">
                    {order.orderItems?.map((item, index) => (
                      <div
                        key={`${item.productID}-${index}`}
                        className="flex flex-col sm:flex-row sm:items-center gap-4 border rounded-xl p-4"
                      >
                        {/* IMAGE */}

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

                        {/* DETAILS */}

                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">
                            {item.productName}
                          </h4>

                          <p className="text-sm text-gray-500 mt-1">
                            Product ID: {item.productID}
                          </p>

                          {item.sizes && item.sizes.length > 0 && (
                            <div className="mt-2 text-sm text-gray-600">
                              {item.sizes.map((size, sizeIndex) => (
                                <span
                                  key={`${size.size}-${sizeIndex}`}
                                  className="inline-block mr-3"
                                >
                                  {size.size ? `${size.size}: ` : ""}
                                  {size.quantity}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* PRICE */}

                        <div className="text-right">
                          <p className="font-bold text-purple-900">
                            {formatCurrency(item.price)}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            Unit price
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ==================================================
                    ADDITIONAL INFORMATION
                ================================================== */}

                {order.additionalInfo && (
                  <div className="p-6 border-b">
                    <h3 className="font-bold text-purple-950 mb-3">
                      Customer Additional Information
                    </h3>

                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap">
                      {order.additionalInfo}
                    </div>
                  </div>
                )}

                {/* ==================================================
                    TOTALS
                ================================================== */}

                <div className="p-6">
                  <div className="grid md:grid-cols-3 gap-5">
                    {/* ITEMS */}

                    <div className="bg-gray-50 rounded-xl p-5">
                      <p className="text-sm text-gray-500">Total Items</p>

                      <p className="text-2xl font-black text-purple-950 mt-1">
                        {order.total_items || 0}
                      </p>
                    </div>

                    {/* SUBTOTAL */}

                    <div className="bg-gray-50 rounded-xl p-5">
                      <p className="text-sm text-gray-500">Subtotal</p>

                      <p className="text-2xl font-black text-purple-950 mt-1">
                        {formatCurrency(order.subtotal)}
                      </p>
                    </div>

                    {/* SHIPPING */}

                    <div className="bg-gray-50 rounded-xl p-5">
                      <p className="text-sm text-gray-500">Delivery</p>

                      <p className="text-2xl font-black text-purple-950 mt-1">
                        {formatCurrency(order.shippingInfo?.shippingFee || 0)}
                      </p>
                    </div>
                  </div>

                  {/* FINAL TOTAL */}

                  <div className="mt-5 bg-purple-950 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-purple-200 text-sm">Order Total</p>

                      <p className="text-white font-bold">
                        {bankTransfer ? "Bank Transfer" : "Stripe / Card"}
                      </p>
                    </div>

                    <p className="text-3xl md:text-4xl font-black text-yellow-400">
                      {formatCurrency(order.total_amount)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
