var goods = [];

async function loadGoods() {
    let key = 'e0f88639-908c-4bd5-9568-97250c9e9938';
    let url = 'https://edu.std-900.ist.mospolytech.ru';
    let path = '/exam-2024-1/api/goods?api_key='
    const response = await fetch(url+path+key);
    const json = await response.json();
    goods = json;
    placeCards();
}

function getRatingText(good) {
    let ratingValue = good.ratings;
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
    let actualPrice = good.actal_price;
    let discountPrice = good.discount_price;
    let discount = Math.round((good.discount_price / good.actual_price - 1) * 100);
    let code = `
                <p class="actual_price">${discountPrice}₽</p>
                <p class="old_price">${actualPrice}₽</p>
                <p class="discount">${discount}₽</p>
                `;
    return code;
}

function createCard(good) {
    let goodCard = document.createElement('div');
    goodCard.classList.add('good-card');
        goodCard.setAttribute('data-kind', good.category);
        goodCard.innerHTML = `
                    <img src='${good.image}' alt='${good.name}'>
                    <p class="name">${good.name}</p>
                    <div class="rating">${getRatingText(good)}</div>
                    <div class="prices">${getPricesHTML(good)}</div>
                    <button>Добавить</button>`;
    return goodCard;
}

function placeCards() {
    for (let good of goods) {
        let goodCard = createCard(good);
        
        let catalog = document.getElementById('goods');
        catalog.append(goodCard);
        console.log(123);
    }
}

loadGoods();
