import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchTopSales } from "../store/productsSlice";
import { ProductItem } from "./Product/Product";

export const TopSales = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: topSalesItems,
    loading: topSalesLoading,
    error: topSalesError,
  } = useSelector((state: RootState) => state.products.topSales);

  useEffect(() => {
    dispatch(fetchTopSales());
  }, [dispatch]);

  const hideTopSales =
    !topSalesLoading && !topSalesError && topSalesItems.length === 0;

  if (hideTopSales) return null;

  return (
    <section className="top-sales">
      <h2 className="text-center">Хиты продаж!</h2>
      {topSalesLoading && (
        <div className="preloader">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
      {topSalesError && (
        <div className="alert alert-danger text-center" role="alert">
          {topSalesError}
        </div>
      )}
      {!topSalesLoading && !topSalesError && (
        <div className="row">
          {topSalesItems.map((item) => (
            <div className="col-4" key={item.id}>
              <ProductItem product={item} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
