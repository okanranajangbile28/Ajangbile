import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ProductStateType, SingleProductType } from "../../types/product";
import { initialSingleProduct, products_url } from "../../utils/constants";

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async () => {
    const res = await axios.get(`${products_url}`);
    return res.data.data;
  },
);
export const fetchSingleProduct = createAsyncThunk(
  "product/fetchSingleProduct",
  async (id: string) => {
    const response = await axios.get(`${products_url}/${id}`);
    return response.data.data;
  },
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    isSidebarOpen: false,
    products_loading: false,
    products_error: "",
    products: [],
    featured_products: [],
    single_product_loading: false,
    single_product_error: "",
    showModal: false,

    single_product: initialSingleProduct,
  } as ProductStateType,
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
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.products_loading = true;
        state.products_error = "";
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: { type: string; payload: SingleProductType[] }) => {
          state.products_loading = false;
          state.products = action.payload;
          state.products_error = "";
        },
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        console.error("Fetch Products Error:", action.error);

        state.products_loading = false;
        state.products_error =
          action.error.message || "Failed to fetch products";
      });
    builder.addCase(fetchSingleProduct.pending, (state) => {
      state.single_product_loading = true;
      state.single_product = { ...initialSingleProduct };
      state.single_product_error = "";
    });
    builder.addCase(
      fetchSingleProduct.fulfilled,
      (state, action: { payload: SingleProductType }) => {
        state.single_product_loading = false;
        state.single_product = action.payload;
        state.single_product_error = "";
      },
    );
    builder.addCase(fetchSingleProduct.rejected, (state, action) => {
      state.single_product_loading = false;
      state.single_product_error = action.error.message as string;
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
