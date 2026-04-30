@php
    $transactions = [
        [
            'id' => 'TRX-9902',
            'queueLabel' => '#TRX-9902',
            'statusBadge' => ['label' => 'FLAGGED', 'classes' => 'bg-amber-100 text-amber-700'],
            'queueBorder' => 'border-l-sky-500',
            'queueTone' => '',
            'instrument' => 'USD_LIQ_POOL',
            'counterpartyCode' => 'HSBC_LDN',
            'queueValue' => '450,000.00 USD',
            'queueAge' => '2m ago',
            'workspaceBadge' => ['label' => 'HIGH RISK REVIEW', 'classes' => 'bg-amber-100 text-amber-800'],
            'initiatedAt' => '2023-10-27 08:14:02',
            'agent' => 'Sarah Ross',
            'source' => 'NORTH-04',
            'assetValue' => '450,000.00',
            'currency' => 'USD',
            'counterparty' => 'HSBC_LONDON_VAULT',
            'riskScore' => '78/100',
            'riskPercent' => 78,
            'comments' => [
                [
                    'type' => 'user',
                    'initials' => 'SR',
                    'avatarClasses' => 'bg-sky-100 text-sky-700',
                    'name' => 'Sarah Ross',
                    'role' => 'Compliance Lead',
                    'time' => '08:22 AM',
                    'message' => 'Flagged for manual review due to unexpected volume from NORTH-04 terminal. Historical daily average is $120k. This release is $450k.',
                    'tags' => ['#anomaly-detected', '#high-value'],
                    'nameInteractive' => true,
                ],
                [
                    'type' => 'system',
                    'message' => 'System: AML check completed. No hits found on sanctioned entities list for HSBC_LONDON_VAULT.',
                ],
                [
                    'type' => 'user',
                    'initials' => 'MK',
                    'avatarClasses' => 'bg-emerald-100 text-emerald-700',
                    'name' => 'Mark Kovach',
                    'role' => 'Audit Officer',
                    'time' => '09:12 AM',
                    'message' => 'Verified with North-04 desk manager. They confirmed this is a quarterly rebalancing event. Documents uploaded to the batch summary. Safe to proceed.',
                    'tags' => [],
                    'nameInteractive' => true,
                ],
            ],
        ],
        [
            'id' => 'TRX-9903',
            'queueLabel' => '#TRX-9903',
            'statusBadge' => ['label' => 'PENDING', 'classes' => 'bg-slate-100 text-slate-500'],
            'queueBorder' => 'border-l-transparent',
            'queueTone' => '',
            'instrument' => 'GOLD_PHYS_X',
            'counterpartyCode' => 'ZURICH_MET',
            'queueValue' => '12,400.00 XAU',
            'queueAge' => '14m ago',
            'workspaceBadge' => ['label' => 'PENDING REVIEW', 'classes' => 'bg-slate-100 text-slate-700'],
            'initiatedAt' => '2023-10-27 07:51:18',
            'agent' => 'John Dorian',
            'source' => 'ZURICH-MET',
            'assetValue' => '12,400.00',
            'currency' => 'XAU',
            'counterparty' => 'ZURICH_METALS_VAULT',
            'riskScore' => '41/100',
            'riskPercent' => 41,
            'comments' => [
                [
                    'type' => 'user',
                    'initials' => 'JD',
                    'avatarClasses' => 'bg-slate-200 text-slate-700',
                    'name' => 'John Dorian',
                    'role' => 'Operations Associate',
                    'time' => '08:04 AM',
                    'message' => 'Queued for secondary review while Zurich confirms vault transfer sequencing. No anomaly detected yet, but the release cannot move until the handoff reference is reconciled.',
                    'tags' => ['#handoff-check', '#pending-clearance'],
                    'nameInteractive' => true,
                ],
                [
                    'type' => 'user',
                    'initials' => 'SR',
                    'avatarClasses' => 'bg-sky-100 text-sky-700',
                    'name' => 'Sarah Ross',
                    'role' => 'Compliance Lead',
                    'time' => '08:19 AM',
                    'message' => 'Reviewed the routing notes. This one looks operational rather than suspicious. Leave it pending until the Zurich desk returns the missing settlement reference.',
                    'tags' => ['#ops-follow-up'],
                    'nameInteractive' => true,
                ],
            ],
        ],
        [
            'id' => 'TRX-9904',
            'queueLabel' => '#TRX-9904',
            'statusBadge' => ['label' => 'ERROR', 'classes' => 'bg-rose-100 text-rose-700'],
            'queueBorder' => 'border-l-transparent',
            'queueTone' => '',
            'instrument' => 'BTC_SETTLE_H1',
            'counterpartyCode' => 'INTER_LEDGER',
            'queueValue' => '1,024,192.55 USD',
            'queueAge' => '42m ago',
            'workspaceBadge' => ['label' => 'SETTLEMENT ERROR', 'classes' => 'bg-rose-100 text-rose-700'],
            'initiatedAt' => '2023-10-27 07:03:11',
            'agent' => 'Mina Park',
            'source' => 'INTER-LEDGER',
            'assetValue' => '1,024,192.55',
            'currency' => 'USD',
            'counterparty' => 'INTER_LEDGER_SETTLEMENT',
            'riskScore' => '92/100',
            'riskPercent' => 92,
            'comments' => [
                [
                    'type' => 'system',
                    'message' => 'System: Settlement failed after the receiving ledger rejected the destination hash. Automatic retry disabled until manual confirmation is attached.',
                ],
                [
                    'type' => 'user',
                    'initials' => 'MP',
                    'avatarClasses' => 'bg-violet-100 text-violet-700',
                    'name' => 'Mina Park',
                    'role' => 'Settlement Supervisor',
                    'time' => '07:26 AM',
                    'message' => 'This is a hard stop. The destination wallet reference differs from the approved instruction set. Freeze release until treasury signs off on a corrected settlement target.',
                    'tags' => ['#hard-stop', '#wallet-mismatch'],
                    'nameInteractive' => true,
                ],
                [
                    'type' => 'user',
                    'initials' => 'MK',
                    'avatarClasses' => 'bg-emerald-100 text-emerald-700',
                    'name' => 'Mark Kovach',
                    'role' => 'Audit Officer',
                    'time' => '07:41 AM',
                    'message' => 'Audit has logged the exception under the batch event trail. No release action should proceed until the corrected destination appears in both the approval memo and the ledger packet.',
                    'tags' => ['#audit-lock'],
                    'nameInteractive' => true,
                ],
            ],
        ],
    ];

    $activeTransaction = $transactions[0];
