// ========================================
// SEARCH FUNCTIONALITY
// ========================================
const searchBtn = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Collect all searchable content
const searchableContent = [];

document.querySelectorAll('.card').forEach(card => {
    const title = card.querySelector('.card-title')?.textContent || '';
    const description = card.querySelector('.card-description')?.textContent || '';
    const searchTerms = card.getAttribute('data-search') || '';
    const section = card.closest('section')?.id || '';
    const type = section === 'services' ? 'Услуга' : 'Продукция';
    
    searchableContent.push({
        title: title.trim(),
        description: description.trim(),
        searchTerms: (title + ' ' + description + ' ' + searchTerms).toLowerCase(),
        type: type,
        element: card
    });
});

// Open search overlay
searchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    searchOverlay.classList.add('active');
    setTimeout(() => {
        searchInput.focus();
    }, 300);
});

// Close search overlay
function closeSearch() {
    searchOverlay.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '';
}

searchClose.addEventListener('click', closeSearch);

// Close search on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        closeSearch();
    }
});

// Close search when clicking on overlay
searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
        closeSearch();
    }
});

// Real-time search
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    searchResults.innerHTML = '';
    
    if (query.length < 2) {
        return;
    }
    
    const results = searchableContent
        .map(item => {
            let score = 0;
            const terms = query.split(' ').filter(t => t.length > 1);
            
            terms.forEach(term => {
                if (item.title.toLowerCase().includes(term)) score += 10;
                if (item.description.toLowerCase().includes(term)) score += 5;
                if (item.searchTerms.includes(term)) score += 3;
            });
            
            return { ...item, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">Ничего не найдено</div>';
        return;
    }
    
    results.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'search-result-item';
        resultDiv.innerHTML = `
            <div class="search-result-title">${result.title}</div>
            <div class="search-result-type">${result.type}</div>
        `;
        
        resultDiv.addEventListener('click', () => {
            closeSearch();
            
            const headerHeight = document.querySelector('.main-header').offsetHeight;
            const elementPosition = result.element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight - 30;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            result.element.style.animation = 'pulse 0.8s ease';
            setTimeout(() => {
                result.element.style.animation = '';
            }, 800);
        });
        
        searchResults.appendChild(resultDiv);
    });
});

// ========================================
// PHONE NUMBER COPY
// ========================================
const phoneBtn = document.getElementById('phoneBtn');
const footerPhoneBtn = document.getElementById('footerPhoneBtn');
const toast = document.getElementById('toast');

function copyPhoneNumber(button) {
    const phoneNumber = button.getAttribute('data-phone');
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(phoneNumber).then(() => {
            showToast();
        }).catch(() => fallbackCopy(phoneNumber));
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
    } catch (err) {
        console.error('Copy failed:', err);
    }
    document.body.removeChild(textArea);
}

function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

phoneBtn.addEventListener('click', (e) => {
    e.preventDefault();
    copyPhoneNumber(phoneBtn);
});

footerPhoneBtn.addEventListener('click', (e) => {
    e.preventDefault();
    copyPhoneNumber(footerPhoneBtn);
});

// ========================================
// SMOOTH SCROLLING
// ========================================
const scrollLinks = document.querySelectorAll('.scroll-link, .logo-link, .footer-logo-link');

scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href;
            
            if (targetId === '#top') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const headerHeight = document.querySelector('.main-header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }
    });
});

// ========================================
// HEADER EFFECTS
// ========================================
const header = document.querySelector('.main-header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 6px 30px rgba(91, 58, 153, 0.2)';
    } else {
        header.style.boxShadow = '0 4px 20px rgba(91, 58, 153, 0.12)';
    }
});

// ========================================
// CARD ANIMATIONS
// ========================================
const cards = document.querySelectorAll('.card');

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`;
    observer.observe(card);
});

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

// Pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1) translateY(0); }
        50% { transform: scale(1.03) translateY(-5px); box-shadow: 0 15px 45px rgba(91, 58, 153, 0.4); }
    }
`;
document.head.appendChild(style);

console.log('%c Pascal Medical ', 'background: #5B3A99; color: #fff; padding: 8px 15px; border-radius: 4px; font-weight: bold;');
