import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { ProductStateType } from "../../types/product";
import { initialSingleProduct, products_url } from "../../utils/constants";

// ================= Fetch Products =================

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async () => {
    const res = await axios.get(products_url);
    return res.data.data;
  },
);

// ================= Fetch Single Product =================

export const fetchSingleProduct = createAsyncThunk(
  "product/fetchSingleProduct",
  async (id: string) => {
    const res = await axios.get(`${products_url}/${id}`);
    return res.data.data;
  },
);

// ================= Delete Product =================

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id: string) => {
    const token = localStorage.getItem("token");

    await axios.delete(`${products_url}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return id;
  },
);

const initialState: ProductStateType = {
  isSidebarOpen: false,

  products_loading: false,
  products_error: "",

  products: [],
  featured_products: [],

  single_product_loading: false,
  single_product_error: "",

  showModal: false,

  single_product: initialSingleProduct,
};

const productSlice = createSlice({
  name: "product",
  initialState,

  reducers: {
    openSidebar: (state) => {
      state.isSidebarOpen = true;
    },

    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },

    removeProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload,
      );
    },

    openModal: (state) => {
      state.showModal = true;
    },

    closeModal: (state) => {
      state.showModal = false;
    },
  },

  extraReducers: (builder) => {
    // Fetch Products

    builder.addCase(fetchProducts.pending, (state) => {
      state.products_loading = true;
      state.products_error = "";
    });

    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.products_loading = false;
      state.products = action.payload;
      state.products_error = "";
    });

    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.products_loading = false;
      state.products_error = action.error.message || "Failed to fetch products";
    });

    // Fetch Single Product

    builder.addCase(fetchSingleProduct.pending, (state) => {
      state.single_product_loading = true;
      state.single_product_error = "";
      state.single_product = { ...initialSingleProduct };
    });

    builder.addCase(fetchSingleProduct.fulfilled, (state, action) => {
      state.single_product_loading = false;
      state.single_product = action.payload;
      state.single_product_error = "";
    });

    builder.addCase(fetchSingleProduct.rejected, (state, action) => {
      state.single_product_loading = false;
      state.single_product_error =
        action.error.message || "Unable to load product";
    });

    // Delete Product

    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload,
      );
    });
  },
});

export const {
  openSidebar,
  closeSidebar,
  removeProduct,
  openModal,
  closeModal,
} = productSlice.actions;

export default productSlice.reducer;
