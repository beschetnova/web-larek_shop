import { Form } from '../components/Form';
import { IOrder } from '../types';
import { IEvents } from '../components/base/events';
import { ensureElement } from '../utils/utils';

export class OrderDelivery extends Form<IOrder> {
	protected _payCard: HTMLButtonElement;
	protected _payCash: HTMLButtonElement;
	protected _address: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

        this._payCard = ensureElement<HTMLButtonElement>('.button_alt[name=card]', this.container);
        this._payCash = ensureElement<HTMLButtonElement>('.button_alt[name=cash]', this.container);
        this._address = ensureElement<HTMLInputElement>('.form__input[name=address]', this.container);

		this._payCard.addEventListener('click', () => {
			this.payment = 'card';
			this.onInputChange('payment', 'card');
		});

		this._payCash.addEventListener('click', () => {
			this.payment = 'cash';
			this.onInputChange('payment', 'cash');
		});
	}

	set payment(value: 'cash' | 'card') {
		this.toggleClass(this._payCard, 'button_alt-active', value === 'card');
		this.toggleClass(this._payCash, 'button_alt-active', value === 'cash');
	}	
    
	set address(value: string) {
		this._address.value = value;
	}
}