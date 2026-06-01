function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initNavHighlight() {
    const path = window.location.pathname;
    document.querySelectorAll('.nav__link').forEach((link) => {
        const href = link.getAttribute('href');
        link.classList.toggle('nav__link--active', href === path);
    });
}

function initGuestbookForm() {
    const form = document.getElementById('guestbook-form');
    if (!form) return;

    const status = document.getElementById('form-status');
    const list = document.getElementById('guest-list');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        status.textContent = 'Sending…';

        const data = Object.fromEntries(new FormData(form));

        try {
            const response = await fetch('/api/guestbook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const payload = await response.json();
            if (!response.ok) {
                status.textContent = payload.error || 'Could not save entry.';
                return;
            }

            form.reset();
            status.textContent = 'Thanks! Your message was saved.';

            const entry = payload.entry;
            const article = document.createElement('article');
            article.className = 'guest-entry fade-in';
            article.innerHTML = `
        <header><strong>${entry.author}</strong><time>${entry.createdAt}</time></header>
        <p>${entry.message}</p>`;

            if (list.querySelector('.muted')) {
                list.innerHTML = '';
            }
            list.prepend(article);
        } catch {
            status.textContent = 'Network error — is the server running?';
        }
    });
}

function initCardTilt() {
    if (prefersReducedMotion()) return;

    document.querySelectorAll('.card--lift').forEach((card) => {
        card.addEventListener('mousemove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(700px) rotateX(${y * -6}deg) rotateY(${x * 8}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

initNavHighlight();
initGuestbookForm();
initCardTilt();
