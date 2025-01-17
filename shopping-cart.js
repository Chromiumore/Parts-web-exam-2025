var goods = [];

var key = 'e0f88639-908c-4bd5-9568-97250c9e9938';
var url = 'https://edu.std-900.ist.mospolytech.ru';

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

async function loadGoods() {
    let path = '/exam-2024-1/api/goods?api_key=';
    const response = await fetch(url+path+key);
    const json = await response.json();
    goods = json;
    placeCards();
}

function getRatingText(good) {
    let ratingValue = good.rating;
    let numberOfStars = Math.round(ratingValue);
    text = `<p>${ratingValue} `;
    for (let i = 1; i <= 5; i++) {
        if (i <= numberOfStars) {
            text += '★';
        } else {
            text += '☆';
        }
    }
    text += '</p>';
    return text;
}

function getPricesHTML(good) {
    let actualPrice = good.actual_price;
    let discountPrice = good.discount_price;
    let code;
    if (discountPrice) {
        let discount = Math.round((good.discount_price / good.actual_price - 1) * 100);
        code = `
                <p class="actual_price">${discountPrice}</p>
                <p class="old_price">${actualPrice}</p>
                <p class="discount">${discount}%</p>
                `;
    } else {
        code = `<p class="old_price">${actualPrice}</p>`;
    }
                
    return code;
}

function calculatePrice() {
    let res = 0;
    for (let id in localStorage) {
        if (localStorage.hasOwnProperty(id)) {
            let good = goods.find(good => good.id == id);
            res += good.discount_price;
        }
    }
    return res;
}

function calculateDelivery() {
    let interval = document.querySelector('#delivery-interval').value;
    let date = new Date(document.querySelector('#date').value);
    if (interval === '18:00-22:00') {
        if (date.toLocaleString('en-US', {weekday: 'long'}) === 'Saturday' || date.toLocaleString('en-US', {weekday: 'long'}) === 'Sunday') {
            return 500;
        } else {
            return 400;
        }
    } else {
        return 200;
    }
}

function checkIsCartEmpty() {
    for (let el in localStorage) {
        if (localStorage.hasOwnProperty(el)) {
            return false;
        }
    }
    return true;
}

function updateTotalCost() {
    if (checkIsCartEmpty()) {
        document.querySelector('.final-cost').textContent = `Карзина пуста`;
        document.querySelector('.details').textContent = '';
    }
    else {
        document.querySelector('.final-cost').textContent = `Итоговая стоимость: ${calculatePrice() + calculateDelivery()} `;
        document.querySelector('.details').textContent = `(стоимость доставки ${calculateDelivery()} )`;
    }
}

function updateMessage() {
    messagePanel.querySelector('.message').textContent = 'Товар удалён из корзины';
    document.querySelector('main').insertBefore(messagePanel, document.querySelector('main').firstChild);
}

function removeCard(id) {
    for (let card of document.getElementsByClassName('good-card')) {
         if (card.getAttribute('data-good') == id) {
            card.remove();
            break
         }
    }
}

function removeGoodFromShoppingCart(good) {
    removeCard(good.id);
    localStorage.removeItem(good.id);
    updateMessage();
    updateTotalCost();
}

function createCard(good) {
    let goodCard = document.createElement('div');
    goodCard.classList.add('good-card');     
    goodCard.setAttribute('data-kind', good.category);
    goodCard.setAttribute('data-good', good.id);
    goodCard.innerHTML = `
                    <figure class='good-image'><img src='${good.image_url}' alt='${good.name}'></figure>
                    <p class="name">${good.name}</p>
                    <div class="rating">${getRatingText(good)}</div>
                    <div class="prices">${getPricesHTML(good)}</div>
                    <button>Удалить</button>`;
    goodCard.querySelector('button').onclick = () => removeGoodFromShoppingCart(good);
    return goodCard;
}

function placeCards() {
    for (let id in localStorage) {
        if (localStorage.hasOwnProperty(id)) {
            let good = goods.find(good => good.id == id);
            let goodCard = createCard(good);
            let catalog = document.getElementById('goods');
            catalog.append(goodCard);
        }
    }
    updateTotalCost();
}

function resetForm() {
    localStorage.clear();
    document.querySelectorAll('.good-card').forEach(el => el.remove());
}

async function submitForm() {
    event.preventDefault();
    
    let good_ids = new Array();
    for (let id in localStorage) {
        if (localStorage.hasOwnProperty(id)) {
            good_ids.push(id);
        }
    }

    if (good_ids.length === 0) return;

    let formData = new FormData();

    formData.append('full_name', document.getElementById('name-input').value);
    formData.append('email', document.getElementById('email-input').value);
    
    if (document.getElementById('news-checkbox').value) {
        formData.append('subscribe', 1);
    } else {
        formData.append('subscribe', 0);
    }
    formData.append('phone', document.getElementById('phone-input').value);
    formData.append('delivery_address', document.getElementById('address-input').value);

    let dateSegments = document.getElementById('date').value.split('-');
    let dateFormat = dateSegments[2] + '.' + dateSegments[1] + '.' + dateSegments[0]; 
    
    formData.append('delivery_date', dateFormat);
    formData.append('delivery_interval', document.getElementById('delivery-interval').value);

    formData.append('comment', document.getElementById('comment').value);

    formData.append('good_ids', good_ids);

    let path = '/exam-2024-1/api/orders?api_key=';

    try {
        const response = await fetch('https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders?api_key=e0f88639-908c-4bd5-9568-97250c9e9938', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Заказ принят');
            localStorage.clear();
            resetForm();
        } else {
            alert('Ошибка на сервере!');
        }   
    } catch {
        alert('Ошибка! ' + error.message);
    }
}

document.getElementById('submit').onclick = () => submitForm();
document.getElementById('reset').onclick = () => resetForm();

document.querySelector('#date').addEventListener('input', updateTotalCost);
document.querySelector('#delivery-interval').onchange = () => updateTotalCost();

loadGoods();
