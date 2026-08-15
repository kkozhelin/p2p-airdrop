export default defineEventHandler(event => {
    const query = getQuery(event)
    const roomId = query.roomId as string

    if (!roomId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Укажите ID комнаты'
        })
    }

    const room = getRoomById(roomId)

    if (!room) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Сессия не найдена или истекла'
        })
    }

    return {
        success: true,
        roomId: room.id,
        pin: room.pin,
        isPeerJoined: room.isPeerJoined,
        hostSignals: room.hostSignals,
        peerSignals: room.peerSignals
    }
})
