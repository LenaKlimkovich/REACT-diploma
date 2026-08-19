import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RootState, AppDispatch } from "../../store";
import {
  fetchProductById,
  increment,
  decrement,
  resetAmount,
} from "../../store/detailedProductSlice";
import { addToCart } from "../../store/cartSlice";
import { useNavigate } from "react-router-dom";

export const ProductPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(resetAmount());
  }, [dispatch, id]);

  const { amount, data, loading, error } = useSelector(
    (state: RootState) => state.detailedProduct.detailedProduct,
  );

  if (loading) {
    return (
      <div className="text-center my-5">Загрузка информации о товаре...</div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center my-5">{error}</div>;
  }

  if (!data) {
    return (
      <div className="text-center my-5">
        Данные о товаре еще не загружены...
      </div>
    );
  }

  const handleToCart = () => {
    navigate("/cart");
    dispatch(
      addToCart({
        item: data,
        amount: amount,
        size: selectedSize,
        price: data.price,
      }),
    );
  };

  const availableSizes = data.sizes.filter((size) => size.available) || [];

  return (
<>
      <section className="catalog-item">
        <h2 className="text-center">{data.title}</h2>
        <div className="row">
          <div className="col-5">
            <img src={data.images[0]} className="img-fluid" alt={data.title} />
          </div>
          <div className="col-7">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>Артикул</td>
                  <td>{data.sku}</td>
                </tr>
                <tr>
                  <td>Производитель</td>
                  <td>{data.manufacturer}</td>
                </tr>
                <tr>
                  <td>Цвет</td>
                  <td>{data.color}</td>
                </tr>
                <tr>
                  <td>Материалы</td>
                  <td>{data.material}</td>
                </tr>
                <tr>
                  <td>Сезон</td>
                  <td>{data.season}</td>
                </tr>
                <tr>
                  <td>Повод</td>
                  <td>{data.reason}</td>
                </tr>
              </tbody>
            </table>
            <div className="text-center">
              {availableSizes.length === 0 && (
                <span className="alert alert-warning text-center">
                  Нет доступных размеров
                </span>
              )}
              {availableSizes.length > 0 && (
                <>
                  <p>
                    Размеры в наличии:{" "}
                    {availableSizes.map((item) => {
                      const isSelected = item.size === selectedSize;
                      return (
                        <span
                          key={item.size}
                          className={`catalog-item-size ${isSelected ? "selected" : ""}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => setSelectedSize(item.size)}
                        >
                          {item.size}
                        </span>
                      );
                    })}
                  </p>

                  <p>
                    Количество:{" "}
                    <span className="btn-group btn-group-sm pl-2">
                      <button
                        className="btn btn-secondary"
                        onClick={() => dispatch(decrement())}
                        disabled={amount <= 1}
                      >
                        -
                      </button>
                      <span className="btn btn-outline-primary">{amount}</span>
                      <button
                        className="btn btn-secondary"
                        onClick={() => dispatch(increment())}
                        disabled={amount >= 10}
                      >
                        +
                      </button>
                    </span>
                  </p>
                  <button
                    className="btn btn-danger btn-block btn-lg"
                    onClick={handleToCart}
                    disabled={availableSizes.length === 0 || !selectedSize}
                  >
                    В корзину
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
