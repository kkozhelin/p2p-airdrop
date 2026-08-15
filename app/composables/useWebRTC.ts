import { ref, onUnmounted, onMounted } from 'vue'
import { nanoid } from 'nanoid'
import { FILE_CONFIG, PAIRING_CONFIG, RTC_CONFIG, SIGNAL_TYPES } from '~/constants/app'

export type P2PState =
    | 'idle'
    | 'creating'
    | 'waiting'
    | 'connecting'
    | 'connected'
    | 'waiting_approval'
    | 'pending_approval'
    | 'transferring'
    | 'completed'
    | 'declined'
    | 'disconnected'
    | 'error'

export interface FileMetaItem {
    name: string
    size: number
    mimeType: string
}

export interface ReceivedFileItem {
    id: string
    name: string
    size: number
    mimeType: string
    blob: Blob
    url: string
}

export interface TransferProgress {
    fileName: string
    fileSize: number
    transferredBytes: number
    percent: number
    speedMbps: string
    status: 'idle' | 'sending' | 'receiving' | 'completed' | 'error'
}

const connectionState = ref<P2PState>('idle')
const sessionPin = ref<string>('')
const roomId = ref<string>('')
const errorMessage = ref<string>('')
const isHost = ref<boolean>(false)

const pendingFilesMeta = ref<FileMetaItem[]>([])
const pendingFilesToStore = ref<File[]>([])
const receivedFilesList = ref<ReceivedFileItem[]>([])

const transferProgress = ref<TransferProgress>({
    fileName: '',
    fileSize: 0,
    transferredBytes: 0,
    percent: 0,
    speedMbps: '0.0',
    status: 'idle'
})

let peerConnection: RTCPeerConnection | null = null
let dataChannel: RTCDataChannel | null = null
let pollInterval: ReturnType<typeof setInterval> | null = null

let incomingFileMeta: FileMetaItem | null = null
let receivedChunks: ArrayBuffer[] = []
let receivedBytes = 0
let transferStartTime = 0

