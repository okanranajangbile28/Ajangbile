import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Loading } from "../components/global_components";
import { HomePage, Privacy, TermsAndCondition } from "../pages";

import ComingSoon from "../pages/ComingSoon";
import AdminDashboard from "../pages/AdminDashboard";
import AdminLogin from "../pages/AdminLogin";

import UserRoutes from "../features/userFeature/user/UserRoutes";
import AdminRoutes from "../features/adminFeature/admin/AdminRoutes";

import ScrollToTop from "../components/global_components/ScrollToTop";

// ================= Pages =================

const AboutPage = lazy(() => import("../pages/About"));
const CartPage = lazy(() => import("../pages/CartPage"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const OrderPage = lazy(() => import("../pages/OrderPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));

const IfaPage = lazy(() => import("../pages/IfaPage"));
const OgboniPage = lazy(() => import("../pages/OgboniPage"));
const ConsultationPage = lazy(() => import("../pages/ConsultationPage"));

const IlediAjangbile = lazy(() => import("../pages/IlediAjangbile"));
const BecomeMember = lazy(() => import("../pages/BecomeMember"));

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

// ================= BLOG =================

const BlogPageV2 = lazy(() => import("../pages/BlogPageV2"));

const BlogDetails = lazy(() => import("../pages/BlogDetails"));

// ================= ADMIN =================

const AdminBlogForm = lazy(
  () => import("../features/adminFeature/admin/AdminBlog/BlogForm"),
);

const AdminProductForm = lazy(
  () => import("../features/adminFeature/admin/AdminProducts/AdminProductForm"),
);

const App = () => {
  return (
    <Router>
      <ScrollToTop />

      <Suspense fallback={<Loading />}>
        <Routes>
          {/* ================= PUBLIC + USER ROUTES ================= */}

          <Route element={<UserRoutes />}>
            <Route path="/" element={<HomePage />} />

            {/* Admin Login MUST stay outside AdminRoutes */}
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Blog */}

            <Route path="/blog" element={<BlogPageV2 />} />

            <Route path="/blog/:slug" element={<BlogDetails />} />

            {/* Shop */}

            <Route
              path="/shop"
              element={
                <ComingSoon
                  title="Online Shop"
                  message="Our spiritual products are coming soon."
                />
              }
            />

            <Route
              path="/shop/:id"
              element={
                <ComingSoon
                  title="Product"
                  message="Product page coming soon."
                />
              }
            />

            {/* Main */}

            <Route path="/about" element={<AboutPage />} />

            <Route path="/contact" element={<ContactPage />} />

            <Route path="/ifa" element={<IfaPage />} />

            <Route path="/ogboni" element={<OgboniPage />} />

            <Route path="/iledi-ajangbile" element={<IlediAjangbile />} />

            <Route path="/become-member" element={<BecomeMember />} />

            <Route path="/consultation" element={<ConsultationPage />} />

            {/* Member Authentication */}

            <Route path="/signup" element={<OgboniSignupPage />} />

            <Route path="/ogboni/signup" element={<OgboniSignupPage />} />

            <Route path="/login" element={<OgboniLoginPage />} />

            <Route path="/ogboni-login" element={<OgboniLoginPage />} />

            <Route path="/forgot-password" element={<OgboniForgotPassword />} />

            <Route
              path="/ogboni-forgot-password"
              element={<OgboniForgotPassword />}
            />

            <Route
              path="/reset-password/:token"
              element={<OgboniResetPassword />}
            />

            <Route
              path="/ogboni-reset-password/:token"
              element={<OgboniResetPassword />}
            />

            {/* Member Dashboard */}

            <Route path="/ogboni-dashboard" element={<OgboniDashboard />} />

            <Route
              path="/ogboni-edit-profile"
              element={<OgboniEditProfile />}
            />

            <Route path="/ogboni-admin" element={<OgboniAdminDashboard />} />

            {/* Checkout */}

            <Route path="/cart" element={<CartPage />} />

            <Route path="/checkout/:params" element={<CheckoutPage />} />

            <Route path="/order" element={<OrderPage />} />

            {/* Legal */}

            <Route path="/terms-of-use" element={<TermsAndCondition />} />

            <Route path="/privacy" element={<Privacy />} />
          </Route>

          {/* ================= PROTECTED ADMIN ================= */}

          <Route element={<AdminRoutes />}>
            <Route path="/admin" element={<AdminDashboard />} />

            <Route path="/admin/blog" element={<AdminDashboard />} />

            <Route path="/admin/product" element={<AdminDashboard />} />

            <Route
              path="/admin/blog/editor"
              element={<AdminBlogForm type="create" />}
            />

            <Route
              path="/admin/blog/:id"
              element={<AdminBlogForm type="detail" />}
            />

            <Route
              path="/admin/createProduct"
              element={<AdminProductForm type="create" />}
            />

            <Route
              path="/admin/product/:id"
              element={<AdminProductForm type="detail" />}
            />
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
