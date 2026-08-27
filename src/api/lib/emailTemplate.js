// Pure email-template rendering, extracted so the escaping is testable without
// loading the email module's config/conductor dependencies.

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

// Substitutes ${FIELD} placeholders. For HTML templates every value is
// HTML-escaped so user-controlled fields (names, institution, etc.) cannot
// inject markup into the rendered email; text templates are left literal.
// A replacement function is used so a '$' in a value can't be interpreted as a
// String.replace special pattern.
function renderTemplate(template, fields, isHtml) {
    let out = template
    for (const field in fields) {
        const regex = new RegExp('\\$\\{' + field + '\\}', 'gi')
        const value = isHtml ? escapeHtml(fields[field]) : String(fields[field])
        out = out.replace(regex, () => value)
    }
    return out
}

module.exports = { escapeHtml, renderTemplate }
