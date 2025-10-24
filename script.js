import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { FAKE_STORE_API_URL, mapToPhoneSpecs, fetchAndInitializeApp } from './api.js';
import { 
    sanitizeInput, 
    escapeHtml, 
    validateEmail, 
    validateNumber,
    initializeSecurity,
    secureLogger,
    searchRateLimiter,
    secureLocalStorage,
    validateSearchInput
} from './security.js';
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

    let phoneDatabase = []; 
    
    let state = {
        currentUser: null,
        currentView: 'dashboard',
        favorites: [],
        searchHistory: [],
        filters: { brand: '', storage: '', ram: '', minCamera: '', minBattery: '', os: '', condition: '', minPrice: '', maxPrice: '' },
        easyAnswers: { usage: null, budget: null, priority: null, system: null, size: null },
        comments: [],
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
        
        return `
                <div class="bg-white rounded-3xl p-6 shadow-lg border border-slate-200 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
                    <div class="relative">
                        <div class="h-40 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-6xl overflow-hidden">
                            <img src="${imageUrl}" alt="Teléfono ${phone.name}" class="object-cover h-full w-full opacity-90 transition-transform duration-300 hover:scale-105" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                            <div class="hidden items-center justify-center h-full w-full text-6xl bg-gradient-to-br from-indigo-100 to-purple-100">📱</div>
                        </div>
                        <button class="favorite-btn absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform" data-id="${phone.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="${isFavorite ? '#ef4444' : 'none'}" stroke="${isFavorite ? '#ef4444' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </button>
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
                        <button class="details-btn w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors" data-id="${phone.id}">
                            Ver Detalles
                        </button>
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
        if (state.currentUser) {
            authSection.innerHTML = `
                        <div class="flex items-center gap-3">
                            <span class="font-semibold text-slate-700 hidden sm:inline">Hola, ${state.currentUser.name}</span>
                            <button id="logout-btn" class="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors text-sm">Salir</button>
                        </div>
                    `;
            document.getElementById('logout-btn').addEventListener('click', handleLogout);
        } else {
            authSection.innerHTML = `
                        <button id="login-prompt-btn" class="bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                            Iniciar Sesión
                        </button>
                    `;
            document.getElementById('login-prompt-btn').addEventListener('click', () => showAuthModal());
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
        };
        
        const selectHTML = (id, label, options) => `
            <div class="flex-1 min-w-[150px]">
                <label for="${id}" class="block text-sm font-medium text-slate-700">${label}</label>
                <select id="${id}" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option value="">Todos</option>
                    ${options.map(o => `<option value="${o}">${o.charAt(0).toUpperCase() + o.slice(1)}</option>`).join('')}
                </select>
            </div>`;

        searchViewContainer.innerHTML = `
                <div class="bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
                     <h2 class="text-3xl font-bold text-slate-800 mb-2 text-center">Búsqueda Avanzada</h2>
                     <p class="text-slate-500 text-center mb-6">Usa los filtros para encontrar exactamente lo que necesitas. Puedes dejar los campos vacíos.</p>
                     
                     <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        ${selectHTML('filter-brand', 'Marca', filterOptions.brand)}
                        ${selectHTML('filter-os', 'Sistema Operativo', filterOptions.os)}
                        ${selectHTML('filter-condition', 'Condición', filterOptions.condition)}
                        <div class="flex-1 min-w-[150px]">
                            <label class="block text-sm font-medium text-slate-700">Batería Mínima (mAh)</label>
                            <input type="number" id="filter-minBattery" placeholder="Ej: 4500" class="block w-full text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md p-2 mt-1">
                        </div>
                     </div>
                     
                     <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        ${selectHTML('filter-storage', 'Almacenamiento', filterOptions.storage)}
                        ${selectHTML('filter-ram', 'RAM', filterOptions.ram)}
                        <div class="flex-1 min-w-[150px]">
                            <label class="block text-sm font-medium text-slate-700">Cámara Mínima (MP)</label>
                            <input type="number" id="filter-minCamera" placeholder="Ej: 48" class="block w-full text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md p-2 mt-1">
                        </div>
                         <div class="flex-1 min-w-[150px]">
                             <label class="block text-sm font-medium text-slate-700">Precio (MXN)</label>
                             <div class="flex gap-2 mt-1">
                                 <input type="number" id="filter-minPrice" placeholder="Mínimo" class="block w-full text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md p-2">
                                 <input type="number" id="filter-maxPrice" placeholder="Máximo" class="block w-full text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md p-2">
                             </div>
                        </div>
                    </div>
                    <div class="flex justify-center">
                        <button id="search-btn" class="bg-indigo-600 text-white font-semibold py-3 px-10 rounded-xl hover:bg-indigo-700 transition-colors">Aplicar Filtros</button>
                    </div>
                </div>
                <div id="search-results-container" class="mt-8"></div>
                `;
        document.getElementById('search-btn').addEventListener('click', handleSearch);
        handleSearch(); 
    };
    
    const renderEasyModeView = () => {
        const questions = [
            { id: 'usage', icon: '📱', title: '¿Para qué usarás tu teléfono?', options: [
                { value: 'basic', emoji: '💬', label: 'Básico (Llamadas, mensajes)' }, 
                { value: 'social', emoji: '📸', label: 'Redes Sociales' }, 
                { value: 'gaming', emoji: '🎮', label: 'Juegos' }, 
                { value: 'professional', emoji: '💼', label: 'Trabajo' },
                { value: 'creative', emoji: '🎨', label: 'Creativo (Fotos, videos)' },
                { value: 'student', emoji: '📚', label: 'Estudios' },
                { value: 'travel', emoji: '✈️', label: 'Viajes' },
                { value: 'mixed', emoji: '🔄', label: 'Uso mixto' }
            ]},
            { id: 'budget', icon: '💰', title: '¿Cuál es tu presupuesto?', options: [
                { value: 'very-low', emoji: '💵', label: '< $5,500' }, 
                { value: 'low', emoji: '💴', label: '$5,500 - $9,250' }, 
                { value: 'medium', emoji: '💶', label: '$9,250 - $14,800' }, 
                { value: 'high', emoji: '💷', label: '$14,800 - $22,200' }, 
                { value: 'premium', emoji: '💎', label: '> $22,200' },
                { value: 'flexible', emoji: '🤝', label: 'Flexible' }
            ]},
            { id: 'priority', icon: '⭐', title: '¿Qué es más importante para ti?', options: [
                { value: 'battery', emoji: '🔋', label: 'Batería duradera' }, 
                { value: 'camera', emoji: '📷', label: 'Cámara excelente' }, 
                { value: 'storage', emoji: '💾', label: 'Mucho espacio' }, 
                { value: 'brand', emoji: '🏆', label: 'Marca reconocida' },
                { value: 'performance', emoji: '⚡', label: 'Rendimiento' },
                { value: 'design', emoji: '✨', label: 'Diseño atractivo' },
                { value: 'durability', emoji: '🛡️', label: 'Resistencia' },
                { value: 'value', emoji: '💯', label: 'Mejor relación calidad-precio' }
            ]},
            { id: 'system', icon: '🏷️', title: '¿Tienes preferencia de sistema operativo?', options: [
                { value: 'ios', emoji: '🍎', label: 'iOS (iPhone)' }, 
                { value: 'android', emoji: '🤖', label: 'Android' }, 
                { value: 'any', emoji: '🤷', label: 'No me importa' },
                { value: 'prefer-ios', emoji: '🍎', label: 'Prefiero iOS' },
                { value: 'prefer-android', emoji: '🤖', label: 'Prefiero Android' }
            ]},
            { id: 'size', icon: '📏', title: '¿Qué tamaño de pantalla prefieres?', options: [
                { value: 'small', emoji: '📱', label: 'Pequeña (fácil de manejar)' }, 
                { value: 'medium', emoji: '📱', label: 'Mediana (equilibrada)' }, 
                { value: 'large', emoji: '📱', label: 'Grande (mejor para multimedia)' }, 
                { value: 'any', emoji: '🤷', label: 'No me importa' }
            ]}
        ];
        
        easyQuestionsContainer.innerHTML = questions.map(q => `
                    <div class="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 mb-6">
                        <h3 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><span class="text-3xl">${q.icon}</span>${q.title}</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 easy-options" data-question-id="${q.id}">
                            ${q.options.map(opt => `<button data-value="${opt.value}" class="p-4 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-center font-semibold">
                                <span class="text-4xl block mb-2">${opt.emoji}</span>
                                ${opt.label}
                            </button>`).join('')}
                        </div>
                    </div>
                `).join('') + `
                <div class="text-center mt-8">
                     <button id="get-recommendations-btn" class="bg-indigo-600 text-white font-bold py-4 px-10 rounded-xl text-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-300" disabled>✨ Ver Recomendaciones</button>
                </div>`;

        document.getElementById('get-recommendations-btn').addEventListener('click', handleGetRecommendations);
        easyQuestionsContainer.addEventListener('click', handleEasyAnswer);
    };

    const renderAccountView = () => {
        if (!state.currentUser) {
            accountViewContainer.innerHTML = `
                        <div class="text-center bg-white p-12 rounded-3xl shadow-lg border border-slate-200">
                             <div class="text-7xl mb-4">👤</div>
                            <h2 class="text-2xl font-bold text-slate-800 mb-2">Accede a tu cuenta</h2>
                            <p class="text-slate-500 mb-6">Inicia sesión para ver tus favoritos e historial de búsqueda.</p>
                            <button class="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors" onclick="showAuthModal()">
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
        
        // Renderizar lista de comentarios
        renderCommentsList();
        
        // Configurar eventos
        setupCommentEvents();
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
                    ${comments.map(comment => `
                        <div class="bg-white p-4 rounded-xl border border-slate-200">
                            <div class="flex justify-between items-start mb-3">
                                <div>
                                    <h4 class="font-semibold text-slate-800">${escapeHtml(comment.author)}</h4>
                                    <div class="flex items-center gap-2 mt-1">
                                        ${renderStars(comment.rating)}
                                        <span class="text-sm text-slate-500">${comment.date}</span>
                                    </div>
                                </div>
                                <button class="delete-comment-btn text-red-500 hover:text-red-700 text-sm" data-id="${comment.id}">
                                    🗑️
                                </button>
                            </div>
                            <p class="text-slate-700">${escapeHtml(comment.text)}</p>
                        </div>
                    `).join('')}
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
        
        // Actualizar visualmente las estrellas
        document.querySelectorAll('.rating-star').forEach((star, index) => {
            const starRating = 5 - index;
            if (starRating <= rating) {
                star.classList.add('text-yellow-400');
            } else {
                star.classList.remove('text-yellow-400');
            }
        });
        
        // Seleccionar el radio button correspondiente
        document.getElementById(`rating-${rating}`).checked = true;
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        
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
            star.classList.remove('text-yellow-400');
        });
        
        alert('¡Comentario publicado exitosamente!');
    };

    const deleteComment = (commentId) => {
        if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
            state.comments = state.comments.filter(c => c.id !== commentId);
            saveCommentsToStorage();
            renderCommentsList();
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
    
    window.showAuthModal = () => { 
        modalContent.innerHTML = `
                    <div class="p-8">
                        <h2 class="text-2xl font-bold text-center mb-2" id="auth-title">Iniciar Sesión</h2>
                        <div id="auth-form-container">
                             <form id="login-form">
                                <input type="email" placeholder="Correo electrónico" required class="w-full mt-4 p-3 border border-slate-300 rounded-lg">
                                <input type="password" placeholder="Contraseña" required class="w-full mt-4 p-3 border border-slate-300 rounded-lg">
                                <button type="submit" class="w-full mt-6 bg-indigo-600 text-white font-bold py-3 rounded-lg">Ingresar</button>
                            </form>
                        </div>
                         <p class="text-center mt-4 text-sm">¿No tienes cuenta? <button id="toggle-auth-mode" class="text-indigo-600 font-semibold">Regístrate</button></p>
                    </div>
                `;
        modalBackdrop.classList.remove('hidden');
        document.getElementById('login-form').addEventListener('submit', handleLogin);
        document.getElementById('toggle-auth-mode').addEventListener('click', toggleAuthMode);
    }
    
    const toggleAuthMode = () => {
        const isLogin = document.getElementById('login-form') !== null;
        if (isLogin) {
            document.getElementById('auth-title').innerText = "Crear Cuenta";
            document.getElementById('auth-form-container').innerHTML = `
                        <form id="register-form">
                            <input type="text" placeholder="Nombre" required class="w-full mt-4 p-3 border border-slate-300 rounded-lg">
                            <input type="email" placeholder="Correo electrónico" required class="w-full mt-4 p-3 border border-slate-300 rounded-lg">
                            <input type="password" placeholder="Contraseña" required class="w-full mt-4 p-3 border border-slate-300 rounded-lg">
                            <button type="submit" class="w-full mt-6 bg-indigo-600 text-white font-bold py-3 rounded-lg">Registrarse</button>
                        </form>
                    `;
             document.querySelector('#toggle-auth-mode').innerText = "Inicia Sesión";
            document.getElementById('register-form').addEventListener('submit', handleRegister);
        } else {
             showAuthModal(); 
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
            minCamera: document.getElementById('filter-minCamera')?.value || '',
            minBattery: document.getElementById('filter-minBattery')?.value || '',
            minPrice: document.getElementById('filter-minPrice')?.value || '',
            maxPrice: document.getElementById('filter-maxPrice')?.value || '',
        };
        
        // Validar números
        const filters = {
            brand: sanitizeInput(rawFilters.brand),
            storage: sanitizeInput(rawFilters.storage),
            ram: sanitizeInput(rawFilters.ram),
            os: sanitizeInput(rawFilters.os),
            condition: sanitizeInput(rawFilters.condition),
            minCamera: rawFilters.minCamera ? validateNumber(rawFilters.minCamera, 0, 500) : '',
            minBattery: rawFilters.minBattery ? validateNumber(rawFilters.minBattery, 0, 10000) : '',
            minPrice: rawFilters.minPrice ? validateNumber(rawFilters.minPrice, 0, 1000000) : '',
            maxPrice: rawFilters.maxPrice ? validateNumber(rawFilters.maxPrice, 0, 1000000) : '',
        };
        
        if (state.currentUser && Object.values(filters).some(v => v !== '')) {
             state.searchHistory.push({
                id: Date.now(),
                date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                filters: Object.fromEntries(Object.entries(filters).filter(([k, v]) => v !== '')),
            });
            state.searchHistory = state.searchHistory.slice(-5); 
        }

        const results = phoneDatabase.filter(phone => 
            (!filters.brand || phone.brand === filters.brand) &&
            (!filters.storage || phone.storage === filters.storage) &&
            (!filters.ram || phone.ram === filters.ram) &&
            (!filters.os || phone.os === filters.os) &&
            (!filters.condition || phone.condition === filters.condition) &&
            (!filters.minCamera || parseInt(phone.camera) >= parseInt(filters.minCamera)) &&
            (!filters.minBattery || phone.battery >= parseInt(filters.minBattery)) &&
            (!filters.minPrice || phone.price >= parseInt(filters.minPrice)) &&
            (!filters.maxPrice || phone.price <= parseInt(filters.maxPrice))
        );

        renderProductGrid(document.getElementById('search-results-container'), results);
    };

    const handleEasyAnswer = (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        
        const questionId = button.parentElement.dataset.questionId;
        const value = button.dataset.value;
        state.easyAnswers[questionId] = value;
        
        button.parentElement.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('bg-indigo-500', 'text-white', 'border-indigo-500');
            btn.classList.add('bg-slate-50', 'border-slate-200');
        });
        button.classList.add('bg-indigo-500', 'text-white', 'border-indigo-500');
        
        const allAnswered = Object.values(state.easyAnswers).every(v => v !== null);
        document.getElementById('get-recommendations-btn').disabled = !allAnswered;
    };

    const handleGetRecommendations = () => {
        const budgetRanges = { 
            'very-low': [0, 5500], // < $300 USD ≈ < $5,500 MXN
            'low': [5500, 9250], // $300-500 USD ≈ $5,500-9,250 MXN
            'medium': [9250, 14800], // $500-800 USD ≈ $9,250-14,800 MXN
            'high': [14800, 22200], // $800-1200 USD ≈ $14,800-22,200 MXN
            'premium': [22200, Infinity], // > $1200 USD ≈ > $22,200 MXN
            'flexible': [0, Infinity]
        };
        
        let phones = phoneDatabase;
        
        // Filtrar por presupuesto si no es flexible
        if (state.easyAnswers.budget && state.easyAnswers.budget !== 'flexible') {
            const [min, max] = budgetRanges[state.easyAnswers.budget];
            phones = phones.filter(p => p.price >= min && p.price <= max);
        }
        
        // Filtrar por sistema operativo
        if (state.easyAnswers.system && state.easyAnswers.system !== 'any') {
            if (state.easyAnswers.system === 'prefer-ios') {
                phones = phones.filter(p => p.os === 'ios');
            } else if (state.easyAnswers.system === 'prefer-android') {
                phones = phones.filter(p => p.os === 'android');
            } else if (state.easyAnswers.system === 'ios' || state.easyAnswers.system === 'android') {
                phones = phones.filter(p => p.os === state.easyAnswers.system);
            }
        }
        
        // Filtrar por tamaño de pantalla si se especificó
        if (state.easyAnswers.size && state.easyAnswers.size !== 'any') {
            phones = phones.filter(p => p.screen === state.easyAnswers.size);
        }

        // Ordenar por prioridad
        const sortFunctions = {
            battery: (a, b) => b.battery - a.battery,
            camera: (a, b) => parseInt(b.camera) - parseInt(a.camera),
            storage: (a, b) => parseInt(b.storage) - parseInt(a.storage),
            brand: (a, b) => a.brand.localeCompare(b.brand),
            performance: (a, b) => {
                const aScore = parseInt(a.ram) + parseInt(a.storage) + a.battery/100;
                const bScore = parseInt(b.ram) + parseInt(b.storage) + b.battery/100;
                return bScore - aScore;
            },
            design: (a, b) => a.price - b.price, // Asumimos que más caro = mejor diseño
            durability: (a, b) => b.battery - a.battery, // Asumimos que más batería = más durabilidad
            value: (a, b) => {
                const aValue = (parseInt(a.ram) + parseInt(a.storage) + a.battery/100) / a.price;
                const bValue = (parseInt(b.ram) + parseInt(b.storage) + b.battery/100) / b.price;
                return bValue - aValue;
            }
        };
        
        if (state.easyAnswers.priority && sortFunctions[state.easyAnswers.priority]) {
            phones.sort(sortFunctions[state.easyAnswers.priority]);
        } else {
            // Si no hay prioridad específica, ordenar por mejor relación calidad-precio
            phones.sort((a, b) => {
                const aValue = (parseInt(a.ram) + parseInt(a.storage) + a.battery/100) / a.price;
                const bValue = (parseInt(b.ram) + parseInt(b.storage) + b.battery/100) / b.price;
                return bValue - aValue;
            });
        }

        // Mostrar hasta 6 resultados para dar más opciones
        const results = phones.slice(0, 6);
        const badges = {};
        
        results.forEach(phone => {
            // Badges basados en prioridad
            if (state.easyAnswers.priority === 'battery' && phone.battery >= 5000) {
                badges[phone.id] = { icon: '🔋', text: 'Gran Batería', color: 'bg-green-500' };
            }
            if (state.easyAnswers.priority === 'camera' && parseInt(phone.camera) >= 50) {
                badges[phone.id] = { icon: '📷', text: 'Cámara Pro', color: 'bg-purple-500' };
            }
            if (state.easyAnswers.priority === 'value') {
                badges[phone.id] = { icon: '💯', text: 'Excelente Valor', color: 'bg-blue-500' };
            }
            
            // Badges adicionales
            if (phone.price <= 9250 && phone.battery >= 4000) { // $500 USD ≈ $9,250 MXN
                badges[phone.id] = { icon: '💵', text: 'Económico', color: 'bg-green-600' };
            }
            if (parseInt(phone.storage) >= 256) {
                badges[phone.id] = { icon: '💾', text: 'Alto Almacenamiento', color: 'bg-indigo-500' };
            }
        });
        
        renderProductGrid(easyResultsContainer, results, badges);
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

    const updateAll = () => {
        renderAuthSection();
        if(state.currentView === 'search') {
            handleSearch();
        } else if (state.currentView === 'account') {
            renderAccountView();
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
    });
});
