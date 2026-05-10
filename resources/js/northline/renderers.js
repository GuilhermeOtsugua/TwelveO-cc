import {
    northlineIconMap,
    northlineStudentsFilterCycle,
    northlineStudentsFilterLabels,
} from './config';

export function escapeNorthlineHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}



export function renderNorthlineRollingText(text, wrapperClass = '') {
    const safeText = escapeNorthlineHtml(text);

    return `
        <span class="northline-rolling-text ${escapeNorthlineHtml(wrapperClass)}" data-northline-rolling-text aria-label="${safeText}">
            <span class="northline-rolling-text__track">
                <span class="northline-rolling-text__copy">${safeText}</span>
                <span class="northline-rolling-text__copy northline-rolling-text__copy--clone" aria-hidden="true">${safeText}</span>
            </span>
        </span>
    `;
}



export function renderNorthlineContextChip(classroom) {
    return `
        <span class="northline-context-chip">
            <span class="northline-context-chip__dot" aria-hidden="true"></span>
            <span class="northline-context-chip__label">${escapeNorthlineHtml(classroom.label)}</span>
            <span class="northline-context-chip__name">${escapeNorthlineHtml(classroom.name)}</span>
        </span>
    `;
}



export function renderNorthlineActionButton(action) {
    const toneClass = action.tone === 'teal'
        ? 'northline-primary-cta--teal'
        : action.tone === 'coral'
            ? 'northline-primary-cta--sand'
            : 'northline-primary-cta--slate';

    const attribute = action.kind === 'workflow'
        ? `data-northline-workflow-action="${escapeNorthlineHtml(action.value)}"`
        : 'data-northline-trigger-alerts';

    return `
        <button type="button" class="northline-primary-cta ${toneClass}" ${attribute}>
            ${escapeNorthlineHtml(action.label)}
        </button>
    `;
}



export function getNorthlineStatusTone(label) {
    const normalizedLabel = String(label).toLowerCase();

    if (normalizedLabel.includes('due soon') || normalizedLabel.includes('late') || normalizedLabel.includes('alerts')) {
        return 'coral';
    }

    if (normalizedLabel.includes('ready') || normalizedLabel.includes('posted') || normalizedLabel.includes('sent')) {
        return 'teal';
    }

    if (normalizedLabel.includes('draft') || normalizedLabel.includes('queue') || normalizedLabel.includes('planning')) {
        return 'slate';
    }

    return 'sand';
}



export function renderNorthlineBadge(label, variant = 'info', tone = null) {
    if (variant === 'status') {
        const statusTone = tone ?? getNorthlineStatusTone(label);

        return `<span class="northline-status-chip northline-status-chip--${escapeNorthlineHtml(statusTone)}"><span>${escapeNorthlineHtml(label)}</span></span>`;
    }

    if (variant === 'timestamp') {
        return `<span class="northline-timestamp-chip"><span>${escapeNorthlineHtml(label)}</span></span>`;
    }

    return `<span class="northline-list-chip"><span>${escapeNorthlineHtml(label)}</span></span>`;
}



export function renderNorthlineTemporalToken(label, tone = null) {
    if (!label) {
        return '';
    }

    return renderNorthlineBadge(label, 'status', tone);
}

export function formatNorthlineMobileTime(label) {
    if (!label) {
        return 'Pending';
    }

    return escapeNorthlineHtml(label)
        .replace(/^Submitted\s+/i, '')
        .replace(/^Pending\s+submission$/i, 'Pending');
}

function renderNorthlineMetricStatus(status, priority) {
    const statusText = String(status ?? '');

    if (!priority) {
        return escapeNorthlineHtml(statusText);
    }

    const percentageMatch = statusText.match(/^(\d+(?:\.\d+)?%)(.*)$/);

    if (!percentageMatch) {
        return escapeNorthlineHtml(statusText);
    }

    const [, percentage, suffix] = percentageMatch;

    return `<span class="northline-status-metric__status--priority">${escapeNorthlineHtml(percentage)}</span>${escapeNorthlineHtml(suffix)}`;
}



export function renderNorthlineMetric(metric) {
    const statusClass = [
        'northline-status-metric__status',
        metric.tone === 'coral' ? 'text-[#ff4b5c]' : 'text-[#0b7b77]',
    ].filter(Boolean).join(' ');
    const statusMarkup = renderNorthlineMetricStatus(metric.status, metric.priority);

    return `
        <button type="button" class="northline-status-metric ${metric.tone === 'coral' ? 'northline-status-metric--coral' : ''}" data-northline-metric="${escapeNorthlineHtml(metric.id)}">
            <div class="flex items-end justify-between gap-2.5">
                <div class="flex items-end gap-2">
                    <span class="northline-display text-[1.82rem] font-black leading-none text-slate-900">${escapeNorthlineHtml(metric.value)}</span>
                    <span class="northline-stat-label">${escapeNorthlineHtml(metric.label)}</span>
                </div>
                <span class="${escapeNorthlineHtml(statusClass)}">${statusMarkup}</span>
            </div>
            <div class="northline-progress">
                <span class="northline-progress__fill ${metric.tone === 'coral' ? 'bg-[#ff4b5c]' : 'bg-[#0b7b77]'}" style="width: ${metric.progress}%"></span>
            </div>
        </button>
    `;
}



