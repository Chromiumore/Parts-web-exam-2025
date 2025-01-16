var orders = [];
var goods = [];

function closeMessagePanel() {
    document.querySelector('.message-panel').remove();
}

function createMessagePanel() {
    let messagePanel = document.createElement('div');
    messagePanel.classList.add('message-panel');
    let message = document.createElement('p');
    message.classList.add('message');
    messagePanel.appendChild(message);
    let button = document.createElement('button');
    button.classList.add('close-button');
    let cross = document.createElement('img');
    cross.setAttribute('src', 'resources/icons/cross.png');
    cross.setAttribute('alt', 'cross');
    button.appendChild(cross);
    button.onclick = () => (closeMessagePanel());
    messagePanel.appendChild(button);
    return messagePanel;
}

var messagePanel = createMessagePanel();

function updateMessage() {
    messagePanel.querySelector('.message').textContent = calculatePrice();
    document.querySelector('main').insertBefore(messagePanel, document.querySelector('main').firstChild);
}

async function loadGoods() {
    let key = 'e0f88639-908c-4bd5-9568-97250c9e9938';
    let url = 'https://edu.std-900.ist.mospolytech.ru';
    let path = '/exam-2024-1/api/goods?api_key='
    const response = await fetch(url+path+key);
    const json = await response.json();
    goods = json;
    updateTable();
}

function getGoodsNames(ids) {
    let names = [];
    console.log(ids);
    for (let id of ids) {
        let good = goods.find(good => good.id == id);
        names.push(good.name);
    }
    return names;
}

function getFullCost(ids) {
    let res = 0;
    for (let id of ids) {
        let good = goods.find(good => good.id === id);
        if (good.discount_price) {
            res += good.discount_price;
        } else {
            res += good.actual_price;
        }
    }
    return res;
}

function getNamesText(ids) {
    let names = getGoodsNames(ids);
    const amountOfSymbols = 15;
}

function updateTable() {
    for (let i = 0; i < orders.length; i++) {
        let order = orders[i];
        let number = i + 1;
        let createdAt = order.created_at;
        let names = getGoodsNames(order.good_ids);
        let cost = getFullCost(order.good_ids);
        let deliveryDate = order.delivery_date;
        let tbody = document.createElement('tbody');
        tbody.innerHTML = `
                        <tr>
                            <td>${number}.</td>
                            <td>${createdAt}</td>
                            <td>${names}</td>
                            <td>${cost} ₽</td>
                            <td>${deliveryDate}</td>
                            <td>
                                <div class="action-buttons" data-order=${order.id}>
                                    <button class="action-button" id="show-button"><img src="resources/icons/eye.png" alt="show"></button>
                                    <button class="action-button" id="edit-button"><img src="resources/icons/pencil.png" alt="edit"></button>
                                    <button class="action-button" id="delete-button"><img src="resources/icons/trash.png" alt="delete"></button>
                                 </div>
                            </td>
                        </tr>`
        document.querySelector('table').appendChild(tbody);
    }
}

async function loadOrders() {
    let key = 'e0f88639-908c-4bd5-9568-97250c9e9938';
    let url = 'https://edu.std-900.ist.mospolytech.ru';
    let path = '/exam-2024-1/api/orders?api_key='
    const response = await fetch(url+path+key);
    const json = await response.json();
    orders = json;
    loadGoods();
}

function showOrder(id) {
    let window = document.createElement('div');
    let order = orders.find(order => order.id == id);

    let timeCreated = order.created_at.split('T')[0];
    let dateCreated = order.created_at.split('T')[1];
    window.innerHTML = `
                        <section class="cover-section">
                            <h3>Просмотр заказа</h3>
                            <button><img src="resources/icons/cross.png" alt="close"></button>
                        </section>
                        <section class="info-section">
                            <div class="prop-side">
                                <p>Дата оформления</p>
                                <p>Имя</p>
                                <p>Номер телефона</p>
                                <p>Email</p>
                                <p>Адрес доставки</p>
                                <p>Дата доставки</p>
                                <p>Время доставки</p>
                                <p>Состав заказа</p>
                                <p>Стоимость</p>
                                <p>Комментарий</p>
                            </div>
                            <div class="values-side">
                                <p>Дата оформления</p>
                                <p>Имя</p>
                                <p>Номер телефона</p>
                                <p>Email</p>
                                <p>Адрес доставки</p>
                                <p>Дата доставки</p>
                                <p>Время доставки</p>
                                <p>Состав заказа</p>
                                <p>Стоимость</p>
                                <p>Комментарий</p>
                            </div>
                        </section>
                        `
}

loadOrders();
