<?php

namespace App\Support;

class HomepageContent
{
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
    public function credential(): array
    {
        return [
            'eyebrow' => 'From system thinking to working software.',
            'bridge' => 'From system thinking to working software.',
            'title' => 'Laravel Certified Developer',
            'issuer' => 'Certification for Laravel',
            'description' => 'Laravel certification with a public verification record.',
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
    public function contactLinks(): array
    {
        return [
            'email' => 'guilhermebartolis@gmail.com',
            'profiles' => [
                [
                    'label' => 'Upwork',
                    'href' => 'https://www.upwork.com/freelancers/otsugua',
                ],
                [
                    'label' => 'GitHub',
                    'href' => 'https://github.com/GuilhermeOtsugua/',
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
    public function currentFocus(): array
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
    public function featuredProjects(): array
    {
        return [
            [
                'index' => '01',
                'principle' => 'TDD',
                'sequence' => 'Quiet verification',
                'category' => 'Pricing / Finance capability demo',
                'title' => 'Harbor Ledger',
                'description' => 'A release-control workspace for finance teams where settlement reviews, approval paths, exception handling, and treasury sign-off have to stay precise before funds move.',
                'tags' => ['Executable rules', 'Scenario coverage', 'Approval flow'],
                'note' => [
                    'trigger' => 'Design Notes',
                    'body' => 'TDD keeps this finance workspace dependable by making approval rules, exception paths, and verification states explicit before anyone trusts the release flow, following Kent Beck\'s test-first discipline.',
                    'principle' => 'TDD',
                    'principle_label' => 'Test Driven Development',
                    'link_href' => 'https://martinfowler.com/bliki/TestDrivenDevelopment.html',
                ],
            ],
            [
                'index' => '02',
                'principle' => 'DDD',
                'sequence' => 'Coordinated language',
                'category' => 'Learning operations capability demo',
                'title' => 'Northline Learning Ops',
                'description' => 'A learning operations platform built around shared domain language, teacher-facing views, and coordinated classroom support workflows.',
                'tags' => ['Shared language', 'Teacher views', 'Classroom support'],
                'note' => [
                    'trigger' => 'Design Notes',
                    'body' => 'DDD keeps this learning operations slice coherent by giving attendance, assessment, and classroom follow-up work a shared language across teacher-facing views, in the spirit of Eric Evans.',
                    'principle' => 'DDD',
                    'principle_label' => 'Domain Driven Design',
                    'link_href' => 'https://martinfowler.com/bliki/DomainDrivenDesign.html',
                ],
            ],
            [
                'index' => '03',
                'principle' => 'Interaction design',
                'sequence' => 'Crafted responsiveness',
                'category' => 'Creative studio portal capability demo',
                'title' => 'Studio Current',
                'description' => 'A branded client portal for creative review, approval, and delivery.',
                'tags' => ['Review cycles', 'Asset delivery', 'Brand feedback'],
                'note' => [
                    'trigger' => 'Design Notes',
                    'body' => 'Interaction design shapes this portal by using feedback cues and review moments to guide clients through approvals without adding friction, following a product-minded approach to digital interaction.',
                    'principle' => 'Interaction Design',
                    'principle_label' => 'Interaction Design',
                    'link_href' => 'https://www.interaction-design.org/literature/topics/interaction-design',
                ],
            ],
        ];
    }
}
