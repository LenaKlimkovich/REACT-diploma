import { Link } from "react-router-dom";
import { Product } from "../types";

interface ProductProps {
  product: Product;
}

export const ProductItem = ({ product }: ProductProps) => {
  const image = product.images[0];

  return (
    <div
      className="card h-100"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div
        style={{
          maxHeight: "250px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "10px",
        }}
      >
        <img
          src={image}
          alt={product.title}
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />
      </div>
      <div
        className="card-body"
        style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
      >
        <p className="card-text">{product.title}</p>
        <p className="card-text">{product.price}</p>
        <Link
          to={`/catalog/${product.id}.html`}
          className="btn btn-outline-primary"
          style={{ marginTop: "auto", width: "35%", padding: "5px" }}
        >
          Заказать
        </Link>
      </div>
    </div>
  );
};
