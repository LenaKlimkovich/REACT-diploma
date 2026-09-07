import { ReactElement } from "react";

export const ErrorPage = (): ReactElement => {
  return (
    <section className="error-404 text-center my-5">
      <h2 className="display-4 font-weight-bold">404</h2>
      <p className="lead font-weight-bold">Страница не найдена</p>
    </section>
  );
};
