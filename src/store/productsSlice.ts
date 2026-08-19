import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product, Categories } from "../types";

interface CatalogState {
  topSales: {
    items: Product[];
    loading: boolean;
    error: string | null;
  };
  categories: {
    items: Categories[];
    activeId: number | null; // null или 0 для категории "Все"
    loading: boolean;
    error: string | null;
  };
  products: {
    items: Product[];
    loading: boolean;
    error: string | null;
    offset: number;
    hasMore: boolean;
  };
  searchQuery: string;
}

const initialState: CatalogState = {
  topSales: { items: [], loading: false, error: null },
  categories: { items: [], activeId: null, loading: false, error: null },
  products: {
    items: [],
    loading: false,
    error: null,
    offset: 0,
    hasMore: true,
  },
  searchQuery: "",
};

export const fetchTopSales = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchTopSales", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("http://localhost:7070/api/top-sales");

    if (!response.ok) {
      return rejectWithValue("Ошибка сети. Попробуйте позже.");
    }

    const data: Product[] = await response.json();
    return data;
  } catch (e) {
    return rejectWithValue("Что-то пошло не так при запросе данных");
  }
});

export const fetchCategories = createAsyncThunk<
  Categories[],
  void,
  { rejectValue: string }
>("products/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("http://localhost:7070/api/categories");

    if (!response.ok) {
      return rejectWithValue("Ошибка сети. Попробуйте позже.");
    }

    const data: Categories[] = await response.json();
    return data;
  } catch (e) {
    return rejectWithValue("Что-то пошло не так при запросе данных");
  }
});

export const fetchDefaultProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchDefaultProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("http://localhost:7070/api/items");

    if (!response.ok) {
      return rejectWithValue("Ошибка сети. Попробуйте позже.");
    }

    const data: Product[] = await response.json();
    return data;
  } catch (e) {
    return rejectWithValue("Что-то пошло не так при запросе данных");
  }
});

export const fetchProductsByCategory = createAsyncThunk<
  Product[],
  number,
  { rejectValue: string }
>("products/fetchProductsByCategory", async (X, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `http://localhost:7070/api/items?categoryId=${X}`,
    );

    if (!response.ok) {
      return rejectWithValue("Ошибка сети. Попробуйте позже.");
    }

    const data: Product[] = await response.json();
    return data;
  } catch (e) {
    return rejectWithValue("Что-то пошло не так при запросе данных");
  }
});

export const fetchLoadMore = createAsyncThunk<
  Product[],
  { offset: number; categoryId: number },
  { rejectValue: string }
>(
  "products/fetchLoadMore",
  async ({ offset, categoryId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:7070/api/items?categoryId=${categoryId}&offset=${offset}`,
      );

      if (!response.ok) {
        return rejectWithValue("Ошибка сети. Попробуйте позже.");
      }

      const data: Product[] = await response.json();
      return data;
    } catch (e) {
      return rejectWithValue("Что-то пошло не так при запросе данных");
    }
  },
);

export const fetchSearchQuery = createAsyncThunk<
  Product[],
  string,
  { rejectValue: string }
>("products/fetchSearchQuery", async (query, { rejectWithValue }) => {
  try {
    const response = await fetch(`http://localhost:7070/api/items?q=${query}`);

    if (!response.ok) {
      return rejectWithValue("Ошибка сети. Попробуйте позже.");
    }

    const data: Product[] = await response.json();
    return data;
  } catch (e) {
    return rejectWithValue("Что-то пошло не так при запросе данных");
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setActiveCategory: (state, action) => {
      state.categories.activeId = action.payload;
      state.products.items = [];
      state.products.offset = 0;
      state.products.hasMore = true;
    },
    changeSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopSales.pending, (state) => {
        state.topSales.loading = true;
        state.topSales.error = null;
      })
      .addCase(fetchTopSales.fulfilled, (state, action) => {
        state.topSales.loading = false;
        state.topSales.items = action.payload;
      })
      .addCase(fetchTopSales.rejected, (state, action) => {
        state.topSales.loading = false;
        state.topSales.error = action.payload || "Неизвестная ошибка";
        state.topSales.items = [];
      })
      .addCase(fetchCategories.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = null;
        state.categories.items = [];
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.items = [{ id: 0, title: "Все" }, ...action.payload];

        if (state.categories.activeId === null) {
          state.categories.activeId = 0;
        }
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error = action.payload || "Неизвестная ошибка";
        state.categories.items = [];
      })
      .addCase(fetchDefaultProducts.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(fetchDefaultProducts.fulfilled, (state, action) => {
        state.products.loading = false;
        state.products.items = action.payload;
        state.products.offset = action.payload.length;
      })
      .addCase(fetchDefaultProducts.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload || "Неизвестная ошибка";
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.products.loading = false;
        state.products.items = action.payload;
        state.products.offset = action.payload.length;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload || "Неизвестная ошибка";
      })
      .addCase(fetchLoadMore.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(fetchLoadMore.fulfilled, (state, action) => {
        state.products.loading = false;
        state.products.items.push(...action.payload);
        state.products.offset += action.payload.length;
        if (action.payload.length < 6) {
          state.products.hasMore = false;
        }
      })
      .addCase(fetchLoadMore.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload || "Неизвестная ошибка";
      })
      .addCase(fetchSearchQuery.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(fetchSearchQuery.fulfilled, (state, action) => {
        state.products.loading = false;
        state.products.items = action.payload;
        state.products.offset = action.payload.length;
        state.products.hasMore = action.payload.length >= 6;
      })
      .addCase(fetchSearchQuery.rejected, (state, action) => {
        state.products.loading = false;
        if (typeof action.payload === "string") {
          state.products.error = action.payload;
        } else {
          state.products.error = action.error.message || "Неизвестная ошибка";
        }
      });
  },
});

export const { setActiveCategory, changeSearchQuery } = productsSlice.actions;

export default productsSlice.reducer;
