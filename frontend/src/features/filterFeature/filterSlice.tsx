import { createSlice } from "@reduxjs/toolkit";
import { FilterStatetype, FilterType } from "../../types/filter";
import { SingleProductType } from "../../types/product";

const filterSlice = createSlice({
  name: "filter",

  initialState: {
    filtered_product: [],
    featured_product: [],
    all_products: [],

    grid_view: false,
    sort: "name-a",

    openFilter: false,
    openSearchBar: false,

    filters: {
      text: "",
      category: "all",
      min_price: undefined,
      max_price: undefined,
      price: 0,
      shipping: false,
      collection: "all",
    },

    pagination: {
      currentPage: 1,
      itemsPerPage: 20,
    },
  } as FilterStatetype,

  reducers: {
    loadProducts: (state, action: { payload: SingleProductType[] }) => {
      const products = action.payload ?? [];

      if (products.length === 0) {
        state.all_products = [];
        state.filtered_product = [];
        state.featured_product = [];
        return;
      }

      const prices = products.map((p) => p.price);

      const max = Math.max(...prices);
      const min = Math.min(...prices);

      state.all_products = [...products];
      state.filtered_product = [...products];
      state.featured_product = products.filter((p) => p.featured);

      state.filters = {
        ...state.filters,
        min_price: min,
        max_price: max,
        price: max,
      };
    },

    updatePageChange: (state, action) => {
      state.pagination.currentPage = action.payload;

      const start =
        (state.pagination.currentPage - 1) * state.pagination.itemsPerPage;

      const end = start + state.pagination.itemsPerPage;

      state.filtered_product = state.filtered_product.slice(start, end);
    },

    setGridView: (state) => {
      state.grid_view = true;
    },

    setListView: (state) => {
      state.grid_view = false;
    },

    sortProduct: (state) => {
      const { sort } = state;

      const tempProducts = [...state.filtered_product];

      switch (sort) {
        case "price-lowest":
          tempProducts.sort((a, b) => a.price - b.price);
          break;

        case "price-highest":
          tempProducts.sort((a, b) => b.price - a.price);
          break;

        case "name-a":
          tempProducts.sort((a, b) =>
            a.productName.localeCompare(b.productName),
          );
          break;

        case "name-z":
          tempProducts.sort((a, b) =>
            b.productName.localeCompare(a.productName),
          );
          break;

        default:
          break;
      }

      state.filtered_product = tempProducts;
    },

    updateSort: (state, action: { payload: string }) => {
      state.sort = action.payload;
    },

    filterProduct: (state) => {
      let temp = [...state.all_products];

      const { text, category, price } = state.filters;

      if (text) {
        temp = temp.filter((product) =>
          product.productName.toLowerCase().includes(text.toLowerCase()),
        );
      }

      if (category !== "all") {
        temp = temp.filter(
          (product) =>
            product.category.toLowerCase() === category.toLowerCase(),
        );
      }

      temp = temp.filter((product) => product.price <= price);

      state.filtered_product = temp;
    },

    updateFilters: (state, action) => {
      const {
        name,
        value,
      }: {
        name: keyof FilterType;
        value: string | boolean | number;
      } = action.payload;

      state.filters = {
        ...state.filters,
        [name]: value,
      };
    },

    toggleFilter: (state) => {
      state.openFilter = !state.openFilter;
    },

    clearFilters: (state) => {
      state.filters = {
        text: "",
        category: "all",
        min_price: state.filters.min_price,
        max_price: state.filters.max_price,
        price: state.filters.max_price || 0,
        shipping: false,
        collection: "all",
      };
    },

    openSearchBar: (state) => {
      state.openSearchBar = true;
    },

    closeSearchBar: (state) => {
      state.openSearchBar = false;
    },
  },
});

export const {
  loadProducts,
  setGridView,
  setListView,
  sortProduct,
  updateSort,
  filterProduct,
  updateFilters,
  toggleFilter,
  clearFilters,
  updatePageChange,
  openSearchBar,
  closeSearchBar,
} = filterSlice.actions;

export default filterSlice.reducer;
