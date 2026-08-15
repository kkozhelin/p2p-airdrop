export const APP_NAME = 'AirDrop P2P'
export const GITHUB_URL = 'https://github.com/kkozhelin'
export const PIN_EMPTY_PLACEHOLDER = '------'

export const LOCALES = {
    RU: 'ru',
    EN: 'en'
} as const

export const DEFAULT_LOCALE = LOCALES.RU

export const FILE_CONFIG = {
    CHUNK_SIZE_BYTES: 256 * 1024,
    BUFFER_HIGH_WATER_MARK: 4 * 1024 * 1024,
    BUFFER_LOW_WATER_MARK: 1 * 1024 * 1024,
    LARGE_FILE_THRESHOLD_BYTES: 2 * 1024 * 1024 * 1024
} as const

export const PAIRING_CONFIG = {
    PIN_LENGTH: 6,
    SESSION_TIMEOUT_SECONDS: 300,
    SESSION_TIMEOUT_MS: 300000,
    POLL_INTERVAL_MS: 1500,
    COPY_RESET_TIMEOUT_MS: 2000
} as const

export const RTC_CONFIG: RTCConfiguration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
}

export const SIGNAL_TYPES = {
    OFFER: 'offer',
    ANSWER: 'answer',
    ICE_CANDIDATE: 'ice-candidate',
    OFFER_FILES: 'offer-files',
    ACCEPT_FILES: 'accept-files',
    DECLINE_FILES: 'decline-files',
    FILE_START: 'file-start',
    FILE_END: 'file-end'
} as const
