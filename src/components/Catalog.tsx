import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  fetchTopSales,
  fetchCategories,
  setActiveCategory,
  fetchDefaultProducts,
  fetchProductsByCategory,
  fetchLoadMore,
  changeSearchQuery,
  fetchSearchQuery,
} from "../store/productsSlice";
import { ProductItem } from "./Product";

interface CatalogProps {
  withSearch: boolean;
}
export const Catalog = ({ withSearch = false }: CatalogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const searchQuery = useSelector(
    (state: RootState) => state.products.searchQuery,
  );
  const [localSearch, setLocalSearch] = useState(searchQuery || "");

  useEffect(() => {
    dispatch(fetchTopSales());
    dispatch(fetchCategories());
    if (searchQuery) {
      dispatch(fetchSearchQuery(searchQuery));
    } else {
      dispatch(fetchDefaultProducts());
    }
  }, [dispatch]);

  useEffect(() => {
    setLocalSearch(searchQuery || "");
  }, [searchQuery]);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    setLocalSearch(nextValue);

    if (nextValue.trim() === "") {
      dispatch(changeSearchQuery(""));
      dispatch(fetchDefaultProducts());
    }
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    dispatch(changeSearchQuery(""));
    dispatch(fetchDefaultProducts());
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (localSearch.length === 0) {
      handleClearSearch();
      return;
    }
    dispatch(changeSearchQuery(localSearch));
    dispatch(fetchSearchQuery(localSearch));
  };

  const handlerLoadMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(fetchLoadMore({ offset, categoryId: activeId ?? 0 }));
  };

  return (
    <section className="catalog">
      <h2 className="text-center">Каталог</h2>
      {/* ФОРМА ПОИСКА: рендерится БЕЗ класса invisible, если withSearch={true} */}
      {withSearch && (
        <form
          className="catalog-search-form form-inline"
          onSubmit={handleSearchSubmit}
          style={{ position: "relative", display: "flex", margin: 0 }}
        >
          <input
            type="search"
            className="form-control"
            placeholder="Поиск"
            value={localSearch}
            style={{ paddingRight: "0px" }}
            onChange={handleSearchChange}
          />
        </form>
      )}
      {!categoriesLoading &&
        productItems.length === 0 &&
        localSearch !== "" && (
          <div style={{ margin: "25px" }}> Товары не найдены</div>
        )}

      {!categoriesLoading &&
        !categoriesError &&
        categoriesItems.length > 0 &&
        productItems.length !== 0 && (
          <ul className="catalog-categories nav justify-content-center">
            {categoriesItems.map((category) => (
              <li className="nav-item" key={category.id}>
                <a
                  className={`nav-link ${category.id === activeId ? "active" : ""}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setActiveCategory(category.id));
                    dispatch(fetchProductsByCategory(category.id));
                  }}
                >
                  {category.title}
                </a>
              </li>
            ))}
          </ul>
        )}

      {!categoriesLoading && !productsError && productItems.length > 0 && (
        <div className="row">
          {productItems.map((item) => (
            <div className="col-12 col-md-6 col-lg-4 mb-4" key={item.id}>
              <ProductItem product={item} />
            </div>
          ))}
        </div>
      )}

      {categoriesLoading && (
        <div className="preloader">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
      {productsLoading && (
        <div className="preloader">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
      {hasMore && !productsLoading && (
        <div className="text-center">
          <button
            className="btn btn-outline-primary"
            onClick={handlerLoadMore}
            disabled={productsLoading}
          >
            Загрузить ещё
          </button>
        </div>
      )}
    </section>
  );
};
