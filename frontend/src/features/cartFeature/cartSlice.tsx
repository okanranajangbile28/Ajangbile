import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CartItemType, CartStateType } from "../../types/cart";
import { SingleProductType } from "../../types/product";
import { toast } from "react-toastify";

export const handlePayStack = createAsyncThunk(
  "cart/handlePayStack",
  async ({
    shippingInfo,
    cart,
    total_amount,
    subtotal,
    total_items,
  }: Pick<
    CartStateType,
    "shippingInfo" | "cart" | "total_amount" | "total_items" | "subtotal"
  >) => {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/order/paystack/checkout-session`,
      {
        shippingInfo: { ...shippingInfo },
        orderItems: cart,
        total_amount,
        subtotal,
        total_items,
      },
      {
        withCredentials: true,
      },
    );

    return response.data.data;
  },
);

export const handleStripe = createAsyncThunk(
  "cart/handleStripe",
  async ({ cart }: { cart: CartItemType[] }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/order/stripe-checkout`,
      {
        orderItems: cart,
      },
      {
        withCredentials: true,
      },
    );

    return response.data.session;
  },
);

const shippingInfoJSON = JSON.stringify({
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  country: "",
  countryCode: "",
  phoneNumber: "",
  postCode: "",
  email: "",
  shippingMethod: "",
  shippingFee: 0,
  additionalInfo: "",
});

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    cart: JSON.parse(localStorage.getItem("cart") || "[]"),
    loading: true,
    handle_stripe_error: "",
    handle_paystack_error: "",
    checkout_loading: false,
    total_items: 0,
    subtotal: 0,
    total_amount: 0,
    create_order_error: "",
    shippingInfo: JSON.parse(
      localStorage.getItem("shipping") || shippingInfoJSON,
    ),
  } as CartStateType,

  reducers: {
    addToCart: (
      state,
      action: {
        type: string;
        payload: {
          id: string;
          amount: number;
          product: SingleProductType;
        };
      },
    ) => {
      const { id, amount, product } = action.payload;

      const tempItem = state.cart.find((item) => item.productID === id);

      if (tempItem) {
        state.cart = state.cart.map((cartItem) => {
          if (cartItem.productID === id) {
            return {
              ...cartItem,
              amount: cartItem.amount + Number(amount),
            };
          }

          return cartItem;
        });
      } else {
        state.cart.push({
          productName: product.productName,
          amount: Number(amount),
          image: product.images[0],
          price: product.price,
          max: product.totalQuantity,
          productID: id,
        });
      }

      toast.success("Added to cart successfully");
    },

    removeItem: (state, action) => {
      state.cart = state.cart.filter(
        (item) => item.productID !== action.payload.productID,
      );
    },

    toggleAmount: (state, action) => {
      state.cart = state.cart.filter(
        (item) => item.productID !== action.payload.id,
      );
    },

    setAmount: (state, action) => {
      state.cart = state.cart.map((item) =>
        item.productID === action.payload.id
          ? { ...item, amount: action.payload.value }
          : item,
      );
    },

    clearCart: (state) => {
      state.cart = [];
      localStorage.removeItem("cart");
    },

    countCartTotal: (state) => {
      const totals = state.cart.reduce(
        (total, cartItem) => {
          total.total_items += Number(cartItem.amount);
          total.subtotal += cartItem.price * cartItem.amount;

          return total;
        },
        {
          total_items: 0,
          subtotal: 0,
        },
      );

      state.total_items = totals.total_items;
      state.subtotal = totals.subtotal;
      state.loading = false;
    },

    updateShipping: (state, action) => {
      const { detail, info } = action.payload;

      state.shippingInfo = {
        ...state.shippingInfo,
        [detail]: info,
      };
    },

    createShipping: (state, action) => {
      state.shippingInfo = {
        ...state.shippingInfo,
        ...action.payload,
      };
    },

    clearShipping: (state) => {
      localStorage.removeItem("shippingInfo");

      state.shippingInfo = JSON.parse(shippingInfoJSON);
    },

    updateCartTotal: (state) => {
      state.total_amount =
        state.subtotal + (state.shippingInfo.shippingFee || 0);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(handlePayStack.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(handlePayStack.fulfilled, (state, action) => {
      state.loading = false;
      state.handle_paystack_error = "";

      try {
        window.location.replace(action.payload);
      } catch {
        window.location.href = action.payload;
      }
    });

    builder.addCase(handlePayStack.rejected, (state, action) => {
      state.loading = false;
      state.handle_paystack_error = action.error.message as string;
    });

    builder.addCase(handleStripe.pending, (state) => {
      state.checkout_loading = true;
    });

    builder.addCase(handleStripe.fulfilled, (state, action) => {
      state.checkout_loading = false;
      state.handle_stripe_error = "";

      try {
        window.location.replace(action.payload);
      } catch {
        window.location.href = action.payload;
      }
    });

    builder.addCase(handleStripe.rejected, (state, action) => {
      state.checkout_loading = false;
      state.handle_stripe_error = action.error.message as string;
    });
  },
});

export const {
  addToCart,
  removeItem,
  toggleAmount,
  setAmount,
  clearCart,
  createShipping,
  updateCartTotal,
  countCartTotal,
  updateShipping,
  clearShipping,
} = cartSlice.actions;

export default cartSlice.reducer;
