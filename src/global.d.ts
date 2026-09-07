// 1. Декларация для CSS-модулей (ДОЛЖНА БЫТЬ ПЕРВОЙ)
declare module "*.module.css" {
  const classes: { [className: string]: string };
  export default classes;
}

// 2. Декларация для обычных CSS файлов (side-effect импорты вроде index.css)
declare module "*.css" {
  const content: void;
  export default content;
}
