import { IAppState, IProduct, IOrder, ICart } from '../types';
import { PaymentType } from './OrderDelivery';
import { Model } from "../components/base/Model";
import { IEvents } from "./base/events";

export class AppState extends Model<IAppState> {
    catalog: IProduct[] = [];
    preview: IProduct | null = null;
    order: IOrder = {
        payment: 'card',
        address: '',
		email: '',
		phone: '',
	};
    cart: ICart = {
		items: [],
        total: 0
	};
    formErrors: Partial<Record<keyof IOrder, string>> = {};

    constructor(data: Partial<IAppState>, events: IEvents) {
        super(data, events);
    }

    setCatalog(items: IProduct[]) {
        this.catalog = items;
        this.emitChanges('catalog:change', this.catalog);
    }

    setPreview(item: IProduct) {
        this.preview = item;
        this.events.emit('preview:change', this.preview);
    }

    isInCart(item: IProduct): boolean {
        return this.cart.items.includes(item.id);
    }

    addToCart(item: IProduct) {
        this.cart.items.push(item.id);
        this.cart.total = this.getCartTotal();
        this.events.emit('cart:change', this.cart);
    }

    removeFromCart(item: IProduct) {
        this.cart.items = this.cart.items.filter((id) => id !== item.id);
        this.cart.total = this.getCartTotal();
        this.events.emit('cart:change', this.cart);
    }

    clearCart() {
        this.cart.items = [];
        this.emitChanges('cart:change', this.cart);
    }

    getCartTotal(): number {
        return this.cart.items.reduce((total, itemId) => {
            const product = this.catalog.find(product => product.id === itemId);
            return total + (product?.price ?? 0);
        }, 0);
    }    

    setPayment(method: PaymentType) {
		this.order.payment = method;
	}

	setOrderField(field: keyof IOrder, value: string) {
        if (field === 'payment') {
            this.setPayment(value as PaymentType);
        } else {
            this.order[field] = value;
        }
    }

    getOrderField(field: keyof IOrder) {
        return this.order[field];
    }
    
    validateDeliveryForm(): boolean {
        const errors: Partial<Record<keyof IOrder, string>> = {};
        const validateField = (field: keyof IOrder, message: string) => {
            if (!this.order[field] || this.order[field].trim() === '') {
                errors[field] = message;
            }
        };
    
        validateField('payment', 'Необходимо выбрать способ оплаты');
        validateField('address', 'Необходимо указать адрес');
    
        this.events.emit('formErrors:change', errors);
        return Object.keys(errors).length === 0;
    }

    validateContactsForm(): boolean {
        const errors: Partial<Record<keyof IOrder, string>> = {};
        const validateField = (field: keyof IOrder, message: string) => {
            if (!this.order[field] || this.order[field].trim() === '') {
                errors[field] = message;
            }
        };
    
        validateField('email', 'Необходимо указать email');
        validateField('phone', 'Необходимо указать телефон');
    
        this.events.emit('formErrors:change', errors);
        return Object.keys(errors).length === 0;
    }
    
    clearOrder() {
        this.order = {
            payment: 'card',
            address: '',
            email: '',
            phone: ''
        };
        this.emitChanges('order:clear', this.order);
    }
}