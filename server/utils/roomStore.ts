import { nanoid, customAlphabet } from 'nanoid'

export interface SignalData {
    type: 'offer' | 'answer' | 'ice-candidate'
    payload: any
}

export interface SessionRoom {
    id: string
    pin: string
    createdAt: number
    hostSignals: SignalData[]
    peerSignals: SignalData[]
    isPeerJoined: boolean
}

const ROOM_TTL_MS = 5 * 60 * 1000
const generate6DigitPin = customAlphabet('0123456789', 6)

const rooms = new Map<string, SessionRoom>()

const cleanExpiredRooms = () => {
    const now = Date.now()
    for (const [roomId, room] of rooms.entries()) {
        if (now - room.createdAt > ROOM_TTL_MS) {
            rooms.delete(roomId)
        }
    }
}

export const generateUniquePin = (): string => {
    cleanExpiredRooms()
    let pin: string
    let attempts = 0

    do {
        pin = generate6DigitPin()
        attempts++
        if (attempts > 1000) {
            throw new Error('Нет свободных PIN-кодов. Попробуйте позже.')
        }
    } while (Array.from(rooms.values()).some(r => r.pin === pin))

    return pin
}

export const createRoom = (): SessionRoom => {
    cleanExpiredRooms()
    const pin = generateUniquePin()
    const roomId = nanoid()

    const room: SessionRoom = {
        id: roomId,
        pin,
        createdAt: Date.now(),
        hostSignals: [],
        peerSignals: [],
        isPeerJoined: false
    }

    rooms.set(roomId, room)
    rooms.set(`pin_${pin}`, room)

    return room
}

export const deleteRoom = (roomId: string): boolean => {
    const room = rooms.get(roomId)
    if (!room) return false

    rooms.delete(roomId)
    rooms.delete(`pin_${room.pin}`)
    return true
}

export const getRoomByPin = (pin: string): SessionRoom | null => {
    cleanExpiredRooms()
    const room = rooms.get(`pin_${pin}`)
    return room || null
}

export const getRoomById = (id: string): SessionRoom | null => {
    cleanExpiredRooms()
    const room = rooms.get(id)
    return room || null
}

export const addSignalToRoom = (
    roomId: string,
    from: 'host' | 'peer',
    signal: SignalData
): boolean => {
    const room = getRoomById(roomId)
    if (!room) return false

    if (from === 'host') {
        room.hostSignals.push(signal)
    } else {
        room.peerSignals.push(signal)
    }

    return true
}
