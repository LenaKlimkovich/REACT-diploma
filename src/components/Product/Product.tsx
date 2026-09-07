import { Link } from "react-router-dom";
import { Product } from "../../types";
import { API_URL } from "../../config";
import { memo } from "react";
import styles from "./Product.module.css";

interface ProductProps {
  product: Product;
}

export const ProductItem = memo(({ product }: ProductProps) => {
  const initialImage = product.images[0];
  const filename = initialImage.substring(initialImage.lastIndexOf("/") + 1);
  const imageSrc = `${API_URL}/images/${filename}`;

  return (
    <div className={`card ${styles.card}`}>
      <div className={styles.cardWrapper}>
        <img src={imageSrc} alt={product.title} className={styles.image} />
      </div>
      <div className={`card-body ${styles.cardBody}`}>
        <p className="card-text">{product.title}</p>
        <p className="card-text font-weight-bold">
          {product.price.toLocaleString()} руб.
        </p>
        <Link
          to={`/catalog/${product.id}`}
          className={`btn btn-outline-primary ${styles.cardButton}`}
        >
          Заказать
        </Link>
      </div>
    </div>
  );
});
