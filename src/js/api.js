// APIs disponibles para smartphones
const PHONE_APIS = {
    // DummyJSON - API confiable con productos de electrónica
    dummyjson: 'https://dummyjson.com/products/category/smartphones',
    // Alternativa: API de productos con categoría de smartphones
    dummyjsonAll: 'https://dummyjson.com/products?limit=30&select=title,price,images,description,rating,stock',
    // Fallback: FakeStore API (original)
    fakestore: 'https://fakestoreapi.com/products?limit=20'
};

// URL principal de la API
const PRIMARY_API_URL = PHONE_APIS.dummyjson;
window.PRIMARY_API_URL = PRIMARY_API_URL;
window.PHONE_APIS = PHONE_APIS;

// Mapeo de imágenes por marca (para productos de la API que no tienen modelo específico)
const brandDefaultImages = {
    apple: 'https://images.unsplash.com/photo-1592286927505-2fd0908938ef?w=400&h=400&fit=crop',
    samsung: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
    google: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&h=400&fit=crop',
    xiaomi: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
    oneplus: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    nothing: 'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=400&h=400&fit=crop',
    motorola: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=400&fit=crop',
    realme: 'https://images.unsplash.com/photo-1632661674711-e12e4d09fc88?w=400&h=400&fit=crop',
    vivo: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
    huawei: 'https://images.unsplash.com/photo-1592286927505-2fd0908938ef?w=400&h=400&fit=crop'
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

// Función para detectar marca desde el nombre del producto
function detectBrand(productName) {
    const name = productName.toLowerCase();
    if (name.includes('iphone') || name.includes('apple')) return 'apple';
    if (name.includes('samsung') || name.includes('galaxy')) return 'samsung';
    if (name.includes('pixel') || name.includes('google')) return 'google';
    if (name.includes('xiaomi') || name.includes('redmi') || name.includes('mi ')) return 'xiaomi';
    if (name.includes('oneplus') || name.includes('one plus')) return 'oneplus';
    if (name.includes('huawei') || name.includes('honor')) return 'huawei';
    if (name.includes('motorola') || name.includes('moto')) return 'motorola';
    if (name.includes('nothing')) return 'nothing';
    if (name.includes('realme')) return 'realme';
    if (name.includes('vivo')) return 'vivo';
    return 'samsung'; // Default
}

// Función para extraer especificaciones del nombre o descripción
function extractSpecs(productName, description = '') {
    const text = (productName + ' ' + description).toLowerCase();
    const storageOptions = ['128gb', '256gb', '512gb', '64gb', '1tb'];
    const ramOptions = ['8gb', '12gb', '16gb', '6gb', '4gb'];
    
    // Detectar almacenamiento
    let storage = '128gb';
    for (const option of storageOptions) {
        if (text.includes(option)) {
            storage = option;
            break;
        }
    }
    
    // Detectar RAM
    let ram = '8gb';
    for (const option of ramOptions) {
        if (text.includes(option + ' ram') || text.includes(option + ' ram')) {
            ram = option;
            break;
        }
    }
    
    return { storage, ram };
}

function mapToPhoneSpecs(products) {
    const brands = ['apple', 'samsung', 'google', 'xiaomi', 'oneplus'];
    const osOptions = { apple: 'ios', default: 'android' };
    const storageOptions = ['128gb', '256gb', '512gb'];
    const ramOptions = ['8gb', '12gb', '16gb'];
    const conditionOptions = ['new', 'refurbished'];
    const screenOptions = ['small', 'medium', 'large'];

    // Si la API devuelve productos con estructura de DummyJSON
    if (products.products && Array.isArray(products.products)) {
        products = products.products;
    }

    return products.map((product, index) => {
        // Detectar si es DummyJSON API (tiene estructura diferente)
        const isDummyJSON = product.hasOwnProperty('images') && Array.isArray(product.images);
        
        // Obtener nombre del producto
        const productName = product.title || product.name || `Smartphone ${index + 1}`;
        const brand = detectBrand(productName);
        const os = brand === 'apple' ? osOptions.apple : osOptions.default;
        
        // Extraer especificaciones del nombre/descripción
        const extractedSpecs = extractSpecs(productName, product.description || '');
        const storage = extractedSpecs.storage || storageOptions[Math.floor(Math.random() * storageOptions.length)];
        const ram = extractedSpecs.ram || ramOptions[Math.floor(Math.random() * ramOptions.length)];
        const condition = conditionOptions[Math.floor(Math.random() * conditionOptions.length)];
        const screen = screenOptions[Math.floor(Math.random() * screenOptions.length)];
        
        // Precio: convertir a MXN (pesos mexicanos) si viene en USD
        let price = product.price || 0;
        
        // DummyJSON generalmente devuelve precios en USD (rango típico 10-2000)
        // Si el precio es menor a 5000, asumimos que está en USD y convertimos a MXN
        // Tipo de cambio aproximado: 1 USD = 18.5 MXN
        if (price > 0 && price < 5000) {
            // Convertir de USD a MXN
            price = Math.round(price * 18.5);
        }
        
        // Si no hay precio, generar uno razonable en MXN basado en precios reales del mercado mexicano
        // Rango realista para smartphones en México: $6,500 - $37,000 MXN
        if (!price || price === 0) {
            // Generar precios realistas según la marca (en pesos mexicanos) basados en precios reales
            const basePrices = {
                apple: { min: 22000, max: 37000 },
                samsung: { min: 9500, max: 32000 },
                google: { min: 15000, max: 27000 },
                xiaomi: { min: 6500, max: 24000 },
                oneplus: { min: 19000, max: 25000 },
                huawei: { min: 20000, max: 20000 },
                motorola: { min: 13000, max: 17000 },
                nothing: { min: 13000, max: 17000 },
                realme: { min: 18000, max: 18000 },
                vivo: { min: 20000, max: 22000 }
            };
            
            const brandPrice = basePrices[brand] || { min: 8000, max: 20000 };
            price = Math.round(brandPrice.min + Math.random() * (brandPrice.max - brandPrice.min));
        }
        
        // Asegurar que el precio esté en un rango razonable para México (basado en precios reales)
        if (price < 5000) {
            price = Math.round(6500 + Math.random() * 5000); // Mínimo $6,500 MXN
        }
        if (price > 40000) {
            price = Math.round(30000 + Math.random() * 7000); // Máximo razonable $37,000 MXN
        }
        
        const battery = Math.floor(4000 + (price / 1000) * 800) + (index % 5) * 10; 
        const cameraMP = Math.floor(12 + (price / 1500) * 40) * (index % 2 === 0 ? 1 : 1.2); 
        const camera = `${Math.round(cameraMP)}mp`;

        const specs = `${ram} RAM • ${storage} • ${camera} Camera • ${battery} mAh Batería.`;

        // Obtener imagen: priorizar imagen de la API, luego local
        let imageUrl = null;
        if (isDummyJSON && product.images && product.images.length > 0) {
            // DummyJSON proporciona imágenes en array
            imageUrl = product.images[0]; // Usar primera imagen
        } else if (product.image) {
            // FakeStore API tiene campo 'image'
            imageUrl = product.image;
        } else {
            // Intentar obtener imagen local
            imageUrl = getPhoneImageUrl(brand, productName);
        }
        
        return {
            id: product.id || `phone-${index}`,
            name: productName,
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
            image: imageUrl,
            rating: product.rating || Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
            stock: product.stock !== undefined ? product.stock : Math.floor(Math.random() * 50),
            fullSpecs: { 
                Processor: "A20 Bionic / Snapdragon Gen 9", 
                Display: `${screen.toUpperCase()} ${Math.floor(Math.random() * 1.5 + 6)}.${index % 10} " Display`, 
                'Main Camera': `${camera}`, 
                'Front Camera': '12MP', 
                'Battery Life': `${battery} mAh`, 
                Weight: `${Math.floor(150 + Math.random() * 50)}g`, 
                Materials: "Aluminio con vidrio reforzado",
                Description: product.description || 'Smartphone de alta calidad con las últimas tecnologías.'
            }, 
            purchaseLinks: [
                { store: "Tienda Oficial", url: "https://www.google.com", logo: "🛒" }, 
                { store: "Amazon MX", url: "https://www.amazon.com.mx", logo: "📦" } 
            ] 
        };
    });
}

async function fetchAndInitializeApp(loadingIndicator, renderAuthSection, renderCharts, renderSearchView, renderEasyModeView, renderAccountView, updateView, apiUrl, mapToPhoneSpecs) {
    try {
        if (!loadingIndicator) {
            console.error('Loading indicator no encontrado');
            return [];
        }
        
        loadingIndicator.classList.remove('hidden');
        
        // Configurar timeout para la API
        const API_TIMEOUT = 8000; // 8 segundos (más tiempo para DummyJSON)
        let timeoutId = null;
        let controller = null;
        let lastError = null;
        
        // Lista de APIs a intentar en orden
        const apiUrls = [
            PRIMARY_API_URL, // DummyJSON smartphones
            PHONE_APIS.dummyjsonAll, // DummyJSON todos los productos
            PHONE_APIS.fakestore // Fallback FakeStore
        ];
        
        // Intentar cada API hasta que una funcione
        for (const currentApiUrl of apiUrls) {
            // Limpiar timeout anterior si existe
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            
            try {
                console.log(`🌐 Intentando conectar con la API: ${currentApiUrl}...`);
                controller = new AbortController();
                timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
                
                const response = await fetch(currentApiUrl, {
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
                
                // DummyJSON devuelve { products: [...] } o directamente array
                let productsArray = rawProducts;
                if (rawProducts.products && Array.isArray(rawProducts.products)) {
                    productsArray = rawProducts.products;
                }
                
                if (!productsArray || !Array.isArray(productsArray) || productsArray.length === 0) {
                    throw new Error('API returned empty or invalid data');
                }
                
                // Filtrar solo smartphones si es necesario
                if (currentApiUrl === PHONE_APIS.dummyjsonAll) {
                    // Filtrar productos que parezcan smartphones
                    productsArray = productsArray.filter(p => {
                        const title = (p.title || '').toLowerCase();
                        return title.includes('phone') || title.includes('smartphone') || 
                               title.includes('iphone') || title.includes('galaxy') ||
                               title.includes('pixel') || title.includes('xiaomi');
                    });
                    
                    // Si no hay suficientes, tomar los primeros
                    if (productsArray.length < 10) {
                        productsArray = productsArray.slice(0, 20);
                    }
                }
                
                const newPhoneDatabase = mapToPhoneSpecs(productsArray);
                console.log(`✅ Datos cargados desde la API (${currentApiUrl}):`, newPhoneDatabase.length, 'productos');
                
                // Combinar con base de datos de respaldo para tener modelos más actuales
                let finalPhoneDatabase = newPhoneDatabase;
                try {
                    if (window.getFallbackPhoneData && typeof window.getFallbackPhoneData === 'function') {
                        const fallbackData = window.getFallbackPhoneData();
                        if (fallbackData && Array.isArray(fallbackData) && fallbackData.length > 0) {
                            // Combinar: usar fallback como base y agregar datos de API que no estén duplicados
                            const fallbackIds = new Set(fallbackData.map(p => p.id));
                            const apiOnly = newPhoneDatabase.filter(p => !fallbackIds.has(p.id));
                            finalPhoneDatabase = [...fallbackData, ...apiOnly];
                            console.log(`✅ Combinados ${fallbackData.length} modelos de respaldo + ${apiOnly.length} de API = ${finalPhoneDatabase.length} total`);
                        }
                    }
                } catch (e) {
                    console.warn('Error al combinar con base de datos de respaldo:', e);
                }
                
                // Actualizar imágenes: priorizar imágenes de la API, luego locales/fallback
                finalPhoneDatabase = finalPhoneDatabase.map(phone => {
                    // Si ya tiene imagen de la API (URL válida), mantenerla
                    if (phone.image && phone.image.startsWith('http')) {
                        return phone;
                    }
                    
                    // Intentar obtener imagen local o de fallback para TODAS las marcas
                    if (typeof window.getModelImage === 'function' && phone.name) {
                        let localImage = window.getModelImage(phone.name);
                        
                        // Si no funciona con el nombre completo, intentar solo con el modelo
                        if (!localImage || (!localImage.startsWith('src/images/') && !localImage.startsWith('http'))) {
                            // Remover prefijos de marca comunes
                            const modelName = phone.name
                                .replace(/^(Apple|Samsung|Google|Xiaomi|OnePlus|Nothing|Motorola|Realme|Vivo|Huawei)\s+/i, '')
                                .trim();
                            localImage = window.getModelImage(modelName);
                        }
                        
                        // Si encontramos una imagen válida (local o URL), usarla
                        if (localImage && (localImage.startsWith('src/images/') || localImage.startsWith('http'))) {
                            phone.image = localImage;
                        } else if (!phone.image) {
                            // Si no hay imagen, usar imagen por defecto de la marca
                            const brandDefault = brandDefaultImages[phone.brand] || brandDefaultImages.samsung;
                            phone.image = brandDefault;
                        }
                    } else if (!phone.image) {
                        // Si no hay función getModelImage, usar imagen por defecto de la marca
                        const brandDefault = brandDefaultImages[phone.brand] || brandDefaultImages.samsung;
                        phone.image = brandDefault;
                    }
                    return phone;
                });
                
                // Guardar en localStorage para uso offline
                try {
                    localStorage.setItem('phoneDatabase_cache', JSON.stringify({
                        data: finalPhoneDatabase,
                        timestamp: Date.now(),
                        source: 'api+fallback',
                        apiUrl: currentApiUrl
                    }));
                } catch (e) {
                    console.warn('No se pudo guardar en localStorage:', e);
                }
                
                // Ocultar loading antes de retornar
                loadingIndicator.classList.add('hidden');
                return finalPhoneDatabase;
                
            } catch (apiError) {
                // Si esta API falla, intentar la siguiente
                lastError = apiError;
                console.warn(`⚠️ Error con API ${currentApiUrl}:`, apiError.message);
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
                continue; // Intentar siguiente API
            }
        }
        
        // Limpiar timeout si aún existe
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        
        // Si todas las APIs fallaron, lanzar el último error
        throw lastError || new Error('Todas las APIs fallaron');
        
    } catch (error) {
        // Asegurar que timeoutId se limpie si existe
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        console.warn('⚠️ Error al cargar la API, activando modo offline:', error.message);
        
        // Solo mostrar indicador offline si realmente no hay conexión
        // No mostrar si solo falló la API pero hay conexión
        if (!navigator.onLine && typeof window.showOfflineIndicator === 'function') {
            window.showOfflineIndicator();
        }
        
        // Mostrar mensaje informativo al usuario solo si realmente está offline
        if (loadingIndicator && !navigator.onLine) {
            loadingIndicator.innerHTML = `
                <div class="text-7xl mb-4">📱</div>
                <p class="mt-4 text-xl font-semibold text-orange-600">Modo Offline Activado</p>
                <p class="mt-2 text-lg text-slate-600">Cargando catálogo desde base de datos local...</p>
                <div class="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p class="text-sm text-orange-800">
                        <strong>ℹ️ Información:</strong> Sin conexión a internet. 
                        Estás viendo datos almacenados localmente. 
                        Algunas funciones pueden estar limitadas.
                    </p>
                </div>
            `;
        } else if (loadingIndicator) {
            // Si hay conexión pero la API falló, mostrar mensaje diferente
            loadingIndicator.innerHTML = `
                <div class="text-7xl mb-4">📱</div>
                <p class="mt-4 text-xl font-semibold text-slate-700">Cargando datos...</p>
                <p class="mt-2 text-lg text-slate-600">Usando datos locales mientras se conecta con la API...</p>
            `;
        }
        
        // Simular un pequeño retraso para mostrar el mensaje
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // PRIORIZAR base de datos de respaldo (tiene los modelos más actuales)
        let fallbackData = null;
        try {
            if (window.getFallbackPhoneData && typeof window.getFallbackPhoneData === 'function') {
                fallbackData = window.getFallbackPhoneData();
                console.log('✅ Datos cargados desde base de datos de respaldo (modelos actualizados):', fallbackData ? fallbackData.length : 0, 'productos');
            } else if (window.fallbackPhoneDatabase && Array.isArray(window.fallbackPhoneDatabase)) {
                fallbackData = window.fallbackPhoneDatabase;
                console.log('✅ Datos cargados desde fallbackPhoneDatabase:', fallbackData ? fallbackData.length : 0, 'productos');
            }
        } catch (e) {
            console.warn('⚠️ Error al cargar base de datos de respaldo:', e);
        }
        
        // Si no hay base de datos de respaldo, intentar cargar desde localStorage
        if (!fallbackData || !Array.isArray(fallbackData) || fallbackData.length === 0) {
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
                            console.log('⚠️ Caché expirado');
                            // Limpiar caché expirado
                            localStorage.removeItem('phoneDatabase_cache');
                        }
                    }
                }
            } catch (e) {
                console.warn('Error al cargar caché:', e);
            }
        }
        
        // Si aún no hay datos, usar array vacío
        if (!fallbackData || !Array.isArray(fallbackData) || fallbackData.length === 0) {
            console.error('❌ No se encontraron datos de respaldo');
            fallbackData = [];
        }
        
        // Actualizar imágenes a locales si están disponibles
        if (fallbackData && Array.isArray(fallbackData)) {
            fallbackData = fallbackData.map(phone => {
                // Asegurar que todas las marcas tengan imágenes correctas
                if (typeof window.getModelImage === 'function' && phone.name) {
                    // Intentar con el nombre completo primero
                    let localImage = window.getModelImage(phone.name);
                    
                    // Si no funciona, intentar solo con el modelo (remover prefijos de marca)
                    if (!localImage || (!localImage.startsWith('src/images/') && !localImage.startsWith('http'))) {
                        const modelName = phone.name
                            .replace(/^(Apple|Samsung|Google|Xiaomi|OnePlus|Nothing|Motorola|Realme|Vivo|Huawei)\s+/i, '')
                            .trim();
                        localImage = window.getModelImage(modelName);
                    }
                    
                    // Si encontramos una imagen válida (local o URL), usarla
                    if (localImage && (localImage.startsWith('src/images/') || localImage.startsWith('http'))) {
                        phone.image = localImage;
                    } else if (!phone.image) {
                        // Si no hay imagen, usar imagen por defecto de la marca
                        const brandDefault = brandDefaultImages[phone.brand] || brandDefaultImages.samsung;
                        phone.image = brandDefault;
                    }
                } else if (!phone.image) {
                    // Si no hay función getModelImage, usar imagen por defecto de la marca
                    const brandDefault = brandDefaultImages[phone.brand] || brandDefaultImages.samsung;
                    phone.image = brandDefault;
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
}

// Hacer las funciones y variables disponibles globalmente INMEDIATAMENTE
// Esto asegura que estén disponibles antes de que script.js intente usarlas
if (typeof window !== 'undefined') {
    window.mapToPhoneSpecs = mapToPhoneSpecs;
    window.fetchAndInitializeApp = fetchAndInitializeApp;
    window.PRIMARY_API_URL = PRIMARY_API_URL;
    window.PHONE_APIS = PHONE_APIS;
    // Mantener compatibilidad con código antiguo
    window.FAKE_STORE_API_URL = PHONE_APIS.fakestore;
    
    // Disparar evento personalizado para notificar que las funciones están listas
    window.dispatchEvent(new CustomEvent('apiFunctionsReady'));
    console.log('✅ Funciones de API exportadas globalmente');
}
