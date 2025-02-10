// Интерфейс API-клиента
export interface ILarekApi {
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
    items: string[];
    total: number;
    selected?: string[];
}
