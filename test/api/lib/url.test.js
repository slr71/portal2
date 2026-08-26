const { describe, test } = require('node:test')
const assert = require('node:assert/strict')

const { joinUrl } = require('../../../src/api/lib/url')

describe('joinUrl', () => {
    const cases = [
        {
            name: 'appends a segment to a bare base',
            base: 'http://example.test',
            paths: ['a'],
            expected: 'http://example.test/a',
        },
        {
            name: 'collapses a trailing slash on the base',
            base: 'http://example.test/',
            paths: ['a'],
            expected: 'http://example.test/a',
        },
        {
            name: 'collapses repeated trailing slashes on the base',
            base: 'http://example.test///',
            paths: ['a'],
            expected: 'http://example.test/a',
        },
        {
            name: 'strips a leading slash from a segment',
            base: 'http://example.test',
            paths: ['/a'],
            expected: 'http://example.test/a',
        },
        {
            name: 'strips repeated leading slashes from a segment',
            base: 'http://example.test',
            paths: ['///a'],
            expected: 'http://example.test/a',
        },
        {
            name: 'joins a trailing-slash base to a leading-slash segment',
            base: 'http://example.test/',
            paths: ['/a'],
            expected: 'http://example.test/a',
        },
        {
            name: 'joins multiple segments',
            base: 'http://example.test',
            paths: ['a', 'b', 'c'],
            expected: 'http://example.test/a/b/c',
        },
        {
            name: 'preserves a base path',
            base: 'http://example.test/base/',
            paths: ['a'],
            expected: 'http://example.test/base/a',
        },
        {
            name: 'returns the cleaned base when given no segments',
            base: 'http://example.test/',
            paths: [],
            expected: 'http://example.test',
        },
        {
            name: 'skips null, undefined, and empty segments',
            base: 'http://example.test',
            paths: [null, 'a', undefined, '', 'b'],
            expected: 'http://example.test/a/b',
        },
        {
            name: 'skips non-string segments',
            base: 'http://example.test',
            paths: [123, 'a'],
            expected: 'http://example.test/a',
        },
        {
            name: 'preserves a trailing slash within a segment',
            base: 'http://example.test',
            paths: ['a/', 'b'],
            expected: 'http://example.test/a//b',
        },
        {
            // Regression guard for the doubled slash that 404ed the VICE
            // service page (commit 5313513).
            name: 'does not double the slash on a configured terrain URL',
            base: 'https://de.example.test/terrain/',
            paths: ['requests', 'vice'],
            expected: 'https://de.example.test/terrain/requests/vice',
        },
    ]

    for (const { name, base, paths, expected } of cases) {
        test(name, () => {
            assert.equal(joinUrl(base, ...paths), expected)
        })
    }
})
