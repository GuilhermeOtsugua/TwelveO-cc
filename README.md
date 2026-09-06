<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/readme/otsugua-mark-dark.png">
    <img src="docs/readme/otsugua-mark-light.png" alt="Otsugua" width="720">
  </picture>
</p>

<p align="center">
  <img alt="Laravel 13" src="https://img.shields.io/badge/Laravel-13-ff2d20?logo=laravel&logoColor=white">
  <img alt="Blade and Tailwind CSS 4" src="https://img.shields.io/badge/Blade_%2B_Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white">
  <img alt="Playwright visual QA" src="https://img.shields.io/badge/visual_QA-Playwright-45ba4b?logo=playwright&logoColor=white">
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
- Visual QA with Playwright alongside Laravel feature and structural checks.
- Three fictional but plausible product slices that each express a different
  engineering/product capability.

## Project slices

| Slice | Focus |
| --- | --- |
| Harbor Ledger | TDD-oriented pricing, release control, and approval workflows. |
| Northline Learning Ops | DDD-oriented learning operations and operational clarity. |
| Studio Current | A design-for-impact client portal surface. |

## Local setup

Requirements:

- PHP 8.3+
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

For Djinn microphone QA, secure the local site and proxy its companion server:

```bash
herd secure twelveo-cc
herd proxy djinn-voice http://127.0.0.1:8080 --secure
```

Approve local certificate trust if Windows prompts. Start Djinn on port 8080 and open **https://twelveo-cc.test**. The client uses HTTPS/WSS through `djinn-voice.test`; HTTP `.test` pages cannot capture a microphone. Djinn must allow the HTTPS webfolio origin.

Microphone permission and device acquisition happen before any paid provider connection. The browser tests include native media capture with a synthetic input device, as well as insecure-origin and permission/device failure cases.

The chat grows to its responsive height cap and keeps the composer and volume controls visible. Manual scrolling gently settles near message starts when moving upward and message ends when moving downward, using an interruptible 280ms eased movement. Settling only continues in the gesture direction to reveal a partially clipped message; it never reverses to align an already visible message. Long or actively growing messages remain freely scrollable. Live replies follow the bottom only while the visitor is not reading history or selecting text; reduced-motion preferences disable animated settling.

Outside tap, Escape, and pressing the keyboard button while the panel is open hide it without ending its conversation. Capture stops and TTS is muted while hidden; reopening restores the chosen volume. The speaker button toggles between zero and the last nonzero volume, and the crossed-out icon also follows manual slider changes. The backend session timeout still applies; navigating away ends the connection.

The page locale initializes Djinn's English/PT-BR conversation preference. After that, the backend follows the latest substantive user prompt, retaining language for brief acknowledgements. Switching the page language does not rewrite conversation messages; assistant messages carry their own response-language attribute.

## Verification

```bash
php artisan test --compact
npm run test:browser
npm run build
```

## License and use

Copyright (c) 2026 Guilherme Otsugua. All rights reserved.

This repository is provided for viewing and evaluation only. No license is
granted to copy, modify, distribute, sublicense, or use this code in another
project without prior written permission.

The embedded Lucide Keyboard icon is separately licensed under ISC; its notice is included in `public/licenses/lucide.txt` and copied into the static export.
