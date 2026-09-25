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

### Repopulation policy

The simulation compares exact whole-board states two and six generations apart.
This detects periods **1, 2, 3 and 6**, not every period up to six: periods four
and five are deliberately outside the policy. A blinker and a pulsar together
produce a whole-board period of `LCM(2, 3) = 6`.

The original two-generation check confirms four observed states; the six-generation
check confirms twelve. Each independently requires another **30 active seconds**
of matching phases before the existing one-second fade and repopulation. Hidden,
suspended and reduced-motion time is excluded. Speed/theme changes preserve
progress; world resizing resets detection. Six reusable snapshots support at most
two full-board comparisons and one snapshot copy per generation, without hashing.

### Mathematical assessment

A September 2026 offline study sampled 2,048 worlds for each of two measured page
geometries. Every cell was independently initialized alive with probability 0.3,
using reproducible SplitMix64 draws, then evolved with the application's B3/S23
rules and toroidal wrapping. A configuration with `k` live cells among `N` has
probability `0.3^k × 0.7^(N-k)`; counting all configurations equally would model a
different initializer. Expected density after the first generation is 34.3064%,
but subsequent spatial correlations prevent using that density formula to predict
cycle frequencies.

| Eventual whole-board period | Desktop: 144 × 417 | Narrow: 39 × 416 |
| --- | ---: | ---: |
| 2 | 2,000 | 2,031 |
| 6 | 48 | 16 |
| 156 | 0 | 1 |

Periods 1/2 covered **98.413%** of these 4,096 worlds. Adding period-six comparisons
raised observed coverage to **99.976%**; searching every period through 32 added
zero further hits. Under independent-sample assumptions, zero extra hits gives a
one-sided 95% upper bound of approximately **0.073 percentage points** on additional
coverage for the equally weighted two-layout population—not a universal guarantee.

The primary observation budget was 20,000 generations with exact-repeat searches
through period 128. Both unresolved cases were followed using Brent cycle detection
and verified with 512-state history: one desktop world reached period two at
generation 20,536; the narrow exception had period 156. The optimized offline kernel
matched production JavaScript in 144 exact-board checks across eight geometries;
known patterns and sixteen separate cycle cross-checks also passed. Reproduction
used desktop seeds 1000001–1002048 and narrow seeds 2000001–2002048, taking the upper
53 bits of each SplitMix64 draw divided by `2^53` and comparing with 0.3.

The exception (seed 2001965, 39 × 416) contains a spaceship moving two cells
horizontally every four generations. Its return period is
`4 × 39 / gcd(39, 2) = 156`, verified again with production JavaScript. It illustrates
why a repeating shape is not necessarily a short-period whole-board cycle. No
special seed, lottery, or experimental preview is included in the application.

These measurements concern fixed-size fresh worlds, not every viewport, resize
sequence, local oscillator, or possible initial configuration. They are cycle
frequency measurements, not a browser performance benchmark.

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
The exporter stages the new output before replacing `dist/`, preserving the last
successful export if preparation fails and attempting rollback if publication fails.

## Private device QA

The general `tailscale-preview` workflow can forward a loopback HTTP instance of
this same Laravel application for private phone and multi-device QA. It preserves
the original templates, assets, fonts and controls without injected notices or
content restrictions. When comparing with the local Laravel site, do not substitute
the separate static export. HTTP over a VPN is transport-encrypted but is not a
browser secure context; browser API and origin-dependent behavior can still differ.
The application's source and production configuration are not rewritten for sharing.
QA shares expire after ten minutes by default. Explicitly requested extensions are
limited to two hours; QA servers launched by the workflow expire with their share.

## Verification

```bash
php artisan test --compact
npm run test:unit
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
