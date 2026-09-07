import { ReactElement } from "react";
import { Catalog } from "../Catalog";

export const CatalogPage = (): ReactElement => {
  return <Catalog withSearch={true} />;
};
