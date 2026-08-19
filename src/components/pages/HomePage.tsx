import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import {
  fetchTopSales,
  fetchCategories,
  fetchDefaultProducts,
  fetchLoadMore,
} from "../../store/productsSlice";
import { TopSales } from "../TopSales";
import { Catalog } from "../Catalog";

export const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTopSales());
    dispatch(fetchCategories());
    dispatch(fetchDefaultProducts());
  }, [dispatch]);

  const {
    items: topSalesItems,
    loading: topSalesLoading,
    error: topSalesError,
  } = useSelector((state: RootState) => state.products.topSales);

  const {
    items: categoriesItems,
    activeId,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state: RootState) => state.products.categories);

  const {
    items: productItems,
    loading: productsLoading,
    error: productsError,
    offset,
    hasMore,
  } = useSelector((state: RootState) => state.products.products);

  const hideTopSales =
    !topSalesLoading && !topSalesError && topSalesItems.length === 0;
  const newOffset = offset + 6;

  const handlerLoadMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(fetchLoadMore({ offset: newOffset, categoryId: activeId ?? 0 }));
  };

  return (
    <main className="container">
      <div className="row">
        <div className="col">
          <TopSales />
          <Catalog withSearch={false} />
        </div>
      </div>
    </main>
  );
};
