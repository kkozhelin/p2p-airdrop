export default defineEventHandler(async event => {
    const body = await readBody(event)

    if (!body || !body.roomId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Отсутствует ID комнаты'
        })
    }

    const success = deleteRoom(body.roomId)

    return {
        success
    }
})
