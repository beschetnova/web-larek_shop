import { Form } from '../components/Form';
import { IOrder } from '../types';
import { IEvents } from '../components/base/events';
import { ensureElement } from '../utils/utils';

export type PaymentType = 'card' | 'cash';

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
		this.onInputChange('payment', 'card');
		this.payment = 'card';
	});

	this._payCash.addEventListener('click', () => {
		this.onInputChange('payment', 'cash');
		this.payment = 'cash';
	});
	}

  set payment(value: PaymentType) {
		this.toggleClass(this._payCard, 'button_alt-active', value === 'card');
		this.toggleClass(this._payCash, 'button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this._address.value = value;
  }
}
