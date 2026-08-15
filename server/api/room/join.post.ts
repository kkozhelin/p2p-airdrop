export default defineEventHandler(async event => {
    const body = await readBody(event)

    if (!body || !body.pin) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Укажите PIN-код для подключения'
        })
    }

    const room = getRoomByPin(body.pin)

    if (!room) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Неверный PIN-код или сессия истекла'
        })
    }

    room.isPeerJoined = true

    return {
        success: true,
        roomId: room.id,
        pin: room.pin
    }
})
