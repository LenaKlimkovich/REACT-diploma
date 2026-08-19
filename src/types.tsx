export interface Product {
  id: number;
  category: number;
  title: string;
  price: number;
  images: string;
}

export interface Categories {
  id: number;
  title: string;
}

export interface DetailedProduct {
  id: number;
  category: number;
  title: string;
  images: string[];
  sku: string;
  manufacturer: string;
  color: string;
  material: string;
  reason: string;
  heelsize: string;
  season: string;
  price: number;
  sizes: {
    size: string;
    available: boolean;
  }[];
}
