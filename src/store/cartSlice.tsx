import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { DetailedProduct } from "../types";
import { API_URL } from "../config";

export interface CartItem {
  item: DetailedProduct;
  amount: number;
  size: string;
  price: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface Order {
  owner: {
    phone: string;
    address: string;
  };
  items: {
    id: number;
    price: number;
    count: number;
  }[];
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  success: false,
};

export const fetchSendOrder = createAsyncThunk<
  void,
  Order,
  { rejectValue: string }
>("cart/fetchSendOrder", async (orderData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      return rejectWithValue("Не удалось оформить заказ. Попробуйте позже.");
    }
  } catch (e) {
    return rejectWithValue("Ошибка сети. Проверьте подключение к серверу.");
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (product) =>
          product.item.id === action.payload.item.id &&
          product.size === action.payload.size,
      );
      if (existingItem) {
        existingItem.amount = Math.min(
          existingItem.amount + action.payload.amount,
          10,
        );
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ id: number; size: string }>,
    ) => {
      state.items = state.items.filter(
        (item) =>
          item.item.id !== action.payload.id ||
          item.size !== action.payload.size,
      );
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    resetCartStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSendOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchSendOrder.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.items = [];
        localStorage.removeItem("cart");
      })
      .addCase(fetchSendOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = (action.payload as string) || "Произошла ошибка";
      });
  },
});

export const { setCartItems, addToCart, removeFromCart, resetCartStatus } =
  cartSlice.actions;

export default cartSlice.reducer;
