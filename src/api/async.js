const router = require('express').Router()
const axios = require('axios')
const { logger } = require('./lib/logging')
const { requireAdmin, asyncHandler } = require('./lib/auth')
const {
    getPortalConductorUrl,
    getPortalConductorAuth,
    getPortalConductorHttpsAgent,
} = require('./workflows/native/services/utils')

function createAxiosConfig(auth) {
    return {
        auth,
        timeout: 30000,
        httpsAgent: getPortalConductorHttpsAgent(),
    }
}

// List analyses filtered by status (ADMIN ONLY)
router.get(
    '/analyses',
    requireAdmin,
    asyncHandler(async (req, res) => {
        const status = req.query.status || 'Running'
        logger.info(`Listing analyses with status: ${status}`)

        const conductorUrl = getPortalConductorUrl()
        const auth = getPortalConductorAuth()
        const axiosConfig = createAxiosConfig(auth)

        try {
            const response = await axios.get(`${conductorUrl}/async/analyses`, {
                ...axiosConfig,
                params: { status },
            })

            res.json(response.data)
        } catch (error) {
            const statusCode = error.response?.status || 'unknown'
            const errorDetail = error.response?.data || error.message
            logger.error(
                `Failed to fetch analyses from portal-conductor (HTTP ${statusCode}): ${JSON.stringify(
                    errorDetail
                )}`
            )
            throw error // Re-throw to let asyncHandler handle it
        }
    })
)

// Get analysis details including parameters (ADMIN ONLY)
router.get(
    '/analyses/:analysisId/details',
    requireAdmin,
    asyncHandler(async (req, res) => {
        const { analysisId } = req.params
        logger.info(`Fetching details for analysis: ${analysisId}`)

        const conductorUrl = getPortalConductorUrl()
        const auth = getPortalConductorAuth()
        const axiosConfig = createAxiosConfig(auth)

        try {
            const response = await axios.get(
                `${conductorUrl}/async/analyses/${encodeURIComponent(
                    analysisId
                )}/details`,
                axiosConfig
            )

            res.json(response.data)
        } catch (error) {
            const statusCode = error.response?.status || 'unknown'
            const errorDetail = error.response?.data || error.message
            logger.error(
                `Failed to fetch analysis details from portal-conductor (HTTP ${statusCode}): ${JSON.stringify(
                    errorDetail
                )}`
            )
            throw error // Re-throw to let asyncHandler handle it
        }
    })
)

module.exports = router
