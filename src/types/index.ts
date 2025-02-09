// Интерфейс API-клиента
export interface ILarekApi {
<<<<<<< HEAD
    getProducts(): Promise<{items: IProduct[]}>;
    makeOrder(data: IOrder): Promise<object>;
}

// Данные товара
export interface IProduct {
    id: string;
    title: string;
    image: string;
    description: string;
    category: string;
    price: number | null;
=======
  getProducts(): Promise<{items: IProduct[]}>;
  makeOrder(data: IOrder): Promise<object>;
}

// Тип событий
type EventName = string | RegExp;

// Интерфейс событий
export interface IEvents {
  on<T extends object>(event: EventName, callback: (data: T) => void): void;
  emit<T extends object>(event: string, data?: T): void;
  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

// Данные товара
export interface IProduct {
  id: number;
  title: string;
  image: string;
  description: string;
  category: string;
  price: number;
>>>>>>> 77a796efd62885d7d32121463252835f1885f402
}

// Данные состояния приложения
export interface IAppState {
<<<<<<< HEAD
    catalog: IProduct[];
    preview: string;
    order: IOrder;
    cart: ICart;
=======
  catalog: IProduct[];
  preview: string;
  order: IOrder;
  cart: ICart;
>>>>>>> 77a796efd62885d7d32121463252835f1885f402
}

// Интерфейс заказа
export interface IOrder {
<<<<<<< HEAD
    payment: 'cash' | 'card';
    address: string;
    email: string;
    phone: string;
=======
  payment: 'cash' | 'card';
  address: string;
  email: string;
  phone: string;
>>>>>>> 77a796efd62885d7d32121463252835f1885f402
}

// Интерфейс корзины
export interface ICart {
<<<<<<< HEAD
    items: string[];
	total: number;
    selected?: string[];
}
=======
  items: ICartItem[];
  calculateTotal(): number;
}

// Интерфейс элемента корзины
export interface ICartItem {
  productId: string;
  quantity: number;
}
>>>>>>> 77a796efd62885d7d32121463252835f1885f402
