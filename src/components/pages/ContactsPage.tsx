import { ReactElement } from "react";

export const ContactsPage = (): ReactElement => {
  return (
    <section className="contacts-page">
      <h2 className="text-center">Контакты</h2>
      <p>
        Наш головной офис расположен в г. Москва, по адресу: Варшавское шоссе,
        д. 17, бизнес-центр W Plaza.
      </p>

      {/* Сменили text-center на text-left (или убрали), так как заголовки списков внутри контента смотрятся лучше по левому краю */}
      <h5 className="mt-4 mb-3">Координаты для связи:</h5>

      <p>
        Телефон: <a href="tel:+7-495-790-35-03">+7 495 79 03 5 03</a>{" "}
        (ежедневно: с 09-00 до 21-00)
      </p>
      <p>
        Email: <a href="mailto:office@bosanoga.ru">office@bosanoga.ru</a>
      </p>
    </section>
  );
};
