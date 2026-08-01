# Dad Jokez

The source for [dadjokez.com](https://dadjokez.com) - a small React site that
pulls jokes from the [icanhazdadjoke.com](https://icanhazdadjoke.com) API.

Built with React and [Vite](https://vite.dev), routed with
[React Router](https://reactrouter.com) in declarative mode, and hosted on
GitHub Pages.

## Requirements

Node 22.22 or newer.

## Available scripts

### `npm run dev`

Runs the app in development mode with hot module replacement, and opens
[http://localhost:5173](http://localhost:5173) in your browser.

### `npm run build`

Builds the production bundle into the `dist` folder.

### `npm run preview`

Serves the contents of `dist` locally so you can check a production build
before shipping it.

## Deploying

Pushing to `main` builds the site and publishes it to GitHub Pages, via
`.github/workflows/deploy.yml`. There is no manual deploy step. You can also
trigger a redeploy by hand from the repository's Actions tab.

The workflow refuses to publish if `dist/CNAME` is missing or does not say
`dadjokez.com`, since that file is what keeps the site on its custom domain,
and if `dist/404.html` is missing, since that is half of the redirect below.

## Routes

| Path              | What it shows                                    |
| ----------------- | ------------------------------------------------ |
| `/`               | A random dad joke                                |
| `/dog-joke`       | A random joke from a search for "dog"            |
| `/about`          | About the site                                   |
| `/joke/:jokeID`   | One specific joke, by its API id                 |
| anything else     | A not found page                                 |

GitHub Pages has no server-side routing, so `public/404.html` bounces deep
links back through `index.html` with the original path in the query string,
where a snippet in the page head restores it. Both halves of that hack need to
stay in place for permalinks to survive a hard refresh.

That same hack means an unknown URL is served as a normal page once the
redirect has run, so the catch-all route renders the not found page with a
200 rather than a real 404 status. Static hosting cannot do better without a
server, and it does not affect what a visitor sees.
