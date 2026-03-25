@php
    $projects = [
        [
            'index' => '01',
            'title' => 'Harbor Ledger',
            'description' => 'A full-stack Laravel system that keeps business rules explicit and the operator flow calm.',
            'snippet' => "// controller stays thin\n// move business rules into a service\n// keep the domain easy to test",
            'snippet_x' => '66%',
            'snippet_y' => '-12%',
            'snippet_shift_x' => '18%',
            'snippet_shift_y' => '-8%',
        ],
        [
            'index' => '02',
            'title' => 'Studio Pulse',
            'description' => 'A responsive interface focused on fast interaction, predictable state, and clean front-end behavior.',
            'snippet' => "// local state for transient UI\n// lift only shared state\n// keep renders simple",
            'snippet_x' => '-12%',
            'snippet_y' => '60%',
            'snippet_shift_x' => '-10%',
            'snippet_shift_y' => '8%',
        ],
        [
            'index' => '03',
            'title' => 'Northline Ops',
            'description' => 'A maintainable product surface designed to grow without turning the structure into noise.',
            'snippet' => "// composition first\n// extract when patterns repeat\n// let the layout stay semantic",
            'snippet_x' => '58%',
            'snippet_y' => '48%',
            'snippet_shift_x' => '14%',
            'snippet_shift_y' => '10%',
        ],
    ];
@endphp

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
                            Portfolio / Laravel / Full-stack
                        </p>

                        <h1 class="hero-mark font-display-hero max-w-4xl text-6xl leading-[0.88] tracking-[-0.06em] text-[color:var(--green-900)] sm:text-7xl lg:text-[7.5rem]">
                            Otsugua
                        </h1>

                        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-[color:rgba(16,40,31,0.8)] sm:text-xl">
                            Hi! My name is Guilherme Augusto. I'm a software developer mainly focused on full-stack Laravel.
                        </p>

                        <div class="mt-10 flex flex-wrap items-center gap-3">
                            <a
                                href="#projects"
                                class="cta-button rounded-full bg-[color:var(--green-900)] px-6 py-3 text-sm font-semibold text-[color:var(--bg)] shadow-[0_18px_40px_rgba(16,40,31,0.18)]"
                            >
                                View Projects
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
                            <span>Laravel / UX / Systems</span>
                        </div>

                        <div class="mt-10 space-y-4">
                            <p class="font-display text-3xl leading-tight tracking-[-0.04em]">
                                Three projects, each carrying a technical idea behind the surface.
                            </p>
                            <p class="max-w-md text-sm leading-7 text-[color:rgba(16,40,31,0.74)]">
                                The homepage is built as a quiet introduction first, then a set of curated works with hover notes that explain the thinking.
                            </p>
                        </div>

                        <div class="mt-10 grid grid-cols-2 gap-3 text-sm">
                            <div class="rounded-2xl border border-[color:var(--line)] bg-[rgba(244,239,230,0.7)] p-4">
                                <p class="text-xs uppercase tracking-[0.24em] text-[color:rgba(16,40,31,0.54)]">Style</p>
                                <p class="mt-2 font-medium">Editorial, technical, warm.</p>
                            </div>
                            <div class="rounded-2xl border border-[color:var(--line)] bg-[rgba(244,239,230,0.7)] p-4">
                                <p class="text-xs uppercase tracking-[0.24em] text-[color:rgba(16,40,31,0.54)]">Motion</p>
                                <p class="mt-2 font-medium">Soft, precise, minimal.</p>
                            </div>
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
                            <details
                                class="project-card rounded-[2rem] border border-[color:var(--line)] bg-[rgba(244,239,230,0.72)] p-4 shadow-[0_18px_60px_rgba(16,40,31,0.07)] backdrop-blur-sm"
                                style="--snippet-x: {{ $project['snippet_x'] }}; --snippet-y: {{ $project['snippet_y'] }}; --snippet-shift-x: {{ $project['snippet_shift_x'] }}; --snippet-shift-y: {{ $project['snippet_shift_y'] }};"
                            >
                                <summary class="project-summary list-none cursor-pointer outline-none">
                                    <div class="project-visual rounded-[1.5rem] border border-[rgba(244,239,230,0.18)]">
                                        <div class="absolute inset-0 bg-[linear-gradient(145deg,var(--green-800),#214736_48%,#6b8572)]"></div>

                                        <div class="relative z-10 flex h-full flex-col justify-between p-5">
                                            <div class="flex items-start justify-between gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[color:rgba(244,239,230,0.78)]">
                                                <span>{{ $project['index'] }}</span>
                                                <span>Hover / Tap</span>
                                            </div>

                                            <div class="space-y-3">
                                                <div class="flex flex-wrap gap-2">
                                                    <span class="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-[color:var(--bg)]">
                                                        Project note
                                                    </span>
                                                    <span class="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-[color:var(--bg)]">
                                                        Principle-led
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mt-4 space-y-2">
                                        <h3 class="font-display text-2xl tracking-[-0.03em] text-[color:var(--green-900)]">
                                            {{ $project['title'] }}
                                        </h3>
                                        <p class="max-w-sm text-sm leading-7 text-[color:rgba(16,40,31,0.76)]">
                                            {{ $project['description'] }}
                                        </p>
                                    </div>
                                </summary>

                                <div
                                    class="project-snippet js-technical-note rounded-[1.35rem] border border-[rgba(244,239,230,0.18)] bg-[linear-gradient(180deg,rgba(16,40,31,0.96),rgba(16,40,31,0.9))] p-4 text-[color:var(--bg)] shadow-[0_20px_60px_rgba(16,40,31,0.22)]"
                                    style="top: var(--snippet-y); left: var(--snippet-x);"
                                >
                                    <p class="text-[0.64rem] font-semibold uppercase tracking-[0.3em] text-[color:rgba(244,239,230,0.62)]">
                                        Technical note
                                    </p>
                                    <pre class="mono-note mt-3 whitespace-pre-wrap text-sm leading-6">{{ $project['snippet'] }}</pre>
                                </div>
                            </details>
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
                            <a href="mailto:guilherme@otsugua.dev" class="social-link rounded-full border border-[rgba(244,239,230,0.18)] bg-[rgba(244,239,230,0.06)] px-5 py-3 text-sm font-medium">
                                Email
                            </a>
                            <a href="https://www.linkedin.com/in/guilherme-augusto" class="social-link rounded-full border border-[rgba(244,239,230,0.18)] bg-[rgba(244,239,230,0.06)] px-5 py-3 text-sm font-medium">
                                LinkedIn
                            </a>
                            <a href="https://github.com/otsugua" class="social-link rounded-full border border-[rgba(244,239,230,0.18)] bg-[rgba(244,239,230,0.06)] px-5 py-3 text-sm font-medium">
                                GitHub
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    </body>
</html>
