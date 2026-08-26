const { describe, test, beforeEach } = require('node:test')
const assert = require('node:assert/strict')

const { stubModels } = require('../../helpers/models')

let findOne = async () => null
let findOneCalls = []

stubModels({
    api_workshoporganizer: {
        findOne: async options => {
            findOneCalls.push(options)
            return findOne(options)
        },
    },
})

const {
    hasHostAccess,
    hasOrganizerAccess,
} = require('../../../src/api/lib/workshopAccess')

const WORKSHOP = { id: 7, creator_id: 100 }

const HOST = { id: 100, is_staff: false }
const STAFF = { id: 200, is_staff: true }
const OUTSIDER = { id: 300, is_staff: false }

beforeEach(() => {
    findOne = async () => null
    findOneCalls = []
})

describe('hasHostAccess', () => {
    const cases = [
        { name: 'the workshop creator', user: HOST, expected: true },
        { name: 'a staff member', user: STAFF, expected: true },
        { name: 'an unrelated user', user: OUTSIDER, expected: false },
    ]

    for (const { name, user, expected } of cases) {
        test(`returns ${expected} for ${name}`, () => {
            assert.equal(!!hasHostAccess(WORKSHOP, user), expected)
        })
    }

    test('matches a string creator_id against a numeric user id', () => {
        // Sequelize can hand back either; the check is intentionally loose.
        assert.equal(hasHostAccess({ id: 7, creator_id: '100' }, HOST), true)
    })
})

describe('hasOrganizerAccess', () => {
    test('returns a boolean, not a promise or a model instance', async () => {
        findOne = async () => ({ id: 1, organizer_id: OUTSIDER.id })
        const result = await hasOrganizerAccess(WORKSHOP, OUTSIDER)

        assert.equal(typeof result, 'boolean')
        assert.equal(result, true)
    })

    test('denies a user who is not host, staff, or organizer', async () => {
        // The bug this replaces: an unawaited findOne returned a truthy
        // promise, so `if (!hasOrganizerAccess(...))` never denied anyone.
        findOne = async () => null
        assert.equal(await hasOrganizerAccess(WORKSHOP, OUTSIDER), false)
    })

    test('allows a listed organizer', async () => {
        findOne = async () => ({ id: 1, organizer_id: OUTSIDER.id })
        assert.equal(await hasOrganizerAccess(WORKSHOP, OUTSIDER), true)
    })

    test('looks the organizer up by workshop and user', async () => {
        await hasOrganizerAccess(WORKSHOP, OUTSIDER)

        assert.equal(findOneCalls.length, 1)
        assert.deepEqual(findOneCalls[0], {
            where: { workshop_id: WORKSHOP.id, organizer_id: OUTSIDER.id },
        })
    })

    const shortCircuit = [
        { name: 'the workshop creator', user: HOST },
        { name: 'a staff member', user: STAFF },
    ]

    for (const { name, user } of shortCircuit) {
        test(`allows ${name} without querying the organizer table`, async () => {
            assert.equal(await hasOrganizerAccess(WORKSHOP, user), true)
            assert.equal(findOneCalls.length, 0)
        })
    }

    test('propagates a lookup failure instead of allowing access', async () => {
        // A failed query must not read as "permitted".
        findOne = async () => {
            throw new Error('db is down')
        }
        await assert.rejects(
            () => hasOrganizerAccess(WORKSHOP, OUTSIDER),
            /db is down/
        )
    })

    test('the guard shape used by callers denies an outsider', async () => {
        // Mirrors `if (!(await hasOrganizerAccess(...))) return 403`.
        findOne = async () => null
        let denied = false
        if (!(await hasOrganizerAccess(WORKSHOP, OUTSIDER))) denied = true

        assert.equal(denied, true)
    })
})

describe('call sites in workshops.js', () => {
    // The original defect was not in the helper but at its call sites: an
    // unawaited call yields a truthy promise, so the 403 branch is dead. A unit
    // test of the helper cannot catch that, so check the source directly.
    const fs = require('node:fs')
    const path = require('node:path')
    const source = fs.readFileSync(
        path.join(__dirname, '..', '..', '..', 'src', 'api', 'workshops.js'),
        'utf8'
    )

    test('every hasOrganizerAccess call is awaited', () => {
        const calls = source
            .split('\n')
            .map((line, i) => ({ line, n: i + 1 }))
            .filter(({ line }) => /hasOrganizerAccess\(/.test(line))
            .filter(({ line }) => !/await hasOrganizerAccess\(/.test(line))
            .filter(({ line }) => !/require\(/.test(line))
            .filter(({ line }) => !/^\s*hasOrganizerAccess,\s*$/.test(line))

        assert.deepEqual(
            calls.map(c => `${c.n}: ${c.line.trim()}`),
            [],
            'un-awaited hasOrganizerAccess call sites'
        )
    })

    test('guards it at every call site it uses', () => {
        const count = (source.match(/await hasOrganizerAccess\(/g) || []).length
        assert.ok(count > 0, 'expected at least one awaited call site')
    })
})
