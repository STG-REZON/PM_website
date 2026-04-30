const productsData = {
    single: {
        title: 'Шприцы одноразовые с одной иглой',
        categoryId: 1,
        products: [
            {
                id: 1,
                name: 'Шприц тип 1 ...',
                images: ['1.png'],
                characteristics: {
                    'Объем, мл': '2 мл',
                    'Тип соединения': 'Люер',
                    'Размер иглы': '23G х 1 1/4" (0,6х30 мм)'
                },
                description: 'Описание для 1.png ...'
            },
            {
                id: 2,
                name: 'Шприц тип 2 ...',
                images: ['2.jpg'],
                characteristics: {
                    'Объем, мл': '3 мл',
                    'Тип соединения': 'Люер',
                    'Размер иглы': '23G х 1 1/2" (0,6х38 мм)'
                },
                description: 'Описание для 2.jpg ...'
            },
            {
                id: 3,
                name: 'Шприц тип 3 ...',
                images: ['3.jpg'],
                characteristics: {
                    // ...
                },
                description: 'Описание для 3.jpg ...'
            },
            {
                id: 4,
                name: 'Шприц тип 4 ...',
                images: ['4.jpg'],
                characteristics: {
                    // ...
                },
                description: 'Описание для 4.jpg ...'
            },
            {
                id: 5,
                name: 'Шприц тип 5 ...',
                images: ['5.jpg'],
                characteristics: {
                    // ...
                },
                description: 'Описание для 5.jpg ...'
            },
            {
                id: 6,
                name: 'Шприц тип 6 ...',
                images: ['6.jpg'],
                characteristics: {
                    // ...
                },
                description: 'Описание для 6.jpg ...'
            },
            {
                id: 7,
                name: 'Шприц тип 7 ...',
                images: ['7.jpg'],
                characteristics: {
                    // ...
                },
                description: 'Описание для 7.jpg ...'
            },
            {
                id: 8,
                name: 'Шприц тип 8 ...',
                images: ['8.jpg'],
                characteristics: {
                    // ...
                },
                description: 'Описание для 8.jpg ...'
            },
            {
                id: 9,
                name: 'Шприц тип 9 ...',
                images: ['9.png'],
                characteristics: {
                    // ...
                },
                description: 'Описание для 9.png ...'
            },
            {
                id: 10,
                name: 'Шприц тип 10 ...',
                images: ['10.jpg'],
                characteristics: {
                    // ...
                },
                description: 'Описание для 10.jpg ...'
            },
            {
                id: 11,
                name: 'Шприц тип 11 ...',
                images: ['11.jpg'],
                characteristics: {
                    // ...
                },
                description: 'Описание для 11.jpg ...'
            },
            {
                id: 12,
                name: 'Шприц тип 12 ...',
                images: ['12.jpg'],
                characteristics: {
                    // ...
                },
                description: 'Описание для 12.jpg ...'
            },
            {
                id: 13,
                name: 'Шприц тип 13 ...',
                images: ['13.jpg'],
                characteristics: {
                    // ...
                },
                description: 'Описание для 13.jpg ...'
            }
        ]
    },
    insulin: {
        title: 'Шприцы для инсулина',
        categoryId: 3,
        products: Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            name: `Шприц инсулиновый вариант ${i + 1}`,
            images: [(i % 13) + 1, ((i + 1) % 13) + 1, ((i + 2) % 13) + 1],
            characteristics: {
                'Объем, мл': `${0.3 + (i % 3) * 0.35}`,
                'Тип': 'U-100',
                'Игла': '29G х 0.5"'
            },
            description: 'Инсулиновые шприцы для пациентов с диабетом с тонкой иглой.'
        }))
    },
    infusion: {
        title: 'Инфузионные и трансфузионные системы',
        categoryId: 4,
        products: Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            name: `Система инфузионная вариант ${i + 1}`,
            images: [(i % 13) + 1, ((i + 1) % 13) + 1, ((i + 2) % 13) + 1],
            characteristics: {
                'Длина трубки': '150-200 см',
                'Фильтр': '15 микрон',
                'Тип': 'Люер'
            },
            description: 'Инфузионные системы для безопасного введения растворов.'
        }))
    },
    'needles-sterile': {
        title: 'Иглы инъекционные стерильные',
        categoryId: 5,
        products: Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            name: `Игла стерильная вариант ${i + 1}`,
            images: [(i % 13) + 1, ((i + 1) % 13) + 1, ((i + 2) % 13) + 1],
            characteristics: {
                'Материал': 'Нержавеющая сталь',
                'Размер': `${20 + (i % 11)}G`,
                'Длина': `${25 + (i % 5) * 5} мм`
            },
            description: 'Стерильные иглы высокого качества для различных процедур.'
        }))
    },
    'needles-non-sterile': {
        title: 'Иглы инъекционные нестерильные',
        categoryId: 6,
        products: Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            name: `Игла нестерильная вариант ${i + 1}`,
            images: [(i % 13) + 1, ((i + 1) % 13) + 1, ((i + 2) % 13) + 1],
            characteristics: {
                'Материал': 'Нержавеющая сталь',
                'Размер': `${20 + (i % 11)}G`,
                'Требует стерилизации': 'Да'
            },
            description: 'Нестерильные иглы требующие дополнительной обработки.'
        }))
    }
};

