# GitLit: Creative Elements Commons

GitLit is a static GitHub Pages pilot for sharing small creative web-development elements: favicons, icons, fonts, stylesheets, buttons, web apps, scripts, and extensions.

## Pilot features

- Creators can list an element with their name, source and optional source-map URLs, license/terms, display-only price, and explicit reuse grants (inspect, reuse, remix, commercial use, redistribute).
- Creators declare preview capabilities separately: visual preview, local toggle, and preview-only styling.
- Preview is generated in a restrictive iframe sandbox. Its fixed demo behavior cannot access the parent page, network, or device APIs. Submitted code is rendered as text and is never executed.
- Search and filter listings, save them in local browser storage, and export a JSON catalog.

## Important limits

This is a prototype, not a shared marketplace. Browser storage is local to one device; GitHub Pages does not provide user accounts, shared submissions, review/moderation, checkout, or creator payouts. Prices are display labels only. The permission selections are declarations for people to review and are not enforceable authorization in another app. A production marketplace needs a backend and a reviewed, versioned package/install format with consumer-side permission prompts and sandboxing.

Source maps are debugging metadata; they can expose original source and do not make code safe or smaller. GitLit links to a creator-provided map but never fetches it automatically. Production consumers should omit source maps from ordinary runtime delivery unless opted in.

License choices and custom terms are creator-provided, not legal advice. Creators must have rights to publish their work.

## Run and publish

Open `index.html` using a local static web server, or enable GitHub Pages for this repository branch and select the repository root. No build step is required.
