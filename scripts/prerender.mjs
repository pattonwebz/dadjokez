/*
    Writes a real HTML file for every route, so that link previews work.

    Social unfurlers do not run JavaScript. They fetch the URL and read the
    HTML that comes back, which for a single page app is the same shell for
    every route, with the title set client side long after the crawler has
    gone. So every joke shared anywhere unfurled identically, and permalinks
    answered with a 404 status because they were being served through the
    404.html redirect, which some crawlers will not unfurl at all.

    There are only a few hundred jokes and they all come from one paginated
    endpoint, so every page can simply be written out at build time. Each one
    is the built index.html with its own title, description and og tags, which
    also means permalinks now answer 200 from a file that actually exists.
*/

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, '..', 'dist');

const SITE = 'https://dadjokez.com';
const SITE_NAME = 'Dad Jokez';
const OG_IMAGE = `${SITE}/og-card.png`;
const API = 'https://icanhazdadjoke.com';
const PAGE_SIZE = 30;

// Unlike the browser, Node is allowed to send this, and the API asks callers
// to identify themselves.
const HEADERS = {
    'Accept': 'application/json',
    'User-Agent': `DadJokez build (${SITE})`
};

const escapeHtml = (value) =>
    String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const fetchAllJokes = async () => {
    const jokes = [];
    let page = 1;
    let totalPages = 1;

    do {
        const response = await fetch(`${API}/search?limit=${PAGE_SIZE}&page=${page}`, { headers: HEADERS });

        if (!response.ok) {
            throw new Error(`icanhazdadjoke responded with ${response.status} for page ${page}`);
        }

        const data = await response.json();

        if (data.status >= 400) {
            throw new Error(data.message || `icanhazdadjoke returned ${data.status}`);
        }

        totalPages = data.total_pages || 1;
        jokes.push(...(data.results || []));
        page += 1;
    } while (page <= totalPages);

    return jokes;
};

/**
 * Swaps the title and description in the built shell and adds the social tags.
 */
const renderPage = (shell, { title, description, url }) => {
    const tags = [
        ['og:type', 'website'],
        ['og:site_name', SITE_NAME],
        ['og:title', title],
        ['og:description', description],
        ['og:url', url],
        ['og:image', OG_IMAGE],
        ['og:image:width', '1200'],
        ['og:image:height', '630'],
        ['og:image:alt', `${SITE_NAME} - a website that tells you a dad joke`]
    ]
        .map(([property, content]) => `    <meta property="${property}" content="${escapeHtml(content)}" />`)
        .join('\n');

    const twitter = [
        ['twitter:card', 'summary_large_image'],
        ['twitter:title', title],
        ['twitter:description', description]
    ]
        .map(([name, content]) => `    <meta name="${name}" content="${escapeHtml(content)}" />`)
        .join('\n');

    const head = [
        tags,
        twitter,
        `    <link rel="canonical" href="${escapeHtml(url)}" />`
    ].join('\n');

    return shell
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
        .replace(
            /<meta\s+name="description"[\s\S]*?\/>/,
            `<meta name="description" content="${escapeHtml(description)}" />`
        )
        .replace('</head>', `${head}\n  </head>`);
};

const write = async (routePath, html) => {
    // A directory with an index.html works on every static host, and the
    // router matches the same route with or without the trailing slash.
    const target = routePath === '/' ? dist : join(dist, routePath);
    await mkdir(target, { recursive: true });
    await writeFile(join(target, 'index.html'), html, 'utf8');
};

const run = async () => {
    const shell = await readFile(join(dist, 'index.html'), 'utf8');

    if (!shell.includes('<title>')) {
        throw new Error('dist/index.html has no <title> to replace. Did the build change?');
    }

    const started = Date.now();
    const jokes = await fetchAllJokes();

    if (!jokes.length) {
        throw new Error('No jokes came back, refusing to write empty pages');
    }

    const staticPages = [
        {
            path: '/',
            title: SITE_NAME,
            description: 'A website whose entire purpose is to tell you a dad joke.'
        },
        {
            path: 'dog-joke',
            title: `Dog Jokes - ${SITE_NAME}`,
            description: 'Dad jokes about dogs, because dog jokes deserve their own page.'
        },
        {
            path: 'favorites',
            title: `Favorites - ${SITE_NAME}`,
            description: 'The jokes you liked enough to keep.'
        },
        {
            path: 'about',
            title: `About - ${SITE_NAME}`,
            description: 'What this is, and yes, Alan, I do live in Scotland.'
        }
    ];

    for (const page of staticPages) {
        const url = page.path === '/' ? `${SITE}/` : `${SITE}/${page.path}`;
        await write(page.path, renderPage(shell, { ...page, url }));
    }

    for (const joke of jokes) {
        // The joke is the whole point of the preview, so it goes in both the
        // headline and the body: some unfurls show only one of them.
        await write(
            join('joke', joke.id),
            renderPage(shell, {
                title: joke.joke,
                description: joke.joke,
                url: `${SITE}/joke/${joke.id}`
            })
        );
    }

    const seconds = ((Date.now() - started) / 1000).toFixed(1);
    console.log(
        `prerender: ${jokes.length} joke pages + ${staticPages.length} static pages in ${seconds}s`
    );
};

run().catch((err) => {
    console.error('prerender failed:', err.message);
    process.exit(1);
});
