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
const TourismPage = lazy(() => import("../pages/TourismPage"));
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
// MEMBERSHIP APPLICATION SUCCESS
// ======================================================

const ApplicationSuccess = lazy(() => import("../pages/ApplicationSuccess"));

// ======================================================
// OGBONI MEMBER PAGES
// ======================================================

const OgboniSignupPage = lazy(() => import("../pages/OgboniSignupPage"));

const OgboniLoginPage = lazy(() => import("../pages/OgboniLoginPage"));

const OgboniForgotPassword = lazy(
  () => import("../pages/OgboniForgotPassword"),
);

const OgboniResetPassword = lazy(() => import("../pages/OgboniResetPassword"));

const MemberAccountPending = lazy(
  () => import("../pages/MemberAccountPending"),
);

const OgboniDashboard = lazy(() => import("../pages/OgboniDashboard"));

const OgboniAdminDashboard = lazy(
  () => import("../pages/OgboniAdminDashboard"),
);

const OgboniEditProfile = lazy(() => import("../pages/OgboniEditProfile"));

const MemberProfile = lazy(() => import("../pages/MemberProfile"));

const MemberDirectory = lazy(() => import("../pages/MemberDirectory"));

const HeritageLearning = lazy(() => import("../pages/HeritageLearning"));

const Gallery = lazy(() => import("../pages/Gallery"));

const Notifications = lazy(() => import("../pages/Notifications"));

const MemberSettings = lazy(() => import("../pages/MemberSettings"));

const Announcements = lazy(() => import("../pages/Announcements"));

const WeeklyUpdates = lazy(() => import("../pages/WeeklyUpdates"));

const Events = lazy(() => import("../pages/Events"));

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

              These routes use the normal website layout:
              Navbar + Sidebar + Footer
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

            <Route path="/tourism" element={<TourismPage />} />

            <Route path="/consultation" element={<ConsultationPage />} />

            <Route path="/iledi-ajangbile" element={<IlediAjangbile />} />

            <Route path="/become-member" element={<BecomeMember />} />

            {/* ==================================================
                MEMBER AUTHENTICATION / ENTRY

                These stay inside UserRoutes so that when a
                member logs out, the login page shows the
                normal website Navbar, Sidebar and Footer.
            ================================================== */}

            <Route path="/signup" element={<OgboniSignupPage />} />

            <Route path="/login" element={<OgboniLoginPage />} />

            <Route path="/ogboni-login" element={<OgboniLoginPage />} />

            <Route path="/forgot-password" element={<OgboniForgotPassword />} />

            <Route
              path="/ogboni-reset-password/:token"
              element={<OgboniResetPassword />}
            />

            <Route
              path="/member-account-approval"
              element={<MemberAccountPending />}
            />

            {/* ==================================================
                SHOPPING / CHECKOUT
            ================================================== */}

            <Route path="/cart" element={<CartPage />} />

            <Route path="/checkout" element={<CheckoutPage />} />

            {/* ==================================================
                SHOP BANK TRANSFER PAYMENT

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
                MEMBERSHIP APPLICATION SUCCESS
            ================================================== */}

            <Route
              path="/application-success"
              element={<ApplicationSuccess />}
            />

            {/* ==================================================
                LEGAL
            ================================================== */}

            <Route path="/privacy" element={<Privacy />} />

            <Route path="/terms-of-use" element={<TermsAndCondition />} />
          </Route>

          {/* ==================================================
              OGBONI MEMBER PORTAL

              These routes intentionally stay OUTSIDE
              UserRoutes.

              They therefore do NOT receive the main website:
              - Navbar
              - Sidebar
              - Footer

              MemberPortalLayout controls the entire member
              portal experience.
          ================================================== */}

          <Route path="/ogboni-dashboard" element={<OgboniDashboard />} />

          <Route path="/member-profile" element={<MemberProfile />} />

          <Route path="/ogboni-edit-profile" element={<OgboniEditProfile />} />

          <Route path="/member-directory" element={<MemberDirectory />} />

          <Route path="/heritage-learning" element={<HeritageLearning />} />

          <Route path="/gallery" element={<Gallery />} />

          <Route path="/notifications" element={<Notifications />} />

          <Route path="/member-settings" element={<MemberSettings />} />

          <Route path="/announcements" element={<Announcements />} />

          <Route path="/weekly-updates" element={<WeeklyUpdates />} />

          <Route path="/events" element={<Events />} />

          {/* ==================================================
              OGBONI ADMIN
          ================================================== */}

          <Route path="/ogboni-admin" element={<OgboniAdminDashboard />} />

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
