document.addEventListener('DOMContentLoaded', function() {
    const tiredBtn = document.getElementById('tired-btn');
    const hamburger = document.createElement('div');
    let fallMode = false;
    let gyroMode = false;
    
    // Создаем гамбургер меню
    createHamburgerMenu();
    
    // Создаем анимированный фон с частицами
    createParticles();
    
    // Добавляем анимацию появления элементов при прокрутке
    initScrollAnimation();
    
    // Проверка поддержки гироскопа
    if (window.DeviceOrientationEvent) {
        console.log('Гироскоп поддерживается');
    } else {
        console.log('Гироскоп не поддерживается');
    }
    
    // Обработчик кнопки "Устал"
    tiredBtn.addEventListener('click', function() {
        if (!fallMode) {
            activateFallMode();
        } else {
            deactivateFallMode();
        }
    });
    
    // Обработчик данных гироскопа
    function handleOrientation(event) {
        if (!gyroMode) return;
        
        const beta = event.beta;  // Наклон вперед-назад (-180 до 180)
        const gamma = event.gamma; // Наклон влево-вправо (-90 до 90)
        
        // Мягко изменяем положение элементов в зависимости от наклона
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            if (el !== document.body && el !== document.documentElement && !el.classList.contains('particle')) {
                const currentTransform = el.style.transform || '';
                const rotateMatch = currentTransform.match(/rotate\(([^)]+)deg\)/);
                const currentRotate = rotateMatch ? parseFloat(rotateMatch[1]) : 0;
                
                const newRotateX = currentRotate + gamma * 0.1;
                const newRotateY = currentRotate + beta * 0.1;
                
                el.style.transform = `rotateX(${newRotateX}deg) rotateY(${newRotateY}deg) ${currentTransform.replace(/rotateX\([^)]+deg\)\s*rotateY\([^)]+deg\)\s*/, '')}`;
            }
        });
    }
    
    // Плавная прокрутка для навигации
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Закрываем меню если открыто на мобильном
                if (window.innerWidth <= 768) {
                    document.querySelector('.nav-links').classList.remove('active');
                    document.querySelector('.hamburger').classList.remove('active');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Функция создания гамбургер меню
    function createHamburgerMenu() {
        hamburger.className = 'hamburger';
        hamburger.innerHTML = '<span></span><span></span><span></span>';
        
        const nav = document.querySelector('nav');
        nav.appendChild(hamburger);
        
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            document.querySelector('.nav-links').classList.toggle('active');
            
            // Блокируем прокрутку при открытом меню
            if (this.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                document.querySelector('.nav-links').classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Функция создания частиц для фона
    function createParticles() {
        // Создаем частицы только для устройств с достаточной производительностью
        if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const bgContainer = document.createElement('div');
            bgContainer.className = 'animated-bg';
            
            for (let i = 1; i <= 8; i++) {
                const particle = document.createElement('div');
                particle.className = `particle particle-${i}`;
                bgContainer.appendChild(particle);
            }
            
            document.body.appendChild(bgContainer);
        }
    }
    
    // Функция для анимации появления элементов при прокрутке
    function initScrollAnimation() {
        const elementsToAnimate = document.querySelectorAll('.about-content, .film-grid, .contact, .film-card');
        
        elementsToAnimate.forEach(el => {
            el.classList.add('fade-in');
        });
        
        function checkScroll() {
            elementsToAnimate.forEach(el => {
                const elementTop = el.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight * 0.85) {
                    el.classList.add('visible');
                }
            });
        }
        
        // Проверяем при загрузке и при прокрутке
        checkScroll();
        window.addEventListener('scroll', checkScroll);
    }
    
    // Функция активации режима падения
    function activateFallMode() {
        document.body.classList.add('fall-mode');
        
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            if (el !== document.body && el !== document.documentElement && !el.classList.contains('particle')) {
                const randomRotate = Math.random() * 20 - 10;
                const randomTranslateX = Math.random() * 100 - 50;
                const randomTranslateY = Math.random() * 100 + 100;
                
                el.style.transform = `rotate(${randomRotate}deg) translate(${randomTranslateX}px, ${randomTranslateY}px)`;
                el.style.opacity = '0.8';
            }
        });
        
        tiredBtn.textContent = 'Вернуть';
        fallMode = true;
        
        if (window.DeviceOrientationEvent) {
            gyroMode = true;
            window.addEventListener('deviceorientation', handleOrientation);
        }
    }
    
    // Функция деактивации режима падения
    function deactivateFallMode() {
        document.body.classList.remove('fall-mode');
        
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            el.style.transform = '';
            el.style.opacity = '';
        });
        
        tiredBtn.textContent = 'Устал';
        fallMode = false;
        gyroMode = false;
        
        window.removeEventListener('deviceorientation', handleOrientation);
    }
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', function() {
        // Закрываем меню при изменении размера на большой экран
        if (window.innerWidth > 768) {
            document.querySelector('.nav-links').classList.remove('active');
            document.querySelector('.hamburger').classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Обработчик для устройств с сенсорным экраном
    if ('ontouchstart' in window) {
        document.documentElement.classList.add('touch-device');
        
        // Улучшаем обработку hover для touch-устройств
        document.addEventListener('touchstart', function() {}, {passive: true});
    }
});