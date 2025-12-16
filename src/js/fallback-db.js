// Mapeo directo de cada modelo a su imagen original específica
// Imágenes descargadas y almacenadas localmente en src/images/phones/
const modelImages = {
    // Apple - iPhone (modelos más recientes 2024-2025)
    'iPhone 16 Pro Max': 'src/images/phones/iphone-15-pro.jpg', // Usar imagen disponible
    'iPhone 16 Pro': 'src/images/phones/iphone-15-pro.jpg',
    'iPhone 16': 'src/images/phones/iphone-15.jpg',
    'iPhone 15 Pro Max': 'src/images/phones/iphone-15-pro.jpg',
    'iPhone 15 Pro': 'src/images/phones/iphone-15-pro.jpg',
    'iPhone 15': 'src/images/phones/iphone-15.jpg',
    'iPhone 14 Pro': 'src/images/phones/iphone-14-pro.jpg',
    'iPhone 14': 'src/images/phones/iphone-14.jpg',
    
    // Samsung - Galaxy (modelos más recientes 2024-2025)
    'Galaxy S24 Ultra': 'src/images/phones/galaxy-s24.jpg',
    'Galaxy S24+': 'src/images/phones/galaxy-s24.jpg',
    'Galaxy S24': 'src/images/phones/galaxy-s24.jpg',
    'Galaxy S23': 'src/images/phones/galaxy-s23.jpg',
    'Galaxy A55': 'src/images/phones/galaxy-a54.jpg',
    'Galaxy A54': 'src/images/phones/galaxy-a54.jpg',
    'Galaxy A34': 'src/images/phones/galaxy-a34.jpg',
    
    // Google Pixel (modelos más recientes 2024-2025) - Cada modelo con imagen única
    'Pixel 9 Pro': 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&h=400&fit=crop',
    'Pixel 9': 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
    'Pixel 8a': 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=400&h=400&fit=crop',
    'Pixel 8 Pro': 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=400&h=400&fit=crop',
    'Pixel 8': 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
    'Pixel 7 Pro': 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=400&h=400&fit=crop',
    
    // Xiaomi (modelos más recientes 2024-2025) - Cada modelo con imagen única
    'Xiaomi 14 Ultra': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
    'Xiaomi 14': 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop',
    'Xiaomi 13': 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&h=400&fit=crop',
    'Redmi Note 13 Pro+': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
    'Redmi Note 13 Pro': 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
    'Redmi Note 13': 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=400&h=400&fit=crop',
    'Redmi 12': 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop',
    
    // OnePlus (modelos más recientes 2024-2025) - Cada modelo con imagen única
    'OnePlus 12': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    'OnePlus 12R': 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=400&h=400&fit=crop',
    'OnePlus 11': 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=400&h=400&fit=crop',
    'OnePlus 10T': 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
    
    // Otras marcas (modelos más recientes 2024-2025) - Cada modelo con imagen única
    'Nothing Phone 2a': 'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=400&h=400&fit=crop',
    'Nothing Phone 2': 'https://images.unsplash.com/photo-1632661674711-e12e4d09fc88?w=400&h=400&fit=crop',
    'Motorola Edge 50 Pro': 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=400&fit=crop',
    'Motorola Edge 40': 'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=400&h=400&fit=crop',
    'Realme GT 6': 'https://images.unsplash.com/photo-1632661674711-e12e4d09fc88?w=400&h=400&fit=crop',
    'Vivo X100 Pro': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
    'Vivo X100': 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=400&fit=crop',
    'Huawei P70': 'https://images.unsplash.com/photo-1592286927505-2fd0908938ef?w=400&h=400&fit=crop'
};

