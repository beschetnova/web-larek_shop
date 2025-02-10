import { ViewComponent } from '../components/base/ViewComponent';
import { IEvents } from '../components/base/events';
import { ensureElement } from '../utils/utils';

interface IModalData {
    content: HTMLElement;
}

export class Modal extends ViewComponent<IModalData> {
    protected _content: HTMLElement;
    protected _closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', this.closeModal.bind(this));
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.closeModal();
            }
        });
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    render(data: IModalData): HTMLElement {
        super.render(data);
        this.content = data.content;
        this.openModal();
        return this.container;
    }

    openModal() {
        this.toggleClass(this.container, 'modal_active', true);
        this.events.emit('modal:open');
    }

    closeModal() {
        this._content.replaceChildren();
        this.toggleClass(this.container, 'modal_active', false);
        this.events.emit('modal:close');
    }  
}