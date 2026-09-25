<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/readme/otsugua-mark-dark.png">
    <img src="docs/readme/otsugua-mark-light.png" alt="Otsugua" width="720">
  </picture>
</p>

<p align="center">
  <img alt="Laravel 13" src="https://img.shields.io/badge/Laravel-13-ff2d20?logo=laravel&logoColor=white">
  <img alt="Blade and Tailwind CSS 4" src="https://img.shields.io/badge/Blade_%2B_Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white">
  <img alt="Playwright browser checks" src="https://img.shields.io/badge/browser_checks-Playwright-45ba4b?logo=playwright&logoColor=white">
  <img alt="Portfolio application" src="https://img.shields.io/badge/portfolio-application-e8e0d2">
</p>

# Otsugua Portfolio

A portfolio application for Guilherme Augusto: a full-stack Laravel developer
who designs product surfaces around clear workflows, inspectable systems, and
coherent visual hierarchy.

The site is not a collection of decorative case studies. Its project slices are
built as credible interface surfaces that demonstrate product judgment,
interaction design, frontend craft, and implementation discipline.

## What it demonstrates

- A responsive, bilingual Laravel/Blade portfolio surface with light and dark themes.
- Product-oriented interface design rather than static marketing mockups.
- Browser interaction checks with Playwright alongside Laravel feature tests and manual visual review.
- Three fictional but plausible product slices that each express a different
  engineering/product capability.
- An interactive Game of Life background with an optional immersive mode.

## Project slices

| Slice | Focus |
| --- | --- |
| Harbor Ledger | TDD-oriented pricing, release control, and approval workflows. |
| Northline Learning Ops | DDD-oriented learning operations and operational clarity. |
| Studio Current | A design-for-impact client portal surface. |

## Djinn

The portfolio includes a voice agent experience called Djinn, which answers
questions about Guilherme and itself in English and Brazilian Portuguese.
Visitors can speak or type. Djinn is maintained separately in a private repository;
its backend is not included here, and its availability is independent of the portfolio.

## Game of Life

The background runs Conway's Game of Life. Select the Otsugua name in the hero
to enter immersive mode; click or tap the background, or press Escape, to return.
Immersive mode preserves scrolling and offers theme controls and a 0.5×–4× speed
slider. Select the speed value to reset it to 1×. Reduced-motion preferences are
respected. Entering immersion ends any active Djinn session.

## Local setup

Requirements:

- PHP 8.4+ (required by the locked dependencies)
- Composer
- Node/npm

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
npm run build
```

For local frontend development:

```bash
npm run dev
```

With Laravel Herd, the local site is `http://twelveo-cc.test`.
For HTTPS and the browser tests' default URL:

```bash
herd secure twelveo-cc
```

Approve local certificate trust if prompted, then open **https://twelveo-cc.test**.

## Static export

```bash
npm run build:static
```

This builds the frontend and exports the standalone portfolio to `dist/`.
The static target uses `resources/static/home.html`; Laravel uses
`resources/views/pages/home.blade.php`. Keep shared markup changes aligned across
both templates. The export does not include the separate Djinn backend.

## Verification

```bash
php artisan test --compact
npm run test:browser
npm run build:static
```

Browser tests use `https://twelveo-cc.test` by default; override with
`PLAYWRIGHT_BASE_URL` when needed. Djinn client tests use simulated service
responses rather than requiring access to its private backend. Routine verification
focuses on interaction behavior and manual visual review; the full-page visual
snapshot suite is not part of the default browser command.

## License and use

Copyright (c) 2026 Guilherme Otsugua. All rights reserved.

This repository is provided for viewing and evaluation only. No license is
granted to copy, modify, distribute, sublicense, or use this code in another
project without prior written permission.

The embedded Lucide Keyboard icon is separately licensed under ISC; its notice is included in `public/licenses/lucide.txt` and copied into the static export.
