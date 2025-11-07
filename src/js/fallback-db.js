// Mapeo directo de cada modelo a su imagen original específica
// Imágenes descargadas y almacenadas localmente en src/images/phones/
const modelImages = {
    // Apple - iPhone (imágenes locales descargadas)
    'iPhone 15 Pro': 'src/images/phones/iphone-15-pro.jpg',
    'iPhone 15': 'src/images/phones/iphone-15.jpg',
    'iPhone 14 Pro': 'src/images/phones/iphone-14-pro.jpg',
    'iPhone 14': 'src/images/phones/iphone-14.jpg',
    
    // Samsung - Galaxy (imágenes locales descargadas)
    'Galaxy S24': 'src/images/phones/galaxy-s24.jpg',
    'Galaxy S23': 'src/images/phones/galaxy-s23.jpg',
    'Galaxy A54': 'src/images/phones/galaxy-a54.jpg',
    'Galaxy A34': 'src/images/phones/galaxy-a34.jpg',
    
    // Google
    'Pixel 8 Pro': 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&h=400&fit=crop',
    'Pixel 8': 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
    'Pixel 7 Pro': 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=400&h=400&fit=crop',
    'Pixel 7': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    
    // Xiaomi
    'Xiaomi 14': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
    'Xiaomi 13': 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop',
    'Redmi Note 13': 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&h=400&fit=crop',
    'Redmi 12': 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
    
    // OnePlus
    'OnePlus 12': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    'OnePlus 11': 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
    'OnePlus 10T': 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=400&h=400&fit=crop',
    'OnePlus Nord': 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
    
    // Otras marcas
    'Huawei P60': 'https://images.unsplash.com/photo-1592286927505-2fd0908938ef?w=400&h=400&fit=crop',
    'Motorola Edge': 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=400&fit=crop',
    'Nothing Phone': 'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=400&h=400&fit=crop',
    'Realme GT': 'https://images.unsplash.com/photo-1632661674711-e12e4d09fc88?w=400&h=400&fit=crop',
    'Vivo X100': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop'
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
        // Apple
        'apple 15 pro': 'iPhone 15 Pro',
        'apple 15 lite': 'iPhone 15',
        'apple 15': 'iPhone 15',
        'apple 14 pro': 'iPhone 14 Pro',
        'apple 14': 'iPhone 14',
        'iphone 15 pro': 'iPhone 15 Pro',
        'iphone 15': 'iPhone 15',
        'iphone 14 pro': 'iPhone 14 Pro',
        'iphone 14': 'iPhone 14',
        
        // Samsung
        'samsung 16 pro': 'Galaxy S24',
        'samsung 17 lite': 'Galaxy S23',
        'samsung 16 lite': 'Galaxy A54',
        'samsung 19 pro': 'Galaxy A34',
        'galaxy s24': 'Galaxy S24',
        'galaxy s23': 'Galaxy S23',
        'galaxy a54': 'Galaxy A54',
        'galaxy a34': 'Galaxy A34',
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
    // Apple iPhones
    {
        id: 1,
        name: 'Apple 15 Pro',
        brand: 'apple',
        storage: '256gb',
        ram: '8gb',
        camera: '48mp',
        battery: 4422,
        screen: 'large',
        os: 'ios',
        condition: 'new',
        price: 24999,
        specs: '8gb RAM • 256gb • 48mp Camera • 4422 mAh Batería.',
        image: getModelImage('iPhone 15 Pro'),
        fullSpecs: {
            Processor: 'Apple A17 Pro Bionic',
            Display: 'OLED 6.1" Super Retina XDR',
            'Main Camera': '48mp Triple Camera',
            'Front Camera': '12MP TrueDepth',
            'Battery Life': '4422 mAh',
            Weight: '187g',
            Materials: 'Titanio con vidrio reforzado'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.apple.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 2,
        name: 'Apple 15 Lite',
        brand: 'apple',
        storage: '128gb',
        ram: '8gb',
        camera: '48mp',
        battery: 3877,
        screen: 'medium',
        os: 'ios',
        condition: 'new',
        price: 19999,
        specs: '8gb RAM • 128gb • 48mp Camera • 3877 mAh Batería.',
        image: getModelImage('iPhone 15'),
        fullSpecs: {
            Processor: 'Apple A16 Bionic',
            Display: 'OLED 6.1" Super Retina',
            'Main Camera': '48mp Dual Camera',
            'Front Camera': '12MP',
            'Battery Life': '3877 mAh',
            Weight: '171g',
            Materials: 'Aluminio con vidrio reforzado'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.apple.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    // Samsung Galaxy
    {
        id: 3,
        name: 'Samsung 16 Pro',
        brand: 'samsung',
        storage: '512gb',
        ram: '12gb',
        camera: '64mp',
        battery: 5200,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 22999,
        specs: '12gb RAM • 512gb • 64mp Camera • 5200 mAh Batería.',
        image: getModelImage('Galaxy S24'),
        fullSpecs: {
            Processor: 'Snapdragon 8 Gen 3',
            Display: 'AMOLED 6.8" Dynamic AMOLED 2X',
            'Main Camera': '64mp Quad Camera',
            'Front Camera': '12MP',
            'Battery Life': '5200 mAh',
            Weight: '195g',
            Materials: 'Aluminio con vidrio Gorilla Glass Victus'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.samsung.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 4,
        name: 'Samsung 17 Lite',
        brand: 'samsung',
        storage: '256gb',
        ram: '8gb',
        camera: '50mp',
        battery: 4800,
        screen: 'medium',
        os: 'android',
        condition: 'new',
        price: 17999,
        specs: '8gb RAM • 256gb • 50mp Camera • 4800 mAh Batería.',
        image: getModelImage('Galaxy S23'),
        fullSpecs: {
            Processor: 'Snapdragon 8 Gen 2',
            Display: 'AMOLED 6.6" Dynamic AMOLED',
            'Main Camera': '50mp Triple Camera',
            'Front Camera': '12MP',
            'Battery Life': '4800 mAh',
            Weight: '178g',
            Materials: 'Aluminio con vidrio Gorilla Glass'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.samsung.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    // Google Pixel
    {
        id: 5,
        name: 'Google 18 Pro',
        brand: 'google',
        storage: '256gb',
        ram: '12gb',
        camera: '50mp',
        battery: 5050,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 21999,
        specs: '12gb RAM • 256gb • 50mp Camera • 5050 mAh Batería.',
        image: getModelImage('Pixel 8 Pro'),
        fullSpecs: {
            Processor: 'Google Tensor G3',
            Display: 'OLED 6.7" LTPO Display',
            'Main Camera': '50mp Triple Camera con IA',
            'Front Camera': '12MP',
            'Battery Life': '5050 mAh',
            Weight: '213g',
            Materials: 'Aluminio reciclado con vidrio Gorilla Glass'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://store.google.com', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 6,
        name: 'Google 19 Lite',
        brand: 'google',
        storage: '128gb',
        ram: '8gb',
        camera: '50mp',
        battery: 4575,
        screen: 'medium',
        os: 'android',
        condition: 'new',
        price: 15999,
        specs: '8gb RAM • 128gb • 50mp Camera • 4575 mAh Batería.',
        image: getModelImage('Pixel 8'),
        fullSpecs: {
            Processor: 'Google Tensor G3',
            Display: 'OLED 6.2" Display',
            'Main Camera': '50mp Dual Camera con IA',
            'Front Camera': '12MP',
            'Battery Life': '4575 mAh',
            Weight: '187g',
            Materials: 'Aluminio reciclado con vidrio Gorilla Glass'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://store.google.com', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    // Xiaomi
    {
        id: 7,
        name: 'Xiaomi 20 Pro',
        brand: 'xiaomi',
        storage: '512gb',
        ram: '16gb',
        camera: '64mp',
        battery: 5500,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 18999,
        specs: '16gb RAM • 512gb • 64mp Camera • 5500 mAh Batería.',
        image: getModelImage('Xiaomi 14'),
        fullSpecs: {
            Processor: 'Snapdragon 8 Gen 3',
            Display: 'AMOLED 6.73" LTPO Display',
            'Main Camera': '64mp Leica Camera',
            'Front Camera': '12MP',
            'Battery Life': '5500 mAh',
            Weight: '219g',
            Materials: 'Aluminio con vidrio Gorilla Glass'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.mi.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 8,
        name: 'Xiaomi 21 Lite',
        brand: 'xiaomi',
        storage: '256gb',
        ram: '8gb',
        camera: '48mp',
        battery: 5000,
        screen: 'medium',
        os: 'android',
        condition: 'new',
        price: 12999,
        specs: '8gb RAM • 256gb • 48mp Camera • 5000 mAh Batería.',
        image: getModelImage('Xiaomi 13'),
        fullSpecs: {
            Processor: 'Snapdragon 7 Gen 2',
            Display: 'AMOLED 6.67" Display',
            'Main Camera': '48mp Triple Camera',
            'Front Camera': '12MP',
            'Battery Life': '5000 mAh',
            Weight: '189g',
            Materials: 'Plástico premium con vidrio reforzado'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.mi.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    // OnePlus
    {
        id: 9,
        name: 'Oneplus 22 Pro',
        brand: 'oneplus',
        storage: '512gb',
        ram: '16gb',
        camera: '50mp',
        battery: 5400,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 20999,
        specs: '16gb RAM • 512gb • 50mp Camera • 5400 mAh Batería.',
        image: getModelImage('OnePlus 12'),
        fullSpecs: {
            Processor: 'Snapdragon 8 Gen 3',
            Display: 'AMOLED 6.82" LTPO Display 120Hz',
            'Main Camera': '50mp Hasselblad Camera',
            'Front Camera': '12MP',
            'Battery Life': '5400 mAh',
            Weight: '220g',
            Materials: 'Aluminio con vidrio Gorilla Glass'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.oneplus.com', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 10,
        name: 'Oneplus 15 Lite',
        brand: 'oneplus',
        storage: '256gb',
        ram: '12gb',
        camera: '48mp',
        battery: 4800,
        screen: 'medium',
        os: 'android',
        condition: 'new',
        price: 14999,
        specs: '12gb RAM • 256gb • 48mp Camera • 4800 mAh Batería.',
        image: getModelImage('OnePlus 11'),
        fullSpecs: {
            Processor: 'Snapdragon 8 Gen 2',
            Display: 'AMOLED 6.7" Display 120Hz',
            'Main Camera': '48mp Hasselblad Camera',
            'Front Camera': '12MP',
            'Battery Life': '4800 mAh',
            Weight: '205g',
            Materials: 'Aluminio con vidrio Gorilla Glass'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.oneplus.com', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    // Más teléfonos para completar 20
    {
        id: 11,
        name: 'Apple 17 Pro',
        brand: 'apple',
        storage: '512gb',
        ram: '8gb',
        camera: '48mp',
        battery: 4422,
        screen: 'large',
        os: 'ios',
        condition: 'refurbished',
        price: 21999,
        specs: '8gb RAM • 512gb • 48mp Camera • 4422 mAh Batería.',
        image: getModelImage('iPhone 14 Pro'),
        fullSpecs: {
            Processor: 'Apple A16 Bionic',
            Display: 'OLED 6.1" Super Retina XDR',
            'Main Camera': '48mp Triple Camera',
            'Front Camera': '12MP',
            'Battery Life': '4422 mAh',
            Weight: '206g',
            Materials: 'Acero inoxidable con vidrio reforzado'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.apple.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 12,
        name: 'Samsung 16 Lite',
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
        image: getModelImage('Galaxy A54'),
        fullSpecs: {
            Processor: 'Exynos 1380',
            Display: 'AMOLED 6.4" Display',
            'Main Camera': '50mp Triple Camera',
            'Front Camera': '12MP',
            'Battery Life': '5000 mAh',
            Weight: '202g',
            Materials: 'Plástico reforzado con vidrio Gorilla Glass'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.samsung.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 13,
        name: 'Google 18 Lite',
        brand: 'google',
        storage: '128gb',
        ram: '8gb',
        camera: '48mp',
        battery: 4385,
        screen: 'small',
        os: 'android',
        condition: 'new',
        price: 13499,
        specs: '8gb RAM • 128gb • 48mp Camera • 4385 mAh Batería.',
        image: getModelImage('Pixel 7 Pro'),
        fullSpecs: {
            Processor: 'Google Tensor G2',
            Display: 'OLED 6.3" Display',
            'Main Camera': '48mp Triple Camera con IA',
            'Front Camera': '12MP',
            'Battery Life': '4385 mAh',
            Weight: '197g',
            Materials: 'Aluminio reciclado con vidrio'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://store.google.com', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 14,
        name: 'Xiaomi 20 Lite',
        brand: 'xiaomi',
        storage: '256gb',
        ram: '12gb',
        camera: '64mp',
        battery: 5200,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 8999,
        specs: '12gb RAM • 256gb • 64mp Camera • 5200 mAh Batería.',
        image: getModelImage('Redmi Note 13'),
        fullSpecs: {
            Processor: 'MediaTek Dimensity 7200',
            Display: 'AMOLED 6.67" Display',
            'Main Camera': '64mp Triple Camera',
            'Front Camera': '12MP',
            'Battery Life': '5200 mAh',
            Weight: '188g',
            Materials: 'Plástico premium'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.mi.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 15,
        name: 'Oneplus 22 Lite',
        brand: 'oneplus',
        storage: '256gb',
        ram: '8gb',
        camera: '50mp',
        battery: 5000,
        screen: 'medium',
        os: 'android',
        condition: 'new',
        price: 12999,
        specs: '8gb RAM • 256gb • 50mp Camera • 5000 mAh Batería.',
        image: getModelImage('OnePlus 10T'),
        fullSpecs: {
            Processor: 'Snapdragon 8+ Gen 1',
            Display: 'AMOLED 6.7" Display 120Hz',
            'Main Camera': '50mp Triple Camera',
            'Front Camera': '12MP',
            'Battery Life': '5000 mAh',
            Weight: '203g',
            Materials: 'Aluminio con vidrio'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.oneplus.com', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 16,
        name: 'Apple 15 Pro',
        brand: 'apple',
        storage: '128gb',
        ram: '8gb',
        camera: '48mp',
        battery: 3279,
        screen: 'small',
        os: 'ios',
        condition: 'refurbished',
        price: 18999,
        specs: '8gb RAM • 128gb • 48mp Camera • 3279 mAh Batería.',
        image: getModelImage('iPhone 14'),
        fullSpecs: {
            Processor: 'Apple A15 Bionic',
            Display: 'OLED 6.1" Super Retina',
            'Main Camera': '48mp Dual Camera',
            'Front Camera': '12MP',
            'Battery Life': '3279 mAh',
            Weight: '172g',
            Materials: 'Aluminio con vidrio'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.apple.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 17,
        name: 'Samsung 19 Pro',
        brand: 'samsung',
        storage: '128gb',
        ram: '8gb',
        camera: '50mp',
        battery: 4500,
        screen: 'small',
        os: 'android',
        condition: 'refurbished',
        price: 11999,
        specs: '8gb RAM • 128gb • 50mp Camera • 4500 mAh Batería.',
        image: getModelImage('Galaxy A34'),
        fullSpecs: {
            Processor: 'MediaTek Dimensity 1080',
            Display: 'AMOLED 6.6" Display',
            'Main Camera': '50mp Triple Camera',
            'Front Camera': '12MP',
            'Battery Life': '4500 mAh',
            Weight: '199g',
            Materials: 'Plástico con vidrio'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.samsung.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 18,
        name: 'Google 21 Pro',
        brand: 'google',
        storage: '256gb',
        ram: '8gb',
        camera: '50mp',
        battery: 4614,
        screen: 'medium',
        os: 'android',
        condition: 'new',
        price: 14499,
        specs: '8gb RAM • 256gb • 50mp Camera • 4614 mAh Batería.',
        image: getModelImage('Pixel 7'),
        fullSpecs: {
            Processor: 'Google Tensor G2',
            Display: 'OLED 6.3" Display',
            'Main Camera': '50mp Dual Camera con IA',
            'Front Camera': '12MP',
            'Battery Life': '4614 mAh',
            Weight: '197g',
            Materials: 'Aluminio reciclado'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://store.google.com', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 19,
        name: 'Xiaomi 17 Pro',
        brand: 'xiaomi',
        storage: '128gb',
        ram: '8gb',
        camera: '50mp',
        battery: 5000,
        screen: 'medium',
        os: 'android',
        condition: 'new',
        price: 6999,
        specs: '8gb RAM • 128gb • 50mp Camera • 5000 mAh Batería.',
        image: getModelImage('Redmi 12'),
        fullSpecs: {
            Processor: 'MediaTek Helio G88',
            Display: 'IPS LCD 6.79" Display',
            'Main Camera': '50mp Dual Camera',
            'Front Camera': '12MP',
            'Battery Life': '5000 mAh',
            Weight: '198g',
            Materials: 'Plástico'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.mi.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 20,
        name: 'Oneplus 15 Pro',
        brand: 'oneplus',
        storage: '128gb',
        ram: '8gb',
        camera: '50mp',
        battery: 4500,
        screen: 'medium',
        os: 'android',
        condition: 'refurbished',
        price: 10999,
        specs: '8gb RAM • 128gb • 50mp Camera • 4500 mAh Batería.',
        image: getModelImage('OnePlus Nord'),
        fullSpecs: {
            Processor: 'MediaTek Dimensity 9000',
            Display: 'AMOLED 6.59" Display 120Hz',
            'Main Camera': '50mp Triple Camera',
            'Front Camera': '12MP',
            'Battery Life': '4500 mAh',
            Weight: '195g',
            Materials: 'Plástico premium con vidrio'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.oneplus.com', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    // Teléfonos adicionales para mayor variedad
    {
        id: 21,
        name: 'Huawei P60 Pro',
        brand: 'huawei',
        storage: '512gb',
        ram: '12gb',
        camera: '48mp',
        battery: 4815,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 17999,
        specs: '12gb RAM • 512gb • 48mp Camera • 4815 mAh Batería.',
        image: getModelImage('Huawei P60'),
        fullSpecs: {
            Processor: 'Snapdragon 8+ Gen 1',
            Display: 'OLED 6.67" LTPO Display',
            'Main Camera': '48mp Leica Camera',
            'Front Camera': '12MP',
            'Battery Life': '4815 mAh',
            Weight: '200g',
            Materials: 'Aluminio con vidrio Gorilla Glass'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://consumer.huawei.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 22,
        name: 'Motorola Edge 40',
        brand: 'motorola',
        storage: '256gb',
        ram: '8gb',
        camera: '50mp',
        battery: 4400,
        screen: 'medium',
        os: 'android',
        condition: 'new',
        price: 9999,
        specs: '8gb RAM • 256gb • 50mp Camera • 4400 mAh Batería.',
        image: getModelImage('Motorola Edge'),
        fullSpecs: {
            Processor: 'MediaTek Dimensity 8020',
            Display: 'OLED 6.55" Display 144Hz',
            'Main Camera': '50mp Dual Camera',
            'Front Camera': '12MP',
            'Battery Life': '4400 mAh',
            Weight: '171g',
            Materials: 'Aluminio con vidrio'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.motorola.com.mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 23,
        name: 'Nothing Phone 2',
        brand: 'nothing',
        storage: '256gb',
        ram: '12gb',
        camera: '50mp',
        battery: 4700,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 15999,
        specs: '12gb RAM • 256gb • 50mp Camera • 4700 mAh Batería.',
        image: getModelImage('Nothing Phone'),
        fullSpecs: {
            Processor: 'Snapdragon 8+ Gen 1',
            Display: 'OLED 6.7" Display 120Hz',
            'Main Camera': '50mp Dual Camera',
            'Front Camera': '12MP',
            'Battery Life': '4700 mAh',
            Weight: '193g',
            Materials: 'Aluminio con vidrio transparente'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.nothing.tech', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 24,
        name: 'Realme GT 5',
        brand: 'realme',
        storage: '512gb',
        ram: '16gb',
        camera: '50mp',
        battery: 5240,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 11999,
        specs: '16gb RAM • 512gb • 50mp Camera • 5240 mAh Batería.',
        image: getModelImage('Realme GT'),
        fullSpecs: {
            Processor: 'Snapdragon 8 Gen 2',
            Display: 'AMOLED 6.74" Display 144Hz',
            'Main Camera': '50mp Triple Camera',
            'Front Camera': '12MP',
            'Battery Life': '5240 mAh',
            Weight: '205g',
            Materials: 'Aluminio con vidrio'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.realme.com/mx', logo: '🛒' },
            { store: 'Amazon MX', url: 'https://www.amazon.com.mx', logo: '📦' }
        ]
    },
    {
        id: 25,
        name: 'Vivo X100 Pro',
        brand: 'vivo',
        storage: '512gb',
        ram: '16gb',
        camera: '64mp',
        battery: 5400,
        screen: 'large',
        os: 'android',
        condition: 'new',
        price: 19999,
        specs: '16gb RAM • 512gb • 64mp Camera • 5400 mAh Batería.',
        image: getModelImage('Vivo X100'),
        fullSpecs: {
            Processor: 'MediaTek Dimensity 9300',
            Display: 'AMOLED 6.78" LTPO Display',
            'Main Camera': '64mp Zeiss Camera',
            'Front Camera': '12MP',
            'Battery Life': '5400 mAh',
            Weight: '221g',
            Materials: 'Aluminio con vidrio Gorilla Glass'
        },
        purchaseLinks: [
            { store: 'Tienda Oficial', url: 'https://www.vivo.com/mx', logo: '🛒' },
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

