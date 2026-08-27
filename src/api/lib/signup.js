// Columns a user may set at signup. Everything else on account_user
// (id, password, is_superuser/is_staff/is_active, has_verified_email,
// last_login, date_joined, institution, participate_in_study,
// subscribe_to_newsletter, orcid_id, user_institution_id, settings, updated_at)
// is server-controlled and must not be mass-assignable from the request body.
const SIGNUP_USER_FIELDS = [
    'username',
    'first_name',
    'last_name',
    'email',
    'department',
    'grid_institution_id',
    'occupation_id',
    'research_area_id',
    'funding_agency_id',
    'region_id',
    'gender_id',
    'ethnicity_id',
    'aware_channel_id',
]

/** Returns only the allowlisted, user-settable fields from a signup body. */
function pickSignupFields(fields) {
    const out = {}
    for (const key of SIGNUP_USER_FIELDS)
        if (fields && key in fields) out[key] = fields[key]
    return out
}

module.exports = { SIGNUP_USER_FIELDS, pickSignupFields }
