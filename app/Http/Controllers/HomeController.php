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
     *     title: string,
     *     description: string,
     *     snippet: string,
     *     snippet_x: string,
     *     snippet_y: string,
     *     snippet_shift_x: string,
     *     snippet_shift_y: string
     * }>
     */
    private function featuredProjects(): array
    {
        return [
            [
                'index' => '01',
                'title' => 'Harbor Ledger',
                'description' => 'A full-stack Laravel system that keeps business rules explicit and the operator flow calm.',
                'snippet' => "// controller stays thin\n// move business rules into a service\n// keep the domain easy to test",
                'snippet_x' => '66%',
                'snippet_y' => '-12%',
                'snippet_shift_x' => '18%',
                'snippet_shift_y' => '-8%',
            ],
            [
                'index' => '02',
                'title' => 'Studio Pulse',
                'description' => 'A responsive interface focused on fast interaction, predictable state, and clean front-end behavior.',
                'snippet' => "// local state for transient UI\n// lift only shared state\n// keep renders simple",
                'snippet_x' => '-12%',
                'snippet_y' => '60%',
                'snippet_shift_x' => '-10%',
                'snippet_shift_y' => '8%',
            ],
            [
                'index' => '03',
                'title' => 'Northline Ops',
                'description' => 'A maintainable product surface designed to grow without turning the structure into noise.',
                'snippet' => "// composition first\n// extract when patterns repeat\n// let the layout stay semantic",
                'snippet_x' => '58%',
                'snippet_y' => '48%',
                'snippet_shift_x' => '14%',
                'snippet_shift_y' => '10%',
            ],
        ];
    }
}
