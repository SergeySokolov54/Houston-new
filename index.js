// ПЛАВНОЕ ПОЯВЛЕНИЕ КАРТИНОК
document.addEventListener('DOMContentLoaded', function() {
    const pictures = document.querySelectorAll('.Pictures');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { 
        threshold: 0.2,
        rootMargin: '0px'
    });

    pictures.forEach(pic => observer.observe(pic));

    // ИНТЕРАКТИВНЫЕ ТЕСТЫ
    const tests = document.querySelectorAll('.test');

    tests.forEach(test => {
        const options = test.querySelectorAll('.test-option');
        const feedback = test.querySelector('.test-feedback');

        options.forEach(option => {
            option.addEventListener('click', function() {
                if (this.disabled) return;
                
                options.forEach(opt => opt.disabled = true);
                
                const isCorrect = this.hasAttribute('data-correct');
                
                options.forEach(opt => {
                    if (opt.hasAttribute('data-correct')) {
                        opt.classList.add('correct');
                    }
                });
                
                if (isCorrect) {
                    this.classList.add('correct');
                    feedback.innerHTML = '✅ <strong>Правильно!</strong> Отличный ответ!';
                    feedback.style.color = '#4CAF50';
                    feedback.style.background = 'rgba(76, 175, 80, 0.1)';
                } else {
                    this.classList.add('wrong');
                    feedback.innerHTML = '❌ <strong>Неправильно.</strong> Попробуй ещё раз в следующих тестах!';
                    feedback.style.color = '#f44336';
                    feedback.style.background = 'rgba(244, 67, 54, 0.1)';
                    
                    const correctAnswer = Array.from(options).find(opt => opt.hasAttribute('data-correct'));
                    if (correctAnswer) {
                        feedback.innerHTML += `<br><small>Правильный ответ: ${correctAnswer.textContent}</small>`;
                    }
                }
            });
        });
    });

    // ========== ПЛАВНЫЙ СКРОЛЛ ДО НАЧАЛА КОНТЕНТА ==========
    console.log('Скрипт загружен');

    const scrollButton = document.querySelector('.scroll-link');
    const polosaElement = document.getElementById('first-section');
    const videoContainer = document.querySelector('.video-container');

    console.log('Кнопка:', scrollButton);
    console.log('Контент:', polosaElement);

    if (scrollButton && polosaElement && videoContainer) {
        scrollButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Клик!');
            
            // Анимация стрелки
            const arrow = this.querySelector('.arrow-down');
            if (arrow) {
                arrow.style.transform = 'scale(0.7)';
                setTimeout(() => {
                    arrow.style.transform = 'scale(1)';
                }, 200);
            }
            
            // Получаем позицию начала контента
            const targetY = polosaElement.offsetTop // Небольшой отступ
            const startY = window.scrollY;
            const distance = targetY - startY;
            const duration = 2000;
            const startTime = performance.now();
            
            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Самая плавная функция для скролла
                // easeInOutCubic
                let easeProgress;
                if (progress < 0.5) {
                    easeProgress = 4 * progress * progress * progress;
                } else {
                    easeProgress = 1 - Math.pow(-2 * progress + 2, 3) / 2;
                }
                
                window.scrollTo(0, startY + distance * easeProgress);
                
                if (elapsed < duration) {
                    requestAnimationFrame(animate);
                }
            }
            
            requestAnimationFrame(animate);
        });
    }
});