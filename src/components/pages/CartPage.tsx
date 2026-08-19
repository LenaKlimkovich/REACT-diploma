import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { RootState, AppDispatch } from "../../store";
import {
  removeFromCart,
  fetchSendOrder,
  resetCartStatus,
} from "../../store/cartSlice";

export const CartPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart.items);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.amount,
    0,
  );

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phone.trim() || !address.trim() || !agreement) return;

    const orderData = {
      owner: {
        phone: phone.trim(),
        address: address.trim(),
      },
      items: cart.map((item) => ({
        id: item.item.id,
        price: item.price,
        count: item.amount,
      })),
    };

    dispatch(fetchSendOrder(orderData));
  };

  return (
    <>
      <section className="cart">
        <h2 className="text-center">Корзина</h2>

        {/* Сообщение об успешном оформлении заказа */}
        {success && (
          <div className="alert alert-success text-center">
            Ваш заказ успешно оформлен!
          </div>
        )}

        {/* Вывод ошибки от сервера, если она произошла */}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {/* Вывод лоадера Нетологии во время POST-запроса */}
        {loading && (
          <div className="preloader mb-4">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}

        {/* Заглушка, если корзина пуста и заказ не отправлен */}
        {cart.length === 0 && !success && (
          <div className="alert alert-info text-center">Ваша корзина пуста</div>
        )}

        {/* Таблица с товарами: показывается только если корзина не пуста и заказ еще не оформлен */}
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
                    <Link to={`/catalog/${item.item.id}.html`}>
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

      {/* Блок оформления заказа: прячется при пустой корзине или после успешной покупки */}
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
        </section>
      )}
    </>
  );
};