export function useWebRTC() {
    const sendSignalPayload = async (role: 'host' | 'peer', signalType: string, payload: any) => {
        if (!roomId.value) return
        try {
            await $fetch('/api/room/signal', {
                method: 'POST',
                body: {
                    roomId: roomId.value,
                    role,
                    signal: {
                        type: signalType,
                        payload
                    }
                }
            })
        } catch (e) {}
    }

    const stopPolling = () => {
        if (pollInterval) {
            clearInterval(pollInterval)
            pollInterval = null
        }
    }

    const clearReceivedFiles = () => {
        receivedFilesList.value.forEach(item => {
            if (item.url) {
                try {
                    URL.revokeObjectURL(item.url)
                } catch (e) {}
            }
        })
        receivedFilesList.value = []
    }

    const closeConnection = () => {
        stopPolling()

        if (dataChannel) {
            dataChannel.close()
            dataChannel = null
        }

        if (peerConnection) {
            peerConnection.close()
            peerConnection = null
        }
    }

    const clearSessionAndPin = async () => {
        if (roomId.value) {
            try {
                await $fetch('/api/room/cancel', {
                    method: 'POST',
                    body: { roomId: roomId.value }
                })
            } catch (e) {}
        }
        sessionPin.value = ''
        roomId.value = ''
    }

    const cancelSession = async () => {
        await clearSessionAndPin()
        clearReceivedFiles()
        closeConnection()
        connectionState.value = 'idle'
        errorMessage.value = ''
    }

    const handleTabUnload = () => {
        if (roomId.value && isHost.value) {
            try {
                fetch('/api/room/cancel', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ roomId: roomId.value }),
                    keepalive: true
                })
            } catch (e) {}
        }
    }

    const triggerDownloadUrl = (url: string, fileName: string) => {
        if (!url) return
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.rel = 'noopener noreferrer'
        document.body.appendChild(a)
        a.click()
        setTimeout(() => {
            if (document.body.contains(a)) {
                document.body.removeChild(a)
            }
        }, 300)
    }

    const waitForBufferDrain = (): Promise<void> => {
        return new Promise<void>(resolve => {
            if (!dataChannel || dataChannel.bufferedAmount <= FILE_CONFIG.BUFFER_LOW_WATER_MARK) {
                resolve()
                return
            }

            const checkBuffer = () => {
                if (
                    !dataChannel ||
                    dataChannel.bufferedAmount <= FILE_CONFIG.BUFFER_LOW_WATER_MARK
                ) {
                    if (dataChannel) {
                        dataChannel.onbufferedamountlow = null
                    }
                    resolve()
                }
            }

            if (dataChannel) {
                dataChannel.bufferedAmountLowThreshold = FILE_CONFIG.BUFFER_LOW_WATER_MARK
                dataChannel.onbufferedamountlow = checkBuffer
            } else {
                resolve()
            }
        })
    }

    const setupDataChannelListeners = () => {
        if (!dataChannel) return

        dataChannel.binaryType = 'arraybuffer'

        dataChannel.onopen = () => {
            connectionState.value = 'connected'
            stopPolling()
        }

        dataChannel.onclose = () => {
            if (connectionState.value !== 'completed' && connectionState.value !== 'idle') {
                connectionState.value = 'disconnected'
            }
        }

        dataChannel.onmessage = async event => {
            const data = event.data

            if (typeof data === 'string') {
                try {
                    const message = JSON.parse(data)

                    if (message.type === SIGNAL_TYPES.OFFER_FILES) {
                        pendingFilesMeta.value = message.files || []
                        clearReceivedFiles()
                        connectionState.value = 'pending_approval'
                    } else if (message.type === SIGNAL_TYPES.ACCEPT_FILES) {
                        connectionState.value = 'transferring'
                        startSendingStoredFiles()
                    } else if (message.type === SIGNAL_TYPES.DECLINE_FILES) {
                        connectionState.value = 'declined'
                    } else if (message.type === SIGNAL_TYPES.FILE_START) {
                        incomingFileMeta = {
                            name: message.name,
                            size: message.size,
                            mimeType: message.mimeType
                        }
                        receivedChunks = []
                        receivedBytes = 0
                        transferStartTime = Date.now()

                        transferProgress.value = {
                            fileName: message.name,
                            fileSize: message.size,
                            transferredBytes: 0,
                            percent: 0,
                            speedMbps: '0.0',
                            status: 'receiving'
                        }
                        connectionState.value = 'transferring'
                    } else if (message.type === SIGNAL_TYPES.FILE_END) {
                        if (incomingFileMeta) {
                            const fileBlob = new Blob(receivedChunks, {
                                type: incomingFileMeta.mimeType || 'application/octet-stream'
                            })

                            const objectUrl = URL.createObjectURL(fileBlob)

                            const receivedItem: ReceivedFileItem = {
                                id: nanoid(),
                                name: incomingFileMeta.name,
                                size: incomingFileMeta.size,
                                mimeType: incomingFileMeta.mimeType,
                                blob: fileBlob,
                                url: objectUrl
                            }

                            receivedFilesList.value.push(receivedItem)

                            if (pendingFilesMeta.value.length === 1) {
                                triggerDownloadUrl(receivedItem.url, receivedItem.name)
                            }

                            transferProgress.value.status = 'completed'
                            transferProgress.value.percent = 100

                            const isAllFilesReceived =
                                receivedFilesList.value.length >= pendingFilesMeta.value.length

                            if (isAllFilesReceived) {
                                connectionState.value = 'completed'
                                await clearSessionAndPin()
                            }
                        }
                    }
                } catch (e) {}
                return
            }

            if (data instanceof ArrayBuffer && incomingFileMeta) {
                receivedChunks.push(data)
                receivedBytes += data.byteLength

                const percent = Math.min(
                    100,
                    Math.round((receivedBytes / incomingFileMeta.size) * 100)
                )
                const elapsedTimeSec = (Date.now() - transferStartTime) / 1000
                const speedMbps =
                    elapsedTimeSec > 0
                        ? ((receivedBytes * 8) / (elapsedTimeSec * 1024 * 1024)).toFixed(1)
                        : '0.0'

                transferProgress.value = {
                    fileName: incomingFileMeta.name,
                    fileSize: incomingFileMeta.size,
                    transferredBytes: receivedBytes,
                    percent,
                    speedMbps,
                    status: 'receiving'
                }
            }
        }
    }

    const initPeerConnection = () => {
        peerConnection = new RTCPeerConnection(RTC_CONFIG)

        peerConnection.onconnectionstatechange = () => {
            if (!peerConnection) return
            const state = peerConnection.connectionState

            if (state === 'connected') {
                connectionState.value = 'connected'
                stopPolling()
            } else if (state === 'disconnected' || state === 'failed' || state === 'closed') {
                if (connectionState.value !== 'completed' && connectionState.value !== 'idle') {
                    connectionState.value = 'disconnected'
                }
            }
        }

        peerConnection.onicecandidate = async event => {
            if (event.candidate) {
                await sendSignalPayload(
                    isHost.value ? 'host' : 'peer',
                    SIGNAL_TYPES.ICE_CANDIDATE,
                    event.candidate
                )
            }
        }
    }

    const createSession = async () => {
        try {
            closeConnection()
            connectionState.value = 'creating'
            errorMessage.value = ''
            isHost.value = true
            clearReceivedFiles()

            const res: any = await $fetch('/api/room/create', {
                method: 'POST'
            })

            if (!res.success) {
                throw new Error('Не удалось создать сессию комнаты')
            }

            roomId.value = res.roomId
            sessionPin.value = res.pin

            initPeerConnection()

            if (!peerConnection) return

            dataChannel = peerConnection.createDataChannel('file-transfer', {
                ordered: true
            })
            setupDataChannelListeners()

            const offer = await peerConnection.createOffer()
            await peerConnection.setLocalDescription(offer)

            await sendSignalPayload('host', SIGNAL_TYPES.OFFER, offer)

            connectionState.value = 'waiting'

            pollInterval = setInterval(async () => {
                if (!roomId.value) return
                const statusRes: any = await $fetch(`/api/room/status?roomId=${roomId.value}`)

                if (statusRes.success) {
                    const answerSignal = statusRes.peerSignals?.find(
                        (s: any) => s.type === SIGNAL_TYPES.ANSWER
                    )

                    if (
                        answerSignal &&
                        peerConnection &&
                        !peerConnection.currentRemoteDescription
                    ) {
                        connectionState.value = 'connecting'
                        await peerConnection.setRemoteDescription(
                            new RTCSessionDescription(answerSignal.payload)
                        )
                    }

                    const iceSignals = statusRes.peerSignals?.filter(
                        (s: any) => s.type === SIGNAL_TYPES.ICE_CANDIDATE
                    )
                    if (iceSignals && peerConnection) {
                        for (const ice of iceSignals) {
                            try {
                                await peerConnection.addIceCandidate(
                                    new RTCIceCandidate(ice.payload)
                                )
                            } catch (e) {}
                        }
                    }
                }
            }, PAIRING_CONFIG.POLL_INTERVAL_MS)
        } catch (err: any) {
            connectionState.value = 'error'
            const serverMsg = err?.data?.statusMessage || err?.data?.message
            errorMessage.value =
                serverMsg && !serverMsg.includes('[POST]') ? serverMsg : 'Ошибка создания сессии'
        }
    }

    const joinSession = async (pinInput: string) => {
        try {
            closeConnection()
            connectionState.value = 'connecting'
            errorMessage.value = ''
            isHost.value = false
            clearReceivedFiles()

            const joinRes: any = await $fetch('/api/room/join', {
                method: 'POST',
                body: { pin: pinInput }
            })

            if (!joinRes.success) {
                throw new Error('Неверный PIN-код или сессия истекла')
            }

            roomId.value = joinRes.roomId
            sessionPin.value = joinRes.pin

            const statusRes: any = await $fetch(`/api/room/status?roomId=${roomId.value}`)
            const offerSignal = statusRes.hostSignals?.find(
                (s: any) => s.type === SIGNAL_TYPES.OFFER
            )

            if (!offerSignal) {
                throw new Error('Отправитель еще не готов')
            }

            initPeerConnection()

            if (!peerConnection) return

            peerConnection.ondatachannel = event => {
                dataChannel = event.channel
                setupDataChannelListeners()
            }

            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(offerSignal.payload)
            )

            const answer = await peerConnection.createAnswer()
            await peerConnection.setLocalDescription(answer)

            await sendSignalPayload('peer', SIGNAL_TYPES.ANSWER, answer)

            pollInterval = setInterval(async () => {
                if (!roomId.value) return
                const currentStatus: any = await $fetch(`/api/room/status?roomId=${roomId.value}`)

                const hostIceSignals = currentStatus.hostSignals?.filter(
                    (s: any) => s.type === SIGNAL_TYPES.ICE_CANDIDATE
                )
                if (hostIceSignals && peerConnection) {
                    for (const ice of hostIceSignals) {
                        try {
                            await peerConnection.addIceCandidate(new RTCIceCandidate(ice.payload))
                        } catch (e) {}
                    }
                }
            }, PAIRING_CONFIG.POLL_INTERVAL_MS)
        } catch (err: any) {
            connectionState.value = 'error'
            const serverMsg = err?.data?.statusMessage || err?.data?.message
            errorMessage.value =
                serverMsg && !serverMsg.includes('[POST]')
                    ? serverMsg
                    : 'Неверный PIN-код или сессия истекла'
        }
    }

    const requestFileTransfer = (files: File[]) => {
        if (!dataChannel || dataChannel.readyState !== 'open') {
            throw new Error('P2P канал не готов')
        }

        pendingFilesToStore.value = files

        const filesMeta: FileMetaItem[] = files.map(f => ({
            name: f.name,
            size: f.size,
            mimeType: f.type
        }))

        dataChannel.send(
            JSON.stringify({
                type: SIGNAL_TYPES.OFFER_FILES,
                files: filesMeta
            })
        )

        connectionState.value = 'waiting_approval'
    }

    const acceptFileTransfer = () => {
        if (!dataChannel || dataChannel.readyState !== 'open') return

        dataChannel.send(
            JSON.stringify({
                type: SIGNAL_TYPES.ACCEPT_FILES
            })
        )
        connectionState.value = 'transferring'
    }

    const declineFileTransfer = () => {
        if (!dataChannel || dataChannel.readyState !== 'open') return

        dataChannel.send(
            JSON.stringify({
                type: SIGNAL_TYPES.DECLINE_FILES
            })
        )
        connectionState.value = 'declined'
    }

    const startSendingStoredFiles = async () => {
        if (!dataChannel || dataChannel.readyState !== 'open') return
        const files = pendingFilesToStore.value
        const chunkSizeBytes = FILE_CONFIG.CHUNK_SIZE_BYTES

        for (const file of files) {
            const startTime = Date.now()

            dataChannel.send(
                JSON.stringify({
                    type: SIGNAL_TYPES.FILE_START,
                    name: file.name,
                    size: file.size,
                    mimeType: file.type
                })
            )

            transferProgress.value = {
                fileName: file.name,
                fileSize: file.size,
                transferredBytes: 0,
                percent: 0,
                speedMbps: '0.0',
                status: 'sending'
            }

            let offset = 0
            let chunkCount = 0

            while (offset < file.size) {
                if (dataChannel.bufferedAmount >= FILE_CONFIG.BUFFER_HIGH_WATER_MARK) {
                    await waitForBufferDrain()
                }

                const slice = file.slice(offset, offset + chunkSizeBytes)
                const buffer = await slice.arrayBuffer()

                let sentSuccess = false
                while (!sentSuccess) {
                    try {
                        if (!dataChannel || dataChannel.readyState !== 'open') {
                            throw new Error('Канал передачи закрылся')
                        }
                        dataChannel.send(buffer)
                        sentSuccess = true
                    } catch (e) {
                        await new Promise(r => setTimeout(r, 10))
                    }
                }

                offset += buffer.byteLength
                chunkCount++

                if (chunkCount % 100 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 0))
                }

                const percent = Math.min(100, Math.round((offset / file.size) * 100))
                const elapsedTimeSec = (Date.now() - startTime) / 1000
                const speedMbps =
                    elapsedTimeSec > 0
                        ? ((offset * 8) / (elapsedTimeSec * 1024 * 1024)).toFixed(1)
                        : '0.0'

                transferProgress.value = {
                    fileName: file.name,
                    fileSize: file.size,
                    transferredBytes: offset,
                    percent,
                    speedMbps,
                    status: 'sending'
                }
            }

            if (dataChannel.bufferedAmount > 0) {
                await waitForBufferDrain()
            }

            dataChannel.send(
                JSON.stringify({
                    type: SIGNAL_TYPES.FILE_END,
                    name: file.name
                })
            )

            transferProgress.value.status = 'completed'
            connectionState.value = 'completed'
        }

        await clearSessionAndPin()
    }

    onMounted(() => {
        if (import.meta.client) {
            window.addEventListener('beforeunload', handleTabUnload)
            window.addEventListener('pagehide', handleTabUnload)
        }
    })

    onUnmounted(() => {
        if (import.meta.client) {
            window.removeEventListener('beforeunload', handleTabUnload)
            window.removeEventListener('pagehide', handleTabUnload)
        }
        closeConnection()
        clearReceivedFiles()
    })

    return {
        connectionState,
        sessionPin,
        roomId,
        errorMessage,
        isHost,
        pendingFilesMeta,
        receivedFilesList,
        transferProgress,
        createSession,
        joinSession,
        cancelSession,
        requestFileTransfer,
        acceptFileTransfer,
        declineFileTransfer,
        triggerDownloadUrl,
        clearReceivedFiles,
        closeConnection
    }
}