@endphp

<div
    class="harbor-ledger-workbench flex h-full min-h-0 flex-col overflow-hidden bg-slate-50 text-slate-800"
    data-harbor-ledger-slice
    data-harbor-transactions='@json($transactions)'
    data-harbor-queue-collapsed="false"
    data-harbor-summary-collapsed="true"
>
    <header class="harbor-ledger-header flex h-auto items-center justify-between border-b border-slate-200 bg-white px-4 lg:h-11">
        <div class="harbor-ledger-header__identity flex items-center gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-[6px] bg-sky-600 shadow-[0_6px_16px_rgba(2,132,199,0.18)]">
                <svg viewBox="0 0 24 24" fill="currentColor" class="h-[18px] w-[18px] text-white" aria-hidden="true">
                    <path d="M17 15l1.55 1.55c-.96 1.69-3.33 3.04-5.55 3.37V11h3V9h-3V7.82C14.16 7.4 15 6.3 15 5c0-1.65-1.35-3-3-3S9 3.35 9 5c0 1.3.84 2.4 2 2.82V9H8v2h3v8.92c-2.22-.33-4.59-1.68-5.55-3.37L7 15l-4-3v3c0 3.88 4.92 7 9 7s9-3.12 9-7v-3l-4 3ZM12 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1Z"/>
                </svg>
            </div>

            <div class="harbor-ledger-header__brand">
                <p class="text-[1.05rem] font-bold leading-none tracking-tight text-slate-900">Harbor Ledger</p>
                <span class="harbor-ledger-header__subtitle mt-1 block text-[10px] font-medium uppercase tracking-[0.28em] text-sky-600">Compliance Workbench v2.4</span>
            </div>
        </div>

        <div class="harbor-ledger-header__actions flex items-center gap-5">
            <div class="flex -space-x-2">
                <div data-harbor-interactive class="cursor-pointer flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-bold text-slate-700">JD</div>
                <div data-harbor-interactive class="cursor-pointer flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-sky-100 text-[10px] font-bold text-sky-700">SR</div>
                <div data-harbor-interactive class="cursor-pointer flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-emerald-100 text-[10px] font-bold text-emerald-700">MK</div>
                <div data-harbor-interactive class="cursor-pointer flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-violet-100 text-[10px] font-bold text-violet-700">MP</div>
            </div>

            <div class="h-5 w-px bg-slate-200"></div>

            <div class="flex items-center gap-3 text-slate-500">
                <button type="button" data-harbor-interactive class="cursor-pointer flex h-5 w-5 items-center justify-center text-slate-500 transition-colors hover:text-sky-600" aria-label="Notifications">
                    <svg viewBox="0 0 24 24" fill="currentColor" class="h-[18px] w-[18px]" aria-hidden="true">
                        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2Zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5S10.5 3.17 10.5 4v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2Z"/>
                    </svg>
                </button>
                <button type="button" data-harbor-interactive class="cursor-pointer flex h-5 w-5 items-center justify-center text-slate-500 transition-colors hover:text-sky-600" aria-label="Settings">
                    <svg viewBox="0 0 24 24" fill="currentColor" class="h-[18px] w-[18px]" aria-hidden="true">
                        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58ZM12 15.6c-1.98 0-3.6-1.62-3.6-3.6S10.02 8.4 12 8.4s3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6Z"/>
                    </svg>
                </button>
            </div>
        </div>
    </header>

    <div class="harbor-ledger-layout flex min-h-0 flex-1 overflow-hidden" data-harbor-ledger-layout>
        <aside class="harbor-ledger-side-rail harbor-ledger-side-rail--queue flex min-w-0 flex-col border-r border-slate-200 bg-white" data-harbor-review-queue data-harbor-panel="queue" data-harbor-panel-state="expanded">
            <button
                type="button"
                data-harbor-panel-toggle
                data-harbor-panel-target="queue"
                data-harbor-interactive
                class="harbor-ledger-side-rail__collapsed-tab harbor-ledger-side-rail__collapsed-tab--queue cursor-pointer items-center justify-center gap-2 border-b border-slate-200 bg-white px-2 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 transition-colors hover:bg-slate-50 hover:text-sky-700"
                aria-controls="harbor-review-queue-panel"
                aria-expanded="false"
                aria-label="Show review queue"
            >
                <svg viewBox="0 0 16 16" fill="none" class="h-4 w-4 shrink-0" aria-hidden="true">
                    <path d="M9.8 3.5 5.2 8l4.6 4.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>
                </svg>
                <span class="harbor-ledger-side-rail__collapsed-label">Queue</span>
            </button>

            <div id="harbor-review-queue-panel" class="flex min-h-0 flex-1 flex-col" data-harbor-panel-body>
                <div class="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-3">
                    <h5 class="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Review Queue</h5>
                    <div class="flex items-center gap-2">
                        <span data-harbor-interactive class="cursor-pointer rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-700">14 Active</span>
                        <button
                            type="button"
                            data-harbor-panel-toggle
                            data-harbor-panel-target="queue"
                            data-harbor-interactive
                            class="harbor-ledger-side-rail__toggle cursor-pointer flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-sky-200 hover:text-sky-700"
                            aria-controls="harbor-review-queue-panel"
                            aria-expanded="true"
                            aria-label="Hide review queue"
                        >
                            <svg viewBox="0 0 16 16" fill="none" class="harbor-ledger-side-rail__toggle-icon h-4 w-4" aria-hidden="true">
                                <path d="M10.1 3.5 5.5 8l4.6 4.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="border-b border-slate-100 p-3">
                    <label class="relative block">
                        <svg viewBox="0 0 20 20" fill="none" class="pointer-events-none absolute left-2 top-1.5 h-4 w-4 text-slate-400" aria-hidden="true">
                            <circle cx="8.5" cy="8.5" r="4.5" stroke="currentColor" stroke-width="1.6"/>
                            <path d="m12 12 4 4" stroke="currentColor" stroke-linecap="round" stroke-width="1.6"/>
                        </svg>
                        <input type="text" value="" readonly placeholder="Search batch or ID..." class="w-full rounded border-none bg-slate-100 py-1.5 pl-8 pr-3 text-xs text-slate-500 outline-none">
                    </label>
                </div>

                <div class="min-h-0 flex-1 overflow-hidden">
                    @foreach ($transactions as $transaction)
                        @php($isActive = $transaction['id'] === $activeTransaction['id'])
                        <button
                            type="button"
                            data-harbor-interactive
                            data-harbor-transaction-option
                            data-harbor-transaction-id="{{ $transaction['id'] }}"
                            aria-pressed="{{ $isActive ? 'true' : 'false' }}"
                            @class([
                                'harbor-review-row w-full border-b border-slate-50 border-l-4 px-4 py-[1.05rem] text-left transition-colors',
                                $transaction['queueBorder'],
                                $transaction['queueTone'],
                                'is-active' => $isActive,
                            ])
                        >
                            <div class="mb-1.5 flex items-start justify-between gap-2">
                                <span class="font-mono text-xs font-bold text-slate-900">{{ $transaction['queueLabel'] }}</span>
                                <span class="rounded px-1.5 py-0.5 text-[9px] font-medium {{ $transaction['statusBadge']['classes'] }}">{{ $transaction['statusBadge']['label'] }}</span>
                            </div>
                            <div class="truncate text-[11px] {{ $isActive ? 'font-medium' : '' }} text-slate-600">{{ $transaction['instrument'] }} • {{ $transaction['counterpartyCode'] }}</div>
                            <div class="mt-2.5 flex items-center justify-between gap-2">
                                <span class="font-mono text-xs font-medium text-slate-500">{{ $transaction['queueValue'] }}</span>
                                <span class="text-[10px] text-slate-400">{{ $transaction['queueAge'] }}</span>
                            </div>
                        </button>
                    @endforeach
                </div>

                <div class="harbor-system-trace border-t border-slate-800 bg-slate-900 text-slate-100" data-harbor-system-trace-root>
                    <button type="button" id="harbor-system-trace-toggle" aria-controls="harbor-system-trace-panel" aria-expanded="false" data-harbor-system-trace-toggle data-harbor-interactive class="flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-slate-800">
                        <div class="min-w-0">
                            <div class="flex items-center gap-2">
                                <span class="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-300">System Trace</span>
                                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                            </div>
                            <p class="mt-1 font-mono text-[9px] text-slate-500">Sync and event logs for the current workbench state</p>
                        </div>
                        <svg viewBox="0 0 16 16" fill="none" class="harbor-system-trace__chevron h-4 w-4 shrink-0 text-slate-400" aria-hidden="true">
                            <path d="m4.5 6.2 3.5 3.6 3.5-3.6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>
                        </svg>
                    </button>
                    <div id="harbor-system-trace-panel" aria-labelledby="harbor-system-trace-toggle" data-harbor-system-trace-panel class="harbor-system-trace__panel">
                        <div class="border-t border-slate-800 px-3 pb-3 pt-2">
                            <div class="space-y-1 font-mono text-[9px] text-slate-500">
                                <p>&gt; [09:44:01] SYNC: COLLAB_WORKBENCH</p>
                                <p>&gt; [09:44:12] PUSH: AUDIT_LOG_ENTRY_9902</p>
                                <p>&gt; [09:44:14] EVENT: USER_MK_UPLOAD_DOC</p>
                                <p>&gt; [09:44:22] SYNC_COMPLETE: LEDGER_STABLE</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>

        <main class="harbor-ledger-main flex min-w-0 flex-1 flex-col overflow-hidden bg-white" data-harbor-transaction>
            <div class="border-b border-slate-200 px-4 py-2.5">
                <div class="harbor-ledger-transaction-header items-start justify-between gap-4">
                    <div class="min-w-0">
                        <div class="harbor-ledger-transaction-header__top mb-2">
                            <span class="font-mono text-[0.8rem] font-bold text-slate-900 sm:text-[0.95rem]" data-harbor-active-transaction-label>TRANSACTION #{{ $activeTransaction['id'] }}</span>
                            <span data-harbor-active-badge class="cursor-pointer rounded px-1.5 py-0.5 text-[9px] font-bold sm:px-2 sm:py-1 sm:text-[10px] {{ $activeTransaction['workspaceBadge']['classes'] }}">{{ $activeTransaction['workspaceBadge']['label'] }}</span>
                        </div>
                        <div class="harbor-ledger-transaction-meta text-xs text-slate-500">
                            <span class="harbor-ledger-transaction-meta__item flex items-center gap-1">
                                <svg viewBox="0 0 16 16" fill="none" class="h-4 w-4" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.4"/><path d="M8 4.5v3.8l2.3 1.4" stroke="currentColor" stroke-linecap="round" stroke-width="1.4"/></svg>
                                <span data-harbor-active-initiated>Initiated {{ $activeTransaction['initiatedAt'] }}</span>
                            </span>
                            <span class="harbor-ledger-transaction-meta__item flex items-center gap-1">
                                <svg viewBox="0 0 16 16" fill="none" class="h-4 w-4" aria-hidden="true"><circle cx="8" cy="5.2" r="2.1" stroke="currentColor" stroke-width="1.4"/><path d="M4.4 12.2c.9-1.6 2.1-2.4 3.6-2.4s2.7.8 3.6 2.4" stroke="currentColor" stroke-linecap="round" stroke-width="1.4"/></svg>
                                <span data-harbor-active-agent>Agent: {{ $activeTransaction['agent'] }}</span>
                            </span>
                            <span class="harbor-ledger-transaction-meta__item flex items-center gap-1">
                                <svg viewBox="0 0 16 16" fill="none" class="h-4 w-4" aria-hidden="true"><path d="M2.8 6.3h10.4" stroke="currentColor" stroke-width="1.4"/><path d="M4.2 6.3V12M8 6.3V12m3.8-5.7V12" stroke="currentColor" stroke-width="1.4"/><path d="M2.2 12h11.6M2.8 5l5.2-2.4L13.2 5" stroke="currentColor" stroke-linejoin="round" stroke-width="1.4"/></svg>
                                <span data-harbor-active-source>Source: {{ $activeTransaction['source'] }}</span>
                            </span>
                        </div>
                    </div>
                    <div class="harbor-ledger-transaction-actions flex flex-wrap gap-2">
                        <button type="button" data-harbor-interactive class="cursor-pointer rounded bg-slate-100 px-3 py-2 text-[11px] font-bold text-slate-700 transition-colors hover:bg-slate-200">REQUEST DOCS</button>
                        <button type="button" data-harbor-interactive class="cursor-pointer flex items-center gap-2 rounded bg-emerald-600 px-3 py-2 text-[11px] font-bold text-white transition-colors hover:bg-emerald-700">
                            <svg viewBox="0 0 16 16" fill="none" class="h-4 w-4" aria-hidden="true"><circle cx="8" cy="8" r="6.2" fill="rgba(255,255,255,0.2)"/><path d="m5.1 8.2 1.8 1.8 4-4.2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/></svg>
                            APPROVE
                        </button>
                    </div>
                </div>

                <div class="harbor-ledger-metric-grid mt-3 grid gap-2.5">
                    <div class="rounded border border-slate-100 bg-slate-50 p-2.5"><div class="mb-1 text-[10px] font-bold uppercase text-slate-400">Asset Value</div><div class="font-mono text-[0.98rem] font-bold text-slate-900" data-harbor-active-asset-value>{{ $activeTransaction['assetValue'] }}</div></div>
                    <div class="rounded border border-slate-100 bg-slate-50 p-2.5"><div class="mb-1 text-[10px] font-bold uppercase text-slate-400">Currency</div><div class="font-mono text-[1.05rem] font-bold text-slate-900" data-harbor-active-currency>{{ $activeTransaction['currency'] }}</div></div>
                    <div class="rounded border border-slate-100 bg-slate-50 p-2.5"><div class="mb-1 text-[10px] font-bold uppercase text-slate-400">Counterparty</div><div class="truncate text-sm font-bold text-slate-900" data-harbor-active-counterparty>{{ $activeTransaction['counterparty'] }}</div></div>
                    <div class="rounded border border-slate-100 bg-slate-50 p-2.5">
                        <div class="mb-1 text-[10px] font-bold uppercase text-slate-400">Risk Score</div>
                        <div class="flex items-center gap-2">
                            <div class="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-200">
                                <div data-harbor-active-risk-bar class="h-full bg-amber-500" style="width: {{ $activeTransaction['riskPercent'] }}%"></div>
                            </div>
                            <span class="shrink-0 font-mono text-sm font-bold text-slate-900" data-harbor-active-risk-score>{{ $activeTransaction['riskScore'] }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="harbor-ledger-commentary-pane min-h-0 flex-1 bg-slate-50/30 px-4 py-2.5">
                <div class="harbor-ledger-commentary mx-auto min-h-0 w-full max-w-3xl" data-harbor-commentary-workspace>
                    <div class="harbor-ledger-commentary__intro">
                        <div class="harbor-ledger-commentary__intro-copy min-w-0">
                            <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Approval Notes</p>
                            <p class="mt-1 text-xs text-slate-500">Latest reviewer context before release approval.</p>
                        </div>
                        <span class="harbor-ledger-commentary__count">{{ count($activeTransaction['comments']) }} notes</span>
                    </div>

                    <div class="harbor-audit-thread relative min-h-0 flex-1 overflow-y-auto pr-1" data-harbor-commentary-scroller>
                        <div class="space-y-4 pb-3" data-harbor-commentary-thread>
                        @foreach ($activeTransaction['comments'] as $comment)
                            @if ($comment['type'] === 'system')
                                <div class="harbor-comment-card harbor-comment-card--system relative z-10 ml-12 flex gap-4">
                                    <div class="harbor-comment-card__avatar flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white bg-slate-800">
                                        <svg viewBox="0 0 16 16" fill="none" class="h-4 w-4 text-white" aria-hidden="true"><rect x="3.2" y="4.5" width="9.6" height="7.2" rx="1.1" stroke="currentColor" stroke-width="1.4"/><path d="M5.2 3.5v1M10.8 3.5v1M6 11.7v1.1M10 11.7v1.1M5.4 7.8h5.2" stroke="currentColor" stroke-linecap="round" stroke-width="1.2"/></svg>
                                    </div>
                                    <div class="harbor-comment-card__body flex-1 rounded-lg border border-slate-200 bg-slate-100 p-2.5"><p class="harbor-comment-card__message text-[11px] italic leading-[1.45] text-slate-600">{{ $comment['message'] }}</p></div>
                                </div>
                            @else
                                <div class="harbor-comment-card relative z-10 flex gap-4">
                                    <div data-harbor-interactive class="harbor-comment-card__avatar cursor-pointer flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white shadow-sm {{ $comment['avatarClasses'] }}"><span class="text-[10px] font-bold">{{ $comment['initials'] }}</span></div>
                                    <div class="harbor-comment-card__body flex-1 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                                        <div class="harbor-comment-card__header mb-1.5 flex items-center justify-between gap-2">
                                            <span class="text-xs font-bold text-slate-900">
                                                @if ($comment['nameInteractive'])
                                                    <span data-harbor-interactive class="cursor-pointer">{{ $comment['name'] }}</span>
                                                @else
                                                    <span>{{ $comment['name'] }}</span>
                                                @endif
                                                <span class="ml-1 font-normal text-slate-400">{{ $comment['role'] }}</span>
                                            </span>
                                            <span class="text-[10px] text-slate-400">{{ $comment['time'] }}</span>
                                        </div>
                                        <p class="harbor-comment-card__message text-[0.84rem] leading-[1.55] text-slate-700">{{ $comment['message'] }}</p>
                                        @if ($comment['tags'] !== [])
                                            <div class="harbor-comment-card__tags mt-2.5 flex gap-2">
                                                @foreach ($comment['tags'] as $tag)
                                                    <span data-harbor-interactive class="cursor-pointer rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">{{ $tag }}</span>
                                                @endforeach
                                            </div>
                                        @endif
                                    </div>
                                </div>
                            @endif
                        @endforeach
                        </div>
                    </div>

                    <div class="shrink-0 border-t border-slate-200 bg-white pt-2.5" data-harbor-commentary-composer>
                        <div class="harbor-ledger-commentary-composer flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2">
                            <button type="button" data-harbor-interactive class="cursor-pointer text-slate-400 hover:text-slate-600">
                                <svg viewBox="0 0 16 16" fill="none" class="h-5 w-5" aria-hidden="true"><circle cx="8" cy="8" r="6.4" stroke="currentColor" stroke-width="1.4"/><path d="M8 4.8v6.4M4.8 8h6.4" stroke="currentColor" stroke-linecap="round" stroke-width="1.6"/></svg>
                            </button>
                            <div class="flex-1 bg-transparent text-sm text-slate-400">Add commentary or tag a teammate...</div>
                            <button type="button" data-harbor-interactive class="cursor-pointer rounded bg-sky-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-sky-700">SEND</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <aside class="harbor-ledger-side-rail harbor-ledger-side-rail--summary flex min-w-0 flex-col border-l border-slate-200 bg-slate-50" data-harbor-batch-summary data-harbor-panel="summary" data-harbor-panel-state="collapsed">
            <button
                type="button"
                data-harbor-panel-toggle
                data-harbor-panel-target="summary"
                data-harbor-interactive
                class="harbor-ledger-side-rail__collapsed-tab harbor-ledger-side-rail__collapsed-tab--summary cursor-pointer items-center justify-center gap-2 border-b border-slate-200 bg-slate-50 px-2 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 transition-colors hover:bg-white hover:text-sky-700"
                aria-controls="harbor-batch-summary-panel"
                aria-expanded="true"
                aria-label="Show batch summary"
            >
                <span class="harbor-ledger-side-rail__collapsed-label">Summary</span>
                <svg viewBox="0 0 16 16" fill="none" class="h-4 w-4 shrink-0" aria-hidden="true">
                    <path d="M6.2 3.5 10.8 8l-4.6 4.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>
                </svg>
            </button>

            <div id="harbor-batch-summary-panel" class="flex min-h-0 flex-1 flex-col" data-harbor-panel-body>
                <div class="flex items-start justify-between gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
                    <div>
                        <h5 class="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Batch Summary</h5>
                        <div class="mt-1 font-mono text-[10px] text-slate-400">ID: BATCH_8442_REBAL</div>
                    </div>
                    <button
                        type="button"
                        data-harbor-panel-toggle
                        data-harbor-panel-target="summary"
                        data-harbor-interactive
                        class="harbor-ledger-side-rail__toggle harbor-ledger-side-rail__toggle--summary cursor-pointer flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-sky-200 hover:text-sky-700"
                        aria-controls="harbor-batch-summary-panel"
                        aria-expanded="false"
                        aria-label="Hide batch summary"
                    >
                        <svg viewBox="0 0 16 16" fill="none" class="harbor-ledger-side-rail__toggle-icon h-4 w-4" aria-hidden="true">
                            <path d="M6 3.5 10.6 8 6 12.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>
                        </svg>
                    </button>
                </div>
                <div class="flex flex-1 flex-col px-4 py-2">
                    <div class="space-y-3">
                        <div>
                            <label class="mb-2 block text-[10px] font-bold uppercase text-slate-400">Batch Health</label>
                            <div class="space-y-2">
                                <div class="flex items-center justify-between text-xs"><span class="text-slate-600">Verification Rate</span><span class="font-bold text-emerald-600">82%</span></div>
                                <div class="h-1.5 w-full rounded-full bg-slate-200"><div class="h-full w-[82%] rounded-full bg-emerald-500"></div></div>
                                <div class="flex items-center justify-between font-mono text-[10px] text-slate-400"><span>APPROVED: 12</span><span>WAITING: 02</span></div>
                            </div>
                        </div>
                        <div class="border-t border-slate-200 pt-3">
                            <label class="mb-2 block text-[10px] font-bold uppercase text-slate-400">Total Batch Value</label>
                            <div class="rounded border border-slate-200 bg-white p-2.5"><div class="font-mono text-sm font-bold text-slate-900">2,142,900.00</div><div class="mt-1 font-mono text-[10px] text-slate-400">USD EQUIVALENT</div></div>
                        </div>
                        <div class="border-t border-slate-200 pt-3">
                            <label class="mb-2 block text-[10px] font-bold uppercase text-slate-400">Audit Documents</label>
                            <div class="space-y-2">
                                <div data-harbor-interactive class="cursor-pointer flex items-center gap-2 rounded border border-slate-100 bg-white p-2 text-[10px] text-slate-600 transition-colors hover:bg-slate-50">
                                    <svg viewBox="0 0 16 16" fill="none" class="h-4 w-4 shrink-0 text-sky-500" aria-hidden="true"><path d="M4 2.5h5l3 3v8H4z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.3"/><path d="M9 2.5v3h3M6 8.1h4M6 10.6h4" stroke="currentColor" stroke-linecap="round" stroke-width="1.2"/></svg>
                                    <span class="truncate">Q4_Rebalance_Memo.pdf</span>
                                </div>
                                <div data-harbor-interactive class="cursor-pointer flex items-center gap-2 rounded border border-slate-100 bg-white p-2 text-[10px] text-slate-600 transition-colors hover:bg-slate-50">
                                    <svg viewBox="0 0 16 16" fill="none" class="h-4 w-4 shrink-0 text-sky-500" aria-hidden="true"><path d="M4 2.5h5l3 3v8H4z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.3"/><path d="M9 2.5v3h3M6 8.1h4M6 10.6h4" stroke="currentColor" stroke-linecap="round" stroke-width="1.2"/></svg>
                                    <span class="truncate">North-04_Logs_Oct.csv</span>
                                </div>
                                <button type="button" data-harbor-interactive class="cursor-pointer w-full rounded border-2 border-dashed border-slate-200 py-1.5 text-[10px] font-bold text-slate-400 transition-all hover:border-slate-300 hover:bg-slate-100">+ UPLOAD PROOF</button>
                            </div>
                        </div>
                    </div>
                    <div class="mt-auto pt-3">
                        <button type="button" data-harbor-interactive class="cursor-pointer mb-1.5 w-full rounded bg-slate-900 py-2.5 text-xs font-bold tracking-[0.18em] text-white transition-colors hover:bg-black">EXECUTE BATCH</button>
                        <button type="button" data-harbor-interactive class="cursor-pointer w-full rounded border border-rose-200 py-2.5 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-50">FREEZE ALL</button>
                    </div>
                </div>
            </div>
        </aside>
    </div>
</div>
