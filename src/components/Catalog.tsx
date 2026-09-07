import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  fetchTopSales,
  fetchCategories,
  fetchCatalogProducts,
  setActiveCategory,
  fetchLoadMore,
  changeSearchQuery,
} from "../store/productsSlice";
import { ProductItem } from "./Product/Product";
import { ErrorAlert } from "./ErrorAlert";
import { useCallback } from "react";

interface CatalogProps {
  withSearch: boolean;
}

export const Catalog = ({ withSearch = false }: CatalogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const searchQuery = useSelector(
    (state: RootState) => state.products.searchQuery,
  );

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
    loadMoreError,
    offset,
    hasMore,
  } = useSelector((state: RootState) => state.products.products);
  const [localSearch, setLocalSearch] = useState(searchQuery || "");

  useEffect(() => {
    dispatch(fetchTopSales());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchCatalogProducts({ categoryId: activeId, query: searchQuery }),
    );
  }, [dispatch, activeId, searchQuery]);

  useEffect(() => {
    setLocalSearch(searchQuery || "");
  }, [searchQuery]);

const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  const nextValue = e.target.value;
  setLocalSearch(nextValue);

  if (nextValue.trim() === "") {
    dispatch(changeSearchQuery(""));
  }
}, [dispatch]);

  const handleClearSearch = () => {
    setLocalSearch("");
    dispatch(changeSearchQuery(""));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.length === 0) {
      handleClearSearch();
      return;
    }
    dispatch(changeSearchQuery(localSearch));
  };

  const handlerLoadMore = useCallback(() => {
  dispatch(
    fetchLoadMore({ offset, categoryId: activeId, query: searchQuery }),
  );
}, [dispatch, offset, activeId, searchQuery]);

  const handlerReload = () => {
    if (categoriesError) {
      dispatch(fetchTopSales());
      dispatch(fetchCategories());
    }
    dispatch(
      fetchCatalogProducts({ categoryId: activeId, query: searchQuery }),
    );
  };

  return (
    <section className="catalog">
      <h2 className="text-center">Каталог</h2>
      {/* ФОРМА ПОИСКА: рендерится БЕЗ класса invisible, если withSearch={true} */}
      {withSearch && (
        <form
          className="catalog-search-form form-inline"
          onSubmit={handleSearchSubmit}
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
                  }}
                >
                  {category.title}
                </a>
              </li>
            ))}
          </ul>
        )}

      {!categoriesLoading && productItems.length > 0 && (
        <div className="row">
          {productItems.map((item) => (
            <div className="col-12 col-md-6 col-lg-4 mb-4" key={item.id}>
              <ProductItem product={item} />
            </div>
          ))}
        </div>
      )}

      {(categoriesLoading || productsLoading) && (
        <div className="preloader">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
      {hasMore &&
        !productsLoading &&
        productItems.length >= 6 &&
        !loadMoreError && (
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
      {loadMoreError && !productsLoading && (
        <ErrorAlert
          message={
            loadMoreError || "Не удалось загрузить дополнительные товары"
          }
          onReload={handlerLoadMore}
        />
      )}

      {productsError && !productsLoading && productItems.length === 0 && (
        <ErrorAlert
          message={
            productsError || categoriesError || "Произошла неизвестная ошибка"
          }
          onReload={handlerReload}
        />
      )}
    </section>
  );
};
