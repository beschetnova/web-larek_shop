import { ViewComponent } from '../components/base/ViewComponent';
import { IEvents } from '../components/base/events';
import { ensureElement } from '../utils/utils';

interface ISuccess {
    total: number;
}

interface IOrderSuccessOptions {
    onClick?: () => void;
}

export class OrderSuccess extends ViewComponent<ISuccess> {
    protected _closeButton: HTMLButtonElement;
    protected _totalPrice: HTMLElement;

    constructor(container: HTMLElement, events: IEvents, options: IOrderSuccessOptions) {
        super(container, events);

        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this._totalPrice = ensureElement<HTMLElement>('.order-success__description', this.container);

        if (options.onClick) {
            this._closeButton.addEventListener('click', options.onClick);
        }
    }

    set totalPrice(value: number) {
        this.setText(this._totalPrice, `Списано ${value} синапсов`);
    }
}