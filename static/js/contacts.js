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
