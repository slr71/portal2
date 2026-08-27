// Shared query-construction helpers: case-insensitive LIKE search (with
// metacharacter escaping) and pagination parsing. Previously the `like` helper
// was copy-pasted into several route files without escaping.

const sequelize = require('sequelize')

const DEFAULT_PAGE_LIMIT = 10
const MAX_PAGE_LIMIT = 100

// Escapes the LIKE metacharacters so a user's search term matches literally
// rather than acting as a wildcard. Postgres treats backslash as the default
// LIKE escape character, so backslash, percent, and underscore are escaped.
function escapeLike(value) {
    return String(value).replace(/[\\%_]/g, '\\$&')
}

// Case-insensitive substring match on `key` for a single value.
const like = (key, val) =>
    sequelize.where(sequelize.fn('lower', sequelize.col(key)), {
        [sequelize.Op.like]: `%${escapeLike(val.toLowerCase())}%`,
    })

// Case-insensitive substring match on `key` for any of `vals` (already lowercased).
const likeAny = (key, vals) =>
    sequelize.where(sequelize.fn('lower', sequelize.col(key)), {
        [sequelize.Op.like]: {
            [sequelize.Op.any]: vals.map(v => `%${escapeLike(v)}%`),
        },
    })

// Parses limit/offset query params into safe bounded integers: limit is clamped
// to [1, maxLimit] (defaulting to defaultLimit when absent/invalid) and offset
// floors at 0. Keeps a client from requesting an unbounded page.
function parsePagination(
    query,
    { defaultLimit = DEFAULT_PAGE_LIMIT, maxLimit = MAX_PAGE_LIMIT } = {}
) {
    const rawLimit = parseInt(query.limit, 10)
    const limit = Number.isNaN(rawLimit)
        ? defaultLimit
        : Math.min(Math.max(rawLimit, 1), maxLimit)

    const rawOffset = parseInt(query.offset, 10)
    const offset = Number.isNaN(rawOffset) ? 0 : Math.max(rawOffset, 0)

    return { limit, offset }
}

module.exports = {
    escapeLike,
    like,
    likeAny,
    parsePagination,
    DEFAULT_PAGE_LIMIT,
    MAX_PAGE_LIMIT,
}
