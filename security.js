// Módulo de seguridad para la aplicación

// 1. Sanitización de datos de entrada
export function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    // Eliminar caracteres peligrosos y scripts
    return input
        .replace(/[<>]/g, '') // Eliminar < y >
        .replace(/javascript:/gi, '') // Eliminar javascript:
        .replace(/on\w+\s*=/gi, '') // Eliminar event handlers (onclick, onerror, etc)
        .trim()
        .substring(0, 500); // Limitar longitud
}

// 2. Validación de URLs
export function isValidUrl(url) {
    try {
        const urlObj = new URL(url);
        // Solo permitir https y http
        return ['https:', 'http:'].includes(urlObj.protocol);
    } catch {
        return false;
    }
}

// 3. Sanitización de HTML para prevenir XSS
export function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };
    return String(text).replace(/[&<>"'/]/g, (s) => map[s]);
}

// 4. Validación de números (precios, cantidades)
export function validateNumber(value, min = 0, max = Infinity) {
    const num = parseFloat(value);
    if (isNaN(num)) return null;
    if (num < min || num > max) return null;
    return num;
}

// 5. Protección contra inyección SQL (aunque no usamos SQL directamente)
export function sanitizeDatabaseInput(input) {
    if (typeof input !== 'string') return '';
    
    // Eliminar caracteres SQL peligrosos
    return input
        .replace(/['";\\]/g, '')
        .replace(/--/g, '')
        .replace(/\/\*/g, '')
        .replace(/\*\//g, '')
        .trim();
}

// 6. Validación de email
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}

// 7. Rate limiting simple (prevenir spam)
class RateLimiter {
    constructor(maxRequests = 100, timeWindow = 60000) {
        this.requests = [];
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow;
    }

    canMakeRequest() {
        const now = Date.now();
        // Eliminar requests antiguas
        this.requests = this.requests.filter(time => now - time < this.timeWindow);
        
        if (this.requests.length >= this.maxRequests) {
            return false;
        }
        
        this.requests.push(now);
        return true;
    }

    reset() {
        this.requests = [];
    }
}

export const apiRateLimiter = new RateLimiter(50, 60000); // 50 requests por minuto
export const searchRateLimiter = new RateLimiter(30, 60000); // 30 búsquedas por minuto

// 8. Prevención de clickjacking
export function preventClickjacking() {
    if (window.top !== window.self) {
        // Si estamos en un iframe, redirigir al padre
        window.top.location = window.self.location;
    }
}

// 9. Content Security Policy headers (para configurar en el servidor)
export const CSP_HEADERS = {
    "Content-Security-Policy": 
        "default-src 'self'; " +
        "script-src 'self' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://www.gstatic.com 'unsafe-inline'; " +
        "style-src 'self' https://fonts.googleapis.com https://cdn.tailwindcss.com 'unsafe-inline'; " +
        "img-src 'self' https://images.unsplash.com https://placehold.co https://via.placeholder.com data:; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "connect-src 'self' https://fakestoreapi.com https://www.gstatic.com; " +
        "frame-ancestors 'none';"
};

// 10. Validación de datos del formulario
export function validateFormData(formData) {
    const errors = [];
    
    if (formData.email && !validateEmail(formData.email)) {
        errors.push('Email inválido');
    }
    
    if (formData.minPrice !== undefined) {
        const price = validateNumber(formData.minPrice, 0, 1000000);
        if (price === null && formData.minPrice !== '') {
            errors.push('Precio mínimo inválido');
        }
    }
    
    if (formData.maxPrice !== undefined) {
        const price = validateNumber(formData.maxPrice, 0, 1000000);
        if (price === null && formData.maxPrice !== '') {
            errors.push('Precio máximo inválido');
        }
    }
    
    return errors;
}

// 11. Protección de datos sensibles en localStorage
export function secureLocalStorage() {
    return {
        setItem: (key, value) => {
            try {
                // En producción, aquí se podría cifrar el valor
                const sanitizedKey = sanitizeDatabaseInput(key);
                localStorage.setItem(sanitizedKey, JSON.stringify(value));
            } catch (e) {
                console.error('Error al guardar en localStorage:', e);
            }
        },
        getItem: (key) => {
            try {
                const sanitizedKey = sanitizeDatabaseInput(key);
                const item = localStorage.getItem(sanitizedKey);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Error al leer de localStorage:', e);
                return null;
            }
        },
        removeItem: (key) => {
            try {
                const sanitizedKey = sanitizeDatabaseInput(key);
                localStorage.removeItem(sanitizedKey);
            } catch (e) {
                console.error('Error al eliminar de localStorage:', e);
            }
        }
    };
}

// 12. Verificación de integridad de datos
export function verifyDataIntegrity(data) {
    if (!data || typeof data !== 'object') return false;
    
    // Verificar que tenga las propiedades esperadas
    const requiredFields = ['id', 'name', 'brand', 'price'];
    return requiredFields.every(field => field in data);
}

// 13. Logger seguro (no expone información sensible)
export const secureLogger = {
    info: (message) => {
        console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
    },
    error: (message, error) => {
        // No exponer stack traces completos en producción
        console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
        if (error && error.message) {
            console.error('Error message:', error.message);
        }
    },
    warn: (message) => {
        console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
    }
};

// 14. Timeout para requests HTTP
export async function fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    }
}

// 15. Inicializar medidas de seguridad
export function initializeSecurity() {
    // Prevenir clickjacking
    preventClickjacking();
    
    // Agregar meta tags de seguridad si no existen
    if (!document.querySelector('meta[http-equiv="X-Content-Type-Options"]')) {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'X-Content-Type-Options';
        meta.content = 'nosniff';
        document.head.appendChild(meta);
    }
    
    if (!document.querySelector('meta[http-equiv="X-Frame-Options"]')) {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'X-Frame-Options';
        meta.content = 'DENY';
        document.head.appendChild(meta);
    }
    
    if (!document.querySelector('meta[http-equiv="X-XSS-Protection"]')) {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'X-XSS-Protection';
        meta.content = '1; mode=block';
        document.head.appendChild(meta);
    }
    
    secureLogger.info('Medidas de seguridad inicializadas');
}

// 16. Validación de entrada de búsqueda
export function validateSearchInput(searchTerm) {
    if (!searchTerm || typeof searchTerm !== 'string') {
        return { valid: false, error: 'Término de búsqueda inválido' };
    }
    
    const sanitized = sanitizeInput(searchTerm);
    
    if (sanitized.length < 1) {
        return { valid: false, error: 'Término de búsqueda muy corto' };
    }
    
    if (sanitized.length > 100) {
        return { valid: false, error: 'Término de búsqueda muy largo' };
    }
    
    return { valid: true, sanitized };
}

// 17. Protección contra CSRF (Cross-Site Request Forgery)
export function generateCSRFToken() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// 18. Validar origen de requests
export function validateOrigin(origin) {
    const allowedOrigins = [
        window.location.origin,
        'http://localhost',
        'http://127.0.0.1'
    ];
    
    return allowedOrigins.some(allowed => origin.startsWith(allowed));
}

