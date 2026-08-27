const { describe, test } = require('node:test')
const assert = require('node:assert/strict')

const {
    escapeHtml,
    renderTemplate,
} = require('../../../src/api/lib/emailTemplate')

describe('escapeHtml', () => {
    test('escapes the HTML metacharacters', () => {
        assert.equal(
            escapeHtml(`<b>a</b>&"'`),
            '&lt;b&gt;a&lt;/b&gt;&amp;&quot;&#39;'
        )
    })
    test('coerces non-strings', () => {
        assert.equal(escapeHtml(42), '42')
    })
})

describe('renderTemplate', () => {
    test('escapes field values in an HTML template (injection blocked)', () => {
        const out = renderTemplate(
            '<li>${FULL_NAME}</li>',
            { FULL_NAME: '<script>alert(1)</script>' },
            true
        )
        assert.equal(out, '<li>&lt;script&gt;alert(1)&lt;/script&gt;</li>')
        assert.doesNotMatch(out, /<script>/)
    })

    test('leaves field values literal in a text template', () => {
        const out = renderTemplate(
            'Name: ${FULL_NAME}',
            { FULL_NAME: 'a<b>c' },
            false
        )
        assert.equal(out, 'Name: a<b>c')
    })

    test('replaces all occurrences, case-insensitively', () => {
        const out = renderTemplate('${X}-${x}', { X: 'v' }, false)
        assert.equal(out, 'v-v')
    })

    test('treats a $ in the value literally (no replace-pattern injection)', () => {
        const out = renderTemplate('${V}', { V: '$& $1 $$ end' }, false)
        assert.equal(out, '$& $1 $$ end')
    })

    test('escapes a phishing form injected via a name field', () => {
        const evil = '<form action="https://evil.test"><input name="pw"></form>'
        const out = renderTemplate('<p>${NAME}</p>', { NAME: evil }, true)
        assert.doesNotMatch(out, /<form/)
        assert.match(out, /&lt;form/)
    })

    test('escapes ampersands in a URL value for HTML (still valid href)', () => {
        const out = renderTemplate(
            '<a href="${URL}">x</a>',
            { URL: 'https://h/x?a=1&b=2' },
            true
        )
        assert.match(out, /a=1&amp;b=2/)
    })
})
