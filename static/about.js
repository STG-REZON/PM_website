document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // УПРАВЛЕНИЕ МОДАЛЬНЫМИ ОКНАМИ ДИСТРИБЬЮТЕРОВ
    // ========================================

    // Открытие модального окна при клике на карточку дистрибьютора
    document.querySelectorAll('.distributor-card').forEach(card => {
        card.addEventListener('click', function () {
            const modalId = this.getAttribute('data-modal');
            if (modalId) {
                openDistributorModal(modalId);
            }
        });
    });

    // Функция открытия модального окна дистрибьютора
    function openDistributorModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Функция закрытия модального окна дистрибьютора
    function closeDistributorModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Закрытие по крестику
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const modal = this.closest('.distributor-modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Закрытие по overlay
    document.querySelectorAll('.distributor-modal .modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function () {
            const modal = this.closest('.distributor-modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Закрытие по Esc (для окон дистрибьютеров)
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.distributor-modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
            document.body.style.overflow = 'auto';
        }
    });

    // Предотвращение закрытия при клике внутри контента модалки
    document.querySelectorAll('.modal-content-distributor').forEach(content => {
        content.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

    // ========================================
    // ОБЩИЕ МОДАЛКИ (если где‑то ещё используются .modal)
    // ========================================

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Закрытие любых .modal по overlay
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });

    // Закрытие любых .modal по Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
            document.body.style.overflow = 'auto';
        }
    });

    // ========================================
    // ПРОЧИЙ ФУНКЦИОНАЛ СТРАНИЦЫ
    // ========================================

    // Копирование номера телефона при клике
    const phoneBtn = document.getElementById('phoneBtn');
    if (phoneBtn) {
        phoneBtn.addEventListener('click', function () {
            const phone = this.getAttribute('data-phone');
            if (!phone) return;

            navigator.clipboard.writeText(phone).then(() => {
                const toast = document.getElementById('toast');
                if (!toast) return;
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 2000);
            });
        });
    }

    // Поиск
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            setTimeout(() => searchInput?.focus(), 300);
        });
    }

    if (searchClose && searchOverlay) {
        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
            if (searchInput) searchInput.value = '';
        });
    }

    if (searchOverlay) {
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
                if (searchInput) searchInput.value = '';
            }
        });
    }

    // Плавный скролл для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
});
