import { ViewComponent } from '../components/base/ViewComponent';
import { ICart } from '../types';
import { EventEmitter } from '../components/base/events';
import { ensureElement, createElement } from '../utils/utils';

export class Cart extends ViewComponent<ICart> {
    protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container, events);
        
        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

    toggleButton(state: boolean) {
		this.setDisabled(this._button, !state);
	}

    set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.toggleButton(true);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.toggleButton(false);
		}
	}

	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}
}
