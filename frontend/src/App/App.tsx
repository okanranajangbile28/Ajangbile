import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Loading } from "../components/global_components";
import { HomePage, LoginPage, Privacy, TermsAndCondition } from "../pages";

const ThesisPage = lazy(() => import("../pages/About"));
const CartPage = lazy(() => import("../pages/CartPage"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const BlogPage = lazy(() => import("../pages/BlogPage"));
const ProductPage = lazy(() => import("../pages/ProductsPage"));
const SingleProductPage = lazy(() => import("../pages/SingleProductPage"));
const OrderPage = lazy(() => import("../pages/OrderPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const SingleBlog = lazy(() => import("../pages/SingleBlog"));

const IfaPage = lazy(() => import("../pages/IfaPage"));
const OgboniPage = lazy(() => import("../pages/OgboniPage"));
const ConsultationPage = lazy(() => import("../pages/ConsultationPage"));

const OgboniSignupPage = lazy(() => import("../pages/OgboniSignupPage"));

const OgboniLoginPage = lazy(() => import("../pages/OgboniLoginPage"));

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

            <Route path="/blog" element={<BlogPage />} />

            <Route path="/blog/:id" element={<SingleBlog />} />

            <Route path="/contact" element={<ContactPage />} />

            <Route path="/about" element={<ThesisPage />} />

            <Route path="/ifa" element={<IfaPage />} />

            <Route path="/ogboni" element={<OgboniPage />} />

            <Route path="/consultation" element={<ConsultationPage />} />

            <Route path="/ogboni/signup" element={<OgboniSignupPage />} />

            <Route path="/ogboni-login" element={<OgboniLoginPage />} />

            <Route path="/ogboni-dashboard" element={<OgboniDashboard />} />

            {/* NEW ADMIN APPROVAL DASHBOARD */}
            <Route path="/ogboni-admin" element={<OgboniAdminDashboard />} />

            <Route path="/cart" element={<CartPage />} />

            <Route path="/shop" element={<ProductPage />} />

            <Route path="/shop/:id" element={<SingleProductPage />} />

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
                element={<ProductPage admin={true} />}
              />

              <Route path="/admin/blog" element={<BlogPage admin={true} />} />

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
