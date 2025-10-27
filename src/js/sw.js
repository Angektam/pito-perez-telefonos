// Service Worker para PWA - Pito Pérez
const CACHE_NAME = 'pito-perez-v1.1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './src/css/style.css',
    './src/js/script.js',
    './src/js/api.js',
    './src/js/security.js',
    './src/js/fallback-db.js'
];

// Instalación del Service Worker con manejo de errores
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('✅ Cache abierto:', CACHE_NAME);
                // Intentar agregar archivos individualmente para mejor manejo de errores
                return Promise.all(
                    urlsToCache.map(url => {
                        return cache.add(url).catch(err => {
                            console.warn(`⚠️ No se pudo cachear ${url}:`, err.message);
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
                    if (cacheName !== CACHE_NAME) {
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
    
    // Ignorar requests que no son GET
    if (request.method !== 'GET') {
        return;
    }
    
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // Si está en cache, devolverla
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // Si no está en cache, hacer fetch
                return fetch(request)
                    .then((response) => {
                        // Verificar si la respuesta es válida
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }
                        
                        // Clonar la respuesta antes de cachear
                        const responseToCache = response.clone();
                        
                        // Solo cachear archivos locales
                        const url = new URL(request.url);
                        if (url.origin === self.location.origin) {
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(request, responseToCache);
                                });
                        }
                        
                        return response;
                    })
                    .catch((error) => {
                        console.error('❌ Error en fetch:', error);
                        // Devolver una respuesta de error básica
                        return new Response('Sin conexión', { status: 503 });
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
