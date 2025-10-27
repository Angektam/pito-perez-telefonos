const FAKE_STORE_API_URL = 'https://fakestoreapi.com/products?limit=20';
window.FAKE_STORE_API_URL = FAKE_STORE_API_URL;

// Imágenes reales verificadas de teléfonos específicos de Unsplash
const realPhoneImages = {
    apple: [
        'https://images.unsplash.com/photo-1592286927505-2fd0908938ef?w=400&h=400&fit=crop',  // iPhone
        'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=400&fit=crop',  // iPhone
        'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=400&h=400&fit=crop',  // iPhone
        'https://images.unsplash.com/photo-1632661674711-e12e4d09fc88?w=400&h=400&fit=crop'   // iPhone
    ],
    samsung: [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',  // Samsung Galaxy
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',  // Android phone
        'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop',  // Smartphone
        'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&h=400&fit=crop'   // Phone
    ],
    google: [
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&h=400&fit=crop',  // Google Pixel
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',  // Smartphone
        'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=400&h=400&fit=crop',  // Phone
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'   // Modern phone
    ],
    xiaomi: [
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',  // Android phone
        'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop',  // Smartphone
        'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&h=400&fit=crop',  // Phone
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop'   // Modern device
    ],
    oneplus: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',  // Smartphone
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',  // Phone
        'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=400&h=400&fit=crop',  // Modern phone
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop'   // Device
    ]
};

// Función para obtener URLs de imágenes reales por marca
function getPhoneImageUrl(brand, productId) {
    const brandImages = realPhoneImages[brand] || realPhoneImages.apple;
    const imageIndex = (productId - 1) % brandImages.length;
    return brandImages[imageIndex];
}

function mapToPhoneSpecs(products) {
    const brands = ['apple', 'samsung', 'google', 'xiaomi', 'oneplus'];
    const osOptions = { apple: 'ios', default: 'android' };
    const storageOptions = ['128gb', '256gb', '512gb'];
    const ramOptions = ['8gb', '12gb', '16gb'];
    const conditionOptions = ['new', 'refurbished'];
    const screenOptions = ['small', 'medium', 'large'];

    return products.map((product, index) => {
        // Convertir precio de USD a MXN (pesos mexicanos)
        const usdPrice = product.price * (Math.random() * (100 - 50) + 50); 
        const price = Math.round(usdPrice * 18.5); // Tipo de cambio aproximado USD a MXN
        const brand = brands[index % brands.length];
        const os = brand === 'apple' ? osOptions.apple : osOptions.default;
        const storage = storageOptions[Math.floor(Math.random() * storageOptions.length)];
        const ram = ramOptions[Math.floor(Math.random() * ramOptions.length)];
        const condition = conditionOptions[Math.floor(Math.random() * conditionOptions.length)];
        const screen = screenOptions[Math.floor(Math.random() * screenOptions.length)];
        
        const battery = Math.floor(4000 + (price / 1000) * 800) + (index % 5) * 10; 
        const cameraMP = Math.floor(12 + (price / 1500) * 40) * (index % 2 === 0 ? 1 : 1.2); 
        const camera = `${Math.round(cameraMP)}mp`;

        const specs = `${ram} RAM • ${storage} • ${camera} Camera • ${battery} mAh Batería.`;

        const baseName = `${brand.charAt(0).toUpperCase() + brand.slice(1)} ${Math.floor(Math.random() * 8 + 15)}`;
        
        return {
            id: product.id,
            name: baseName + (index % 2 === 0 ? ' Pro' : ' Lite'), 
            brand: brand,
            storage: storage,
            ram: ram,
            camera: camera,
            battery: battery,
            screen: screen,
            os: os,
            condition: condition,
            price: Math.round(price),
            specs: specs,
            image: getPhoneImageUrl(brand, product.id), // Use specific phone images based on product ID
            fullSpecs: { 
                Processor: "Simulado A20 Bionic / Snapdragon Gen 9", 
                Display: `${screen.toUpperCase()} ${Math.floor(Math.random() * 1.5 + 6)}.${index} \" Display`, 
                'Main Camera': `${camera}`, 
                'Front Camera': '12MP', 
                'Battery Life': `${battery} mAh`, 
                Weight: `${Math.floor(150 + Math.random() * 50)}g`, 
                Materials: "Aluminio con vidrio reforzado" 
            }, 
            purchaseLinks: [
                { store: "Tienda Oficial", url: "https://www.google.com", logo: "🛒" }, 
                { store: "Amazon MX", url: "https://www.amazon.com.mx", logo: "📦" } 
            ] 
        };
    });
}

