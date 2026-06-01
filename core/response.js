const STATUS_TEXTS = {
    200: 'OK',
    201: 'Created',
    400: 'Bad Request',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
};

function buildHeaders(statusCode, statusText, headers, body) {
    const normalized = { ...headers, Connection: 'close' };

    if (body !== undefined && body !== null && normalized['Content-Length'] === undefined) {
        normalized['Content-Length'] = Buffer.byteLength(body);
    }

    let response = `HTTP/1.1 ${statusCode} ${statusText}\r\n`;
    for (const [key, value] of Object.entries(normalized)) {
        response += `${key}: ${value}\r\n`;
    }
    response += '\r\n';
    return response;
}

function createResponse(socket) {
    let statusCode = 200;
    const headers = {};

    const res = {
        status(code) {
            statusCode = code;
            return this;
        },

        set(key, value) {
            headers[key] = value;
            return this;
        },

        send(text, contentType = 'text/html; charset=utf-8') {
            const body = String(text);
            headers['Content-Type'] = contentType;
            const statusText = STATUS_TEXTS[statusCode] || 'Unknown';
            const head = buildHeaders(statusCode, statusText, headers, body);
            socket.end(head + body);
        },

        json(data) {
            const body = JSON.stringify(data);
            headers['Content-Type'] = 'application/json; charset=utf-8';
            const statusText = STATUS_TEXTS[statusCode] || 'Unknown';
            const head = buildHeaders(statusCode, statusText, headers, body);
            socket.end(head + body);
        },

        writeHead(status, extraHeaders = {}) {
            statusCode = status;
            Object.assign(headers, extraHeaders);
            const statusText = STATUS_TEXTS[statusCode] || 'Unknown';
            const head = buildHeaders(statusCode, statusText, headers);
            socket.write(head);
        },
    };

    return res;
}

module.exports = {
    STATUS_TEXTS,
    buildHeaders,
    createResponse,
};
