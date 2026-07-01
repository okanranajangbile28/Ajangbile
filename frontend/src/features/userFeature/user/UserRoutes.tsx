import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../App/hooks";
import { setAdminRoute } from "../../adminFeature/adminSlice";
import { Footer, Navbar, Sidebar } from "../../../components/global_components";
import { fetchBlogs } from "../../blogFeature/blogSlice";
import { fetchProducts } from "../../productFeature/productSlice";
import {
  filterProduct,
  loadProducts,
  sortProduct,
} from "../../filterFeature/filterSlice";

const UserRoutes = () => {
  const dispatch = useAppDispatch();

  const { products } = useAppSelector((state) => state.product);

  const { sort, filters } = useAppSelector((state) => state.filter);

  // Set normal user layout
  useEffect(() => {
    dispatch(setAdminRoute(false));
  }, [dispatch]);

  // Fetch products and blogs once
  useEffect(() => {
    dispatch(fetchBlogs());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Load products into filter state AFTER they arrive
  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      dispatch(loadProducts(products));
    }
  }, [dispatch, products]);

  // Filter and sort AFTER products have been loaded
  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      dispatch(filterProduct());
      dispatch(sortProduct());
    }
  }, [dispatch, products, sort, filters]);

  return (
    <>
      <Navbar />
      <Sidebar />
      <Outlet />
      <Footer />
    </>
  );
};

export default UserRoutes;
