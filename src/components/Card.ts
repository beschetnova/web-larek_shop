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
    protected _categories? = categories;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._image = container.querySelector('.card__image') as HTMLImageElement;
        this._description = container.querySelector('.card__description') as HTMLElement;
        this._category = container.querySelector('.card__category') as HTMLElement;
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._button = container.querySelector('.card__button');

        if (actions?.onClick) {
            (this._button || container).addEventListener('click', actions.onClick);
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
        this.setDisabled(this._button!, !value);
    }

    set category(value: string) {
        this.setText(this._category!, value);
        if (this._category) {
            const categoryClass = this._categories.get(value) || 'other';
            this.toggleClass(this._category!, `card__category_${categoryClass}`, true);
        }
    }
    
    set button(text: string) {
        if (this._button) {
            this.setText(this._button, text);
        }
    }
}
