// ========================================
// SITE SEARCH
// ========================================
const searchBtn = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

const BASE_SEARCH_INDEX = [
    {
        title: 'Главная',
        type: 'Страница',
        url: '/',
        description: 'Паскаль Медикал: производство медицинских изделий, шприцы, иглы, инфузионные системы, стерилизация и контрактное производство.',
        keywords: 'главная паскаль медикал производство медицинских изделий шприцы иглы стерилизация контрактное производство'
    },
    {
        title: 'О компании',
        type: 'Раздел',
        url: '/about/',
        description: 'Информация о компании Pascal Medical, производстве, качестве и возможностях предприятия.',
        keywords: 'о компании предприятие завод производство качество pascal medical паскаль медикал'
    },
    {
        title: 'Документы',
        type: 'Раздел',
        url: '/documents/',
        description: 'Сертификаты, регистрационные удостоверения, разрешительная документация и материалы компании.',
        keywords: 'документы сертификаты регистрационные удостоверения декларации лицензии'
    },
    {
        title: 'Новости',
        type: 'Раздел',
        url: '/news/',
        description: 'Новости компании, публикации и обновления Pascal Medical.',
        keywords: 'новости публикации события обновления'
    },
    {
        title: 'Вакансии',
        type: 'Раздел',
        url: '/vacancies/',
        description: 'Актуальные вакансии и работа в Pascal Medical.',
        keywords: 'вакансии работа карьера сотрудники персонал'
    },
    {
        title: 'Фотогалерея',
        type: 'Раздел',
        url: '/gallery/',
        description: 'Фотографии производства, оборудования и предприятия.',
        keywords: 'фотогалерея фото производство оборудование завод'
    },
    {
        title: 'Информационные материалы',
        type: 'Раздел',
        url: '/instructions/',
        description: 'Инструкции, справочные материалы и полезная информация по продукции.',
        keywords: 'информационные материалы инструкции справка применение'
    },
    {
        title: 'Контакты',
        type: 'Раздел',
        url: '/contacts/',
        description: 'Адрес, телефон, карта и способы связи с Pascal Medical.',
        keywords: 'контакты адрес телефон карта маршрут связаться'
    },
    {
        title: 'Изготовление пластиковых изделий',
        type: 'Услуга',
        url: '/service/?type=manufacturing',
        description: 'Производство пластиковых медицинских компонентов и изделий на современном оборудовании.',
        keywords: 'услуги изготовление пластиковых изделий литье пластик компоненты производство'
    },
    {
        title: 'Сборка',
        type: 'Услуга',
        url: '/service/?type=assembly',
        description: 'Сборка медицинских изделий, комплектация и контроль качества.',
        keywords: 'услуги сборка комплектация медицинские изделия контроль'
    },
    {
        title: 'Упаковка',
        type: 'Услуга',
        url: '/service/?type=packaging',
        description: 'Индивидуальная и групповая упаковка медицинских изделий.',
        keywords: 'услуги упаковка блистер бумага пленка маркировка'
    },
    {
        title: 'Стерилизация',
        type: 'Услуга',
        url: '/service/?type=sterilization',
        description: 'Собственная газовая стерилизация медицинской продукции.',
        keywords: 'услуги стерилизация газовая этиленоксид стерильность'
    },
    {
        title: 'Шприцы инъекционные однократного применения',
        type: 'Продукция',
        url: '/product-category/?cat=1',
        description: 'Одноразовые инъекционные шприцы с одной иглой.',
        keywords: 'продукция шприцы инъекционные одноразовые однократного применения одна игла'
    },
    {
        title: 'Шприцы с двумя иглами',
        type: 'Продукция',
        url: '/product-category/?cat=2',
        description: 'Инъекционные шприцы однократного применения с двумя иглами.',
        keywords: 'продукция шприцы две иглы инъекционные'
    },
    {
        title: 'Шприцы для инсулина',
        type: 'Продукция',
        url: '/product-category/?cat=3',
        description: 'Инсулиновые шприцы однократного применения.',
        keywords: 'продукция шприцы инсулин инсулиновые'
    },
    {
        title: 'Инфузионные и трансфузионные системы',
        type: 'Продукция',
        url: '/product-category/?cat=4',
        description: 'Системы для инфузии и трансфузии.',
        keywords: 'продукция инфузионные системы трансфузионные инфузия трансфузия'
    },
    {
        title: 'Иглы инъекционные стерильные',
        type: 'Продукция',
        url: '/product-category/?cat=5',
        description: 'Стерильные инъекционные иглы различных размеров.',
        keywords: 'продукция иглы инъекционные стерильные'
    },
    {
        title: 'Иглы инъекционные нестерильные',
        type: 'Продукция',
        url: '/product-category/?cat=6',
        description: 'Нестерильные инъекционные иглы для медицинского производства и комплектации.',
        keywords: 'продукция иглы инъекционные нестерильные'
    }
];

