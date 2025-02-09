import { Form } from '../components/Form';
import { IOrder } from '../types';
import { IEvents } from '../components/base/events';
import { ensureElement } from '../utils/utils';

export class OrderContacts extends Form<IOrder> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._email = ensureElement<HTMLInputElement>('.form__input[name=email]', this.container);
		this._phone = ensureElement<HTMLInputElement>('.form__input[name=phone]', this.container);
	}

	set email(value: string) {
		this._email.value = value;
	}

	set phone(value: string) {
		this._phone.value = value;
	}
}