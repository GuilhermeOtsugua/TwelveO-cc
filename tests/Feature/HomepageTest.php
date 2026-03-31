<?php

namespace Tests\Feature;

use DOMDocument;
use DOMNode;
use DOMXPath;
use Tests\TestCase;

class HomepageTest extends TestCase
{
    public function test_homepage_renders_core_sections_and_finished_harbor_artifacts(): void
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
            ->assertSeeText('Contact')
            ->assertSeeText('Quote release console')
            ->assertSeeText('Release locked')
            ->assertSeeText('Evidence rail')
            ->assertSeeText('Release lock rail')
            ->assertSeeText('Notify controller and reopen after tax match');

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
        $blockedButtonText = $this->firstText($xpath, '//*[@data-tdd-blocked-button]');

        self::assertSame(['Pricing owner', 'Controller', 'Quote release'], $stageLabels);
        self::assertSame(['focus', 'evidence', 'release'], $regionOrder);
        self::assertSame('Release locked', $blockedButtonText);
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

    private function firstText(DOMXPath $xpath, string $query): string
    {
        $node = $xpath->query($query)->item(0);

        self::assertNotNull($node);

        return trim($node->textContent);
    }
}
