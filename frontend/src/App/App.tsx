import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Loading } from "../components/global_components";
import { HomePage, LoginPage, Privacy, TermsAndCondition } from "../pages";

import ComingSoon from "../pages/ComingSoon";

const ThesisPage = lazy(() => import("../pages/About"));
const CartPage = lazy(() => import("../pages/CartPage"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const OrderPage = lazy(() => import("../pages/OrderPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));

const IfaPage = lazy(() => import("../pages/IfaPage"));
const OgboniPage = lazy(() => import("../pages/OgboniPage"));
const ConsultationPage = lazy(() => import("../pages/ConsultationPage"));

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

const AdminBlogForm = lazy(
  () => import("../features/adminFeature/admin/AdminBlog/BlogForm"),
);

const AdminProductForm = lazy(
  () => import("../features/adminFeature/admin/AdminProducts/AdminProductForm"),
);

import UserRoutes from "../features/userFeature/user/UserRoutes";
import { AdminOverview, AdminRoutes } from "../features/adminFeature/admin";

import ScrollToTop from "../components/global_components/ScrollToTop";

const App = () => {
  return (
    <Router>
      <ScrollToTop />

      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<UserRoutes />}>
            <Route path="/" element={<HomePage />} />

            {/* BLOG COMING SOON */}
            <Route
              path="/blog"
              element={
                <ComingSoon
                  title="Blog"
                  message="We're preparing inspiring articles, spiritual teachings, and cultural insights. Please check back soon."
                />
              }
            />

            <Route
              path="/blog/:id"
              element={
                <ComingSoon
                  title="Article"
                  message="This article will be published soon."
                />
              }
            />

            <Route path="/contact" element={<ContactPage />} />

            <Route path="/about" element={<ThesisPage />} />

            <Route path="/ifa" element={<IfaPage />} />

            <Route path="/ogboni" element={<OgboniPage />} />

            <Route path="/consultation" element={<ConsultationPage />} />

            <Route path="/ogboni/signup" element={<OgboniSignupPage />} />

            <Route path="/ogboni-login" element={<OgboniLoginPage />} />

            <Route
              path="/ogboni-forgot-password"
              element={<OgboniForgotPassword />}
            />

            {/* NEW RESET PASSWORD PAGE */}
            <Route
              path="/ogboni-reset-password/:token"
              element={<OgboniResetPassword />}
            />

            <Route path="/ogboni-dashboard" element={<OgboniDashboard />} />

            <Route path="/ogboni-admin" element={<OgboniAdminDashboard />} />

            <Route path="/cart" element={<CartPage />} />

            {/* SHOP COMING SOON */}
            <Route
              path="/shop"
              element={
                <ComingSoon
                  title="Online Shop"
                  message="Our collection of authentic spiritual products is being carefully prepared. The online shop will be available very soon."
                />
              }
            />

            <Route
              path="/shop/:id"
              element={
                <ComingSoon
                  title="Product"
                  message="This product will be available when our online shop launches."
                />
              }
            />

            <Route path="/checkout/:params" element={<CheckoutPage />} />

            <Route path="/order" element={<OrderPage />} />

            <Route path="/terms-of-use" element={<TermsAndCondition />} />

            <Route path="/privacy" element={<Privacy />} />

            <Route
              path="/admin/blog/:id"
              element={<AdminBlogForm type="detail" />}
            />

            <Route
              path="/admin/blog/editor"
              element={<AdminBlogForm type="create" />}
            />

            <Route
              path="/admin/createProduct"
              element={<AdminProductForm type="create" />}
            />

            <Route element={<AdminRoutes />}>
              <Route path="/admin" element={<AdminOverview />} />

              <Route
                path="/admin/product"
                element={
                  <ComingSoon
                    title="Admin Products"
                    message="The new product management system is currently being built."
                  />
                }
              />

              <Route
                path="/admin/blog"
                element={
                  <ComingSoon
                    title="Admin Blog"
                    message="The new blog management system is currently being built."
                  />
                }
              />

              <Route
                path="/admin/product/:id"
                element={<AdminProductForm type="detail" />}
              />
            </Route>

            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
