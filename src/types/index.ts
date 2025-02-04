// БАЗОВЫЕ КЛАССЫ

// Интерфейс API-клиента
export interface ILarekApi {
  getProduct(id: string): Promise<IProduct>;
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


// МОДЕЛИ ДАННЫХ

// Данные товара
export interface IProduct {
	id: number;
  title: string;
  imageUrl: string;
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


// КОМПОНЕНТЫ ОТОБРАЖЕНИЯ

// Интерфейс страницы
export interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

// Интерфейс модального окна
interface IModal {
  content: HTMLElement;
}

// Интерфейс заказа
export interface IOrder {
  items: string[];
	total: number;
  payment: 'cash' | 'card';
	address: string;
  email: string;
	phone: string;
}

// Интерфейс корзины
export interface ICart {
  items: string[];
	total: number;
}

// Тип формы заказа
export type TOrderForm = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>;

// Интерфейс состояния формы
interface IFormState {
	valid: boolean;
	errors: string[];
}