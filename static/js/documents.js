// ========================================
// DOCUMENTS DATA
// ========================================
const documentsData = {
    1: ['1_1.jpg', '1_2.jpg', '1_3.jpg', '1_4.jpg'],
    2: ['2_1.jpg', '2_2.jpg'],
    3: ['3_1.jpg', '3_2.jpg', '3_3.jpg', '3_4.jpg' , '3_5.jpg', '3_6.jpg'],
    4: ['4_1.jpg', '4_2.jpg'],
    5: ['5_1.jpg']
};

// ========================================
// MODAL FUNCTIONALITY
// ========================================
let currentDocId = null;
let currentImageIndex = 0;

const modal = document.getElementById('docModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');
const modalCounter = document.getElementById('modalCounter');

// Открытие модалки
document.querySelectorAll('.document-card').forEach(card => {
    card.addEventListener('click', () => {
        currentDocId = parseInt(card.getAttribute('data-doc-id'));
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
    const images = documentsData[currentDocId];
    modalImage.src = `img/img_doc/${images[currentImageIndex]}`;
    modalCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
    
    // Показать/скрыть кнопки навигации
    modalPrev.style.display = currentImageIndex > 0 ? 'block' : 'none';
    modalNext.style.display = currentImageIndex < images.length - 1 ? 'block' : 'none';
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
    const images = documentsData[currentDocId];
    if (currentImageIndex < images.length - 1) {
        currentImageIndex++;
        updateModalImage();
    }
});

// Закрытие ТОЛЬКО на крестик
modalClose.addEventListener('click', closeModal);

// УБРАЛИ клик на overlay для закрытия
// modalOverlay.addEventListener('click', closeModal);

// Клавиши
document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
        currentImageIndex--;
        updateModalImage();
    }
    if (e.key === 'ArrowRight') {
        const images = documentsData[currentDocId];
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
