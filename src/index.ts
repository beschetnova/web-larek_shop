import './scss/styles.scss';

import { LarekApi } from './components/LarekApi';
import { AppState } from './components/AppState';
import { IProduct, IOrder } from './types';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { Card } from './components/Card';
import { Cart } from './components/Cart';
import { OrderDelivery } from './components/OrderDelivery';
import { OrderContacts } from './components/OrderContacts';
import { OrderSuccess } from './components/OrderSuccess';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// API
const api = new LarekApi(CDN_URL, API_URL);

// События
const events = new EventEmitter();
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Данные приложения
const appState = new AppState({}, events);

// Шаблоны
const modalCardTemplate = ensureElement<HTMLTemplateElement>('#modal-container');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardCartTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderSuccessTemplate = ensureElement<HTMLTemplateElement>('#success');

// Контейнеры
const page = new Page(document.body, events);
const modal = new Modal(modalCardTemplate, events);
const cart = new Cart(cloneTemplate(cartTemplate), events);
const order = new OrderDelivery(cloneTemplate(orderTemplate), events);
const contacts = new OrderContacts(cloneTemplate(orderContactsTemplate), events);
const success = new OrderSuccess(cloneTemplate(orderSuccessTemplate), events, { onClick: () => modal.closeModal(), });


// БИЗНЕС-ЛОГИКА

// Получение данных товаров с сервера
api.getProducts()
  .then(appState.setCatalog.bind(appState))
  .catch(err => {
    console.error(err);
});

// Сохранение в модели полученных данных товаров и их отображение на странице
events.on('catalog:change', (items: IProduct[]) => {
	page.catalog = items.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render(item);
	});
});

// Передача данных для превью, когда пользователь выбирает карточку
events.on('card:select', (item: IProduct) => {
    appState.setPreview(item);
});

// Отображение превью
events.on('preview:change', (item: IProduct) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
	  onClick: async () => {
		try {
		  if (appState.isInCart(item)) {
			await appState.removeFromCart(item);
			card.button = 'В корзину'; 
		  } else {
			await appState.addToCart(item);
			card.button = 'Удалить из корзины'; 
		  }
		  modal.render({ content: card.render(item) }); 
		} catch (error) {
		  console.error('Ошибка при обновлении корзины', error);
		}
	  },
	});
  
	card.button = appState.isInCart(item) ? 'Удалить из корзины' : 'В корзину';
	modal.render({ content: card.render(item) });
});

// Блокировка страницы при открывании модального окна
events.on('modal:open', () => {
    page.locked = true;
});

// Разлокировка страницы при закрывании модального окна
events.on('modal:close', () => {
    page.locked = false;
});

// Открытие корзины
events.on('cart:open', () => {
	modal.render({
		content: cart.render(),
	});
});

// Изменение корзины: добавление или удаление товара
events.on('cart:change', () => {
    page.counter = appState.cart.items.length;

	cart.items = appState.cart.items.map((id, index) => {
		const item = appState.catalog.find((item) => item.id === id);
		const card = new Card(cloneTemplate(cardCartTemplate), {
			onClick: () => appState.removeFromCart(item),
		});
		return card.render(item);
	});

	cart.total = appState.cart.total;
});

// Открытие первой формы для оформления заказа
events.on('order:open', () => {
    const address = appState.getOrderField('address') || '';
    const payment = appState.getOrderField('payment') || 'card';

    // Проверяем валидность формы
    const isValid = appState.validateDeliveryForm();

    modal.render({
        content: order.render({
            address: address,
            payment: payment === 'card' || payment === 'cash' ? payment : 'card',
            valid: isValid,
            errors: []
        })
    });
});

// Отправка первой формы оформления заказа и открытие второй формы
events.on('order:submit', () => {
    const email = appState.getOrderField('email') || '';
    const phone = appState.getOrderField('phone') || '';
  
    const isValid = appState.validateContactsForm();

    modal.render({
        content: contacts.render({
            email: email,
            phone: phone,
            valid: isValid,
            errors: []
        }),
    });
});

// Отправка второй формы оформления заказа и открытие окна подтверждения заказа
events.on('contacts:submit', () => {
	api.makeOrder({ ...appState.order, ...appState.cart })
        .then((data) => {
            modal.render({
                content: success.render(),
            }); 
			success.totalPrice = data.total;
			appState.clearCart();
			appState.clearOrder();
		})
		.catch(err => {
            console.error(err);
        })
});

// Изменение полей заказа в форме
events.on('payment:change', (item: HTMLButtonElement) => {
    appState.setOrderField('payment', item.name as "card" | "cash" );
	appState.validateDeliveryForm();
});

events.on(/^order\..*:change/, (data: { field: keyof IOrder, value: string }) => {
    appState.setOrderField(data.field, data.value);
    appState.validateDeliveryForm();
});
  
events.on(/^contacts\..*:change/, (data: { field: keyof IOrder, value: string }) => {
    appState.setOrderField(data.field, data.value);
    appState.validateContactsForm();
});

// Отслеживание валидности формы
events.on('formErrors:change', (errors: Partial<IOrder>) => {
    const { payment, address, email, phone, } = errors;

    order.valid = !payment && !address;
    contacts.valid = !email && !phone;

    order.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
    contacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});