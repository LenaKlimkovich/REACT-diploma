import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product, Categories } from "../types";
import { API_URL } from "../config";

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
    loadMoreError: string | null;
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
    loadMoreError: null,
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
    const response = await fetch(`${API_URL}/top-sales`);

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
    const response = await fetch(`${API_URL}/categories`);

    if (!response.ok) {
      return rejectWithValue("Ошибка сети. Попробуйте позже.");
    }

    const data: Categories[] = await response.json();
    return data;
  } catch (e) {
    return rejectWithValue("Что-то пошло не так при запросе данных");
  }
});

export const fetchLoadMore = createAsyncThunk<
  Product[],
  { categoryId?: number | null; query?: string; offset: number },
  { rejectValue: string }
>(
  "products/fetchLoadMore",
  async ({ categoryId, query, offset }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("offset", String(offset));

      if (query && query.trim() !== "") {
        params.append("q", query.trim());
      }
      if (categoryId && categoryId !== 0) {
        params.append("categoryId", String(categoryId));
      }

      const response = await fetch(`${API_URL}/items?${params.toString()}`);
      if (!response.ok) throw new Error();

      return await response.json();
    } catch (e) {
      return rejectWithValue("Не удалось загрузить дополнительные товары");
    }
  },
);

export const fetchCatalogProducts = createAsyncThunk<
  Product[],
  { categoryId?: number | null; query?: string },
  { rejectValue: string }
>(
  "products/fetchCatalogProducts",
  async ({ categoryId, query }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      if (query && query.trim() !== "") {
        params.append("q", query.trim());
      }

      if (categoryId && categoryId !== 0) {
        params.append("categoryId", String(categoryId));
      }

      const queryString = params.toString();
      const url = queryString
        ? `${API_URL}/items?${queryString}`
        : `${API_URL}/items`;

      const response = await fetch(url);

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

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setActiveCategory: (state, action: PayloadAction<number | null>) => {
      state.categories.activeId = action.payload;
      state.products.items = [];
      state.products.offset = 0;
      state.products.hasMore = true;
      state.products.loadMoreError = null;
    },
    changeSearchQuery: (state, action: PayloadAction<string>) => {
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
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.error = null;
        state.categories.items = [{ id: 0, title: "Все" }, ...action.payload];
        state.categories.activeId = 0;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error = action.payload || "Неизвестная ошибка";
      })
      .addCase(fetchCatalogProducts.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
        state.products.loadMoreError = null;
      })
      .addCase(fetchCatalogProducts.fulfilled, (state, action) => {
        state.products.loading = false;
        state.products.items = action.payload;
        state.products.offset = action.payload.length;
        state.products.hasMore = action.payload.length >= 6;
      })
      .addCase(fetchCatalogProducts.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload || "Неизвестная ошибка";
      })
      .addCase(fetchLoadMore.pending, (state) => {
        state.products.loading = true;
        state.products.loadMoreError = null;
      })
      .addCase(fetchLoadMore.fulfilled, (state, action) => {
        state.products.loading = false;
        state.products.items.push(...action.payload);
        state.products.offset += action.payload.length;
        state.products.hasMore = action.payload.length >= 6;
      })
      .addCase(fetchLoadMore.rejected, (state, action) => {
        state.products.loading = false;
        state.products.loadMoreError = action.payload || "Неизвестная ошибка";
      });
  },
});

export const { setActiveCategory, changeSearchQuery } = productsSlice.actions;

export default productsSlice.reducer;
