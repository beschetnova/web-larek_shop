import { ViewComponent } from '../components/base/ViewComponent';
import { IEvents } from '../components/base/events';
import { ensureElement } from '../utils/utils';

interface IPage {
    catalog: HTMLElement[];
    counter: number;
    locked: boolean;
}

export class Page extends ViewComponent<IPage> {
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _cartButton: HTMLElement;
    protected _counter: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._cartButton = ensureElement<HTMLElement>('.header__basket');
        this._counter = ensureElement<HTMLElement>('.header__basket-counter');

        this._cartButton.addEventListener('click', () => {
            this.events.emit('cart:open');
        });
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }
    
    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set locked(value: boolean) {
        this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
    }
}