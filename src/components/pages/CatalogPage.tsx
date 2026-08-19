import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { Catalog } from "../Catalog";

export const CatalogPage = () => {
  return <Catalog withSearch={true} />;
};
