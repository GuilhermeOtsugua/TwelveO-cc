@php
    $workflowActions = [
        ['id' => 'post-materials', 'label' => 'Post Materials', 'tone' => 'teal', 'icon' => 'upload'],
        ['id' => 'create-exam', 'label' => 'Create Exam', 'tone' => 'coral', 'icon' => 'quiz'],
        ['id' => 'bulk-grading', 'label' => 'Bulk Grading', 'tone' => 'sand', 'icon' => 'grade'],
        ['id' => 'class-message', 'label' => 'Class Message', 'tone' => 'slate', 'icon' => 'message'],
    ];

    $classes = [
        [
            'id' => 'world-history-seminar',
            'label' => 'Class A',
            'name' => 'World History Seminar',
            'dashboardTitle' => "Teacher's Task & Grading Center",
            'dashboardDescription' => 'Class management, grading activity, and classroom follow-up for the current seminar.',
            'metrics' => [
                ['id' => 'pending-grade', 'value' => '42', 'label' => 'Pending', 'status' => '68% done', 'tone' => 'teal', 'progress' => 68],
                ['id' => 'late-submits', 'value' => '12', 'label' => 'Late Submits', 'status' => 'Follow-up ready', 'tone' => 'coral', 'progress' => 34],
                ['id' => 'deadlines', 'value' => '08', 'label' => 'Due soon', 'status' => 'Checks OK', 'tone' => 'coral', 'progress' => 86],
            ],
            'overdueReview' => ['count' => '05', 'label' => 'Check-ins to review'],
            'gradingQueue' => [
                [
                    'id' => 'whs-midterm-paper',
                    'title' => 'Midterm Paper',
                    'meta' => '18 students remaining',
                    'badge' => '24h Left',
                    'tone' => 'teal',
                    'icon' => 'pen',
                    'students' => [
                        [
                            'id' => 'leo-grant',
                            'name' => 'Leo Grant',
                            'status' => 'Missing citation support in the final section.',
                            'submittedAt' => 'Submitted 12m ago',
                            'fileName' => 'LeoGrant_MidtermPaper.pdf',
                            'previewTitle' => 'Political transitions after 1848',
                            'previewBody' => [
                                'The treaty settlement stabilized borders, but it did not settle the political pressure in the cities.',
                                'I think the most important shift was how reform became a public expectation instead of a private debate.',
                                'The evidence from the packet shows how protest slowly moved into parliamentary language.',
                            ],
                            'gradeOptions' => ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-'],
                            'defaultGrade' => 'B+',
                            'feedbackDraft' => '',
                        ],
                        [
                            'id' => 'maya-chen',
                            'name' => 'Maya Chen',
                            'status' => 'Ready for final pass.',
                            'submittedAt' => 'Submitted 38m ago',
                            'fileName' => 'MayaChen_MidtermPaper.pdf',
                            'previewTitle' => 'Trade routes and local reform',
                            'previewBody' => [
                                'Trade routes and local reform shaped one another as merchants pushed for easier access and more predictable rules.',
                                'I am using the comparison to show that reform mattered most when it changed everyday movement.',
                                'The conclusion should come back to the thesis one more time before I turn this in.',
                            ],
                            'gradeOptions' => ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-'],
                            'defaultGrade' => 'A-',
                            'feedbackDraft' => '',
                        ],
                    ],
                ],
                [
                    'id' => 'whs-debate-reflection',
                    'title' => 'Debate Reflection',
                    'meta' => '9 students remaining',
                    'badge' => 'Review 4pm',
                    'tone' => 'teal',
                    'icon' => 'pen',
                    'students' => [
                        [
                            'id' => 'rafael-ortiz',
                            'name' => 'Rafael Ortiz',
                            'status' => 'Needs one note about evidence balance.',
                            'submittedAt' => 'Submitted yesterday',
                            'fileName' => 'RafaelOrtiz_DebateReflection.pdf',
                            'previewTitle' => 'Debate reflection on reform movements',
                            'previewBody' => [
                                'The debate changed the way I understood worker organizing because it connected public pressure to classroom examples.',
                                'I kept returning to the idea that reform movements depend on both ideas and the people willing to act on them.',
                                'One more comparison from lecture would make the final section feel complete.',
                            ],
                            'gradeOptions' => ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-'],
                            'defaultGrade' => 'B+',
                            'feedbackDraft' => '',
                        ],
                    ],
                ],
            ],
            'events' => [
                ['id' => 'whs-outline-review', 'title' => 'Outline Review Conference', 'meta' => 'Feedback tables open after the seminar.', 'badge' => 'Today', 'badgeTone' => 'coral', 'tone' => 'coral', 'icon' => 'calendar'],
                ['id' => 'whs-source-packet', 'title' => 'Primary Source Packet', 'meta' => 'Share the annotated packet before tomorrow morning.', 'badge' => 'Tomorrow', 'badgeTone' => 'coral', 'tone' => 'coral', 'icon' => 'archive'],
            ],
            'checkIns' => [
                ['id' => 'attendance', 'label' => 'Attendance update', 'time' => '12m ago', 'title' => 'Leo Grant may need a check-in', 'body' => 'Participation slipped this week. A quick follow-up after class would help confirm whether support is needed.'],
                ['id' => 'drafts', 'label' => 'Draft reminder', 'time' => '1h ago', 'title' => 'Outline follow-up ready', 'body' => 'Five students still need outline feedback before tomorrow morning. A short class message would catch them all at once.'],
            ],
            'reach' => ['percent' => '85%', 'status' => 'Steady', 'tone' => 'teal-soft', 'summary' => 'One class may need a quick check-in.', 'present' => '148 present today', 'suggested' => '9 check-ins suggested'],
            'documents' => [
                ['id' => 'whs-primary-source-packet', 'title' => 'Primary Source Packet', 'category' => 'Reading Pack', 'status' => 'Ready to post', 'updatedAt' => 'Updated 18m ago', 'summary' => 'Annotated packet covering the Revolutions of 1848.', 'actions' => ['Share with class', 'Download', 'Replace file']],
                ['id' => 'whs-outline-checklist', 'title' => 'Outline Checklist', 'category' => 'Assignment Guide', 'status' => 'In draft', 'updatedAt' => 'Saved 2h ago', 'summary' => 'Checklist for the outline review conference.', 'actions' => ['Post materials', 'Preview', 'Replace file']],
            ],
            'exams' => [
                ['id' => 'whs-unit-essay', 'title' => 'Unit Essay Checkpoint', 'status' => 'Closes tomorrow', 'summary' => 'Argument outline and source pairings are due in the morning.', 'setupNote' => 'Instructions are published. Reminder timing can still be adjusted.', 'actions' => ['Open exam setup', 'Send reminder', 'Review submissions']],
                ['id' => 'whs-map-quiz', 'title' => 'Industrial Europe Map Quiz', 'status' => 'Draft in queue', 'summary' => 'Short geography check for the next seminar block.', 'setupNote' => 'Question bank is ready. Publishing window is still unset.', 'actions' => ['Create exam', 'Preview', 'Assign date']],
            ],
            'students' => [
                ['id' => 'leo-grant', 'name' => 'Leo Grant', 'attendance' => 'Attendance dipped this week', 'lateWork' => '2 late submissions', 'supportStatus' => 'Check-in suggested', 'alerts' => ['Attendance update', 'Midterm follow-up'], 'summary' => 'Needs a short check-in about attendance and pacing before the outline conference.', 'actions' => ['Schedule check-in', 'View submission', 'Send reminder']],
                ['id' => 'maya-chen', 'name' => 'Maya Chen', 'attendance' => 'On track', 'lateWork' => 'No late work', 'supportStatus' => 'Ready to release feedback', 'alerts' => ['Draft feedback ready'], 'summary' => 'Feedback can be released now. Participation remains steady.', 'actions' => ['View submission', 'Share feedback', 'Message student']],
                ['id' => 'rafael-ortiz', 'name' => 'Rafael Ortiz', 'attendance' => 'Present today', 'lateWork' => '1 late submission', 'supportStatus' => 'Follow-up ready', 'alerts' => ['Late submission'], 'summary' => 'One late reflection is in queue. A brief follow-up note should be enough.', 'actions' => ['View submission', 'Send reminder', 'Open roster note']],
            ],
        ],
        [
            'id' => 'modern-european-history',
            'label' => 'Class B',
            'name' => 'Modern European History',
            'dashboardTitle' => "Teacher's Task & Grading Center",
            'dashboardDescription' => 'Assessment pacing, materials, and classroom support for the current history block.',
            'metrics' => [
                ['id' => 'pending-grade', 'value' => '27', 'label' => 'Pending', 'status' => '54% done', 'tone' => 'teal', 'progress' => 54, 'priority' => true],
                ['id' => 'late-submits', 'value' => '07', 'label' => 'Late Submits', 'status' => 'Follow-up ready', 'tone' => 'coral', 'progress' => 22],
                ['id' => 'deadlines', 'value' => '04', 'label' => 'Due soon', 'status' => 'Checks OK', 'tone' => 'coral', 'progress' => 61],
            ],
            'overdueReview' => ['count' => '03', 'label' => 'Check-ins to review'],
            'gradingQueue' => [
                [
                    'id' => 'meh-comparison-essay',
                    'title' => 'Comparison Essay',
                    'meta' => '11 students remaining',
                    'badge' => '24h Left',
                    'tone' => 'teal',
                    'icon' => 'pen',
                    'students' => [
                        [
                            'id' => 'elena-petrov',
                            'name' => 'Elena Petrov',
                            'status' => 'Needs one note on argument structure.',
                            'submittedAt' => 'Submitted 21m ago',
                            'fileName' => 'ElenaPetrov_ComparisonEssay.pdf',
                            'previewTitle' => 'Constitutional reform and public protest',
                            'previewBody' => [
                                'Constitutional reform and public protest kept pushing each other forward during the period.',
                                'My main point is that reform lasted when protest made it impossible to ignore.',
                                'I should connect the two case studies more clearly in the final paragraph.',
                            ],
                            'gradeOptions' => ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-'],
                            'defaultGrade' => 'A-',
                            'feedbackDraft' => '',
                        ],
                    ],
                ],
            ],
            'events' => [
                ['id' => 'meh-reading-brief', 'title' => 'Reading Brief Release', 'meta' => 'Prep note for the reform seminar goes out this evening.', 'badge' => 'Today', 'badgeTone' => 'coral', 'tone' => 'coral', 'icon' => 'calendar'],
                ['id' => 'meh-discussion-circle', 'title' => 'Discussion Circle Setup', 'meta' => 'Seat groups need the final prompt sheet before first period.', 'badge' => 'Tomorrow', 'badgeTone' => 'coral', 'tone' => 'coral', 'icon' => 'archive'],
            ],
            'checkIns' => [
                ['id' => 'reading-follow-up', 'label' => 'Reading follow-up', 'time' => '18m ago', 'title' => 'Archive packet reminder ready', 'body' => 'Three students still need the archive packet before tomorrow. A quick class message would close the gap.'],
                ['id' => 'attendance-soft', 'label' => 'Attendance update', 'time' => '50m ago', 'title' => 'Check in with Elena Petrov', 'body' => 'Elena has been present but quiet during the last two discussions. A soft follow-up could help.'],
            ],
            'reach' => ['percent' => '88%', 'status' => 'Strong', 'tone' => 'teal-strong', 'summary' => 'Most students are pacing well this week.', 'present' => '121 present today', 'suggested' => '4 follow-ups suggested'],
            'documents' => [
                ['id' => 'meh-brief-sheet', 'title' => 'Reform Brief Sheet', 'category' => 'Discussion Guide', 'status' => 'Ready for class', 'updatedAt' => 'Updated 42m ago', 'summary' => 'Facilitator guide for the discussion circles.', 'actions' => ['Share with class', 'Download', 'Replace file']],
                ['id' => 'meh-review-notes', 'title' => 'Review Notes', 'category' => 'Teacher Notes', 'status' => 'Teacher draft', 'updatedAt' => 'Saved 1h ago', 'summary' => 'Seminar notes for the next lecture sequence.', 'actions' => ['Post materials', 'Preview', 'Replace file']],
            ],
            'exams' => [
                ['id' => 'meh-essay-check', 'title' => 'Industrialization Essay Check', 'status' => 'Due tomorrow morning', 'summary' => 'Thesis statement and evidence plan are due in the morning.', 'setupNote' => 'Reminder timing is still adjustable for this class.', 'actions' => ['Open exam setup', 'Send reminder', 'Review submissions']],
                ['id' => 'meh-map-check', 'title' => 'Border Shift Map Check', 'status' => 'Unpublished draft', 'summary' => 'Low-stakes map check for the next unit transition.', 'setupNote' => 'Question pool is ready but not yet published.', 'actions' => ['Create exam', 'Preview', 'Assign date']],
            ],
            'students' => [
                ['id' => 'elena-petrov', 'name' => 'Elena Petrov', 'attendance' => 'Present today', 'lateWork' => 'No late work', 'supportStatus' => 'Quiet in discussion', 'alerts' => ['Discussion follow-up'], 'summary' => 'A short check-in after class could help Elena rejoin the discussion flow.', 'actions' => ['Schedule check-in', 'Message student', 'View submission']],
                ['id' => 'jona-keller', 'name' => 'Jona Keller', 'attendance' => 'On track', 'lateWork' => '1 late submission', 'supportStatus' => 'Reminder ready', 'alerts' => ['Late submission'], 'summary' => 'One archive response came in late. A quick reminder and release of feedback should be enough.', 'actions' => ['View submission', 'Send reminder', 'Open roster note']],
            ],
        ],
        [
            'id' => 'civic-thought-revolutions',
            'label' => 'Class C',
            'name' => 'Civic Thought & Revolutions',
            'dashboardTitle' => "Teacher's Task & Grading Center",
            'dashboardDescription' => 'Current-class planning, grading, and student support for civic history work.',
            'metrics' => [
                ['id' => 'pending-grade', 'value' => '33', 'label' => 'Pending', 'status' => '59% done', 'tone' => 'teal', 'progress' => 59, 'priority' => true],
                ['id' => 'late-submits', 'value' => '09', 'label' => 'Late Submits', 'status' => 'Follow-up ready', 'tone' => 'coral', 'progress' => 31],
                ['id' => 'deadlines', 'value' => '06', 'label' => 'Due soon', 'status' => 'Checks OK', 'tone' => 'coral', 'progress' => 73],
            ],
            'overdueReview' => ['count' => '04', 'label' => 'Check-ins to review'],
            'gradingQueue' => [
                [
                    'id' => 'ctr-manifesto-essay',
                    'title' => 'Manifesto Essay',
                    'meta' => '13 students remaining',
                    'badge' => '24h Left',
                    'tone' => 'teal',
                    'icon' => 'pen',
                    'students' => [
                        [
                            'id' => 'amira-noor',
                            'name' => 'Amira Noor',
                            'status' => 'Needs one note on evidence balance.',
                            'submittedAt' => 'Submitted 9m ago',
                            'fileName' => 'AmiraNoor_ManifestoEssay.pdf',
                            'previewTitle' => 'Manifesto response on civic responsibility',
                            'previewBody' => [
                                'The manifesto presents responsibility as an action, not just a feeling.',
                                'I focused on how duty changes once it is tied to local organizing and public conflict.',
                                'The closing example should connect the evidence back to civic responsibility more directly.',
                            ],
                            'gradeOptions' => ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-'],
                            'defaultGrade' => 'B+',
                            'feedbackDraft' => '',
                        ],
                    ],
                ],
            ],
            'events' => [
                ['id' => 'ctr-discussion-prep', 'title' => 'Discussion Prep Sheet', 'meta' => 'Share before the revolutions roundtable opens.', 'badge' => 'Today', 'badgeTone' => 'coral', 'tone' => 'coral', 'icon' => 'archive'],
                ['id' => 'ctr-outline-window', 'title' => 'Outline Window Opens', 'meta' => 'Students can start submitting evidence plans tomorrow morning.', 'badge' => 'Tomorrow', 'badgeTone' => 'coral', 'tone' => 'coral', 'icon' => 'calendar'],
            ],
            'checkIns' => [
                ['id' => 'participation-note', 'label' => 'Participation note', 'time' => '16m ago', 'title' => 'Amira Noor may need a quick follow-up', 'body' => 'Written work is strong, but she has been quieter than usual during discussions this week.'],
                ['id' => 'submission-follow-up', 'label' => 'Submission follow-up', 'time' => '1h ago', 'title' => 'Two reflection logs still missing', 'body' => 'A short class message would likely close the remaining reflection gap before the afternoon block.'],
            ],
            'reach' => ['percent' => '82%', 'status' => 'Watchlist', 'tone' => 'sand', 'summary' => 'A few students may need a lighter-touch reminder.', 'present' => '103 present today', 'suggested' => '7 follow-ups suggested'],
            'documents' => [
                ['id' => 'ctr-roundtable-guide', 'title' => 'Roundtable Guide', 'category' => 'Discussion Guide', 'status' => 'Ready for discussion', 'updatedAt' => 'Updated 25m ago', 'summary' => 'Prompt sheet for the revolutions roundtable with discussion norms.', 'actions' => ['Share with class', 'Download', 'Replace file']],
                ['id' => 'ctr-facilitation-note', 'title' => 'Facilitation Note', 'category' => 'Teacher Notes', 'status' => 'Planning draft', 'updatedAt' => 'Saved 45m ago', 'summary' => 'Planning note for the facilitation cues and pacing.', 'actions' => ['Post materials', 'Preview', 'Replace file']],
            ],
            'exams' => [
                ['id' => 'ctr-outline-check', 'title' => 'Evidence Outline Check', 'status' => 'Opens tomorrow', 'summary' => 'Evidence outlines for the manifesto essay are due in the next class block.', 'setupNote' => 'The reminder cadence can still be adjusted before publish.', 'actions' => ['Open exam setup', 'Send reminder', 'Review submissions']],
                ['id' => 'ctr-key-concepts', 'title' => 'Key Concepts Quiz', 'status' => 'Draft pending', 'summary' => 'Short quiz on civic vocabulary and reform movements.', 'setupNote' => 'Question prompts are saved as draft and need a publish time.', 'actions' => ['Create exam', 'Preview', 'Assign date']],
            ],
            'students' => [
                ['id' => 'amira-noor', 'name' => 'Amira Noor', 'attendance' => 'Present today', 'lateWork' => 'No late work', 'supportStatus' => 'Discussion follow-up', 'alerts' => ['Participation note'], 'summary' => 'A quick conversation after class would help confirm whether she needs more discussion support.', 'actions' => ['Schedule check-in', 'Message student', 'View submission']],
                ['id' => 'omar-reyes', 'name' => 'Omar Reyes', 'attendance' => 'On track', 'lateWork' => '1 late submission', 'supportStatus' => 'Reminder ready', 'alerts' => ['Late submission'], 'summary' => 'One late reflection is still open. A reminder and feedback release should keep him on pace.', 'actions' => ['View submission', 'Send reminder', 'Open roster note']],
            ],
        ],
    ];

    $northlineState = ['workflowActions' => $workflowActions, 'defaultClassId' => $classes[0]['id'], 'classes' => $classes];
