/**
 * Script Node.js para descargar imágenes de teléfonos
 * Ejecutar: node descargar-imagenes.js
 * 
 * Requiere: npm install axios fs path
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Crear carpeta si no existe
const imagesFolder = path.join(__dirname, 'src', 'images', 'phones');
if (!fs.existsSync(imagesFolder)) {
    fs.mkdirSync(imagesFolder, { recursive: true });
    console.log('✅ Carpeta creada:', imagesFolder);
}

// URLs de imágenes de ejemplo (reemplazar con URLs reales)
const imageUrls = {
    // Apple iPhone - Reemplazar con URLs reales de apple.com
    'iphone-15-pro.jpg': null, // URL oficial de iPhone 15 Pro
    'iphone-15.jpg': null,     // URL oficial de iPhone 15
    'iphone-14-pro.jpg': null, // URL oficial de iPhone 14 Pro
    'iphone-14.jpg': null,     // URL oficial de iPhone 14
    
    // Samsung Galaxy - Reemplazar con URLs reales de samsung.com
    'galaxy-s24.jpg': null,    // URL oficial de Galaxy S24
    'galaxy-s23.jpg': null,    // URL oficial de Galaxy S23
    'galaxy-a54.jpg': null,    // URL oficial de Galaxy A54
    'galaxy-a34.jpg': null,    // URL oficial de Galaxy A34
};

function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        if (!url) {
            console.log(`⚠️  ${filename}: URL no configurada`);
            resolve(false);
            return;
        }

        const filePath = path.join(imagesFolder, filename);
        const protocol = url.startsWith('https') ? https : http;

        protocol.get(url, (response) => {
            if (response.statusCode === 200) {
                const fileStream = fs.createWriteStream(filePath);
                response.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log(`✅ Descargado: ${filename}`);
                    resolve(true);
                });
            } else if (response.statusCode === 301 || response.statusCode === 302) {
                // Seguir redirecciones
                downloadImage(response.headers.location, filename)
                    .then(resolve)
                    .catch(reject);
            } else {
                console.log(`❌ Error ${response.statusCode} al descargar ${filename}`);
                resolve(false);
            }
        }).on('error', (err) => {
            console.log(`❌ Error al descargar ${filename}:`, err.message);
            resolve(false);
        });
    });
}

async function downloadAllImages() {
    console.log('📱 Iniciando descarga de imágenes...\n');
    
    const downloads = Object.entries(imageUrls).map(([filename, url]) => 
        downloadImage(url, filename)
    );
    
    await Promise.all(downloads);
    
    console.log('\n✅ Proceso completado');
    console.log('\n⚠️  NOTA: Este script requiere que configures las URLs reales');
    console.log('   de las imágenes en el objeto imageUrls antes de ejecutar.');
}

// Ejecutar si se llama directamente
if (require.main === module) {
    downloadAllImages();
}

module.exports = { downloadImage, downloadAllImages };

