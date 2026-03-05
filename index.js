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
            const targetY = polosaElement.offsetTop;
            const startY = window.scrollY;
            const distance = targetY - startY;
            const duration = 2000;
            const startTime = performance.now();
            
            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
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

    // ========== ВЕРТИКАЛЬНЫЙ ПРОГРЕСС БАР СБОКУ ==========
    // Создаем вертикальный прогресс бар, если его нет
    if (!document.querySelector('.progress-sidebar')) {
        const sidebar = document.createElement('div');
        sidebar.className = 'progress-sidebar';
        sidebar.innerHTML = `
            <div class="progress-sidebar-bar" id="sidebarProgressBar"></div>
            <span class="progress-sidebar-text" id="progressText">0%</span>
        `;
        document.body.appendChild(sidebar);
    }

    // Функция обновления вертикального прогресс бара
    function updateSidebarProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        const sidebarBar = document.getElementById('sidebarProgressBar');
        const progressText = document.getElementById('progressText');
        
        if (sidebarBar) {
            sidebarBar.style.height = scrolled + '%';
        }
        
        if (progressText) {
            progressText.textContent = Math.round(scrolled) + '%';
        }
        
        // Добавляем активный класс для анимации при достижении определенных процентов
        if (scrolled > 95) {
            sidebarBar.style.background = 'linear-gradient(180deg, #4CAF50 0%, #45a049 100%)';
        } else if (scrolled > 75) {
            sidebarBar.style.background = 'linear-gradient(180deg, #FFC107 0%, #FFB300 100%)';
        } else {
            sidebarBar.style.background = 'linear-gradient(180deg, rgb(133, 144, 177) 0%, #9aa9c7 50%, rgb(133, 144, 177) 100%)';
        }
    }

    // Клик по прогресс бару для прокрутки к определенному месту
    const progressSidebar = document.querySelector('.progress-sidebar');
    if (progressSidebar) {
        progressSidebar.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Получаем позицию клика относительно высоты бара
            const rect = this.getBoundingClientRect();
            const clickY = e.clientY - rect.top;
            const clickPercent = clickY / rect.height;
            
            // Прокручиваем страницу на соответствующий процент
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const targetScroll = scrollHeight * clickPercent;
            
            window.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
        });
        
        // Добавляем подсказки при наведении на разные части бара
        progressSidebar.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const hoverY = e.clientY - rect.top;
            const hoverPercent = (hoverY / rect.height) * 100;
            
            // Находим ближайший раздел
            const sections = document.querySelectorAll('h2, h3');
            let closestSection = null;
            let closestDistance = Infinity;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionPercent = (sectionTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
                const distance = Math.abs(sectionPercent - hoverPercent);
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestSection = section;
                }
            });
            
            // Обновляем текст с названием раздела
            const progressText = document.getElementById('progressText');
            if (progressText && closestSection && closestDistance < 10) {
                const sectionName = closestSection.textContent.trim().substring(0, 30);
                progressText.textContent = sectionName + (sectionName.length >= 30 ? '...' : '');
            } else if (progressText) {
                progressText.textContent = Math.round(hoverPercent) + '%';
            }
        });
    }

    // Обновляем прогресс при скролле
    window.addEventListener('scroll', updateSidebarProgress);
    window.addEventListener('resize', updateSidebarProgress);
    
    // Обновляем при загрузке
    updateSidebarProgress();

    // Добавляем маркеры разделов на прогресс бар (опционально)
    function addSectionMarkers() {
        const sections = document.querySelectorAll('h2');
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionPercent = (sectionTop / scrollHeight) * 100;
            
            // Создаем маркер
            const marker = document.createElement('div');
            marker.className = 'progress-section-marker';
            marker.style.position = 'absolute';
            marker.style.left = '-3px';
            marker.style.bottom = sectionPercent + '%';
            marker.style.width = '6px';
            marker.style.height = '6px';
            marker.style.borderRadius = '50%';
            marker.style.backgroundColor = 'white';
            marker.style.boxShadow = '0 0 10px white';
            marker.style.zIndex = '10000';
            
            document.querySelector('.progress-sidebar')?.appendChild(marker);
        });
    }
    
    // Раскомментируйте, если хотите добавить маркеры разделов
    // addSectionMarkers();


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
            const targetY = polosaElement.offsetTop;
            const startY = window.scrollY;
            const distance = targetY - startY;
            const duration = 2000;
            const startTime = performance.now();
            
            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
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

    // ========== УЛУЧШЕННЫЙ ВЕРТИКАЛЬНЫЙ ПРОГРЕСС БАР ==========
    
    // Создаем вертикальный прогресс бар с маркером
    if (!document.querySelector('.progress-sidebar')) {
        const sidebar = document.createElement('div');
        sidebar.className = 'progress-sidebar';
        sidebar.innerHTML = `
            <div class="progress-sidebar-bar" id="sidebarProgressBar"></div>
            <span class="progress-sidebar-text" id="progressText">0%</span>
            <div class="progress-sidebar-marker" id="progressMarker"></div>
        `;
        document.body.appendChild(sidebar);
    }

    // Функция обновления прогресс бара
    function updateSidebarProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        const sidebarBar = document.getElementById('sidebarProgressBar');
        const progressText = document.getElementById('progressText');
        const progressMarker = document.getElementById('progressMarker');
        const sidebar = document.querySelector('.progress-sidebar');
        
        if (sidebarBar) {
            sidebarBar.style.height = scrolled + '%';
        }
        
        if (progressText) {
            progressText.textContent = Math.round(scrolled) + '%';
            
            // Меняем текст в зависимости от прогресса
            if (scrolled < 10) {
                progressText.innerHTML = '🚀 ' + Math.round(scrolled) + '%';
            } else if (scrolled > 90) {
                progressText.innerHTML = '🏁 ' + Math.round(scrolled) + '%';
            } else {
                progressText.innerHTML = '📖 ' + Math.round(scrolled) + '%';
            }
        }
        
        // Обновляем позицию маркера
        if (progressMarker && sidebar) {
            const sidebarHeight = sidebar.offsetHeight;
            const markerPosition = (sidebarHeight * scrolled) / 100;
            progressMarker.style.bottom = markerPosition + 'px';
        }
        
        // Меняем цвет в зависимости от прогресса
        if (scrolled > 95) {
            sidebarBar.style.background = 'linear-gradient(180deg, #4CAF50 0%, #45a049 100%)';
            document.querySelector('.progress-sidebar').style.borderColor = '#4CAF50';
        } else if (scrolled > 75) {
            sidebarBar.style.background = 'linear-gradient(180deg, #FFC107 0%, #FFB300 100%)';
            document.querySelector('.progress-sidebar').style.borderColor = '#FFC107';
        } else if (scrolled > 50) {
            document.querySelector('.progress-sidebar').style.borderColor = '#64ffda';
        } else {
            document.querySelector('.progress-sidebar').style.borderColor = 'rgba(133, 144, 177, 0.9)';
        }
    }

    // Клик по прогресс бару для прокрутки
    const progressSidebar = document.querySelector('.progress-sidebar');
    if (progressSidebar) {
        progressSidebar.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Получаем позицию клика
            const rect = this.getBoundingClientRect();
            const clickY = e.clientY - rect.top;
            const clickPercent = clickY / rect.height;
            
            // Прокручиваем страницу
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const targetScroll = scrollHeight * clickPercent;
            
            window.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
        });
        
        // Показываем точный процент при наведении на разные части
        progressSidebar.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const hoverY = e.clientY - rect.top;
            const hoverPercent = Math.round((hoverY / rect.height) * 100);
            
            const progressText = document.getElementById('progressText');
            if (progressText) {
                progressText.innerHTML = '👆 ' + hoverPercent + '%';
            }
        });
        
        // Возвращаем обычный текст при уходе мыши
        progressSidebar.addEventListener('mouseleave', function() {
            updateSidebarProgress();
        });
    }

    // Обновляем прогресс при событиях
    window.addEventListener('scroll', updateSidebarProgress);
    window.addEventListener('resize', updateSidebarProgress);
    
    // Обновляем при загрузке
    updateSidebarProgress();

    // Добавляем эффект свечения при достижении ключевых точек
    function checkMilestones() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = Math.round((winScroll / height) * 100);
        
        const milestones = [25, 50, 75, 100];
        if (milestones.includes(scrolled)) {
            const sidebar = document.querySelector('.progress-sidebar');
            sidebar.style.transform = 'translateY(-50%) scale(1.05)';
            setTimeout(() => {
                sidebar.style.transform = 'translateY(-50%) scale(1)';
            }, 300);
            
            // Показываем уведомление
            const progressText = document.getElementById('progressText');
            progressText.style.transform = 'scale(1.2)';
            setTimeout(() => {
                progressText.style.transform = 'scale(1)';
            }, 300);
        }
    }
    
    window.addEventListener('scroll', checkMilestones);
});
});