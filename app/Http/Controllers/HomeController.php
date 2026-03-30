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
                    'trigger' => 'Why it is shaped this way',
                    'body' => 'Test-first delivery makes rounding behavior, approval gates, and pricing rules executable before anyone relies on the interface. The interface is framed so rule logic and scenario verification can stay in view together, following the discipline Kent Beck describes in Test-Driven Development.',
                    'citation' => 'Principle: TDD',
                ],
                'surface' => [
                    'eyebrow' => 'Rules / Cases / Approvals',
                    'title' => 'Quote release workspace',
                    'summary' => 'A shared frame for rule review, case validation, and sign-off visibility.',
                    'metrics' => [
                        ['label' => 'Linked cases', 'value' => '12'],
                        ['label' => 'Variance watch', 'value' => '0.4%'],
                        ['label' => 'Approval path', 'value' => '2 gates'],
                    ],
                    'lanes' => [
                        ['label' => 'Rule set', 'value' => 'Margin floor / tax district / renewal ladder', 'tone' => 'stable'],
                        ['label' => 'Scenario queue', 'value' => 'Wholesale renewal / exception path / region cross-check', 'tone' => 'active'],
                        ['label' => 'Release state', 'value' => 'Awaiting controller sign-off', 'tone' => 'muted'],
                    ],
                    'rules' => [
                        [
                            'label' => 'Selected rule',
                            'title' => 'Renewal ladder 2026.3',
                            'detail' => 'Enterprise renewals above 12 seats require controller review whenever the post-discount margin lands below 18%.',
                            'status' => 'Linked to 3 scenario cases',
                            'active' => true,
                        ],
                        [
                            'label' => 'Guardrail',
                            'title' => 'Regional tax district cross-check',
                            'detail' => 'Quotes that mix destination states must lock tax resolution before release.',
                            'status' => 'Waiting on district match',
                            'active' => false,
                        ],
                    ],
                    'cases' => [
                        [
                            'name' => 'Wholesale renewal / 18 seats',
                            'detail' => 'Margin floor held at 18.4% and approval path escalated.',
                            'result' => 'Pass',
                            'tone' => 'pass',
                        ],
                        [
                            'name' => 'Exception quote / cross-region tax',
                            'detail' => 'Tax district mismatch blocked release until mapping is resolved.',
                            'result' => 'Review',
                            'tone' => 'review',
                        ],
                        [
                            'name' => 'Renewal rescue / 9 seats',
                            'detail' => 'Scenario stayed below escalation threshold and skipped controller review.',
                            'result' => 'Pass',
                            'tone' => 'pass',
                        ],
                    ],
                    'approval' => [
                        'label' => 'Controller approval trace',
                        'value' => 'Pricing lead -> Controller -> Quote release',
                        'detail' => 'Variance cleared. Tax district cross-check remains the only active hold.',
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
                    'trigger' => 'Why it is shaped this way',
                    'body' => 'Shared language keeps scheduling, assessment, attendance, interventions, and handoffs coherent as the product grows more roles, more workflows, and more rules. The same intervention case is allowed to appear differently across the surface so the domain stays unified without flattening role responsibility, echoing Evans on ubiquitous language and bounded context.',
                    'citation' => 'Principle: DDD',
                ],
                'surface' => [
                    'eyebrow' => 'Students / Instructors / Operations',
                    'title' => 'Learning operations board',
                    'summary' => 'One operational frame, split into role-shaped views around the same domain objects.',
                    'metrics' => [
                        ['label' => 'Active interventions', 'value' => '08'],
                        ['label' => 'Role views', 'value' => '3 zones'],
                        ['label' => 'Shared concept', 'value' => 'Case #184'],
                    ],
                    'lanes' => [
                        ['label' => 'Student progress', 'value' => 'Attendance risk watch / support milestone / case status', 'tone' => 'stable'],
                        ['label' => 'Instructor planning', 'value' => 'Session adjustment / rubric follow-up / intervention note', 'tone' => 'active'],
                        ['label' => 'Operations desk', 'value' => 'Escalation owner / family outreach / compliance trail', 'tone' => 'muted'],
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
                    'trigger' => 'Why it is shaped this way',
                    'body' => 'Interaction design is treated as product strategy: memorable transitions and branded feedback cues help clients move through reviews and approvals with less friction. The shared frame stays restrained so tactile responses and branded review moments feel useful instead of ornamental, in line with product-minded interaction design practice.',
                    'citation' => 'Principle: Design for impact',
                ],
                'surface' => [
                    'eyebrow' => 'Review / Delivery / Feedback',
                    'title' => 'Studio client portal',
                    'summary' => 'A common surface model tuned for active work, review loops, and delivery clarity.',
                    'metrics' => [
                        ['label' => 'Assets in review', 'value' => '14'],
                        ['label' => 'Feedback cycle', 'value' => 'Round 3'],
                        ['label' => 'Client response', 'value' => '2.4h'],
                    ],
                    'lanes' => [
                        ['label' => 'Active work', 'value' => 'Launch kit / social pack / event markups', 'tone' => 'stable'],
                        ['label' => 'Review queue', 'value' => 'Annotated proof / motion cut / brand feedback', 'tone' => 'active'],
                        ['label' => 'Delivery window', 'value' => 'Final exports / usage pack / handoff note', 'tone' => 'muted'],
                    ],
                ],
            ],
        ];
    }
}
