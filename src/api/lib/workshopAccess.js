const models = require('../models')
const WorkshopOrganizer = models.api_workshoporganizer

/** True if the user created the workshop, or is staff. */
function hasHostAccess(workshop, user) {
    return workshop.creator_id == user.id || user.is_staff
}

/** True if the user has host access, or is a listed organizer of the workshop. */
async function hasOrganizerAccess(workshop, user) {
    if (hasHostAccess(workshop, user)) return true

    const organizer = await WorkshopOrganizer.findOne({
        where: { workshop_id: workshop.id, organizer_id: user.id },
    })
    return !!organizer
}

module.exports = { hasHostAccess, hasOrganizerAccess }
