from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
import socket
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).parent.resolve()


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def _use_index_fallback(self):
        path = Path(urlsplit(self.path).path)
        requested = ROOT / path.relative_to('/') if path.is_absolute() else ROOT / path

        if not requested.exists() and requested.suffix == '':
            self.path = '/index.html'

    def do_GET(self):
        self._use_index_fallback()
        super().do_GET()

    def do_HEAD(self):
        self._use_index_fallback()
        super().do_HEAD()

    def log_message(self, format, *args):
        print(f'{self.address_string()} - {format % args}')


class ReusableHTTPServer(ThreadingHTTPServer):
    allow_reuse_address = True


def find_available_port(start_port):
    for candidate in range(start_port, start_port + 20):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
            try:
                probe.bind(('0.0.0.0', candidate))
            except OSError:
                continue
            return candidate
    raise OSError('No hay puertos disponibles para Sentinel')


if __name__ == '__main__':
    requested_port = int(os.environ.get('PORT', '4173'))
    port = find_available_port(requested_port)
    if port != requested_port:
        print(f'El puerto {requested_port} está ocupado; se usará {port}')
    print(f'Sentinel disponible en http://localhost:{port}')
    ReusableHTTPServer(('0.0.0.0', port), AppHandler).serve_forever()