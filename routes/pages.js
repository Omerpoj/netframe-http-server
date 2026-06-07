const { layout } = require('../lib/layout');
const { guestbook } = require('./api');

function registerPageRoutes(app) {
    app.get('/', (req, res) => {
        res.send(
            layout({
                title: 'Dashboard',
                activePath: '/',
                content: `
          <section class="hero">
            <p class="eyebrow">Problem Set #1</p>
            <h1>Creative HTTP server on raw TCP</h1>
            <p class="lede">
              A custom framework powered only by Node.js <code>net</code> — manual parsing,
              routing, static files, and a chainable response API.
            </p>
            <div class="hero__actions">
              <a class="btn btn--primary" href="/guestbook">Open guestbook</a>
              <a class="btn btn--ghost" href="/api/dogs/taiyo">Taiyo JSON API</a>
            </div>
            <figure class="hero__media">
              <img src="/images/taiyo.png" alt="Taiyo the puppy" loading="lazy">
              <figcaption>Served as a static file from <code>public/images/</code></figcaption>
            </figure>
          </section>
          <section class="card-grid stagger">
            <article class="card card--lift">
              <h2>One Piece</h2>
              <p>Lore and pirate-map styling from the anime theme route.</p>
              <a class="card__link" href="/anime/one-piece">Explore →</a>
            </article>
            <article class="card card--lift">
              <h2>Maccabi Tel Aviv</h2>
              <p>Club colors, motion, and a sports-focused layout.</p>
              <a class="card__link" href="/sports/maccabi">Explore →</a>
            </article>
            <article class="card card--lift">
              <h2>Japan 2026</h2>
              <p>Itinerary for Tokyo, Kyoto, and Nara with timeline accents.</p>
              <a class="card__link" href="/japan-itinerary">Explore →</a>
            </article>
          </section>
        `,
            })
        );
    });

    app.get('/anime/one-piece', (req, res) => {
        res.send(
            layout({
                title: 'One Piece',
                activePath: '/anime/one-piece',
                bodyClass: 'theme-one-piece',
                content: `
          <section class="panel panel--map">
            <p class="eyebrow">Grand Line</p>
            <h1>One Piece: The Legend</h1>
            <p class="lede">Looking for the One Piece? You'll need more than just a map.</p>
            <blockquote class="quote">"The treasure is real!" — Whitebeard</blockquote>
          </section>
        `,
            })
        );
    });

    app.get('/sports/maccabi', (req, res) => {
        res.send(
            layout({
                title: 'Maccabi Tel Aviv',
                activePath: '/sports/maccabi',
                bodyClass: 'theme-maccabi',
                content: `
          <section class="panel panel--sport">
            <p class="eyebrow">Yellow & Blue</p>
            <h1>Maccabi Tel Aviv FC</h1>
            <p class="lede">
              Eran Zahavi — a true legend on the pitch. Pure scoring machine.
            </p>
            <ul class="stats">
              <li><span>Spirit</span><strong>110%</strong></li>
              <li><span>Fans</span><strong>Loud</strong></li>
              <li><span>Colors</span><strong>#003087 / #FCE300</strong></li>
            </ul>
          </section>
        `,
            })
        );
    });

    app.get('/japan-itinerary', (req, res) => {
        res.send(
            layout({
                title: 'Japan Trip',
                activePath: '/japan-itinerary',
                bodyClass: 'theme-japan',
                content: `
          <section class="panel">
            <p class="eyebrow">Sept 2 – Sept 24, 2026</p>
            <h1>Japan itinerary</h1>
            <ol class="timeline">
              <li><strong>Tokyo</strong> — Urban exploration and tech hubs.</li>
              <li><strong>Kyoto</strong> — Temples and extended cultural stay.</li>
              <li><strong>Nara</strong> — Deer park and historic shrines.</li>
            </ol>
          </section>
        `,
            })
        );
    });

    app.get('/guestbook', (req, res) => {
        const entriesHtml =
            guestbook.length === 0
                ? '<p class="muted">No messages yet. Be the first to sign in.</p>'
                : guestbook
                      .map(
                          (e) => `
            <article class="guest-entry fade-in">
              <header><strong>${e.author}</strong><time>${e.createdAt}</time></header>
              <p>${e.message}</p>
            </article>`
                      )
                      .join('');

        res.send(
            layout({
                title: 'Guestbook',
                activePath: '/guestbook',
                content: `
          <section class="panel">
            <p class="eyebrow">Creative feature</p>
            <h1>Taiyo guestbook</h1>
            <figure class="guest-hero">
              <img src="/images/taiyo.png" alt="Taiyo the Golden Retriever puppy" loading="lazy">
              <figcaption>Leave a message for Taiyo</figcaption>
            </figure>
            <p class="lede">POST JSON to <code>/api/guestbook</code> or use the form below.</p>
            <form class="guest-form" id="guestbook-form">
              <label>Name<input name="author" required maxlength="40" placeholder="Your name"></label>
              <label>Message<textarea name="message" required maxlength="280" rows="3" placeholder="Say hello to Taiyo"></textarea></label>
              <button class="btn btn--primary" type="submit">Sign guestbook</button>
              <p class="form-status" id="form-status" role="status"></p>
            </form>
          </section>
          <section class="guest-list stagger" id="guest-list">${entriesHtml}</section>
        `,
            })
        );
    });
}

module.exports = { registerPageRoutes };
