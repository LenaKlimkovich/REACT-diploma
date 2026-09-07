import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { RootState, AppDispatch } from "../../store";
import { changeSearchQuery } from "../../store/productsSlice";
import styles from "./Header.module.css";

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.amount, 0),
  );

  const [searchOpen, setSearchOpen] = useState(false);
  const [value, setValue] = useState("");

  const setActiveClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-link menu__item menu__item-active" : "nav-link menu__item";

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const executeSearch = () => {
    dispatch(changeSearchQuery(value.trim()));
    navigate("/catalog");
    setSearchOpen(false);
    setValue("");
  };

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) {
      setSearchOpen(false);
      return;
    }
    executeSearch();
  };

  const handleExpanderClick = (e: React.MouseEvent) => {
    if (!searchOpen) {
      e.preventDefault();
      setSearchOpen(true);
    } else if (!value.trim()) {
      e.preventDefault();
      setSearchOpen(false);
    }
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <header className="container bg-light mb-4">
      <div className="row align-items-center">
        <div className="col">
          <nav className="navbar navbar-expand-sm navbar-light">
            <NavLink className="navbar-brand" to="/">
              <img src="/img/header-logo.png" alt="Bosa Noga" />
            </NavLink>
            <div className="collapse navbar-collapse" id="navbarMain">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <NavLink to="/" className={setActiveClass}>
                    Главная
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/catalog" className={setActiveClass}>
                    Каталог
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/about" className={setActiveClass}>
                    О магазине
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/contacts" className={setActiveClass}>
                    Контакты
                  </NavLink>
                </li>
              </ul>
              <div>
                <div className="header-controls-pics d-flex align-items-center">
                  {/* 2. Применяем классы через объект styles */}
                  <div className={styles.searchFormWrap}>
                    <form
                      data-id="search-form"
                      className={`form-inline ${styles.searchForm} ${!searchOpen ? styles.invisibleForm : ""}`}
                      onSubmit={handleOnSubmit}
                    >
                      <input
                        type="search"
                        className={`form-control ${styles.searchInput}`}
                        placeholder="Поиск..."
                        value={value}
                        onChange={handleOnChange}
                        autoFocus={searchOpen}
                      />
                      <button
                        type="submit"
                        data-id="search-expander"
                        className={`header-controls-pic header-controls-search ${styles.searchBtn}`}
                        onClick={handleExpanderClick}
                      />
                    </form>

                    {!searchOpen && (
                      <div
                        className={`header-controls-pic header-controls-search ${styles.searchExpanderStatic}`}
                        onClick={() => setSearchOpen(true)}
                      />
                    )}
                  </div>

                  <div
                    className={`header-controls-pic header-controls-cart position-relative ${styles.cartIcon}`}
                    onClick={handleCartClick}
                    style={{ cursor: "pointer" }}
                  >
                    {cartCount > 0 && (
                      <div className="header-controls-cart-full">
                        {cartCount}
                      </div>
                    )}
                    <div className="header-controls-cart-menu"></div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
        <div className="banner">
          <img
            src="/img/banner.jpg"
            className="img-fluid"
            alt="К весне готовы!"
          />
          <h2 className="banner-header">К весне готовы!</h2>
        </div>
      </div>
    </header>
  );
};
