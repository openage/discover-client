const config = require('config').get('providers')['discover']
const headerHelper = require('./header-helper')
const client = new (require('node-rest-client-promise')).Client()
const buildUrl = require('build-url')

const put = async (id, model, options, collection, context) => {
    if (config.disabled) {
        return {}
    }
    options = options || {}
    const args = {
        headers: headerHelper.build(context),
        data: model
    }

    let url = buildUrl(config.url, {
        path: `${collection}/${id}`,
        queryParams: options.query
    })

    context.logger.debug(`sending payload to url: ${url}`)

    let response = await client.putPromise(url, args)
    if (!response.data.isSuccess) {
        context.logger.error(response.data.message || response.data.error)
        throw new Error(response.data.message || response.data.error)
    }

    return response.data.data
}

const get = async (id, options, collection, context) => {
    if (config.disabled) {
        return {}
    }
    options = options || {}
    const args = {
        headers: headerHelper.build(context)
    }

    let url = buildUrl(config.url, {
        path: `${collection}/${id}`,
        queryParams: options.query
    })

    context.logger.debug(`sending payload to url: ${url}`)

    let response = await client.getPromise(url, args)
    if (!response.data.isSuccess) {
        context.logger.error(response.data.message || response.data.error)
        throw new Error(response.data.message || response.data.error)
    }

    return response.data.data
}

const search = async (query, options, collection, context) => {
    if (config.disabled) {
        return []
    }

    options = options || {}
    // TODO: paging

    const args = {
        headers: headerHelper.build(context)
    }

    let url = buildUrl(config.url, {
        path: options.path ? `${collection}/${options.path}` : collection,
        queryParams: query
    })

    context.logger.debug(`sending payload to url: ${url}`)

    let response = await client.getPromise(url, args)
    if (!response.data.isSuccess) {
        context.logger.error(response.data.message || response.data.error)
        throw new Error(response.data.message || response.data.error)
    }

    return response.data.items
}

const post = async (model, options, collection, context) => {
    if (config.disabled) {
        return {}
    }

    options = options || {}
    const args = {
        headers: headerHelper.build(context),
        data: model
    }

    let url = buildUrl(config.url, {
        path: options.path ? `${collection}/${options.path}` : collection,
        queryParams: options.query
    })

    context.logger.debug(`sending payload to url: ${url}`)

    let response = await client.postPromise(url, args)
    if (!response.data.isSuccess) {
        context.logger.error(response.data.message || response.data.error)
        throw new Error(response.data.message || response.data.error)
    }

    return response.data.data
}

module.exports = (collection) => {
    return {
        create: async (model, options, context) => {
            return post(model, options, collection, context)
        },
        search: async (query, options, context) => {
            return search(query, options, collection, context)
        },
        get: async (id, options, context) => {
            return get(id, options, collection, context)
        },
        update: async (id, model, options, context) => {
            return put(id, model, options, collection, context)
        },
        post: async (model, options, context) => {
            return post(model, options, collection, context)
        }
    }
}
