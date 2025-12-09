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
    
    // Inicializar botón de ayuda
    initializeHelpButton();

    // Inicializar variables globales para autenticación
    globalState = null;
    globalRenderAuthSection = null;
    globalShowToast = null;

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
        
        // Limpiar resultados anteriores
        const resultsContainer = document.getElementById('easy-mode-results-container');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
        
        easyQuestionsContainer.innerHTML = `
            <div class="mb-8 glass p-6 rounded-3xl shadow-xl border border-white/20">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                    <div>
                        <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">🎯 Encuentra tu teléfono ideal</h2>
                        <p class="text-white/80 text-sm md:text-base">Solo unas preguntas y te mostraremos las mejores opciones</p>
                        </div>
                    <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                        <span class="text-2xl">📊</span>
                        <div class="text-white">
                            <div class="text-xs text-white/70">Progreso</div>
                            <div class="text-lg font-bold">
                                <span id="current-question">1</span> / <span>${questions.length}</span>
                    </div>
                </div>
                    </div>
                </div>
                <div class="w-full bg-white/20 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
                    <div id="progress-bar" class="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-700 ease-out shadow-lg relative overflow-hidden" style="width: ${100/questions.length}%">
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                </div>
                <div class="flex items-center justify-center gap-2 mt-3">
                    <span class="text-white/70 text-sm">💡</span>
                    <p class="text-white/70 text-sm text-center">Haz clic en una opción para continuar automáticamente</p>
                </div>
            </div>
            
            <div id="questions-container" class="relative">
                ${questions.map((q, index) => `
                    <div class="question-card ${index === 0 ? 'active' : 'hidden'} transition-all duration-500 ease-out" data-question-index="${index}">
                        <div class="glass p-6 md:p-10 rounded-3xl shadow-2xl border-2 border-white/30 mb-6 transform transition-all duration-500 hover:shadow-3xl">
                            <div class="text-center mb-8">
                                <div class="text-7xl md:text-8xl mb-4 animate-pulse">${q.icon}</div>
                                <h3 class="text-2xl md:text-3xl font-extrabold text-white mb-3 drop-shadow-lg">${q.title}</h3>
                                <p class="text-white/90 text-base md:text-lg font-medium">${q.description}</p>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 easy-options" data-question-id="${q.id}">
                                ${q.options.map((opt, optIndex) => `
                                    <button data-value="${opt.value}" class="easy-option relative p-6 md:p-8 rounded-2xl border-2 border-white/20 bg-white/10 hover:border-white/50 hover:bg-white/25 transition-all duration-300 text-center group hover:scale-110 hover:shadow-2xl transform backdrop-blur-sm overflow-hidden" style="animation-delay: ${optIndex * 50}ms">
                                        <div class="absolute inset-0 bg-gradient-to-br from-${opt.color}-500/20 to-${opt.color}-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div class="relative z-10">
                                            <div class="text-5xl md:text-6xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 transform">${opt.emoji}</div>
                                            <div class="font-extrabold text-white text-lg md:text-xl mb-2 drop-shadow-md">${opt.label}</div>
                                            <div class="text-white/80 text-sm md:text-base font-medium">${opt.sublabel}</div>
                                            <div class="mt-4 w-12 h-1.5 bg-gradient-to-r from-${opt.color}-400 to-${opt.color}-600 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100"></div>
                                        </div>
                                        <div class="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 glass p-4 rounded-2xl border border-white/20">
                <button id="prev-question-btn" class="w-full sm:w-auto bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/20 flex items-center justify-center gap-2 transform hover:scale-105">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    <span>Anterior</span>
                </button>
                <div class="text-white/80 text-xs sm:text-sm text-center flex-1 px-4">
                    <p class="flex items-center justify-center gap-2">
                        <span>✨</span>
                        <span>Puedes volver atrás para cambiar tus respuestas</span>
                    </p>
                </div>
                <button id="reset-easy-mode" class="w-full sm:w-auto bg-red-500/80 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    <span>Reiniciar</span>
                </button>
            </div>
        `;

        // Event listeners
        document.getElementById('prev-question-btn').addEventListener('click', handlePrevQuestion);
        document.getElementById('reset-easy-mode').addEventListener('click', () => {
            state.easyModeAnswers = {};
            state.currentQuestionIndex = 0;
            renderEasyModeView();
        });
        easyQuestionsContainer.addEventListener('click', handleEasyAnswer);
        
        // Inicializar primera pregunta
        updateQuestionDisplay();
    };

    const renderAccountView = () => {
    if (!state.currentUser) {
        accountViewContainer.innerHTML = `
            <div class="max-w-md mx-auto">
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold text-white mb-2">👤 Mi Cuenta</h1>
                    <p class="text-white/80">Inicia sesión o regístrate para guardar tus preferencias</p>
                </div>
                
                <!-- Formulario de Login -->
                <div class="glass p-6 rounded-2xl mb-6 border border-white/20">
                    <h2 class="text-xl font-bold text-white mb-4">Iniciar Sesión</h2>
                    <form id="login-form" class="space-y-4">
                        <div>
                            <label for="login-email" class="block text-sm font-medium text-white mb-2">Correo Electrónico</label>
                            <input type="email" id="login-email" required 
                                   class="w-full p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                                   placeholder="tu@email.com">
                        </div>
                        <div>
                            <label for="login-password" class="block text-sm font-medium text-white mb-2">Contraseña</label>
                            <input type="password" id="login-password" required 
                                   class="w-full p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                                   placeholder="••••••••">
                        </div>
                        <button type="submit" 
                                class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                            Iniciar Sesión
                        </button>
                    </form>
                </div>
                
                <!-- Formulario de Registro -->
                <div class="glass p-6 rounded-2xl border border-white/20">
                    <h2 class="text-xl font-bold text-white mb-4">Crear Cuenta</h2>
                    <form id="register-form" class="space-y-4">
                        <div>
                            <label for="register-name" class="block text-sm font-medium text-white mb-2">Nombre Completo</label>
                            <input type="text" id="register-name" required 
                                   class="w-full p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                                   placeholder="Tu nombre">
                        </div>
                        <div>
                            <label for="register-email" class="block text-sm font-medium text-white mb-2">Correo Electrónico</label>
                            <input type="email" id="register-email" required 
                                   class="w-full p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                                   placeholder="tu@email.com">
                        </div>
                        <div>
                            <label for="register-password" class="block text-sm font-medium text-white mb-2">Contraseña</label>
                            <input type="password" id="register-password" required 
                                   class="w-full p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                                   placeholder="••••••••">
                            <p class="text-xs text-white/60 mt-1">Mínimo 8 caracteres</p>
                        </div>
                        <div>
                            <label for="register-password-confirm" class="block text-sm font-medium text-white mb-2">Confirmar Contraseña</label>
                            <input type="password" id="register-password-confirm" required 
                                   class="w-full p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                                   placeholder="••••••••">
                        </div>
                        
                        <!-- TÉRMINOS Y CONDICIONES - NUEVO CAMPO -->
                        <div class="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                            <div class="flex items-start">
                                <input type="checkbox" id="terms-accepted" required
                                       class="mt-1 mr-3 h-5 w-5 rounded border-white/30 bg-white/20 text-indigo-600 focus:ring-indigo-400 focus:ring-offset-0">
                                <div>
                                    <label for="terms-accepted" class="text-sm font-medium text-white">
                                        He leído y acepto los 
                                        <button type="button" id="terms-link" 
                                                class="text-indigo-300 hover:text-indigo-200 underline transition-colors">
                                            Términos y Condiciones del Servicio
                                        </button>
                                    </label>
                                    <p class="text-xs text-white/60 mt-1">
                                        Al marcar esta casilla, aceptas nuestras políticas de privacidad, términos de uso y condiciones del servicio.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <button type="submit" 
                                class="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                            Crear Cuenta
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        // Agregar evento para abrir términos y condiciones
        setTimeout(() => {
            const termsLink = document.getElementById('terms-link');
            if (termsLink) {
                termsLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    showTermsModal();
                });
            }
        }, 100);
        
        // Manejar formulario de registro
        document.getElementById('register-form').addEventListener('submit', handleRegister);
        document.getElementById('login-form').addEventListener('submit', handleLogin);
    } else {
        
        // Verificar si es usuario especial (Pito Pérez) para mostrar opciones de administración
        const isAdmin = state.currentUser.isPitoPerez || state.currentUser.name.toLowerCase() === 'admin';
        
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
                            <nav class="-mb-px flex space-x-6 flex-wrap" id="account-tabs">
                                <button data-tab="favorites" class="account-tab-btn py-3 px-1 border-b-2 font-semibold border-indigo-500 text-indigo-600">❤️ Favoritos</button>
                                <button data-tab="history" class="account-tab-btn py-3 px-1 border-b-2 font-semibold border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300">📜 Historial</button>
                                ${isAdmin ? '<button data-tab="database" class="account-tab-btn py-3 px-1 border-b-2 font-semibold border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300">🗄️ Base de Datos</button>' : ''}
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
    }
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
        } else if (tab === 'database') {
            renderDatabaseView(container);
        }
    };
    
    const renderDatabaseView = (container) => {
        const users = getRegisteredUsers();
        const totalUsers = users.length;
        const uniqueEmails = new Set(users.map(u => u.email)).size;
        const today = new Date().toISOString().split('T')[0];
        const todayRegistrations = users.filter(u => u.registeredAt && u.registeredAt.startsWith(today)).length;
        
        container.innerHTML = `
            <div class="space-y-6">
                <!-- Estadísticas -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                        <div class="text-3xl mb-2">👥</div>
                        <div class="text-2xl font-bold text-blue-800">${totalUsers}</div>
                        <div class="text-sm text-blue-600">Total de Usuarios</div>
                    </div>
                    <div class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                        <div class="text-3xl mb-2">📧</div>
                        <div class="text-2xl font-bold text-green-800">${uniqueEmails}</div>
                        <div class="text-sm text-green-600">Correos Únicos</div>
                    </div>
                    <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                        <div class="text-3xl mb-2">📅</div>
                        <div class="text-2xl font-bold text-purple-800">${todayRegistrations}</div>
                        <div class="text-sm text-purple-600">Registros Hoy</div>
                    </div>
                </div>
                
                <!-- Acciones -->
                <div class="bg-white p-6 rounded-xl border border-slate-200 mb-6">
                    <h3 class="text-lg font-bold text-slate-800 mb-4">Acciones de Base de Datos</h3>
                    <div class="flex flex-wrap gap-3">
                        <button id="export-db-btn" class="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                            <span>📥</span>
                            Exportar JSON
                        </button>
                        <button id="export-csv-btn" class="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <span>📊</span>
                            Exportar CSV
                        </button>
                        <button id="import-db-btn" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                            <span>📤</span>
                            Importar JSON
                        </button>
                        <button id="clear-db-btn" class="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                            <span>🗑️</span>
                            Limpiar Base de Datos
                        </button>
                        <input type="file" id="import-file-input" accept=".json" class="hidden">
                    </div>
                </div>
                
                <!-- Lista de Usuarios -->
                <div class="bg-white p-6 rounded-xl border border-slate-200">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-slate-800">Usuarios Registrados (${totalUsers})</h3>
                        <input type="text" id="db-search-input" placeholder="🔍 Buscar usuario..." class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    </div>
                    <div id="users-list" class="space-y-2 max-h-96 overflow-y-auto">
                        ${users.length === 0 ? '<p class="text-center text-slate-500 py-8">No hay usuarios registrados</p>' : users.map(user => `
                            <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors user-item" data-username="${user.name.toLowerCase()}">
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 mb-1">
                                            <span class="font-bold text-slate-800">${escapeHtml(user.name)}</span>
                                            ${user.isPitoPerez ? '<span class="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">⭐ Especial</span>' : ''}
                                        </div>
                                        <div class="text-sm text-slate-600 mb-1">📧 ${escapeHtml(user.email)}</div>
                                        <div class="text-xs text-slate-500">🆔 ID: ${user.id} | 📅 ${user.registeredAt ? new Date(user.registeredAt).toLocaleDateString('es-ES') : 'N/A'}</div>
                                    </div>
                                    <button class="delete-user-btn bg-red-100 text-red-700 font-semibold p-2 rounded-lg text-sm hover:bg-red-200 transition-colors ml-4" data-id="${user.id}" data-name="${escapeHtml(user.name)}">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Event listeners
        setupDatabaseEvents();
    };
    
    const setupDatabaseEvents = () => {
        // Exportar JSON
        const exportDbBtn = document.getElementById('export-db-btn');
        if (exportDbBtn) {
            exportDbBtn.addEventListener('click', () => {
                const users = getRegisteredUsers();
                const dataStr = JSON.stringify(users, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `usuarios-${new Date().toISOString().split('T')[0]}.json`;
                link.click();
                URL.revokeObjectURL(url);
                showToast('Base de datos exportada exitosamente', 'success');
            });
        }
        
        // Exportar CSV
        const exportCsvBtn = document.getElementById('export-csv-btn');
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', () => {
                const users = getRegisteredUsers();
                const headers = ['ID', 'Nombre', 'Email', 'Fecha de Registro', 'Especial'];
                const csvRows = [headers.join(',')];
                
                users.forEach(user => {
                    const row = [
                        user.id,
                        `"${user.name.replace(/"/g, '""')}"`,
                        `"${user.email.replace(/"/g, '""')}"`,
                        `"${user.registeredAt ? new Date(user.registeredAt).toLocaleDateString('es-ES') : 'N/A'}"`,
                        user.isPitoPerez ? 'Sí' : 'No'
                    ];
                    csvRows.push(row.join(','));
                });
                
                const csvContent = csvRows.join('\n');
                const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `usuarios-${new Date().toISOString().split('T')[0]}.csv`;
                link.click();
                URL.revokeObjectURL(url);
                showToast('Base de datos exportada a CSV exitosamente', 'success');
            });
        }
        
        // Importar JSON
        const importDbBtn = document.getElementById('import-db-btn');
        const importFileInput = document.getElementById('import-file-input');
        if (importDbBtn && importFileInput) {
            importDbBtn.addEventListener('click', () => {
                importFileInput.click();
            });
            
            importFileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const importedUsers = JSON.parse(event.target.result);
                        if (!Array.isArray(importedUsers)) {
                            showToast('El archivo no contiene un array válido de usuarios', 'error');
                            return;
                        }
                        
                        // Validar estructura de usuarios
                        const validUsers = importedUsers.filter(user => 
                            user.id && user.name && user.email
                        );
                        
                        if (validUsers.length === 0) {
                            showToast('No se encontraron usuarios válidos en el archivo', 'error');
                            return;
                        }
                        
                        // Confirmar importación
                        if (confirm(`¿Importar ${validUsers.length} usuarios? Esto agregará los usuarios a la base de datos existente.`)) {
                            const existingUsers = getRegisteredUsers();
                            const mergedUsers = [...existingUsers];
                            
                            validUsers.forEach(newUser => {
                                // Evitar duplicados por ID
                                if (!mergedUsers.find(u => u.id === newUser.id)) {
                                    mergedUsers.push(newUser);
                                }
                            });
                            
                            localStorage.setItem('registeredUsers', JSON.stringify(mergedUsers));
                            showToast(`${validUsers.length} usuarios importados exitosamente`, 'success');
                            renderAccountContent('database');
                        }
                    } catch (error) {
                        showToast('Error al importar el archivo: ' + error.message, 'error');
                    }
                };
                reader.readAsText(file);
                e.target.value = ''; // Reset input
            });
        }
        
        // Limpiar base de datos
        const clearDbBtn = document.getElementById('clear-db-btn');
        if (clearDbBtn) {
            clearDbBtn.addEventListener('click', () => {
                if (confirm('⚠️ ¿Estás seguro de que quieres eliminar TODOS los usuarios? Esta acción no se puede deshacer.')) {
                    if (confirm('⚠️ ÚLTIMA CONFIRMACIÓN: ¿Eliminar TODA la base de datos de usuarios?')) {
                        localStorage.removeItem('registeredUsers');
                        showToast('Base de datos limpiada exitosamente', 'success');
                        renderAccountContent('database');
                    }
                }
            });
        }
        
        // Buscar usuarios
        const searchInput = document.getElementById('db-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const userItems = document.querySelectorAll('.user-item');
                userItems.forEach(item => {
                    const username = item.dataset.username || '';
                    if (username.includes(query)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }
        
        // Eliminar usuario individual
        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = parseInt(e.target.closest('.delete-user-btn').dataset.id);
                const userName = e.target.closest('.delete-user-btn').dataset.name;
                
                if (confirm(`¿Eliminar al usuario "${userName}"?`)) {
                    const users = getRegisteredUsers();
                    const filteredUsers = users.filter(u => u.id !== userId);
                    localStorage.setItem('registeredUsers', JSON.stringify(filteredUsers));
                    showToast(`Usuario "${userName}" eliminado`, 'success');
                    renderAccountContent('database');
                }
            });
        });
    };

    const populatePhoneSelect = () => {
        const phoneSelect = document.getElementById('comment-phone');
        const filterSelect = document.getElementById('comment-filter-phone');
        
        const populateSelect = (select, includeAllOption = false) => {
            if (!select) return;
            
            if (includeAllOption) {
                select.innerHTML = '<option value="">Todos los teléfonos</option>';
            } else {
                select.innerHTML = '<option value="">Selecciona un teléfono</option>';
            }
            
            if (phoneDatabase && phoneDatabase.length > 0) {
                // Ordenar por nombre
                const sortedPhones = [...phoneDatabase].sort((a, b) => a.name.localeCompare(b.name));
                sortedPhones.forEach((phone) => {
                    const option = document.createElement('option');
                    option.value = phone.id;
                    option.textContent = `${phone.name} - ${phone.brand.charAt(0).toUpperCase() + phone.brand.slice(1)}`;
                    select.appendChild(option);
                });
            } else {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'No hay teléfonos disponibles';
                option.disabled = true;
                select.appendChild(option);
            }
        };
        
        populateSelect(phoneSelect, false);
        populateSelect(filterSelect, true);
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
        
        // Actualizar estadísticas iniciales
        updateCommentsStats();
        
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
        
        // Obtener filtros actuales
        const searchQuery = document.getElementById('comment-search')?.value.toLowerCase() || '';
        const filterPhoneId = document.getElementById('comment-filter-phone')?.value || '';
        const sortBy = document.getElementById('comment-sort')?.value || 'recent';
        
        // Filtrar comentarios
        let filteredComments = [...state.comments];
        
        // Filtrar por búsqueda
        if (searchQuery) {
            filteredComments = filteredComments.filter(comment => {
                const phone = phoneDatabase.find(p => p.id === comment.phoneId);
                const phoneName = phone ? phone.name.toLowerCase() : '';
                return comment.text.toLowerCase().includes(searchQuery) ||
                       comment.author.toLowerCase().includes(searchQuery) ||
                       phoneName.includes(searchQuery);
            });
        }
        
        // Filtrar por teléfono
        if (filterPhoneId) {
            filteredComments = filteredComments.filter(comment => comment.phoneId === parseInt(filterPhoneId));
        }
        
        // Ordenar comentarios
        filteredComments.sort((a, b) => {
            switch (sortBy) {
                case 'recent':
                    return new Date(b.date) - new Date(a.date);
                case 'oldest':
                    return new Date(a.date) - new Date(b.date);
                case 'rating-high':
                    return b.rating - a.rating;
                case 'rating-low':
                    return a.rating - b.rating;
                default:
                    return 0;
            }
        });
        
        // Actualizar estadísticas
        updateCommentsStats(filteredComments);
        
        if (filteredComments.length === 0) {
            commentsList.innerHTML = `
                <div class="text-center py-12 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
                    <div class="text-6xl mb-4">🔍</div>
                    <h3 class="text-xl font-bold text-white mb-2">No se encontraron comentarios</h3>
                    <p class="text-white/80">${state.comments.length === 0 ? 'Sé el primero en compartir tu opinión sobre estos teléfonos.' : 'Intenta ajustar los filtros de búsqueda.'}</p>
                </div>
            `;
            return;
        }
        
        // Agrupar comentarios por teléfono
        const commentsByPhone = filteredComments.reduce((acc, comment) => {
            const phone = phoneDatabase.find(p => p.id === comment.phoneId);
            const phoneName = phone ? phone.name : 'Teléfono desconocido';
            const phoneId = phone ? phone.id : 0;
            
            if (!acc[phoneName]) {
                acc[phoneName] = {
                    phoneId: phoneId,
                    comments: [],
                    averageRating: 0
                };
            }
            acc[phoneName].comments.push(comment);
            return acc;
        }, {});
        
        // Calcular promedio de rating por teléfono
        Object.keys(commentsByPhone).forEach(phoneName => {
            const group = commentsByPhone[phoneName];
            const totalRating = group.comments.reduce((sum, c) => sum + c.rating, 0);
            group.averageRating = (totalRating / group.comments.length).toFixed(1);
        });
        
        commentsList.innerHTML = Object.entries(commentsByPhone).map(([phoneName, group]) => {
            const phone = phoneDatabase.find(p => p.id === group.phoneId);
            return `
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                    <div class="flex items-center gap-3">
                        <h3 class="text-lg md:text-xl font-bold text-white">${phoneName}</h3>
                        <div class="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                            <span class="text-yellow-400">⭐</span>
                            <span class="text-sm font-semibold text-white">${group.averageRating}</span>
                            <span class="text-xs text-white/80">(${group.comments.length})</span>
                        </div>
                    </div>
                    ${phone ? `
                        <a href="#phone-${phone.id}" class="text-xs md:text-sm text-white hover:text-indigo-300 transition-colors flex items-center gap-1 font-semibold">
                            Ver detalles →
                        </a>
                    ` : ''}
                </div>
                <div class="space-y-3 md:space-y-4">
                    ${group.comments.map(comment => {
                        const canDelete = state.currentUser && comment.author === state.currentUser.name;
                        const ratingPercentage = (comment.rating / 5) * 100;
                        return `
                        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                            <div class="flex justify-between items-start mb-3 gap-3">
                                <div class="flex-1">
                                    <div class="flex items-center gap-2 mb-2">
                                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                            ${comment.author.charAt(0).toUpperCase()}
                                        </div>
                                <div>
                                    <h4 class="font-semibold text-white">${escapeHtml(comment.author)}</h4>
                                            <span class="text-xs text-white/70">${comment.date}</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <div class="flex items-center gap-1">
                                        ${renderStars(comment.rating)}
                                        </div>
                                        <div class="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                                            <div class="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500" style="width: ${ratingPercentage}%"></div>
                                        </div>
                                        <span class="text-xs font-semibold text-white/80">${comment.rating}/5</span>
                                    </div>
                                </div>
                                ${canDelete ? `
                                    <button class="delete-comment-btn text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-lg transition-all duration-200 flex-shrink-0" data-id="${comment.id}" title="Eliminar mi comentario">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                    </button>
                                ` : ''}
                            </div>
                            <p class="text-white/90 leading-relaxed whitespace-pre-wrap">${escapeHtml(comment.text)}</p>
                        </div>
                    `;
                    }).join('')}
                </div>
            </div>
            `;
        }).join('');
    };
    
    const updateCommentsStats = (comments = state.comments) => {
        const totalCount = document.getElementById('total-comments-count');
        const averageRating = document.getElementById('average-rating');
        
        if (totalCount) {
            totalCount.textContent = comments.length;
        }
        
        if (averageRating && comments.length > 0) {
            const total = comments.reduce((sum, c) => sum + c.rating, 0);
            const avg = (total / comments.length).toFixed(1);
            averageRating.textContent = avg;
        } else if (averageRating) {
            averageRating.textContent = '0.0';
        }
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
        
        // Event listeners para filtros y búsqueda
        const commentSearch = document.getElementById('comment-search');
        const commentFilterPhone = document.getElementById('comment-filter-phone');
        const commentSort = document.getElementById('comment-sort');
        
        if (commentSearch) {
            commentSearch.addEventListener('input', debounce(() => {
                renderCommentsList();
            }, 300));
        }
        
        if (commentFilterPhone) {
            commentFilterPhone.addEventListener('change', () => {
                renderCommentsList();
            });
        }
        
        if (commentSort) {
            commentSort.addEventListener('change', () => {
                renderCommentsList();
            });
        }
        
        // Event listener para contador de caracteres
        const commentText = document.getElementById('comment-text');
        const commentLength = document.getElementById('comment-length');
        if (commentText && commentLength) {
            commentText.addEventListener('input', (e) => {
                const length = e.target.value.length;
                commentLength.textContent = `${length} caracteres`;
                if (length < 10) {
                    commentLength.classList.add('text-red-500');
                    commentLength.classList.remove('text-slate-500');
                } else {
                    commentLength.classList.remove('text-red-500');
                    commentLength.classList.add('text-white/70');
                }
            });
        }
        
        // Event listener para texto de rating
        const ratingText = document.getElementById('rating-text');
        const ratingInputs = document.querySelectorAll('input[name="rating"]');
        ratingInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                if (ratingText) {
                    const rating = parseInt(e.target.value);
                    const ratingLabels = {
                        1: 'Muy malo',
                        2: 'Malo',
                        3: 'Regular',
                        4: 'Bueno',
                        5: 'Excelente'
                    };
                    ratingText.textContent = ratingLabels[rating] || '';
                    ratingText.className = 'ml-2 text-sm font-medium flex items-center text-white/80';
                }
            });
        });
        
        // Prellenar nombre si está autenticado
        const commentAuthor = document.getElementById('comment-author');
        if (commentAuthor && state.currentUser) {
            commentAuthor.value = state.currentUser.name;
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
                star.classList.add('text-yellow-400', 'selected');
                star.style.transform = 'scale(1.1)';
                star.style.transition = 'all 0.2s ease-in-out';
            } else {
                star.classList.remove('text-yellow-400', 'selected');
                star.style.transform = 'scale(1)';
                star.style.transition = 'all 0.2s ease-in-out';
            }
        });
        
        // Seleccionar el radio button correspondiente
        const radioButton = document.getElementById(`rating-${rating}`);
        if (radioButton) {
            radioButton.checked = true;
            // Disparar evento change para actualizar el texto
            radioButton.dispatchEvent(new Event('change'));
        }
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
            showToast('Por favor completa todos los campos', 'error');
            return;
        }
        
        // Validar longitud mínima del comentario
        if (text.length < 10) {
            showToast('El comentario debe tener al menos 10 caracteres', 'error');
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
        
        // Limpiar contador y texto de rating
        const commentLength = document.getElementById('comment-length');
        if (commentLength) {
            commentLength.textContent = '0 caracteres';
            commentLength.classList.remove('text-red-500');
            commentLength.classList.add('text-white/70');
        }
        
        const ratingText = document.getElementById('rating-text');
        if (ratingText) {
            ratingText.textContent = '';
        }
        
        // Scroll suave a la lista de comentarios
        setTimeout(() => {
            const commentsList = document.getElementById('comments-list');
            if (commentsList) {
                commentsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
        
        secureLogger.info('Comentario publicado por usuario autenticado');
        showToast('¡Comentario publicado exitosamente!', 'success');
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
        if (e.target.matches('.easy-option') || e.target.closest('.easy-option')) {
            const option = e.target.matches('.easy-option') ? e.target : e.target.closest('.easy-option');
            const questionId = option.closest('.easy-options').dataset.questionId;
            const value = option.dataset.value;
            
            // Remover selección anterior en esta pregunta
            option.closest('.easy-options').querySelectorAll('.easy-option').forEach(btn => {
                btn.classList.remove('border-indigo-500', 'bg-indigo-500/30', 'ring-4', 'ring-indigo-500/50', 'scale-110');
                btn.classList.add('border-white/20', 'bg-white/10');
            });
            
            // Marcar selección actual con animación
            option.classList.remove('border-white/20', 'bg-white/10');
            option.classList.add('border-indigo-500', 'bg-indigo-500/30', 'ring-4', 'ring-indigo-500/50', 'scale-110');
            
            // Efecto de pulso
            option.style.animation = 'pulse 0.5s ease-out';
            
            // Guardar respuesta
            state.easyModeAnswers[questionId] = value;
            
            // Feedback háptico
            if ('vibrate' in navigator) {
                try {
                    navigator.vibrate(50);
                } catch (e) {}
            }
            
            // Obtener información de preguntas antes de avanzar
            const questions = document.querySelectorAll('.question-card');
            const totalQuestions = questions.length;
            const isLastQuestion = state.currentQuestionIndex === (totalQuestions - 1);
            
            // Esperar un momento para mostrar el efecto visual y luego avanzar automáticamente
            setTimeout(() => {
                option.style.animation = '';
                
                // Verificar si es la última pregunta antes de avanzar
                if (isLastQuestion) {
                    // Es la última pregunta, mostrar resultados automáticamente con animación
                    setTimeout(() => {
                        // Animación de desvanecimiento antes de mostrar resultados
                        const currentCard = document.querySelector('.question-card.active');
                        if (currentCard) {
                            currentCard.style.opacity = '0';
                            currentCard.style.transform = 'translateX(-50px)';
                        }
                    setTimeout(() => {
                        handleGetRecommendations();
                    }, 300);
                    }, 400);
                } else {
                    // No es la última pregunta, avanzar automáticamente
                    setTimeout(() => {
                        handleNextQuestion();
                    }, 400);
                }
                    }, 300);
        }
    };

    const handleNextQuestion = () => {
        const questions = document.querySelectorAll('.question-card');
        if (state.currentQuestionIndex < questions.length - 1) {
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
        const prevBtn = document.getElementById('prev-question-btn');
        
        // Ocultar todas las preguntas con animación
        questions.forEach((q, index) => {
            if (index === state.currentQuestionIndex) {
                q.classList.remove('hidden');
                // Animación de entrada mejorada
                setTimeout(() => {
                    q.style.opacity = '0';
                    q.style.transform = 'translateX(50px) scale(0.95)';
                    q.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    setTimeout(() => {
                        q.classList.add('active');
                        q.style.opacity = '1';
                        q.style.transform = 'translateX(0) scale(1)';
                    }, 10);
                }, 10);
        } else {
                q.classList.add('hidden');
                q.classList.remove('active');
                q.style.opacity = '0';
                q.style.transform = 'translateX(-50px) scale(0.95)';
            }
        });
        
        // Actualizar contador con animación
        if (currentQuestion) {
            currentQuestion.style.transform = 'scale(1.3)';
            currentQuestion.style.transition = 'transform 0.3s ease-out';
            setTimeout(() => {
            currentQuestion.textContent = state.currentQuestionIndex + 1;
                currentQuestion.style.transform = 'scale(1)';
            }, 150);
        }
        
        // Actualizar barra de progreso con animación suave
        if (progressBar) {
            const progress = ((state.currentQuestionIndex + 1) / questions.length) * 100;
            progressBar.style.width = `${progress}%`;
            // Efecto de brillo
            progressBar.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.5)';
            setTimeout(() => {
                progressBar.style.boxShadow = 'none';
            }, 500);
        }
        
        // Actualizar botón anterior
        if (prevBtn) {
            prevBtn.disabled = state.currentQuestionIndex === 0;
        }
        
        // Scroll suave a la pregunta actual
        setTimeout(() => {
            const activeCard = document.querySelector('.question-card.active');
            if (activeCard) {
                activeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
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
            // Scroll a los resultados
            setTimeout(() => {
                resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
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
            
            // Scroll a los resultados
            setTimeout(() => {
                resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };
    
    // Hacer funciones disponibles globalmente después de que estén definidas
    window.renderEasyModeView = renderEasyModeView;
    window.handleGetRecommendations = handleGetRecommendations;

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
            showToast('Por favor ingresa un email válido', 'error');
            secureLogger.warn('Intento de registro con email inválido');
            return;
        }
        
        // Sanitizar entradas
        const name = escapeHtml(sanitizeInput(rawName));
        const email = sanitizeInput(rawEmail);
        const password = e.target.elements[2].value.trim(); 
        
        // Validar que el nombre no esté vacío
        if (!name || name.trim().length === 0) {
            showToast('El nombre de usuario es requerido', 'error');
            return;
        }
        
        // Validar que el nombre de usuario no esté repetido
        if (isUsernameTaken(name)) {
            showToast('Este nombre de usuario ya está en uso. Por favor elige otro.', 'error');
            secureLogger.warn(`Intento de registro con nombre duplicado: ${name}`);
            return;
        }
        
        // El correo y contraseña pueden repetirse, solo validamos el nombre
        
        let isPitoPerez = false;
        if (name.toLowerCase() === 'pito pérez' && password.toLowerCase() === 'peraza') {
            isPitoPerez = true;
        }

        // Crear objeto de usuario
        const newUser = {
            id: Date.now(),
            name,
            email,
            password: password, // Guardar contraseña (en producción debería estar hasheada)
            isPitoPerez,
            registeredAt: new Date().toISOString()
        };

        // Guardar usuario en localStorage
        if (saveRegisteredUser(newUser)) {
            state.currentUser = { id: newUser.id, name, email, isPitoPerez };
        modalBackdrop.classList.add('hidden');
            showToast('¡Cuenta creada exitosamente!', 'success');
        updateAll();
            return true;
        } else {
            showToast('Error al crear la cuenta. Por favor intenta de nuevo.', 'error');
            return false;
        }
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

    // Función para inicializar la aplicación con verificación de dependencias
    const initializeApp = () => {
        // Verificar que las funciones necesarias estén disponibles
        if (typeof fetchAndInitializeApp !== 'function') {
            console.error('❌ fetchAndInitializeApp no está disponible');
            if (loadingIndicator) {
                loadingIndicator.innerHTML = `
                    <div class="text-7xl mb-4">⚠️</div>
                    <p class="mt-4 text-xl font-semibold text-red-600">Error al cargar la aplicación</p>
                    <p class="mt-2 text-lg text-slate-600">Por favor, recarga la página.</p>
                `;
            }
            return;
        }

        const apiUrl = typeof FAKE_STORE_API_URL !== 'undefined' ? FAKE_STORE_API_URL : 'https://fakestoreapi.com/products?limit=20';
        const mapFunction = typeof mapToPhoneSpecs !== 'undefined' ? mapToPhoneSpecs : null;

        if (!mapFunction) {
            console.error('❌ mapToPhoneSpecs no está disponible');
            if (loadingIndicator) {
                loadingIndicator.innerHTML = `
                    <div class="text-7xl mb-4">⚠️</div>
                    <p class="mt-4 text-xl font-semibold text-red-600">Error al cargar la aplicación</p>
                    <p class="mt-2 text-lg text-slate-600">Por favor, recarga la página.</p>
                `;
            }
            return;
        }

        fetchAndInitializeApp(loadingIndicator, renderAuthSection, renderCharts, renderSearchView, renderEasyModeView, renderAccountView, updateView, apiUrl, mapFunction)
        .then(newPhoneDatabase => {
            // Asegurar que siempre tenemos datos válidos
            if (!newPhoneDatabase || !Array.isArray(newPhoneDatabase) || newPhoneDatabase.length === 0) {
                console.error('❌ No se pudieron cargar datos de teléfonos');
                showToast('Error al cargar el catálogo. Por favor, recarga la página.', 'error');
                // Ocultar loading indicator por si acaso
                if (loadingIndicator) {
                    loadingIndicator.classList.add('hidden');
                }
                return;
            }
            
        phoneDatabase = newPhoneDatabase;
            
            // Asignar variables globales para autenticación
            globalState = state;
            globalRenderAuthSection = renderAuthSection;
            globalShowToast = showToast;
            
            // Hacer renderAccountView disponible globalmente
            window.renderAccountView = renderAccountView;
            
            // Detectar si se está usando base de datos de respaldo
            const isUsingFallback = newPhoneDatabase.some && newPhoneDatabase.some(phone => phone.source === 'fallback-database');
            if (isUsingFallback) {
                showOfflineIndicator();
            }
            
        renderAuthSection();
        renderCharts();
        renderSearchView();
        renderEasyModeView();
        renderAccountView();
        // renderCommentsView se llamará cuando se acceda a la vista de comentarios
        updateView('dashboard');
        
        // Inicializar tema después de que todo esté cargado
        initializeTheme();
            
            // Configurar listeners de conexión
            window.addEventListener('online', () => {
                showToast('Conexión restaurada', 'success');
                const offlineIndicator = document.getElementById('offline-indicator');
                if (offlineIndicator) {
                    offlineIndicator.remove();
                }
            });
            
            window.addEventListener('offline', () => {
                checkConnectionStatus();
            });
            
            // Verificar estado inicial
            checkConnectionStatus();
            
            // Asegurar que el loading indicator esté oculto
            if (loadingIndicator) {
                loadingIndicator.classList.add('hidden');
            }
        })
        .catch(error => {
            console.error('❌ Error en la inicialización:', error);
            // Ocultar loading indicator en caso de error
            if (loadingIndicator) {
                loadingIndicator.classList.add('hidden');
            }
            // Mostrar mensaje de error al usuario
            showToast('Error al cargar la aplicación. Por favor, recarga la página.', 'error');
            // Intentar cargar datos de respaldo directamente
            try {
                if (window.getFallbackPhoneData && typeof window.getFallbackPhoneData === 'function') {
                    const fallbackData = window.getFallbackPhoneData();
                    if (fallbackData && Array.isArray(fallbackData) && fallbackData.length > 0) {
                        phoneDatabase = fallbackData;
                        updateView('dashboard');
                    }
                }
            } catch (e) {
                console.error('Error al cargar datos de respaldo:', e);
            }
        });
    };

    // Intentar inicializar inmediatamente, o esperar un poco si las funciones no están disponibles
    if (typeof fetchAndInitializeApp === 'function' && typeof mapToPhoneSpecs === 'function') {
        initializeApp();
    } else {
        // Esperar un poco para que los módulos se carguen
        let attempts = 0;
        const maxAttempts = 10;
        const checkInterval = setInterval(() => {
            attempts++;
            if ((typeof fetchAndInitializeApp === 'function' && typeof mapToPhoneSpecs === 'function') || attempts >= maxAttempts) {
                clearInterval(checkInterval);
                if (typeof fetchAndInitializeApp === 'function' && typeof mapToPhoneSpecs === 'function') {
                    initializeApp();
                } else {
                    console.error('❌ No se pudieron cargar las funciones necesarias después de varios intentos');
                    if (loadingIndicator) {
                        loadingIndicator.innerHTML = `
                            <div class="text-7xl mb-4">⚠️</div>
                            <p class="mt-4 text-xl font-semibold text-red-600">Error al cargar la aplicación</p>
                            <p class="mt-2 text-lg text-slate-600">Por favor, recarga la página.</p>
                        `;
                    }
                }
            }
        }, 100);
    }
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
    // Variable para rastrear si el usuario ya ha interactuado
    let userHasInteracted = false;
    
    // Marcar que el usuario ha interactuado en cualquier evento de interacción
    const markInteraction = () => {
        userHasInteracted = true;
    };
    
    ['touchstart', 'click', 'mousedown'].forEach(eventType => {
        document.addEventListener(eventType, markInteraction, { once: true, passive: true });
    });
    
    // Agregar feedback háptico si está disponible y el usuario ya interactuó
    if ('vibrate' in navigator) {
        document.addEventListener('touchstart', (e) => {
            if (userHasInteracted && e.target.matches('button, .product-card, .mobile-nav-item')) {
                try {
                    navigator.vibrate(10);
                } catch (error) {
                    // Silenciar errores de vibración
                }
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

// Inicializar botón de ayuda
function initializeHelpButton() {
    const helpBtn = document.getElementById('help-btn');
    const helpModal = document.getElementById('help-modal');
    const closeHelpModal = document.getElementById('close-help-modal');
    
    if (helpBtn && helpModal) {
        // Abrir modal al hacer clic en el botón de ayuda
        helpBtn.addEventListener('click', () => {
            helpModal.classList.remove('hidden');
            // Forzar reflow para que la animación funcione
            helpModal.offsetHeight;
            // Animación de entrada
            setTimeout(() => {
                const modalContent = helpModal.querySelector('.bg-white');
                if (modalContent) {
                    modalContent.style.transform = 'scale(1)';
                    modalContent.style.opacity = '1';
                }
            }, 10);
        });
        
        // Cerrar modal al hacer clic en el botón de cerrar
        if (closeHelpModal) {
            closeHelpModal.addEventListener('click', () => {
                const modalContent = helpModal.querySelector('.bg-white');
                if (modalContent) {
                    modalContent.style.transform = 'scale(0.95)';
                    modalContent.style.opacity = '0';
                }
                setTimeout(() => {
                    helpModal.classList.add('hidden');
                }, 300);
            });
        }
        
        // Cerrar modal al hacer clic fuera del contenido
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                const modalContent = helpModal.querySelector('.bg-white');
                if (modalContent) {
                    modalContent.style.transform = 'scale(0.95)';
                    modalContent.style.opacity = '0';
                }
                setTimeout(() => {
                    helpModal.classList.add('hidden');
                }, 300);
            }
        });
        
        // Cerrar modal con la tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !helpModal.classList.contains('hidden')) {
                const modalContent = helpModal.querySelector('.bg-white');
                if (modalContent) {
                    modalContent.style.transform = 'scale(0.95)';
                    modalContent.style.opacity = '0';
                }
                setTimeout(() => {
                    helpModal.classList.add('hidden');
                }, 300);
            }
        });
    }
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
    
    // Feedback háptico (solo si el usuario ya interactuó)
    if ('vibrate' in navigator) {
        try {
            const vibrationPattern = {
                success: [100],
                error: [200, 100, 200],
                warning: [150],
                info: [50]
            };
            navigator.vibrate(vibrationPattern[type] || [50]);
        } catch (error) {
            // Silenciar errores de vibración (puede fallar si el usuario no ha interactuado)
        }
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

// Variables globales para autenticación
let globalState = null;
let globalRenderAuthSection = null;
let globalShowToast = null;

// Funciones para gestionar usuarios en localStorage
function getRegisteredUsers() {
    try {
        const usersJson = localStorage.getItem('registeredUsers');
        return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
        console.error('Error al obtener usuarios registrados:', error);
        return [];
    }
}

function saveRegisteredUser(user) {
    try {
        const users = getRegisteredUsers();
        users.push(user);
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        return true;
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        return false;
    }
}

function isUsernameTaken(username) {
    const users = getRegisteredUsers();
    // Comparar nombres sin importar mayúsculas/minúsculas
    return users.some(user => user.name.toLowerCase().trim() === username.toLowerCase().trim());
}

function findUserByUsername(username) {
    const users = getRegisteredUsers();
    return users.find(user => user.name.toLowerCase().trim() === username.toLowerCase().trim());
}

// Modal de autenticación
function showAuthModal(type = 'login') {
        const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    
    const registerFormHTML = type === 'register' ? `
        <!-- Términos y Condiciones en modal de autenticación -->
        <div class="mt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div class="flex items-start">
                <input type="checkbox" id="auth-terms-accepted" required 
                       class="mt-1 mr-2 h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500">
                <label for="auth-terms-accepted" class="text-sm text-slate-700 dark:text-slate-300">
                    He leído y acepto los 
                    <button type="button" onclick="showTermsModal()" 
                            class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline">
                        Términos y Condiciones
                    </button>
                </label>
            </div>
        </div>
    ` : '';
    
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
                    <div id="username-feedback" class="mt-1 text-xs hidden"></div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                    <input type="email" id="auth-email" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100" required>
                    <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">El correo puede repetirse</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Contraseña</label>
                    <input type="password" id="auth-password" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100" required>
                    <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Mínimo 8 caracteres</p>
                </div>
                ${type === 'register' ? `
                <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirmar Contraseña</label>
                    <input type="password" id="auth-password-confirm" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100" required>
                </div>
                ` : ''}
                
                ${registerFormHTML}
                
                <button type="submit" class="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                    ${type === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
                </button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Validación en tiempo real del nombre de usuario (solo para registro)
    if (type === 'register') {
        const nameInput = document.getElementById('auth-name');
        const feedbackDiv = document.getElementById('username-feedback');
        
        // Debounce para evitar demasiadas verificaciones
        let checkTimeout;
        nameInput.addEventListener('input', (e) => {
            clearTimeout(checkTimeout);
            const username = e.target.value.trim();
            
            if (username.length === 0) {
                feedbackDiv.classList.add('hidden');
                nameInput.classList.remove('border-red-500', 'border-green-500');
                return;
            }
            
            checkTimeout = setTimeout(() => {
                if (window.isUsernameTaken && window.isUsernameTaken(username)) {
                    feedbackDiv.textContent = '❌ Este nombre de usuario ya está en uso';
                    feedbackDiv.className = 'mt-1 text-xs text-red-600 dark:text-red-400';
                    feedbackDiv.classList.remove('hidden');
                    nameInput.classList.add('border-red-500');
                    nameInput.classList.remove('border-green-500');
                } else {
                    feedbackDiv.textContent = '✅ Nombre de usuario disponible';
                    feedbackDiv.className = 'mt-1 text-xs text-green-600 dark:text-green-400';
                    feedbackDiv.classList.remove('hidden');
                    nameInput.classList.add('border-green-500');
                    nameInput.classList.remove('border-red-500');
                }
            }, 300);
        });
    }
    
    // Event listener para el formulario
// En el event listener del formulario en showAuthModal:
document.getElementById('auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('auth-name').value;
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const passwordConfirm = type === 'register' ? document.getElementById('auth-password-confirm')?.value : '';
    const termsAccepted = type === 'register' ? document.getElementById('auth-terms-accepted')?.checked : true;
    
    if (type === 'login') {
        handleLogin(name, email, password);
        modal.remove();
    } else {
        // Validaciones adicionales para registro
        if (password !== passwordConfirm) {
            showToast('Las contraseñas no coinciden', 'error');
            return;
        }
        
        if (!termsAccepted) {
            showToast('Debes aceptar los términos y condiciones', 'error');
            return;
        }
        
        const wasSuccessful = handleRegister(name, email, password);
        if (wasSuccessful) {
            modal.remove();
        }
    }
});
}

// Funciones de autenticación
function handleLogin(name, email, password) {
    if (!globalState) return;
    // Simulación de login
    globalState.currentUser = { id: 1, name, email };
    if (globalRenderAuthSection) globalRenderAuthSection();
    if (globalShowToast) globalShowToast('¡Bienvenido!', 'success');
    
    // Actualizar vista de cuenta si está activa
    if (globalState.currentView === 'account') {
        // Buscar la función renderAccountView en el scope global
        if (window.renderAccountView) {
            window.renderAccountView();
        }
    }
}

function handleRegister(e) {
    e.preventDefault();
    const rawName = e.target.elements[0].value.trim();
    const rawEmail = e.target.elements[1].value;
    
    // Validar email
    if (!validateEmail(rawEmail)) {
        showToast('Por favor ingresa un email válido', 'error');
        secureLogger.warn('Intento de registro con email inválido');
        return;
    }
    
    // Sanitizar entradas
    const name = escapeHtml(sanitizeInput(rawName));
    const email = sanitizeInput(rawEmail);
    const password = e.target.elements[2].value.trim(); 
    const passwordConfirm = e.target.elements[3].value.trim();
    const termsAccepted = document.getElementById('terms-accepted')?.checked || false;
    
    // Validar que el nombre no esté vacío
    if (!name || name.trim().length === 0) {
        showToast('El nombre de usuario es requerido', 'error');
        return;
    }
    
    // Validar contraseñas
    if (password !== passwordConfirm) {
        showToast('Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (password.length < 8) {
        showToast('La contraseña debe tener al menos 8 caracteres', 'error');
        return;
    }
    
    // Validar términos y condiciones
    if (!termsAccepted) {
        showToast('Debes aceptar los términos y condiciones para registrarte', 'error');
        return;
    }
    
    // Validar que el nombre de usuario no esté repetido
    if (isUsernameTaken(name)) {
        showToast('Este nombre de usuario ya está en uso. Por favor elige otro.', 'error');
        secureLogger.warn(`Intento de registro con nombre duplicado: ${name}`);
        return;
    }
    
    // El correo y contraseña pueden repetirse, solo validamos el nombre
    
    let isPitoPerez = false;
    if (name.toLowerCase() === 'pito pérez' && password.toLowerCase() === 'peraza') {
        isPitoPerez = true;
    }

    // Crear objeto de usuario
    const newUser = {
        id: Date.now(),
        name,
        email,
        password: password, // Guardar contraseña (en producción debería estar hasheada)
        isPitoPerez,
        termsAccepted: true, // Añadir campo de términos aceptados
        registeredAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };

    // Guardar usuario en localStorage
    if (saveRegisteredUser(newUser)) {
        state.currentUser = { 
            id: newUser.id, 
            name, 
            email, 
            isPitoPerez,
            termsAccepted: true 
        };
        
        // Actualizar autenticación
        if (globalRenderAuthSection) globalRenderAuthSection();
        
        showToast('¡Cuenta creada exitosamente!', 'success');
        
        // Actualizar vista de cuenta
        if (state.currentView === 'account') {
            renderAccountView();
        }
        
        return true;
    } else {
        showToast('Error al crear la cuenta. Por favor intenta de nuevo.', 'error');
        return false;
    }
}
function handleLogout() {
    if (!globalState) return;
    globalState.currentUser = null;
    if (globalRenderAuthSection) globalRenderAuthSection();
    if (globalShowToast) globalShowToast('Sesión cerrada', 'info');
    
    // Actualizar vista de cuenta si está activa
    if (globalState.currentView === 'account') {
        // Buscar la función renderAccountView en el scope global
        if (window.renderAccountView) {
            window.renderAccountView();
        }
    }
}

// Función para mostrar indicador offline
function showOfflineIndicator() {
    // Crear indicador offline
    const offlineIndicator = document.createElement('div');
    offlineIndicator.id = 'offline-indicator';
    offlineIndicator.className = 'fixed top-20 right-4 z-50 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse';
    offlineIndicator.innerHTML = `
        <span class="text-lg">📱</span>
        <div>
            <div class="font-semibold text-sm">Modo Offline</div>
            <div class="text-xs opacity-90">Usando datos locales</div>
        </div>
        <button onclick="this.parentElement.remove()" class="ml-2 text-white hover:text-orange-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
    `;
    
    document.body.appendChild(offlineIndicator);
    
    // Auto-ocultar después de 10 segundos
    setTimeout(() => {
        if (offlineIndicator.parentElement) {
            offlineIndicator.remove();
        }
    }, 10000);
}

// Función para verificar estado de conexión
function checkConnectionStatus() {
    if (!navigator.onLine) {
        showOfflineIndicator();
        showToast('Sin conexión a internet. Usando datos locales.', 'warning', 5000);
    }
}
function showTermsModal() {
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalContent = document.getElementById('modal-content');
    
    if (modalBackdrop && modalContent) {
        modalContent.innerHTML = `
            <div class="p-6 max-h-[80vh] overflow-y-auto">
                <div class="text-center mb-6">
                    <h2 class="text-2xl font-bold text-slate-800 mb-2">📜 Términos y Condiciones del Servicio</h2>
                    <p class="text-slate-600">Última actualización: ${new Date().toLocaleDateString('es-MX')}</p>
                </div>
                
                <div class="space-y-4 text-slate-700">
                    <section>
                        <h3 class="text-lg font-semibold mb-2 text-indigo-700">1. Aceptación de los Términos</h3>
                        <p>Al acceder y utilizar la Guía Interactiva de Smartphones "Pito Pérez", usted acepta estar sujeto a estos Términos y Condiciones.</p>
                    </section>
                    
                    <section>
                        <h3 class="text-lg font-semibold mb-2 text-indigo-700">2. Uso del Servicio</h3>
                        <p>Este servicio está destinado a proporcionar información sobre smartphones para fines de comparación y decisión de compra. La información se proporciona "tal cual" sin garantías de precisión.</p>
                    </section>
                    
                    <section>
                        <h3 class="text-lg font-semibold mb-2 text-indigo-700">3. Registro de Cuenta</h3>
                        <p>Para acceder a funciones adicionales, debe registrarse proporcionando información verídica y actual. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña.</p>
                    </section>
                    
                    <section>
                        <h3 class="text-lg font-semibold mb-2 text-indigo-700">4. Privacidad</h3>
                        <p>Su información personal será tratada de acuerdo con nuestra Política de Privacidad. No compartimos su información con terceros sin su consentimiento.</p>
                    </section>
                    
                    <section>
                        <h3 class="text-lg font-semibold mb-2 text-indigo-700">5. Contenido Generado por Usuarios</h3>
                        <p>Los comentarios y reseñas publicados por usuarios son responsabilidad exclusiva de quienes los publican. Nos reservamos el derecho de eliminar contenido inapropiado.</p>
                    </section>
                    
                    <section>
                        <h3 class="text-lg font-semibold mb-2 text-indigo-700">6. Limitación de Responsabilidad</h3>
                        <p>No somos responsables de decisiones de compra basadas en la información proporcionada. Los precios y especificaciones pueden variar.</p>
                    </section>
                    
                    <section>
                        <h3 class="text-lg font-semibold mb-2 text-indigo-700">7. Modificaciones</h3>
                        <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones serán efectivas inmediatamente después de su publicación.</p>
                    </section>
                    
                    <section class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 class="text-lg font-semibold mb-2 text-blue-700">✅ Confirmación de Aceptación</h3>
                        <p>Al marcar la casilla de aceptación, confirma que:</p>
                        <ul class="list-disc pl-5 mt-2 space-y-1">
                            <li>Ha leído y comprendido estos términos</li>
                            <li>Acepta cumplir con todas las disposiciones</li>
                            <li>Es mayor de edad o tiene consentimiento parental</li>
                            <li>Proporcionará información verídica en su registro</li>
                        </ul>
                    </section>
                </div>
                
                <div class="mt-8 pt-6 border-t border-slate-200">
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button id="accept-terms-btn" 
                                class="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300">
                            ✅ Aceptar Términos
                        </button>
                        <button id="close-terms-modal" 
                                class="flex-1 bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-lg hover:bg-slate-300 transition-all duration-300">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modalBackdrop.classList.remove('hidden');
        
        // Agregar eventos para los botones del modal
        document.getElementById('accept-terms-btn').addEventListener('click', function() {
            const checkbox = document.getElementById('terms-accepted');
            if (checkbox) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('change'));
            }
            modalBackdrop.classList.add('hidden');
            showToast('Términos aceptados. Ahora puedes continuar con tu registro.', 'success');
        });
        
        document.getElementById('close-terms-modal').addEventListener('click', function() {
            modalBackdrop.classList.add('hidden');
        });
    }
}

// Hacer la función globalmente disponible
window.showTermsModal = showTermsModal;
window.showAuthModal = showAuthModal;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;
window.showOfflineIndicator = showOfflineIndicator;
window.isUsernameTaken = isUsernameTaken;
window.getRegisteredUsers = getRegisteredUsers;
window.saveRegisteredUser = saveRegisteredUser;
