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
            'contactLinks' => $this->contactLinks(),
            'currentFocus' => $this->currentFocus(),
            'projects' => $this->featuredProjects(),
        ]);
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
     * @return array<int, array{
     *     index: string,
     *     principle: string,
     *     category: string,
     *     title: string,
     *     description: string,
     *     rationale: string,
     *     notes: array<int, string>
     * }>
     */
    private function featuredProjects(): array
    {
        return [
            [
                'index' => '01',
                'principle' => 'TDD',
                'category' => 'Pricing / Finance capability demo',
                'title' => 'Harbor Ledger',
                'description' => 'A fictional but plausible pricing workspace for finance teams who need quote changes, approval paths, and margin rules to stay correct under pressure.',
                'rationale' => 'Test-first delivery keeps discount thresholds, tax edge cases, and approval rules explicit before interface polish is layered on top.',
                'notes' => [
                    'Business rules are written to pass examples before the UI depends on them.',
                    'Pricing exceptions stay visible instead of being buried in controller conditionals.',
                    'Operators get a calm review flow because correctness was designed into the workflow first.',
                ],
            ],
            [
                'index' => '02',
                'principle' => 'DDD',
                'category' => 'Learning operations capability demo',
                'title' => 'Northline Learning Ops',
                'description' => 'A fictional learning operations platform shaped for coordinators, instructors, assessors, and students who all touch the same domain from different angles.',
                'rationale' => 'Shared language keeps scheduling, assessment, attendance, and operations workflows coherent as the product grows more roles and rules.',
                'notes' => [
                    'Students, instructors, cohorts, assessments, and interventions are named as domain concepts, not generic records.',
                    'Each workflow is organized around the language operations teams already use together.',
                    'The product surface stays coherent because rules are grouped by bounded intent instead of page-by-page convenience.',
                ],
            ],
            [
                'index' => '03',
                'principle' => 'Design for impact',
                'category' => 'Creative studio portal capability demo',
                'title' => 'Studio Current',
                'description' => 'A fictional client portal for a creative studio where approvals, deliverables, and handoff details need a memorable interface without losing operational clarity.',
                'rationale' => 'Interaction design is treated as product strategy: a stronger visual identity helps clients move through feedback and approvals with less friction.',
                'notes' => [
                    'Motion and visual contrast reinforce the studio brand while keeping the workflow readable on mobile.',
                    'Approvals, asset delivery, and feedback states are obvious at a glance instead of hiding behind ornamental layouts.',
                    'Delight supports the operational job to be done rather than competing with it.',
                ],
            ],
        ];
    }
}
