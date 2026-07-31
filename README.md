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

### `npm run deploy`

Builds the site and pushes `dist` to the `gh-pages` branch. The custom domain
is kept alive by `public/CNAME`, which gets copied into every build.

## Routes

| Path              | What it shows                                    |
| ----------------- | ------------------------------------------------ |
| `/`               | A random dad joke                                |
| `/dog-joke`       | A random joke from a search for "dog"            |
| `/about`          | About the site                                   |
| `/joke/:jokeID`   | One specific joke, by its API id                 |

GitHub Pages has no server-side routing, so `public/404.html` bounces deep
links back through `index.html` with the original path in the query string,
where a snippet in the page head restores it. Both halves of that hack need to
stay in place for permalinks to survive a hard refresh.
