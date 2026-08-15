export default defineEventHandler(async event => {
    const body = await readBody(event)

    if (!body || !body.roomId || !body.role || !body.signal) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Некорректный формат сигнального сообщения'
        })
    }

    const { roomId, role, signal } = body

    if (role !== 'host' && role !== 'peer') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Роль должна быть host или peer'
        })
    }

    const success = addSignalToRoom(roomId, role, signal)

    if (!success) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Комната не найдена или истекла'
        })
    }

    return {
        success: true
    }
})
