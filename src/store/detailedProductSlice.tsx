import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product, DetailedProduct } from "../types";
import { API_URL } from "../config";

interface DetailedProductState {
  detailedProduct: {
    amount: number;
    loading: boolean;
    error: string | null;
    data: DetailedProduct | null;
  };
}

const initialState: DetailedProductState = {
  detailedProduct: {
    amount: 1,
    loading: false,
    error: null,
    data: null,
  },
};

export const fetchProductById = createAsyncThunk<
  DetailedProduct,
  string,
  { rejectValue: string }
>("detailedProduct/fetchProductById", async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/items/${id}`);

    if (!response.ok) {
      return rejectWithValue("Ошибка сети. Попробуйте позже.");
    }

    const data: DetailedProduct = await response.json();
    return data;
  } catch (e) {
    return rejectWithValue("Что-то пошло не так при запросе данных");
  }
});

const detailedProductSlice = createSlice({
  name: "detailedProduct",
  initialState,
  reducers: {
    increment: (state) => {
      if (state.detailedProduct.amount < 10) {
        state.detailedProduct.amount += 1;
      }
    },
    decrement: (state) => {
      if (state.detailedProduct.amount > 1) {
        state.detailedProduct.amount -= 1;
      }
    },
    resetAmount: (state) => {
      state.detailedProduct.amount = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.detailedProduct.loading = true;
        state.detailedProduct.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailedProduct.loading = false;
        state.detailedProduct.data = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailedProduct.loading = false;
        state.detailedProduct.error =
          (action.payload as string) || "Неизвестная ошибка";
      });
  },
});

export const { increment, decrement, resetAmount } =
  detailedProductSlice.actions;

export default detailedProductSlice.reducer;
