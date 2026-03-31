<?php

namespace Tests\Feature;

use DOMDocument;
use DOMNode;
use DOMXPath;
use Tests\TestCase;

class HomepageTest extends TestCase
{
    public function test_homepage_renders_capability_bands_and_core_regions(): void
    {
        $response = $this->get(route('home'));
        $content = $response->getContent();
        $xpath = $this->xpathFor($content);

        $response
            ->assertOk()
            ->assertSeeText('Otsugua')
            ->assertSeeText('How I work')
            ->assertSeeText('Current Focus')
            ->assertSeeText('Harbor Ledger')
            ->assertSeeText('Northline Learning Ops')
            ->assertSeeText('Studio Current')
            ->assertSeeText('Laravel Certified Developer')
            ->assertSeeText('Contact');
        $response->assertDontSeeText('Three finished product surfaces. Scan the interface first; the notes only clarify the decisions.');

        self::assertSame(1, $this->countMatches($xpath, '//*[@data-capability-bands]'));
        self::assertSame(3, $this->countMatches($xpath, '//*[@data-project-band]'));
        self::assertSame(3, $this->countMatches($xpath, '//*[@data-project-surface]'));
        self::assertSame(3, $this->countMatches($xpath, '//*[@data-project-note-toggle]'));
        self::assertSame(3, $this->countMatches($xpath, '//*[@data-project-note-panel]'));
        self::assertSame(0, $this->countMatches($xpath, '//*[@data-qa-report-root]'));

        $principles = $this->attributeValues($xpath, '//*[@data-project-band]', 'data-project-band-principle');
        $noteStates = $this->attributeValues($xpath, '//*[@data-project-note-toggle]', 'aria-expanded');
        $noteLabels = $this->texts($xpath, '//*[@data-project-note-toggle]/span');

        self::assertSame(['TDD', 'DDD', 'Design for impact'], $principles);
        self::assertSame(['false', 'false', 'false'], $noteStates);
        self::assertSame(
            ['Why it is built this way', 'Why it is built this way', 'Why it is built this way'],
            $noteLabels
        );

        self::assertSame(1, $this->countMatches($xpath, '//*[@data-project-band-principle="TDD"]'));
        self::assertSame(1, $this->countMatches($xpath, '//*[@data-tdd-console and @data-tdd-region="focus"]'));
        self::assertSame(1, $this->countMatches($xpath, '//*[@data-tdd-quote-sheet]'));
        self::assertSame(1, $this->countMatches($xpath, '//*[@data-tdd-release-action]'));
        self::assertSame(1, $this->countMatches($xpath, '//*[@data-tdd-blocked-button and @aria-disabled="true"]'));
        self::assertSame(1, $this->countMatches($xpath, '//*[@data-tdd-lock-rail and @data-tdd-region="release"]'));
        self::assertSame(1, $this->countMatches($xpath, '//*[@data-tdd-evidence-packets]'));
        self::assertSame(2, $this->countMatches($xpath, '//*[@data-tdd-evidence-packet]'));
        self::assertSame(1, $this->countMatches($xpath, '//*[@data-tdd-scenario-matrix]'));
        self::assertSame(3, $this->countMatches($xpath, '//*[@data-tdd-scenario-case]'));
        self::assertSame(1, $this->countMatches($xpath, '//*[@data-tdd-approval-lane]'));
        self::assertSame(3, $this->countMatches($xpath, '//*[@data-tdd-approval-stage]'));
        self::assertSame(3, $this->countMatches($xpath, '//*[@data-tdd-release-check]'));

        $stageLabels = $this->texts($xpath, '//*[@data-tdd-approval-stage]//*[@data-tdd-stage-label]');
        $regionOrder = $this->attributeValues($xpath, '//*[@data-tdd-region]', 'data-tdd-region');

        self::assertSame(['Pricing', 'Controller', 'Release'], $stageLabels);
        self::assertSame(['focus', 'evidence', 'release'], $regionOrder);

        self::assertSame(1, $this->countMatches($xpath, '//*[@data-project-band-principle="DDD"]//*[@data-ddd-shared-case]'));
        self::assertSame(1, $this->countMatches($xpath, '//*[@data-project-band-principle="DDD"]//*[@data-ddd-shared-thread]'));
        self::assertSame(3, $this->countMatches($xpath, '//*[@data-project-band-principle="DDD"]//*[@data-ddd-role-zone]'));
        self::assertSame(
            ['calm', 'active', 'compressed'],
            $this->attributeValues($xpath, '//*[@data-project-band-principle="DDD"]//*[@data-ddd-role-zone]', 'data-ddd-role-zone')
        );

        self::assertSame(1, $this->countMatches($xpath, '//*[@data-project-band-principle="Design for impact"]//*[@data-impact-review-flow]'));
        self::assertSame(1, $this->countMatches($xpath, '//*[@data-project-band-principle="Design for impact"]//*[@data-impact-approval]'));
        self::assertSame(1, $this->countMatches($xpath, '//*[@data-project-band-principle="Design for impact"]//*[@data-impact-delivery]'));
    }

    private function xpathFor(string $html): DOMXPath
    {
        libxml_use_internal_errors(true);

        $dom = new DOMDocument();
        $dom->loadHTML($html);

        libxml_clear_errors();

        return new DOMXPath($dom);
    }

    private function countMatches(DOMXPath $xpath, string $query): int
    {
        return $xpath->query($query)->length;
    }

    /**
     * @return list<string>
     */
    private function texts(DOMXPath $xpath, string $query): array
    {
        $values = [];

        foreach ($xpath->query($query) as $node) {
            $values[] = trim($node->textContent);
        }

        return $values;
    }

    /**
     * @return list<string>
     */
    private function attributeValues(DOMXPath $xpath, string $query, string $attribute): array
    {
        $values = [];

        foreach ($xpath->query($query) as $node) {
            if ($node instanceof DOMNode && $node->attributes?->getNamedItem($attribute) !== null) {
                $values[] = $node->attributes->getNamedItem($attribute)->nodeValue;
            }
        }

        return $values;
    }
}