// ========================================
// LOAD PRODUCT DETAIL WITH SLIDER
// ========================================
let currentSlideIndex = 0;
let productVariant = null;

function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const cat = urlParams.get('cat') || 'single';
    const id = parseInt(urlParams.get('id')) || 1;
    
    if (!productsData[cat] || !productsData[cat].products[id - 1]) {
        document.body.innerHTML = '<div class="container" style="padding: 100px 40px;"><h1>Продукт не найден</h1></div>';
        return;
    }
    
    productVariant = productsData[cat].products[id - 1];
    const category = productsData[cat];
    
    // Update title and breadcrumbs
    document.getElementById('productTitle').textContent = productVariant.name;
    document.getElementById('breadcrumb-category').textContent = category.title;
    document.getElementById('breadcrumb-category').href = `product-category.html?cat=${cat}`;
    document.getElementById('breadcrumb-product').textContent = productVariant.name.substring(0, 50) + '...';
    document.title = productVariant.name + ' - Pascal Medical';
    
    // Load slider images
    loadSlider();
    
    // Load characteristics
    const charGrid = document.getElementById('characteristics');
    charGrid.innerHTML = '';
    Object.entries(productVariant.characteristics).forEach(([label, value]) => {
        const item = document.createElement('div');
        item.className = 'characteristic-item';
        item.innerHTML = `
            <div class="characteristic-label">${label}</div>
            <div class="characteristic-value">${value}</div>
        `;
        charGrid.appendChild(item);
    });
    
    // Load description
    document.getElementById('descriptionText').textContent = productVariant.description;
}

function loadSlider() {
    const mainImage = document.getElementById('sliderMainImage');
    const thumbsContainer = document.getElementById('sliderThumbs');
    
    currentSlideIndex = 0;
    
    // Main image
    const mainImageNum = productVariant.images[0];
    mainImage.src = `img/img_products_1/${mainImageNum}.jpg`;
    mainImage.alt = productVariant.name;
    
    // Thumbnails
    thumbsContainer.innerHTML = '';
    productVariant.images.forEach((imgNum, index) => {
        const thumb = document.createElement('div');
        thumb.className = `slider-thumb ${index === 0 ? 'active' : ''}`;
        thumb.innerHTML = `<img src="img/img_products_1/${imgNum}.jpg" alt="Фото ${index + 1}">`;
        thumb.addEventListener('click', () => switchSlide(index));
        thumbsContainer.appendChild(thumb);
    });
}

function switchSlide(index) {
    currentSlideIndex = index;
    const mainImage = document.getElementById('sliderMainImage');
    const imgNum = productVariant.images[index];
    
    mainImage.style.opacity = '0';
    setTimeout(() => {
        mainImage.src = `img/img_products_1/${imgNum}.jpg`;
        mainImage.style.opacity = '1';
    }, 150);
    
    // Update active thumbnail
    document.querySelectorAll('.slider-thumb').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

document.addEventListener('DOMContentLoaded', loadProductDetail);

// Phone copy
const phoneBtn = document.getElementById('phoneBtn');
const footerPhoneBtn = document.getElementById('footerPhoneBtn');
const toast = document.getElementById('toast');

function copyPhoneNumber(button) {
    const phoneNumber = button.getAttribute('data-phone');
    if (navigator.clipboard) {
        navigator.clipboard.writeText(phoneNumber).then(() => {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2800);
        });
    }
}

if (phoneBtn) phoneBtn.addEventListener('click', (e) => {
    e.preventDefault();
    copyPhoneNumber(phoneBtn);
});

if (footerPhoneBtn) footerPhoneBtn.addEventListener('click', (e) => {
    e.preventDefault();
    copyPhoneNumber(footerPhoneBtn);
});

// Search & header
const searchBtn = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose = document.getElementById('searchClose');

if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        searchOverlay.classList.add('active');
    });
}

if (searchClose) {
    searchClose.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });
}

const header = document.querySelector('.main-header');
if (header) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            header.style.boxShadow = '0 6px 30px rgba(91, 58, 153, 0.2)';
        } else {
            header.style.boxShadow = '0 4px 20px rgba(91, 58, 153, 0.12)';
        }
    });
}
