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
            ->assertSeeText('Quiet verification')
            ->assertSeeText('Executable rules')
            ->assertSeeText('discount ladders, tax rules, approval paths, and margin floors have to stay correct on every quote')
            ->assertSeeText('Selected rule')
            ->assertSeeText('Renewal ladder 2026.3')
            ->assertSeeText('Linked to 3 scenario cases')
            ->assertSeeText('Enterprise renewals above 12 seats require controller review whenever the post-discount margin lands below 18%')
            ->assertSeeText('Scenario case')
            ->assertSeeText('Wholesale renewal / 18 seats')
            ->assertSeeText('Tax district mismatch blocked release until mapping is resolved')
            ->assertSeeText('Controller approval trace')
            ->assertSeeText('Pricing lead -> Controller -> Quote release')
            ->assertSeeText('Why it is shaped this way')
            ->assertSeeText('Test-first delivery makes rounding behavior, approval gates, and pricing rules executable before anyone relies on the interface')
            ->assertSeeText('The interface is framed so rule logic and scenario verification can stay in view together')
            ->assertSeeText('Principle: TDD')
            ->assertSee('data-project-note-toggle', false)
            ->assertSeeText('Northline Learning Ops')
            ->assertSeeText('DDD')
            ->assertSeeText('Coordinated language')
            ->assertSeeText('Shared language')
            ->assertSeeText('coordinators, instructors, assessors, students, and operations leads who all apply different rules inside the same domain')
            ->assertSeeText('Shared language keeps scheduling, assessment, attendance, interventions, and handoffs coherent as the product grows more roles, more workflows, and more rules')
            ->assertSeeText('The same intervention case is allowed to appear differently across the surface')
            ->assertSeeText('Shared intervention case')
            ->assertSeeText('Case #184 / Maya Chen / Attendance recovery')
            ->assertSeeText('Student progress')
            ->assertSeeText('Instructor planning')
            ->assertSeeText('Operations desk')
            ->assertSeeText('Attendance recovered to 91%')
            ->assertSeeText('Workshop regrouping requested')
            ->assertSeeText('Outreach logged and compliant')
            ->assertSeeText('Guardian outreach logged at 09:12')
            ->assertSeeText('Principle: DDD')
            ->assertSeeText('Studio Current')
            ->assertSeeText('Design for impact')
            ->assertSeeText('Crafted responsiveness')
            ->assertSeeText('Review cycles')
            ->assertSeeText('approvals, deliverables, and handoff details need a memorable interface with a strong visual identity without losing operational clarity')
            ->assertSeeText('Interaction design is treated as product strategy: memorable transitions and branded feedback cues help clients move through reviews and approvals with less friction')
            ->assertSeeText('The shared frame stays restrained so tactile responses and branded review moments feel useful instead of ornamental')
            ->assertSeeText('Principle: Design for impact')
            ->assertSee('data-project-note-panel', false)
            ->assertSeeText('Credibility')
            ->assertSeeText('From system thinking to working software.')
            ->assertSeeText('Laravel Certified Developer')
            ->assertSeeText('Certification for Laravel')
            ->assertSeeText('A verifiable Laravel credential that anchors the portfolio in concrete implementation proof.')
            ->assertSeeText('View certificate')
            ->assertSee('https://verifier.certificationforlaravel.org/b98145cf-0305-4e77-bc70-30d685ec434a')
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
