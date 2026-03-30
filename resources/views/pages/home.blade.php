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
                            <p class="text-xs font-semibold uppercase tracking-[0.34em] text-[color:rgba(16,40,31,0.58)]">Capability demonstrations</p>
                            <h2 class="mt-3 font-display text-3xl tracking-[-0.04em] text-[color:var(--green-900)] sm:text-4xl">
                                Here’s How I Shape Products
                            </h2>
                        </div>
                        <p class="max-w-xl text-sm leading-7 text-[color:rgba(16,40,31,0.72)]">
                            These are fictional but plausible capability demonstrations. Each band shows the product context, the governing principle, and the rationale behind the shape of the system.
                        </p>
                    </div>

                    <div class="project-sequence mt-8 grid gap-5 rounded-[1.8rem] border border-[color:rgba(16,40,31,0.1)] bg-[linear-gradient(180deg,rgba(244,239,230,0.74),rgba(238,230,216,0.56))] p-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-end lg:p-6">
                        <div>
                            <p class="text-[0.64rem] font-semibold uppercase tracking-[0.32em] text-[color:rgba(16,40,31,0.52)]">
                                One composed argument
                            </p>
                            <p class="mt-3 max-w-2xl font-display text-2xl leading-tight tracking-[-0.035em] text-[color:var(--green-900)]">
                                The section moves from executable correctness, through shared domain language, to crafted responsiveness at the client edge.
                            </p>
                        </div>

                        <div class="grid gap-3 sm:grid-cols-3">
                            @foreach ($projects as $project)
                                <div class="project-sequence__step rounded-[1.2rem] border border-[color:rgba(16,40,31,0.1)] bg-[rgba(244,239,230,0.72)] px-4 py-4">
                                    <p class="text-[0.58rem] font-semibold uppercase tracking-[0.3em] text-[color:rgba(16,40,31,0.44)]">
                                        Step {{ $project['index'] }}
                                    </p>
                                    <p class="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-[color:rgba(16,40,31,0.68)]">
                                        {{ $project['sequence'] }}
                                    </p>
                                </div>
                            @endforeach
                        </div>
                    </div>

                    <div class="mt-8 space-y-5">
                        @foreach ($projects as $project)
                            <article
                                class="project-band rounded-[2.2rem] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(244,239,230,0.84),rgba(238,230,216,0.7))] p-5 shadow-[0_24px_80px_rgba(16,40,31,0.08)] lg:p-7"
                                data-project-band
                                style="--band-delay: {{ $loop->index * 120 }}ms;"
                            >
                                <div class="grid gap-6 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-7">
                                    <div class="flex flex-col justify-between gap-5">
                                        <div>
                                            <div class="flex items-center justify-between gap-3">
                                                <p class="text-xs font-semibold uppercase tracking-[0.32em] text-[color:rgba(16,40,31,0.5)]">
                                                    {{ $project['index'] }}
                                                </p>
                                                <p class="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[color:rgba(16,40,31,0.44)]">
                                                    {{ $project['sequence'] }}
                                                </p>
                                            </div>
                                            <p class="mt-3 text-sm font-semibold uppercase tracking-[0.26em] text-[color:rgba(16,40,31,0.66)]">
                                                {{ $project['principle'] }}
                                            </p>
                                            <p class="project-band__cue mt-4 max-w-[14rem] text-sm leading-6 text-[color:rgba(16,40,31,0.7)]">
                                                @if ($loop->first)
                                                    Start with explicit correctness.
                                                @elseif ($loop->last)
                                                    Finish with memorable responsiveness.
                                                @else
                                                    Then align the shared language.
                                                @endif
                                            </p>
                                        </div>

                                        <div>
                                            <p class="text-sm leading-7 text-[color:rgba(16,40,31,0.7)]">
                                                {{ $project['category'] }}
                                            </p>

                                            <div class="mt-4 flex flex-wrap gap-2">
                                                @foreach ($project['tags'] as $tag)
                                                    <span class="rounded-full border border-[color:rgba(16,40,31,0.1)] bg-[rgba(244,239,230,0.74)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:rgba(16,40,31,0.6)]">
                                                        {{ $tag }}
                                                    </span>
                                                @endforeach
                                            </div>
                                        </div>
                                    </div>

                                    <div class="project-band__body">
                                        <div class="grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(19rem,1.08fr)] xl:items-start">
                                            <div>
                                                <h3 class="font-display text-3xl tracking-[-0.04em] text-[color:var(--green-900)] sm:text-[2.2rem]">
                                                    {{ $project['title'] }}
                                                </h3>
                                                <p class="mt-4 max-w-2xl text-base leading-8 text-[color:rgba(16,40,31,0.78)]">
                                                    {{ $project['description'] }}
                                                </p>
                                            </div>

                                            <section
                                                @class([
                                                    'project-surface rounded-[1.7rem] border border-[color:rgba(16,40,31,0.1)] p-4 text-[color:var(--bg)] shadow-[0_26px_60px_rgba(16,40,31,0.16)] sm:p-5',
                                                    'project-surface--tdd bg-[linear-gradient(180deg,rgba(11,28,21,0.98),rgba(16,40,31,0.94)_48%,rgba(24,54,42,0.92))]' => $project['principle'] === 'TDD',
                                                    'project-surface--ddd bg-[linear-gradient(160deg,rgba(12,31,24,0.98),rgba(20,48,39,0.94)_42%,rgba(55,84,71,0.9)_76%,rgba(116,149,127,0.76))]' => $project['principle'] === 'DDD',
                                                    'project-surface--impact bg-[linear-gradient(160deg,rgba(16,40,31,0.92),rgba(36,69,56,0.82)_48%,rgba(143,117,90,0.42)_100%)]' => $project['principle'] === 'Design for impact',
                                                    'bg-[linear-gradient(160deg,rgba(16,40,31,0.93),rgba(25,53,42,0.86)_48%,rgba(95,126,105,0.74))]' => $project['principle'] !== 'TDD',
                                                ])
                                            >
                                                <div class="flex flex-wrap items-start justify-between gap-4">
                                                    <div>
                                                        <p class="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[color:rgba(244,239,230,0.62)]">
                                                            {{ $project['surface']['eyebrow'] }}
                                                        </p>
                                                        <p class="mt-3 font-display text-[1.75rem] leading-none tracking-[-0.04em] text-[color:rgba(244,239,230,0.94)]">
                                                            {{ $project['surface']['title'] }}
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        class="project-note-trigger inline-flex items-center gap-2 rounded-full border border-[rgba(244,239,230,0.18)] bg-[rgba(244,239,230,0.08)] px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[color:rgba(244,239,230,0.88)]"
                                                        data-project-note-toggle
                                                        data-project-note-label-open="Hide note"
                                                        data-project-note-label-closed="{{ $project['note']['trigger'] }}"
                                                        data-project-note-desktop-anchor
                                                        aria-controls="project-note-{{ $loop->index }}"
                                                        aria-expanded="false"
                                                    >
                                                        <span>{{ $project['note']['trigger'] }}</span>
                                                    </button>
                                                </div>

                                                <p class="mt-4 max-w-2xl text-sm leading-7 text-[color:rgba(244,239,230,0.78)]">
                                                    {{ $project['surface']['summary'] }}
                                                </p>

                                                <div class="mt-5 grid gap-3 sm:grid-cols-3">
                                                    @foreach ($project['surface']['metrics'] as $metric)
                                                        <div class="rounded-[1.1rem] border border-[rgba(244,239,230,0.12)] bg-[rgba(244,239,230,0.08)] px-4 py-3">
                                                            <p class="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-[color:rgba(244,239,230,0.54)]">
                                                                {{ $metric['label'] }}
                                                            </p>
                                                            <p class="mt-2 text-base font-semibold text-[color:rgba(244,239,230,0.94)]">
                                                                {{ $metric['value'] }}
                                                            </p>
                                                        </div>
                                                    @endforeach
                                                </div>

                                                @if ($project['principle'] === 'TDD')
                                                    <div class="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.18fr)_minmax(18rem,0.82fr)]">
                                                        <section class="rounded-[1.35rem] border border-[rgba(242,207,140,0.26)] bg-[linear-gradient(180deg,rgba(242,207,140,0.16),rgba(242,207,140,0.07))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
                                                            <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                                                <div>
                                                                    <p class="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-[color:rgba(244,239,230,0.58)]">
                                                                        {{ $project['surface']['focus']['label'] }}
                                                                    </p>
                                                                    <p class="mt-3 font-display text-[1.6rem] leading-none tracking-[-0.04em] text-[color:rgba(244,239,230,0.96)]">
                                                                        {{ $project['surface']['focus']['title'] }}
                                                                    </p>
                                                                </div>
                                                                <span class="inline-flex rounded-full border border-[rgba(242,207,140,0.36)] bg-[rgba(11,28,21,0.46)] px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[color:#f2cf8c]">
                                                                    {{ $project['surface']['focus']['status'] }}
                                                                </span>
                                                            </div>

                                                            <p class="mt-4 max-w-2xl text-sm leading-7 text-[color:rgba(244,239,230,0.84)]">
                                                                {{ $project['surface']['focus']['detail'] }}
                                                            </p>

                                                            <div class="mt-5 grid gap-3 sm:grid-cols-3">
                                                                @foreach ($project['surface']['focus']['stats'] as $stat)
                                                                    <div class="rounded-[1rem] border border-[rgba(244,239,230,0.12)] bg-[rgba(8,21,16,0.28)] px-4 py-3">
                                                                        <p class="text-[0.56rem] font-semibold uppercase tracking-[0.24em] text-[color:rgba(244,239,230,0.5)]">
                                                                            {{ $stat['label'] }}
                                                                        </p>
                                                                        <p class="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-[color:rgba(244,239,230,0.92)]">
                                                                            {{ $stat['value'] }}
                                                                        </p>
                                                                    </div>
                                                                @endforeach
                                                            </div>

                                                            <div class="mt-5 grid gap-3 lg:grid-cols-[minmax(0,0.92fr)_auto_minmax(0,1.08fr)] lg:items-center">
                                                                @foreach ($project['surface']['rules'] as $rule)
                                                                    <section
                                                                        @class([
                                                                            'rounded-[1.2rem] border p-4 transition-transform duration-300',
                                                                            'border-[rgba(242,207,140,0.24)] bg-[rgba(8,21,16,0.3)]' => $rule['active'],
                                                                            'border-[rgba(244,239,230,0.12)] bg-[rgba(244,239,230,0.06)]' => ! $rule['active'],
                                                                        ])
                                                                    >
                                                                        <div class="flex items-center justify-between gap-3">
                                                                            <div>
                                                                                <p class="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-[color:rgba(244,239,230,0.52)]">
                                                                                    {{ $rule['label'] }}
                                                                                </p>
                                                                                <p class="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-[color:rgba(244,239,230,0.92)]">
                                                                                    {{ $rule['title'] }}
                                                                                </p>
                                                                            </div>
                                                                            <span class="rounded-full border border-[rgba(244,239,230,0.14)] bg-[rgba(11,28,21,0.34)] px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[color:rgba(244,239,230,0.72)]">
                                                                                {{ $rule['status'] }}
                                                                            </span>
                                                                        </div>
                                                                        <p class="mt-4 text-sm leading-7 text-[color:rgba(244,239,230,0.82)]">
                                                                            {{ $rule['detail'] }}
                                                                        </p>
                                                                    </section>
                                                                @endforeach

                                                                <div class="project-surface__trace hidden lg:flex" aria-hidden="true">
                                                                    <span class="project-surface__trace-dot"></span>
                                                                    <span class="project-surface__trace-line"></span>
                                                                    <span class="project-surface__trace-dot"></span>
                                                                </div>

                                                                <section class="rounded-[1.2rem] border border-[rgba(244,239,230,0.12)] bg-[rgba(8,21,16,0.44)] px-4 py-3">
                                                                    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                                        <div>
                                                                            <p class="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-[color:rgba(244,239,230,0.5)]">
                                                                                {{ $project['surface']['approval']['label'] }}
                                                                            </p>
                                                                            <p class="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-[color:rgba(244,239,230,0.9)]">
                                                                                {{ $project['surface']['approval']['value'] }}
                                                                            </p>
                                                                        </div>
                                                                        <p class="max-w-md text-sm leading-7 text-[color:rgba(244,239,230,0.76)]">
                                                                            {{ $project['surface']['approval']['detail'] }}
                                                                        </p>
                                                                    </div>
                                                                </section>
                                                            </div>
                                                        </section>

                                                        <div class="space-y-4">
                                                            <section class="rounded-[1.25rem] border border-[rgba(244,239,230,0.12)] bg-[rgba(244,239,230,0.08)] p-4">
                                                                <div class="flex items-center justify-between gap-3">
                                                                    <div>
                                                                        <p class="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-[color:rgba(244,239,230,0.52)]">
                                                                            Scenario queue
                                                                        </p>
                                                                        <p class="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-[color:rgba(244,239,230,0.92)]">
                                                                            Linked validation cases
                                                                        </p>
                                                                    </div>
                                                                    <span class="rounded-full border border-[rgba(244,239,230,0.12)] bg-[rgba(8,21,16,0.28)] px-3 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[color:rgba(244,239,230,0.68)]">
                                                                        3 checks
                                                                    </span>
                                                                </div>

                                                                <div class="mt-4 space-y-3">
                                                                    @foreach ($project['surface']['cases'] as $case)
                                                                        <section class="rounded-[1.05rem] border border-[rgba(244,239,230,0.08)] bg-[rgba(8,21,16,0.18)] p-3.5">
                                                                            <div class="flex items-center justify-between gap-3">
                                                                                <p class="text-sm font-semibold uppercase tracking-[0.14em] text-[color:rgba(244,239,230,0.92)]">
                                                                                    {{ $case['name'] }}
                                                                                </p>
                                                                                <span
                                                                                    @class([
                                                                                        'rounded-full px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.22em]',
                                                                                        'bg-[rgba(159,209,167,0.14)] text-[color:#bfe5c5]' => $case['tone'] === 'pass',
                                                                                        'bg-[rgba(242,207,140,0.14)] text-[color:#f2cf8c]' => $case['tone'] === 'review',
                                                                                    ])
                                                                                >
                                                                                    {{ $case['result'] }}
                                                                                </span>
                                                                            </div>
                                                                            <p class="mt-3 text-sm leading-7 text-[color:rgba(244,239,230,0.82)]">
                                                                                {{ $case['detail'] }}
                                                                            </p>
                                                                        </section>
                                                                    @endforeach
                                                                </div>
                                                            </section>

                                                            <section class="rounded-[1.25rem] border border-[rgba(244,239,230,0.12)] bg-[rgba(8,21,16,0.32)] p-4">
                                                                <p class="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-[color:rgba(244,239,230,0.5)]">
                                                                    {{ $project['surface']['release']['label'] }}
                                                                </p>
                                                                <p class="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-[color:rgba(244,239,230,0.92)]">
                                                                    {{ $project['surface']['release']['title'] }}
                                                                </p>
                                                                <p class="mt-3 text-sm leading-7 text-[color:rgba(244,239,230,0.76)]">
                                                                    {{ $project['surface']['release']['detail'] }}
                                                                </p>

                                                                <div class="mt-4 space-y-2">
                                                                    @foreach ($project['surface']['release']['checks'] as $check)
                                                                        <div class="flex items-center justify-between gap-3 rounded-[0.95rem] border border-[rgba(244,239,230,0.08)] bg-[rgba(244,239,230,0.05)] px-3 py-2.5">
                                                                            <p class="text-sm leading-6 text-[color:rgba(244,239,230,0.76)]">
                                                                                {{ $check['label'] }}
                                                                            </p>
                                                                            <span class="text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[color:rgba(244,239,230,0.66)]">
                                                                                {{ $check['status'] }}
                                                                            </span>
                                                                        </div>
                                                                    @endforeach
                                                                </div>
                                                            </section>
                                                        </div>
                                                    </div>
                                                @elseif ($project['principle'] === 'DDD')
                                                    <section class="project-surface__case mt-5 rounded-[1.25rem] border border-[rgba(244,239,230,0.14)] bg-[rgba(8,21,16,0.28)] px-4 py-4">
                                                        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                                            <div>
                                                                <p class="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-[color:rgba(244,239,230,0.52)]">
                                                                    {{ $project['surface']['case']['label'] }}
                                                                </p>
                                                                <p class="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-[color:rgba(244,239,230,0.92)]">
                                                                    {{ $project['surface']['case']['value'] }}
                                                                </p>
                                                            </div>
                                                            <p class="max-w-2xl text-sm leading-7 text-[color:rgba(244,239,230,0.78)]">
                                                                {{ $project['surface']['case']['detail'] }}
                                                            </p>
                                                        </div>

                                                        <div class="project-surface__thread mt-4 grid gap-3 rounded-[1.05rem] border border-[rgba(244,239,230,0.12)] bg-[rgba(244,239,230,0.06)] p-3.5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                                                            <div>
                                                                <p class="text-[0.56rem] font-semibold uppercase tracking-[0.26em] text-[color:rgba(244,239,230,0.48)]">
                                                                    {{ $project['surface']['thread']['label'] }}
                                                                </p>
                                                                <p class="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-[color:rgba(244,239,230,0.94)]">
                                                                    {{ $project['surface']['thread']['title'] }}
                                                                </p>
                                                                <p class="mt-3 max-w-xl text-sm leading-7 text-[color:rgba(244,239,230,0.74)]">
                                                                    {{ $project['surface']['thread']['detail'] }}
                                                                </p>
                                                            </div>

                                                            <div class="grid gap-2 sm:grid-cols-2">
                                                                @foreach ($project['surface']['thread']['stages'] as $stage)
                                                                    <div class="rounded-[0.95rem] border border-[rgba(244,239,230,0.08)] bg-[rgba(8,21,16,0.2)] px-3 py-2.5">
                                                                        <p class="text-[0.52rem] font-semibold uppercase tracking-[0.22em] text-[color:rgba(244,239,230,0.5)]">
                                                                            {{ $stage['label'] }}
                                                                        </p>
                                                                        <p class="mt-2 text-sm leading-6 text-[color:rgba(244,239,230,0.82)]">
                                                                            {{ $stage['status'] }}
                                                                        </p>
                                                                    </div>
                                                                @endforeach
                                                            </div>
                                                        </div>
                                                    </section>

                                                    <div class="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1.04fr)_minmax(0,1fr)_minmax(16rem,0.84fr)]">
                                                        @foreach ($project['surface']['zones'] as $zone)
                                                            <section
                                                                @class([
                                                                    'project-surface__zone rounded-[1.25rem] border p-4',
                                                                    'project-surface__zone--calm border-[rgba(191,229,197,0.18)] bg-[linear-gradient(180deg,rgba(159,209,167,0.12),rgba(244,239,230,0.08))]' => $zone['density'] === 'calm',
                                                                    'project-surface__zone--active border-[rgba(242,207,140,0.24)] bg-[linear-gradient(180deg,rgba(242,207,140,0.16),rgba(244,239,230,0.08))]' => $zone['density'] === 'active',
                                                                    'project-surface__zone--compressed border-[rgba(244,239,230,0.1)] bg-[rgba(8,21,16,0.3)]' => $zone['density'] === 'compressed',
                                                                ])
                                                            >
                                                                <div class="flex items-start justify-between gap-3">
                                                                    <div>
                                                                        <p class="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[color:rgba(244,239,230,0.58)]">
                                                                            {{ $zone['label'] }}
                                                                        </p>
                                                                        <p class="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-[color:rgba(244,239,230,0.92)]">
                                                                            {{ $zone['headline'] }}
                                                                        </p>
                                                                    </div>
                                                                    <span
                                                                        @class([
                                                                            'project-surface__zone-dot mt-1 h-2.5 w-2.5 rounded-full',
                                                                            'bg-[color:#9fd1a7]' => $zone['tone'] === 'stable',
                                                                            'bg-[color:#f2cf8c] shadow-[0_0_0_4px_rgba(242,207,140,0.16)]' => $zone['tone'] === 'active',
                                                                            'bg-[color:rgba(244,239,230,0.48)]' => $zone['tone'] === 'muted',
                                                                        ])
                                                                    ></span>
                                                                </div>

                                                                <div class="mt-4 rounded-[1rem] border border-[rgba(244,239,230,0.12)] bg-[rgba(8,21,16,0.2)] px-3 py-3">
                                                                    <div class="flex items-center justify-between gap-3">
                                                                        <div>
                                                                            <p class="text-[0.56rem] font-semibold uppercase tracking-[0.22em] text-[color:rgba(244,239,230,0.5)]">
                                                                                {{ $zone['case_label'] }}
                                                                            </p>
                                                                            <p class="mt-2 text-sm font-semibold text-[color:rgba(244,239,230,0.94)]">
                                                                                {{ $zone['status'] }}
                                                                            </p>
                                                                        </div>
                                                                        <span class="rounded-full border border-[rgba(244,239,230,0.12)] bg-[rgba(244,239,230,0.08)] px-3 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[color:rgba(244,239,230,0.68)]">
                                                                            Case #184
                                                                        </span>
                                                                    </div>

                                                                    <div class="mt-4 grid gap-2 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
                                                                        @foreach ($zone['stats'] as $stat)
                                                                            <div class="rounded-[0.95rem] border border-[rgba(244,239,230,0.08)] bg-[rgba(244,239,230,0.05)] px-3 py-2.5">
                                                                                <p class="text-[0.5rem] font-semibold uppercase tracking-[0.2em] text-[color:rgba(244,239,230,0.5)]">
                                                                                    {{ $stat['label'] }}
                                                                                </p>
                                                                                <p class="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-[color:rgba(244,239,230,0.9)]">
                                                                                    {{ $stat['value'] }}
                                                                                </p>
                                                                            </div>
                                                                        @endforeach
                                                                    </div>
                                                                </div>

                                                                <div class="mt-4 rounded-[1rem] border border-[rgba(244,239,230,0.12)] bg-[rgba(244,239,230,0.05)] px-3 py-3">
                                                                    <div>
                                                                        <p class="text-[0.56rem] font-semibold uppercase tracking-[0.22em] text-[color:rgba(244,239,230,0.5)]">
                                                                            {{ $zone['snapshot_label'] }}
                                                                        </p>
                                                                        <p class="mt-2 text-sm font-semibold text-[color:rgba(244,239,230,0.94)]">
                                                                            {{ $zone['snapshot_value'] }}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <p class="mt-4 text-sm leading-7 text-[color:rgba(244,239,230,0.82)]">
                                                                    {{ $zone['detail'] }}
                                                                </p>

                                                                <div class="mt-4 space-y-2">
                                                                    @foreach ($zone['items'] as $item)
                                                                        <div class="rounded-[0.95rem] border border-[rgba(244,239,230,0.08)] bg-[rgba(244,239,230,0.05)] px-3 py-2.5 text-sm leading-6 text-[color:rgba(244,239,230,0.74)]">
                                                                            {{ $item }}
                                                                        </div>
                                                                    @endforeach
                                                                </div>
                                                            </section>
                                                        @endforeach
                                                    </div>
                                                @else
                                                    <div class="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)]">
                                                        <div class="grid gap-3">
                                                            @foreach ($project['surface']['workstreams'] as $workstream)
                                                                <section class="project-surface__impact-card rounded-[1.25rem] border border-[rgba(244,239,230,0.12)] bg-[rgba(244,239,230,0.08)] p-4">
                                                                    <div class="flex items-start justify-between gap-3">
                                                                        <div>
                                                                            <p class="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[color:rgba(244,239,230,0.58)]">
                                                                                {{ $workstream['label'] }}
                                                                            </p>
                                                                            <p class="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-[color:rgba(244,239,230,0.94)]">
                                                                                {{ $workstream['title'] }}
                                                                            </p>
                                                                        </div>
                                                                        <span class="rounded-full border border-[rgba(244,239,230,0.12)] bg-[rgba(8,21,16,0.26)] px-3 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[color:rgba(244,239,230,0.68)]">
                                                                            {{ $workstream['status'] }}
                                                                        </span>
                                                                    </div>
                                                                    <p class="mt-4 max-w-xl text-sm leading-7 text-[color:rgba(244,239,230,0.82)]">
                                                                        {{ $workstream['detail'] }}
                                                                    </p>
                                                                </section>
                                                            @endforeach

                                                            <section class="rounded-[1.25rem] border border-[rgba(244,239,230,0.12)] bg-[rgba(8,21,16,0.22)] p-4">
                                                                <div class="flex items-center justify-between gap-3">
                                                                    <div>
                                                                        <p class="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[color:rgba(244,239,230,0.58)]">
                                                                            Review flow
                                                                        </p>
                                                                        <p class="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-[color:rgba(244,239,230,0.94)]">
                                                                            Active proof stays ahead of delivery
                                                                        </p>
                                                                    </div>
                                                                    <span class="rounded-full border border-[rgba(244,239,230,0.12)] bg-[rgba(244,239,230,0.08)] px-3 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[color:rgba(244,239,230,0.7)]">
                                                                        Round 3
                                                                    </span>
                                                                </div>

                                                                <div class="mt-4 space-y-2.5">
                                                                    @foreach ($project['surface']['reviewFlow'] as $step)
                                                                        <div class="flex items-center justify-between gap-3 rounded-[1rem] border border-[rgba(244,239,230,0.1)] bg-[rgba(244,239,230,0.06)] px-3 py-2.5">
                                                                            <p class="text-sm leading-6 text-[color:rgba(244,239,230,0.78)]">
                                                                                {{ $step['label'] }}
                                                                            </p>
                                                                            <span class="text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[color:rgba(244,239,230,0.68)]">
                                                                                {{ $step['status'] }}
                                                                            </span>
                                                                        </div>
                                                                    @endforeach
                                                                </div>
                                                            </section>
                                                        </div>

                                                        <section class="project-surface__feedback rounded-[1.35rem] border border-[rgba(218,163,122,0.42)] bg-[linear-gradient(180deg,rgba(235,168,119,0.18),rgba(244,239,230,0.08)_38%,rgba(8,21,16,0.26))] p-4 shadow-[0_30px_65px_rgba(10,25,19,0.2)]">
                                                            <div class="flex items-start justify-between gap-3">
                                                                <p class="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[color:rgba(244,239,230,0.58)]">
                                                                    {{ $project['surface']['feedback']['label'] }}
                                                                </p>
                                                                <span class="rounded-full bg-[rgba(235,168,119,0.18)] px-3 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[color:#f6c69d]">
                                                                    {{ $project['surface']['feedback']['signal'] }}
                                                                </span>
                                                            </div>

                                                            <div class="mt-4 rounded-[1.15rem] border border-[rgba(244,239,230,0.18)] bg-[rgba(8,21,16,0.3)] p-4 shadow-[0_22px_50px_rgba(10,25,19,0.18)]">
                                                                <div class="flex items-start justify-between gap-3">
                                                                    <div>
                                                                        <p class="text-sm font-semibold uppercase tracking-[0.14em] text-[color:rgba(244,239,230,0.94)]">
                                                                            {{ $project['surface']['feedback']['title'] }}
                                                                        </p>
                                                                        <p class="mt-3 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[color:rgba(244,239,230,0.58)]">
                                                                            {{ $project['surface']['feedback']['owner'] }}
                                                                        </p>
                                                                    </div>
                                                                    <span class="rounded-full border border-[rgba(244,239,230,0.12)] bg-[rgba(244,239,230,0.08)] px-3 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[color:rgba(244,239,230,0.72)]">
                                                                        Selected proof
                                                                    </span>
                                                                </div>

                                                                <p class="mt-4 text-sm leading-7 text-[color:rgba(244,239,230,0.82)]">
                                                                    {{ $project['surface']['feedback']['detail'] }}
                                                                </p>

                                                                <div class="mt-4 rounded-[1rem] border border-[rgba(235,168,119,0.2)] bg-[rgba(235,168,119,0.1)] px-4 py-4">
                                                                    <p class="text-[0.56rem] font-semibold uppercase tracking-[0.22em] text-[color:rgba(244,239,230,0.54)]">
                                                                        Pinned client note
                                                                    </p>
                                                                    <p class="mt-3 font-display text-[1.45rem] leading-tight tracking-[-0.03em] text-[color:rgba(244,239,230,0.96)]">
                                                                        {{ $project['surface']['feedback']['comment'] }}
                                                                    </p>
                                                                </div>

                                                                <div class="mt-4 flex flex-wrap gap-2">
                                                                    @foreach ($project['surface']['feedback']['actions'] as $action)
                                                                        <span class="rounded-full border border-[rgba(244,239,230,0.12)] bg-[rgba(244,239,230,0.08)] px-3 py-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[color:rgba(244,239,230,0.78)]">
                                                                            {{ $action }}
                                                                        </span>
                                                                    @endforeach
                                                                </div>

                                                                <div class="mt-4 flex flex-wrap gap-2">
                                                                    @foreach ($project['surface']['feedback']['badges'] as $badge)
                                                                        <span class="project-surface__feedback-chip rounded-full border border-[rgba(244,239,230,0.12)] bg-[rgba(8,21,16,0.24)] px-3 py-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[color:rgba(244,239,230,0.7)]">
                                                                            {{ $badge }}
                                                                        </span>
                                                                    @endforeach
                                                                </div>
                                                            </div>
                                                        </section>
                                                    </div>

                                                    <section class="project-surface__delivery mt-4 rounded-[1.25rem] border border-[rgba(159,209,167,0.18)] bg-[linear-gradient(180deg,rgba(8,21,16,0.32),rgba(8,21,16,0.16))] px-4 py-4">
                                                        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                            <div class="max-w-xl">
                                                                <p class="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[color:rgba(244,239,230,0.58)]">
                                                                    {{ $project['surface']['delivery']['label'] }}
                                                                </p>
                                                                <p class="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-[color:rgba(244,239,230,0.94)]">
                                                                    {{ $project['surface']['delivery']['value'] }}
                                                                </p>
                                                                <p class="mt-4 font-display text-[1.55rem] leading-tight tracking-[-0.03em] text-[color:rgba(244,239,230,0.92)]">
                                                                    {{ $project['surface']['delivery']['title'] }}
                                                                </p>
                                                            </div>

                                                            <div class="rounded-[1rem] border border-[rgba(159,209,167,0.16)] bg-[rgba(159,209,167,0.08)] px-4 py-3">
                                                                <p class="text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[color:rgba(244,239,230,0.54)]">
                                                                    Delivery state
                                                                </p>
                                                                <p class="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-[color:#bfe5c5]">
                                                                    {{ $project['surface']['delivery']['status'] }}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div class="mt-4 grid gap-2 lg:max-w-3xl lg:grid-cols-3">
                                                            @foreach ($project['surface']['delivery']['items'] as $item)
                                                                <div class="rounded-[1rem] border border-[rgba(244,239,230,0.1)] bg-[rgba(244,239,230,0.06)] px-3 py-2.5 text-sm leading-6 text-[color:rgba(244,239,230,0.76)]">
                                                                    {{ $item }}
                                                                </div>
                                                            @endforeach
                                                        </div>
                                                    </section>
                                                @endif
                                            </section>
                                        </div>

                                        <aside
                                            id="project-note-{{ $loop->index }}"
                                            class="project-note hidden rounded-[1.45rem] border border-[color:rgba(16,40,31,0.12)] bg-[linear-gradient(180deg,rgba(244,239,230,0.96),rgba(238,230,216,0.92))] p-5 text-[color:var(--green-900)] shadow-[0_24px_70px_rgba(16,40,31,0.14)]"
                                            data-project-note-panel
                                            data-project-note-inline-label="{{ $project['note']['trigger'] }}"
                                        >
                                            <p class="text-[0.64rem] font-semibold uppercase tracking-[0.3em] text-[color:rgba(16,40,31,0.54)]">
                                                {{ $project['note']['trigger'] }}
                                            </p>
                                            <p class="mt-3 text-sm leading-7 text-[color:rgba(16,40,31,0.76)]">
                                                {{ $project['note']['body'] }}
                                            </p>
                                            <p class="mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[color:rgba(16,40,31,0.46)]">
                                                {{ $project['note']['citation'] }}
                                            </p>
                                        </aside>
                                    </div>
                                </div>
                            </article>
                        @endforeach
                    </div>
                </section>

                <section class="mt-20 grid gap-6 rounded-[2rem] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(244,239,230,0.74),rgba(238,230,216,0.54))] p-6 lg:grid-cols-[1fr_auto] lg:items-center lg:p-8">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.34em] text-[color:rgba(16,40,31,0.58)]">
                            {{ $credential['eyebrow'] }}
                        </p>
                        <p class="mt-3 text-sm font-semibold uppercase tracking-[0.28em] text-[color:rgba(16,40,31,0.58)]">
                            {{ $credential['bridge'] }}
                        </p>
                        <h2 class="mt-4 font-display text-3xl tracking-[-0.04em] text-[color:var(--green-900)]">
                            {{ $credential['title'] }}
                        </h2>
                    </div>

                    <article class="grid gap-4 rounded-[1.5rem] border border-[color:rgba(16,40,31,0.12)] bg-[rgba(244,239,230,0.76)] p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[color:rgba(16,40,31,0.54)]">
                                {{ $credential['issuer'] }}
                            </p>
                            <p class="mt-3 max-w-xl text-sm leading-7 text-[color:rgba(16,40,31,0.74)]">
                                {{ $credential['description'] }}
                            </p>
                        </div>

                        <a
                            href="{{ $credential['action']['href'] }}"
                            class="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--green-900)] px-5 py-3 text-sm font-semibold text-[color:var(--bg)] shadow-[0_18px_40px_rgba(16,40,31,0.16)]"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {{ $credential['action']['label'] }}
                        </a>
                    </article>
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
