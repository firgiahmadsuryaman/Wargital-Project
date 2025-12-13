
export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageHint: string;
};

export type Restaurant = {
  id: string;
  name:string;
  description: string;
  distance: string;
  image: string;
  imageHint: string;
  menu: MenuItem[];
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type Order = {
  id: string;
  restaurantName: string;
  items: CartItem[];
  total: number;
  status: 'Menyiapkan' | 'Dalam perjalanan' | 'Terkirim';
  orderDate: string;
};
