import "./index.css";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { HomePage } from "./components/pages/HomePage";
import { CatalogPage } from "./components/pages/CatalogPage";
import { AboutPage } from "./components/pages/AboutPage";
import { ContactsPage } from "./components/pages/ContactsPage";
import { ProductPage } from "./components/pages/ProductPage";
import { ErrorPage } from "./components/pages/ErrorPage";
import { CartPage } from "./components/pages/CartPage";
import { setCartItems } from "./store/cartSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { AppDispatch } from "./store";
import { RootState } from "./store";
import { CartItem } from "./store/cartSlice";
import { ReactElement } from "react";

export default function App(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    try {
      const serializedCart = localStorage.getItem("cart");
      if (serializedCart) {
        const parsedCart: CartItem[] = JSON.parse(serializedCart);
        dispatch(setCartItems(parsedCart));
      }
    } catch (e) {
      const error = e instanceof Error ? e.message : "Неизвестная ошибка";
      console.error("Не удалось загрузить корзину из localStorage:", error);
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="catalog/:id" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
}
