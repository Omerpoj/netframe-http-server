const path = require('path');
const Server = require('./core/server');
const { registerPageRoutes } = require('./routes/pages');
const { registerApiRoutes } = require('./routes/api');

const PORT = Number(process.env.PORT) || 3000;

const app = new Server({ publicDir: path.join(__dirname, 'public') });

registerPageRoutes(app);
registerApiRoutes(app);

app.listen(PORT, () => {
    console.log(`NetFrame listening on http://localhost:${PORT}`);
    console.log('  Static files → /css, /js from public/');
    console.log('  API          → GET/POST /api/guestbook, GET /api/dogs/:name');
});