// Función para obtener imagen original específica por modelo
// Prioriza imágenes locales, luego URLs oficiales, luego fallback
function getModelImage(model) {
    if (!model) {
        return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop';
    }
    
    // Normalizar el nombre del modelo
    let normalizedModel = model.trim();
    
    // Mapear nombres comunes a los nombres en modelImages
    const nameMapping = {
        // Apple - Modelos más recientes
        'iphone 16 pro max': 'iPhone 16 Pro Max',
        'iphone 16 pro': 'iPhone 16 Pro',
        'iphone 16': 'iPhone 16',
        'iphone 15 pro max': 'iPhone 15 Pro Max',
        'iphone 15 pro': 'iPhone 15 Pro',
        'iphone 15': 'iPhone 15',
        'iphone 14 pro': 'iPhone 14 Pro',
        'iphone 14': 'iPhone 14',
        'apple 16 pro max': 'iPhone 16 Pro Max',
        'apple 16 pro': 'iPhone 16 Pro',
        'apple 16': 'iPhone 16',
        'apple 15 pro': 'iPhone 15 Pro',
        'apple 15': 'iPhone 15',
        
        // Samsung - Modelos más recientes
        'galaxy s24 ultra': 'Galaxy S24 Ultra',
        'galaxy s24+': 'Galaxy S24+',
        'galaxy s24 plus': 'Galaxy S24+',
        'galaxy s24': 'Galaxy S24',
        'galaxy s23': 'Galaxy S23',
        'galaxy a55': 'Galaxy A55',
        'galaxy a54': 'Galaxy A54',
        'galaxy a34': 'Galaxy A34',
        'samsung s24 ultra': 'Galaxy S24 Ultra',
        'samsung s24': 'Galaxy S24',
        
        // Google Pixel - Modelos más recientes
        'pixel 9 pro': 'Pixel 9 Pro',
        'pixel 9': 'Pixel 9',
        'pixel 8a': 'Pixel 8a',
        'pixel 8 pro': 'Pixel 8 Pro',
        'pixel 8': 'Pixel 8',
        'google pixel 9': 'Pixel 9',
        
        // Xiaomi - Modelos más recientes
        'xiaomi 14 ultra': 'Xiaomi 14 Ultra',
        'xiaomi 14': 'Xiaomi 14',
        'xiaomi 13': 'Xiaomi 13',
        'redmi note 13 pro+': 'Redmi Note 13 Pro+',
        'redmi note 13 pro': 'Redmi Note 13 Pro',
        'redmi note 13': 'Redmi Note 13',
        'redmi 12': 'Redmi 12',
        
        // OnePlus - Modelos más recientes
        'oneplus 12': 'OnePlus 12',
        'oneplus 12r': 'OnePlus 12R',
        'oneplus 11': 'OnePlus 11',
        
        // Otras marcas
        'nothing phone 2a': 'Nothing Phone 2a',
        'nothing phone 2': 'Nothing Phone 2',
        'motorola edge 50 pro': 'Motorola Edge 50 Pro',
        'motorola edge 40': 'Motorola Edge 40',
        'realme gt 6': 'Realme GT 6',
        'vivo x100 pro': 'Vivo X100 Pro',
        'vivo x100': 'Vivo X100',
        'huawei p70': 'Huawei P70',
    };
    
    // Buscar en el mapeo de nombres
    const lowerModel = normalizedModel.toLowerCase();
    if (nameMapping[lowerModel]) {
        normalizedModel = nameMapping[lowerModel];
    }
    
    // Buscar coincidencia exacta en el mapeo
    if (modelImages[normalizedModel]) {
        return modelImages[normalizedModel];
    }
    
    // Buscar coincidencia parcial (por si el nombre tiene variaciones)
    for (const [key, image] of Object.entries(modelImages)) {
        const keyLower = key.toLowerCase();
        const modelLower = normalizedModel.toLowerCase();
        
        // Buscar si el modelo contiene la clave o viceversa
        if (modelLower.includes(keyLower) || keyLower.includes(modelLower)) {
            return image;
        }
        
        // Buscar por número de modelo (ej: "15 Pro" coincide con "iPhone 15 Pro")
        const modelNumber = modelLower.match(/\d+/);
        const keyNumber = keyLower.match(/\d+/);
        if (modelNumber && keyNumber && modelNumber[0] === keyNumber[0]) {
            // Verificar que también coincida la marca
            if ((modelLower.includes('iphone') || modelLower.includes('apple')) && 
                (keyLower.includes('iphone'))) {
                return image;
            }
            if ((modelLower.includes('galaxy') || modelLower.includes('samsung')) && 
                (keyLower.includes('galaxy'))) {
                return image;
            }
        }
    }
    
    // Fallback: imagen genérica de smartphone
    return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop';
}

