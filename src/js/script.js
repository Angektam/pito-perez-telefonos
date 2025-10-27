import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
// Las funciones ya están disponibles globalmente desde los scripts cargados anteriormente
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
let firebaseConfig = null;
try { firebaseConfig = JSON.parse(__firebase_config); } catch (e) {}

if (firebaseConfig) {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    setLogLevel('debug');

    onAuthStateChanged(auth, (user) => {});

    if (typeof __initial_auth_token !== 'undefined') {
        signInWithCustomToken(auth, __initial_auth_token)
            .catch(error => {
                signInAnonymously(auth);
            });
    } else {
        signInAnonymously(auth);
    }
    window.firebaseApp = app;
    window.firebaseAuth = auth;
    window.firestoreDb = db;
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar medidas de seguridad
    initializeSecurity();
    secureLogger.info('Aplicación iniciada');
    
    // Inicializar PWA y notificaciones
    initializePWA();
    
    // Inicializar gestos móviles
    initializeMobileGestures();
    
    // Mejorar experiencia táctil
    enhanceTouchExperience();

    let phoneDatabase = []; 
    
    let state = {
        currentUser: null,
        currentView: 'dashboard',
        favorites: [],
        searchHistory: [],
        filters: { brand: '', storage: '', ram: '', minCamera: '', minBattery: '', os: '', condition: '', minPrice: '', maxPrice: '' },
        easyAnswers: { usage: null, budget: null, priority: null, system: null, size: null },
        comments: [],
        comparisonPhones: [],
    };

    // Sistema de caché para mejorar rendimiento
    const cache = {
        searchResults: new Map(),
        filterOptions: null,
        lastSearchTime: 0,
        CACHE_DURATION: 30000 // 30 segundos
    };

    const views = document.querySelectorAll('.view-container');
    const navButtons = document.querySelectorAll('[data-view]');
    const mobileNavButtons = document.querySelectorAll('.mobile-nav-item');
    const authSection = document.getElementById('auth-section');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalContent = document.getElementById('modal-content');
    const searchViewContainer = document.getElementById('search-view');
    const easyQuestionsContainer = document.getElementById('easy-mode-questions');
    const easyResultsContainer = document.getElementById('easy-mode-results-container');
    const accountViewContainer = document.getElementById('account-view');
    const loadingIndicator = document.getElementById('loading-indicator');


    const renderProductCard = (phone, isFavorite, badge = null) => {
        const imageUrl = phone.image;
        const isInComparison = state.comparisonPhones.some(p => p.id === phone.id);
        
        return `
                <div class="product-card bg-white rounded-3xl p-6 shadow-lg border border-slate-200 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
                    <div class="relative">
                        <div class="h-40 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-6xl overflow-hidden">
                            <img src="${imageUrl}" alt="Teléfono ${phone.name}" class="object-cover h-full w-full opacity-90 transition-transform duration-300 hover:scale-105" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                            <div class="hidden items-center justify-center h-full w-full text-6xl bg-gradient-to-br from-indigo-100 to-purple-100">📱</div>
                        </div>
                        <div class="absolute top-3 right-3 flex flex-col gap-2">
                            <button class="favorite-btn w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform" data-id="${phone.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="${isFavorite ? '#ef4444' : 'none'}" stroke="${isFavorite ? '#ef4444' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            </button>
                            <button class="compare-btn w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform ${isInComparison ? 'bg-indigo-500 text-white' : 'text-slate-500'}" data-id="${phone.id}" title="${isInComparison ? 'Quitar de comparación' : 'Agregar a comparación'}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
                            </button>
                        </div>
                    </div>
                    <div class="flex-grow pt-4">
                        ${badge ? `<div class="text-xs font-bold ${badge.color} text-white px-3 py-1 rounded-full inline-block mb-2">${badge.icon} ${badge.text}</div>` : ''}
                        <h3 class="text-lg font-bold text-slate-800 mb-2">${phone.name}</h3>
                        <p class="text-sm text-slate-600 mb-3 h-10">${phone.specs}</p>
                    </div>
                    <div>
                        <div class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-3">
                            $${phone.price.toLocaleString('es-MX')}
                        </div>
                        <div class="flex gap-2">
                            <button class="details-btn flex-1 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors modern-btn" data-id="${phone.id}">
                                Ver Detalles
                            </button>
                        </div>
                    </div>
                </div>
            `;
    };

    const renderProductGrid = (container, phones, badges = {}) => {
        if (phones.length === 0) {
            container.innerHTML = `<div class="text-center py-16 col-span-full">
                        <div class="text-7xl mb-4">😔</div>
                        <h3 class="text-xl font-bold text-slate-700">No se encontraron teléfonos</h3>
                        <p class="text-slate-500">Intenta ajustar los filtros de búsqueda.</p>
                    </div>`;
            return;
        }
        const gridHTML = phones.map(phone => {
            const isFavorite = state.favorites.some(f => f.id === phone.id);
            const badge = badges[phone.id] || null;
            return renderProductCard(phone, isFavorite, badge);
        }).join('');
        container.innerHTML = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">${gridHTML}</div>`;
    };

    const renderAuthSection = () => {
        const authButtons = document.getElementById('auth-buttons');
        if (state.currentUser) {
            authButtons.innerHTML = `
                <div class="flex items-center gap-3">
                    <span class="font-semibold text-slate-700 dark:text-slate-300 hidden sm:inline">Hola, ${state.currentUser.name}</span>
                    <button id="logout-btn" class="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors text-sm">Salir</button>
                </div>
            `;
            document.getElementById('logout-btn').addEventListener('click', handleLogout);
        } else {
            authButtons.innerHTML = `
                <button id="login-btn" class="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Iniciar Sesión
                </button>
                <button id="register-btn" class="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
                    Registrarse
                </button>
            `;
            document.getElementById('login-btn').addEventListener('click', () => showAuthModal('login'));
            document.getElementById('register-btn').addEventListener('click', () => showAuthModal('register'));
        }
    };

    const renderCharts = () => {
        if (phoneDatabase.length === 0) return;
        
        ['priceChart', 'batteryChart', 'osChart', 'cameraChart'].forEach(id => {
            const canvas = document.getElementById(id);
            if (canvas && Chart.getChart(canvas)) {
                Chart.getChart(canvas).destroy();
            }
        });

        const brandData = phoneDatabase.reduce((acc, phone) => {
            if (!acc[phone.brand]) {
                acc[phone.brand] = { prices: [], count: 0 };
            }
            acc[phone.brand].prices.push(phone.price);
            acc[phone.brand].count++;
            return acc;
        }, {});

        const avgPriceByBrand = Object.entries(brandData).map(([brand, data]) => ({
            brand: brand.charAt(0).toUpperCase() + brand.slice(1),
            avgPrice: data.prices.reduce((a, b) => a + b, 0) / data.count,
        }));
        
        const osData = phoneDatabase.reduce((acc, phone) => {
            acc[phone.os] = (acc[phone.os] || 0) + 1;
            return acc;
        }, {});

        const chartOptions = { maintainAspectRatio: false, responsive: true };

        new Chart('priceChart', {
            type: 'bar',
            data: {
                labels: avgPriceByBrand.map(d => d.brand),
                datasets: [{ label: 'Precio Promedio (MXN)', data: avgPriceByBrand.map(d => d.avgPrice), backgroundColor: '#4f46e5' }]
            },
            options: chartOptions
        });
        
        new Chart('batteryChart', {
            type: 'bar',
            data: {
                labels: phoneDatabase.map(p => p.name),
                datasets: [{ label: 'Batería (mAh)', data: phoneDatabase.map(p => p.battery), backgroundColor: '#10b981' }]
            },
            options: { ...chartOptions, indexAxis: 'y' }
        });

        new Chart('osChart', {
            type: 'doughnut',
            data: {
                labels: Object.keys(osData).map(k => k.toUpperCase()),
                datasets: [{ data: Object.values(osData), backgroundColor: ['#4f46e5', '#10b981'] }]
            },
            options: chartOptions
        });

         new Chart('cameraChart', {
            type: 'bar',
            data: {
                labels: phoneDatabase.map(p => p.name),
                datasets: [{ label: 'Cámara Principal (MP)', data: phoneDatabase.map(p => parseInt(p.camera)), backgroundColor: '#8b5cf6' }]
            },
            options: { ...chartOptions }
        });
    };

    const renderSearchView = () => {
        const filterOptions = {
            brand: [...new Set(phoneDatabase.map(p => p.brand))],
            storage: [...new Set(phoneDatabase.map(p => p.storage))].sort(),
            ram: [...new Set(phoneDatabase.map(p => p.ram))].sort(),
            os: [...new Set(phoneDatabase.map(p => p.os))],
            condition: [...new Set(phoneDatabase.map(p => p.condition))],
            screen: [...new Set(phoneDatabase.map(p => p.screen))],
        };
        
        const selectHTML = (id, label, options) => `
            <div class="flex-1 min-w-[150px]">
                <label for="${id}" class="block text-sm font-medium text-slate-700 dark:text-slate-300">${label}</label>
                <select id="${id}" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-slate-700 dark:text-slate-100">
                    <option value="">Todos</option>
                    ${options.map(o => `<option value="${o}">${o.charAt(0).toUpperCase() + o.slice(1)}</option>`).join('')}
                </select>
            </div>`;

        const inputHTML = (id, label, placeholder, type = 'number') => `
            <div class="flex-1 min-w-[150px]">
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">${label}</label>
                <input type="${type}" id="${id}" placeholder="${placeholder}" class="block w-full text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md p-2 mt-1 dark:bg-slate-700 dark:text-slate-100">
            </div>`;

        searchViewContainer.innerHTML = `
                <div class="glass p-8 rounded-3xl shadow-2xl border border-white/20">
                     <h2 class="text-3xl font-bold text-white mb-2 text-center">Búsqueda Avanzada</h2>
                     <p class="text-white/90 text-center mb-6">Usa los filtros para encontrar exactamente lo que necesitas. Puedes dejar los campos vacíos.</p>
                     
                     <!-- Filtros principales -->
                     <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        ${selectHTML('filter-brand', 'Marca', filterOptions.brand)}
                        ${selectHTML('filter-os', 'Sistema Operativo', filterOptions.os)}
                        ${selectHTML('filter-condition', 'Condición', filterOptions.condition)}
                     </div>
                     
                     <!-- Filtros de especificaciones -->
                     <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        ${selectHTML('filter-storage', 'Almacenamiento', filterOptions.storage)}
                        ${selectHTML('filter-ram', 'RAM', filterOptions.ram)}
                        ${selectHTML('filter-screen', 'Tamaño de Pantalla', filterOptions.screen)}
                     </div>
                     
                     <!-- Filtros numéricos -->
                     <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        ${inputHTML('filter-minCamera', 'Cámara Mínima (MP)', 'Ej: 48')}
                        ${inputHTML('filter-minBattery', 'Batería Mínima (mAh)', 'Ej: 4500')}
                        <div class="flex-1 min-w-[150px]">
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Precio (MXN)</label>
                            <div class="flex gap-2 mt-1">
                                <input type="number" id="filter-minPrice" placeholder="Mínimo" class="block w-full text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md p-2 dark:bg-slate-700 dark:text-slate-100">
                                <input type="number" id="filter-maxPrice" placeholder="Máximo" class="block w-full text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md p-2 dark:bg-slate-700 dark:text-slate-100">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Filtros adicionales -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div class="flex-1 min-w-[150px]">
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Buscar por nombre</label>
                            <input type="text" id="filter-name" placeholder="Ej: iPhone, Samsung Galaxy..." class="block w-full text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md p-2 mt-1 dark:bg-slate-700 dark:text-slate-100">
                        </div>
                        <div class="flex-1 min-w-[150px]">
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Ordenar por</label>
                            <select id="filter-sort" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-slate-700 dark:text-slate-100">
                                <option value="name">Nombre (A-Z)</option>
                                <option value="price-asc">Precio (Menor a Mayor)</option>
                                <option value="price-desc">Precio (Mayor a Menor)</option>
                                <option value="battery-desc">Batería (Mayor a Menor)</option>
                                <option value="camera-desc">Cámara (Mayor a Menor)</option>
                                <option value="storage-desc">Almacenamiento (Mayor a Menor)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="flex justify-center gap-4">
                        <button id="search-btn" class="bg-indigo-600 text-white font-semibold py-3 px-10 rounded-xl hover:bg-indigo-700 transition-colors modern-btn">Aplicar Filtros</button>
                        <button id="clear-filters-btn" class="bg-slate-500 text-white font-semibold py-3 px-10 rounded-xl hover:bg-slate-600 transition-colors modern-btn">Limpiar Filtros</button>
                    </div>
                </div>
                <div id="search-results-container" class="mt-8"></div>
                `;
        
        // Event listeners
        document.getElementById('search-btn').addEventListener('click', handleSearch);
        document.getElementById('clear-filters-btn').addEventListener('click', clearFilters);
        
        // Búsqueda en tiempo real
        const searchInputs = [
            'filter-brand', 'filter-storage', 'filter-ram', 'filter-os', 
            'filter-condition', 'filter-minCamera', 'filter-minBattery', 
            'filter-minPrice', 'filter-maxPrice', 'filter-name', 'filter-sort', 'filter-screen'
        ];
        
        searchInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', debounce(handleSearch, 300));
                input.addEventListener('change', debounce(handleSearch, 300));
            }
        });
        
        handleSearch(); 
    };
    
    const renderEasyModeView = () => {
        const questions = [
            { 
                id: 'usage', 
                icon: '📱', 
                title: '¿Para qué usarás principalmente tu teléfono?', 
                description: 'Esto nos ayuda a entender tus necesidades específicas',
                options: [
                    { value: 'basic', emoji: '💬', label: 'Básico', sublabel: 'Llamadas y mensajes', color: 'blue' }, 
                    { value: 'social', emoji: '📸', label: 'Redes Sociales', sublabel: 'Instagram, TikTok, etc.', color: 'pink' }, 
                    { value: 'gaming', emoji: '🎮', label: 'Juegos', sublabel: 'Gaming móvil', color: 'purple' }, 
                    { value: 'professional', emoji: '💼', label: 'Trabajo', sublabel: 'Productividad', color: 'indigo' },
                    { value: 'creative', emoji: '🎨', label: 'Creativo', sublabel: 'Fotos y videos', color: 'orange' },
                    { value: 'student', emoji: '📚', label: 'Estudios', sublabel: 'Aplicaciones educativas', color: 'green' },
                    { value: 'travel', emoji: '✈️', label: 'Viajes', sublabel: 'GPS y fotos', color: 'cyan' },
                    { value: 'mixed', emoji: '🔄', label: 'Uso Mixto', sublabel: 'Un poco de todo', color: 'gray' }
                ]
            },
            { 
                id: 'budget', 
                icon: '💰', 
                title: '¿Cuál es tu presupuesto aproximado?', 
                description: 'Los precios están en pesos mexicanos',
                options: [
                    { value: 'very-low', emoji: '💵', label: 'Económico', sublabel: 'Menos de $5,500', color: 'green' }, 
                    { value: 'low', emoji: '💴', label: 'Accesible', sublabel: '$5,500 - $9,250', color: 'blue' }, 
                    { value: 'medium', emoji: '💶', label: 'Intermedio', sublabel: '$9,250 - $14,800', color: 'yellow' }, 
                    { value: 'high', emoji: '💷', label: 'Alto', sublabel: '$14,800 - $22,200', color: 'orange' }, 
                    { value: 'premium', emoji: '💎', label: 'Premium', sublabel: 'Más de $22,200', color: 'purple' },
                    { value: 'flexible', emoji: '🤝', label: 'Flexible', sublabel: 'Depende del valor', color: 'gray' }
                ]
            },
            { 
                id: 'priority', 
                icon: '⭐', 
                title: '¿Qué característica es más importante para ti?', 
                description: 'Selecciona la que más te importe',
                options: [
                    { value: 'battery', emoji: '🔋', label: 'Batería', sublabel: 'Duración todo el día', color: 'green' }, 
                    { value: 'camera', emoji: '📷', label: 'Cámara', sublabel: 'Fotos profesionales', color: 'blue' }, 
                    { value: 'storage', emoji: '💾', label: 'Almacenamiento', sublabel: 'Mucho espacio', color: 'purple' }, 
                    { value: 'brand', emoji: '🏆', label: 'Marca', sublabel: 'Reconocida y confiable', color: 'yellow' },
                    { value: 'performance', emoji: '⚡', label: 'Rendimiento', sublabel: 'Velocidad y fluidez', color: 'red' },
                    { value: 'design', emoji: '✨', label: 'Diseño', sublabel: 'Atractivo y moderno', color: 'pink' },
                    { value: 'durability', emoji: '🛡️', label: 'Resistencia', sublabel: 'Que dure mucho', color: 'gray' },
                    { value: 'value', emoji: '💯', label: 'Valor', sublabel: 'Mejor relación precio-calidad', color: 'indigo' }
                ]
            },
            { 
                id: 'system', 
                icon: '🏷️', 
                title: '¿Tienes preferencia de sistema operativo?', 
                description: 'Esto afecta las aplicaciones disponibles',
                options: [
                    { value: 'ios', emoji: '🍎', label: 'iOS', sublabel: 'Solo iPhone', color: 'gray' }, 
                    { value: 'android', emoji: '🤖', label: 'Android', sublabel: 'Samsung, Xiaomi, etc.', color: 'green' }, 
                    { value: 'any', emoji: '🤷', label: 'Cualquiera', sublabel: 'No me importa', color: 'blue' },
                    { value: 'prefer-ios', emoji: '🍎', label: 'Prefiero iOS', sublabel: 'Pero considero Android', color: 'gray' },
                    { value: 'prefer-android', emoji: '🤖', label: 'Prefiero Android', sublabel: 'Pero considero iOS', color: 'green' }
                ]
            },
            { 
                id: 'size', 
                icon: '📏', 
                title: '¿Qué tamaño de pantalla prefieres?', 
                description: 'Esto afecta la comodidad de uso',
                options: [
                    { value: 'small', emoji: '📱', label: 'Pequeña', sublabel: 'Fácil de manejar', color: 'blue' }, 
                    { value: 'medium', emoji: '📱', label: 'Mediana', sublabel: 'Equilibrada', color: 'green' }, 
                    { value: 'large', emoji: '📱', label: 'Grande', sublabel: 'Mejor para multimedia', color: 'purple' }, 
                    { value: 'any', emoji: '🤷', label: 'Cualquiera', sublabel: 'No me importa', color: 'gray' }
                ]
            }
        ];
        
        // Estado para el progreso
        state.easyModeAnswers = {};
        state.currentQuestionIndex = 0;
        
        easyQuestionsContainer.innerHTML = `
            <div class="mb-8">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-2xl font-bold text-white">🎯 Modo Fácil</h2>
                    <div class="text-white/80 text-sm">
                        <span id="current-question">1</span> de ${questions.length}
                    </div>
                </div>
                <div class="w-full bg-white/20 rounded-full h-2 mb-2">
                    <div id="progress-bar" class="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500" style="width: ${100/questions.length}%"></div>
                </div>
                <p class="text-white/70 text-sm">Responde las preguntas para encontrar tu teléfono ideal</p>
            </div>
            
            <div id="questions-container">
                ${questions.map((q, index) => `
                    <div class="question-card ${index === 0 ? 'active' : 'hidden'} transition-all duration-300" data-question-index="${index}">
                        <div class="glass p-8 rounded-3xl shadow-2xl border border-white/20 mb-6">
                            <div class="text-center mb-6">
                                <div class="text-6xl mb-4">${q.icon}</div>
                                <h3 class="text-2xl font-bold text-white mb-2">${q.title}</h3>
                                <p class="text-white/80">${q.description}</p>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 easy-options" data-question-id="${q.id}">
                                ${q.options.map(opt => `
                                    <button data-value="${opt.value}" class="easy-option p-6 rounded-2xl border-2 border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20 transition-all duration-300 text-center group hover:scale-105 hover:shadow-lg">
                                        <div class="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">${opt.emoji}</div>
                                        <div class="font-bold text-white text-lg mb-1">${opt.label}</div>
                                        <div class="text-white/70 text-sm">${opt.sublabel}</div>
                                        <div class="mt-3 w-8 h-1 bg-gradient-to-r from-${opt.color}-400 to-${opt.color}-600 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="flex justify-between items-center mt-8">
                <button id="prev-question-btn" class="bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    ← Anterior
                </button>
                <button id="next-question-btn" class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl font-bold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    Siguiente →
                </button>
                <button id="get-recommendations-btn" class="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hidden">
                    ✨ Ver Recomendaciones
                </button>
            </div>
        `;

        // Event listeners
        document.getElementById('next-question-btn').addEventListener('click', handleNextQuestion);
        document.getElementById('prev-question-btn').addEventListener('click', handlePrevQuestion);
        document.getElementById('get-recommendations-btn').addEventListener('click', handleGetRecommendations);
        easyQuestionsContainer.addEventListener('click', handleEasyAnswer);
        
        // Inicializar primera pregunta
        updateQuestionDisplay();
    };

    const renderAccountView = () => {
        if (!state.currentUser) {
            accountViewContainer.innerHTML = `
                        <div class="text-center bg-white p-12 rounded-3xl shadow-lg border border-slate-200">
                             <div class="text-7xl mb-4">👤</div>
                            <h2 class="text-2xl font-bold text-slate-800 mb-2">Accede a tu cuenta</h2>
                            <p class="text-slate-500 mb-6">Inicia sesión para ver tus favoritos e historial de búsqueda.</p>
                            <button class="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors" onclick="showAuthModal('login')">
                                Iniciar Sesión / Registrarse
                            </button>
                        </div>
                    `;
            return;
        }
        
        let pitoPerezImageHTML = '';
        if (state.currentUser.isPitoPerez) {
            const specialImageUrl = 'image_49fc42.jpg';
            
            pitoPerezImageHTML = `
                        <div class="bg-red-50 p-6 rounded-2xl mb-8 text-center border-2 border-red-300">
                            <img 
                                src="${specialImageUrl}" 
                                alt="Pito Pérez Saludo" 
                                class="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-red-500" 
                                onerror="this.onerror=null; this.src='https://placehold.co/128x128/FF0000/FFFFFF?text=ERROR';"
                            />
                            <p class="text-xl font-bold text-red-800">¡Bienvenido, ${state.currentUser.name}!</p>
                            <p class="text-red-600 italic">"Ta muy cuichi joven"</p>
                        </div>
                    `;
        }


        accountViewContainer.innerHTML = `
                    <div class="bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
                        <h2 class="text-3xl font-bold text-slate-800 mb-6">Mi Cuenta</h2>

                        ${pitoPerezImageHTML}

                        <div class="border-b border-slate-200 mb-6">
                            <nav class="-mb-px flex space-x-6" id="account-tabs">
                                <button data-tab="favorites" class="account-tab-btn py-3 px-1 border-b-2 font-semibold border-indigo-500 text-indigo-600">❤️ Favoritos</button>
                                <button data-tab="history" class="account-tab-btn py-3 px-1 border-b-2 font-semibold border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300">📜 Historial</button>
                            </nav>
                        </div>
                        <div id="account-content"></div>
                    </div>
                `;
        
        document.getElementById('account-tabs').addEventListener('click', (e) => {
            if (e.target.matches('.account-tab-btn')) {
                const tab = e.target.dataset.tab;
                document.querySelectorAll('.account-tab-btn').forEach(btn => {
                    btn.classList.remove('border-indigo-500', 'text-indigo-600');
                    btn.classList.add('border-transparent', 'text-slate-500');
                });
                e.target.classList.add('border-indigo-500', 'text-indigo-600');
                e.target.classList.remove('border-transparent', 'text-slate-500');
                renderAccountContent(tab);
            }
        });
        renderAccountContent('favorites');
    };

    const renderAccountContent = (tab) => {
        const container = document.getElementById('account-content');
        if (tab === 'favorites') {
            renderProductGrid(container, state.favorites);
        } else if (tab === 'history') {
            if (state.searchHistory.length === 0) {
                container.innerHTML = `<div class="text-center py-10"><p class="text-slate-500">No hay búsquedas recientes.</p></div>`;
                return;
            }
            container.innerHTML = state.searchHistory.map(item => `
                        <div class="bg-slate-50 p-4 rounded-xl mb-3 flex justify-between items-center">
                            <div>
                                <p class="text-sm text-slate-500">${item.date}</p>
                                <div class="flex flex-wrap gap-2 mt-2">
                                    ${Object.entries(item.filters).map(([k,v]) => `<span class="text-xs font-semibold bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">${k}: ${v}</span>`).join('')}
                                </div>
                            </div>
                            <button class="delete-history-btn bg-red-100 text-red-700 font-semibold p-2 rounded-lg text-sm hover:bg-red-200" data-id="${item.id}">Eliminar</button>
                        </div>
                    `).join('');
        }
    };

    const populatePhoneSelect = () => {
        const phoneSelect = document.getElementById('comment-phone');
        console.log('Intentando poblar dropdown, elemento encontrado:', !!phoneSelect);
        console.log('phoneDatabase disponible:', !!phoneDatabase, 'Longitud:', phoneDatabase?.length);
        
        if (phoneSelect) {
            phoneSelect.innerHTML = '<option value="">Selecciona un teléfono</option>';
            if (phoneDatabase && phoneDatabase.length > 0) {
                console.log('Poblando dropdown con', phoneDatabase.length, 'teléfonos');
                phoneDatabase.forEach((phone, index) => {
                    console.log(`Agregando teléfono ${index + 1}:`, phone.name);
                    phoneSelect.innerHTML += `<option value="${phone.id}">${phone.name} - ${phone.brand.charAt(0).toUpperCase() + phone.brand.slice(1)}</option>`;
                });
                console.log('Dropdown poblado exitosamente');
            } else {
                console.log('phoneDatabase no está disponible o está vacío');
                phoneSelect.innerHTML += '<option value="" disabled>No hay teléfonos disponibles</option>';
            }
        } else {
            console.log('No se encontró el elemento comment-phone');
        }
    };

    const renderCommentsView = () => {
        // Cargar comentarios desde localStorage
        loadCommentsFromStorage();
        
        // Esperar un poco para asegurar que el DOM esté listo
        setTimeout(() => {
            // Poblar el select con los teléfonos disponibles
            populatePhoneSelect();
        }, 100);
        
        // Renderizar mensaje de autenticación
        renderCommentAuthInfo();
        
        // Renderizar lista de comentarios
        renderCommentsList();
        
        // Configurar eventos
        setupCommentEvents();
    };

    const renderCommentAuthInfo = () => {
        const authInfo = document.getElementById('comment-auth-info');
        if (authInfo) {
            if (!state.currentUser) {
                authInfo.innerHTML = `
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div class="flex items-center gap-2">
                            <span class="text-blue-600">ℹ️</span>
                            <p class="text-blue-800 text-sm">
                                <strong>Debes iniciar sesión</strong> para publicar comentarios. 
                                Solo puedes eliminar tus propios comentarios.
                            </p>
                        </div>
                    </div>
                `;
            } else {
                authInfo.innerHTML = `
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div class="flex items-center gap-2">
                            <span class="text-green-600">✅</span>
                            <p class="text-green-800 text-sm">
                                Sesión iniciada como <strong>${state.currentUser.name}</strong>. 
                                Puedes publicar y eliminar tus propios comentarios.
                            </p>
                        </div>
                    </div>
                `;
            }
        }
    };

    const renderCommentsList = () => {
        const commentsList = document.getElementById('comments-list');
        
        if (state.comments.length === 0) {
            commentsList.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-6xl mb-4">💬</div>
                    <h3 class="text-xl font-bold text-slate-700 mb-2">No hay comentarios aún</h3>
                    <p class="text-slate-500">Sé el primero en compartir tu opinión sobre estos teléfonos.</p>
                </div>
            `;
            return;
        }
        
        // Agrupar comentarios por teléfono
        const commentsByPhone = state.comments.reduce((acc, comment) => {
            const phone = phoneDatabase.find(p => p.id === comment.phoneId);
            const phoneName = phone ? phone.name : 'Teléfono desconocido';
            
            if (!acc[phoneName]) {
                acc[phoneName] = [];
            }
            acc[phoneName].push(comment);
            return acc;
        }, {});
        
        commentsList.innerHTML = Object.entries(commentsByPhone).map(([phoneName, comments]) => `
            <div class="bg-slate-50 p-6 rounded-2xl">
                <h3 class="text-lg font-bold text-slate-800 mb-4">${phoneName}</h3>
                <div class="space-y-4">
                    ${comments.map(comment => {
                        const canDelete = state.currentUser && comment.author === state.currentUser.name;
                        return `
                        <div class="bg-white p-4 rounded-xl border border-slate-200">
                            <div class="flex justify-between items-start mb-3">
                                <div>
                                    <h4 class="font-semibold text-slate-800">${escapeHtml(comment.author)}</h4>
                                    <div class="flex items-center gap-2 mt-1">
                                        ${renderStars(comment.rating)}
                                        <span class="text-sm text-slate-500">${comment.date}</span>
                                    </div>
                                </div>
                                ${canDelete ? `
                                    <button class="delete-comment-btn text-red-500 hover:text-red-700 text-sm" data-id="${comment.id}" title="Eliminar mi comentario">
                                        🗑️
                                    </button>
                                ` : ''}
                            </div>
                            <p class="text-slate-700">${escapeHtml(comment.text)}</p>
                        </div>
                    `;
                    }).join('')}
                </div>
            </div>
        `).join('');
    };

    const renderStars = (rating) => {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += i <= rating ? '⭐' : '☆';
        }
        return stars;
    };

    const setupCommentEvents = () => {
        // Evento para el formulario de comentarios
        const commentForm = document.getElementById('comment-form');
        if (commentForm) {
            commentForm.addEventListener('submit', handleCommentSubmit);
        }
        
        // Eventos para las estrellas de calificación
        document.querySelectorAll('.rating-star').forEach(star => {
            star.addEventListener('click', handleRatingClick);
            
            // Efecto hover
            star.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'scale(1.2)';
                e.target.style.transition = 'all 0.2s ease-in-out';
            });
            
            star.addEventListener('mouseleave', (e) => {
                const rating = parseInt(e.target.dataset.rating);
                const selectedRating = document.querySelector('input[name="rating"]:checked')?.value;
                
                if (selectedRating && rating <= parseInt(selectedRating)) {
                    e.target.style.transform = 'scale(1.1)';
                } else {
                    e.target.style.transform = 'scale(1)';
                }
                e.target.style.transition = 'all 0.2s ease-in-out';
            });
        });
        
        // Eventos para eliminar comentarios
        document.addEventListener('click', (e) => {
            if (e.target.matches('.delete-comment-btn')) {
                const commentId = parseInt(e.target.dataset.id);
                deleteComment(commentId);
            }
        });
        
        // Asegurar que el dropdown se llene cuando se configuran los eventos
        setTimeout(() => {
            populatePhoneSelect();
        }, 50);
    };

    const handleRatingClick = (e) => {
        const rating = parseInt(e.target.dataset.rating);
        
        // Actualizar visualmente las estrellas con animación
        document.querySelectorAll('.rating-star').forEach((star, index) => {
            const starRating = 5 - index;
            if (starRating <= rating) {
                star.classList.add('text-yellow-400', 'scale-110');
                star.style.transform = 'scale(1.1)';
                star.style.transition = 'all 0.2s ease-in-out';
            } else {
                star.classList.remove('text-yellow-400', 'scale-110');
                star.style.transform = 'scale(1)';
                star.style.transition = 'all 0.2s ease-in-out';
            }
        });
        
        // Seleccionar el radio button correspondiente
        document.getElementById(`rating-${rating}`).checked = true;
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        
        // Verificar si el usuario está logueado
        if (!state.currentUser) {
            alert('Debes iniciar sesión para publicar comentarios');
            showAuthModal('login');
            return;
        }
        
        const formData = new FormData(e.target);
        const phoneId = parseInt(document.getElementById('comment-phone').value);
        const rating = parseInt(document.querySelector('input[name="rating"]:checked')?.value);
        const text = document.getElementById('comment-text').value.trim();
        const author = document.getElementById('comment-author').value.trim();
        
        // Validar datos
        if (!phoneId || !rating || !text || !author) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        // Sanitizar entrada
        const sanitizedText = sanitizeInput(text);
        const sanitizedAuthor = sanitizeInput(author);
        
        // Crear comentario
        const comment = {
            id: Date.now(),
            phoneId: phoneId,
            rating: rating,
            text: sanitizedText,
            author: sanitizedAuthor,
            userId: state.currentUser.id, // Agregar ID del usuario para mayor seguridad
            date: new Date().toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        // Agregar comentario
        state.comments.push(comment);
        saveCommentsToStorage();
        renderCommentsList();
        
        // Limpiar formulario
        e.target.reset();
        document.querySelectorAll('.rating-star').forEach(star => {
            star.classList.remove('text-yellow-400', 'scale-110');
            star.style.transform = 'scale(1)';
            star.style.transition = 'all 0.3s ease-in-out';
        });
        
        secureLogger.info('Comentario publicado por usuario autenticado');
        alert('¡Comentario publicado exitosamente!');
    };

    const deleteComment = (commentId) => {
        // Verificar si el usuario está logueado
        if (!state.currentUser) {
            alert('Debes iniciar sesión para eliminar comentarios');
            showAuthModal('login');
            return;
        }
        
        // Buscar el comentario
        const comment = state.comments.find(c => c.id === commentId);
        if (!comment) {
            alert('Comentario no encontrado');
            return;
        }
        
        // Verificar que el comentario pertenece al usuario actual
        if (comment.author !== state.currentUser.name || comment.userId !== state.currentUser.id) {
            alert('Solo puedes eliminar tus propios comentarios');
            return;
        }
        
        if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
            state.comments = state.comments.filter(c => c.id !== commentId);
            saveCommentsToStorage();
            renderCommentsList();
            secureLogger.info('Comentario eliminado por el autor');
        }
    };

    const saveCommentsToStorage = () => {
        try {
            localStorage.setItem('comments', JSON.stringify(state.comments));
        } catch (error) {
            secureLogger.warn('Error al guardar comentarios en localStorage');
        }
    };

    const loadCommentsFromStorage = () => {
        try {
            const savedComments = localStorage.getItem('comments');
            if (savedComments) {
                state.comments = JSON.parse(savedComments);
            } else {
                // Agregar comentarios de ejemplo si no hay ninguno guardado
                state.comments = [
                    {
                        id: 1,
                        phoneId: 1,
                        rating: 5,
                        text: "Excelente teléfono, muy buena cámara y batería duradera. Lo recomiendo completamente.",
                        author: "María González",
                        date: "15 dic 2024, 14:30"
                    },
                    {
                        id: 2,
                        phoneId: 2,
                        rating: 4,
                        text: "Buena relación calidad-precio. El rendimiento es decente para el precio que tiene.",
                        author: "Carlos Rodríguez",
                        date: "14 dic 2024, 09:15"
                    },
                    {
                        id: 3,
                        phoneId: 1,
                        rating: 5,
                        text: "El mejor teléfono que he tenido. La pantalla es increíble y el diseño es muy elegante.",
                        author: "Ana Martínez",
                        date: "13 dic 2024, 16:45"
                    }
                ];
            }
        } catch (error) {
            secureLogger.warn('Error al cargar comentarios desde localStorage');
            state.comments = [];
        }
    };
    

    const showProductModal = (phone) => {
        const imageUrl = phone.image;
        modalContent.innerHTML = `
                    <div class="p-6 md:p-8">
                         <div class="flex justify-between items-start">
                             <div>
                                <h2 class="text-2xl md:text-3xl font-bold text-slate-800">${phone.name}</h2>
                                <p class="text-slate-500">${phone.brand.charAt(0).toUpperCase() + phone.brand.slice(1)}</p>
                            </div>
                            <button id="close-modal-btn" class="text-slate-400 hover:text-slate-800 text-3xl font-light leading-none">&times;</button>
                        </div>
                        
                        <div class="mt-6">
                            <div class="h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-8xl overflow-hidden">
                                <img src="${imageUrl}" alt="Teléfono ${phone.name}" class="object-cover h-full w-full" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                                <div class="hidden items-center justify-center h-full w-full text-8xl bg-gradient-to-br from-indigo-100 to-purple-100">📱</div>
                            </div>
                        </div>

                        <div class="mt-6 border-t border-slate-200 pt-6">
                            <h3 class="font-semibold text-slate-800 mb-3">Especificaciones Clave (Simuladas)</h3>
                            <div class="space-y-2 text-sm">
                                ${Object.entries(phone.fullSpecs).map(([key, value]) => `
                                <div class="flex justify-between">
                                    <span class="text-slate-500">${key}</span>
                                    <span class="font-semibold text-right">${value}</span>
                                </div>`).join('')}
                            </div>
                        </div>

                        <div class="mt-6 border-t border-slate-200 pt-6">
                            <h3 class="font-semibold text-slate-800 mb-4">¿Dónde Comprar?</h3>
                            <div class="space-y-3">
                                ${phone.purchaseLinks.map(link => `
                                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between bg-slate-100 p-3 rounded-lg hover:bg-slate-200 transition-colors">
                                    <div class="flex items-center gap-3">
                                        <span class="text-2xl">${link.logo}</span>
                                        <span class="font-semibold">${link.store}</span>
                                    </div>
                                    <span class="text-xs font-bold text-indigo-600">IR A LA TIENDA &rarr;</span>
                                </a>`).join('')}
                            </div>
                        </div>
                    </div>
                `;
        modalBackdrop.classList.remove('hidden');
        document.getElementById('close-modal-btn').addEventListener('click', () => modalBackdrop.classList.add('hidden'));
    };
    
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            modalBackdrop.classList.add('hidden');
        }
    });

    const updateView = (viewId) => {
        state.currentView = viewId;
        views.forEach(v => v.classList.add('hidden'));
        const targetView = document.getElementById(`${viewId}-view`);
        if (targetView) targetView.classList.remove('hidden');
        
        navButtons.forEach(b => {
            b.classList.toggle('nav-item-active', b.dataset.view === viewId);
            b.classList.toggle('nav-item', b.dataset.view !== viewId);
        });
        
        mobileNavButtons.forEach(b => {
            b.classList.toggle('text-indigo-600', b.dataset.view === viewId);
            b.classList.toggle('text-slate-500', b.dataset.view !== viewId);
        });
        
        // Renderizar vista específica si es necesario
        if (viewId === 'comments') {
            renderCommentsView();
            // Asegurar que el dropdown se llene después de cambiar de vista
            setTimeout(() => {
                populatePhoneSelect();
            }, 200);
        } else if (viewId === 'comparison') {
            renderComparisonViewContent();
        }
    };

    const handleNavClick = (e) => {
        const button = e.target.closest('[data-view]');
        if (button) {
            updateView(button.dataset.view);
        }
    };
    
    const handleSearch = () => {
        // Verificar rate limiting
        if (!searchRateLimiter.canMakeRequest()) {
            secureLogger.warn('Rate limit excedido para búsquedas');
            alert('Has realizado demasiadas búsquedas. Por favor espera un momento.');
            return;
        }
        
        // Sanitizar y validar entradas
        const rawFilters = {
            brand: document.getElementById('filter-brand')?.value || '',
            storage: document.getElementById('filter-storage')?.value || '',
            ram: document.getElementById('filter-ram')?.value || '',
            os: document.getElementById('filter-os')?.value || '',
            condition: document.getElementById('filter-condition')?.value || '',
            screen: document.getElementById('filter-screen')?.value || '',
            minCamera: document.getElementById('filter-minCamera')?.value || '',
            minBattery: document.getElementById('filter-minBattery')?.value || '',
            minPrice: document.getElementById('filter-minPrice')?.value || '',
            maxPrice: document.getElementById('filter-maxPrice')?.value || '',
            name: document.getElementById('filter-name')?.value || '',
            sort: document.getElementById('filter-sort')?.value || 'name',
        };
        
        // Validar números
        const filters = {
            brand: sanitizeInput(rawFilters.brand),
            storage: sanitizeInput(rawFilters.storage),
            ram: sanitizeInput(rawFilters.ram),
            os: sanitizeInput(rawFilters.os),
            condition: sanitizeInput(rawFilters.condition),
            screen: sanitizeInput(rawFilters.screen),
            minCamera: rawFilters.minCamera ? validateNumber(rawFilters.minCamera, 0, 500) : '',
            minBattery: rawFilters.minBattery ? validateNumber(rawFilters.minBattery, 0, 10000) : '',
            minPrice: rawFilters.minPrice ? validateNumber(rawFilters.minPrice, 0, 1000000) : '',
            maxPrice: rawFilters.maxPrice ? validateNumber(rawFilters.maxPrice, 0, 1000000) : '',
            name: sanitizeInput(rawFilters.name),
            sort: rawFilters.sort,
        };

        // Crear clave de caché
        const cacheKey = JSON.stringify(filters);
        const now = Date.now();
        
        // Verificar caché
        if (cache.searchResults.has(cacheKey) && (now - cache.lastSearchTime) < cache.CACHE_DURATION) {
            const cachedResults = cache.searchResults.get(cacheKey);
            renderProductGrid(document.getElementById('search-results-container'), cachedResults);
            return;
        }
        
        if (state.currentUser && Object.values(filters).some(v => v !== '')) {
             state.searchHistory.push({
                id: Date.now(),
                date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                filters: Object.fromEntries(Object.entries(filters).filter(([k, v]) => v !== '' && k !== 'sort')),
            });
            state.searchHistory = state.searchHistory.slice(-5); 
        }

        let results = phoneDatabase.filter(phone => 
            (!filters.brand || phone.brand === filters.brand) &&
            (!filters.storage || phone.storage === filters.storage) &&
            (!filters.ram || phone.ram === filters.ram) &&
            (!filters.os || phone.os === filters.os) &&
            (!filters.condition || phone.condition === filters.condition) &&
            (!filters.screen || phone.screen === filters.screen) &&
            (!filters.minCamera || parseInt(phone.camera) >= parseInt(filters.minCamera)) &&
            (!filters.minBattery || phone.battery >= parseInt(filters.minBattery)) &&
            (!filters.minPrice || phone.price >= parseInt(filters.minPrice)) &&
            (!filters.maxPrice || phone.price <= parseInt(filters.maxPrice)) &&
            (!filters.name || phone.name.toLowerCase().includes(filters.name.toLowerCase()))
        );

        // Aplicar ordenamiento
        results = sortResults(results, filters.sort);

        // Guardar en caché
        cache.searchResults.set(cacheKey, results);
        cache.lastSearchTime = now;

        renderProductGrid(document.getElementById('search-results-container'), results);
    };

    const sortResults = (results, sortBy) => {
        switch (sortBy) {
            case 'name':
                return results.sort((a, b) => a.name.localeCompare(b.name));
            case 'price-asc':
                return results.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return results.sort((a, b) => b.price - a.price);
            case 'battery-desc':
                return results.sort((a, b) => b.battery - a.battery);
            case 'camera-desc':
                return results.sort((a, b) => parseInt(b.camera) - parseInt(a.camera));
            case 'storage-desc':
                return results.sort((a, b) => parseInt(b.storage) - parseInt(a.storage));
            default:
                return results;
        }
    };

    const clearFilters = () => {
        const filterInputs = [
            'filter-brand', 'filter-storage', 'filter-ram', 'filter-os', 
            'filter-condition', 'filter-minCamera', 'filter-minBattery', 
            'filter-minPrice', 'filter-maxPrice', 'filter-name', 'filter-screen'
        ];
        
        filterInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = '';
            }
        });
        
        // Reset sort to default
        const sortSelect = document.getElementById('filter-sort');
        if (sortSelect) {
            sortSelect.value = 'name';
        }
        
        handleSearch();
        showToast('Filtros limpiados', 'info');
    };

    const exportComparison = () => {
        if (state.comparisonPhones.length === 0) {
            showToast('No hay teléfonos para exportar', 'warning');
            return;
        }

        const exportData = {
            title: 'Comparación de Teléfonos - Pito Pérez',
            date: new Date().toLocaleDateString('es-ES'),
            phones: state.comparisonPhones.map(phone => ({
                nombre: phone.name,
                marca: phone.brand.charAt(0).toUpperCase() + phone.brand.slice(1),
                precio: `$${phone.price.toLocaleString('es-MX')}`,
                ram: phone.ram,
                almacenamiento: phone.storage,
                camara: phone.camera,
                bateria: `${phone.battery} mAh`,
                sistema: phone.os.toUpperCase(),
                condicion: phone.condition.charAt(0).toUpperCase() + phone.condition.slice(1),
                pantalla: phone.screen.charAt(0).toUpperCase() + phone.screen.slice(1)
            }))
        };

        // Crear CSV
        const csvContent = createCSV(exportData.phones);
        downloadFile(csvContent, 'comparacion-telefonos.csv', 'text/csv');

        // Crear JSON
        const jsonContent = JSON.stringify(exportData, null, 2);
        downloadFile(jsonContent, 'comparacion-telefonos.json', 'application/json');

        showToast('Comparación exportada exitosamente', 'success');
    };

    const createCSV = (phones) => {
        const headers = ['Nombre', 'Marca', 'Precio', 'RAM', 'Almacenamiento', 'Cámara', 'Batería', 'Sistema', 'Condición', 'Pantalla'];
        const csvRows = [headers.join(',')];
        
        phones.forEach(phone => {
            const row = [
                `"${phone.nombre}"`,
                `"${phone.marca}"`,
                `"${phone.precio}"`,
                `"${phone.ram}"`,
                `"${phone.almacenamiento}"`,
                `"${phone.camara}"`,
                `"${phone.bateria}"`,
                `"${phone.sistema}"`,
                `"${phone.condicion}"`,
                `"${phone.pantalla}"`
            ];
            csvRows.push(row.join(','));
        });
        
        return csvRows.join('\n');
    };

    const downloadFile = (content, filename, mimeType) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleEasyAnswer = (e) => {
        if (e.target.matches('.easy-option')) {
            const questionId = e.target.closest('.easy-options').dataset.questionId;
            const value = e.target.dataset.value;
            
            // Remover selección anterior en esta pregunta
            e.target.closest('.easy-options').querySelectorAll('.easy-option').forEach(btn => {
                btn.classList.remove('border-indigo-500', 'bg-indigo-500/20', 'ring-2', 'ring-indigo-500/50');
                btn.classList.add('border-white/20', 'bg-white/10');
            });
            
            // Marcar selección actual
            e.target.classList.remove('border-white/20', 'bg-white/10');
            e.target.classList.add('border-indigo-500', 'bg-indigo-500/20', 'ring-2', 'ring-indigo-500/50');
            
            // Guardar respuesta
            state.easyModeAnswers[questionId] = value;
            
            // Actualizar display de preguntas
            updateQuestionDisplay();
            
            // Efecto de selección
            e.target.style.transform = 'scale(0.95)';
            setTimeout(() => {
                e.target.style.transform = '';
            }, 150);
        }
    };

    const handleNextQuestion = () => {
        if (state.currentQuestionIndex < 4) {
            state.currentQuestionIndex++;
            updateQuestionDisplay();
        }
    };

    const handlePrevQuestion = () => {
        if (state.currentQuestionIndex > 0) {
            state.currentQuestionIndex--;
            updateQuestionDisplay();
        }
    };

    const updateQuestionDisplay = () => {
        const questions = document.querySelectorAll('.question-card');
        const currentQuestion = document.getElementById('current-question');
        const progressBar = document.getElementById('progress-bar');
        const nextBtn = document.getElementById('next-question-btn');
        const prevBtn = document.getElementById('prev-question-btn');
        const recommendationsBtn = document.getElementById('get-recommendations-btn');
        
        // Ocultar todas las preguntas
        questions.forEach((q, index) => {
            if (index === state.currentQuestionIndex) {
                q.classList.remove('hidden');
                q.classList.add('active');
            } else {
                q.classList.add('hidden');
                q.classList.remove('active');
            }
        });
        
        // Actualizar contador y barra de progreso
        if (currentQuestion) {
            currentQuestion.textContent = state.currentQuestionIndex + 1;
        }
        
        if (progressBar) {
            const progress = ((state.currentQuestionIndex + 1) / questions.length) * 100;
            progressBar.style.width = `${progress}%`;
        }
        
        // Actualizar botones
        if (prevBtn) {
            prevBtn.disabled = state.currentQuestionIndex === 0;
        }
        
        if (nextBtn) {
            const currentQuestionId = questions[state.currentQuestionIndex]?.querySelector('.easy-options')?.dataset.questionId;
            const hasAnswer = currentQuestionId && state.easyModeAnswers[currentQuestionId];
            nextBtn.disabled = !hasAnswer || state.currentQuestionIndex === questions.length - 1;
        }
        
        if (recommendationsBtn) {
            const totalQuestions = questions.length;
            const answeredQuestions = Object.keys(state.easyModeAnswers).length;
            const shouldShow = answeredQuestions === totalQuestions;
            
            if (shouldShow) {
                recommendationsBtn.classList.remove('hidden');
                nextBtn.classList.add('hidden');
            } else {
                recommendationsBtn.classList.add('hidden');
                nextBtn.classList.remove('hidden');
            }
        }
    };

    const handleGetRecommendations = () => {
        const budgetRanges = { 
            'very-low': [0, 5500],
            'low': [5500, 9250],
            'medium': [9250, 14800],
            'high': [14800, 22200],
            'premium': [22200, Infinity],
            'flexible': [0, Infinity]
        };
        
        let phones = [...phoneDatabase];
        
        // Algoritmo de puntuación mejorado
        const calculateScore = (phone) => {
            let score = 0;
            const answers = state.easyModeAnswers;
            
            // Puntuación por presupuesto (0-30 puntos)
            if (answers.budget && answers.budget !== 'flexible') {
                const [min, max] = budgetRanges[answers.budget];
                if (phone.price >= min && phone.price <= max) {
                    score += 30;
                } else if (phone.price < min) {
                    score += 20; // Cerca del rango
                } else if (phone.price > max) {
                    score += 10; // Por encima pero no mucho
                }
            } else {
                score += 15; // Puntuación neutral para flexible
            }
            
            // Puntuación por sistema operativo (0-25 puntos)
            if (answers.system) {
                if (answers.system === 'ios' && phone.os === 'ios') score += 25;
                else if (answers.system === 'android' && phone.os === 'android') score += 25;
                else if (answers.system === 'prefer-ios' && phone.os === 'ios') score += 20;
                else if (answers.system === 'prefer-android' && phone.os === 'android') score += 20;
                else if (answers.system === 'any') score += 15;
                else score += 5; // Penalización por no coincidir
            }
            
            // Puntuación por tamaño de pantalla (0-15 puntos)
            if (answers.size && answers.size !== 'any') {
                const sizeRanges = {
                    'small': [0, 5.5],
                    'medium': [5.5, 6.2],
                    'large': [6.2, Infinity]
                };
                const [min, max] = sizeRanges[answers.size];
                if (phone.screenSize >= min && phone.screenSize <= max) {
                    score += 15;
                } else {
                    score += 8; // Puntuación parcial
                }
            }
            
            // Puntuación por prioridad (0-30 puntos)
            if (answers.priority) {
                const priority = answers.priority;
                const maxValues = {
                    battery: Math.max(...phones.map(p => p.battery)),
                    camera: Math.max(...phones.map(p => parseInt(p.camera))),
                    storage: Math.max(...phones.map(p => parseInt(p.storage))),
                    performance: Math.max(...phones.map(p => parseInt(p.ram)))
                };
                
                switch (priority) {
                    case 'battery':
                        score += (phone.battery / maxValues.battery) * 30;
                        break;
                    case 'camera':
                        score += (parseInt(phone.camera) / maxValues.camera) * 30;
                        break;
                    case 'storage':
                        score += (parseInt(phone.storage) / maxValues.storage) * 30;
                        break;
                    case 'performance':
                        score += (parseInt(phone.ram) / maxValues.performance) * 30;
                        break;
                    case 'brand':
                        const knownBrands = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Huawei'];
                        score += knownBrands.includes(phone.brand) ? 30 : 15;
                        break;
                    case 'design':
                        // Puntuación basada en características de diseño
                        score += (phone.screenSize > 6 ? 20 : 15) + (phone.weight < 200 ? 10 : 5);
                        break;
                    case 'durability':
                        // Puntuación basada en características de durabilidad
                        score += (phone.battery > 4000 ? 15 : 10) + (parseInt(phone.storage) > 128 ? 15 : 10);
                        break;
                    case 'value':
                        const valueScore = (phone.battery + parseInt(phone.camera) + parseInt(phone.storage) + parseInt(phone.ram)) / phone.price * 1000;
                        score += Math.min(valueScore, 30);
                        break;
                }
            }
            
            // Puntuación por uso (0-20 puntos)
            if (answers.usage) {
                switch (answers.usage) {
                    case 'basic':
                        score += 20; // Cualquier teléfono sirve
                        break;
                    case 'social':
                        score += (parseInt(phone.camera) > 12 ? 20 : 15) + (parseInt(phone.storage) > 64 ? 5 : 0);
                        break;
                    case 'gaming':
                        score += (parseInt(phone.ram) > 6 ? 20 : 15) + (phone.battery > 4000 ? 5 : 0);
                        break;
                    case 'professional':
                        score += (parseInt(phone.storage) > 128 ? 15 : 10) + (parseInt(phone.ram) > 6 ? 10 : 5);
                        break;
                    case 'creative':
                        score += (parseInt(phone.camera) > 20 ? 20 : 15) + (parseInt(phone.storage) > 128 ? 5 : 0);
                        break;
                    case 'student':
                        score += (phone.battery > 3500 ? 15 : 10) + (parseInt(phone.storage) > 64 ? 10 : 5);
                        break;
                    case 'travel':
                        score += (phone.battery > 4000 ? 15 : 10) + (parseInt(phone.camera) > 12 ? 10 : 5);
                        break;
                    case 'mixed':
                        score += 15; // Puntuación equilibrada
                        break;
                }
            }
            
            return Math.round(score);
        };
        
        // Calcular puntuaciones y ordenar
        phones.forEach(phone => {
            phone.recommendationScore = calculateScore(phone);
        });
        
        phones.sort((a, b) => b.recommendationScore - a.recommendationScore);
        
        // Mostrar resultados mejorados
        const resultsContainer = document.getElementById('easy-mode-results-container');
        if (phones.length === 0) {
            resultsContainer.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-6xl mb-4">😔</div>
                    <h3 class="text-2xl font-bold text-white mb-2">No encontramos teléfonos</h3>
                    <p class="text-white/80 mb-6">Intenta ajustar tus criterios de búsqueda</p>
                    <button onclick="renderEasyModeView()" class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                        Volver a intentar
                    </button>
                </div>
            `;
        } else {
            const topPhones = phones.slice(0, 6);
            const totalMatches = phones.filter(p => p.recommendationScore > 50).length;
            
            resultsContainer.innerHTML = `
                <div class="glass p-8 rounded-3xl shadow-2xl border border-white/20 mb-8">
                    <div class="text-center mb-6">
                        <div class="text-6xl mb-4">🎉</div>
                        <h3 class="text-3xl font-bold text-white mb-2">¡Recomendaciones Perfectas!</h3>
                        <p class="text-white/80 text-lg">Encontramos ${totalMatches} teléfonos que coinciden perfectamente con tus preferencias</p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${topPhones.map((phone, index) => `
                            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="flex items-center gap-2">
                                        <span class="text-2xl">${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐'}</span>
                                        <span class="text-sm font-semibold text-white/80">Recomendación #${index + 1}</span>
                                    </div>
                                    <div class="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        ${phone.recommendationScore}%
                                    </div>
                                </div>
                                ${renderProductCard(phone, state.favorites.includes(phone.id), 'Recomendado')}
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="text-center mt-8">
                        <button onclick="renderEasyModeView()" class="bg-white/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 mr-4">
                            🔄 Volver a intentar
                        </button>
                        <button onclick="updateView('search')" class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300">
                            🔍 Búsqueda Avanzada
                        </button>
                    </div>
                </div>
            `;
        }
    };

    function handleLogin(e) {
        e.preventDefault();
        const rawEmail = e.target.elements[0].value;
        
        // Validar y sanitizar email
        if (!validateEmail(rawEmail)) {
            alert('Por favor ingresa un email válido');
            secureLogger.warn('Intento de login con email inválido');
            return;
        }
        
        const email = sanitizeInput(rawEmail);
        const name = escapeHtml(email.split('@')[0]);
        
        state.currentUser = { 
            id: Date.now(), 
            name: name, 
            email: email 
        };
        
        secureLogger.info('Usuario autenticado exitosamente');
        modalBackdrop.classList.add('hidden');
        updateAll();
    }

    function handleRegister(e) {
        e.preventDefault();
        const rawName = e.target.elements[0].value.trim();
        const rawEmail = e.target.elements[1].value;
        
        // Validar email
        if (!validateEmail(rawEmail)) {
            alert('Por favor ingresa un email válido');
            secureLogger.warn('Intento de registro con email inválido');
            return;
        }
        
        // Sanitizar entradas
        const name = escapeHtml(sanitizeInput(rawName));
        const email = sanitizeInput(rawEmail);
        const password = e.target.elements[2].value.trim(); 
        
        let isPitoPerez = false;
        if (name.toLowerCase() === 'pito pérez' && password.toLowerCase() === 'peraza') {
            isPitoPerez = true;
        }

        state.currentUser = { id: Date.now(), name, email, isPitoPerez };
        modalBackdrop.classList.add('hidden');
        updateAll();
    }

    const handleLogout = () => {
        state.currentUser = null;
        state.favorites = [];
        state.searchHistory = [];
        updateAll();
    };

    const handleToggleFavorite = (phoneId) => {
        if (!state.currentUser) {
            showAuthModal();
            return;
        }
        const isFavorite = state.favorites.some(f => f.id === phoneId);
        if (isFavorite) {
            state.favorites = state.favorites.filter(f => f.id !== phoneId);
        } else {
            const phone = phoneDatabase.find(p => p.id === phoneId);
            state.favorites.push(phone);
        }
        updateAll(); 
    };

    const handleToggleComparison = (phoneId) => {
        const phone = phoneDatabase.find(p => p.id === phoneId);
        const isInComparison = state.comparisonPhones.some(p => p.id === phoneId);
        
        if (isInComparison) {
            state.comparisonPhones = state.comparisonPhones.filter(p => p.id !== phoneId);
            showToast('Teléfono removido de la comparación', 'info');
        } else {
            if (state.comparisonPhones.length >= 3) {
                showToast('Máximo 3 teléfonos para comparar', 'warning');
                return;
            }
            state.comparisonPhones.push(phone);
            showToast('Teléfono agregado a la comparación', 'success');
        }
        updateAll();
    };

    const renderComparisonView = () => {
        if (state.comparisonPhones.length === 0) {
            return `
                <div class="text-center py-16">
                    <div class="text-7xl mb-4">📊</div>
                    <h3 class="text-xl font-bold text-slate-700 mb-2">No hay teléfonos para comparar</h3>
                    <p class="text-slate-500">Agrega hasta 3 teléfonos para comparar sus especificaciones.</p>
                </div>
            `;
        }

        const comparisonHTML = state.comparisonPhones.map(phone => `
            <div class="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div class="text-center mb-4">
                    <div class="h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-4xl overflow-hidden mb-4">
                        <img src="${phone.image}" alt="${phone.name}" class="object-cover h-full w-full" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                        <div class="hidden items-center justify-center h-full w-full text-4xl bg-gradient-to-br from-indigo-100 to-purple-100">📱</div>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800 mb-2">${phone.name}</h3>
                    <div class="text-2xl font-bold gradient-text mb-4">$${phone.price.toLocaleString('es-MX')}</div>
                </div>
                
                <div class="space-y-3">
                    <div class="flex justify-between items-center py-2 border-b border-slate-100">
                        <span class="text-sm text-slate-600">Marca</span>
                        <span class="font-semibold">${phone.brand.charAt(0).toUpperCase() + phone.brand.slice(1)}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-slate-100">
                        <span class="text-sm text-slate-600">RAM</span>
                        <span class="font-semibold">${phone.ram}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-slate-100">
                        <span class="text-sm text-slate-600">Almacenamiento</span>
                        <span class="font-semibold">${phone.storage}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-slate-100">
                        <span class="text-sm text-slate-600">Cámara</span>
                        <span class="font-semibold">${phone.camera}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-slate-100">
                        <span class="text-sm text-slate-600">Batería</span>
                        <span class="font-semibold">${phone.battery} mAh</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-slate-100">
                        <span class="text-sm text-slate-600">Sistema</span>
                        <span class="font-semibold">${phone.os.toUpperCase()}</span>
                    </div>
                    <div class="flex justify-between items-center py-2">
                        <span class="text-sm text-slate-600">Condición</span>
                        <span class="font-semibold">${phone.condition.charAt(0).toUpperCase() + phone.condition.slice(1)}</span>
                    </div>
                </div>
                
                <button class="remove-comparison-btn w-full mt-4 bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors" data-id="${phone.id}">
                    Quitar de Comparación
                </button>
            </div>
        `).join('');

        return `
            <div class="glass p-8 rounded-3xl shadow-2xl border border-white/20 mb-8">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-3xl font-bold text-white">Comparación de Teléfonos</h2>
                    <div class="flex gap-2">
                        <button id="export-comparison-btn" class="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors modern-btn">
                            📊 Exportar
                        </button>
                        <button id="clear-comparison-btn" class="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors modern-btn">
                            Limpiar Todo
                        </button>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${comparisonHTML}
                </div>
            </div>
        `;
    };

    const updateAll = () => {
        renderAuthSection();
        updateComparisonFab();
        if(state.currentView === 'search') {
            handleSearch();
        } else if (state.currentView === 'account') {
            renderAccountView();
        } else if (state.currentView === 'comparison') {
            renderComparisonViewContent();
        }
    };

    const updateComparisonFab = () => {
        const fab = document.getElementById('comparison-fab');
        const count = document.getElementById('comparison-count');
        
        if (state.comparisonPhones.length > 0) {
            fab.classList.remove('hidden');
            count.textContent = state.comparisonPhones.length;
        } else {
            fab.classList.add('hidden');
        }
    };

    const renderComparisonViewContent = () => {
        const container = document.getElementById('comparison-content');
        if (container) {
            container.innerHTML = renderComparisonView();
        }
    };
    
    document.querySelector('body').addEventListener('click', (e) => {
        const detailsBtn = e.target.closest('.details-btn');
        if (detailsBtn) {
            const phone = phoneDatabase.find(p => p.id === parseInt(detailsBtn.dataset.id));
            showProductModal(phone);
        }
        const favoriteBtn = e.target.closest('.favorite-btn');
        if (favoriteBtn) {
            handleToggleFavorite(parseInt(favoriteBtn.dataset.id));
        }
        const compareBtn = e.target.closest('.compare-btn');
        if (compareBtn) {
            handleToggleComparison(parseInt(compareBtn.dataset.id));
        }
        const removeComparisonBtn = e.target.closest('.remove-comparison-btn');
        if (removeComparisonBtn) {
            handleToggleComparison(parseInt(removeComparisonBtn.dataset.id));
        }
        const clearComparisonBtn = e.target.closest('#clear-comparison-btn');
        if (clearComparisonBtn) {
            state.comparisonPhones = [];
            updateAll();
            showToast('Comparación limpiada', 'info');
        }
        const exportComparisonBtn = e.target.closest('#export-comparison-btn');
        if (exportComparisonBtn) {
            exportComparison();
        }
        const comparisonFab = e.target.closest('#comparison-fab button');
        if (comparisonFab) {
            updateView('comparison');
        }
        const deleteHistoryBtn = e.target.closest('.delete-history-btn');
        if (deleteHistoryBtn) {
            state.searchHistory = state.searchHistory.filter(h => h.id !== parseInt(deleteHistoryBtn.dataset.id));
            renderAccountContent('history');
        }
    });

    navButtons.forEach(b => b.addEventListener('click', handleNavClick));
    mobileNavButtons.forEach(b => b.addEventListener('click', handleNavClick));

    fetchAndInitializeApp(loadingIndicator, renderAuthSection, renderCharts, renderSearchView, renderEasyModeView, renderAccountView, updateView, FAKE_STORE_API_URL, mapToPhoneSpecs).then(newPhoneDatabase => {
        phoneDatabase = newPhoneDatabase;
        renderAuthSection();
        renderCharts();
        renderSearchView();
        renderEasyModeView();
        renderAccountView();
        // renderCommentsView se llamará cuando se acceda a la vista de comentarios
        updateView('dashboard');
        
        // Inicializar tema después de que todo esté cargado
        initializeTheme();
    });
});

// Debounce function for real-time search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Theme management - Modo claro y oscuro
let isDarkMode = false;

function initializeTheme() {
    // Cargar preferencia guardada o usar preferencia del sistema
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        enableDarkMode();
    } else {
        enableLightMode();
    }
    
    // Configurar event listener para el botón de toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Escuchar cambios en la preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                enableDarkMode();
            } else {
                enableLightMode();
            }
        }
    });
}

function toggleTheme() {
    if (isDarkMode) {
        enableLightMode();
    } else {
        enableDarkMode();
    }
}

function enableDarkMode() {
    isDarkMode = true;
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    updateThemeIcons();
    console.log('Modo oscuro activado');
}

function enableLightMode() {
    isDarkMode = false;
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    updateThemeIcons();
    console.log('Modo claro activado');
}

function updateThemeIcons() {
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    
    if (isDarkMode) {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
}

// Gestos móviles
function initializeMobileGestures() {
    if (!('ontouchstart' in window)) return;
    
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        
        handleSwipeGesture(startX, startY, endX, endY);
    }, { passive: true });
    
    // Agregar clases móviles al body
    document.body.classList.add('mobile-device');
}

function handleSwipeGesture(startX, startY, endX, endY) {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const minSwipeDistance = 50;
    
    // Verificar si es un swipe horizontal
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        const views = ['dashboard', 'search', 'easy', 'comparison', 'account', 'comments'];
        const currentIndex = views.indexOf(state.currentView);
        
        if (deltaX > 0 && currentIndex > 0) {
            // Swipe derecha - vista anterior
            updateView(views[currentIndex - 1]);
            showToast('← Vista anterior', 'info');
        } else if (deltaX < 0 && currentIndex < views.length - 1) {
            // Swipe izquierda - vista siguiente
            updateView(views[currentIndex + 1]);
            showToast('Vista siguiente →', 'info');
        }
    }
}

// Mejorar la experiencia táctil
function enhanceTouchExperience() {
    // Agregar feedback háptico si está disponible
    if ('vibrate' in navigator) {
        document.addEventListener('touchstart', (e) => {
            if (e.target.matches('button, .product-card, .mobile-nav-item')) {
                navigator.vibrate(10);
            }
        }, { passive: true });
    }
    
    // Mejorar scroll en móvil
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // Prevenir zoom en inputs
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            if (window.innerWidth < 768) {
                input.style.fontSize = '16px';
            }
        });
    });
}


function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full flex items-center gap-2`;
    toast.innerHTML = `
        <span class="text-lg">${icons[type]}</span>
        <span>${message}</span>
        <button class="ml-2 text-white hover:text-gray-200" onclick="this.parentElement.remove()">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
    `;
    
    document.body.appendChild(toast);
    
    // Animación de entrada
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // Auto-remove
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
    }, duration);
    
    // Feedback háptico
    if ('vibrate' in navigator) {
        const vibrationPattern = {
            success: [100],
            error: [200, 100, 200],
            warning: [150],
            info: [50]
        };
        navigator.vibrate(vibrationPattern[type] || [50]);
    }
}

// PWA and Notifications
function initializePWA() {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
        const swPath = 'src/js/sw.js';
        navigator.serviceWorker.register(swPath)
            .then((registration) => {
                console.log('✅ SW registrado exitosamente:', registration);
            })
            .catch((error) => {
                console.warn('⚠️ Service Worker no disponible (esto es normal en desarrollo):', error.message);
            });
    }
    
    // Solicitar permisos de notificación
    if ('Notification' in window) {
        if (Notification.permission === 'default') {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    showToast('Notificaciones habilitadas', 'success');
                }
            });
        }
    }
    
    // Detectar si es instalable
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallButton();
    });
    
    // Detectar si ya está instalado
    window.addEventListener('appinstalled', () => {
        showToast('¡App instalada exitosamente!', 'success');
        hideInstallButton();
    });
}

