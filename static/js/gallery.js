// ========================================
// GALLERY DATA (количество фото для каждой категории)
// ========================================
const galleryData = {
    1: ['1_2.jpg', '1_1.jpg', '1_3.jpg', '1_4.jpg', '1_5.jpg'],
    2: ['2_1.jpg', '2_2.jpg'],
    3: ['3_1.jpg', '3_2.jpg', '3_8.jpg', '3_9.jpg', '3_11.jpg'],
    4: ['4_1.jpg', '4_2.jpg', '4_3.jpg', '4_4.jpg', '4_5.jpg', '4_6.jpg'],
    5: ['5_1.jpg', '5_2.jpg', '5_3.jpg', '5_4.jpg', '5_5.jpg', '5_6.jpg', '5_7.jpg', '5_8.jpg'],
    6: ['6_1.jpg', '6_2.jpg', '6_3.jpg', '6_4.jpg', '6_5.jpg'],
    7: ['7_1.jpg', '7_2.jpg'],
    8: ['8_1.jpg', '8_2.jpg', '8_3.jpg', '8_4.jpg']
};

// ========================================
// MODAL FUNCTIONALITY
// ========================================
let currentGalleryId = null;
let currentImageIndex = 0;

const modal = document.getElementById('galleryModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');
const modalCounter = document.getElementById('modalCounter');

// Открытие модалки
document.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('click', () => {
        currentGalleryId = parseInt(card.getAttribute('data-gallery-id'));
        currentImageIndex = 0;
        openModal();
    });
});

function openModal() {
    modal.classList.add('active');
    updateModalImage();
}

function closeModal() {
    modal.classList.remove('active');
}

function updateModalImage() {
    const images = galleryData[currentGalleryId];
    modalImage.src = `img/img_photo/${images[currentImageIndex]}`;
    modalCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
    
    // Показать/скрыть кнопки навигации
    modalPrev.style.display = currentImageIndex > 0 ? 'flex' : 'none';
    modalNext.style.display = currentImageIndex < images.length - 1 ? 'flex' : 'none';
}

// Навигация
modalPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateModalImage();
    }
});

modalNext.addEventListener('click', (e) => {
    e.stopPropagation();
    const images = galleryData[currentGalleryId];
    if (currentImageIndex < images.length - 1) {
        currentImageIndex++;
        updateModalImage();
    }
});

// Закрытие ТОЛЬКО на крестик
modalClose.addEventListener('click', closeModal);

// Клавиши
document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
        currentImageIndex--;
        updateModalImage();
    }
    if (e.key === 'ArrowRight') {
        const images = galleryData[currentGalleryId];
        if (currentImageIndex < images.length - 1) {
            currentImageIndex++;
            updateModalImage();
        }
    }
});

// ========================================
// PHONE COPY & SEARCH
// ========================================
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
