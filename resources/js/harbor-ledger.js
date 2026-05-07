document.querySelectorAll('[data-harbor-system-trace-root]').forEach((root) => {
    const toggle = root.querySelector('[data-harbor-system-trace-toggle]');

    if (!(toggle instanceof HTMLButtonElement)) {
        return;
    }

    toggle.addEventListener('click', () => {
        const isOpen = root.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
});

document.querySelectorAll('[data-harbor-ledger-slice]').forEach((slice) => {
    if (!(slice instanceof HTMLElement)) {
        return;
    }

    const transactions = JSON.parse(slice.dataset.harborTransactions ?? '[]');

    if (!Array.isArray(transactions) || transactions.length === 0) {
        return;
    }

    const options = Array.from(slice.querySelectorAll('[data-harbor-transaction-option]'));
    const transactionLabel = slice.querySelector('[data-harbor-active-transaction-label]');
    const transactionBadge = slice.querySelector('[data-harbor-active-badge]');
    const initiated = slice.querySelector('[data-harbor-active-initiated]');
    const agent = slice.querySelector('[data-harbor-active-agent]');
    const source = slice.querySelector('[data-harbor-active-source]');
    const assetValue = slice.querySelector('[data-harbor-active-asset-value]');
    const currency = slice.querySelector('[data-harbor-active-currency]');
    const counterparty = slice.querySelector('[data-harbor-active-counterparty]');
    const riskBar = slice.querySelector('[data-harbor-active-risk-bar]');
    const riskScore = slice.querySelector('[data-harbor-active-risk-score]');
    const thread = slice.querySelector('[data-harbor-commentary-thread]');
    const queuePanel = slice.querySelector('[data-harbor-panel="queue"]');
    const summaryPanel = slice.querySelector('[data-harbor-panel="summary"]');
    const panelToggles = Array.from(slice.querySelectorAll('[data-harbor-panel-toggle]'));

    const escapeHtml = (value) => String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    const renderComment = (comment) => {
        if (comment.type === 'system') {
            return `
                <div class="relative z-10 ml-12 flex gap-4">
                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white bg-slate-800">
                        <svg viewBox="0 0 16 16" fill="none" class="h-4 w-4 text-white" aria-hidden="true">
                            <rect x="3.2" y="4.5" width="9.6" height="7.2" rx="1.1" stroke="currentColor" stroke-width="1.4"/>
                            <path d="M5.2 3.5v1M10.8 3.5v1M6 11.7v1.1M10 11.7v1.1M5.4 7.8h5.2" stroke="currentColor" stroke-linecap="round" stroke-width="1.2"/>
                        </svg>
                    </div>
                    <div class="flex-1 rounded-lg border border-slate-200 bg-slate-100 p-2.5">
                        <p class="text-[11px] italic leading-[1.45] text-slate-600">${escapeHtml(comment.message)}</p>
                    </div>
                </div>
            `;
        }

        const tags = Array.isArray(comment.tags) && comment.tags.length > 0
            ? `<div class="mt-2.5 flex gap-2">${comment.tags.map((tag) => `<span data-harbor-interactive class="cursor-pointer rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">${escapeHtml(tag)}</span>`).join('')}</div>`
            : '';

        const nameMarkup = comment.nameInteractive
            ? `<span data-harbor-interactive class="cursor-pointer">${escapeHtml(comment.name)}</span>`
            : `<span>${escapeHtml(comment.name)}</span>`;

        return `
            <div class="relative z-10 flex gap-4">
                <div data-harbor-interactive class="cursor-pointer flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white shadow-sm ${escapeHtml(comment.avatarClasses)}">
                    <span class="text-[10px] font-bold">${escapeHtml(comment.initials)}</span>
                </div>
                <div class="flex-1 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                    <div class="mb-1.5 flex items-center justify-between gap-2">
                        <span class="text-xs font-bold text-slate-900">${nameMarkup}<span class="ml-1 font-normal text-slate-400">${escapeHtml(comment.role)}</span></span>
                        <span class="text-[10px] text-slate-400">${escapeHtml(comment.time)}</span>
                    </div>
                    <p class="text-[0.84rem] leading-[1.55] text-slate-700">${escapeHtml(comment.message)}</p>
                    ${tags}
                </div>
            </div>
        `;
    };

    const setActiveTransaction = (transactionId) => {
        const nextTransaction = transactions.find((transaction) => transaction.id === transactionId);

        if (!nextTransaction) {
            return;
        }

        options.forEach((option) => {
            if (!(option instanceof HTMLElement)) {
                return;
            }

            const isActive = option.dataset.harborTransactionId === transactionId;

            option.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            option.classList.toggle('is-active', isActive);
            option.classList.toggle('bg-sky-50/50', isActive);
            option.classList.toggle('border-l-sky-500', isActive);
            option.classList.toggle('border-l-transparent', !isActive);
            option.classList.toggle('font-medium', isActive);
        });

        if (transactionLabel) {
            transactionLabel.textContent = `TRANSACTION #${nextTransaction.id}`;
        }

        if (transactionBadge instanceof HTMLElement) {
            transactionBadge.textContent = nextTransaction.workspaceBadge.label;
            transactionBadge.className = `cursor-pointer rounded px-2 py-1 text-[10px] font-bold ${nextTransaction.workspaceBadge.classes}`;
        }

        if (initiated) {
            initiated.textContent = `Initiated ${nextTransaction.initiatedAt}`;
        }

        if (agent) {
            agent.textContent = `Agent: ${nextTransaction.agent}`;
        }

        if (source) {
            source.textContent = `Source: ${nextTransaction.source}`;
        }

        if (assetValue) {
            assetValue.textContent = nextTransaction.assetValue;
        }

        if (currency) {
            currency.textContent = nextTransaction.currency;
        }

        if (counterparty) {
            counterparty.textContent = nextTransaction.counterparty;
        }

        if (riskBar instanceof HTMLElement) {
            riskBar.style.width = `${nextTransaction.riskPercent}%`;
        }

        if (riskScore) {
            riskScore.textContent = nextTransaction.riskScore;
        }

        if (thread instanceof HTMLElement) {
            thread.innerHTML = nextTransaction.comments.map(renderComment).join('');
        }
    };

    const setPanelCollapsedState = (panelName, collapsed) => {
        const panel = panelName === 'queue' ? queuePanel : summaryPanel;

        if (!(panel instanceof HTMLElement)) {
            return;
        }

        const body = panel.querySelector('[data-harbor-panel-body]');
        const controls = panelToggles.filter((toggle) => toggle instanceof HTMLElement && toggle.dataset.harborPanelTarget === panelName);
        const regionLabel = panelName === 'queue' ? 'review queue' : 'batch summary';
        const nextAction = collapsed ? 'Show' : 'Hide';

        panel.dataset.harborPanelState = collapsed ? 'collapsed' : 'expanded';

        if (body instanceof HTMLElement) {
            body.setAttribute('aria-hidden', collapsed ? 'true' : 'false');
        }

        slice.dataset[panelName === 'queue' ? 'harborQueueCollapsed' : 'harborSummaryCollapsed'] = collapsed ? 'true' : 'false';

        controls.forEach((toggle) => {
            if (!(toggle instanceof HTMLElement)) {
                return;
            }

            toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
            toggle.setAttribute('aria-label', `${nextAction} ${regionLabel}`);
        });
    };

    const togglePanel = (panelName) => {
        const panel = panelName === 'queue' ? queuePanel : summaryPanel;

        if (!(panel instanceof HTMLElement)) {
            return;
        }

        const isCollapsed = panel.dataset.harborPanelState === 'collapsed';

        setPanelCollapsedState(panelName, !isCollapsed);
    };

    options.forEach((option) => {
        option.addEventListener('click', () => {
            if (!(option instanceof HTMLElement)) {
                return;
            }

            setActiveTransaction(option.dataset.harborTransactionId ?? '');
        });
    });

    panelToggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            if (!(toggle instanceof HTMLElement)) {
                return;
            }

            togglePanel(toggle.dataset.harborPanelTarget ?? '');
        });
    });

    setPanelCollapsedState('queue', slice.dataset.harborQueueCollapsed === 'true');
    setPanelCollapsedState('summary', slice.dataset.harborSummaryCollapsed === 'true');
});
