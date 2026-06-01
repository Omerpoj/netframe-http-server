# NetFrame — Custom HTTP Server (PS1)

A full-stack demo built on a **from-scratch HTTP/1.1 server** using only Node.js [`net`](https://nodejs.org/api/net.html). No `http`, `http2`, or third-party HTTP libraries — requests are parsed manually, routed, and answered over raw TCP.

## Features (assignment requirements)

| Requirement | Implementation |
|-------------|----------------|
| `net` only | `core/server.js` creates a TCP server with `net.createServer` |
| Parse HTTP/1.1 | `core/parser.js` — request line, headers, query string, JSON body |
| Valid responses | `core/response.js` — status line, headers, `Content-Length`, `Connection: close` |
| Routing | `core/router.js` — method + path matching, including `:params` |
| Static files | `core/static.js` — serves `public/` (e.g. `/css/style.css`) with MIME types and path traversal protection |
| Route handlers | `app.get()`, `app.post()` in `index.js` via `routes/` |
| Creative extra | **Guestbook API** + shared HTML layout + CSS/JS animations |

## Project structure

```
FS/
├── index.js              # Entry point — wires server + routes
├── core/
│   ├── server.js         # TCP server & fluent app API
│   ├── parser.js         # HTTP request parser
│   ├── router.js         # Middleware pipeline + route matching
│   ├── response.js       # Chainable res.status().json() helpers
│   └── static.js         # express.static-style file serving
├── routes/
│   ├── pages.js          # HTML pages (dashboard, themes, guestbook)
│   └── api.js            # JSON API (dogs, guestbook POST)
├── lib/
│   └── layout.js         # Shared page shell & navigation
└── public/
    ├── css/style.css     # Layout, themes, animations
    └── js/main.js        # Guestbook form + card hover effects
```

## API design choices

1. **Fluent server** — `new Server().get(...).post(...).listen(3000)` mirrors Express ergonomics while staying minimal.
2. **Middleware pipeline** — `router.use(fn)` runs handlers in order; static files run first, then routes (same idea as `app.use(express.static())` before routes).
3. **Chainable responses** — `res.status(201).json({ ... })` builds proper HTTP/1.1 with `Content-Length`.
4. **Parametric routes** — Paths like `/api/dogs/:name` compile to regex; matched groups become `req.params`.
5. **Layout helper** — `lib/layout.js` keeps HTML DRY and gives every page consistent nav/footer (creative DX feature).
6. **Guestbook** — In-memory `POST /api/guestbook` demonstrates JSON body parsing and `201 Created`; the `/guestbook` page uses `fetch` against the same server.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (no npm dependencies required)

### Run

```bash
npm start
# Server: http://localhost:3000
```

### Example usage

**Static file** (served from `public/`):

```bash
curl -i http://localhost:3000/css/style.css
```

**GET route with JSON**:

```bash
curl http://localhost:3000/api/dogs/taiyo
curl http://localhost:3000/api/dogs/Taiyo
```

**POST route** (guestbook):

```bash
curl -X POST http://localhost:3000/api/guestbook \
  -H "Content-Type: application/json" \
  -d '{"author":"Omer","message":"Taiyo is the best pup!"}'

curl http://localhost:3000/api/guestbook
```

**HTML pages**:

- `/` — Dashboard  
- `/anime/one-piece`, `/sports/maccabi`, `/japan-itinerary` — Themed pages  
- `/guestbook` — Sign + view messages  

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the server on port 3000 (override with `PORT`) |

## Course

Full Stack Engineering · Problem Set #1 · Reichman University · 2026

See `Project1_FS.md` for the full assignment specification.
