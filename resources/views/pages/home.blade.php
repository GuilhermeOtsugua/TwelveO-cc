<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Otsugua, the portfolio of Guilherme Augusto. Full-stack Laravel work with technical notes and clean presentation.">

        <title>Otsugua</title>

        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="antialiased">
        <div class="otsugua-page">
            <header class="sticky top-0 z-[100] border-b border-[color:var(--line)] glass-bar">
                <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
                    <a href="#top" class="font-display nav-brand text-lg tracking-[0.22em] text-[color:var(--green-900)] uppercase sm:text-xl">
                        Otsugua
                    </a>

                    <nav class="flex items-center gap-2 text-sm font-medium text-[color:var(--green-900)]">
                        <a href="#projects" class="nav-link rounded-full border border-transparent px-4 py-2">Projects</a>
                        <a href="#contact" class="nav-link rounded-full border border-transparent px-4 py-2">Contact</a>
                    </nav>
                </div>
            </header>

            <main id="top" class="mx-auto max-w-7xl px-6 pb-16 pt-10 lg:px-10 lg:pt-16">
                <section class="grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(18rem,0.78fr)] lg:items-end">
                    <div>
                        <p class="mb-6 text-xs font-semibold uppercase tracking-[0.38em] text-[color:rgba(16,40,31,0.62)]">
                            Laravel / Product engineering / Full-stack
                        </p>

                        <h1 class="hero-mark font-display-hero max-w-4xl text-6xl leading-[0.88] tracking-[-0.06em] text-[color:var(--green-900)] sm:text-7xl lg:text-[7.5rem]">
                            Otsugua
                        </h1>

                        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-[color:rgba(16,40,31,0.8)] sm:text-xl">
                            I am Guilherme Augusto, a full-stack Laravel developer who designs software around principles that keep products clear, testable, and coherent as they grow.
                        </p>

                        <div class="mt-10 flex flex-wrap items-center gap-3">
                            <a
                                href="#projects"
                                class="cta-button rounded-full bg-[color:var(--green-900)] px-6 py-3 text-sm font-semibold text-[color:var(--bg)] shadow-[0_18px_40px_rgba(16,40,31,0.18)]"
                            >
                                How I work
                            </a>
                            <a
                                href="#contact"
                                class="cta-button rounded-full border border-[color:var(--line)] bg-[rgba(244,239,230,0.55)] px-6 py-3 text-sm font-semibold text-[color:var(--green-900)]"
                            >
                                Contact
                            </a>
                        </div>
                    </div>

                    <aside class="hero-panel rounded-[2rem] border border-[color:var(--line)] p-6 text-[color:var(--green-900)] shadow-[0_22px_70px_rgba(16,40,31,0.08)]">
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

                <section id="projects" class="mt-20">
                    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-[0.34em] text-[color:rgba(16,40,31,0.58)]">Selected Projects</p>
                            <h2 class="mt-3 font-display text-3xl tracking-[-0.04em] text-[color:var(--green-900)] sm:text-4xl">
                                Three featured works
                            </h2>
                        </div>
                        <p class="max-w-xl text-sm leading-7 text-[color:rgba(16,40,31,0.72)]">
                            Each card reads cleanly on its own, then reveals a small offset note that explains the architecture or front-end principle behind it.
                        </p>
                    </div>

                    <div class="relative z-0 mt-8 grid gap-6 lg:grid-cols-3">
                        @foreach ($projects as $project)
                            <x-home.project-card :project="$project" />
                        @endforeach
                    </div>
                </section>

                <section class="mt-20 grid gap-6 rounded-[2rem] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(244,239,230,0.74),rgba(238,230,216,0.54))] p-6 lg:grid-cols-[1fr_auto] lg:items-center lg:p-8">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.34em] text-[color:rgba(16,40,31,0.58)]">
                            Credibility
                        </p>
                        <h2 class="mt-3 font-display text-3xl tracking-[-0.04em] text-[color:var(--green-900)]">
                            Calm delivery, clear structure.
                        </h2>
                    </div>

                    <div class="flex flex-wrap gap-3">
                        <span class="credibility-chip rounded-full border border-[color:var(--line)] px-4 py-2 text-sm text-[color:rgba(16,40,31,0.78)]">Laravel</span>
                        <span class="credibility-chip rounded-full border border-[color:var(--line)] px-4 py-2 text-sm text-[color:rgba(16,40,31,0.78)]">Architecture</span>
                        <span class="credibility-chip rounded-full border border-[color:var(--line)] px-4 py-2 text-sm text-[color:rgba(16,40,31,0.78)]">Front-end</span>
                        <span class="credibility-chip rounded-full border border-[color:var(--line)] px-4 py-2 text-sm text-[color:rgba(16,40,31,0.78)]">Product thinking</span>
                    </div>
                </section>

                <section id="contact" class="mt-10">
                    <div class="rounded-[2rem] border border-[color:var(--line)] bg-[rgba(16,40,31,0.96)] p-6 text-[color:var(--bg)] shadow-[0_24px_70px_rgba(16,40,31,0.18)] lg:p-8">
                        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-[0.34em] text-[color:rgba(244,239,230,0.58)]">
                                    You can find me here
                                </p>
                                <h2 class="mt-3 font-display text-3xl tracking-[-0.04em] sm:text-4xl">
                                    Contact
                                </h2>
                            </div>
                        </div>

                        <div class="mt-6 flex flex-wrap gap-3">
                            <button
                                type="button"
                                class="social-link rounded-full border border-[rgba(244,239,230,0.18)] bg-[rgba(244,239,230,0.06)] px-5 py-3 text-sm font-medium"
                                data-copy-email="{{ $contactLinks['email'] }}"
                                aria-describedby="contact-copy-feedback"
                            >
                                Email
                            </button>

                            @foreach ($contactLinks['profiles'] as $profile)
                                <a
                                    href="{{ $profile['href'] }}"
                                    class="social-link rounded-full border border-[rgba(244,239,230,0.18)] bg-[rgba(244,239,230,0.06)] px-5 py-3 text-sm font-medium"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {{ $profile['label'] }}
                                </a>
                            @endforeach
                        </div>

                        <p
                            id="contact-copy-feedback"
                            class="mt-4 text-sm text-[color:rgba(244,239,230,0.72)]"
                            data-copy-email-feedback
                            aria-live="polite"
                            hidden
                        >
                            Copied
                        </p>
                    </div>
                </section>
            </main>
        </div>
    </body>
</html>
