<!DOCTYPE html>
<html
    lang="{{ str_replace('_', '-', app()->getLocale()) }}"
    data-theme-root
    data-theme-preference="system"
    data-theme-effective="light"
>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Otsugua, the portfolio of Guilherme Augusto. Full-stack Laravel work with technical notes and clean presentation.">
        <link rel="canonical" href="https://otsugua.dev">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://otsugua.dev">
        <meta property="og:site_name" content="Otsugua">
        <meta property="og:title" content="Otsugua">
        <meta property="og:description" content="Otsugua, the portfolio of Guilherme Augusto. Full-stack Laravel work with technical notes and clean presentation.">
        <meta name="twitter:card" content="summary">
        <meta name="twitter:title" content="Otsugua">
        <meta name="twitter:description" content="Otsugua, the portfolio of Guilherme Augusto. Full-stack Laravel work with technical notes and clean presentation.">
        <link rel="icon" href="/favicon.svg?v=planet" type="image/svg+xml">
        <link rel="icon" href="/favicon-32.png?v=planet" type="image/png" sizes="32x32">
        <link rel="icon" href="/favicon-192.png?v=planet" type="image/png" sizes="192x192">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=planet" sizes="180x180">
        <link rel="shortcut icon" href="/favicon.ico?v=planet">

        <title>Otsugua</title>

        <script data-theme-boot>
            (() => {
                const storageKey = 'otsugua.theme.preference';
                const root = document.documentElement;

                const isValidPreference = (value) => value === 'system' || value === 'dark' || value === 'light';

                const readPreference = () => {
                    try {
                        const storedPreference = window.localStorage.getItem(storageKey);

                        return isValidPreference(storedPreference) ? storedPreference : 'system';
                    } catch {
                        return 'system';
                    }
                };

                const preference = readPreference();
                const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
                const effectiveTheme = preference === 'dark'
                    ? 'dark'
                    : (preference === 'light' ? 'light' : (prefersDark ? 'dark' : 'light'));

                root.setAttribute('data-theme-root', '');
                root.setAttribute('data-theme-preference', preference);
                root.setAttribute('data-theme-effective', effectiveTheme);
            })();
        </script>

        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="antialiased">
        <div id="top" class="otsugua-page">
            <header class="sticky top-0 z-[100] border-b border-[color:var(--line)] glass-bar" data-home-header>
                <div class="otsugua-shell mx-auto flex items-center justify-between gap-4 px-6 py-4 lg:px-10">
                    <a href="#top" class="font-display nav-brand text-lg tracking-[0.22em] text-[color:var(--green-900)] uppercase sm:text-xl">
                        Otsugua
                    </a>

                    <nav class="flex items-center gap-2 text-sm font-medium text-[color:var(--green-900)]">
                        <a href="#projects" class="nav-link rounded-full border border-transparent px-4 py-2">Projects</a>
                        <a href="#contact" class="nav-link rounded-full border border-transparent px-4 py-2">Contact</a>
                        <button
                            type="button"
                            class="locale-toggle"
                            data-locale-toggle
                            aria-label="Current language: English. Switch to Brazilian Portuguese"
                            aria-pressed="false"
                        >
                            <span class="locale-toggle__active-label">EN</span>
                            <img class="locale-toggle__flag locale-toggle__flag--us locale-toggle__flag--active" src="/flags/us.svg" alt="United States flag">
                            <span class="locale-toggle__separator" aria-hidden="true">/</span>
                            <img class="locale-toggle__flag locale-toggle__flag--br locale-toggle__flag--inactive" src="/flags/br.svg" alt="Brazil flag">
                        </button>

                    </nav>
                </div>
            </header>

            <main class="otsugua-shell mx-auto px-6 pb-16 pt-10 lg:px-10 lg:pt-16">
                <section class="grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(18rem,0.78fr)] lg:items-center" data-home-hero>
                    <div>
                        <p class="mb-6 text-xs font-semibold uppercase tracking-[0.38em] text-[color:rgba(16,40,31,0.62)]">
                            Laravel / Product engineering / Full-stack
                        </p>

                        <h1 class="hero-mark font-display-hero max-w-4xl text-6xl leading-[0.88] tracking-[-0.06em] text-[color:var(--green-900)] sm:text-7xl lg:text-[7.5rem]">
                            Otsugua
                        </h1>

                        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-[color:rgba(16,40,31,0.8)] sm:text-xl">
                            Hi! I'm Guilherme Augusto, a full-stack Laravel developer who designs software
                            around principles that keep products clear, testable, and coherent as they grow.
                        </p>

                        <div class="mt-10 flex flex-wrap items-center gap-3">
                            <a
                                href="#projects"
                                class="cta-button cta-button--primary rounded-full bg-[color:var(--green-900)] px-6 py-3 text-sm font-semibold text-[color:var(--bg)] shadow-[0_18px_40px_rgba(16,40,31,0.18)]"
                            >
                                How I work
                            </a>
                            <a
                                href="#contact"
                                class="cta-button cta-button--secondary rounded-full border border-[color:var(--line)] bg-[rgba(244,239,230,0.55)] px-6 py-3 text-sm font-semibold text-[color:var(--green-900)]"
                            >
                                Contact
                            </a>
                        </div>
                    </div>

                    <aside class="hero-panel rounded-[2rem] border border-[color:var(--line)] p-6 text-[color:var(--green-900)] shadow-[0_22px_70px_rgba(16,40,31,0.08)]" data-home-focus-panel>
                        <div class="flex items-center justify-between text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[color:rgba(16,40,31,0.58)]">
                            <span>Current Focus</span>
                            <span>Thinking / Building</span>
                        </div>

                        <div class="mt-10 space-y-4">
                            <p class="font-display text-3xl leading-tight tracking-[-0.04em]">
                                {{ $currentFocus['topic'] }}
                            </p>
                            <p class="max-w-md text-sm leading-7 text-[color:rgba(16,40,31,0.74)]">
                                {{ $currentFocus['summary'] }}
                            </p>
                        </div>

                        <div class="mt-10 grid gap-3 text-sm">
                            @foreach ($currentFocus['links'] as $link)
                                <a
                                    href="{{ $link['href'] }}"
                                    class="rounded-2xl border border-[color:var(--line)] bg-[rgba(244,239,230,0.7)] p-4 transition-transform duration-200 hover:-translate-y-0.5"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <p class="text-xs uppercase tracking-[0.24em] text-[color:rgba(16,40,31,0.54)]">{{ $link['label'] }}</p>
                                    <p class="mt-2 font-medium">{{ $link['title'] }}</p>
                                </a>
                            @endforeach
                        </div>
                    </aside>
                </section>

                <section id="projects" class="mt-20" data-capability-bands>
                    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-[0.34em] text-[color:rgba(16,40,31,0.58)]">Capability demonstrations</p>
                            <h2 class="mt-3 font-display text-3xl tracking-[-0.04em] text-[color:var(--green-900)] sm:text-4xl">
                                Here’s How I Shape Products
                            </h2>
                        </div>
                    </div>

                    <div class="mt-8 space-y-8">
                        @foreach ($projects as $project)
                            <article
                                class="project-band rounded-[2.2rem] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(244,239,230,0.84),rgba(238,230,216,0.7))] p-5 shadow-[0_24px_80px_rgba(16,40,31,0.08)] lg:p-7"
                                data-project-band
                                data-project-band-index="{{ $project['index'] }}"
                                data-project-band-principle="{{ $project['principle'] }}"
                                style="--band-delay: {{ $loop->index * 120 }}ms;"
                            >
                                <div class="flex min-w-0 flex-col gap-6 lg:gap-7">
                                    <div class="project-band__header min-w-0 flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
                                        <div class="min-w-0 max-w-3xl lg:flex-1">
                                            <p class="project-band__eyebrow text-xs font-semibold uppercase tracking-[0.32em] text-[color:rgba(16,40,31,0.52)]">
                                                {{ $project['category'] }}
                                            </p>
                                            <h3 class="project-band__title mt-3 font-display text-3xl tracking-[-0.04em] text-[color:var(--green-900)] sm:text-[2.2rem]">
                                                {{ $project['title'] }}
                                            </h3>
                                            <p class="project-band__description mt-4 max-w-2xl text-base leading-8 text-[color:rgba(16,40,31,0.78)]">
                                                {{ $project['description'] }}
                                            </p>
                                        </div>

                                        <div class="project-note-anchor relative flex justify-end lg:shrink-0">
                                            <button
                                                type="button"
                                                class="project-note-trigger inline-flex items-center gap-2 rounded-full border border-[rgba(16,40,31,0.12)] bg-[rgba(244,239,230,0.6)] px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[color:rgba(16,40,31,0.84)] lg:shrink-0"
                                                data-project-note-toggle
                                                data-project-note-label-open="Hide note"
                                                data-project-note-label-closed="{{ $project['note']['trigger'] }}"
                                                data-project-note-desktop-anchor
                                                aria-controls="project-note-{{ $loop->index }}"
                                                aria-expanded="false"
                                            >
                                                <span>{{ $project['note']['trigger'] }}</span>
                                            </button>

                                            <aside
                                                id="project-note-{{ $loop->index }}"
                                                class="project-note hidden rounded-[1.45rem] border border-[color:rgba(16,40,31,0.12)] bg-[linear-gradient(180deg,rgba(244,239,230,0.96),rgba(238,230,216,0.92))] p-5 text-[color:var(--green-900)] shadow-[0_24px_70px_rgba(16,40,31,0.14)]"
                                                data-project-note-panel
                                                data-project-note-inline-label="{{ $project['note']['trigger'] }}"
                                            >
                                                <p class="project-note__heading">{{ $project['note']['trigger'] }}</p>
                                                <p class="project-note__body">{{ $project['note']['body'] }}</p>
                                                <div class="project-note__footer">
                                                    <p class="project-note__principle-line">
                                                        <span>Principle:</span>
                                                        <a
                                                            href="{{ $project['note']['link_href'] }}"
                                                            class="project-note__principle-link"
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            <span class="project-note__principle-label project-note__principle-label--full">{{ $project['note']['principle_label'] }}</span>
                                                            <span class="project-note__principle-label project-note__principle-label--tablet">{{ $project['note']['principle'] }}</span>
                                                        </a>
                                                    </p>
                                                </div>
                                            </aside>
                                        </div>
                                    </div>

                                    <div class="flex flex-wrap gap-2">
                                        @foreach ($project['tags'] as $tag)
                                            <span class="rounded-full border border-[color:rgba(16,40,31,0.1)] bg-[rgba(244,239,230,0.74)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:rgba(16,40,31,0.6)]">
                                                {{ $tag }}
                                            </span>
                                        @endforeach
                                    </div>

                                    <div class="project-band__body">
                                        <div class="project-band__surface-stage" data-project-interface-slice>
                                            <section
                                                @class([
                                                    'project-surface',
                                                    'project-surface--harbor' => $project['principle'] === 'TDD',
                                                    'project-surface--northline' => $project['principle'] === 'DDD',
                                                    'project-surface--studio' => $project['principle'] === 'Interaction design',
                                                ])
                                                data-project-surface
                                            >
                                                @if ($project['principle'] === 'TDD')
                                                    @include('pages.partials.harbor-ledger', ['project' => $project])
                                                @elseif ($project['principle'] === 'DDD')
                                                    @include('pages.partials.northline-learning-ops', ['project' => $project])
                                                @elseif ($project['principle'] === 'Interaction design')
                                                    @include('pages.partials.studio-current', ['project' => $project])
                                                @else
                                                    @include('pages.partials.interface-slice-reset', ['project' => $project])
                                                @endif
                                            </section>
                                        </div>
                                    </div>
                                    </div>
                                </article>
                        @endforeach
                    </div>
                </section>

                <section
                    class="relative mt-20 overflow-hidden rounded-[2rem] border border-[rgba(16,40,31,0.14)] bg-[linear-gradient(180deg,rgba(247,243,236,0.92),rgba(241,232,223,0.76))] p-6 shadow-[0_22px_70px_rgba(16,40,31,0.08)] lg:p-8"
                    data-credential-section
                >
                    <div class="pointer-events-none absolute inset-0">
                        <div class="absolute -top-12 right-[-4rem] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(255,45,32,0.18),rgba(255,45,32,0))] blur-2xl"></div>
                        <div class="absolute bottom-[-3.5rem] left-[-2rem] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(255,45,32,0.12),rgba(255,45,32,0))] blur-2xl"></div>
                    </div>

                    <div class="relative grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_auto] lg:items-center lg:gap-8">
                        <div class="min-w-0">
                            <p class="text-xs font-semibold uppercase tracking-[0.34em] text-[color:var(--ink-muted)]">
                                {{ $credential['eyebrow'] }}
                            </p>

                            <h2
                                class="mt-4 max-w-3xl font-display text-[2.2rem] leading-[0.98] tracking-[-0.035em] text-[color:var(--green-900)] sm:text-[2.65rem]"
                                data-credential-title
                            >
                                {{ $credential['title'] }}
                            </h2>
                        </div>

                        <article
                            class="flex w-full items-center justify-start lg:w-auto lg:justify-end"
                            data-credential-card
                        >
                            <a
                                href="{{ $credential['action']['href'] }}"
                                class="inline-flex w-full min-w-[14rem] items-center justify-center rounded-full border border-[rgba(255,45,32,0.2)] bg-[linear-gradient(180deg,#ff5a45,#ff2d20)] px-6 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_18px_40px_rgba(255,45,32,0.22)] transition hover:-translate-y-0.5 hover:bg-[linear-gradient(180deg,#ff6b58,#ff3d2f)] sm:w-auto"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <span class="credential-action__label credential-action__label--default">{{ $credential['action']['label'] }}</span>
                                <span class="credential-action__label credential-action__label--tablet">View online certificate</span>
                            </a>
                        </article>
                    </div>
                </section>

                <section id="contact" class="mt-10">
                    <div
                        class="rounded-[2rem] border border-[color:var(--line)] bg-[rgba(16,40,31,0.96)] p-6 text-[color:var(--bg)] shadow-[0_24px_70px_rgba(16,40,31,0.18)] lg:p-8"
                        data-contact-section
                    >
                        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
                            <div class="max-w-lg">
                                <p class="text-xs font-semibold uppercase tracking-[0.34em] text-[color:rgba(244,239,230,0.58)]">
                                    You can find me here
                                </p>
                                <h2 class="mt-3 font-display text-3xl tracking-[-0.04em] sm:text-4xl">
                                    Contact
                                </h2>
                            </div>

                            <div class="flex flex-col gap-4 lg:min-w-[34rem] lg:items-end" data-contact-actions>
                                <div class="grid grid-cols-2 gap-3 lg:flex lg:flex-wrap lg:justify-end">
                                    <div class="relative col-span-full w-full lg:w-auto lg:shrink-0">
                                        <p
                                            id="contact-copy-feedback"
                                            class="copy-email-toast"
                                            data-copy-email-feedback
                                            role="status"
                                            aria-live="polite"
                                            aria-atomic="true"
                                            hidden
                                        >
                                            Email copied to clipboard!
                                        </p>

                                        <button
                                            type="button"
                                            class="social-link inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-[rgba(244,239,230,0.18)] bg-[rgba(244,239,230,0.06)] px-5 py-3 text-sm font-medium lg:w-auto"
                                            data-copy-email="{{ $contactLinks['email'] }}"
                                            aria-describedby="contact-copy-feedback"
                                        >
                                            <svg viewBox="0 0 24 24" class="h-4 w-4 text-[color:rgba(244,239,230,0.7)]" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                                <path d="M4 6h16v12H4z" />
                                                <path d="m4 8 8 6 8-6" />
                                            </svg>
                                            <span>Email</span>
                                        </button>
                                    </div>

                                    @foreach ($contactLinks['profiles'] as $profile)
                                        <a
                                            href="{{ $profile['href'] }}"
                                            class="social-link inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-[rgba(244,239,230,0.18)] bg-[rgba(244,239,230,0.06)] px-5 py-3 text-sm font-medium lg:w-auto"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            @if ($profile['label'] === 'Upwork')
                                                <svg viewBox="0 0 24 24" class="h-4 w-4 text-[color:rgba(244,239,230,0.7)]" fill="currentColor" aria-hidden="true">
                                                    <path d="M18.64 7.18c-2.2 0-3.92 1.42-4.58 3.52-.98-1.48-1.72-3.38-2.1-5.12H9.2v6.86a2.1 2.1 0 1 1-4.2 0V5.58H2.24v6.86a4.86 4.86 0 0 0 9.72 0v-1.16c.55 1.12 1.25 2.16 2.09 3.03l-1.67 4.11h2.95l1.05-2.66c.67.24 1.43.37 2.26.37a4.48 4.48 0 1 0 0-8.95Zm0 6.28c-.47 0-.9-.08-1.28-.24l.32-.8c.34-.86.64-2.57 1.94-2.57a1.79 1.79 0 0 1-.98 3.61Z"/>
                                                </svg>
                                            @elseif ($profile['label'] === 'LinkedIn')
                                                <svg viewBox="0 0 24 24" class="h-4 w-4 text-[color:rgba(244,239,230,0.7)]" fill="currentColor" aria-hidden="true">
                                                    <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.97 1.97 0 1 0 5.3 6.94 1.97 1.97 0 0 0 5.25 3Zm5.19 5.5H7.13V20h3.31v-6.03c0-1.6.3-3.15 2.29-3.15 1.96 0 1.98 1.83 1.98 3.26V20H18v-6.6c0-3.24-.7-5.73-4.48-5.73-1.82 0-3.03 1-3.53 1.95h-.05V8.5Z"/>
                                                </svg>
                                            @else
                                                <svg viewBox="0 0 24 24" class="h-4 w-4 text-[color:rgba(244,239,230,0.7)]" fill="currentColor" aria-hidden="true">
                                                    <path d="M12 .5C5.65.5.5 5.74.5 12.2c0 5.17 3.3 9.55 7.88 11.1.58.1.79-.26.79-.57 0-.28-.01-1.2-.02-2.18-3.2.71-3.88-1.39-3.88-1.39-.52-1.36-1.28-1.72-1.28-1.72-1.05-.73.08-.72.08-.72 1.16.08 1.77 1.22 1.77 1.22 1.03 1.8 2.7 1.28 3.36.98.1-.77.4-1.28.73-1.58-2.55-.3-5.23-1.3-5.23-5.77 0-1.28.45-2.32 1.19-3.14-.12-.3-.52-1.52.11-3.17 0 0 .97-.32 3.18 1.2a10.83 10.83 0 0 1 5.79 0c2.2-1.52 3.17-1.2 3.17-1.2.64 1.65.24 2.87.12 3.17.74.82 1.19 1.86 1.19 3.14 0 4.48-2.68 5.46-5.24 5.76.42.37.79 1.08.79 2.18 0 1.57-.01 2.84-.01 3.23 0 .31.2.68.8.57A11.72 11.72 0 0 0 23.5 12.2C23.5 5.74 18.35.5 12 .5Z"/>
                                                </svg>
                                            @endif
                                            <span>{{ $profile['label'] }}</span>
                                        </a>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <div
                class="theme-toggle fixed bottom-6 right-6 z-[120] flex items-center gap-1"
                data-theme-toggle
                role="group"
                aria-label="Theme preference"
            >
                <button type="button" class="theme-toggle__option" data-theme-option="system" aria-pressed="true">
                    <svg viewBox="0 0 24 24" class="theme-toggle__icon" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="3.5" y="4.5" width="17" height="11.5" rx="2.4" />
                        <path d="M8 19.5h8" />
                        <path d="M10.2 16v3.5" />
                        <path d="M13.8 16v3.5" />
                    </svg>
                    <span class="theme-toggle__option-label">System</span>
                </button>

                <button type="button" class="theme-toggle__option" data-theme-option="dark" aria-pressed="false">
                    <svg viewBox="0 0 24 24" class="theme-toggle__icon" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M18.5 14.6A6.5 6.5 0 1 1 9.4 5.5a7 7 0 1 0 9.1 9.1Z" />
                    </svg>
                    <span class="theme-toggle__option-label">Dark</span>
                </button>

                <button type="button" class="theme-toggle__option" data-theme-option="light" aria-pressed="false">
                    <svg viewBox="0 0 24 24" class="theme-toggle__icon" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="4.1" />
                        <path d="M12 2.8v2.1" />
                        <path d="M12 19.1v2.1" />
                        <path d="m4.94 4.94 1.48 1.48" />
                        <path d="m17.58 17.58 1.48 1.48" />
                        <path d="M2.8 12h2.1" />
                        <path d="M19.1 12h2.1" />
                        <path d="m4.94 19.06 1.48-1.48" />
                        <path d="m17.58 6.42 1.48-1.48" />
                    </svg>
                    <span class="theme-toggle__option-label">Light</span>
                </button>
            </div>

        </div>
    </body>
</html>
