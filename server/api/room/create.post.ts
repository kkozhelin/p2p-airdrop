export default defineEventHandler(() => {
    try {
        const room = createRoom()

        return {
            success: true,
            roomId: room.id,
            pin: room.pin,
            createdAt: room.createdAt
        }
    } catch (error: any) {
        throw createError({
            statusCode: 503,
            statusMessage: error.message || 'Ошибка создания сессии'
        })
    }
})
