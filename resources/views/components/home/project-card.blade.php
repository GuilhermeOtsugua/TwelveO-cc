@props([
    'project',
])

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
