const net = require('net');
const path = require('path');

const Parser = require('./parser');
const Router = require('./router');
const { createStaticHandler } = require('./static');
const { buildHeaders } = require('./response');

class Server {
    constructor(options = {}) {
        this.router = new Router();
        this.publicDir = options.publicDir || path.join(__dirname, '..', 'public');
        this.staticHandler = createStaticHandler(this.publicDir);

        this.router.use((req, socket, next) => this.staticHandler(req, socket, next));

        this.tcpServer = net.createServer((socket) => {
            socket.on('data', (data) => {
                try {
                    const req = Parser.parse(data);
                    this.router.handle(req, socket);
                } catch (error) {
                    console.error('Error processing request:', error);
                    const body = '500 - Internal Server Error';
                    socket.end(
                        buildHeaders(500, 'Internal Server Error', { 'Content-Type': 'text/plain; charset=utf-8' }, body) +
                            body
                    );
                }
            });

            socket.on('error', (err) => {
                console.error('Socket error:', err.message);
            });
        });
    }

    use(handler) {
        this.router.use(handler);
        return this;
    }

    get(path, handler) {
        this.router.get(path, handler);
        return this;
    }

    post(path, handler) {
        this.router.post(path, handler);
        return this;
    }

    static(dir) {
        this.publicDir = path.resolve(dir);
        this.staticHandler = createStaticHandler(this.publicDir);
        return this;
    }

    listen(port, callback) {
        this.tcpServer.listen(port, callback);
        return this;
    }
}

module.exports = Server;