// Base de datos de respaldo para cuando la API falle
const fallbackPhoneDatabase = [
    // Apple iPhones - Modelos más recientes 2024-2025
    {
        id: 1,
        name: 'iPhone 16 Pro Max',
        brand: 'apple',
        storage: '512gb',
        ram: '8gb',
        camera: '48mp',
        battery: 4676,
        screen: 'large',
        os: 'ios',
        condition: 'new',
        price: 36999,
        specs: '8gb RAM • 512gb • 48mp Camera • 4676 mAh Batería.',
        image: getModelImage('iPhone 16 Pro Max'),
        fullSpecs: {
            Processor: 'Apple A18 Pro Bionic',
            Display: 'OLED 6.9" Super Retina XDR ProMotion',
            'Main Camera': '48mp Triple Camera con Zoom 5x',
            'Front Camera': '12MP TrueDepth',
            'Battery Life': '4676 mAh',
            Weight: '221g',
            Materials: 'Titanio grado 5 con vidrio Ceramic Shield'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.apple.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 2,
        name: 'iPhone 16 Pro',
        brand: 'apple',
        storage: '256gb',
        ram: '8gb',
        camera: '48mp',
        battery: 4422,
        screen: 'large',
        os: 'ios',
        condition: 'new',
        price: 29999,
        specs: '8gb RAM • 256gb • 48mp Camera • 4422 mAh Batería.',
        image: getModelImage('iPhone 16 Pro'),
        fullSpecs: {
            Processor: 'Apple A18 Pro Bionic',
            Display: 'OLED 6.3" Super Retina XDR ProMotion',
            'Main Camera': '48mp Triple Camera con Zoom 5x',
            'Front Camera': '12MP TrueDepth',
            'Battery Life': '4422 mAh',
            Weight: '199g',
            Materials: 'Titanio grado 5 con vidrio Ceramic Shield'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.apple.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 3,
        name: 'iPhone 16',
        brand: 'apple',
        storage: '128gb',
        ram: '8gb',
        camera: '48mp',
        battery: 4006,
        screen: 'medium',
        os: 'ios',
        condition: 'new',
        price: 22999,
        specs: '8gb RAM • 128gb • 48mp Camera • 4006 mAh Batería.',
        image: getModelImage('iPhone 16'),
        fullSpecs: {
            Processor: 'Apple A18 Bionic',
            Display: 'OLED 6.1" Super Retina XDR',
            'Main Camera': '48mp Dual Camera',
            'Front Camera': '12MP TrueDepth',
            'Battery Life': '4006 mAh',
            Weight: '173g',
            Materials: 'Aluminio con vidrio Ceramic Shield'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.apple.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    // Samsung Galaxy - Modelos más recientes 2024-2025
    {
        id: 4,
        name: 'Galaxy S24 Ultra',
        brand: 'samsung',
        storage: '512gb',
        ram: '12gb',
        camera: '200mp',
        battery: 5000,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 31999,
        specs: '12gb RAM • 512gb • 200mp Camera • 5000 mAh Batería.',
        image: getModelImage('Galaxy S24 Ultra'),
        fullSpecs: {
            Processor: 'Snapdragon 8 Gen 3 for Galaxy',
            Display: 'AMOLED 6.8" Dynamic AMOLED 2X 120Hz',
            'Main Camera': '200mp Quad Camera con Zoom 10x',
            'Front Camera': '12MP',
            'Battery Life': '5000 mAh',
            Weight: '233g',
            Materials: 'Titanio con vidrio Gorilla Glass Armor'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.samsung.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 5,
        name: 'Galaxy S24+',
        brand: 'samsung',
        storage: '256gb',
        ram: '12gb',
        camera: '50mp',
        battery: 4900,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 24999,
        specs: '12gb RAM • 256gb • 50mp Camera • 4900 mAh Batería.',
        image: getModelImage('Galaxy S24+'),
        fullSpecs: {
            Processor: 'Snapdragon 8 Gen 3 for Galaxy',
            Display: 'AMOLED 6.7" Dynamic AMOLED 2X 120Hz',
            'Main Camera': '50mp Triple Camera',
            'Front Camera': '12MP',
            'Battery Life': '4900 mAh',
            Weight: '197g',
            Materials: 'Aluminio con vidrio Gorilla Glass Victus 2'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.samsung.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 6,
        name: 'Galaxy S24',
        brand: 'samsung',
        storage: '256gb',
        ram: '8gb',
        camera: '50mp',
        battery: 4000,
        screen: 'medium',
        os: 'android',
        condition: 'new',
        price: 20999,
        specs: '8gb RAM • 256gb • 50mp Camera • 4000 mAh Batería.',
        image: getModelImage('Galaxy S24'),
        fullSpecs: {
            Processor: 'Snapdragon 8 Gen 3 for Galaxy',
            Display: 'AMOLED 6.2" Dynamic AMOLED 2X 120Hz',
            'Main Camera': '50mp Triple Camera',
            'Front Camera': '12MP',
            'Battery Life': '4000 mAh',
            Weight: '168g',
            Materials: 'Aluminio con vidrio Gorilla Glass Victus 2'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.samsung.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 7,
        name: 'Galaxy A55',
        brand: 'samsung',
        storage: '256gb',
        ram: '8gb',
        camera: '50mp',
        battery: 5000,
        screen: 'medium',
        os: 'android',
        condition: 'new',
        price: 13999,
        specs: '8gb RAM • 256gb • 50mp Camera • 5000 mAh Batería.',
        image: getModelImage('Galaxy A55'),
        fullSpecs: {
            Processor: 'Exynos 1480',
            Display: 'AMOLED 6.6" Super AMOLED 120Hz',
            'Main Camera': '50mp Triple Camera',
            'Front Camera': '32MP',
            'Battery Life': '5000 mAh',
            Weight: '213g',
            Materials: 'Aluminio con vidrio Gorilla Glass Victus+'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.samsung.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    // Google Pixel - Modelos más recientes 2024-2025
    {
        id: 8,
        name: 'Pixel 9 Pro',
        brand: 'google',
        storage: '512gb',
        ram: '16gb',
        camera: '50mp',
        battery: 5050,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 26999,
        specs: '16gb RAM • 512gb • 50mp Camera • 5050 mAh Batería.',
        image: getModelImage('Pixel 9 Pro'),
        fullSpecs: {
            Processor: 'Google Tensor G4',
            Display: 'OLED 6.8" LTPO Display 120Hz',
            'Main Camera': '50mp Triple Camera con IA Gemini',
            'Front Camera': '13MP Ultra Wide',
            'Battery Life': '5050 mAh',
            Weight: '213g',
            Materials: 'Aluminio reciclado con vidrio Gorilla Glass Victus'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://store.google.com', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 9,
        name: 'Pixel 9',
        brand: 'google',
        storage: '256gb',
        ram: '8gb',
        camera: '50mp',
        battery: 4614,
        screen: 'medium',
        os: 'android',
        condition: 'new',
        price: 20999,
        specs: '8gb RAM • 256gb • 50mp Camera • 4614 mAh Batería.',
        image: getModelImage('Pixel 9'),
        fullSpecs: {
            Processor: 'Google Tensor G4',
            Display: 'OLED 6.24" Actua Display 120Hz',
            'Main Camera': '50mp Dual Camera con IA Gemini',
            'Front Camera': '13MP Ultra Wide',
            'Battery Life': '4614 mAh',
            Weight: '188g',
            Materials: 'Aluminio reciclado con vidrio Gorilla Glass Victus'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://store.google.com', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 10,
        name: 'Pixel 8a',
        brand: 'google',
        storage: '128gb',
        ram: '8gb',
        camera: '64mp',
        battery: 4492,
        screen: 'medium',
        os: 'android',
        condition: 'new',
        price: 14999,
        specs: '8gb RAM • 128gb • 64mp Camera • 4492 mAh Batería.',
        image: getModelImage('Pixel 8a'),
        fullSpecs: {
            Processor: 'Google Tensor G3',
            Display: 'OLED 6.1" Actua Display 120Hz',
            'Main Camera': '64mp Dual Camera con IA',
            'Front Camera': '13MP',
            'Battery Life': '4492 mAh',
            Weight: '188g',
            Materials: 'Aluminio reciclado con vidrio Gorilla Glass 3'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://store.google.com', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    // Xiaomi - Modelos más recientes 2024-2025
    {
        id: 11,
        name: 'Xiaomi 14 Ultra',
        brand: 'xiaomi',
        storage: '512gb',
        ram: '16gb',
        camera: '50mp',
        battery: 5300,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 23999,
        specs: '16gb RAM • 512gb • 50mp Camera • 5300 mAh Batería.',
        image: getModelImage('Xiaomi 14 Ultra'),
        fullSpecs: {
            Processor: 'Snapdragon 8 Gen 3',
            Display: 'AMOLED 6.73" LTPO C8 Display 120Hz',
            'Main Camera': '50mp Leica Summilux Quad Camera',
            'Front Camera': '32MP',
            'Battery Life': '5300 mAh con carga rápida 90W',
            Weight: '224g',
            Materials: 'Titanio con vidrio Gorilla Glass Victus'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.mi.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 12,
        name: 'Xiaomi 14',
        brand: 'xiaomi',
        storage: '256gb',
        ram: '12gb',
        camera: '50mp',
        battery: 4610,
        screen: 'medium',
        os: 'android',
        condition: 'new',
        price: 18999,
        specs: '12gb RAM • 256gb • 50mp Camera • 4610 mAh Batería.',
        image: getModelImage('Xiaomi 14'),
        fullSpecs: {
            Processor: 'Snapdragon 8 Gen 3',
            Display: 'AMOLED 6.36" LTPO C8 Display 120Hz',
            'Main Camera': '50mp Leica Triple Camera',
            'Front Camera': '32MP',
            'Battery Life': '4610 mAh con carga rápida 90W',
            Weight: '193g',
            Materials: 'Aluminio con vidrio Gorilla Glass Victus'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.mi.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 13,
        name: 'Redmi Note 13 Pro+',
        brand: 'xiaomi',
        storage: '512gb',
        ram: '12gb',
        camera: '200mp',
        battery: 5000,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 12999,
        specs: '12gb RAM • 512gb • 200mp Camera • 5000 mAh Batería.',
        image: getModelImage('Redmi Note 13 Pro+'),
        fullSpecs: {
            Processor: 'MediaTek Dimensity 7200 Ultra',
            Display: 'AMOLED 6.67" Display 120Hz',
            'Main Camera': '200mp Triple Camera',
            'Front Camera': '16MP',
            'Battery Life': '5000 mAh con carga rápida 120W',
            Weight: '199g',
            Materials: 'Vidrio con marco de aluminio'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.mi.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    // OnePlus - Modelos más recientes 2024-2025
    {
        id: 14,
        name: 'OnePlus 12',
        brand: 'oneplus',
        storage: '512gb',
        ram: '16gb',
        camera: '50mp',
        battery: 5400,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 24999,
        specs: '16gb RAM • 512gb • 50mp Camera • 5400 mAh Batería.',
        image: getModelImage('OnePlus 12'),
        fullSpecs: {
            Processor: 'Snapdragon 8 Gen 3',
            Display: 'AMOLED 6.82" LTPO ProXDR Display 120Hz',
            'Main Camera': '50mp Hasselblad Triple Camera',
            'Front Camera': '32MP',
            'Battery Life': '5400 mAh con carga rápida 100W',
            Weight: '220g',
            Materials: 'Aluminio con vidrio Gorilla Glass Victus 2'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.oneplus.com', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 15,
        name: 'OnePlus 12R',
        brand: 'oneplus',
        storage: '256gb',
        ram: '12gb',
        camera: '50mp',
        battery: 5500,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 18999,
        specs: '12gb RAM • 256gb • 50mp Camera • 5500 mAh Batería.',
        image: getModelImage('OnePlus 12R'),
        fullSpecs: {
            Processor: 'Snapdragon 8 Gen 2',
            Display: 'AMOLED 6.78" ProXDR Display 120Hz',
            'Main Camera': '50mp Triple Camera',
            'Front Camera': '16MP',
            'Battery Life': '5500 mAh con carga rápida 100W',
            Weight: '207g',
            Materials: 'Aluminio con vidrio Gorilla Glass Victus 2'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.oneplus.com', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    // Más modelos recientes de otras marcas 2024-2025
    {
        id: 16,
        name: 'iPhone 15 Pro Max',
        brand: 'apple',
        storage: '1tb',
        ram: '8gb',
        camera: '48mp',
        battery: 4441,
        screen: 'large',
        os: 'ios',
        condition: 'new',
        price: 33999,
        specs: '8gb RAM • 1tb • 48mp Camera • 4441 mAh Batería.',
        image: getModelImage('iPhone 15 Pro Max'),
        fullSpecs: {
            Processor: 'Apple A17 Pro Bionic',
            Display: 'OLED 6.7" Super Retina XDR ProMotion',
            'Main Camera': '48mp Triple Camera con Zoom 5x',
            'Front Camera': '12MP TrueDepth',
            'Battery Life': '4441 mAh',
            Weight: '221g',
            Materials: 'Titanio grado 5 con vidrio Ceramic Shield'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.apple.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 17,
        name: 'Nothing Phone 2a',
        brand: 'nothing',
        storage: '256gb',
        ram: '12gb',
        camera: '50mp',
        battery: 5000,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 12999,
        specs: '12gb RAM • 256gb • 50mp Camera • 5000 mAh Batería.',
        image: getModelImage('Nothing Phone 2a'),
        fullSpecs: {
            Processor: 'MediaTek Dimensity 7200 Pro',
            Display: 'AMOLED 6.7" LTPO Display 120Hz',
            'Main Camera': '50mp Dual Camera',
            'Front Camera': '32MP',
            'Battery Life': '5000 mAh con carga rápida 45W',
            Weight: '190g',
            Materials: 'Vidrio con marco de plástico reciclado'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://nothing.tech', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 18,
        name: 'Motorola Edge 50 Pro',
        brand: 'motorola',
        storage: '512gb',
        ram: '12gb',
        camera: '50mp',
        battery: 4500,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 16999,
        specs: '12gb RAM • 512gb • 50mp Camera • 4500 mAh Batería.',
        image: getModelImage('Motorola Edge 50 Pro'),
        fullSpecs: {
            Processor: 'Snapdragon 7 Gen 3',
            Display: 'pOLED 6.7" Display 144Hz',
            'Main Camera': '50mp Triple Camera con OIS',
            'Front Camera': '60MP',
            'Battery Life': '4500 mAh con carga rápida 125W',
            Weight: '199g',
            Materials: 'Vidrio con marco de aluminio'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.motorola.com.mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 19,
        name: 'Realme GT 6',
        brand: 'realme',
        storage: '512gb',
        ram: '16gb',
        camera: '50mp',
        battery: 5500,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 17999,
        specs: '16gb RAM • 512gb • 50mp Camera • 5500 mAh Batería.',
        image: getModelImage('Realme GT 6'),
        fullSpecs: {
            Processor: 'Snapdragon 8s Gen 3',
            Display: 'AMOLED 6.78" Display 120Hz',
            'Main Camera': '50mp Triple Camera con OIS',
            'Front Camera': '32MP',
            'Battery Life': '5500 mAh con carga rápida 120W',
            Weight: '199g',
            Materials: 'Vidrio con marco de aluminio'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.realme.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 20,
        name: 'Vivo X100 Pro',
        brand: 'vivo',
        storage: '512gb',
        ram: '16gb',
        camera: '50mp',
        battery: 5400,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 21999,
        specs: '16gb RAM • 512gb • 50mp Camera • 5400 mAh Batería.',
        image: getModelImage('Vivo X100 Pro'),
        fullSpecs: {
            Processor: 'MediaTek Dimensity 9300',
            Display: 'AMOLED 6.78" LTPO Display 120Hz',
            'Main Camera': '50mp Zeiss Triple Camera con Zoom 4.3x',
            'Front Camera': '32MP',
            'Battery Life': '5400 mAh con carga rápida 100W',
            Weight: '221g',
            Materials: 'Vidrio con marco de aluminio'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.vivo.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 21,
        name: 'Huawei P70',
        brand: 'huawei',
        storage: '512gb',
        ram: '12gb',
        camera: '50mp',
        battery: 5050,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 19999,
        specs: '12gb RAM • 512gb • 50mp Camera • 5050 mAh Batería.',
        image: getModelImage('Huawei P70'),
        fullSpecs: {
            Processor: 'Kirin 9010',
            Display: 'OLED 6.8" Display 120Hz',
            'Main Camera': '50mp Triple Camera Leica',
            'Front Camera': '13MP',
            'Battery Life': '5050 mAh con carga rápida 88W',
            Weight: '207g',
            Materials: 'Vidrio con marco de aluminio'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://consumer.huawei.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 22,
        name: 'iPhone 15',
        brand: 'apple',
        storage: '256gb',
        ram: '8gb',
        camera: '48mp',
        battery: 3877,
        screen: 'medium',
        os: 'ios',
        condition: 'new',
        price: 21999,
        specs: '8gb RAM • 256gb • 48mp Camera • 3877 mAh Batería.',
        image: getModelImage('iPhone 15'),
        fullSpecs: {
            Processor: 'Apple A16 Bionic',
            Display: 'OLED 6.1" Super Retina XDR',
            'Main Camera': '48mp Dual Camera',
            'Front Camera': '12MP TrueDepth',
            'Battery Life': '3877 mAh',
            Weight: '171g',
            Materials: 'Aluminio con vidrio Ceramic Shield'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.apple.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 23,
        name: 'Galaxy S23',
        brand: 'samsung',
        storage: '256gb',
        ram: '8gb',
        camera: '50mp',
        battery: 3900,
        screen: 'medium',
        os: 'android',
        condition: 'new',
        price: 18999,
        specs: '8gb RAM • 256gb • 50mp Camera • 3900 mAh Batería.',
        image: getModelImage('Galaxy S23'),
        fullSpecs: {
            Processor: 'Snapdragon 8 Gen 2 for Galaxy',
            Display: 'AMOLED 6.1" Dynamic AMOLED 2X 120Hz',
            'Main Camera': '50mp Triple Camera',
            'Front Camera': '12MP',
            'Battery Life': '3900 mAh',
            Weight: '168g',
            Materials: 'Aluminio con vidrio Gorilla Glass Victus 2'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.samsung.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 24,
        name: 'Pixel 8 Pro',
        brand: 'google',
        storage: '256gb',
        ram: '12gb',
        camera: '50mp',
        battery: 5050,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 23999,
        specs: '12gb RAM • 256gb • 50mp Camera • 5050 mAh Batería.',
        image: getModelImage('Pixel 8 Pro'),
        fullSpecs: {
            Processor: 'Google Tensor G3',
            Display: 'OLED 6.7" LTPO Display 120Hz',
            'Main Camera': '50mp Triple Camera con IA',
            'Front Camera': '10.5MP',
            'Battery Life': '5050 mAh',
            Weight: '213g',
            Materials: 'Aluminio reciclado con vidrio Gorilla Glass Victus'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://store.google.com', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 25,
        name: 'Redmi Note 13 Pro',
        brand: 'xiaomi',
        storage: '256gb',
        ram: '12gb',
        camera: '200mp',
        battery: 5100,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 10999,
        specs: '12gb RAM • 256gb • 200mp Camera • 5100 mAh Batería.',
        image: getModelImage('Redmi Note 13 Pro'),
        fullSpecs: {
            Processor: 'Snapdragon 7s Gen 2',
            Display: 'AMOLED 6.67" Display 120Hz',
            'Main Camera': '200mp Triple Camera',
            'Front Camera': '16MP',
            'Battery Life': '5100 mAh con carga rápida 67W',
            Weight: '199g',
            Materials: 'Vidrio con marco de plástico'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.mi.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 26,
        name: 'Nothing Phone 2',
        brand: 'nothing',
        storage: '512gb',
        ram: '12gb',
        camera: '50mp',
        battery: 4700,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 16999,
        specs: '12gb RAM • 512gb • 50mp Camera • 4700 mAh Batería.',
        image: getModelImage('Nothing Phone 2'),
        fullSpecs: {
            Processor: 'Snapdragon 8+ Gen 1',
            Display: 'AMOLED 6.7" LTPO Display 120Hz',
            'Main Camera': '50mp Dual Camera',
            'Front Camera': '32MP',
            'Battery Life': '4700 mAh con carga rápida 45W',
            Weight: '201g',
            Materials: 'Vidrio con marco de aluminio'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://nothing.tech', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 27,
        name: 'Motorola Edge 40',
        brand: 'motorola',
        storage: '256gb',
        ram: '8gb',
        camera: '50mp',
        battery: 4400,
        screen: 'medium',
        os: 'android',
        condition: 'new',
        price: 12999,
        specs: '8gb RAM • 256gb • 50mp Camera • 4400 mAh Batería.',
        image: getModelImage('Motorola Edge 40'),
        fullSpecs: {
            Processor: 'MediaTek Dimensity 8020',
            Display: 'pOLED 6.55" Display 144Hz',
            'Main Camera': '50mp Dual Camera con OIS',
            'Front Camera': '32MP',
            'Battery Life': '4400 mAh con carga rápida 68W',
            Weight: '171g',
            Materials: 'Vidrio con marco de aluminio'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.motorola.com.mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 28,
        name: 'Vivo X100',
        brand: 'vivo',
        storage: '256gb',
        ram: '12gb',
        camera: '50mp',
        battery: 5000,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 19999,
        specs: '12gb RAM • 256gb • 50mp Camera • 5000 mAh Batería.',
        image: getModelImage('Vivo X100'),
        fullSpecs: {
            Processor: 'MediaTek Dimensity 9300',
            Display: 'AMOLED 6.78" LTPO Display 120Hz',
            'Main Camera': '50mp Zeiss Triple Camera',
            'Front Camera': '32MP',
            'Battery Life': '5000 mAh con carga rápida 120W',
            Weight: '206g',
            Materials: 'Vidrio con marco de aluminio'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.vivo.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 29,
        name: 'OnePlus 11',
        brand: 'oneplus',
        storage: '256gb',
        ram: '16gb',
        camera: '50mp',
        battery: 5000,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 20999,
        specs: '16gb RAM • 256gb • 50mp Camera • 5000 mAh Batería.',
        image: getModelImage('OnePlus 11'),
        fullSpecs: {
            Processor: 'Snapdragon 8 Gen 2',
            Display: 'AMOLED 6.7" LTPO Display 120Hz',
            'Main Camera': '50mp Hasselblad Triple Camera',
            'Front Camera': '16MP',
            'Battery Life': '5000 mAh con carga rápida 100W',
            Weight: '205g',
            Materials: 'Aluminio con vidrio Gorilla Glass Victus'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.oneplus.com', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 30,
        name: 'Galaxy A54',
        brand: 'samsung',
        storage: '256gb',
        ram: '8gb',
        camera: '50mp',
        battery: 5000,
        screen: 'medium',
        os: 'android',
        condition: 'new',
        price: 11999,
        specs: '8gb RAM • 256gb • 50mp Camera • 5000 mAh Batería.',
        image: getModelImage('Galaxy A54'),
        fullSpecs: {
            Processor: 'Exynos 1380',
            Display: 'AMOLED 6.4" Super AMOLED 120Hz',
            'Main Camera': '50mp Triple Camera',
            'Front Camera': '32MP',
            'Battery Life': '5000 mAh',
            Weight: '202g',
            Materials: 'Vidrio con marco de aluminio'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.samsung.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 31,
        name: 'Xiaomi 13',
        brand: 'xiaomi',
        storage: '256gb',
        ram: '12gb',
        camera: '50mp',
        battery: 4500,
        screen: 'medium',
        os: 'android',
        condition: 'new',
        price: 16999,
        specs: '12gb RAM • 256gb • 50mp Camera • 4500 mAh Batería.',
        image: getModelImage('Xiaomi 13'),
        fullSpecs: {
            Processor: 'Snapdragon 8 Gen 2',
            Display: 'AMOLED 6.36" Display 120Hz',
            'Main Camera': '50mp Leica Triple Camera',
            'Front Camera': '32MP',
            'Battery Life': '4500 mAh con carga rápida 67W',
            Weight: '185g',
            Materials: 'Aluminio con vidrio Gorilla Glass 5'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.mi.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 32,
        name: 'Pixel 8',
        brand: 'google',
        storage: '256gb',
        ram: '8gb',
        camera: '50mp',
        battery: 4575,
        screen: 'medium',
        os: 'android',
        condition: 'new',
        price: 18999,
        specs: '8gb RAM • 256gb • 50mp Camera • 4575 mAh Batería.',
        image: getModelImage('Pixel 8'),
        fullSpecs: {
            Processor: 'Google Tensor G3',
            Display: 'OLED 6.2" Actua Display 120Hz',
            'Main Camera': '50mp Dual Camera con IA',
            'Front Camera': '10.5MP',
            'Battery Life': '4575 mAh',
            Weight: '187g',
            Materials: 'Aluminio reciclado con vidrio Gorilla Glass Victus'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://store.google.com', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 33,
        name: 'iPhone 14 Pro',
        brand: 'apple',
        storage: '256gb',
        ram: '6gb',
        camera: '48mp',
        battery: 3200,
        screen: 'medium',
        os: 'ios',
        condition: 'refurbished',
        price: 19999,
        specs: '6gb RAM • 256gb • 48mp Camera • 3200 mAh Batería.',
        image: getModelImage('iPhone 14 Pro'),
        fullSpecs: {
            Processor: 'Apple A16 Bionic',
            Display: 'OLED 6.1" Super Retina XDR ProMotion',
            'Main Camera': '48mp Triple Camera',
            'Front Camera': '12MP TrueDepth',
            'Battery Life': '3200 mAh',
            Weight: '206g',
            Materials: 'Acero inoxidable con vidrio Ceramic Shield'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.apple.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 34,
        name: 'Galaxy A34',
        brand: 'samsung',
        storage: '128gb',
        ram: '8gb',
        camera: '48mp',
        battery: 5000,
        screen: 'medium',
        os: 'android',
        condition: 'new',
        price: 9499,
        specs: '8gb RAM • 128gb • 48mp Camera • 5000 mAh Batería.',
        image: getModelImage('Galaxy A34'),
        fullSpecs: {
            Processor: 'MediaTek Dimensity 1080',
            Display: 'AMOLED 6.6" Super AMOLED 120Hz',
            'Main Camera': '48mp Triple Camera',
            'Front Camera': '13MP',
            'Battery Life': '5000 mAh',
            Weight: '199g',
            Materials: 'Vidrio con marco de plástico'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.samsung.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 35,
        name: 'Redmi 12',
        brand: 'xiaomi',
        storage: '128gb',
        ram: '8gb',
        camera: '50mp',
        battery: 5000,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 6499,
        specs: '8gb RAM • 128gb • 50mp Camera • 5000 mAh Batería.',
        image: getModelImage('Redmi 12'),
        fullSpecs: {
            Processor: 'MediaTek Helio G88',
            Display: 'IPS LCD 6.79" Display 90Hz',
            'Main Camera': '50mp Dual Camera',
            'Front Camera': '8MP',
            'Battery Life': '5000 mAh',
            Weight: '198g',
            Materials: 'Plástico con vidrio'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.mi.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    }
];

// Función para obtener datos de respaldo con información adicional
function getFallbackPhoneData() {
    return fallbackPhoneDatabase.map(phone => ({
        ...phone,
        // Agregar campos adicionales para compatibilidad
        screenSize: phone.screen === 'small' ? 5.8 : phone.screen === 'medium' ? 6.1 : 6.7,
        weight: phone.fullSpecs?.Weight ? parseInt(phone.fullSpecs.Weight) : 180,
        // Agregar timestamp para cache
        lastUpdated: new Date().toISOString(),
        // Agregar fuente
        source: 'fallback-database'
    }));
}

// Función para buscar en la base de datos de respaldo
function searchFallbackDatabase(query, filters = {}) {
    let results = getFallbackPhoneData();
    
    // Aplicar filtros
    if (filters.brand) {
        results = results.filter(phone => 
            phone.brand.toLowerCase().includes(filters.brand.toLowerCase())
        );
    }
    
    if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        results = results.filter(phone => phone.price >= min && phone.price <= max);
    }
    
    if (filters.os) {
        results = results.filter(phone => phone.os === filters.os);
    }
    
    if (filters.screen) {
        results = results.filter(phone => phone.screen === filters.screen);
    }
    
    // Aplicar búsqueda por texto
    if (query) {
        const searchTerm = query.toLowerCase();
        results = results.filter(phone => 
            phone.name.toLowerCase().includes(searchTerm) ||
            phone.brand.toLowerCase().includes(searchTerm) ||
            phone.specs.toLowerCase().includes(searchTerm)
        );
    }
    
    return results;
}

// Función para obtener estadísticas de la base de datos
function getFallbackDatabaseStats() {
    const data = getFallbackPhoneData();
    const brands = [...new Set(data.map(phone => phone.brand))];
    const priceRanges = {
        low: data.filter(p => p.price < 10000).length,
        medium: data.filter(p => p.price >= 10000 && p.price < 20000).length,
        high: data.filter(p => p.price >= 20000).length
    };
    
    return {
        totalPhones: data.length,
        brands: brands.length,
        averagePrice: Math.round(data.reduce((sum, phone) => sum + phone.price, 0) / data.length),
        priceRanges,
        lastUpdated: new Date().toISOString()
    };
}

// Hacer la base de datos y funciones disponibles globalmente
window.fallbackPhoneDatabase = fallbackPhoneDatabase;
window.getFallbackPhoneData = getFallbackPhoneData;
window.searchFallbackDatabase = searchFallbackDatabase;
window.getFallbackDatabaseStats = getFallbackDatabaseStats;
window.getModelImage = getModelImage;
window.modelImages = modelImages;

