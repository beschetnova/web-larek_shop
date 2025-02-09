import { ViewComponent } from '../components/base/ViewComponent';
import { IEvents } from '../components/base/events';
import { ensureElement } from '../utils/utils';

interface IFormState {
	valid: boolean;
	errors: string[];
}

export class Form<T> extends ViewComponent<IFormState> {
	protected _submitButton: HTMLButtonElement;
	protected _errorsMessage: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

        this._submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errorsMessage = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;

			this.onInputChange(field, target.value)
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}
    
    set valid(value: boolean) {
        this._submitButton.disabled = !value;
    }

	set errors(value: string) {
		this.setText(this._errorsMessage, value);
	}

	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;

		super.render({ valid, errors });
		Object.assign(this, inputs);

        this.valid = typeof valid === 'boolean' ? valid : false;

		return this.container;
	}

    protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {field, value});
	}
}