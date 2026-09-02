import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Loading } from "../components/global_components";
import { HomePage, Privacy, TermsAndCondition } from "../pages";

import AdminDashboard from "../pages/AdminDashboard";
import AdminProductsPage from "../pages/AdminProductsPage";
import AdminOrdersPage from "../pages/AdminOrdersPage";
import AdminLogin from "../pages/AdminLogin";

import UserRoutes from "../features/userFeature/user/UserRoutes";
import AdminRoutes from "../features/adminFeature/admin/AdminRoutes";

import ScrollToTop from "../components/global_components/ScrollToTop";

import AdminForgotPassword from "../pages/AdminForgotPassword";
import AdminResetPassword from "../pages/AdminResetPassword";

// ======================================================
// PUBLIC PAGES
// ======================================================

const AboutPage = lazy(() => import("../pages/About"));
const CartPage = lazy(() => import("../pages/CartPage"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const OrderPage = lazy(() => import("../pages/OrderPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));

const ProductsPage = lazy(() => import("../pages/ProductsPage"));
const SingleProductPage = lazy(() => import("../pages/SingleProductPage"));
const CreateProductPage = lazy(() => import("../pages/CreateProductPage"));

const IfaPage = lazy(() => import("../pages/IfaPage"));
const OgboniPage = lazy(() => import("../pages/OgboniPage"));
const ConsultationPage = lazy(() => import("../pages/ConsultationPage"));

const IlediAjangbile = lazy(() => import("../pages/IlediAjangbile"));
const BecomeMember = lazy(() => import("../pages/BecomeMember"));

const PaymentSuccess = lazy(() => import("../pages/PaymentSuccess"));

// ======================================================
// MEMBERSHIP BANK TRANSFER PAYMENT
// ======================================================

const BankTransferPayment = lazy(() => import("../pages/BankTransferPayment"));

const BankTransferSuccess = lazy(() => import("../pages/BankTransferSuccess"));

// ======================================================
// SHOP BANK TRANSFER PAYMENT
// ======================================================

const ShopBankTransferPayment = lazy(
  () => import("../pages/ShopBankTransferPayment"),
);

const ShopBankTransferSuccess = lazy(
  () => import("../pages/ShopBankTransferSuccess"),
);

const ConsultationPaymentSuccess = lazy(
  () => import("../pages/ConsultationPaymentSuccess"),
);

const ApplicationFeeSuccess = lazy(
  () => import("../pages/ApplicationFeeSuccess"),
);

// ======================================================
// OGBONI MEMBER PAGES
// ======================================================

const OgboniSignupPage = lazy(() => import("../pages/OgboniSignupPage"));
const OgboniLoginPage = lazy(() => import("../pages/OgboniLoginPage"));

const OgboniForgotPassword = lazy(
  () => import("../pages/OgboniForgotPassword"),
);

const OgboniResetPassword = lazy(() => import("../pages/OgboniResetPassword"));

const OgboniDashboard = lazy(() => import("../pages/OgboniDashboard"));

const OgboniAdminDashboard = lazy(
  () => import("../pages/OgboniAdminDashboard"),
);

const OgboniEditProfile = lazy(() => import("../pages/OgboniEditProfile"));

// ======================================================
// BLOG
// ======================================================

// Normal Ajangbile Heritage Blog
const BlogPageV2 = lazy(() => import("../pages/BlogPageV2"));

const BlogDetails = lazy(() => import("../pages/BlogDetails"));

// Ogboni Blog
const OgboniBlogDetails = lazy(() => import("../pages/OgboniBlogDetails"));

// Admin Blog
const AdminBlogForm = lazy(
  () => import("../features/adminFeature/admin/AdminBlog/BlogForm"),
);

// ======================================================
// APP
// ======================================================

const App = () => {
  return (
    <Router>
      <ScrollToTop />

      <Suspense fallback={<Loading />}>
        <Routes>
          {/* ==================================================
              PUBLIC / USER ROUTES
          ================================================== */}

          <Route element={<UserRoutes />}>
            {/* ==================================================
                HOME
            ================================================== */}

            <Route path="/" element={<HomePage />} />

            {/* ==================================================
                ADMIN AUTH
            ================================================== */}

            <Route path="/admin-login" element={<AdminLogin />} />

            <Route
              path="/admin-forgot-password"
              element={<AdminForgotPassword />}
            />

            <Route
              path="/admin-reset-password/:token"
              element={<AdminResetPassword />}
            />

            {/* ==================================================
                NORMAL AJANGBILE HERITAGE BLOG
            ================================================== */}

            <Route path="/blog" element={<BlogPageV2 />} />

            <Route path="/blog/:slug" element={<BlogDetails />} />

            {/* ==================================================
                OGBONI BLOG
            ================================================== */}

            <Route path="/ogboni-blog/:slug" element={<OgboniBlogDetails />} />

            {/* ==================================================
                SHOP
            ================================================== */}

            <Route path="/shop" element={<ProductsPage />} />

            <Route path="/shop/:id" element={<SingleProductPage />} />

            {/* ==================================================
                MAIN PAGES
            ================================================== */}

            <Route path="/about" element={<AboutPage />} />

            <Route path="/contact" element={<ContactPage />} />

            <Route path="/ifa" element={<IfaPage />} />

            <Route path="/ogboni" element={<OgboniPage />} />

            <Route path="/consultation" element={<ConsultationPage />} />

            <Route path="/iledi-ajangbile" element={<IlediAjangbile />} />

            <Route path="/become-member" element={<BecomeMember />} />

            {/* ==================================================
                OGBONI MEMBER PORTAL
            ================================================== */}

            <Route path="/signup" element={<OgboniSignupPage />} />

            <Route path="/login" element={<OgboniLoginPage />} />

            <Route path="/forgot-password" element={<OgboniForgotPassword />} />

            <Route
              path="/reset-password/:token"
              element={<OgboniResetPassword />}
            />

            <Route path="/ogboni-dashboard" element={<OgboniDashboard />} />

            <Route
              path="/ogboni-edit-profile"
              element={<OgboniEditProfile />}
            />

            <Route path="/ogboni-admin" element={<OgboniAdminDashboard />} />

            {/* ==================================================
                SHOPPING / CHECKOUT
            ================================================== */}

            <Route path="/cart" element={<CartPage />} />

            <Route path="/checkout" element={<CheckoutPage />} />

            {/* ==================================================
                SHOP BANK TRANSFER PAYMENT
            ==================================================
            
                This is for SHOP ORDERS only.

                Flow:

                Cart
                  ↓
                Checkout
                  ↓
                Pay with Bank Transfer
                  ↓
                ShopBankTransferPayment
                  ↓
                Upload receipt
                  ↓
                Submit order
                  ↓
                /api/order/bank-transfer
                  ↓
                Shop bank transfer success
            ================================================== */}

            <Route
              path="/shop-bank-transfer-payment"
              element={<ShopBankTransferPayment />}
            />

            <Route
              path="/shop-bank-transfer-success"
              element={<ShopBankTransferSuccess />}
            />

            {/* ==================================================
                STRIPE / ORDER SUCCESS
            ================================================== */}

            <Route path="/order-success" element={<OrderPage />} />

            <Route path="/payment-success" element={<PaymentSuccess />} />

            {/* ==================================================
                MEMBERSHIP BANK TRANSFER PAYMENT
            ==================================================
            
                This remains separate from the shop payment.

                Membership flow uses:

                /bank-transfer-payment
            ================================================== */}

            <Route
              path="/bank-transfer-payment"
              element={<BankTransferPayment />}
            />

            <Route
              path="/bank-transfer-success"
              element={<BankTransferSuccess />}
            />

            {/* ==================================================
                CONSULTATION PAYMENT
            ================================================== */}

            <Route
              path="/consultation-payment-success"
              element={<ConsultationPaymentSuccess />}
            />

            {/* ==================================================
                APPLICATION FEE PAYMENT
            ================================================== */}

            <Route
              path="/application-fee-success"
              element={<ApplicationFeeSuccess />}
            />

            {/* ==================================================
                LEGAL
            ================================================== */}

            <Route path="/privacy" element={<Privacy />} />

            <Route path="/terms-of-use" element={<TermsAndCondition />} />
          </Route>

          {/* ==================================================
              ADMIN ROUTES
          ================================================== */}

          <Route element={<AdminRoutes />}>
            {/* ==================================================
                ADMIN DASHBOARD
            ================================================== */}

            <Route path="/admin" element={<AdminDashboard />} />

            {/* ==================================================
                ADMIN PRODUCTS
            ================================================== */}

            <Route path="/admin/products" element={<AdminProductsPage />} />

            <Route
              path="/admin/products/create"
              element={<CreateProductPage />}
            />

            <Route
              path="/admin/products/edit/:id"
              element={<CreateProductPage />}
            />

            {/* ==================================================
                ADMIN ORDERS
            ================================================== */}

            <Route path="/admin/orders" element={<AdminOrdersPage />} />

            {/* ==================================================
                ADMIN BLOG
            ================================================== */}

            <Route path="/admin/blog" element={<AdminDashboard />} />

            <Route
              path="/admin/blog/editor"
              element={<AdminBlogForm type="create" />}
            />

            <Route
              path="/admin/blog/:id"
              element={<AdminBlogForm type="detail" />}
            />
          </Route>

          {/* ==================================================
              404
          ================================================== */}

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
