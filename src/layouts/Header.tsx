import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { RootState, AppDispatch } from "../store";
import { changeSearchQuery, fetchSearchQuery } from "../store/productsSlice";

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const cartCount = useSelector((state: RootState) => state.cart.items.length);

  const [searchOpen, setSearchOpen] = useState(false);
  const [value, setValue] = useState("");

  const setActiveClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-link menu__item menu__item-active" : "nav-link menu__item";

  const handleOpenSearch = () => {
    setSearchOpen(true);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!value.trim()) {
      setSearchOpen(false);
      return;
    }

    dispatch(changeSearchQuery(value));
    dispatch(fetchSearchQuery(value));
    navigate("/catalog");

    setSearchOpen(false);
    setValue("");
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
                  <form
                    data-id="search-form"
                    className={`form-inline ${!searchOpen ? "d-none" : ""}`}
                    onSubmit={handleOnSubmit}
                    style={{ position: "relative", display: "flex", margin: 0 }}
                  >
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Поиск..."
                      value={value}
                      onChange={handleOnChange}
                      autoFocus={searchOpen}
                      style={{ paddingRight: "40px", borderRadius: "15px" }}
                    />
                    {/* Кнопка-иконка отправляет форму при клике */}
                    <button
                      type="submit"
                      data-id="search-expander"
                      className="header-controls-pic header-controls-search bg-transparent border-0"
                      style={{
                        position: "absolute",
                        right: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        margin: 0,
                      }}
                    />
                  </form>
                  {!searchOpen && (
                    <div
                      data-id="search-expander"
                      className="header-controls-pic header-controls-search"
                      style={{ cursor: "pointer" }}
                      onClick={handleOpenSearch}
                    />
                  )}
                  <div
                    className="header-controls-pic header-controls-cart position-relative"
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
