const guestbook = [];

function registerApiRoutes(app) {
    app.get('/api/guestbook', (req, res) => {
        res.json({ entries: guestbook, count: guestbook.length });
    });

    app.post('/api/guestbook', (req, res) => {
        const { author, message } = req.body || {};

        if (!author || !message) {
            return res.status(400).json({ error: 'author and message are required' });
        }

        const entry = {
            id: Date.now(),
            author: String(author).slice(0, 40),
            message: String(message).slice(0, 280),
            createdAt: new Date().toISOString(),
        };

        guestbook.unshift(entry);
        res.status(201).json({ created: true, entry });
    });
}

module.exports = { registerApiRoutes, guestbook };
