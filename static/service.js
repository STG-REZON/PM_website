// ========================================
// SERVICE PAGE DATA
// ========================================
const servicesData = {
    manufacturing: {
        title: 'Изготовление пластиковых изделий',
        images: [
            'img/img_photo/1_1.jpg',
            'img/img_photo/1_2.jpg',
            'img/img_photo/1_3.jpg'
        ],
        description: `
            <p><strong>Изготовление пластиковых изделий</strong> — один из ключевых видов нашей деятельности. Мы используем современное оборудование и передовые технологии для производства высококачественной продукции.</p>
            
            <h3>Наши возможности:</h3>
            <ul>
                <li>Литье под давлением пластиковых деталей любой сложности</li>
                <li>Производство медицинских компонентов в соответствии с международными стандартами</li>
                <li>Контроль качества на всех этапах производства</li>
                <li>Работа с различными типами пластмасс (PP, PE, PS и др.)</li>
                <li>Изготовление изделий по индивидуальным чертежам</li>
            </ul>
            
            <h3>Преимущества:</h3>
            <ul>
                <li>Высокая точность изготовления</li>
                <li>Сертифицированное производство</li>
                <li>Короткие сроки выполнения заказов</li>
                <li>Конкурентные цены</li>
            </ul>
            
            <p>Наше производство оснащено современными термопластавтоматами ведущих мировых производителей, что позволяет нам выпускать продукцию высочайшего качества.</p>
        `
    },
    assembly: {
        title: 'Сборка',
        images: [
            'img/img_photo/1_1.jpg',
            'img/img_photo/1_2.jpg',
            'img/img_photo/1_3.jpg'
        ],
        description: `
            <p><strong>Сборка медицинских изделий</strong> — ответственный процесс, требующий высокой квалификации персонала и строгого соблюдения технологических норм.</p>
            
            <h3>Виды сборочных работ:</h3>
            <ul>
                <li>Сборка шприцев инъекционных всех типов</li>
                <li>Комплектация инфузионных систем</li>
                <li>Монтаж игл и канюль</li>
                <li>Финальная проверка готовых изделий</li>
                <li>Упаковка в индивидуальную тару</li>
            </ul>
            
            <h3>Контроль качества:</h3>
            <ul>
                <li>Визуальный контроль каждого изделия</li>
                <li>Проверка герметичности</li>
                <li>Контроль размеров и функциональности</li>
                <li>Соответствие требованиям GMP</li>
            </ul>
            
            <p>Все сборочные операции проводятся в чистых помещениях класса D с соблюдением всех санитарно-гигиенических норм.</p>
        `
    },
    packaging: {
        title: 'Упаковка',
        images: [
            'img/img_photo/1_1.jpg',
            'img/img_photo/1_2.jpg',
            'img/img_photo/1_3.jpg'
        ],
        description: `
            <p><strong>Упаковка медицинских изделий</strong> — завершающий этап производства, обеспечивающий сохранность продукции и её стерильность до момента использования.</p>
            
            <h3>Виды упаковки:</h3>
            <ul>
                <li>Блистерная упаковка (формование и запайка)</li>
                <li>Индивидуальная бумажно-пленочная упаковка</li>
                <li>Групповая картонная упаковка</li>
                <li>Транспортная упаковка</li>
                <li>Маркировка и этикетирование</li>
            </ul>
            
            <h3>Оборудование:</h3>
            <ul>
                <li>Автоматические блистерные машины</li>
                <li>Термоупаковочные аппараты</li>
                <li>Картонажное оборудование</li>
                <li>Системы автоматической маркировки</li>
            </ul>
            
            <p>Используемые материалы соответствуют требованиям для медицинских изделий и обеспечивают надежную защиту продукции.</p>
        `
    },
    sterilization: {
        title: 'Стерилизация',
        images: [
            'img/img_photo/1_1.jpg',
            'img/img_photo/1_2.jpg',
            'img/img_photo/1_3.jpg'
        ],
        description: `
            <p><strong>Стерилизация</strong> — критически важный процесс обработки медицинских изделий, обеспечивающий их полную микробиологическую безопасность.</p>
            
            <h3>Методы стерилизации:</h3>
            <ul>
                <li>Радиационная стерилизация (гамма-излучение)</li>
                <li>Этиленоксидная стерилизация (ЭО)</li>
                <li>Паровая стерилизация (автоклавирование)</li>
                <li>Плазменная стерилизация</li>
            </ul>
            
            <h3>Преимущества наших услуг:</h3>
            <ul>
                <li>Полный цикл валидации процессов стерилизации</li>
                <li>Контроль стерильности в аккредитованной лаборатории</li>
                <li>Соответствие международным стандартам ISO 11137, ISO 11135</li>
                <li>Документальное подтверждение каждой партии</li>
                <li>Короткие сроки выполнения заказов</li>
            </ul>
            
            <p>Наше оборудование и процессы регулярно проходят аудит и соответствуют всем требованиям регуляторных органов.</p>
        `
    }
};

// ========================================
// SLIDER LOGIC
// ========================================
let currentSlide = 0;
let totalSlides = 0;

