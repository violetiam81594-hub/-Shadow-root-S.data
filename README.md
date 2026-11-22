# GitLit

GitLit is a small, static marketplace-style library for naming and sharing creative coding elements: icons, fonts, stylesheets, buttons, and other experiments.

## Run it

Open `index.html` in a browser, or serve this directory with any static web server (for example, `python -m http.server 8000`) and visit `http://localhost:8000`.

## What this MVP does

- Browse sample listings, search by name/creator/tag, and filter by element type.
- Create listings with creator attribution, tags, license, terms, display-only price, and an optional code or asset reference.
- Save listings to browser `localStorage` and export the library to JSON.
- Search GitHub's public repository API and open matching repositories. This is a public, read-only integration; it does not connect to every GitHub interface or authenticate users.

## Safety and scope

This version is a static front end. Listings are stored only in the current browser and are not published to a shared server. Prices are labels only: no payment processing, marketplace transactions, or creator payouts are implemented. The terms field is a user-provided notice, not legal advice.

Code snippets are rendered as text and never executed. Treat user-submitted code and URLs as untrusted. Do not put GitHub credentials or tokens in client-side code. A production service would need a backend for account authentication, shared listings, moderation, secure uploads, payments, and payout/attribution records.

## Publish with GitHub Pages

In the repository settings, enable GitHub Pages for the branch containing these files and choose the repository root as the source. GitHub Pages serves the static page; the optional public repository search calls `api.github.com` from the browser and can be subject to GitHub API rate limits.
