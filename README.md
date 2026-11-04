# Robinhood UI replica (local only)

A local mock of the Robinhood app and web Portfolio overview, built to capture ad footage.
It is not affiliated with Robinhood. Do not deploy it to a public URL.

## Run

    npm start

Then open http://localhost:5178.

- Under 1024px wide you get the iPhone app layout with the bottom tab bar.
- At 1024px and wider you get the web layout (banner, top nav, Transfer money sidebar).
- Force a layout: `?view=mobile` or `?view=desktop`.
- Add a fake iOS status bar for screen captures: `?statusbar=1`.

Screens: `#/home` (Investing), `#/crypto`, `#/search`, `#/social`, `#/portfolio`.

## Set up a shot

Every number on screen is in `data.js` (balances, % changes, watchlist prices, the
portfolio chart shape, account rows). Edit it and reload.

Drag or hover over any chart to scrub; the balance and change update live.
