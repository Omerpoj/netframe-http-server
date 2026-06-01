class Parser {
    static parse(rawData) {
        const text = rawData.toString('utf-8');
        if (!text.trim()) {
            return { method: '', path: '/', query: {}, headers: {}, body: '', version: 'HTTP/1.1' };
        }

        const [headerPart, bodyPart = ''] = text.split('\r\n\r\n');
        const headerLines = headerPart.split('\r\n');
        const [method, fullPath = '/', version = 'HTTP/1.1'] = headerLines[0].split(' ');

        const [pathname, queryString] = fullPath.split('?');
        const query = {};

        if (queryString) {
            queryString.split('&').forEach((param) => {
                const [key, value = ''] = param.split('=');
                if (key) {
                    query[decodeURIComponent(key)] = decodeURIComponent(value);
                }
            });
        }

        const headers = {};
        for (let i = 1; i < headerLines.length; i++) {
            const line = headerLines[i];
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.slice(0, colonIndex).trim().toLowerCase();
                const value = line.slice(colonIndex + 1).trim();
                headers[key] = value;
            }
        }

        let body = bodyPart;
        if (headers['content-type']?.includes('application/json') && body) {
            try {
                body = JSON.parse(body);
            } catch {
                body = {};
            }
        }

        return {
            method: method?.toUpperCase() || 'GET',
            path: pathname || '/',
            query,
            headers,
            body,
            version,
            params: {},
        };
    }
}

module.exports = Parser;
