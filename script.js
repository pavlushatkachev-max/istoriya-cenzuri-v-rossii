document.addEventListener('DOMContentLoaded', function() {
    
    console.log('Лабораторная работа №6 - выполнены все задания');
    
    // ============ ЗАДАНИЕ 1 ============
    const mainHeader = document.querySelector('header h1');
    if (mainHeader) {
        console.log('ЗАДАНИЕ 1 - Текст заголовка h1:', mainHeader.textContent);
    }
    
    // ============ ЗАДАНИЕ 2 ============
    const footer = document.querySelector('footer');
    if (footer) {
        const timeButton = document.createElement('button');
        timeButton.textContent = '🕐 Узнать текущее время';
        timeButton.style.cssText = `
            padding: 8px 15px;
            margin: 10px;
            background: #2c3e50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        `;
        
        timeButton.addEventListener('click', function() {
            const now = new Date();
            const timeString = now.toLocaleString('ru-RU', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            alert('Текущая дата и время:\n' + timeString);
        });
        
        footer.insertBefore(timeButton, footer.firstChild);
    }
    
// ============ ЗАДАНИЕ 3 ============
const contactForm = document.getElementById('contact-form');
const showFormButton = document.getElementById('show-contact-form');
const formContainer = document.getElementById('contact-form-container');

if (contactForm && showFormButton && formContainer) {
    showFormButton.addEventListener('click', function() {
        formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
    });

    async function loadSavedData() {
        try {
            const savedName = await localforage.getItem('censorshipUserName');
            const savedEmail = await localforage.getItem('censorshipUserEmail');
            const savedFeedback = await localforage.getItem('censorshipUserFeedback');
            
            if (savedName) {
                const greeting = document.createElement('div');
                greeting.innerHTML = `<strong>Добрый день, ${savedName}!</strong>`;
                greeting.style.cssText = 'color: green; margin-bottom: 10px;';
                contactForm.parentNode.insertBefore(greeting, contactForm);
            }
            
            if (savedEmail) {
                const emailField = document.getElementById('user-email');
                if (emailField) emailField.value = savedEmail;
            }
            
            if (savedFeedback) {
                const feedbackField = document.getElementById('user-feedback');
                if (feedbackField) feedbackField.value = savedFeedback;
            }
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    }
    
    loadSavedData();
    
    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const userName = document.getElementById('user-name').value;
        const userEmail = document.getElementById('user-email').value; 
        const userFeedback = document.getElementById('user-feedback').value;
        
        try {
         
            await localforage.setItem('censorshipUserName', userName);
            await localforage.setItem('censorshipUserEmail', userEmail);
            await localforage.setItem('censorshipUserFeedback', userFeedback);
            
            contactForm.style.display = 'none';
            const successMessage = document.getElementById('success-message');
            successMessage.style.display = 'block';
            
            setTimeout(function() {
                contactForm.style.display = 'block';
                successMessage.style.display = 'none';
                contactForm.reset();
            }, 3000);
        } catch (error) {
            console.error('Ошибка сохранения данных:', error);
            alert('Ошибка сохранения отзыва. Попробуйте еще раз.');
        }
    });
}
    // ============ ЗАДАНИЕ 4 ============
    if (footer && 'geolocation' in navigator) {
        const nstuLat = 56.328674;
        const nstuLon = 44.002044;
        
        const locationDiv = document.createElement('div');
        locationDiv.id = 'location-info';
        locationDiv.style.cssText = `
            margin: 10px;
            padding: 10px;
            background: #f0f8ff;
            border-radius: 5px;
            font-size: 14px;
        `;
        
        locationDiv.innerHTML = `
            <strong>📍 Расстояние до НГТУ (Нижний Новгород):</strong><br>
            <span id="distance-text">Определение местоположения...</span>
        `;
        
        footer.appendChild(locationDiv);
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;
                
                const distance = calculateDistance(userLat, userLon, nstuLat, nstuLon);
                const distanceText = distance < 1 ? 
                    `${Math.round(distance * 1000)} метров` : 
                    `${distance.toFixed(2)} км`;
                
                document.getElementById('distance-text').textContent = distanceText;
                
                const coordsText = document.createElement('small');
                coordsText.innerHTML = `<br><small>Ваши координаты: ${userLat.toFixed(4)}, ${userLon.toFixed(4)}</small>`;
                locationDiv.appendChild(coordsText);
            },
            function(error) {
                document.getElementById('distance-text').textContent = 
                    'Не удалось определить местоположение';
                console.log('Ошибка геолокации:', error.message);
            }
        );
    }
    
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; 
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    // ============ ЗАДАНИЕ 5 ============
    const videoElement = document.querySelector('video');
    if (videoElement) {
        createMediaControls(videoElement, 'video-controls');
    }
    
    const audioElement = document.querySelector('audio');
    if (audioElement) {
        createMediaControls(audioElement, 'audio-controls');
    }
    
    function createMediaControls(mediaElement, containerId) {
        const container = document.getElementById(containerId) || 
                         document.createElement('div');
        
        if (!document.getElementById(containerId)) {
            container.id = containerId;
            container.className = 'media-controls';
            mediaElement.parentNode.insertBefore(container, mediaElement.nextSibling);
        } else {
            container.innerHTML = '';
        }
        
        const controls = [
            { text: '▶️ Воспроизвести', action: () => mediaElement.play() },
            { text: '⏸️ Пауза', action: () => mediaElement.pause() },
            { text: '⏩ +15 сек', action: () => mediaElement.currentTime += 15 },
            { text: '⏪ -15 сек', action: () => mediaElement.currentTime -= 15 },
            { text: '🔊 Громче', action: () => mediaElement.volume = Math.min(1, mediaElement.volume + 0.1) },
            { text: '🔈 Тише', action: () => mediaElement.volume = Math.max(0, mediaElement.volume - 0.1) }
        ];
        
        controls.forEach(control => {
            const button = document.createElement('button');
            button.textContent = control.text;
            button.addEventListener('click', control.action);
            container.appendChild(button);
        });
    }
    
    // ============ ЗАДАНИЕ 6 ============
    const articlesContainer = document.getElementById('articles-container');
    const articleFilter = document.getElementById('article-filter');
    
    if (articlesContainer && articleFilter) {
        const articles = [
            { 
                title: 'История цензуры в России', 
                description: 'Обзор развития цензуры от царской России до наших дней. Основные этапы и ключевые события.'
            },
            { 
                title: 'Цифровая цензура в современном мире', 
                description: 'Как интернет изменил методы цензуры. Блокировки сайтов, фильтрация контента и контроль в социальных сетях.'
            },
            { 
                title: 'Свобода слова и её ограничения', 
                description: 'Правовые аспекты свободы слова. Где проходит грань между свободой выражения и защитой общества.'
            },
            { 
                title: 'Самоцензура в медиа', 
                description: 'Почему журналисты сами ограничивают себя. Страх, давление и экономические факторы.'
            },
            { 
                title: 'Международный опыт борьбы с цензурой', 
                description: 'Как разные страны решают проблему цензуры. Успешные кейсы и неудачные попытки.'
            },
            { 
                title: 'Будущее цензуры в цифровую эпоху', 
                description: 'Искусственный интеллект, алгоритмы и новые технологии в контроле информации.'
            }
        ];
        
        function displayArticles(filter = '') {
            articlesContainer.innerHTML = '';
            
            const filteredArticles = articles.filter(article => 
                article.title.toLowerCase().includes(filter.toLowerCase()) ||
                article.description.toLowerCase().includes(filter.toLowerCase())
            );
            
            if (filteredArticles.length === 0) {
                articlesContainer.innerHTML = '<p>Статьи не найдены</p>';
                return;
            }
            
            filteredArticles.forEach((article, index) => {
                const articleDiv = document.createElement('div');
                articleDiv.className = 'article-item';
                articleDiv.innerHTML = `
                    <h4>${article.title}</h4>
                    <p>${article.description}</p>
                    <small>Статья №${index + 1}</small>
                `;
                articlesContainer.appendChild(articleDiv);
            });
        }
        
        displayArticles();
        
        articleFilter.addEventListener('input', function() {
            displayArticles(this.value);
        });
    }
    
    // ============ ЗАДАНИЕ 7 ============
    const loadDataBtn = document.getElementById('load-data-btn'); 
    const serverResponseDiv = document.getElementById('server-response'); 
 
    if (loadDataBtn) { 
    loadDataBtn.addEventListener('click', async () => { 
        try { 
            const response = await fetch('data.txt'); 
             
            if (!response.ok) { 
                throw new Error(`Ошибка HTTP: ${response.status}`); 
            } 
 
            const data = await response.text(); 
            serverResponseDiv.textContent = data; 
        } catch (error) { 
            serverResponseDiv.textContent = 'Ошибка: ' + error.message; 
        } 
    }); 
    }
    
    // ============ ДОПОЛНИТЕЛЬНО ============
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebarNav = document.querySelector('.sidebar-nav');
    
    if (mobileMenuToggle && sidebarNav) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebarNav.classList.toggle('active');
        });
    }

});
