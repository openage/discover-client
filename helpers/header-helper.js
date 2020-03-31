exports.build = (context) => {
    let headers = {}
    headers['Content-Type'] = 'application/json'
    if (context.role) {
        headers['x-role-key'] = context.role.key
    } else if (context.user && context.user.role) {
        headers['x-role-key'] = context.user.role.key
    } else if (context.tenant) {
        if (context.tenant.code) {
            headers['x-tenant-code'] = context.tenant.code
        }
    }

    if (context.session) {
        headers['x-session-id'] = context.session.id
    }

    if (context.id) {
        headers['x-context-id'] = context.id
    }

    return headers
}
