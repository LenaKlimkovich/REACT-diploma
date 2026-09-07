import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import { RootState, AppDispatch } from "../../store";
import { ReactElement } from "react";
import {
  removeFromCart,
  fetchSendOrder,
  resetCartStatus,
} from "../../store/cartSlice";
import { ErrorAlert } from "../ErrorAlert";

export const CartPage = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart.items);

 const totalPrice = useMemo(() => {
  return cart.reduce((sum, item) => sum + item.price * item.amount, 0);
}, [cart]);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [agreement, setAgreement] = useState(false);

  const { loading, error, success } = useSelector(
    (state: RootState) => state.cart,
  );

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(resetCartStatus());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const orderData = () => ({
    owner: {
      phone: phone.trim(),
      address: address.trim(),
    },
    items: cart.map((item) => ({
      id: item.item.id,
      price: item.price,
      count: item.amount,
    })),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phone.trim() || !address.trim() || !agreement) return;
    dispatch(fetchSendOrder(orderData()));
  };

  const handlerCartReload = () => {
    dispatch(fetchSendOrder(orderData()));
  };

  return (
    <>
      <section className="cart">
        <h2 className="text-center">Корзина</h2>
        {success && (
          <div className="alert alert-success text-center">
            Ваш заказ успешно оформлен!
          </div>
        )}
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {loading && (
          <div className="preloader mb-4">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        {cart.length === 0 && !success && (
          <div className="alert alert-info text-center">Ваша корзина пуста</div>
        )}
        {cart.length !== 0 && !success && (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Название</th>
                <th scope="col">Размер</th>
                <th scope="col">Кол-во</th>
                <th scope="col">Стоимость</th>
                <th scope="col">Итого</th>
                <th scope="col">Действия</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={`${item.item.id}-${item.size}`}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <Link to={`/catalog/${item.item.id}`}>
                      {item.item.title}
                    </Link>
                  </td>
                  <td>{item.size}</td>
                  <td>{item.amount}</td>
                  <td>{item.price.toLocaleString()} руб.</td>
                  <td>{(item.price * item.amount).toLocaleString()} руб.</td>
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      disabled={loading}
                      onClick={() =>
                        dispatch(
                          removeFromCart({ id: item.item.id, size: item.size }),
                        )
                      }
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={5} className="text-right font-weight-bold">
                  Общая стоимость
                </td>
                <td colSpan={2} className="font-weight-bold">
                  {totalPrice.toLocaleString()} руб.
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </section>
      {cart.length > 0 && !success && (
        <section className="order">
          <h2 className="text-center">Оформить заказ</h2>
          <div className="card" style={{ maxWidth: "30rem", margin: "0 auto" }}>
            <form className="card-body" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="phone">Телефон</label>
                <input
                  className="form-control"
                  id="phone"
                  placeholder="Ваш телефон"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Адрес доставки</label>
                <input
                  className="form-control"
                  id="address"
                  placeholder="Адрес доставки"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-group form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="agreement"
                  checked={agreement}
                  onChange={(e) => setAgreement(e.target.checked)}
                  disabled={loading}
                />
                <label className="form-check-label" htmlFor="agreement">
                  Согласен с правилами доставки
                </label>
              </div>
              <button
                type="submit"
                className="btn btn-outline-secondary btn-block"
                disabled={
                  loading || !agreement || !phone.trim() || !address.trim()
                }
              >
                {loading ? "Оформление заказа..." : "Оформить"}
              </button>
            </form>
          </div>
          {error && !loading && (
            <ErrorAlert message={error} onReload={handlerCartReload} />
          )}
        </section>
      )}
    </>
  );
};
