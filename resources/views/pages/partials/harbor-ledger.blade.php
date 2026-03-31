<div class="mt-5 grid gap-4 xl:items-start xl:grid-cols-[minmax(0,1.36fr)_minmax(18.75rem,0.64fr)]" data-tdd-decision-flow>
    <section class="project-surface__harbor-console rounded-[1.6rem] border border-[rgba(242,207,140,0.28)] p-4 shadow-[0_32px_80px_rgba(0,0,0,0.28)] sm:p-5" data-tdd-console data-tdd-region="focus">
        <div class="project-surface__harbor-console-shell" data-tdd-quote-sheet>
            <div class="project-surface__harbor-console-topline">
                <div class="max-w-2xl">
                    <p class="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-[color:rgba(244,239,230,0.58)]">
                        {{ $project['surface']['focus']['label'] }}
                    </p>
                    <div class="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p class="font-display text-[2rem] leading-[0.9] tracking-[-0.05em] text-[color:rgba(244,239,230,0.98)] sm:text-[2.35rem]">
                                {{ $project['surface']['focus']['title'] }}
                            </p>
                            <p class="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[color:rgba(244,239,230,0.62)]">
                                Quote {{ $project['surface']['focus']['quote'] }}
                            </p>
                        </div>
                        <div class="project-surface__harbor-state-pill">
                            <span class="project-surface__harbor-state-dot"></span>
                            <span>{{ $project['surface']['focus']['status'] }}</span>
                        </div>
                    </div>
                </div>

                <aside class="project-surface__harbor-lock-card">
                    <p class="text-[0.56rem] font-semibold uppercase tracking-[0.24em] text-[color:rgba(10,24,18,0.44)]">
                        {{ $project['surface']['focus']['gate']['label'] }}
                    </p>
                    <p class="project-surface__harbor-lock-state mt-2">
                        {{ $project['surface']['focus']['gate']['title'] }}
                    </p>
                    <p class="mt-3 text-sm leading-6 text-[color:rgba(16,40,31,0.7)]">
                        {{ $project['surface']['focus']['gate']['detail'] }}
                    </p>
                </aside>
            </div>

            <div class="mt-5 flex flex-wrap gap-2">
                <span class="project-surface__harbor-meta-chip">{{ $project['surface']['focus']['meta']['owner'] }}</span>
                <span class="project-surface__harbor-meta-chip">{{ $project['surface']['focus']['meta']['motion'] }}</span>
                <span class="project-surface__harbor-meta-chip">{{ $project['surface']['focus']['meta']['destination'] }}</span>
            </div>

            <div class="project-surface__harbor-console-grid mt-5">
                <div class="project-surface__harbor-sheet">
                    <section class="project-surface__harbor-hold-strip">
                        <div class="max-w-2xl">
                            <p class="text-[0.56rem] font-semibold uppercase tracking-[0.24em] text-[color:rgba(16,40,31,0.48)]">
                                {{ $project['surface']['focus']['banner']['label'] }}
                            </p>
                            <p class="mt-3 font-display text-[1.4rem] leading-tight tracking-[-0.04em] text-[color:var(--green-900)]">
                                {{ $project['surface']['focus']['banner']['title'] }}
                            </p>
                            <p class="mt-3 text-sm leading-7 text-[color:rgba(16,40,31,0.74)]">
                                {{ $project['surface']['focus']['banner']['detail'] }}
                            </p>
                        </div>

                        <div class="mt-4 flex flex-wrap gap-2">
                            @foreach ($project['surface']['focus']['banner']['chips'] as $chip)
                                <span class="project-surface__harbor-banner-chip">{{ $chip }}</span>
                            @endforeach
                        </div>
                    </section>

                    <div class="project-surface__harbor-kpi-grid mt-4">
                        @foreach ($project['surface']['focus']['financials'] as $panel)
                            <article class="project-surface__harbor-kpi-card">
                                <p class="text-[0.54rem] font-semibold uppercase tracking-[0.24em] text-[color:rgba(244,239,230,0.54)]">
                                    {{ $panel['label'] }}
                                </p>
                                <p class="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-[color:rgba(244,239,230,0.96)]">
                                    {{ $panel['value'] }}
                                </p>
                            </article>
                        @endforeach
                    </div>

                    <section class="project-surface__harbor-approval mt-4" data-tdd-approval-lane>
                        <div class="max-w-xl">
                            <p class="text-[0.56rem] font-semibold uppercase tracking-[0.24em] text-[color:rgba(244,239,230,0.5)]">
                                {{ $project['surface']['approval']['label'] }}
                            </p>
                            <p class="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-[color:rgba(244,239,230,0.92)]">
                                {{ $project['surface']['approval']['value'] }}
                            </p>
                            <p class="mt-3 text-sm leading-7 text-[color:rgba(244,239,230,0.72)]">
                                {{ $project['surface']['approval']['detail'] }}
                            </p>
                        </div>

                        <div class="project-surface__harbor-stage-row mt-5">
                            @foreach ($project['surface']['approval']['stages'] as $stage)
                                <article
                                    @class([
                                        'project-surface__harbor-stage',
                                        'is-pass' => $stage['tone'] === 'pass',
                                        'is-pending' => $stage['tone'] === 'pending',
                                        'is-blocked' => $stage['tone'] === 'blocked',
                                    ])
                                    data-tdd-approval-stage
                                >
                                    <span class="project-surface__harbor-stage-dot"></span>
                                    <p class="max-w-[8rem] text-center text-[0.56rem] font-semibold uppercase tracking-[0.2em] text-[color:rgba(244,239,230,0.52)]" data-tdd-stage-label>
                                        {{ $stage['label'] }}
                                    </p>
                                    <p class="mt-2 max-w-[8rem] text-center text-sm font-semibold uppercase tracking-[0.14em] text-[color:rgba(244,239,230,0.94)]">
                                        {{ $stage['status'] }}
                                    </p>
                                </article>
                            @endforeach
                        </div>

                        <div class="project-surface__harbor-activity-list mt-4">
                            @foreach ($project['surface']['focus']['timeline'] as $step)
                                <div class="project-surface__harbor-activity">
                                    <div class="flex items-center gap-3">
                                        <span class="project-surface__harbor-activity-dot"></span>
                                        <p class="text-sm font-medium text-[color:rgba(244,239,230,0.86)]">
                                            {{ $step['label'] }}
                                        </p>
                                    </div>
                                    <p class="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[color:rgba(244,239,230,0.6)]">
                                        {{ $step['status'] }}
                                    </p>
                                </div>
                            @endforeach
                        </div>
                    </section>
                </div>

                <aside class="project-surface__harbor-action-lock" data-tdd-release-action>
                    <p class="text-[0.56rem] font-semibold uppercase tracking-[0.24em] text-[color:rgba(244,239,230,0.5)]">
                        {{ $project['surface']['focus']['action']['label'] }}
                    </p>
                    <p class="mt-3 font-display text-[1.55rem] leading-tight tracking-[-0.04em] text-[color:rgba(244,239,230,0.96)]">
                        {{ $project['surface']['focus']['action']['title'] }}
                    </p>
                    <p class="project-surface__harbor-lock-state mt-4">
                        {{ $project['surface']['focus']['action']['state'] }}
                    </p>
                    <p class="mt-4 text-sm leading-7 text-[color:rgba(244,239,230,0.76)]">
                        {{ $project['surface']['focus']['action']['detail'] }}
                    </p>

                    <ul class="project-surface__harbor-blocker-list mt-5" role="list">
                        @foreach ($project['surface']['focus']['action']['supporting'] as $item)
                            <li>{{ $item }}</li>
                        @endforeach
                    </ul>

                    <div class="mt-6 space-y-3">
                        <button
                            type="button"
                            class="project-surface__harbor-disabled inline-flex w-fit items-center justify-center rounded-[1rem] px-5 py-3 text-sm font-semibold"
                            disabled
                            aria-disabled="true"
                            data-tdd-blocked-button
                        >
                            {{ $project['surface']['release']['cta']['primary'] }}
                        </button>
                        <p class="text-center text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[color:rgba(244,239,230,0.5)]">
                            {{ $project['surface']['release']['footer'] }}
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    </section>

    <div class="grid gap-4 content-start" data-tdd-support-stack>
        <section class="project-surface__harbor-evidence rounded-[1.45rem] border border-[rgba(244,239,230,0.12)] p-4" data-tdd-region="evidence">
            <div class="flex items-start justify-between gap-3">
                <div class="max-w-md">
                    <p class="text-[0.56rem] font-semibold uppercase tracking-[0.24em] text-[color:rgba(16,40,31,0.48)]">
                        {{ $project['surface']['evidence']['label'] }}
                    </p>
                    <p class="mt-2 font-display text-[1.45rem] leading-tight tracking-[-0.04em] text-[color:var(--green-900)]">
                        {{ $project['surface']['evidence']['title'] }}
                    </p>
                </div>
                <span class="project-surface__harbor-rail-badge">
                    {{ $project['surface']['evidence']['casesTitle'] }}
                </span>
            </div>

            <p class="mt-4 text-sm leading-7 text-[color:rgba(16,40,31,0.72)]">
                {{ $project['surface']['evidence']['detail'] }}
            </p>

            <div class="project-surface__harbor-packet-stack mt-5" data-tdd-evidence-packets>
                @foreach ($project['surface']['evidence']['packets'] as $packet)
                    <article
                        @class([
                            'project-surface__harbor-packet',
                            'is-active' => $packet['tone'] === 'active',
                            'is-blocked' => $packet['tone'] === 'blocked',
                        ])
                        data-tdd-evidence-packet
                    >
                        <div class="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <span class="project-surface__harbor-packet-tab self-start">
                                {{ $packet['label'] }}
                            </span>
                            <span class="project-surface__harbor-packet-status self-start text-left">
                                {{ $packet['status'] }}
                            </span>
                        </div>
                        <p class="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--green-900)]">
                            {{ $packet['title'] }}
                        </p>
                        <p class="mt-3 text-sm leading-7 text-[color:rgba(16,40,31,0.72)]">
                            {{ $packet['detail'] }}
                        </p>
                        <ul class="project-surface__harbor-packet-list mt-4" role="list">
                            @foreach ($packet['items'] as $item)
                                <li>{{ $item }}</li>
                            @endforeach
                        </ul>
                    </article>
                @endforeach
            </div>

            <section class="project-surface__harbor-scenarios mt-5" data-tdd-scenario-queue data-tdd-scenario-matrix>
                <div class="flex items-center justify-between gap-3">
                    <p class="text-[0.56rem] font-semibold uppercase tracking-[0.24em] text-[color:rgba(16,40,31,0.48)]">
                        {{ $project['surface']['evidence']['casesLabel'] }}
                    </p>
                    <p class="text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[color:rgba(16,40,31,0.58)]">
                        {{ $project['surface']['evidence']['casesTitle'] }}
                    </p>
                </div>

                <div class="mt-3 space-y-2.5">
                    @foreach ($project['surface']['evidence']['cases'] as $case)
                        <section class="project-surface__harbor-scenario" data-tdd-scenario-case>
                            <div class="flex items-center justify-between gap-3">
                                <p class="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--green-900)]">
                                    {{ $case['name'] }}
                                </p>
                                <span
                                    @class([
                                        'rounded-full px-3 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.18em]',
                                        'bg-[rgba(159,209,167,0.18)] text-[color:#1f5e33]' => $case['tone'] === 'pass',
                                        'bg-[rgba(223,120,101,0.16)] text-[color:#8f3c2e]' => $case['tone'] === 'blocked',
                                    ])
                                >
                                    {{ $case['result'] }}
                                </span>
                            </div>
                            <p class="mt-3 text-sm leading-7 text-[color:rgba(16,40,31,0.72)]">
                                {{ $case['detail'] }}
                            </p>
                        </section>
                    @endforeach
                </div>
            </section>
        </section>

        <section class="project-surface__harbor-release rounded-[1.45rem] border border-[rgba(242,207,140,0.18)] p-4" data-tdd-lock-rail data-tdd-release-gates data-tdd-region="release">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div class="max-w-md">
                    <p class="text-[0.56rem] font-semibold uppercase tracking-[0.24em] text-[color:rgba(244,239,230,0.5)]">
                        {{ $project['surface']['release']['label'] }}
                    </p>
                    <p class="mt-2 font-display text-[1.45rem] leading-tight tracking-[-0.04em] text-[color:rgba(244,239,230,0.96)]">
                        {{ $project['surface']['release']['title'] }}
                    </p>
                </div>
                <span class="project-surface__harbor-owner-pill whitespace-normal text-center">
                    {{ $project['surface']['release']['owner'] }}
                </span>
            </div>

            <p class="mt-4 text-sm leading-7 text-[color:rgba(244,239,230,0.76)]">
                {{ $project['surface']['release']['detail'] }}
            </p>

            <div class="project-surface__harbor-lock-summary mt-5">
                <p class="text-[0.56rem] font-semibold uppercase tracking-[0.22em] text-[color:rgba(244,239,230,0.5)]">
                    Live lock state
                </p>
                <p class="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-[color:#f2cf8c]">
                    {{ $project['surface']['release']['summary'] }}
                </p>
            </div>

            <div class="mt-5 space-y-2.5">
                @foreach ($project['surface']['release']['checks'] as $check)
                    <div
                        @class([
                            'project-surface__harbor-gate',
                            'is-pass' => $check['tone'] === 'pass',
                            'is-pending' => $check['tone'] === 'pending',
                            'is-blocked' => $check['tone'] === 'blocked',
                        ])
                        data-tdd-release-check
                    >
                        <div class="flex min-w-0 items-center gap-3">
                            <span class="project-surface__harbor-gate-dot"></span>
                            <p class="min-w-0 text-sm leading-6 text-[color:rgba(244,239,230,0.84)]">
                                {{ $check['label'] }}
                            </p>
                        </div>
                        <span class="self-start whitespace-nowrap text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[color:rgba(244,239,230,0.72)]">
                            {{ $check['status'] }}
                        </span>
                    </div>
                @endforeach
            </div>

            <div class="project-surface__harbor-next-step mt-5">
                <p class="text-[0.56rem] font-semibold uppercase tracking-[0.2em] text-[color:rgba(244,239,230,0.48)]">
                    Next move
                </p>
                <p class="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-[color:rgba(244,239,230,0.94)]">
                    {{ $project['surface']['release']['cta']['secondary'] }}
                </p>
            </div>
        </section>
    </div>
</div>