async function fetchAndInitializeApp(loadingIndicator, renderAuthSection, renderCharts, renderSearchView, renderEasyModeView, renderAccountView, updateView, FAKE_STORE_API_URL, mapToPhoneSpecs) {
    loadingIndicator.classList.remove('hidden');
    
    // Configurar timeout para la API
    const API_TIMEOUT = 5000; // 5 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    try {
        console.log('🌐 Intentando conectar con la API...');
        const response = await fetch(FAKE_STORE_API_URL, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const rawProducts = await response.json();
        
        if (!rawProducts || !Array.isArray(rawProducts) || rawProducts.length === 0) {
            throw new Error('API returned empty or invalid data');
        }
        
        const newPhoneDatabase = mapToPhoneSpecs(rawProducts);
        console.log('✅ Datos cargados desde la API:', newPhoneDatabase.length, 'productos');
        
        // Guardar en localStorage para uso offline
        try {
            localStorage.setItem('phoneDatabase_cache', JSON.stringify({
                data: newPhoneDatabase,
                timestamp: Date.now(),
                source: 'api'
            }));
        } catch (e) {
            console.warn('No se pudo guardar en localStorage:', e);
        }
        
        return newPhoneDatabase;
        
    } catch (error) {
        clearTimeout(timeoutId);
        console.warn('⚠️ Error al cargar la API, activando modo offline:', error.message);
        
        // Mostrar mensaje informativo al usuario
        loadingIndicator.innerHTML = `
            <div class="text-7xl mb-4">📱</div>
            <p class="mt-4 text-xl font-semibold text-orange-600">Modo Offline Activado</p>
            <p class="mt-2 text-lg text-slate-600">Cargando catálogo desde base de datos local...</p>
            <div class="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p class="text-sm text-orange-800">
                    <strong>ℹ️ Información:</strong> La API no está disponible. 
                    Estás viendo datos almacenados localmente. 
                    Algunas funciones pueden estar limitadas.
                </p>
            </div>
        `;
        
        // Simular un pequeño retraso para mostrar el mensaje
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Intentar cargar desde localStorage primero
        let fallbackData = null;
        try {
            const cached = localStorage.getItem('phoneDatabase_cache');
            if (cached) {
                const parsed = JSON.parse(cached);
                const cacheAge = Date.now() - parsed.timestamp;
                const maxAge = 24 * 60 * 60 * 1000; // 24 horas
                
                if (cacheAge < maxAge) {
                    fallbackData = parsed.data;
                    console.log('✅ Datos cargados desde caché local:', fallbackData.length, 'productos');
                }
            }
        } catch (e) {
            console.warn('Error al cargar caché:', e);
        }
        
        // Si no hay caché o está muy viejo, usar base de datos de respaldo
        if (!fallbackData) {
            fallbackData = window.getFallbackPhoneData ? window.getFallbackPhoneData() : window.fallbackPhoneDatabase;
            console.log('✅ Datos cargados desde base de datos de respaldo:', fallbackData.length, 'productos');
        }
        
        return fallbackData;
        
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}

// Hacer las funciones disponibles globalmente
window.mapToPhoneSpecs = mapToPhoneSpecs;
window.fetchAndInitializeApp = fetchAndInitializeApp;
