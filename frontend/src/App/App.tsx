import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Loading } from "../components/global_components";
import { HomePage, Privacy, TermsAndCondition } from "../pages";

import AdminDashboard from "../pages/AdminDashboard";
import AdminProductsPage from "../pages/AdminProductsPage";
import AdminLogin from "../pages/AdminLogin";

import UserRoutes from "../features/userFeature/user/UserRoutes";
import AdminRoutes from "../features/adminFeature/admin/AdminRoutes";

import ScrollToTop from "../components/global_components/ScrollToTop";

// ================= Pages =================

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

const AdminBlogForm = lazy(
  () => import("../features/adminFeature/admin/AdminBlog/BlogForm"),
);

const App = () => {
  return (
    <Router>
      <ScrollToTop />

      <Suspense fallback={<Loading />}>
        <Routes>
          {/* PUBLIC */}

          <Route element={<UserRoutes />}>
            <Route path="/" element={<HomePage />} />

            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Blog */}

            <Route path="/blog" element={<BlogPageV2 />} />
            <Route path="/blog/:slug" element={<BlogDetails />} />

            {/* Shop */}

            <Route path="/shop" element={<ProductsPage />} />
            <Route path="/shop/:id" element={<SingleProductPage />} />

            {/* Main */}

            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/ifa" element={<IfaPage />} />
            <Route path="/ogboni" element={<OgboniPage />} />
            <Route path="/consultation" element={<ConsultationPage />} />
            <Route path="/iledi-ajangbile" element={<IlediAjangbile />} />
            <Route path="/become-member" element={<BecomeMember />} />

            {/* Member */}

            <Route path="/signup" element={<OgboniSignupPage />} />
            <Route path="/login" element={<OgboniLoginPage />} />

            <Route path="/forgot-password" element={<OgboniForgotPassword />} />

            <Route path="/payment-success" element={<PaymentSuccess />} />

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

            {/* Cart */}

            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout/:params" element={<CheckoutPage />} />
            <Route path="/order" element={<OrderPage />} />

            {/* Legal */}

            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms-of-use" element={<TermsAndCondition />} />
          </Route>

          {/* ADMIN */}

          <Route element={<AdminRoutes />}>
            <Route path="/admin" element={<AdminDashboard />} />

            <Route path="/admin/products" element={<AdminProductsPage />} />

            <Route
              path="/admin/products/create"
              element={<CreateProductPage />}
            />

            <Route
              path="/admin/products/edit/:id"
              element={<CreateProductPage />}
            />

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

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
