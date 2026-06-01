const { createResponse } = require('./response');

class Router {
    constructor() {
        this.routes = { GET: [], POST: [], PUT: [], DELETE: [] };
        this.middleware = [];
    }

    use(handler) {
        this.middleware.push(handler);
        return this;
    }

    _addRoute(method, pathPattern, handler) {
        const paramNames = [];
        const regexPath = pathPattern.replace(/:([^/]+)/g, (_, name) => {
            paramNames.push(name);
            return '([^/]+)';
        });

        this.routes[method].push({
            pattern: pathPattern,
            regex: new RegExp(`^${regexPath}$`),
            paramNames,
            handler,
        });
    }

    get(path, handler) {
        this._addRoute('GET', path, handler);
    }

    post(path, handler) {
        this._addRoute('POST', path, handler);
    }

    put(path, handler) {
        this._addRoute('PUT', path, handler);
    }

    delete(path, handler) {
        this._addRoute('DELETE', path, handler);
    }

    match(method, path) {
        const methodRoutes = this.routes[method] || [];
        for (const route of methodRoutes) {
            const match = path.match(route.regex);
            if (match) {
                const params = {};
                route.paramNames.forEach((name, index) => {
                    params[name] = match[index + 1];
                });
                return { handler: route.handler, params };
            }
        }
        return null;
    }

    handle(req, socket) {
        const res = createResponse(socket);
        let index = 0;

        const next = () => {
            if (index < this.middleware.length) {
                const fn = this.middleware[index++];
                return fn(req, socket, next);
            }

            const matched = this.match(req.method, req.path);
            if (matched) {
                req.params = matched.params;
                return matched.handler(req, res);
            }

            return res.status(404).send(this._notFoundPage(req.path));
        };

        next();
    }

    _notFoundPage(path) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 — Not Found</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body class="page page--404">
  <main class="shell fade-in">
    <p class="eyebrow">404</p>
    <h1>Page not found</h1>
    <p class="lede">No route exists for <code>${path}</code>.</p>
    <a class="btn btn--primary" href="/">Back to dashboard</a>
  </main>
  <script src="/js/main.js"></script>
</body>
</html>`;
    }
}

module.exports = Router;
