// Service Worker para PWA - Pito Pérez
const CACHE_NAME = 'pito-perez-v2.0';
const STATIC_CACHE = 'pito-perez-static-v2.0';
const DYNAMIC_CACHE = 'pito-perez-dynamic-v2.0';

// Recursos críticos que deben estar siempre en caché
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './src/css/style.css',
    './src/js/script.js',
    './src/js/api.js',
    './src/js/security.js',
    './src/js/fallback-db.js',
    // Imágenes locales
    './src/images/b4ad327a-a040-42bf-862e-fd1e192ba284.webp',
    './src/images/phones/iphone-14-pro.jpg',
    './src/images/phones/iphone-14.jpg',
    './src/images/phones/iphone-15-pro.jpg',
    './src/images/phones/iphone-15.jpg',
    './src/images/phones/galaxy-s23.jpg',
    './src/images/phones/galaxy-s24.jpg',
    './src/images/phones/galaxy-a34.jpg',
    './src/images/phones/galaxy-a54.jpg'
];

// Instalación del Service Worker con manejo de errores
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker instalando...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('✅ Cache estático abierto:', STATIC_CACHE);
                // Intentar agregar archivos individualmente para mejor manejo de errores
                return Promise.allSettled(
                    urlsToCache.map(url => {
                        return cache.add(url).catch(err => {
                            console.warn(`⚠️ No se pudo cachear ${url}:`, err.message);
                            return null; // Continuar aunque falle uno
                        });
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker instalado correctamente');
                return self.skipWaiting(); // Activar inmediatamente
            })
            .catch(err => {
                console.error('❌ Error al instalar Service Worker:', err);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker activando...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Mantener solo las cachés actuales
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== CACHE_NAME) {
                        console.log('🗑️ Eliminando cache antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            console.log('✅ Service Worker activado');
            return self.clients.claim(); // Tomar control de todas las pestañas
        })
    );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Ignorar requests que no son GET
    if (request.method !== 'GET') {
        return;
    }
    
    // Estrategia: Cache First para recursos estáticos, Network First para datos dinámicos
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // Si está en cache, devolverla (Cache First)
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // Si no está en cache, intentar fetch (Network First)
                return fetch(request)
                    .then((response) => {
                        // Verificar si la respuesta es válida
                        if (!response || response.status !== 200 || response.type === 'error') {
                            // Si falla y es un recurso local, intentar devolver una respuesta básica
                            if (url.origin === self.location.origin) {
                                // Para HTML, devolver index.html
                                if (request.headers.get('accept')?.includes('text/html')) {
                                    return caches.match('./index.html');
                                }
                            }
                            return response;
                        }
                        
                        // Clonar la respuesta antes de cachear
                        const responseToCache = response.clone();
                        
                        // Cachear recursos locales y algunos externos importantes
                        const shouldCache = 
                            url.origin === self.location.origin || // Recursos locales
                            url.hostname === 'fonts.googleapis.com' || // Fuentes de Google
                            url.hostname === 'fonts.gstatic.com' || // Fuentes estáticas de Google
                            url.hostname === 'cdn.tailwindcss.com' || // Tailwind CDN
                            url.hostname === 'cdn.jsdelivr.net'; // Chart.js CDN
                        
                        if (shouldCache) {
                            const cacheToUse = url.origin === self.location.origin ? STATIC_CACHE : DYNAMIC_CACHE;
                            caches.open(cacheToUse)
                                .then((cache) => {
                                    cache.put(request, responseToCache);
                                })
                                .catch(err => {
                                    console.warn('Error al cachear:', err);
                                });
                        }
                        
                        return response;
                    })
                    .catch((error) => {
                        console.warn('⚠️ Error en fetch, intentando fallbacks:', error.message);
                        
                        // Fallbacks para recursos externos importantes
                        if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
                            // Para fuentes, devolver una respuesta vacía (el navegador usará fallback)
                            return new Response('', {
                                headers: { 'Content-Type': 'text/css' }
                            });
                        }
                        
                        // Para recursos locales, intentar devolver index.html si es HTML
                        if (url.origin === self.location.origin) {
                            if (request.headers.get('accept')?.includes('text/html')) {
                                return caches.match('./index.html') || 
                                       new Response('Sin conexión. Por favor, verifica tu internet.', { 
                                           status: 503,
                                           headers: { 'Content-Type': 'text/html; charset=utf-8' }
                                       });
                            }
                        }
                        
                        // Para otros recursos, devolver error
                        return new Response('Sin conexión', { 
                            status: 503,
                            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
                        });
                    });
            })
    );
});

// Manejar notificaciones push
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Nueva actualización disponible',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver detalles',
                icon: '/icon-192x192.png'
            },
            {
                action: 'close',
                title: 'Cerrar',
                icon: '/icon-192x192.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Pito Pérez - Guía de Teléfonos', options)
    );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});
