import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice";
import detailedProductReducer from "./detailedProductSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    detailedProduct: detailedProductReducer,
    cart: cartReducer,
  },
});

// 1. Тип для глобального состояния всего Redux-стора
export type RootState = ReturnType<typeof store.getState>;

// 2. Тип для метода dispatch (критически важен для работы с createAsyncThunk)
export type AppDispatch = typeof store.dispatch;