function showInstallButton() {
    const installBtn = document.createElement('button');
    installBtn.id = 'install-btn';
    installBtn.className = 'fixed bottom-20 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 hover:bg-indigo-700 transition-colors';
    installBtn.innerHTML = '📱 Instalar App';
    installBtn.onclick = installApp;
    document.body.appendChild(installBtn);
}

function hideInstallButton() {
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
        installBtn.remove();
    }
}

function installApp() {
    if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
        window.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuario aceptó la instalación');
            }
            window.deferredPrompt = null;
        });
    }
}

function sendNotification(title, body, icon = null) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: body,
            icon: icon || '/icon-192x192.png',
            badge: '/badge-72x72.png',
            vibrate: [100, 50, 100],
            requireInteraction: true
        });
        
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
        
        return notification;
    }
}

// Notificaciones automáticas mejoradas
function scheduleNotifications() {
    // Notificación de bienvenida
    setTimeout(() => {
        sendNotification(
            '¡Bienvenido a Pito Pérez!',
            'Explora nuestro catálogo de teléfonos y encuentra el perfecto para ti.',
            '/icon-192x192.png'
        );
        showToast('¡Bienvenido! Explora nuestro catálogo de teléfonos', 'success', 5000);
    }, 2000);
    
    // Notificación de nuevas funciones
    setTimeout(() => {
        sendNotification(
            'Nuevas funciones disponibles',
            'Ahora puedes comparar hasta 3 teléfonos, usar el modo oscuro y exportar comparaciones.',
            '/icon-192x192.png'
        );
        showToast('Nuevas funciones: Comparación, modo oscuro y exportación', 'info', 5000);
    }, 15000);
    
    // Notificación de consejos
    setTimeout(() => {
        const tips = [
            '💡 Tip: Usa gestos de deslizar en móvil para navegar entre vistas',
            '💡 Tip: Puedes comparar hasta 3 teléfonos simultáneamente',
            '💡 Tip: Usa el modo oscuro para una mejor experiencia nocturna',
            '💡 Tip: Exporta tus comparaciones en CSV o JSON',
            '💡 Tip: Los filtros se actualizan en tiempo real'
        ];
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        showToast(randomTip, 'info', 6000);
    }, 45000);
}

// Modal de autenticación
function showAuthModal(type = 'login') {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    ${type === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
                </h2>
                <button onclick="this.closest('.fixed').remove()" class="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <form id="auth-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nombre</label>
                    <input type="text" id="auth-name" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                    <input type="email" id="auth-email" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Contraseña</label>
                    <input type="password" id="auth-password" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100" required>
                </div>
                <button type="submit" class="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                    ${type === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
                </button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listener para el formulario
    document.getElementById('auth-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('auth-name').value;
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        
        if (type === 'login') {
            handleLogin(name, email, password);
        } else {
            handleRegister(name, email, password);
        }
        
        modal.remove();
    });
}

// Funciones de autenticación
function handleLogin(name, email, password) {
    // Simulación de login
    state.currentUser = { id: 1, name, email };
    renderAuthSection();
    showToast('¡Bienvenido!', 'success');
}

function handleRegister(name, email, password) {
    // Simulación de registro
    state.currentUser = { id: 1, name, email };
    renderAuthSection();
    showToast('¡Cuenta creada exitosamente!', 'success');
}

function handleLogout() {
    state.currentUser = null;
    renderAuthSection();
    showToast('Sesión cerrada', 'info');
}
