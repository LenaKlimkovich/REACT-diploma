import { TopSales } from "../TopSales";
import { Catalog } from "../Catalog";
import { ReactElement } from "react";

export const HomePage = (): ReactElement => {
  return (
    <div className="row">
      <div className="col">
        <TopSales />
        <Catalog withSearch={false} />
      </div>
    </div>
  );
};
