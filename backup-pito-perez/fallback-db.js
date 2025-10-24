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

// Función para obtener imagen real por marca e índice
function createPhoneImageSVG(brand, model) {
    const brandImages = realPhoneImages[brand] || realPhoneImages.apple;
    // Usar un índice basado en el modelo para consistencia
    const modelHash = model.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imageIndex = modelHash % brandImages.length;
    return brandImages[imageIndex];
}

// Base de datos de respaldo para cuando la API falle
export const fallbackPhoneDatabase = [
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
        price: 22150,
        specs: '8gb RAM • 256gb • 48mp Camera • 4422 mAh Batería.',
        image: createPhoneImageSVG('apple', 'iPhone 15 Pro'),
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
        price: 18500,
        specs: '8gb RAM • 128gb • 48mp Camera • 3877 mAh Batería.',
        image: createPhoneImageSVG('apple', 'iPhone 15'),
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
        price: 21000,
        specs: '12gb RAM • 512gb • 64mp Camera • 5200 mAh Batería.',
        image: createPhoneImageSVG('samsung', 'Galaxy S24'),
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
        price: 15700,
        specs: '8gb RAM • 256gb • 50mp Camera • 4800 mAh Batería.',
        image: createPhoneImageSVG('samsung', 'Galaxy S23'),
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
        price: 19800,
        specs: '12gb RAM • 256gb • 50mp Camera • 5050 mAh Batería.',
        image: createPhoneImageSVG('google', 'Pixel 8 Pro'),
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
        price: 14250,
        specs: '8gb RAM • 128gb • 50mp Camera • 4575 mAh Batería.',
        image: createPhoneImageSVG('google', 'Pixel 8'),
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
        price: 17500,
        specs: '16gb RAM • 512gb • 64mp Camera • 5500 mAh Batería.',
        image: createPhoneImageSVG('xiaomi', 'Xiaomi 14'),
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
        price: 11100,
        specs: '8gb RAM • 256gb • 48mp Camera • 5000 mAh Batería.',
        image: createPhoneImageSVG('xiaomi', 'Xiaomi 13'),
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
        price: 18900,
        specs: '16gb RAM • 512gb • 50mp Camera • 5400 mAh Batería.',
        image: createPhoneImageSVG('oneplus', 'OnePlus 12'),
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
        price: 13500,
        specs: '12gb RAM • 256gb • 48mp Camera • 4800 mAh Batería.',
        image: createPhoneImageSVG('oneplus', 'OnePlus 11'),
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
        price: 19800,
        specs: '8gb RAM • 512gb • 48mp Camera • 4422 mAh Batería.',
        image: createPhoneImageSVG('apple', 'iPhone 14 Pro'),
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
        price: 12400,
        specs: '8gb RAM • 256gb • 50mp Camera • 5000 mAh Batería.',
        image: createPhoneImageSVG('samsung', 'Galaxy A54'),
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
        price: 11900,
        specs: '8gb RAM • 128gb • 48mp Camera • 4385 mAh Batería.',
        image: createPhoneImageSVG('google', 'Pixel 7 Pro'),
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
        price: 9800,
        specs: '12gb RAM • 256gb • 64mp Camera • 5200 mAh Batería.',
        image: createPhoneImageSVG('xiaomi', 'Redmi Note 13'),
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
        price: 11500,
        specs: '8gb RAM • 256gb • 50mp Camera • 5000 mAh Batería.',
        image: createPhoneImageSVG('oneplus', 'OnePlus 10T'),
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
        price: 16700,
        specs: '8gb RAM • 128gb • 48mp Camera • 3279 mAh Batería.',
        image: createPhoneImageSVG('apple', 'iPhone 14'),
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
        price: 10200,
        specs: '8gb RAM • 128gb • 50mp Camera • 4500 mAh Batería.',
        image: createPhoneImageSVG('samsung', 'Galaxy A34'),
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
        price: 12800,
        specs: '8gb RAM • 256gb • 50mp Camera • 4614 mAh Batería.',
        image: createPhoneImageSVG('google', 'Pixel 7'),
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
        price: 7400,
        specs: '8gb RAM • 128gb • 50mp Camera • 5000 mAh Batería.',
        image: createPhoneImageSVG('xiaomi', 'Redmi 12'),
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
        price: 9500,
        specs: '8gb RAM • 128gb • 50mp Camera • 4500 mAh Batería.',
        image: createPhoneImageSVG('oneplus', 'OnePlus Nord'),
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
    }
];

