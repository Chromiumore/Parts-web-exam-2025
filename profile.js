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
    let namesAsText = names.join(',\n');
    const amountOfSymbols = Math.min(15, namesAsText.length);
    let text = namesAsText.slice(0, amountOfSymbols + 1);
    if (namesAsText.length > 15) {
        text += '...';
    }
    return text;
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
                                <div class="action-buttons" data-order="${order.id}">
                                    <button class="show-button"><img src="resources/icons/eye.png" alt="show"></button>
                                    <button class="edit-button"><img src="resources/icons/pencil.png" alt="edit"></button>
                                    <button class="delete-button"><img src="resources/icons/trash.png" alt="delete"></button>
                                 </div>
                            </td>
                        </tr>`
        tbody.querySelector('.show-button').onclick = () => showOrder(tbody.querySelector('div').getAttribute('data-order'));

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
    console.log(orders);
    loadGoods();
}

function showOrder(id) {
    console.log('showing order:', id);
    let window = document.createElement('div');
    window.classList.add('window');

    let order = orders.find(order => order.id == id);
    let timeCreatedElements = (order['created_at'].split('T')[0]).split('-');
    let dateCreatedElements = (order['created_at'].split('T')[1]).split(':');
    let timeCretated = timeCreatedElements[2] + '.' + timeCreatedElements[1] + '.' + timeCreatedElements[0];
    let dateCreated = dateCreatedElements[0] + ':' + dateCreatedElements[1];
    window.innerHTML = `
                        <section class="cover-section">
                            <h3>Просмотр заказа</h3>
                            <button class="close-button"><img src="resources/icons/cross.png" alt="close"></button>
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
                                <p>${dateCreated} ${timeCretated}</p>
                                <p>${order.full_name}</p>
                                <p>${order.phone}</p>
                                <p>${order.email}</p>
                                <p>${order.delivery_address}</p>
                                <p>${order.delivery_date}</p>
                                <p>${order.delivery_interval}</p>
                                <p>${getNamesText(order.good_ids)}</p>
                                <p>${getFullCost(order.good_ids)} ₽</p>
                                <p>${order.comment}</p>
                            </div>
                        </section>
                        <button class="ok-button">Ок</button>
                        `
    document.body.appendChild(window);
    document.querySelector('.close-button').onclick = () => (window.remove());
    document.querySelector('.ok-button').onclick = () => (window.remove());

}

loadOrders();
