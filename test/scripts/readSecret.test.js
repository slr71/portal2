const { describe, test } = require('node:test')
const assert = require('node:assert/strict')
const { Readable } = require('node:stream')

const { readSecret } = require('../../src/scripts/readSecret')

// A non-TTY readable that emits `str` then ends, standing in for piped stdin.
function mockInput(str) {
    const r = Readable.from([str])
    r.isTTY = false
    return r
}

describe('readSecret', () => {
    test('returns the env var when set, without touching stdin', async () => {
        const value = await readSecret({
            envVar: 'SECRET',
            env: { SECRET: 'from-env' },
            input: mockInput('from-stdin\n'),
        })
        assert.equal(value, 'from-env')
    })

    test('reads stdin when the env var is unset', async () => {
        const value = await readSecret({
            envVar: 'SECRET',
            env: {},
            input: mockInput('piped-token\n'),
        })
        assert.equal(value, 'piped-token')
    })

    test('reads stdin when no env var is named', async () => {
        assert.equal(await readSecret({ input: mockInput('abc\n') }), 'abc')
    })

    test('strips only the single trailing newline', async () => {
        // Leading/trailing spaces in the value itself are preserved.
        assert.equal(
            await readSecret({ input: mockInput('  pass word  \n') }),
            '  pass word  '
        )
    })

    test('handles input with no trailing newline', async () => {
        assert.equal(
            await readSecret({ input: mockInput('no-newline') }),
            'no-newline'
        )
    })

    test('an empty env var value falls through to stdin', async () => {
        const value = await readSecret({
            envVar: 'SECRET',
            env: { SECRET: '' },
            input: mockInput('stdin-wins\n'),
        })
        assert.equal(value, 'stdin-wins')
    })
})
