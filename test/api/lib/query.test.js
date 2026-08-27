const { describe, test } = require('node:test')
const assert = require('node:assert/strict')
const { Op } = require('sequelize')

const {
    escapeLike,
    like,
    likeAny,
    parsePagination,
    DEFAULT_PAGE_LIMIT,
    MAX_PAGE_LIMIT,
} = require('../../../src/api/lib/query')

describe('escapeLike', () => {
    const cases = [
        { in: 'plain', out: 'plain' },
        { in: '100%', out: '100\\%' },
        { in: 'a_b', out: 'a\\_b' },
        { in: 'back\\slash', out: 'back\\\\slash' },
        { in: '%_\\', out: '\\%\\_\\\\' },
        { in: 'a%b_c', out: 'a\\%b\\_c' },
        { in: 'no-meta.chars', out: 'no-meta.chars' },
    ]
    for (const c of cases) {
        test(`escapes ${JSON.stringify(c.in)}`, () => {
            assert.equal(escapeLike(c.in), c.out)
        })
    }

    test('coerces non-string input', () => {
        assert.equal(escapeLike(42), '42')
    })
})

// The pattern lives in the Where clause's logic under the Op.like key.
const patternOf = whereClause => whereClause.logic[Op.like]

describe('like / likeAny apply escaping', () => {
    test('like wraps an escaped, lowercased value', () => {
        assert.equal(patternOf(like('name', 'A%B')), '%a\\%b%')
    })

    test('likeAny escapes each value (values already lowercased)', () => {
        const anyClause = patternOf(likeAny('name', ['a%b', 'c_d']))
        assert.deepEqual(anyClause[Op.any], ['%a\\%b%', '%c\\_d%'])
    })

    test('a bare wildcard search no longer matches everything', () => {
        // '%' as a search term becomes the literal '%', not match-all.
        assert.equal(patternOf(like('name', '%')), '%\\%%')
    })
})

describe('parsePagination', () => {
    const cases = [
        { name: 'absent', query: {}, limit: DEFAULT_PAGE_LIMIT, offset: 0 },
        {
            name: 'valid values',
            query: { limit: '25', offset: '40' },
            limit: 25,
            offset: 40,
        },
        {
            name: 'over the cap',
            query: { limit: '100000' },
            limit: MAX_PAGE_LIMIT,
            offset: 0,
        },
        {
            name: 'zero limit floored to 1',
            query: { limit: '0' },
            limit: 1,
            offset: 0,
        },
        {
            name: 'negative limit floored to 1',
            query: { limit: '-5' },
            limit: 1,
            offset: 0,
        },
        {
            name: 'non-numeric limit -> default',
            query: { limit: 'abc' },
            limit: DEFAULT_PAGE_LIMIT,
            offset: 0,
        },
        {
            name: 'negative offset floored to 0',
            query: { offset: '-10' },
            limit: DEFAULT_PAGE_LIMIT,
            offset: 0,
        },
        {
            name: 'non-numeric offset -> 0',
            query: { offset: 'xyz' },
            limit: DEFAULT_PAGE_LIMIT,
            offset: 0,
        },
        {
            name: 'at the cap exactly',
            query: { limit: '100' },
            limit: 100,
            offset: 0,
        },
    ]
    for (const c of cases) {
        test(c.name, () => {
            const { limit, offset } = parsePagination(c.query)
            assert.equal(limit, c.limit)
            assert.equal(offset, c.offset)
        })
    }

    test('honors a custom maxLimit', () => {
        assert.equal(
            parsePagination({ limit: '900' }, { maxLimit: 500 }).limit,
            500
        )
    })
})
