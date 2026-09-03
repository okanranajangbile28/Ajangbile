import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Copy,
  FileImage,
  Loader2,
  Upload,
} from "lucide-react";
import axios, { AxiosError } from "axios";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { useAppDispatch, useAppSelector } from "../App/hooks";
import { countCartTotal, clearCart } from "../features/cartFeature/cartSlice";
import { priceFormat } from "../utils/constants";

// ======================================================
// TYPES
// ======================================================

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  postCode?: string;
  country?: string;
  countryCode?: string;
  shippingFee?: number;
  shippingMethod?: string;
  additionalInfo?: string;
}

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  additionalInfo?: string;
}

interface BankTransferOrderResponse {
  status: string;
  message: string;
  order: {
    id: string;
    orderReference: string;
    subtotal: number;
    shippingFee: number;
    totalAmount: number;
    totalItems: number;
    email: string;
  };
}

interface ReceiptUploadResponse {
  success?: boolean;
  receiptUrl?: string;
  url?: string;
  message?: string;
  data?: {
    receiptUrl?: string;
    url?: string;
  };
}

interface ErrorResponse {
  message?: string;
}

// ======================================================
// COMPONENT
// ======================================================

const ShopBankTransferPayment = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { cart, subtotal, total_items, total_amount, shippingInfo } =
    useAppSelector((state) => state.cart);

  // ======================================================
  // SERVER
  // ======================================================

  const SERVER_URL =
    import.meta.env.VITE_SERVER_URL || "https://ajangbile.onrender.com";

  // ======================================================
  // BANK DETAILS
  // ======================================================

  const bankDetails: BankDetails = {
    bankName: "ZENITH BANK",
    accountName: "ARUN-UN-TAN LIMITED",
    accountNumber: "1229796653",
    additionalInfo:
      "Please use your order reference as the transfer narration where possible.",
  };

  // ======================================================
  // SHIPPING FORM
  // ======================================================

  const existingShippingInfo = shippingInfo as ShippingInfo | undefined;

  const [form, setForm] = useState<ShippingInfo>({
    firstName: existingShippingInfo?.firstName || "",
    lastName: existingShippingInfo?.lastName || "",
    email: existingShippingInfo?.email || "",
    phoneNumber: existingShippingInfo?.phoneNumber || "",
    address: existingShippingInfo?.address || "",
    city: existingShippingInfo?.city || "",
    state: existingShippingInfo?.state || "",
    postCode: existingShippingInfo?.postCode
      ? String(existingShippingInfo.postCode)
      : "",
    country: existingShippingInfo?.country || "Nigeria",
    countryCode: existingShippingInfo?.countryCode || "NG",
    shippingFee: Number(existingShippingInfo?.shippingFee || 0),
    shippingMethod: existingShippingInfo?.shippingMethod || "Bank Transfer",
    additionalInfo: existingShippingInfo?.additionalInfo || "",
  });

  // ======================================================
  // PAYMENT STATE
  // ======================================================

  const [copied, setCopied] = useState(false);

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptUrl, setReceiptUrl] = useState("");

  const [transferReference, setTransferReference] = useState("");

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [orderReference, setOrderReference] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ======================================================
  // PAGE SETUP
  // ======================================================

  useEffect(() => {
    document.title = "Ajangbile Heritage | Bank Transfer Payment";

    dispatch(countCartTotal());
  }, [dispatch]);

  // ======================================================
  // PROTECT PAGE FROM EMPTY CART
  // ======================================================

  useEffect(() => {
    if (!cart.length) {
      navigate("/cart", { replace: true });
    }
  }, [cart.length, navigate]);

  // ======================================================
  // HANDLE FORM INPUT
  // ======================================================

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // ======================================================
  // COPY ACCOUNT NUMBER
  // ======================================================

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bankDetails.accountNumber);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (copyError) {
      console.error("Failed to copy account number:", copyError);
    }
  };

  // ======================================================
  // SELECT RECEIPT
  // ======================================================

  const handleReceiptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setMessage("");
    setReceiptUrl("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image receipt.");
      setReceiptFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Receipt image must be smaller than 10MB.");
      setReceiptFile(null);
      return;
    }

    setReceiptFile(file);
  };

  // ======================================================
  // UPLOAD RECEIPT
  // ======================================================

  const handleUploadReceipt = async () => {
    if (!receiptFile) {
      setError("Please select your payment receipt first.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const formData = new FormData();

      formData.append("image", receiptFile);

      const response = await axios.post<ReceiptUploadResponse>(
        `${SERVER_URL}/api/order/bank-transfer/receipt`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );

      const uploadedUrl =
        response.data.receiptUrl ||
        response.data.url ||
        response.data.data?.receiptUrl ||
        response.data.data?.url;

      if (!uploadedUrl) {
        throw new Error(
          "Receipt was uploaded but no receipt URL was returned.",
        );
      }

      setReceiptUrl(uploadedUrl);

      setMessage("Payment receipt uploaded successfully.");
    } catch (err: unknown) {
      console.error("Receipt upload error:", err);

      const axiosError = err as AxiosError<ErrorResponse>;

      setError(
        axiosError.response?.data?.message ||
          (err instanceof Error
            ? err.message
            : "Unable to upload your receipt. Please try again."),
      );

      setReceiptUrl("");
    } finally {
      setUploading(false);
    }
  };

  // ======================================================
  // VALIDATE SHIPPING
  // ======================================================

  const validateShipping = () => {
    if (!form.firstName.trim()) {
      setError("Please enter your first name.");
      return false;
    }

    if (!form.lastName.trim()) {
      setError("Please enter your last name.");
      return false;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return false;
    }

    if (!form.phoneNumber.trim()) {
      setError("Please enter your phone number.");
      return false;
    }

    if (!form.address.trim()) {
      setError("Please enter your delivery address.");
      return false;
    }

    if (!form.city.trim()) {
      setError("Please enter your city.");
      return false;
    }

    if (!form.state.trim()) {
      setError("Please enter your state.");
      return false;
    }

    return true;
  };

  // ======================================================
  // CREATE BANK TRANSFER ORDER
  // ======================================================

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    // ----------------------------------------------------
    // CART
    // ----------------------------------------------------

    const validCart = cart.filter((item) => item.amount > 0);

    if (!validCart.length) {
      setError("Your cart is empty.");
      return;
    }

    // ----------------------------------------------------
    // SHIPPING
    // ----------------------------------------------------

    if (!validateShipping()) {
      return;
    }

    // ----------------------------------------------------
    // RECEIPT
    // ----------------------------------------------------

    if (!receiptUrl) {
      setError("Please upload your payment receipt before submitting.");
      return;
    }

    try {
      setSubmitting(true);

      const finalShippingInfo: ShippingInfo = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        postCode: form.postCode?.trim() || "",
        country: form.country || "Nigeria",
        countryCode: form.countryCode || "NG",
        shippingFee: Number(form.shippingFee || 0),
        shippingMethod: "Bank Transfer",
        additionalInfo: form.additionalInfo?.trim() || "",
      };

      const response = await axios.post<BankTransferOrderResponse>(
        `${SERVER_URL}/api/order/bank-transfer`,
        {
          cart: validCart,

          shippingInfo: finalShippingInfo,

          /*
           * These values are included for compatibility.
           * The backend recalculates the actual product totals
           * from MongoDB.
           */
          subtotal,
          total_items,
          total_amount: total_amount || subtotal,

          bankTransferReceipt: receiptUrl,

          bankTransferReference: transferReference.trim(),
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.status !== "success") {
        throw new Error(
          response.data.message || "Unable to create your order.",
        );
      }

      const createdOrder = response.data.order;

      setOrderReference(createdOrder.orderReference);

      setMessage("Your bank transfer order has been submitted successfully.");

      // ----------------------------------------------------
      // CLEAR CART ONLY AFTER SUCCESSFUL ORDER CREATION
      // ----------------------------------------------------

      dispatch(clearCart());

      // ----------------------------------------------------
      // SUCCESS PAGE
      // ----------------------------------------------------

      setTimeout(() => {
        navigate(
          `/shop-bank-transfer-success?order=${encodeURIComponent(
            createdOrder.orderReference,
          )}`,
        );
      }, 1500);
    } catch (err: unknown) {
      console.error("Bank transfer order error:", err);

      const axiosError = err as AxiosError<ErrorResponse>;

      setError(
        axiosError.response?.data?.message ||
          (err instanceof Error
            ? err.message
            : "Unable to submit your bank transfer order."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // TOTAL
  // ======================================================

  const shippingFee = Number(form.shippingFee || 0);

  const displayTotal = Number((Number(subtotal || 0) + shippingFee).toFixed(2));

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* ==================================================
            BACK
        ================================================== */}

        <button
          type="button"
          onClick={() => navigate("/checkout")}
          className="flex items-center gap-2 text-purple-800 font-semibold mb-6 hover:underline"
        >
          <ArrowLeft size={20} />
          Back to Checkout
        </button>

        {/* ==================================================
            MAIN CARD
        ================================================== */}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="bg-purple-900 text-white text-center px-6 py-10">
            <h1 className="text-3xl md:text-4xl font-black">
              Bank Transfer Payment
            </h1>

            <p className="mt-3 text-purple-100">Ajangbile Heritage Shop</p>

            <p className="text-yellow-300 font-semibold mt-1">
              Secure Bank Transfer
            </p>
          </div>

          <div className="p-6 md:p-10">
            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
              <div className="mb-8 bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
                <p className="font-semibold">{error}</p>
              </div>
            )}

            {/* ==================================================
                SUCCESS
            ================================================== */}

            {message && (
              <div className="mb-8 bg-green-50 border border-green-200 text-green-700 rounded-xl p-5">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle size={20} />
                  {message}
                </div>
              </div>
            )}

            {/* ==================================================
                CUSTOMER SHIPPING INFORMATION
            ================================================== */}

            <div className="mb-10">
              <h2 className="text-2xl font-black text-purple-950 mb-2">
                Delivery Information
              </h2>

              <p className="text-gray-600 mb-6">
                Please provide the information we need to deliver your order.
              </p>

              <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                {/* NAME */}

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      First Name *
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-purple-700"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Last Name *
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-purple-700"
                    />
                  </div>
                </div>

                {/* EMAIL + PHONE */}

                <div className="grid md:grid-cols-2 gap-5 mt-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-purple-700"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Phone Number *
                    </label>

                    <PhoneInput
                      country="ng"
                      value={form.phoneNumber}
                      onChange={(value, country) => {
                        setForm((previous) => ({
                          ...previous,
                          phoneNumber: value,
                          countryCode:
                            typeof country === "object" &&
                            country &&
                            "countryCode" in country
                              ? String(country.countryCode).toUpperCase()
                              : previous.countryCode,
                        }));

                        setError("");
                      }}
                      enableSearch
                      searchPlaceholder="Search country..."
                      countryCodeEditable={false}
                      inputProps={{
                        id: "phoneNumber",
                        name: "phoneNumber",
                        required: true,
                      }}
                      placeholder="Enter your phone number"
                      containerClass="w-full"
                      inputClass="!w-full !h-[50px] !border-gray-300 !rounded-xl !bg-white !text-gray-900 !pl-[48px]"
                      buttonClass="!border-gray-300 !rounded-l-xl !bg-white"
                      dropdownClass="!text-gray-900"
                    />
                  </div>
                </div>

                {/* ADDRESS */}

                <div className="mt-5">
                  <label
                    htmlFor="address"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Delivery Address *
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter your complete delivery address"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-purple-700 resize-none"
                  />
                </div>

                {/* CITY + STATE */}

                <div className="grid md:grid-cols-3 gap-5 mt-5">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      City *
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-purple-700"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      State *
                    </label>

                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-purple-700"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="postCode"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Postcode
                    </label>

                    <input
                      id="postCode"
                      name="postCode"
                      type="text"
                      value={form.postCode}
                      onChange={handleChange}
                      placeholder="Postcode"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-purple-700"
                    />
                  </div>
                </div>

                {/* COUNTRY */}

                <div className="mt-5">
                  <label
                    htmlFor="country"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Country
                  </label>

                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-purple-700"
                  />
                </div>

                {/* ADDITIONAL INFO */}

                <div className="mt-5">
                  <label
                    htmlFor="additionalInfo"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Additional Delivery Information
                  </label>

                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={form.additionalInfo}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Any additional information about your delivery?"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-purple-700 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* ==================================================
                ORDER SUMMARY
            ================================================== */}

            <div className="mb-10">
              <h2 className="text-2xl font-black text-purple-950 mb-5">
                Order Summary
              </h2>

              <div className="border rounded-2xl overflow-hidden">
                {cart.map((item) => (
                  <div
                    key={item.productID}
                    className="flex items-center justify-between gap-4 p-5 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-lg shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                          <span className="text-purple-900 font-bold">
                            {item.productName?.charAt(0)}
                          </span>
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="font-bold text-purple-950 truncate">
                          {item.productName}
                        </h3>

                        <p className="text-gray-500 text-sm">
                          Quantity: {item.amount}
                        </p>
                      </div>
                    </div>

                    <p className="font-bold text-purple-900 shrink-0">
                      {priceFormat(item.price * item.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ==================================================
                TOTAL
            ================================================== */}

            <div className="bg-gray-50 rounded-2xl p-6 mb-10">
              <div className="flex justify-between text-gray-700 mb-3">
                <span>Subtotal</span>

                <span className="font-semibold">{priceFormat(subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-700 mb-3">
                <span>Delivery</span>

                <span className="font-semibold">
                  {shippingFee > 0 ? priceFormat(shippingFee) : "Free"}
                </span>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-xl md:text-2xl font-black">
                <span>Total</span>

                <span className="text-purple-900">
                  {priceFormat(displayTotal)}
                </span>
              </div>
            </div>

            {/* ==================================================
                PAYMENT INSTRUCTIONS
            ================================================== */}

            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-6 mb-10">
              <h2 className="text-xl font-black text-purple-950 mb-3">
                Payment Instructions
              </h2>

              <p className="text-gray-700 leading-7">
                Transfer the exact order amount shown above to the bank account
                below. After completing the transfer, upload a clear screenshot
                or photo of your payment receipt.
              </p>
            </div>

            {/* ==================================================
                BANK DETAILS
            ================================================== */}

            <div className="border rounded-2xl overflow-hidden mb-10">
              <div className="bg-purple-900 text-white px-6 py-4">
                <h2 className="text-xl font-bold">Bank Account Details</h2>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <p className="text-sm text-gray-500">Bank Name</p>

                  <p className="text-lg font-black text-gray-900">
                    {bankDetails.bankName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Account Name</p>

                  <p className="text-lg font-black text-gray-900">
                    {bankDetails.accountName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Account Number</p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-2xl font-black text-purple-900 tracking-wider">
                      {bankDetails.accountNumber}
                    </p>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center justify-center gap-2 bg-purple-100 text-purple-900 px-5 py-3 rounded-lg font-bold hover:bg-purple-200"
                    >
                      {copied ? (
                        <>
                          <CheckCircle size={18} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={18} />
                          Copy Account Number
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {bankDetails.additionalInfo && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">
                      {bankDetails.additionalInfo}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ==================================================
                TRANSFER REFERENCE
            ================================================== */}

            <div className="mb-8">
              <label
                htmlFor="transferReference"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Transfer Reference / Transaction ID
                <span className="font-normal text-gray-500"> (optional)</span>
              </label>

              <input
                id="transferReference"
                type="text"
                value={transferReference}
                onChange={(event) => setTransferReference(event.target.value)}
                placeholder="Enter your bank transfer reference"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-700"
              />
            </div>

            {/* ==================================================
                RECEIPT UPLOAD
            ================================================== */}

            <div className="border-2 border-dashed border-purple-300 rounded-2xl p-6 bg-purple-50 mb-8">
              <div className="text-center">
                <FileImage className="mx-auto text-purple-800 mb-3" size={44} />

                <h2 className="text-xl font-black text-purple-950">
                  Upload Payment Receipt
                </h2>

                <p className="text-gray-600 mt-2">
                  Upload a clear screenshot or photo of your bank transfer
                  receipt.
                </p>

                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG or other image format • Maximum 10MB
                </p>
              </div>

              <div className="mt-6">
                <label className="flex items-center justify-center gap-2 cursor-pointer bg-white border border-purple-300 text-purple-900 font-bold px-5 py-4 rounded-xl hover:bg-purple-100 transition">
                  <Upload size={20} />

                  {receiptFile ? receiptFile.name : "Choose Receipt Image"}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptChange}
                    className="hidden"
                  />
                </label>
              </div>

              {receiptFile && (
                <div className="mt-5 text-center">
                  <p className="text-sm text-gray-600">Selected receipt:</p>

                  <p className="font-semibold text-gray-800 break-all mt-1">
                    {receiptFile.name}
                  </p>

                  {!receiptUrl && (
                    <button
                      type="button"
                      onClick={handleUploadReceipt}
                      disabled={uploading}
                      className="mt-4 inline-flex items-center justify-center gap-2 bg-purple-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-800 disabled:opacity-60"
                    >
                      {uploading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={20} />
                          Upload Receipt
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {receiptUrl && (
                <div className="mt-5 bg-green-100 border border-green-300 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-green-800 font-bold">
                    <CheckCircle size={22} />
                    Receipt Uploaded Successfully
                  </div>

                  <p className="text-sm text-green-700 mt-2">
                    Your receipt is ready to be submitted.
                  </p>
                </div>
              )}
            </div>

            {/* ==================================================
                SUBMIT
            ================================================== */}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!receiptUrl || submitting}
              className="w-full flex items-center justify-center gap-2 bg-purple-900 text-white px-6 py-4 rounded-xl font-black text-lg hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {submitting ? (
                <>
                  <Loader2 size={22} className="animate-spin" />
                  Submitting Order...
                </>
              ) : (
                <>
                  <CheckCircle size={22} />
                  Submit Bank Transfer Payment
                </>
              )}
            </button>

            {!receiptUrl && (
              <p className="text-center text-sm text-gray-500 mt-3">
                Upload your payment receipt before submitting your order.
              </p>
            )}

            {/* ==================================================
                WHAT HAPPENS NEXT
            ================================================== */}

            <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-5">
              <div className="flex gap-3">
                <CheckCircle
                  className="text-green-600 flex-shrink-0"
                  size={24}
                />

                <div>
                  <h3 className="font-bold text-green-800">
                    What Happens Next?
                  </h3>

                  <p className="text-green-800 mt-2 leading-7">
                    Your order will remain pending while our administration
                    verifies your bank transfer. Once your payment is confirmed,
                    your order will be processed for delivery.
                  </p>
                </div>
              </div>
            </div>

            {/* ==================================================
                ORDER REFERENCE
            ================================================== */}

            {orderReference && (
              <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-5 text-center">
                <p className="text-sm text-gray-500">Your Order Reference</p>

                <p className="text-xl font-black text-purple-900 mt-1">
                  {orderReference}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopBankTransferPayment;
