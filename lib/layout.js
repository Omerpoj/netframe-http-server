const NAV_LINKS = [
    { href: '/', label: 'Dashboard' },
    { href: '/anime/one-piece', label: 'One Piece' },
    { href: '/sports/maccabi', label: 'Maccabi TA' },
    { href: '/japan-itinerary', label: 'Japan 2026' },
    { href: '/guestbook', label: 'Guestbook' },
];

function layout({ title, bodyClass = '', content, activePath = '/' }) {
    const nav = NAV_LINKS.map(
        (link) =>
            `<a class="nav__link${link.href === activePath ? ' nav__link--active' : ''}" href="${link.href}">${link.label}</a>`
    ).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} · NetFrame</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body class="page ${bodyClass}">
  <div class="bg-orbs" aria-hidden="true">
    <span class="orb orb--one"></span>
    <span class="orb orb--two"></span>
    <span class="orb orb--three"></span>
  </div>
  <header class="site-header slide-down">
    <a class="brand" href="/">
      <span class="brand__mark">NF</span>
      <span class="brand__text">NetFrame</span>
    </a>
    <nav class="nav" aria-label="Primary">${nav}</nav>
  </header>
  <main class="shell fade-in">${content}</main>
  <footer class="site-footer fade-in delay-2">
    <p>Built with Node.js <code>net</code> · Full Stack Engineering PS1</p>
  </footer>
  <script src="/js/main.js"></script>
</body>
</html>`;
}

module.exports = { layout, NAV_LINKS };