@endphp

<div class="northline-slice flex min-h-0 flex-col overflow-hidden lg:h-full" data-northline-slice>
    <script type="application/json" data-northline-state>@json($northlineState)</script>

    <div class="northline-canvas flex min-h-0 flex-col">
        <header class="northline-topbar flex h-10 shrink-0 items-center justify-between px-4.5" data-northline-topbar>
            <div class="northline-topbar__primary flex min-w-0 items-center gap-6">
                <button type="button" class="northline-topbar__identity flex items-center gap-3 text-left" data-northline-reset aria-label="Return Northline to the dashboard">
                    <div class="northline-mark text-[#ff5c67]" aria-hidden="true">
                        <span class="northline-mark__line northline-mark__line--v"></span>
                        <span class="northline-mark__line northline-mark__line--h"></span>
                        <span class="northline-mark__line northline-mark__line--d1"></span>
                        <span class="northline-mark__line northline-mark__line--d2"></span>
                        <span class="northline-mark__dot"></span>
                    </div>
                    <div class="min-w-0">
                        <p class="northline-display text-[1rem] font-black uppercase tracking-[-0.04em] text-slate-900">Northline</p>
                        <p class="northline-topbar__mobile-copy">Teacher workspace</p>
                    </div>
                </button>

                <nav class="northline-nav text-slate-500" aria-label="Northline sections">
                    <button type="button" class="northline-nav-pill northline-nav-pill--active" data-northline-nav="dashboard">Dashboard</button>
                    <div class="northline-class-picker" data-northline-class-picker>
                        <button type="button" class="northline-nav-pill" data-northline-class-trigger aria-expanded="false" aria-controls="northline-class-menu">Classes</button>
                        <div id="northline-class-menu" class="northline-class-menu hidden" data-northline-class-menu></div>
                    </div>
                    <button type="button" class="northline-nav-pill" data-northline-nav="documents">Documents</button>
                    <button type="button" class="northline-nav-pill" data-northline-nav="exams">Exams</button>
                    <button type="button" class="northline-nav-pill" data-northline-nav="students">Students</button>
                </nav>
            </div>

            <div class="northline-topbar__secondary flex items-center gap-2.5">
                <div class="northline-topbar__mobile-status" aria-hidden="true">
                    <span class="northline-topbar__mobile-status-dot"></span>
                    <span>Live roster</span>
                </div>

                <label class="northline-search rounded-full px-3.5 py-1.5 text-[0.7rem] text-slate-400">
                    <svg viewBox="0 0 16 16" fill="none" class="h-4 w-4" aria-hidden="true">
                        <circle cx="7" cy="7" r="4.2" stroke="currentColor" stroke-width="1.4"/>
                        <path d="m10.6 10.6 2.9 2.9" stroke="currentColor" stroke-linecap="round" stroke-width="1.4"/>
                    </svg>
                    <span>Find student or class...</span>
                </label>

                <div class="northline-topbar__divider h-6 w-px bg-slate-300"></div>

                <button type="button" class="northline-icon-button northline-icon-button--slate" aria-label="Notifications" data-northline-trigger-alerts>
                    <span class="material-symbols-outlined text-[1.05rem] leading-none" aria-hidden="true">campaign</span>
                </button>

                <div class="northline-topbar__user flex h-7.5 w-7.5 items-center justify-center rounded-full border-[1.5px] border-[#ff5c67] bg-[linear-gradient(180deg,#d9edf6,#9ecbde)] text-[0.66rem] font-bold text-slate-900">
                    GA
                </div>
            </div>
        </header>

        <div class="northline-workspace-frame flex min-h-0 flex-1 flex-col">
            <header class="northline-workspace-header" data-northline-workspace-header>
                <div class="flex min-w-0 flex-col gap-2.5">
                    <div class="flex flex-wrap items-center gap-2.5">
                        <div data-northline-header-context></div>
                        <div data-northline-header-filter></div>
                    </div>
                    <div class="northline-workspace-header__row flex items-start justify-between gap-4">
                        <div class="min-w-0">
                            <h4 class="northline-display northline-workspace-title" data-northline-view-title>
                                Teacher's Task &amp; Grading Center
                            </h4>
                            <p class="mt-1.5 max-w-3xl text-[0.78rem] font-medium text-slate-600" data-northline-view-description>
                                Class management, grading activity, and classroom follow-up for the current seminar.
                            </p>
                        </div>
                        <div class="northline-workspace-header__actions shrink-0 items-center gap-2" data-northline-header-actions></div>
                    </div>
                </div>
            </header>

            <div class="northline-view-stack relative min-h-0 flex-1" data-northline-view-stack>
                <section class="northline-view-panel h-full" data-northline-view-panel="dashboard"></section>
                <section class="northline-view-panel hidden h-full" data-northline-view-panel="documents"></section>
                <section class="northline-view-panel hidden h-full" data-northline-view-panel="exams"></section>
                <section class="northline-view-panel hidden h-full" data-northline-view-panel="students"></section>
            </div>
        </div>

        <div class="northline-overlay-layer pointer-events-none absolute inset-0 z-20 hidden" data-northline-overlay-layer>
            <div class="northline-overlay-shell hidden" data-northline-overlay="grading"></div>
            <div class="northline-overlay-shell northline-overlay-shell--compact hidden" data-northline-overlay="message"></div>
        </div>
    </div>
</div>
