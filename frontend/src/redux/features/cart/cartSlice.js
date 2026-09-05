import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../../Utils/cartUtils";

const getInitialCartState = () => {
  const cart = localStorage.getItem("cart");
  if (!cart) {
    return { cartItems: [], shippingAddress: {}, paymentMethod: "Mobile Money" };
  }
  try {
    return JSON.parse(cart);
  } catch (e) {
    console.error("Failed to parse cart from localStorage:", e);
    localStorage.removeItem("cart");
    return { cartItems: [], shippingAddress: {}, paymentMethod: "Mobile Money" };
  }
};

const initialState = getInitialCartState();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { user, rating, numReviews, reviews, ...item } = action.payload;
      const existItem = state.cartItems.find(
        (x) => x._id === item._id && (x.variant?._id || null) === (item.variant?._id || null)
      );

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x === existItem ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state, item);
    },

    removeFromCart: (state, action) => {
      const { _id, variantId } = action.payload;
      state.cartItems = state.cartItems.filter(
        (x) => !(x._id === _id && (x.variant?._id || null) === (variantId || null))
      );
      return updateCart(state);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCartItems: (state, action) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },

    resetCart: (state) => (state = initialState),
  },
});

export const {
  addToCart,
  removeFromCart,
  savePaymentMethod,
  saveShippingAddress,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
