// ========================================
// VACANCIES DATA
// ========================================
const vacanciesData = {
    packer: {
        title: 'Упаковщик',
        salary: 'от 40 000 руб.',
        description: `
            <p>Мы приглашаем на работу упаковщиков медицинских изделий на современное производство.</p>
            
            <h3>Условия:</h3>
            <ul>
                <li>График работы сменный (2/2 день/вечер)</li>
                <li>Оформление по ТК РФ</li>
                <li>Место работы: г. Дубна, на территории работодателя. Предприятие находится на территории ОЭЗ ТВТ "Дубна" (Правобережная часть города)</li>
                <li>Своевременная выплата заработной платы</li>
                <li>Полный социальный пакет</li>
            </ul>
            
            <h3>Обязанности:</h3>
            <ul>
                <li>Обеспечение эффективной работы смены</li>
                <li>Обеспечение выполнения сменных производственных заданий</li>
                <li>Соблюдение установленной технологией производства медицинских изделий</li>
                <li>Обеспечение ритмичного выпуска продукции высокого качества</li>
                <li>Ведение документации, установленные нормативными требованиями в соответствии с требованиями ISO, GMP</li>
            </ul>
            
            <h3>Требования к кандидату:</h3>
            <ul>
                <li>Среднее специальное образование</li>
                <li>Опыт работы от 1 года</li>
            </ul>
            
            <div class="modal-contact">
                <p><strong>Контактное лицо:</strong> Янчук Елена Анатольевна</p>
                <p><strong>Телефон:</strong> +7(495)1502080, доб. 111 с 10:00 до 14:00</p>
                <p><strong>E-mail:</strong> e.yanchuk@pascal-med.ru</p>
            </div>
        `
    },
    operator: {
        title: 'Оператор',
        salary: 'от 50 000 руб.',
        description: `
            <p>Приглашаем на работу операторов производственных линий для работы на современном оборудовании.</p>
            
            <h3>Условия:</h3>
            <ul>
                <li>График работы 5/2</li>
                <li>Оформление по ТК РФ</li>
                <li>Место работы: г. Дубна, ул. Электронная, дом 8, корпус 1</li>
                <li>Своевременная выплата заработной платы</li>
                <li>Обучение на рабочем месте</li>
            </ul>
            
            <h3>Обязанности:</h3>
            <ul>
                <li>Управление автоматизированным оборудованием</li>
                <li>Контроль качества выпускаемой продукции</li>
                <li>Ведение технической документации</li>
                <li>Соблюдение требований охраны труда и техники безопасности</li>
                <li>Оперативное устранение неисправностей, допускающих работу основного, вспомогательного и других видов оборудования</li>
            </ul>
            
            <h3>Требования к кандидату:</h3>
            <ul>
                <li>Среднее специальное образование</li>
                <li>Опыт работы оператором от 1 года</li>
                <li>Внимательность и ответственность</li>
            </ul>
            
            <div class="modal-contact">
                <p><strong>Контактное лицо:</strong> Янчук Елена Анатольевна</p>
                <p><strong>Телефон:</strong> +7(495)1502080, доб. 111 с 10:00 до 14:00</p>
                <p><strong>E-mail:</strong> e.yanchuk@pascal-med.ru</p>
            </div>
        `
    },
    mechanic: {
        title: 'Механик',
        salary: 'от 60 000 руб.',
        description: `
            <p>Приглашаем механика для обслуживания современного производственного оборудования.</p>
            
            <h3>Условия:</h3>
            <ul>
                <li>График работы 5/2</li>
                <li>Оформление по ТК РФ</li>
                <li>Место работы: г. Дубна, ул. Электронная, дом 8, корпус 1</li>
                <li>Конкурентная заработная плата</li>
                <li>Профессиональное развитие и обучение</li>
            </ul>
            
            <h3>Обязанности:</h3>
            <ul>
                <li>Техническое обслуживание и ремонт производственного оборудования</li>
                <li>Диагностика и устранение неисправностей</li>
                <li>Проведение профилактических работ</li>
                <li>Ведение технической документации</li>
                <li>Участие в модернизации оборудования</li>
            </ul>
            
            <h3>Требования к кандидату:</h3>
            <ul>
                <li>Среднее специальное или высшее техническое образование</li>
                <li>Опыт работы механиком от 2 лет</li>
                <li>Знание устройства промышленного оборудования</li>
                <li>Умение читать техническую документацию</li>
            </ul>
            
            <div class="modal-contact">
                <p><strong>Контактное лицо:</strong> Янчук Елена Анатольевна</p>
                <p><strong>Телефон:</strong> +7(495)1502080, доб. 111 с 10:00 до 14:00</p>
                <p><strong>E-mail:</strong> e.yanchuk@pascal-med.ru</p>
            </div>
        `
    }
};

// ========================================
// MODAL LOGIC
// ========================================
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');
const vacancyButtons = document.querySelectorAll('.vacancy-btn');

// Открытие модального окна
vacancyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const vacancyId = button.getAttribute('data-vacancy');
        const vacancy = vacanciesData[vacancyId];
        
        if (vacancy) {
            modalContent.innerHTML = `
                <h2>${vacancy.title}</h2>
                <p class="modal-salary">${vacancy.salary}</p>
                ${vacancy.description}
            `;
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Закрытие модального окна
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});
