const FAKE_STORE_API_URL = 'https://fakestoreapi.com/products?limit=20';
window.FAKE_STORE_API_URL = FAKE_STORE_API_URL;

// Mapeo de imágenes por marca (para productos de la API que no tienen modelo específico)
const brandDefaultImages = {
    apple: 'https://images.unsplash.com/photo-1592286927505-2fd0908938ef?w=400&h=400&fit=crop',
    samsung: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
    google: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&h=400&fit=crop',
    xiaomi: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
    oneplus: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
};

// Función para obtener imagen por marca (para productos de la API)
function getPhoneImageUrl(brand, productName) {
    // Intentar usar la función getModelImage si está disponible (desde fallback-db.js)
    if (typeof window.getModelImage === 'function' && productName) {
        // Intentar con el nombre completo primero
        let image = window.getModelImage(productName);
        
        // Si no funciona, extraer el modelo del nombre del producto
        if (!image || !image.startsWith('src/images/')) {
            const modelMatch = productName.match(/(iPhone|Galaxy|Pixel|Xiaomi|OnePlus|Redmi|Huawei|Motorola|Nothing|Realme|Vivo)\s*[\d\w\s]*/i);
            if (modelMatch) {
                const model = modelMatch[0].trim();
                image = window.getModelImage(model);
            }
        }
        
        // Si encontramos una imagen local, usarla
        if (image && image.startsWith('src/images/')) {
            return image;
        }
        
        // Si encontramos una imagen válida (aunque sea URL), usarla
        if (image) {
            return image;
        }
    }
    
    // Fallback: usar imagen por defecto de la marca
    return brandDefaultImages[brand] || brandDefaultImages.apple;
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
            image: getPhoneImageUrl(brand, baseName + (index % 2 === 0 ? ' Pro' : ' Lite')), // Use specific phone images based on product name
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
    try {
        if (!loadingIndicator) {
            console.error('Loading indicator no encontrado');
            return [];
        }
        
        loadingIndicator.classList.remove('hidden');
        
        // Configurar timeout para la API
        const API_TIMEOUT = 5000; // 5 segundos
        let timeoutId = null;
        let controller = null;
        
        try {
            console.log('🌐 Intentando conectar con la API...');
            controller = new AbortController();
            timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
            
            const response = await fetch(FAKE_STORE_API_URL, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (timeoutId) clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const rawProducts = await response.json();
            
            if (!rawProducts || !Array.isArray(rawProducts) || rawProducts.length === 0) {
                throw new Error('API returned empty or invalid data');
            }
            
            const newPhoneDatabase = mapToPhoneSpecs(rawProducts);
            console.log('✅ Datos cargados desde la API:', newPhoneDatabase.length, 'productos');
            
            // Actualizar imágenes a locales antes de guardar en caché
            newPhoneDatabase = newPhoneDatabase.map(phone => {
                if (phone.brand === 'apple' || phone.brand === 'samsung') {
                    // Intentar obtener imagen local si está disponible
                    if (typeof window.getModelImage === 'function') {
                        // Intentar con el nombre completo primero
                        let localImage = window.getModelImage(phone.name);
                        
                        // Si no funciona, intentar solo con el modelo
                        if (!localImage || !localImage.startsWith('src/images/')) {
                            const modelName = phone.name.replace(/Apple\s+|Samsung\s+/i, '');
                            localImage = window.getModelImage(modelName);
                        }
                        
                        // Si encontramos una imagen local, usarla
                        if (localImage && localImage.startsWith('src/images/')) {
                            phone.image = localImage;
                        }
                    }
                }
                return phone;
            });
            
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
            
            // Ocultar loading antes de retornar
            loadingIndicator.classList.add('hidden');
            return newPhoneDatabase;
            
        } catch (error) {
            if (timeoutId) clearTimeout(timeoutId);
            console.warn('⚠️ Error al cargar la API, activando modo offline:', error.message);
            
            // Mostrar mensaje informativo al usuario
            if (loadingIndicator) {
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
            }
            
            // Simular un pequeño retraso para mostrar el mensaje
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Intentar cargar desde localStorage primero
            let fallbackData = null;
            try {
                const cached = localStorage.getItem('phoneDatabase_cache');
                if (cached) {
                    const parsed = JSON.parse(cached);
                    const cacheAge = Date.now() - parsed.timestamp;
                    const maxAge = 24 * 60 * 60 * 1000; // 24 horas
                    
                    if (parsed.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
                        if (cacheAge < maxAge) {
                            fallbackData = parsed.data;
                            console.log('✅ Datos cargados desde caché local:', fallbackData.length, 'productos');
                        } else {
                            console.log('⚠️ Caché expirado, usando base de datos de respaldo');
                        }
                    }
                }
            } catch (e) {
                console.warn('Error al cargar caché:', e);
            }
            
            // Si no hay caché o está muy viejo, usar base de datos de respaldo
            if (!fallbackData || !Array.isArray(fallbackData) || fallbackData.length === 0) {
                try {
                    if (window.getFallbackPhoneData && typeof window.getFallbackPhoneData === 'function') {
                        fallbackData = window.getFallbackPhoneData();
                    } else if (window.fallbackPhoneDatabase && Array.isArray(window.fallbackPhoneDatabase)) {
                        fallbackData = window.fallbackPhoneDatabase;
                    } else {
                        console.error('❌ No se encontró base de datos de respaldo');
                        fallbackData = [];
                    }
                    console.log('✅ Datos cargados desde base de datos de respaldo:', fallbackData ? fallbackData.length : 0, 'productos');
                } catch (e) {
                    console.error('❌ Error al cargar base de datos de respaldo:', e);
                    fallbackData = [];
                }
            }
            
            // Actualizar imágenes a locales si están disponibles
            if (fallbackData && Array.isArray(fallbackData)) {
                fallbackData = fallbackData.map(phone => {
                    if (phone.brand === 'apple' || phone.brand === 'samsung') {
                        // Usar imagen local si está disponible
                        if (typeof window.getModelImage === 'function' && phone.name) {
                            // Intentar con el nombre completo primero
                            let localImage = window.getModelImage(phone.name);
                            
                            // Si no funciona, intentar solo con el modelo
                            if (!localImage || !localImage.startsWith('src/images/')) {
                                const modelName = phone.name.replace(/Apple\s+|Samsung\s+/i, '');
                                localImage = window.getModelImage(modelName);
                            }
                            
                            // Si encontramos una imagen local, usarla
                            if (localImage && localImage.startsWith('src/images/')) {
                                phone.image = localImage;
                            }
                        }
                    }
                    return phone;
                });
            }
            
            // Asegurar que siempre se retorne un array
            if (!fallbackData || !Array.isArray(fallbackData)) {
                console.error('❌ Fallback data no es un array válido');
                fallbackData = [];
            }
            
            // Ocultar loading antes de retornar
            if (loadingIndicator) {
                loadingIndicator.classList.add('hidden');
            }
            
            return fallbackData;
        }
    } catch (unexpectedError) {
        // Manejo de errores inesperados
        console.error('❌ Error inesperado:', unexpectedError);
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
        return [];
    }
}

// Hacer las funciones y variables disponibles globalmente
window.mapToPhoneSpecs = mapToPhoneSpecs;
window.fetchAndInitializeApp = fetchAndInitializeApp;
window.FAKE_STORE_API_URL = FAKE_STORE_API_URL;
