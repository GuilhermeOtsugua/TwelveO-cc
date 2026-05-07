<?php

namespace Tests\Feature;

use DOMDocument;
use DOMNode;
use DOMXPath;
use Tests\TestCase;

class HomepageTest extends TestCase
{
    public function test_homepage_route_is_available(): void
    {
        $this->get(route('home'))->assertOk();
    }

    public function test_homepage_renders_the_correct_contact_links(): void
    {
        $response = $this->get(route('home'));
        $xpath = $this->xpathFor($response->getContent());

        $response->assertOk();

        self::assertSame(1, $this->countMatches($xpath, '//*[@data-copy-email="guilhermebartolis@gmail.com"]'));
        self::assertSame(1, $this->countMatches($xpath, '//a[@href="https://github.com/GuilhermeOtsugua/"]'));
        self::assertSame(1, $this->countMatches($xpath, '//a[@href="https://www.linkedin.com/in/guilhermeotsugua/"]'));
    }

    public function test_homepage_renders_the_theme_control_and_boot_hooks(): void
    {
        $response = $this->get(route('home'));
        $content = $response->getContent();
        $xpath = $this->xpathFor($content);

        $response->assertOk();

        self::assertSame(1, $this->countMatches($xpath, '//*[@data-theme-root]'));
        self::assertSame(1, $this->countMatches($xpath, '//*[@data-theme-root and @data-theme-preference="system" and @data-theme-effective="light"]'));
        self::assertSame(1, $this->countMatches($xpath, '//*[@data-theme-toggle]'));
        self::assertSame(3, $this->countMatches($xpath, '//*[@data-theme-option]'));
        self::assertSame(['system', 'dark', 'light'], $this->attributeValues($xpath, '//*[@data-theme-option]', 'data-theme-option'));
        self::assertSame(['true', 'false', 'false'], $this->attributeValues($xpath, '//*[@data-theme-option]', 'aria-pressed'));
        self::assertSame(1, $this->countMatches($xpath, '//head//script[@data-theme-boot]'));
    }

    private function xpathFor(string $html): DOMXPath
    {
        libxml_use_internal_errors(true);

        $dom = new DOMDocument;
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
