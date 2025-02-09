import { ViewComponent } from '../components/base/ViewComponent';
import { IProduct } from '../types';
import { categories, CDN_URL } from '../utils/constants';
import { ensureElement } from '../utils/utils';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends ViewComponent<IProduct> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._image = container.querySelector('.card__image');
        this._description = container.querySelector('.card__description');
        this._category = container.querySelector('.card__category');
        this._price = ensureElement<HTMLImageElement>('.card__price', container);
        this._button = container.querySelector('.card__button');

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set image(src: string) {
        const fullImageUrl = `${CDN_URL}${src}`;
        this.setImage(this._image, fullImageUrl, this.title);
    }

    set price(value: string) {
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
        if (this._button) {
            this._button.disabled = !value;
        }
    }

    set category(value: string) {
        this.setText(this._category, value);
        if (this._category) {
            this._category.classList.add(
                `card__category_${
                    categories.get(value) ? categories.get(value) : 'other'
                }`
            );
        }
    }

    set button(text: string) {
        if (this._button) {
            this._button.textContent = text;
        }
    }
}