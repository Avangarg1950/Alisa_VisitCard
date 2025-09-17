document.addEventListener('DOMContentLoaded', function() {
    const tiredBtn = document.getElementById('tired-btn');
    let fallMode = false;
    let gyroMode = false;
    
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
            // Активируем режим падения
            document.body.classList.add('fall-mode');
            
            // Заставляем все элементы "упасть"
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
            
            // Проверяем поддержку гироскопа и активируем его
            if (window.DeviceOrientationEvent) {
                gyroMode = true;
                window.addEventListener('deviceorientation', handleOrientation);
            }
        } else {
            // Деактивируем режим падения
            document.body.classList.remove('fall-mode');
            
            // Возвращаем элементы на место
            const allElements = document.querySelectorAll('*');
            allElements.forEach(el => {
                el.style.transform = '';
                el.style.opacity = '';
            });
            
            tiredBtn.textContent = 'Устал';
            fallMode = false;
            gyroMode = false;
            
            // Удаляем обработчик гироскопа
            window.removeEventListener('deviceorientation', handleOrientation);
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
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Функция создания частиц для фона
    function createParticles() {
        const bgContainer = document.createElement('div');
        bgContainer.className = 'animated-bg';
        
        // Создаем 8 частиц (уже есть в CSS, добавляем в DOM)
        for (let i = 1; i <= 8; i++) {
            const particle = document.createElement('div');
            particle.className = `particle particle-${i}`;
            bgContainer.appendChild(particle);
        }
        
        document.body.appendChild(bgContainer);
    }
    
    // Функция для анимации появления элементов при прокрутке
    function initScrollAnimation() {
        const elementsToAnimate = document.querySelectorAll('.about-content, .film-grid, .contact');
        
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
});