function normalizeSearchText(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/ё/g, 'е')
        .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[char]));
}

function buildDomSearchIndex() {
    const items = [];

    document.querySelectorAll('main h1, main h2, main h3, main .card-title').forEach((node) => {
        const title = node.textContent.trim();
        if (!title || title.length < 3) return;

        const section = node.closest('section');
        const sectionId = section?.id ? `#${section.id}` : window.location.pathname;
        const textContainer = node.closest('.card, section, article') || node.parentElement;
        const description = textContainer?.textContent
            ?.replace(/\s+/g, ' ')
            .trim()
            .slice(0, 180) || '';

        items.push({
            title,
            type: 'На этой странице',
            url: sectionId,
            description,
            keywords: `${title} ${description}`
        });
    });

    return items;
}

function getSearchIndex() {
    const seen = new Set();
    return [...BASE_SEARCH_INDEX, ...buildDomSearchIndex()].filter((item) => {
        const key = `${item.title}|${item.url}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    }).map((item) => ({
        ...item,
        haystack: normalizeSearchText(`${item.title} ${item.type} ${item.description} ${item.keywords}`)
    }));
}

let searchIndex = [];

function scoreSearchItem(item, terms, query) {
    const title = normalizeSearchText(item.title);
    const description = normalizeSearchText(item.description);
    let score = 0;

    if (title === query) score += 80;
    if (title.startsWith(query)) score += 45;
    if (title.includes(query)) score += 30;

    terms.forEach((term) => {
        if (title.includes(term)) score += 22;
        if (description.includes(term)) score += 9;
        if (item.haystack.includes(term)) score += 5;
    });

    if (score > 0 && item.type === 'Продукция') score += 3;
    if (score > 0 && item.type === 'Услуга') score += 2;

    return score;
}

function sendAnalyticsPayload(url, payload, useBeacon = false) {
    const body = JSON.stringify(payload);

    if (useBeacon && navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        if (navigator.sendBeacon(url, blob)) {
            return Promise.resolve();
        }
    }

    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true
    }).catch(() => {});
}

function saveSearchAnalytics(query, count) {
    if (!query || query.length < 2) return;

    sendAnalyticsPayload('/analytics/api/search/', { query, results_count: count });
}

function trackAnalyticsEvent(eventType, eventLabel = '', targetUrl = '', metadata = {}) {
    return sendAnalyticsPayload(
        '/analytics/api/event/',
        {
            event_type: eventType,
            event_label: eventLabel,
            page_url: window.location.pathname + window.location.search,
            target_url: targetUrl,
            metadata
        },
        eventType === 'search_result_click'
    );
}

let searchAnalyticsTimer = null;

function renderSearchResults(query) {
    if (!searchResults) return;

    const cleanQuery = normalizeSearchText(query);
    searchResults.innerHTML = '';

    if (cleanQuery.length < 2) {
        searchResults.innerHTML = `
            <div class="search-empty-state">
                <div class="search-empty-title">Начните вводить запрос</div>
                <div class="search-empty-text">Например: шприцы, документы, стерилизация, контакты, вакансии.</div>
            </div>
        `;
        return;
    }

    const terms = cleanQuery.split(' ').filter((term) => term.length > 1);
    const results = searchIndex
        .map((item) => ({ ...item, score: scoreSearchItem(item, terms, cleanQuery) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 12);

    clearTimeout(searchAnalyticsTimer);
    searchAnalyticsTimer = setTimeout(() => saveSearchAnalytics(query.trim(), results.length), 550);

    if (!results.length) {
        searchResults.innerHTML = `
            <div class="search-no-results">
                <div class="search-empty-title">Ничего не найдено</div>
                <div class="search-empty-text">Попробуйте: продукция, шприцы, иглы, документы, стерилизация.</div>
            </div>
        `;
        return;
    }

    const countLabel = results.length === 1 ? 'результат' : 'результатов';
    searchResults.innerHTML = `
        <div class="search-results-head">
            <span>Найдено: ${results.length} ${countLabel}</span>
            <span>Enter - открыть первый</span>
        </div>
    `;

    results.forEach((result, index) => {
        const item = document.createElement('a');
        item.className = 'search-result-item';
        item.href = result.url;
        item.dataset.searchResult = index;
        item.innerHTML = `
            <span class="search-result-badge">${escapeHtml(result.type)}</span>
            <span class="search-result-content">
                <span class="search-result-title">${escapeHtml(result.title)}</span>
                <span class="search-result-description">${escapeHtml(result.description)}</span>
            </span>
            <span class="search-result-arrow">→</span>
        `;
        item.addEventListener('click', (event) => {
            event.preventDefault();
            trackAnalyticsEvent('search_result_click', result.title, result.url, {
                query,
                result_type: result.type,
                position: index + 1
            });
            closeSearch();
            window.location.href = result.url;
        });
        searchResults.appendChild(item);
    });
}

function openSearch() {
    if (!searchOverlay || !searchInput) return;
    searchIndex = getSearchIndex();
    searchOverlay.classList.add('active');
    document.body.classList.add('search-open');
    trackAnalyticsEvent('search_open', 'Открытие поиска');
    renderSearchResults(searchInput.value);
    setTimeout(() => searchInput.focus(), 120);
}

function closeSearch() {
    if (!searchOverlay || !searchInput || !searchResults) return;
    searchOverlay.classList.remove('active');
    document.body.classList.remove('search-open');
    searchInput.value = '';
    searchResults.innerHTML = '';
}

if (searchBtn && searchOverlay && searchClose && searchInput && searchResults) {
    searchBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        openSearch();
    });

    searchClose.addEventListener('click', closeSearch);

    searchOverlay.addEventListener('click', (event) => {
        if (event.target === searchOverlay) closeSearch();
    });

    searchInput.addEventListener('input', (event) => {
        renderSearchResults(event.target.value);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearch();
        }

        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            openSearch();
        }

        if (event.key === 'Enter' && searchOverlay.classList.contains('active')) {
            const firstResult = searchResults.querySelector('[data-search-result="0"]');
            if (firstResult) firstResult.click();
        }
    });
}

// ========================================
// PHONE NUMBER COPY
// ========================================
const phoneBtn = document.getElementById('phoneBtn');
const footerPhoneBtn = document.getElementById('footerPhoneBtn');
const toast = document.getElementById('toast');

function copyPhoneNumber(button) {
    if (!button) return;
    const phoneNumber = button.getAttribute('data-phone');

    if (navigator.clipboard) {
        navigator.clipboard.writeText(phoneNumber).then(showToast).catch(() => fallbackCopy(phoneNumber));
    } else {
        fallbackCopy(phoneNumber);
    }
}

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
        document.execCommand('copy');
        showToast();
    } catch (error) {
        console.error('Copy failed:', error);
    }

    document.body.removeChild(textArea);
}

function showToast() {
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
}

if (phoneBtn) {
    phoneBtn.addEventListener('click', (event) => {
        event.preventDefault();
        trackAnalyticsEvent('phone_click', 'Телефон в шапке', phoneBtn.getAttribute('data-phone') || '');
        copyPhoneNumber(phoneBtn);
    });
}

if (footerPhoneBtn) {
    footerPhoneBtn.addEventListener('click', (event) => {
        event.preventDefault();
        trackAnalyticsEvent('phone_click', 'Телефон в футере', footerPhoneBtn.getAttribute('data-phone') || '');
        copyPhoneNumber(footerPhoneBtn);
    });
}

document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href') || '';
    const text = link.textContent.replace(/\s+/g, ' ').trim();

    if (href.includes('/contacts/')) {
        trackAnalyticsEvent('contact_click', text || 'Переход в контакты', href);
    } else if (href.includes('/product-category/') || href.includes('/product-detail/') || href.includes('/product-variant/')) {
        trackAnalyticsEvent('product_click', text || 'Переход в продукцию', href);
    } else if (href.includes('/service/')) {
        trackAnalyticsEvent('service_click', text || 'Переход в услугу', href);
    } else if (href.includes('/documents/')) {
        trackAnalyticsEvent('document_click', text || 'Переход в документы', href);
    }
});

// ========================================
// SMOOTH SCROLLING
// ========================================
const scrollLinks = document.querySelectorAll('.scroll-link, .logo-link, .footer-logo-link');

scrollLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        const href = link.getAttribute('href') || '';
        if (!href.startsWith('#')) return;

        event.preventDefault();

        if (href === '#top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const targetSection = document.querySelector(href);
        if (targetSection) {
            const headerHeight = document.querySelector('.main-header')?.offsetHeight || 0;
            const targetPosition = targetSection.offsetTop - headerHeight - 20;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// ========================================
// HEADER EFFECTS
// ========================================
const header = document.querySelector('.main-header');

if (header) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        header.style.boxShadow = currentScroll > 100
            ? '0 6px 30px rgba(91, 58, 153, 0.2)'
            : '0 4px 20px rgba(91, 58, 153, 0.12)';
    });
}

// ========================================
// CARD ANIMATIONS
// ========================================
const cards = document.querySelectorAll('.card');

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`;
        observer.observe(card);
    });

    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('service-card-visible');
                serviceObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -90px 0px'
    });

    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.12}s`;
        serviceObserver.observe(card);
    });
}

// ========================================
// LOADING ANIMATION
// ========================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1) translateY(0); }
        50% { transform: scale(1.03) translateY(-5px); box-shadow: 0 15px 45px rgba(91, 58, 153, 0.4); }
    }
`;
document.head.appendChild(style);

console.log('%c Pascal Medical ', 'background: #5B3A99; color: #fff; padding: 8px 15px; border-radius: 4px; font-weight: bold;');