export function renderNorthlineActionCard(action) {
    const icon = northlineIconMap[action.icon] ?? 'apps';

    return `
        <button type="button" class="northline-action-card group northline-action-card--${escapeNorthlineHtml(action.tone)}" data-northline-workflow-action="${escapeNorthlineHtml(action.id)}">
            <div class="northline-action-icon">
                <span class="material-symbols-outlined text-[1.65rem]" aria-hidden="true">${escapeNorthlineHtml(icon)}</span>
            </div>
            <span class="northline-action-label">${escapeNorthlineHtml(action.label)}</span>
        </button>
    `;
}



export function renderNorthlineMobileActionCard(action) {
    const icon = northlineIconMap[action.icon] ?? 'apps';
    const isActive = ['bulk-grading', 'class-message'].includes(action.id);
    const actionAttribute = isActive
        ? `data-northline-workflow-action="${escapeNorthlineHtml(action.id)}"`
        : 'disabled aria-disabled="true" data-northline-preview-action';

    return `
        <button type="button" class="northline-mobile-action northline-mobile-action--${escapeNorthlineHtml(action.tone)} ${isActive ? '' : 'northline-mobile-action--preview'}" ${actionAttribute}>
            <span class="northline-mobile-action__icon">
                <span class="material-symbols-outlined" aria-hidden="true">${escapeNorthlineHtml(icon)}</span>
            </span>
            <span class="northline-mobile-action__copy">
                <span class="northline-mobile-action__label">${escapeNorthlineHtml(action.label)}</span>
            </span>
        </button>
    `;
}



export function renderNorthlineMobileStatusMetric(metric) {
    const statusMarkup = metric.id === 'late-submits'
        ? renderNorthlineRollingText(
            metric.status,
            'northline-mobile-status-metric__status northline-mobile-status-metric__status--rolling northline-rolling-text--overflow-reveal',
        )
        : `<span class="northline-mobile-status-metric__status">${escapeNorthlineHtml(metric.status)}</span>`;

    return `
        <div class="northline-mobile-status-metric northline-mobile-status-metric--${escapeNorthlineHtml(metric.tone ?? 'teal')}">
            <span class="northline-mobile-status-metric__value">${escapeNorthlineHtml(metric.value)}</span>
            <span class="northline-mobile-status-metric__copy">
                <span class="northline-mobile-status-metric__label">${escapeNorthlineHtml(metric.label)}</span>
                ${statusMarkup}
            </span>
        </div>
    `;
}



export function renderNorthlineMobileHub(classroom, workflowActions) {
    const statusMetrics = classroom.metrics.slice(0, 3);
    const firstAssignment = classroom.gradingQueue?.[0];
    const firstCheckIn = classroom.checkIns?.[0];
    const activeActions = workflowActions.filter((action) => ['bulk-grading', 'class-message'].includes(action.id));
    const previewActions = workflowActions.filter((action) => !['bulk-grading', 'class-message'].includes(action.id));
    const mobileActions = [...activeActions, ...previewActions];

    return `
        <section class="northline-mobile-hub" aria-label="Teacher action hub">
            <div class="northline-mobile-hub__metrics">
                <div class="northline-mobile-hub__metrics-header">
                    <p class="northline-mobile-hub__kicker">Grading & Submission Status</p>
                </div>
                <div class="northline-mobile-hub__metric-grid">
                    ${statusMetrics.map((metric) => renderNorthlineMobileStatusMetric(metric)).join('')}
                </div>
            </div>
            <div class="northline-mobile-actions">
                ${mobileActions.map((action) => renderNorthlineMobileActionCard(action)).join('')}
            </div>
            <div class="northline-mobile-hub__bottom">
                <div>
                    <span class="northline-mobile-hub__bottom-label">Follow-up</span>
                    <strong>${escapeNorthlineHtml(firstCheckIn?.title ?? 'Classroom support is ready')}</strong>
                </div>
                <button type="button" data-northline-open-grading="${escapeNorthlineHtml(firstAssignment?.id ?? '')}">
                    Review queue
                </button>
            </div>
        </section>
    `;
}



