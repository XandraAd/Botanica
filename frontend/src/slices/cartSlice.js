import { createSlice } from '@reduxjs/toolkit';

// ----------------------
// Helpers
// ----------------------
const safeParse = (item) => {
  try {
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error('Error parsing cart from localStorage:', error);
    return [];
  }
};

const saveCartToLocalStorage = (cartItems) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// ----------------------
// Slice
// ----------------------
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: safeParse(localStorage.getItem('cart')),
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find(
        (x) => x._id === item._id && x.size === item.size
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.cartItems.push(item);
      }

      saveCartToLocalStorage(state.cartItems);
    },

    removeFromCart: (state, action) => {
      const { _id, size } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => !(item._id === _id && item.size === size)
      );

      saveCartToLocalStorage(state.cartItems);
    },

    updateCartItemQuantity: (state, action) => {
      const { _id, size, quantity } = action.payload;
      const item = state.cartItems.find(
        (item) => item._id === _id && item.size === size
      );

      if (item) {
        item.quantity = quantity;
        saveCartToLocalStorage(state.cartItems);
      }
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cart');
    },
  },
});

// ----------------------
// Exports
// ----------------------
export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
