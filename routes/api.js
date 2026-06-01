const guestbook = [];

function registerApiRoutes(app) {
    app.get('/api/dogs/taiyo', (req, res) => {
        res.json({
            name: 'Taiyo',
            age: '4 months',
            type: 'Puppy',
            diet: ['High-quality puppy kibble', 'Eggs (safe in moderation)'],
            walkingRoutine: 'Short walks to protect developing joints',
        });
    });

    app.get('/api/dogs/:name', (req, res) => {
        if (req.params.name.toLowerCase() !== 'taiyo') {
            return res.status(404).json({ error: 'Dog not found', name: req.params.name });
        }
        res.json({ name: 'Taiyo', status: 'Good boy', mood: 'Playful' });
    });

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
