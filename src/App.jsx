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

export default function App() {
  return (
    <Routes>
      {/* Главный родительский роут, который отрисует Header, Footer и Outlet */}
      <Route path="/" element={<MainLayout />}>
        {/* Дочерние роуты, которые будут отображаться на месте <Outlet /> */}
        <Route index element={<HomePage />} />{" "}
        {/* index означает путь "/" по умолчанию */}
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="catalog/:id.html" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
}
