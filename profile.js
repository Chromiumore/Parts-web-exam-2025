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
        tbody.querySelector('.edit-button').onclick = () => editOrder(tbody.querySelector('div').getAttribute('data-order'));
        tbody.querySelector('.delete-button').onclick = () => deleteOrder(tbody.querySelector('div').getAttribute('data-order'));

        document.querySelector('table').appendChild(tbody);
    }
}

async function loadOrders() {
    orders = [];
    goods = [];
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
    closeWindow();
    let window = document.createElement('div');
    window.classList.add('window');
    window.classList.add('show-window');

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
                                <button class="ok-button">Ок</button>
                            </div>
                        </section>
                        
                        `
    document.body.appendChild(window);
    document.querySelector('.close-button').onclick = () => (window.remove());
    document.querySelector('.ok-button').onclick = () => (window.remove());

}

function closeWindow() {
    if (document.querySelector('.window') != null) {
        document.querySelector('.window').remove();
    }
}

function resetTable() {
    let orders = document.querySelectorAll('tbody');
    orders.forEach(el => el.remove());
}

async function saveChanges(id) {
    let formData = new FormData();
    
    let fullName = document.getElementById('name-input').value;
    if (fullName) {formData.append('full_name', fullName);}
    
    let email = document.getElementById('email-input').value;
    if (email) {formData.append('email', email);}
    
    let phone = document.getElementById('phone-input').value;
    if (phone) {formData.append('phone', phone);}
    
    let deliveryAddress = document.getElementById('address-input').value;
    if (deliveryAddress) {formData.append('delivery_address', deliveryAddress);}
    
    if (document.getElementById('date').value) {
        let dateSegments = document.getElementById('date').value.split('-');
        let dateFormat = dateSegments[2] + '.' + dateSegments[1] + '.' + dateSegments[0]; 
        formData.append('delivery_date', dateFormat);
    }
    
    let deliveryInterval = document.getElementById('delivery-interval').value;
    if (deliveryInterval) {formData.append('delivery_interval', deliveryInterval);}
    
    let comment = document.getElementById('comment').value;
    if (comment) {formData.append('comment', comment);}

    let path = '/exam-2024-1/api/orders?api_key=';

    try {
        const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders/${id}?api_key=e0f88639-908c-4bd5-9568-97250c9e9938`, {
            method: 'PUT',
            body: formData
        });

        if (response.ok) {
            alert('Заказ отредактирован');
            closeWindow();
            resetTable();
            loadOrders()
        } else {
            alert('Ошибка на сервере!');
        }   
    } catch {
        alert('Ошибка! ' + error.message);
    }
}

function editOrder(id) {
    closeWindow();
    let window = document.createElement('div');
    window.classList.add('window');
    window.classList.add('edit-window');

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
                                <label for="name-input">Имя</label>
                                <label for="phone-input">Номер телефона</label>
                                <label for="email-input">Email</label>
                                <label for="address-input">Адрес доставки</label>
                                <label for="date">Дата доставки</label>
                                <label for="delivery-interval">Временной интервал доставки</label>  
                                <p>Состав заказа</p>
                                <p>Стоимость</p>
                                <label for="comment">Комментарий к заказу</label>
                            </div>
                            <div class="values-side">
                                <p>${dateCreated} ${timeCretated}</p>
                                <input type="text" id="name-input" name="client-name">
                                <input type="text" id="phone-input" name="phone">
                                <input type="email" id="email-input" name="email">
                                <input type="text" id="address-input" name="address">
                                <input type="date" name="date" id="date">
                                <select name="delivery-interval" id="delivery-interval">
                                    <option value="08:00-12:00">08:00-12:00</option>
                                    <option value="12:00-14:00">12:00-14:00</option>
                                    <option value="14:00-18:00">14:00-18:00</option>
                                    <option value="18:00-22:00">18:00-22:00</option>
                                </select>
                                <p>${getNamesText(order.good_ids)}</p>
                                <p>${getFullCost(order.good_ids)} ₽</p> 
                                <input type="text" id="comment" name="comment">
                                <div class="button-wrapper">
                                    <button class="cancel-button">Отмена</button>
                                    <button class="save-button">Сохранить</button>
                                </div>
                                
                            </div>
                        </section>
                        `
    document.body.appendChild(window);
    document.querySelector('.close-button').onclick = () => (window.remove());
    document.querySelector('.cancel-button').onclick = () => (window.remove());
    document.querySelector('.save-button').onclick = () => (saveChanges(id));
}

function deleteOrder(id) {
    closeWindow();
    let window = document.createElement('div');
    window.classList.add('window');
    window.classList.add('delete-window');

    window.innerHTML = `
                        <section class="cover-section">
                            <h3>Удаление заказа</h3>
                            <button class="close-button"><img src="resources/icons/cross.png" alt="close"></button>
                        </section>
                        <section class="info-section">
                            <div class="delete-message">
                                <p>Вы уверены, что хотите удалить заказ?</p>
                            </div>
                            <div class="delete-buttons">
                                <button class="cancel-button">Нет</button>
                                <button class="confirm-button">Да</button>
                            </div>
                        </section>
                        `
    document.body.appendChild(window);
    document.querySelector('.close-button').onclick = () => (window.remove());
    document.querySelector('.cancel-button').onclick = () => (window.remove());
    document.querySelector('.confirm-button').onclick = () => (removeOrder(id));
}

async function removeOrder(id) {
    try {
        const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders/${id}?api_key=e0f88639-908c-4bd5-9568-97250c9e9938`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Заказ удалён');
            closeWindow();
            resetTable();
            loadOrders()
        } else {
            alert('Ошибка на сервере!');
        }   
    } catch {
        alert('Ошибка! ' + error.message);
    }
}

loadOrders();