export function renderNorthlineActionableItem(item, config) {
    const icon = northlineIconMap[item.icon] ?? config.fallbackIcon;
    const badgeToneClass = item.badgeTone === 'coral' || String(item.badge).toLowerCase().includes('24h')
        ? 'northline-item-meta--alert'
        : 'northline-item-meta--muted';

    return `
        <button type="button" class="northline-list-item northline-list-item--button ${escapeNorthlineHtml(config.rowClass ?? '')}" aria-label="${escapeNorthlineHtml(config.ariaLabel(item.title))}" ${escapeNorthlineHtml(config.attribute)}="${escapeNorthlineHtml(item.id)}">
            <span class="northline-list-item__icon northline-list-item__icon--${escapeNorthlineHtml(item.tone)}">
                <span class="material-symbols-outlined text-[1rem]" aria-hidden="true">${escapeNorthlineHtml(icon)}</span>
            </span>
            <span class="northline-list-item__content ${escapeNorthlineHtml(config.contentClass ?? '')}">
                <span class="northline-item-title">${renderNorthlineRollingText(item.title, 'northline-item-title__roll')}</span>
                <span class="northline-item-meta-row">
                    <span class="northline-item-meta ${badgeToneClass}">${escapeNorthlineHtml(item.badge)}</span>
                    <span class="northline-item-meta">${escapeNorthlineHtml(item.meta)}</span>
                </span>
            </span>
        </button>
    `;
}



export function renderNorthlineQueueItem(item) {
    return renderNorthlineActionableItem(item, {
        attribute: 'data-northline-open-grading',
        ariaLabel: (title) => `Open grading item: ${title}`,
        fallbackIcon: 'history_edu',
    });
}



export function renderNorthlineEventItem(item) {
    return renderNorthlineActionableItem(item, {
        attribute: 'data-northline-open-event',
        ariaLabel: (title) => `Open event: ${title}`,
        fallbackIcon: 'event_available',
        rowClass: 'northline-list-item--event',
        contentClass: 'northline-event-item__content',
    });
}



export function formatNorthlineCount(value) {
    return String(value).padStart(2, '0');
}



export function renderNorthlineDashboard(classroom, workflowActions) {
    const checkInCount = formatNorthlineCount(classroom.checkIns?.length ?? 0);
    const gradingQueueMeta = `${classroom.gradingQueue.length} ${classroom.gradingQueue.length === 1 ? 'item' : 'items'} to review`;

    return `
        <div class="northline-dashboard-layout h-full">
            <div class="northline-dashboard-stack h-full min-h-0 gap-3.5">
                ${renderNorthlineMobileHub(classroom, workflowActions)}
                <div class="northline-dashboard-desktop">
                    <div class="northline-dashboard-summary shrink-0 gap-3.5">
                        <section class="northline-panel northline-status-panel" data-northline-status-board>
                            <div class="mb-3.5 flex items-center justify-between">
                                <span class="northline-label-chip northline-label-chip--soft">Grading &amp; Submission Status</span>
                            </div>
                            <div class="northline-status-grid grid grid-cols-3">${classroom.metrics.map(renderNorthlineMetric).join('')}</div>
                        </section>
                        <button type="button" class="northline-overdue-card group cursor-pointer text-left" data-northline-trigger-alerts data-northline-overdue-card aria-label="Go to alerts">
                            <div class="northline-overdue-card__summary">
                                <div class="northline-overdue-card__watermark" aria-hidden="true">
                                    <span class="material-symbols-outlined northline-overdue-card__watermark-icon" aria-hidden="true">assignment_late</span>
                                </div>
                                <p class="northline-card-caption text-white/90">
                                    <span class="northline-overdue-card__count">${escapeNorthlineHtml(checkInCount)}</span>
                                    <span>${escapeNorthlineHtml(classroom.overdueReview.label)}</span>
                                </p>
                                <span class="northline-overdue-card__cta">
                                    <span>Go to alerts</span>
                                    <svg viewBox="0 0 16 16" fill="none" class="northline-overdue-card__cta-icon" aria-hidden="true">
                                        <path d="M3.5 8h9m0 0-3-3m3 3-3 3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
                                    </svg>
                                </span>
                            </div>
                        </button>
                    </div>
                    <div class="northline-dashboard-main min-h-0 gap-3.5">
                        <div class="northline-dashboard-column min-h-0 gap-3.5">
                            <section>
                                <div class="mb-2.25 flex items-center gap-2">
                                    <svg viewBox="0 0 16 16" fill="none" class="h-4 w-4 text-slate-500" aria-hidden="true">
                                        <path d="m2.5 10.8 4.1-5 2.6 2.9 4.3-4.9M10.7 3.7h2.8v2.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>
                                    </svg>
                                    <h5 class="northline-section-title">Teacher Workflow Actions</h5>
                                </div>
                                <div class="northline-workflow-grid grid grid-cols-4">${workflowActions.map(renderNorthlineActionCard).join('')}</div>
                            </section>
                            <section class="northline-actionable-section flex min-h-0 flex-col">
                                <div class="northline-actionable-header flex items-center gap-2">
                                    <svg viewBox="0 0 16 16" fill="none" class="h-4 w-4 text-slate-500" aria-hidden="true">
                                        <path d="M3.2 4.2h9.6M3.2 8h6.4M3.2 11.8h9.6M11.3 6.4l1.6 1.6 2.5-2.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35"/>
                                    </svg>
                                    <h5 class="northline-section-title">Actionable Items</h5>
                                </div>
                                <div class="northline-actionable-grid grid min-h-0 flex-1 grid-cols-2 gap-3" data-northline-actionable-grid>
                                    <section class="northline-list-panel northline-list-panel--dashboard" data-northline-grading-queue>
                                        <div class="northline-list-panel__top flex items-center justify-between gap-3">
                                            <div class="flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-full bg-[#0b7b77]"></span><h6 class="northline-list-title text-[#0b7b77]">Pending Grading Queue</h6></div>
                                            <span class="northline-list-meta">${escapeNorthlineHtml(gradingQueueMeta)}</span>
                                        </div>
                                        <div class="northline-actionable-list flex min-h-0 flex-1 flex-col">${classroom.gradingQueue.map(renderNorthlineQueueItem).join('')}</div>
                                    </section>
                                    <section class="northline-list-panel northline-list-panel--dashboard" data-northline-events>
                                        <div class="northline-list-panel__top flex items-center justify-between gap-3">
                                            <div class="flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-full bg-[#ff4b5c]"></span><h6 class="northline-list-title text-[#ff4b5c]">Upcoming Class Events</h6></div>
                                            <span class="northline-list-meta">Next 7 days</span>
                                        </div>
                                        <div class="northline-actionable-list flex min-h-0 flex-1 flex-col">${classroom.events.map(renderNorthlineEventItem).join('')}</div>
                                    </section>
                                </div>
                            </section>
                        </div>
                        <aside class="grid min-h-0 grid-rows-[minmax(0,1fr)_9.55rem] gap-2.5">
                            <section class="northline-panel flex min-h-0 flex-col px-4.25 pt-3 pb-2" data-northline-critical-command></section>
                            <section class="northline-reach-card" data-northline-reach-card></section>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    `;
}



