// Función para crear imágenes SVG con gradiente
function createPhoneImageSVG(brand, model) {
    const svg = `
        <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad${brand}${model.replace(/\s/g,'')}" x1="0%" y1="0%" x2="100%" y2="100%">
                    ${brand === 'apple' ? '<stop offset="0%" style="stop-color:#1d1d1f;stop-opacity:1" /><stop offset="100%" style="stop-color:#3a3a3c;stop-opacity:1" />' : ''}
                    ${brand === 'samsung' ? '<stop offset="0%" style="stop-color:#1a237e;stop-opacity:1" /><stop offset="100%" style="stop-color:#3949ab;stop-opacity:1" />' : ''}
                    ${brand === 'google' ? '<stop offset="0%" style="stop-color:#4285f4;stop-opacity:1" /><stop offset="50%" style="stop-color:#34a853;stop-opacity:1" /><stop offset="100%" style="stop-color:#fbbc04;stop-opacity:1" />' : ''}
                    ${brand === 'xiaomi' ? '<stop offset="0%" style="stop-color:#ff6900;stop-opacity:1" /><stop offset="100%" style="stop-color:#ff8f00;stop-opacity:1" />' : ''}
                    ${brand === 'oneplus' ? '<stop offset="0%" style="stop-color:#c62828;stop-opacity:1" /><stop offset="100%" style="stop-color:#f44336;stop-opacity:1" />' : ''}
                </linearGradient>
            </defs>
            <rect width="400" height="400" fill="url(#grad${brand}${model.replace(/\s/g,'')})"/>
            <text x="200" y="150" font-family="Arial, sans-serif" font-size="80" fill="white" text-anchor="middle">📱</text>
            <text x="200" y="250" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">${model}</text>
        </svg>
    `;
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
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
        image: createPhoneImageSVG',
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
        image: createPhoneImageSVG',
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
        image: createPhoneImageSVG',
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
        image: createPhoneImageSVG',
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
        image: createPhoneImageSVG',
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
        image: createPhoneImageSVG',
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
        image: createPhoneImageSVG',
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
        image: createPhoneImageSVG',
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
        image: createPhoneImageSVG',
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
        image: createPhoneImageSVG',
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
        image: createPhoneImageSVG',
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
        image: createPhoneImageSVG',
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
        image: createPhoneImageSVG',
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
        image: createPhoneImageSVG',
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
        image: createPhoneImageSVG',
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
        image: createPhoneImageSVG',
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
        image: createPhoneImageSVG',
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
        image: createPhoneImageSVG',
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

