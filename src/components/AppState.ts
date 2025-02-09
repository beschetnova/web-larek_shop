import { IAppState, IProduct, IOrder, ICart } from '../types';
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
		total: 0,
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

    isInCart(item: IProduct) {
		return this.cart.items.includes(item.id);
	}

    addToCart(item: IProduct) {
		this.cart.items.push(item.id);
		this.cart.total += item.price;
		this.events.emit('cart:change', this.cart);
	}
    
    removeFromCart(item: IProduct) {
		this.cart.items = this.cart.items.filter((id) => id !== item.id);
		this.cart.total -= item.price;
		this.events.emit('cart:change', this.cart);
	}
    
    clearCart() {
        this.cart.items = [];
        this.emitChanges('cart:change', this.cart);
    }

    setOrderField(field: keyof IOrder, value: string) {
        if (field === 'payment') {
            if (value === 'cash' || value === 'card') {
                this.order[field] = value as 'cash' | 'card';
            }
        } else {
            this.order[field] = value;
        }
    }
    
    validateForm() {
        const errors: Partial<Record<keyof IOrder, string>> = {};
    
        const validateField = (field: keyof IOrder, message: string) => {
            if (!this.order[field]) {
                errors[field] = message;
            }
        };
    
        validateField('address', 'Необходимо указать адрес');
        validateField('email', 'Необходимо указать email');
        validateField('phone', 'Необходимо указать телефон');
    
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
    
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