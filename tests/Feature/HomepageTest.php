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
            ->assertSeeText('Contact')
            ->assertSeeText('Harbor Ledger');
    }
}
