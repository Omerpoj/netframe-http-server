const fs = require('fs');
const path = require('path');
const { buildHeaders } = require('./response');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return MIME_TYPES[ext] || 'application/octet-stream';
}

function createStaticHandler(staticDir, mountPath = '') {
    const resolvedDir = path.resolve(staticDir);
    const prefix = mountPath.endsWith('/') ? mountPath.slice(0, -1) : mountPath;

    return function serveStatic(req, socket, next) {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            return next();
        }

        let urlPath = req.path;
        if (prefix && urlPath.startsWith(prefix)) {
            urlPath = urlPath.slice(prefix.length) || '/';
        }

        const hasExtension = path.extname(urlPath) !== '';
        if (!hasExtension && urlPath !== '/') {
            return next();
        }

        const relativePath = urlPath === '/' ? '/index.html' : urlPath;
        const filePath = path.join(resolvedDir, relativePath);
        const resolvedPath = path.resolve(filePath);

        if (!resolvedPath.startsWith(resolvedDir)) {
            const forbidden =
                buildHeaders(403, 'Forbidden', { 'Content-Type': 'text/plain; charset=utf-8' }, 'Access denied') +
                'Access denied';
            socket.end(forbidden);
            return;
        }

        fs.stat(resolvedPath, (err, stats) => {
            if (err || !stats.isFile()) {
                return next();
            }

            const mimeType = getMimeType(resolvedPath);
            const head = buildHeaders(200, 'OK', {
                'Content-Type': mimeType,
                'Content-Length': stats.size,
            });

            socket.write(head);

            if (req.method === 'HEAD') {
                socket.end();
                return;
            }

            const stream = fs.createReadStream(resolvedPath);
            stream.on('error', () => {
                const body = 'Failed to read file';
                socket.end(
                    buildHeaders(500, 'Internal Server Error', { 'Content-Type': 'text/plain; charset=utf-8' }, body) +
                        body
                );
            });
            stream.pipe(socket);
        });
    };
}

module.exports = { createStaticHandler, getMimeType, MIME_TYPES };
