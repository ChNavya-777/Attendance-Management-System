import http.server
import socketserver
import mimetypes
import os

# Explicitly ensure CSS is treated correctly
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('application/javascript', '.js')

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler
# Make sure the handler uses the correct mapping
Handler.extensions_map.update({
    '.css': 'text/css',
    '.js': 'application/javascript',
})

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at port {PORT}")
    print("MIME types configured manually.")
    httpd.serve_forever()
