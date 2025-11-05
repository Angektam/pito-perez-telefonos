#!/usr/bin/env python3
"""
Servidor HTTP simple para servir la aplicación de teléfonos
Uso: python server.py
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Configuración
PORT = 8000
HOST = 'localhost'

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Agregar headers de seguridad
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-XSS-Protection', '1; mode=block')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        super().end_headers()

def main():
    # Cambiar al directorio del script
    os.chdir(Path(__file__).parent)
    
    print(f"🚀 Servidor iniciando en http://{HOST}:{PORT}")
    print("📱 Aplicación de Teléfonos Pito Pérez")
    print("=" * 50)
    
    try:
        with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
            print(f"✅ Servidor corriendo en http://{HOST}:{PORT}")
            print("🌐 Abriendo navegador...")
            webbrowser.open(f'http://{HOST}:{PORT}')
            print("\n💡 Para detener el servidor presiona Ctrl+C")
            print("=" * 50)
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido")
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"❌ Puerto {PORT} ya está en uso. Intenta con otro puerto.")
        else:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