function initSlider(images) {
    const wrapper = document.getElementById('sliderWrapper');
    const dotsContainer = document.getElementById('sliderDots');
    
    // Очистка
    wrapper.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    // Добавление слайдов
    images.forEach((img, index) => {
        const slide = document.createElement('div');
        slide.className = 'slider-slide';
        slide.innerHTML = `<img src="${img}" alt="Слайд ${index + 1}">`;
        wrapper.appendChild(slide);
        
        // Добавление точек
        const dot = document.createElement('button');
        dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });
    
    totalSlides = images.length;
    currentSlide = 0;
    updateSlider();
}

function updateSlider() {
    const wrapper = document.getElementById('sliderWrapper');
    const dots = document.querySelectorAll('.slider-dot');
    
    wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

// ========================================
// PAGE INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Получение типа услуги из URL
    const urlParams = new URLSearchParams(window.location.search);
    const serviceType = urlParams.get('type') || 'manufacturing';
    
    // Загрузка данных
    const service = servicesData[serviceType];
    
    if (service) {
        document.getElementById('serviceTitle').textContent = service.title;
        document.getElementById('serviceName').textContent = service.title;
        document.getElementById('serviceDescription').innerHTML = service.description;
        
        // Инициализация слайдера
        initSlider(service.images);
    }
    
    // События навигации слайдера
    document.getElementById('nextSlide').addEventListener('click', nextSlide);
    document.getElementById('prevSlide').addEventListener('click', prevSlide);
    
    // Автопрокрутка (опционально)
    // setInterval(nextSlide, 5000);
});
// === ДОПОЛНЕНИЕ К service.js ===

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceType = urlParams.get('type') || 'manufacturing';
  const service = servicesData[serviceType];

  if (service) {
    // существующий код инициализации уже проставляет заголовки и слайды
    // добавим предзаполнение поля «Услуга» в форму
    const cfService = document.getElementById('cfService');
    if (cfService) cfService.value = service.title;
  }

  // Инициализация маски телефона
  const phoneInput = document.getElementById('cfPhone');
  if (phoneInput) {
    const formatPhone = (value) => {
      const digits = value.replace(/\D/g, '');
      const trimmed = digits.slice(0, 11);
      let res = '+7 (';
      const src = trimmed.startsWith('8') ? '7' + trimmed.slice(1) : trimmed;
      const base = src.startsWith('7') ? src.slice(1) : src; // храним 10 оставшихся цифр
      if (base.length > 0) res += base.substring(0, 3);
      if (base.length >= 3) res += ') ' + base.substring(3, 6);
      if (base.length >= 6) res += '-' + base.substring(6, 8);
      if (base.length >= 8) res += '-' + base.substring(8, 10);
      return res;
    };
    phoneInput.addEventListener('input', () => {
      const caretToEnd = document.activeElement === phoneInput;
      phoneInput.value = formatPhone(phoneInput.value);
      if (caretToEnd) phoneInput.selectionStart = phoneInput.selectionEnd = phoneInput.value.length;
    });
    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value) phoneInput.value = '+7 (';
    });
    phoneInput.addEventListener('blur', () => {
      if (phoneInput.value.replace(/\D/g, '').length < 11) phoneInput.value = '';
    });
  }

  // Обработка отправки формы
  const form = document.getElementById('serviceContactForm');
  const statusEl = document.getElementById('cfStatus');
  const submitBtn = document.getElementById('cfSubmit');

  if (form && statusEl && submitBtn) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // honeypot
      const honey = form.querySelector('.hp-field');
      if (honey && honey.value) return; // тихо игнорируем ботов

      // простая валидация
      const name = document.getElementById('cfName').value.trim();
      const phone = document.getElementById('cfPhone').value.trim();
      const email = document.getElementById('cfEmail').value.trim();
      const message = document.getElementById('cfMessage').value.trim();
      const serviceName = document.getElementById('cfService').value.trim();
      const consent = document.getElementById('cfConsent').checked;

      if (!name || !phone || !consent) {
        statusEl.textContent = 'Проверьте корректность имени, телефона и согласия.';
        statusEl.className = 'form-status err';
        return;
      }

      // построение полезной нагрузки
      const payload = {
        name,
        phone,
        email,
        message,
        service: serviceName,
        page: window.location.href,
        ts: new Date().toISOString()
      };

      // отправка
      submitBtn.disabled = true;
      const origText = submitBtn.textContent;
      submitBtn.textContent = 'Отправка…';
      statusEl.textContent = '';
      statusEl.className = 'form-status';

      try {
        // ВАРИАНТ 1: реальный API
        // const resp = await fetch('/api/feedback', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(payload)
        // });
        // if (!resp.ok) throw new Error('Bad status');

        // ВАРИАНТ 2: имитация, пока API не подключён
        await new Promise(r => setTimeout(r, 800));

        statusEl.textContent = 'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.';
        statusEl.className = 'form-status ok';

        // очистка полей, кроме названия услуги
        form.reset();
        document.getElementById('cfService').value = serviceName;
      } catch (err) {
        statusEl.textContent = 'Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь по телефону.';
        statusEl.className = 'form-status err';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = origText;
      }
    });
  }
});
    