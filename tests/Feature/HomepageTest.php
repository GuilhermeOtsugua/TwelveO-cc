<?php

namespace Tests\Feature;

use Tests\TestCase;

class HomepageTest extends TestCase
{
    /**
     * Ensure the homepage renders the expected landing page content.
     */
    public function test_homepage_is_rendered(): void
    {
        $response = $this->get(route('home'));

        $response
            ->assertOk()
            ->assertSeeText('Otsugua')
            ->assertSeeText('full-stack Laravel developer')
            ->assertSeeText('clear, testable, and coherent as they grow')
            ->assertSeeText('How I work')
            ->assertSeeText('Current Focus')
            ->assertSeeText('Agentic development')
            ->assertSeeText('Building effective agents')
            ->assertSee('https://www.anthropic.com/engineering/building-effective-agents')
            ->assertSeeText('TwelveO-cc')
            ->assertSee('https://github.com/GuilhermeOtsugua/TwelveO-cc')
            ->assertSeeText('Here’s How I Shape Products')
            ->assertSeeText('fictional but plausible capability demonstrations')
            ->assertSeeText('Harbor Ledger')
            ->assertSeeText('TDD')
            ->assertSeeText('discount ladders, tax rules, approval paths, and margin floors have to stay correct on every quote')
            ->assertSeeText('Test-first delivery makes rounding behavior, approval gates, and pricing rules executable before anyone relies on the interface')
            ->assertSeeText('Strict pricing rules live in named domain behavior instead of being scattered through request handlers')
            ->assertSeeText('Northline Learning Ops')
            ->assertSeeText('DDD')
            ->assertSeeText('Studio Current')
            ->assertSeeText('Design for impact')
            ->assertSeeText('Contact')
            ->assertSeeText('Email')
            ->assertSee('data-copy-email="guilherme@otsugua.dev"', false)
            ->assertSeeText('Copied')
            ->assertDontSee('mailto:guilherme@otsugua.dev')
            ->assertSeeText('LinkedIn')
            ->assertSee('https://www.linkedin.com/in/guilherme-augusto')
            ->assertSeeText('GitHub')
            ->assertSee('https://github.com/otsugua');
    }
}
