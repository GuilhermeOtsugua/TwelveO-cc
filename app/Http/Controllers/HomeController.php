<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class HomeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): View
    {
        return view('pages.home', [
            'credential' => $this->credential(),
            'contactLinks' => $this->contactLinks(),
            'currentFocus' => $this->currentFocus(),
            'projects' => $this->featuredProjects(),
        ]);
    }

    /**
     * @return array{
     *     eyebrow: string,
     *     bridge: string,
     *     title: string,
     *     issuer: string,
     *     description: string,
     *     action: array{
     *         label: string,
     *         href: string
     *     }
     * }
     */
    private function credential(): array
    {
        return [
            'eyebrow' => 'Credibility',
            'bridge' => 'From system thinking to working software.',
            'title' => 'Laravel Certified Developer',
            'issuer' => 'Certification for Laravel',
            'description' => 'A verifiable Laravel credential that anchors the portfolio in concrete implementation proof.',
            'action' => [
                'label' => 'View certificate',
                'href' => 'https://verifier.certificationforlaravel.org/b98145cf-0305-4e77-bc70-30d685ec434a',
            ],
        ];
    }

    /**
     * @return array{
     *     email: string,
     *     profiles: array<int, array{
     *         label: string,
     *         href: string
     *     }>
     * }
     */
    private function contactLinks(): array
    {
        return [
            'email' => 'guilherme@otsugua.dev',
            'profiles' => [
                [
                    'label' => 'LinkedIn',
                    'href' => 'https://www.linkedin.com/in/guilherme-augusto',
                ],
                [
                    'label' => 'GitHub',
                    'href' => 'https://github.com/otsugua',
                ],
            ],
        ];
    }

    /**
     * @return array{
     *     topic: string,
     *     summary: string,
     *     links: array<int, array{
     *         label: string,
     *         title: string,
     *         href: string
     *     }>
     * }
     */
    private function currentFocus(): array
    {
        return [
            'topic' => 'Agentic development',
            'summary' => 'I am studying how agent loops, scoped delegation, and acceptance-driven workflows keep AI-assisted product work inspectable instead of noisy.',
            'links' => [
                [
                    'label' => 'Theory',
                    'title' => 'Building effective agents',
                    'href' => 'https://www.anthropic.com/engineering/building-effective-agents',
                ],
                [
                    'label' => 'Repository',
                    'title' => 'TwelveO-cc',
                    'href' => 'https://github.com/GuilhermeOtsugua/TwelveO-cc',
                ],
            ],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function featuredProjects(): array
    {
        return [
            [
                'index' => '01',
                'principle' => 'TDD',
                'sequence' => 'Quiet verification',
                'category' => 'Pricing / Finance capability demo',
                'title' => 'Harbor Ledger',
                'description' => 'A fictional but plausible pricing workspace for finance teams where discount ladders, tax rules, approval paths, and margin floors have to stay correct on every quote.',
                'tags' => ['Executable rules', 'Scenario coverage', 'Approval flow'],
                'note' => [
                    'trigger' => 'Why it is built this way',
                    'body' => 'Test-first delivery makes rounding behavior, approval gates, and pricing rules executable before anyone relies on the interface. The interface is framed so rule logic and scenario verification can stay in view together, following the discipline Kent Beck describes in Test-Driven Development.',
                    'citation' => 'Principle: TDD',
                ],
                'surface' => [
                    'eyebrow' => 'Quote release / Evidence / Lock rail',
                    'title' => 'Quote release console',
                    'summary' => 'Harbor Ledger keeps the quote sheet, linked evidence, and blocked shipment state in one scan path so the decision reads before the note does.',
                    'focus' => [
                        'label' => 'Release console',
                        'title' => 'Harbor Freight Group renewal',
                        'quote' => 'Q-24031',
                        'status' => 'Blocked',
                        'stateDetail' => 'Controller sign-off and tax map still open',
                        'gate' => [
                            'label' => 'Blocking gate',
                            'title' => 'Controller sign-off open',
                            'detail' => 'Priya Shah still needs the district exception packet before shipment controls return.',
                        ],
                        'meta' => [
                            'owner' => 'Ana Torres / Pricing',
                            'motion' => '18-seat annual expansion',
                            'destination' => 'California + Nevada districts',
                        ],
                        'banner' => [
                            'label' => 'Active hold',
                            'title' => 'Controller sign-off and district exception are the only open blockers.',
                            'detail' => 'The quote cleared the renewal ladder and margin floor. Shipment stays blocked because the account spans California and Nevada and the controller exception is still unsigned.',
                            'chips' => [
                                'Margin floor cleared',
                                '2 packets linked',
                            ],
                        ],
                        'financials' => [
                            ['label' => 'Quoted ARR', 'value' => '$148,320'],
                            ['label' => 'Margin after discount', 'value' => '18.4%'],
                            ['label' => 'Freight credit', 'value' => '- $6,480'],
                            ['label' => 'Scenario suite', 'value' => '3 / 3 green'],
                        ],
                        'timeline' => [
                            ['label' => 'Pricing owner review', 'status' => 'Approved 08:42'],
                            ['label' => 'Rule packet matched', 'status' => 'Matched'],
                            ['label' => 'Controller sign-off', 'status' => 'Awaiting controller'],
                        ],
                        'action' => [
                            'label' => 'Release action',
                            'title' => 'Quote release',
                            'state' => 'Blocked until controller sign-off',
                            'detail' => 'Shipment stays suppressed until the controller closes the exception and the district map resolves to a releasable state.',
                            'supporting' => [
                                'District exception packet missing signature',
                                'Tax map still spans California and Nevada',
                            ],
                        ],
                    ],
                    'evidence' => [
                        'label' => 'Evidence rail',
                        'title' => 'Packets linked to the blocked release',
                        'detail' => 'Each packet stays product-like and specific: the matched rule, the unsigned tax exception, and the regression cases that keep shipment blocked.',
                        'packets' => [
                            [
                                'label' => 'Rule packet',
                                'title' => 'Renewal ladder 2026.3',
                                'detail' => 'Enterprise renewals above 12 seats escalate when post-discount margin drops below 18.5% after freight credits.',
                                'status' => 'Matched',
                                'items' => [
                                    '18-seat renewal landed at 18.4%',
                                    'Controller review required before release',
                                ],
                                'tone' => 'active',
                            ],
                            [
                                'label' => 'Tax exception',
                                'title' => 'CA / NV district exception packet',
                                'detail' => 'Cross-state district mapping blocks release until the destination map is resolved to a signed controller exception.',
                                'status' => 'Signature needed',
                                'items' => [
                                    'Destination map attached',
                                    'Signature missing',
                                ],
                                'tone' => 'blocked',
                            ],
                        ],
                        'casesLabel' => 'Scenario matrix',
                        'casesTitle' => '3 regression runs',
                        'cases' => [
                            [
                                'name' => 'Wholesale renewal / 18 seats',
                                'detail' => 'Margin floor held and escalated to controller review automatically.',
                                'result' => 'Pass',
                                'tone' => 'pass',
                            ],
                            [
                                'name' => 'Cross-region tax exception',
                                'detail' => 'District mismatch suppressed release controls and linked the exception packet.',
                                'result' => 'Hold',
                                'tone' => 'blocked',
                            ],
                            [
                                'name' => 'Renewal rescue / 9 seats',
                                'detail' => 'Stayed below the escalation threshold and skipped finance approval.',
                                'result' => 'Pass',
                                'tone' => 'pass',
                            ],
                        ],
                    ],
                    'approval' => [
                        'label' => 'Approval lane',
                        'value' => 'Pricing -> Controller -> Release',
                        'detail' => 'The open work stays small and explicit: pricing is done, controller sign-off is pending, and shipment stays blocked until the handoff closes.',
                        'stages' => [
                            ['label' => 'Pricing', 'status' => 'Approved', 'tone' => 'pass'],
                            ['label' => 'Controller', 'status' => 'Pending sign-off', 'tone' => 'pending'],
                            ['label' => 'Release', 'status' => 'Suppressed', 'tone' => 'blocked'],
                        ],
                    ],
                    'release' => [
                        'label' => 'Release lock rail',
                        'title' => 'Shipment stays blocked until both dependencies close.',
                        'detail' => 'The right rail keeps live blockers, gate ownership, and the reopen path in one operational strip instead of scattering them through body copy.',
                        'owner' => 'Priya Shah',
                        'summary' => '1 approval pending / 1 tax map blocked',
                        'checks' => [
                            ['label' => 'Renewal ladder coverage', 'status' => 'Passed', 'tone' => 'pass'],
                            ['label' => 'Controller approval', 'status' => 'Pending', 'tone' => 'pending'],
                            ['label' => 'Tax district mapping', 'status' => 'Blocked', 'tone' => 'blocked'],
                        ],
                        'cta' => [
                            'primary' => 'Shipment blocked',
                            'secondary' => 'Reopen after controller sign-off and tax match',
                        ],
                        'footer' => 'Shipment controls return after both gates close.',
                    ],
                ],
            ],
            [
                'index' => '02',
                'principle' => 'DDD',
                'sequence' => 'Coordinated language',
                'category' => 'Learning operations capability demo',
                'title' => 'Northline Learning Ops',
                'description' => 'A fictional but plausible learning operations platform for coordinators, instructors, assessors, students, and operations leads who all apply different rules inside the same domain.',
                'tags' => ['Shared language', 'Role views', 'Intervention case'],
                'note' => [
                    'trigger' => 'Why it is built this way',
                    'body' => 'Shared language keeps scheduling, assessment, attendance, interventions, and handoffs coherent as the product grows more roles, more workflows, and more rules. The same intervention case is allowed to appear differently across the surface so the domain stays unified without flattening role responsibility, echoing Evans on ubiquitous language and bounded context.',
                    'citation' => 'Principle: DDD',
                ],
                'surface' => [
                    'eyebrow' => 'Students / Instructors / Operations',
                    'title' => 'Learning operations board',
                    'summary' => 'One intervention case stays pinned while student progress, teaching response, and operations compliance render the same work at three different densities.',
                    'metrics' => [
                        ['label' => 'Active interventions', 'value' => '08'],
                        ['label' => 'Role views', 'value' => '3 zones'],
                        ['label' => 'Shared concept', 'value' => 'Case #184'],
                    ],
                    'case' => [
                        'label' => 'Shared intervention case',
                        'value' => 'Case #184 / Maya Chen / Attendance recovery',
                        'detail' => 'Attendance risk, workshop regrouping, guardian outreach, and closure readiness keep the same names across every role surface.',
                    ],
                    'thread' => [
                        'label' => 'Shared case thread',
                        'title' => 'Case #184 stays active across all role views',
                        'detail' => 'Every zone tracks the same intervention language, but each role only carries the detail needed to act.',
                        'stages' => [
                            ['label' => 'Attendance risk', 'status' => 'Recovered to 91%'],
                            ['label' => 'Instruction response', 'status' => 'Workshop regrouping'],
                            ['label' => 'Guardian outreach', 'status' => 'Logged 09:12'],
                            ['label' => 'Case closure', 'status' => 'Next sync pending'],
                        ],
                    ],
                    'zones' => [
                        [
                            'label' => 'Student progress',
                            'tone' => 'stable',
                            'density' => 'calm',
                            'headline' => 'Support milestone / Week 3',
                            'case_label' => 'Shared case',
                            'status' => 'Attendance recovered to 91%',
                            'detail' => 'Student-facing progress keeps the intervention legible as support work instead of escalation language.',
                            'snapshot_label' => 'Progress view',
                            'snapshot_value' => 'Week 3 support plan is holding',
                            'stats' => [
                                ['label' => 'Attendance', 'value' => '91%'],
                                ['label' => 'Confidence trend', 'value' => '+12%'],
                                ['label' => 'Next milestone', 'value' => 'Reading lab Fri'],
                            ],
                            'items' => [
                                'Reading lab check-in complete',
                                'Family update scheduled for Thursday',
                            ],
                        ],
                        [
                            'label' => 'Instructor planning',
                            'tone' => 'active',
                            'density' => 'active',
                            'headline' => 'Plan adjustment / Cohort B',
                            'case_label' => 'Teaching view',
                            'status' => 'Workshop regrouping requested',
                            'detail' => 'Instructors see the same case as a teaching intervention with pacing changes, rubric follow-up, and session planning.',
                            'snapshot_label' => 'Teaching move',
                            'snapshot_value' => 'Regroup Friday workshop before unit close',
                            'stats' => [
                                ['label' => 'Session risk', 'value' => 'Friday seminar'],
                                ['label' => 'Rubric checkpoint', 'value' => 'Add before close'],
                                ['label' => 'Mentor note', 'value' => 'Review pre-session'],
                            ],
                            'items' => [
                                'Shift seminar pairings for Friday',
                                'Add rubric checkpoint before unit close',
                            ],
                        ],
                        [
                            'label' => 'Operations desk',
                            'tone' => 'muted',
                            'density' => 'compressed',
                            'headline' => 'Escalation owner / Support desk',
                            'case_label' => 'Operations handoff',
                            'status' => 'Outreach logged / next sync open',
                            'detail' => 'Operations keeps the case grounded in outreach, owner assignment, and compliance history so it can move across teams cleanly.',
                            'snapshot_label' => 'Closure rail',
                            'snapshot_value' => 'Case stays open until next attendance sync lands',
                            'stats' => [
                                ['label' => 'Owner', 'value' => 'Support desk'],
                                ['label' => 'Guardian outreach', 'value' => '09:12 logged'],
                                ['label' => 'Closure gate', 'value' => 'Next sync'],
                            ],
                            'items' => [
                                'Guardian outreach logged at 09:12',
                                'Support review closes after next attendance sync',
                            ],
                        ],
                    ],
                ],
            ],
            [
                'index' => '03',
                'principle' => 'Design for impact',
                'sequence' => 'Crafted responsiveness',
                'category' => 'Creative studio portal capability demo',
                'title' => 'Studio Current',
                'description' => 'A fictional but plausible client portal for a creative studio where approvals, deliverables, and handoff details need a memorable interface with a strong visual identity without losing operational clarity.',
                'tags' => ['Review cycles', 'Asset delivery', 'Brand feedback'],
                'note' => [
                    'trigger' => 'Why it is built this way',
                    'body' => 'Interaction design is treated as product strategy: memorable transitions and branded feedback cues help clients move through reviews and approvals with less friction. The shared frame stays restrained so tactile responses and branded review moments feel useful instead of ornamental, in line with product-minded interaction design practice.',
                    'citation' => 'Principle: Design for impact',
                ],
                'surface' => [
                    'eyebrow' => 'Review / Delivery / Feedback',
                    'title' => 'Studio client portal',
                    'summary' => 'A studio-facing workspace built around one approval decision, one visible review flow, and a clean handoff lane.',
                    'metrics' => [
                        ['label' => 'Active briefs', 'value' => '06'],
                        ['label' => 'Review cycle', 'value' => 'Round 3'],
                        ['label' => 'Delivery packs', 'value' => '11'],
                    ],
                    'workstreams' => [
                        [
                            'label' => 'Active work',
                            'title' => 'Motion system refresh',
                            'status' => 'Editing now',
                            'detail' => 'Channel cutdowns, keynote loops, and social variants stay grouped inside one launch sprint so the client always sees the live work surface.',
                        ],
                        [
                            'label' => 'Approval queue',
                            'title' => 'Launch kit approval stack',
                            'status' => 'Window open',
                            'detail' => 'Annotated proof, motion cut, and logo lockup review stay in one visible queue before anything moves to handoff.',
                        ],
                    ],
                    'reviewFlow' => [
                        ['label' => 'Proof posted', 'status' => '09:40'],
                        ['label' => 'Client note pinned', 'status' => 'Calmer outro'],
                        ['label' => 'Approval action', 'status' => 'Ready'],
                    ],
                    'feedback' => [
                        'label' => 'Client review moment',
                        'title' => 'Approve opener animation with note',
                        'signal' => 'Client pickup ready',
                        'detail' => 'The approval state turns one feedback moment into the focal point: pinned note, selected proof, and release action stay in the same branded frame.',
                        'comment' => 'Hold the first two beats on the coral wordmark, then release the motion bed.',
                        'actions' => ['Approve with note', 'Route to exports'],
                        'badges' => ['Pinned note', 'Selected proof'],
                        'owner' => 'Mariana / Brand director',
                    ],
                    'delivery' => [
                        'label' => 'Final delivery handoff',
                        'value' => 'Exports staged after approval',
                        'title' => 'Launch pack ready once review closes',
                        'status' => 'Handoff kept separate from live review',
                        'items' => [
                            'Usage pack and export checklist ready',
                            'Brand-safe fallback assets attached to the handoff note',
                        ],
                    ],
                ],
            ],
        ];
    }
}
