// ========================================
// YANDEX MAP INITIALIZATION
// ========================================
ymaps.ready(init);

function init() {
    const myMap = new ymaps.Map('map', {
        center: [56.719081, 37.165594], // Обновленные координаты
        zoom: 13, // Обновленный зум
        controls: ['zoomControl', 'fullscreenControl']
    });

    const myPlacemark = new ymaps.Placemark(
        [56.719081, 37.165594],
        {
            balloonContent: '<strong>ООО "ПАСКАЛЬ МЕДИКАЛ"</strong><br>141981, Россия, Московская область,<br>г. Дубна, ул. Электронная, д. 8/1<br>Тел. +7 495 150 20 80',
            hintContent: 'Pascal Medical'
        },
        {
            preset: 'islands#violetMedicalIcon'
        }
    );

    myMap.geoObjects.add(myPlacemark);
}

// ========================================
// PHONE COPY (добавлено для контактов)
// ========================================
const phoneButtons = document.querySelectorAll('.contact-phone-btn');
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

// Копирование для всех кнопок с номерами
phoneButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        copyPhoneNumber(btn);
    });
});

if (phoneBtn) phoneBtn.addEventListener('click', (e) => {
    e.preventDefault();
    copyPhoneNumber(phoneBtn);
});

if (footerPhoneBtn) footerPhoneBtn.addEventListener('click', (e) => {
    e.preventDefault();
    copyPhoneNumber(footerPhoneBtn);
});

// Search
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
