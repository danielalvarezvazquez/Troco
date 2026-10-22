"""
Servidor local de USwap.

Igual que `py -m http.server 8000`, pero envía Cache-Control: no-store.
Sin esto, el navegador puede seguir usando un js/data.js antiguo y parece
que tus cambios "no se guardan".

Uso:  py serve.py [puerto]
"""
import http.server
import socketserver
import sys


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()

    def log_message(self, fmt, *args):
        # consola más limpia: solo errores
        if str(args[1] if len(args) > 1 else "").startswith(("4", "5")):
            super().log_message(fmt, *args)


if __name__ == "__main__":
    puerto = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", puerto), Handler) as httpd:
        print(f"USwap en http://localhost:{puerto}  (Ctrl+C para parar)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nParado.")