export function renderNorthlineCheckInSection(classroom) {
    return `
        <h5 class="northline-section-title border-b border-slate-300 pb-3 text-slate-600">Student Check-Ins</h5>
        <div class="northline-checkin-rotator mt-2" data-northline-checkin-rotator aria-live="polite">
            <div class="northline-checkin-track" data-northline-checkin-track>
                ${classroom.checkIns.map((item, index) => `
                    <article class="northline-checkin-slide northline-checkin-item min-w-0 ${index === 0 ? 'is-active' : 'is-idle'}" data-northline-checkin-slide aria-hidden="${index === 0 ? 'false' : 'true'}">
                        <div class="flex items-center justify-between gap-3">
                            <span class="northline-label-chip ${index === 0 ? 'northline-label-chip--coral' : 'northline-label-chip--sand'} northline-label-chip--compact">${escapeNorthlineHtml(item.label)}</span>
                            <span class="text-[0.64rem] font-bold uppercase tracking-[0.14em] text-slate-500">${escapeNorthlineHtml(item.time)}</span>
                        </div>
                        <div class="northline-checkin-item__copy">
                            <p class="northline-checkin-item__title northline-display text-[0.85rem] font-black uppercase leading-[1.02] tracking-[-0.04em] text-slate-900">${escapeNorthlineHtml(item.title)}</p>
                            <p class="northline-checkin-item__body mt-[0.1875rem] text-[0.67rem] leading-[1.3] text-slate-600">${escapeNorthlineHtml(item.body)}</p>
                        </div>
                    </article>
                `).join('')}
            </div>
            <div class="northline-checkin-footer border-t border-slate-200/90">
                <button type="button" class="northline-secondary-link" data-northline-nav="students">
                    <span>Review Check-Ins</span>
                    <svg viewBox="0 0 16 16" fill="none" class="northline-secondary-link__icon h-4 w-4" aria-hidden="true">
                        <path d="M3.5 8h9m0 0-3-3m3 3-3 3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}



export function renderNorthlineReachCard(classroom) {
    return `
        <div class="flex items-center justify-between gap-3">
            <p class="northline-section-title text-[0.66rem] tracking-[0.14em] text-white/46">Classroom Reach</p>
            <span class="northline-reach-chip px-2 py-1 text-[0.48rem] tracking-[0.16em]">Today</span>
        </div>
        <div class="mt-2.5 flex items-end justify-between gap-2.5">
            <span class="northline-display text-[2.82rem] font-black leading-none text-white">${escapeNorthlineHtml(classroom.reach.percent)}</span>
            <span class="northline-reach-status mb-1 northline-reach-status--${escapeNorthlineHtml(classroom.reach.tone)}">${escapeNorthlineHtml(classroom.reach.status)}</span>
        </div>
        <p class="northline-reach-summary mt-1 text-[0.67rem] leading-[1.35] text-white/62">${renderNorthlineRollingText(classroom.reach.summary, 'northline-reach-summary__roll')}</p>
        <div class="mt-2.5">
            <div class="h-2 overflow-hidden rounded-full bg-white/10"><div class="h-full rounded-full bg-[#0b7b77]" style="width: ${escapeNorthlineHtml(classroom.reach.percent)}"></div></div>
            <div class="mt-1.5 flex items-center justify-between text-[0.58rem] text-white/46">
                <span>${escapeNorthlineHtml(classroom.reach.present)}</span>
                <span>${escapeNorthlineHtml(classroom.reach.suggested)}</span>
            </div>
        </div>
    `;
}



export function renderNorthlineSelectableList(items, selectedId, attributeName) {
    return items.map((item) => `
        <button type="button" class="northline-workspace-item ${item.id === selectedId ? 'is-active' : ''}" ${attributeName}="${escapeNorthlineHtml(item.id)}">
            <span class="northline-workspace-item__eyebrow">${escapeNorthlineHtml(item.category ?? item.status ?? 'Item')}</span>
            <strong>${escapeNorthlineHtml(item.title ?? item.name)}</strong>
            <span>${escapeNorthlineHtml(item.updatedAt ?? item.summary ?? item.supportStatus)}</span>
        </button>
    `).join('');
}



export function renderNorthlineExamList(items, selectedId) {
    return items.map((item) => `
        <button type="button" class="northline-workspace-item ${item.id === selectedId ? 'is-active' : ''}" data-northline-exam-option="${escapeNorthlineHtml(item.id)}">
            <span class="northline-workspace-item__eyebrow">Assessment</span>
            <strong>${escapeNorthlineHtml(item.title ?? 'Untitled assessment')}</strong>
            <span>${escapeNorthlineHtml(item.summary ?? item.setupNote ?? 'Assessment details')}</span>
        </button>
    `).join('');
}



export function getNorthlineInitials(name) {
    return String(name ?? '')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0] ?? '')
        .join('')
        .toUpperCase();
}



export function renderNorthlineDocumentsView(classroom, selectedDocument) {
    const documentActions = selectedDocument?.actions ?? [];
    const documentCountLabel = `${classroom.documents.length} ${classroom.documents.length === 1 ? 'material' : 'materials'}`;

    return `
        <div class="northline-workspace-grid northline-workspace-grid--documents">
            <section class="northline-list-panel northline-list-panel--workspace">
                <div class="northline-workspace-panel__top">
                    <div><p class="northline-link-label">Class materials</p><h5 class="northline-section-title mt-2 text-slate-700">Materials</h5></div>
                    <span class="northline-list-meta">${escapeNorthlineHtml(documentCountLabel)}</span>
                </div>
                <div class="northline-workspace-list">${renderNorthlineSelectableList(classroom.documents, selectedDocument?.id, 'data-northline-document-option')}</div>
            </section>
            <section class="northline-panel northline-workspace-detail northline-workspace-detail--documents">
                <div class="northline-workspace-panel__top">
                    <div>
                        <p class="northline-link-label">${escapeNorthlineHtml(selectedDocument?.category ?? 'Material details')}</p>
                        <h5 class="northline-display mt-2 text-[1.35rem] font-black uppercase tracking-[-0.04em] text-slate-900">${escapeNorthlineHtml(selectedDocument?.title ?? 'No document selected')}</h5>
                    </div>
                    ${renderNorthlineTemporalToken(selectedDocument?.updatedAt, 'teal')}
                </div>
                <div class="northline-workspace-hero northline-workspace-hero--document">
                    <div class="northline-workspace-hero__icon northline-workspace-hero__icon--teal" aria-hidden="true">
                        <span class="material-symbols-outlined text-[1.55rem]">description</span>
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="northline-link-label">Selected material</p>
                        <p class="mt-2 text-[1.08rem] font-black uppercase tracking-[-0.04em] text-slate-900">${escapeNorthlineHtml(selectedDocument?.title ?? 'No document selected')}</p>
                        <p class="northline-workspace-summary mt-2">${escapeNorthlineHtml(selectedDocument?.summary ?? 'Select a document to inspect its status and actions.')}</p>
                    </div>
                </div>
                <div class="northline-workspace-stat-grid northline-workspace-stat-grid--documents">
                    <div class="northline-workspace-stat-card">
                        <p class="northline-link-label">Type</p>
                        <p class="northline-workspace-stat-value">${escapeNorthlineHtml(selectedDocument?.category ?? 'Document')}</p>
                    </div>
                    <div class="northline-workspace-stat-card">
                        <p class="northline-link-label">Summary</p>
                        <p class="northline-workspace-stat-copy">${escapeNorthlineHtml(selectedDocument?.summary ?? 'Select a document to inspect its status and actions.')}</p>
                    </div>
                    <div class="northline-workspace-stat-card">
                        <p class="northline-link-label">Next action</p>
                        <p class="northline-workspace-stat-value">${escapeNorthlineHtml(documentActions[0] ?? 'Preview')}</p>
                    </div>
                </div>
                <div class="northline-workspace-card northline-workspace-card--stacked">
                    <p class="northline-link-label">Actions</p>
                    <div class="mt-4 flex flex-wrap gap-2">${documentActions.map((action) => `<button type="button" class="northline-secondary-chip">${escapeNorthlineHtml(action)}</button>`).join('')}</div>
                </div>
            </section>
        </div>
    `;
}



export function renderNorthlineExamsView(classroom, selectedExam, state) {
    const examActions = selectedExam?.actions ?? [];
    const examsMetaLabel = state.examsFilter === 'next-24h' ? 'Focused on due work' : 'All assessments';

    return `
        <div class="northline-workspace-grid northline-workspace-grid--documents">
            <section class="northline-list-panel northline-list-panel--workspace">
                <div class="northline-workspace-panel__top">
                    <div><p class="northline-link-label">Class planning</p><h5 class="northline-section-title mt-2 text-slate-700">Assessments</h5></div>
                    <span class="northline-list-meta ${state.examsFilter === 'next-24h' ? 'northline-list-meta--coral' : ''}">${escapeNorthlineHtml(examsMetaLabel)}</span>
                </div>
                <div class="northline-workspace-list">${renderNorthlineExamList(classroom.exams, selectedExam?.id)}</div>
            </section>
            <section class="northline-panel northline-workspace-detail northline-workspace-detail--exams">
                <div class="northline-workspace-panel__top">
                    <div>
                        <p class="northline-link-label">${escapeNorthlineHtml(selectedExam?.setupNote ? 'Setup note' : 'Assessment details')}</p>
                        <h5 class="northline-display mt-2 text-[1.35rem] font-black uppercase tracking-[-0.04em] text-slate-900">${escapeNorthlineHtml(selectedExam?.title ?? 'No assessment selected')}</h5>
                    </div>
                    ${selectedExam ? renderNorthlineBadge(selectedExam.status, 'status') : ''}
                </div>
                <div class="northline-workspace-hero northline-workspace-hero--exam">
                    <div class="northline-workspace-hero__icon northline-workspace-hero__icon--coral" aria-hidden="true">
                        <span class="material-symbols-outlined text-[1.55rem]">event_available</span>
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="northline-link-label">Assessment snapshot</p>
                        <p class="mt-2 text-[1.08rem] font-black uppercase tracking-[-0.04em] text-slate-900">${escapeNorthlineHtml(selectedExam?.title ?? 'No assessment selected')}</p>
                        <p class="northline-workspace-summary mt-2">${escapeNorthlineHtml(selectedExam?.summary ?? 'Select an assessment to inspect its current setup.')}</p>
                    </div>
                </div>
                <div class="northline-workspace-stat-grid northline-workspace-stat-grid--exams">
                    <div class="northline-workspace-stat-card">
                        <p class="northline-link-label">Setup note</p>
                        <p class="northline-workspace-stat-copy">${escapeNorthlineHtml(selectedExam?.setupNote ?? 'No setup note available.')}</p>
                    </div>
                    <div class="northline-workspace-stat-card">
                        <p class="northline-link-label">Summary</p>
                        <p class="northline-workspace-stat-copy">${escapeNorthlineHtml(selectedExam?.summary ?? 'Select an assessment to inspect its current setup.')}</p>
                    </div>
                    <div class="northline-workspace-stat-card">
                        <p class="northline-link-label">Next action</p>
                        <p class="northline-workspace-stat-value">${escapeNorthlineHtml(examActions[0] ?? 'Preview')}</p>
                    </div>
                </div>
                <div class="northline-workspace-card northline-workspace-card--stacked">
                    <p class="northline-link-label">Actions</p>
                    <div class="mt-4 flex flex-wrap gap-2">${examActions.map((action) => `<button type="button" class="northline-secondary-chip">${escapeNorthlineHtml(action)}</button>`).join('')}</div>
                </div>
            </section>
        </div>
    `;
}



export function renderNorthlineStudentsView(classroom, students, selectedStudent, state) {
    const studentActions = selectedStudent?.actions ?? [];
    const currentFilterIndex = northlineStudentsFilterCycle.indexOf(state.studentsFilter);
    const nextFilter = northlineStudentsFilterCycle[(currentFilterIndex + 1) % northlineStudentsFilterCycle.length];
    const currentFilterLabel = northlineStudentsFilterLabels[state.studentsFilter] ?? northlineStudentsFilterLabels.null;
    const nextFilterLabel = northlineStudentsFilterLabels[nextFilter] ?? northlineStudentsFilterLabels.null;

    return `
        <div class="northline-workspace-grid northline-workspace-grid--students">
            <section class="northline-list-panel northline-list-panel--workspace">
                <div class="northline-workspace-panel__top">
                    <div><p class="northline-link-label">Class roster</p><h5 class="northline-section-title mt-2 text-slate-700">Roster</h5></div>
                    <button
                        type="button"
                        class="northline-filter-chip northline-filter-chip--cycle"
                        data-northline-cycle-students-filter
                        aria-label="Cycle students filter. Current ${escapeNorthlineHtml(currentFilterLabel)}. Next ${escapeNorthlineHtml(nextFilterLabel)}."
                        title="Current: ${escapeNorthlineHtml(currentFilterLabel)}. Next: ${escapeNorthlineHtml(nextFilterLabel)}."
                    >
                        <span class="northline-filter-chip__eyebrow">Roster filter</span>
                        <strong class="northline-filter-chip__value">${escapeNorthlineHtml(currentFilterLabel)}</strong>
                        <span class="northline-filter-chip__hint">Next: ${escapeNorthlineHtml(nextFilterLabel)}</span>
                    </button>
                </div>
                <div class="northline-workspace-list">${renderNorthlineSelectableList(students, selectedStudent?.id, 'data-northline-student-option')}</div>
            </section>
            <section class="northline-panel northline-workspace-detail northline-workspace-detail--students">
                <div class="northline-workspace-panel__top">
                    <div>
                        <p class="northline-link-label">${escapeNorthlineHtml(selectedStudent?.supportStatus ?? 'Student support')}</p>
                        <h5 class="northline-display mt-2 text-[1.35rem] font-black uppercase tracking-[-0.04em] text-slate-900">${escapeNorthlineHtml(selectedStudent?.name ?? 'No student selected')}</h5>
                    </div>
                </div>
                <div class="northline-workspace-hero northline-workspace-hero--student">
                    <div class="northline-workspace-hero__avatar" aria-hidden="true">${escapeNorthlineHtml(getNorthlineInitials(selectedStudent?.name ?? 'NS'))}</div>
                    <div class="min-w-0 flex-1">
                        <p class="northline-link-label">Student snapshot</p>
                        <p class="mt-2 text-[1.08rem] font-black uppercase tracking-[-0.04em] text-slate-900">${escapeNorthlineHtml(selectedStudent?.name ?? 'No student selected')}</p>
                        <p class="northline-workspace-summary mt-2">${escapeNorthlineHtml(selectedStudent?.summary ?? 'Select a student to review support details.')}</p>
                    </div>
                </div>
                <div class="northline-workspace-stat-grid northline-workspace-stat-grid--students mt-5">
                    <div class="northline-workspace-card">
                        <p class="northline-link-label">Attendance</p>
                        <p class="mt-2 text-sm leading-6 text-slate-600">${escapeNorthlineHtml(selectedStudent?.attendance ?? '—')}</p>
                    </div>
                    <div class="northline-workspace-card">
                        <p class="northline-link-label">Late work</p>
                        <p class="mt-2 text-sm leading-6 text-slate-600">${escapeNorthlineHtml(selectedStudent?.lateWork ?? '—')}</p>
                    </div>
                </div>
                <div class="northline-workspace-card northline-workspace-card--stacked mt-4">
                    <p class="northline-link-label">Next step</p>
                    <div class="flex flex-wrap gap-2">${studentActions.map((action) => `<button type="button" class="northline-secondary-chip" data-northline-student-action="${escapeNorthlineHtml(action)}">${escapeNorthlineHtml(action)}</button>`).join('')}</div>
                </div>
            </section>
        </div>
    `;
}



export function renderNorthlineGradingOverlay(classroom, assignment, submission, selectedGrade) {
    const assignmentOptions = classroom.gradingQueue.map((item) => `<option value="${escapeNorthlineHtml(item.id)}"${item.id === assignment?.id ? ' selected' : ''}>${escapeNorthlineHtml(item.title)}</option>`).join('');
    const studentOptions = (assignment?.students ?? []).map((item) => `<option value="${escapeNorthlineHtml(item.id)}"${item.id === submission?.id ? ' selected' : ''}>${escapeNorthlineHtml(item.name)}</option>`).join('');
    const gradeOptions = (submission?.gradeOptions ?? []).map((grade) => `<option value="${escapeNorthlineHtml(grade)}"${grade === selectedGrade ? ' selected' : ''}>${escapeNorthlineHtml(grade)}</option>`).join('');
    const previewBody = (submission?.previewBody ?? []).map((paragraph) => `<p>${escapeNorthlineHtml(paragraph)}</p>`).join('');
    const previewSummary = submission?.previewBody?.[0] ?? 'Open the attached document to review the full submission.';

    return `
        <div class="northline-overlay-backdrop" data-northline-overlay-close></div>
        <div class="northline-overlay northline-overlay--grading" role="dialog" aria-modal="true" aria-label="Submission review workbench">
            <button type="button" class="northline-overlay-close" aria-label="Close grading workbench" data-northline-overlay-close>Close</button>
            <div class="northline-overlay-desktop-content">
                <div class="northline-overlay-header">
                    <div>
                        <div class="flex flex-wrap items-center gap-2">${renderNorthlineContextChip(classroom)}</div>
                        <h5 id="northline-grading-title" class="northline-display mt-3 text-[1.5rem] font-black uppercase tracking-[-0.04em] text-slate-900">Submission Review Workbench</h5>
                    </div>
                    <div class="northline-overlay-selectors">
                        <label class="northline-field-label"><span>Assignment</span><select data-northline-grading-assignment>${assignmentOptions}</select></label>
                        <label class="northline-field-label"><span>Student</span><select data-northline-grading-student>${studentOptions}</select></label>
                    </div>
                </div>
                <div class="northline-grading-grid">
                    <section class="northline-grading-preview">
                        <div class="northline-grading-preview__meta">
                            ${renderNorthlineTemporalToken(submission?.submittedAt ?? 'Pending submission')}
                            <button type="button" class="northline-secondary-chip">${escapeNorthlineHtml(submission?.fileName ?? 'Download submission')}</button>
                        </div>
                        <div class="northline-grading-preview__paper">
                            <p class="northline-link-label">Student submission</p>
                            <h6 class="northline-display mt-3 text-[1.08rem] font-black uppercase tracking-[-0.04em] text-slate-900">${escapeNorthlineHtml(submission?.previewTitle ?? 'Submission preview')}</h6>
                            <div class="mt-4 space-y-3 text-[0.88rem] leading-7 text-slate-700">${previewBody}</div>
                        </div>
                    </section>
                    <aside class="northline-grading-sidebar">
                        <section class="northline-workspace-card">
                            <p class="northline-link-label">Grade</p>
                            <div class="northline-grade-options mt-4">${(submission?.gradeOptions ?? []).map((grade) => `<button type="button" class="northline-grade-option ${grade === selectedGrade ? 'is-active' : ''}" data-northline-grade-option="${escapeNorthlineHtml(grade)}">${escapeNorthlineHtml(grade)}</button>`).join('')}</div>
                        </section>
                        <section class="northline-workspace-card">
                            <label class="northline-field-label northline-field-label--stacked"><span>Feedback note</span><textarea rows="4" placeholder="Add a short note" data-northline-feedback-note></textarea></label>
                        </section>
                        <div class="flex items-center justify-end gap-2">
                            <button type="button" class="northline-secondary-chip">Save draft</button>
                            <button type="button" class="northline-primary-cta northline-primary-cta--teal">Submit grade</button>
                        </div>
                    </aside>
                </div>
            </div>
            <div class="northline-mobile-grading-sheet">
                <div class="northline-overlay-header northline-overlay-header--compact">
                    <div>
                        <p class="northline-link-label">Bulk grading</p>
                        <h5 id="northline-grading-title-mobile" class="northline-display">Grade selected submission</h5>
                    </div>
                </div>
                <div class="northline-mobile-grading-sheet__selectors">
                    <label class="northline-field-label"><span>Assignment</span><select data-northline-grading-assignment>${assignmentOptions}</select></label>
                    <label class="northline-field-label"><span>Student</span><select data-northline-grading-student>${studentOptions}</select></label>
                </div>
                <section class="northline-mobile-submission-card">
                    <div class="northline-mobile-submission-card__copy">
                        <h6>${escapeNorthlineHtml(submission?.previewTitle ?? 'Submission preview')}</h6>
                        <p>${escapeNorthlineHtml(previewSummary)}</p>
                    </div>
                    <div class="northline-mobile-submission-card__actions">
                        <span class="northline-mobile-submission-card__time"><span aria-hidden="true"></span>${formatNorthlineMobileTime(submission?.submittedAt ?? 'Pending submission')}</span>
                        <button type="button" class="northline-secondary-chip">${escapeNorthlineHtml(submission?.fileName ?? 'Open document')}</button>
                    </div>
                </section>
                <section class="northline-mobile-grade-card">
                    <label class="northline-field-label"><span>Grade</span><select data-northline-grade-select>${gradeOptions}</select></label>
                    <label class="northline-field-label northline-field-label--stacked"><span>Quick note</span><textarea rows="2" placeholder="One clear feedback note" data-northline-feedback-note></textarea></label>
                </section>
                <div class="northline-mobile-sheet-actions">
                    <button type="button" class="northline-secondary-chip">Save draft</button>
                    <button type="button" class="northline-primary-cta northline-primary-cta--teal">Submit grade</button>
                </div>
            </div>
        </div>
    `;
}



export function renderNorthlineMessageOverlay(classroom, subject, body) {
    return `
        <div class="northline-overlay-backdrop" data-northline-overlay-close></div>
        <div class="northline-overlay northline-overlay--message" role="dialog" aria-modal="true" aria-labelledby="northline-message-title">
            <button type="button" class="northline-overlay-close" aria-label="Close class message composer" data-northline-overlay-close>Close</button>
            <div class="northline-overlay-header northline-overlay-header--compact">
                <div>
                    <div class="northline-context-chip-row">${renderNorthlineContextChip(classroom)}</div>
                    <h5 id="northline-message-title" class="northline-display mt-3 text-[1.35rem] font-black uppercase tracking-[-0.04em] text-slate-900">Send a message to the current class</h5>
                </div>
            </div>
            <div class="space-y-4">
                <label class="northline-field-label northline-field-label--stacked"><span>Subject</span><input type="text" value="${escapeNorthlineHtml(subject)}" data-northline-message-subject></label>
                <label class="northline-field-label northline-field-label--stacked"><span>Message</span><textarea rows="6" data-northline-message-body>${escapeNorthlineHtml(body)}</textarea></label>
                <div class="flex items-center justify-end gap-2">
                    <button type="button" class="northline-secondary-chip">Save draft</button>
                    <button type="button" class="northline-primary-cta northline-primary-cta--slate">Send to class</button>
                </div>
            </div>
        </div>
    `;
}
