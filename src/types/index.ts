// Интерфейс API-клиента
export interface ILarekApi {
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
}

// Данные состояния приложения
export interface IAppState {
  catalog: IProduct[];
  preview: string;
  order: IOrder;
  cart: ICart;
}

// Интерфейс заказа
export interface IOrder {
  payment: 'cash' | 'card';
  address: string;
  email: string;
  phone: string;
}

// Интерфейс корзины
export interface ICart {
  items: ICartItem[];
  calculateTotal(): number;
}

// Интерфейс элемента корзины
export interface ICartItem {
  productId: string;
  quantity: number;
}
