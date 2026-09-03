from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).parent.resolve()


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        path = Path(urlsplit(self.path).path)
        requested = ROOT / path.relative_to('/')

        if not requested.exists() and requested.suffix == '':
            self.path = '/index.html'

        super().do_GET()


if __name__ == '__main__':
    port = 4173
    print(f'Sentinel disponible en http://localhost:{port}')
    ThreadingHTTPServer(('0.0.0.0', port), AppHandler).serve_forever()