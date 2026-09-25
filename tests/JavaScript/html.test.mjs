import assert from 'node:assert/strict';
import { test } from 'node:test';
import { escapeHtml } from '../../resources/js/html.js';

test('escapes text and both quote styles without double-escaping its own output', () => {
    assert.equal(escapeHtml(`<script title="a&b">'test'</script>`),
        '&lt;script title=&quot;a&amp;b&quot;&gt;&#39;test&#39;&lt;/script&gt;');
});

test('treats existing entities as literal text and preserves Unicode', () => {
    assert.equal(escapeHtml('João &amp; café'), 'João &amp;amp; café');
});

test('preserves the existing string coercion contract', () => {
    for (const value of ['', 0, false, null, undefined]) {
        assert.equal(escapeHtml(value), String(value));
    }
});
