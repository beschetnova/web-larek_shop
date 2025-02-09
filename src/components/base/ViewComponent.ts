import { IEvents } from "./events";

export abstract class ViewComponent<T> {
    protected constructor(protected readonly container: HTMLElement, protected events?: IEvents) {}

    render(data?: Partial<T>): HTMLElement {
        if (data) {
            Object.assign(this, data);
        }
        return this.container;
    }    

    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }    

    setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if(element) {
            element.src = src;
            if(alt) {
                element.alt = alt;
          }
        }
    }

    protected setText(element: HTMLElement, value: string) {
        if (element) {
            element.textContent = String(value);
        }
    }
}