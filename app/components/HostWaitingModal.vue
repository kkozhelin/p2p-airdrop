<template>
    <UiModal :is-open="isOpen" :close-on-backdrop="false">
        <div class="host-waiting-content">
            <template
                v-if="
                    connectionState === 'waiting' ||
                    connectionState === 'creating' ||
                    connectionState === 'connecting'
                "
            >
                <div class="waiting-header">
                    <span class="waiting-icon">📡</span>
                    <h3 class="waiting-title">{{ $t('host_waiting.title') }}</h3>
                </div>

                <div class="pin-box">
                    <span class="pin-code">{{ pin }}</span>
                    <UiButton variant="ghost" size="sm" @click="copyPin">
                        {{ isCopied ? $t('host_waiting.code_copied') : $t('pairing.copy_btn') }}
                    </UiButton>
                </div>

                <div class="timer-badge">
                    <span class="timer-icon">⏱️</span>
                    <span class="timer-text"
                        >{{ $t('host_waiting.timer_label') }}:
                        <strong>{{ formattedTime }}</strong></span
                    >
                </div>

                <div class="radar-status">
                    <div class="pulse-ring"></div>
                    <span class="status-text">
                        {{ $t('host_waiting.status_waiting') }}
                    </span>
                </div>

                <div class="waiting-actions">
                    <UiButton variant="danger" size="md" class="action-btn" @click="handleCancel">
                        🛑 {{ $t('host_waiting.cancel_btn') }}
                    </UiButton>
                </div>
            </template>

            <template v-else-if="connectionState === 'connected'">
                <div class="waiting-header">
                    <span class="waiting-icon">🎉</span>
                    <h3 class="waiting-title">{{ $t('host_waiting.connected_title') }}</h3>
                    <p class="connected-subtitle">{{ $t('host_waiting.status_connected') }}</p>
                </div>

                <div class="file-summary-box">
                    <div class="summary-icon">📄</div>
                    <div class="summary-details">
                        <span class="summary-title">{{ $t('host_waiting.ready_to_send') }}</span>
                        <span class="summary-sub"
                            >{{ filesCount }} {{ $t('host_waiting.files_label') }} ({{
                                formattedTotalSize
                            }})</span
                        >
                    </div>
                </div>

                <div class="connected-actions">
                    <UiButton
                        variant="primary"
                        size="lg"
                        class="action-btn send-btn"
                        @click="$emit('send-files')"
                    >
                        {{
                            $t('host_waiting.send_btn', {
                                count: filesCount,
                                size: formattedTotalSize
                            })
                        }}
                    </UiButton>

                    <UiButton variant="ghost" size="md" class="action-btn" @click="handleCancel">
                        {{ $t('host_waiting.cancel_btn') }}
                    </UiButton>
                </div>
            </template>

            <template v-else-if="connectionState === 'waiting_approval'">
                <div class="waiting-header">
                    <span class="waiting-icon">⏳</span>
                    <h3 class="waiting-title">{{ $t('host_waiting.approval_title') }}</h3>
                    <p class="connected-subtitle">{{ $t('host_waiting.approval_subtitle') }}</p>
                </div>

                <div class="file-summary-box">
                    <div class="summary-icon">📲</div>
                    <div class="summary-details">
                        <span class="summary-title">{{
                            $t('host_waiting.transferring_title', { count: filesCount })
                        }}</span>
                        <span class="summary-sub">{{ $t('host_waiting.approval_waiting') }}</span>
                    </div>
                </div>

                <div class="radar-status">
                    <div class="pulse-ring"></div>
                    <span class="status-text"> {{ $t('host_waiting.approval_considering') }} </span>
                </div>

                <div class="connected-actions">
                    <UiButton variant="ghost" size="md" class="action-btn" @click="handleCancel">
                        {{ $t('host_waiting.cancel_btn') }}
                    </UiButton>
                </div>
            </template>

            <template v-else-if="connectionState === 'declined'">
                <div class="waiting-header">
                    <span class="waiting-icon">❌</span>
                    <h3 class="waiting-title">{{ $t('host_waiting.status_declined') }}</h3>
                </div>

                <div class="connected-actions">
                    <UiButton variant="danger" size="md" class="action-btn" @click="handleCancel">
                        {{ $t('received_files.close_btn') }}
                    </UiButton>
                </div>
            </template>

            <template v-else-if="connectionState === 'disconnected'">
                <div class="waiting-header">
                    <span class="waiting-icon">🔌</span>
                    <h3 class="waiting-title">{{ $t('host_waiting.status_disconnected') }}</h3>
                </div>

                <div class="connected-actions">
                    <UiButton variant="primary" size="md" class="action-btn" @click="handleCancel">
                        {{ $t('received_files.close_btn') }}
                    </UiButton>
                </div>
            </template>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import UiModal from '~/components/ui/UiModal.vue'
import { formatBytes } from '~/utils/formatters'
import { PAIRING_CONFIG } from '~/constants/app'

interface Props {
    pin: string
    isOpen?: boolean
    connectionState?: string
    filesCount?: number
    totalSizeBytes?: number
    ttlSeconds?: number
}

const props = withDefaults(defineProps<Props>(), {
    pin: '',
    isOpen: false,
    connectionState: 'idle',
    filesCount: 0,
    totalSizeBytes: 0,
    ttlSeconds: PAIRING_CONFIG.SESSION_TIMEOUT_SECONDS
})

const emit = defineEmits<{
    (e: 'cancel'): void
    (e: 'send-files'): void
}>()

const isCopied = ref<boolean>(false)
const remainingSeconds = ref<number>(props.ttlSeconds)
let timerInterval: ReturnType<typeof setInterval> | null = null

const formattedTotalSize = computed(() => formatBytes(props.totalSizeBytes))

const startTimer = () => {
    stopTimer()
    remainingSeconds.value = props.ttlSeconds

    timerInterval = setInterval(() => {
        if (remainingSeconds.value > 0) {
            remainingSeconds.value--
        } else {
            stopTimer()
            emit('cancel')
        }
    }, 1000)
}

const stopTimer = () => {
    if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
    }
}

watch(
    () => props.isOpen,
    newVal => {
        if (
            newVal &&
            (props.connectionState === 'waiting' ||
                props.connectionState === 'creating' ||
                props.connectionState === 'connecting')
        ) {
            startTimer()
        } else {
            stopTimer()
        }
    },
    { immediate: true }
)

watch(
    () => props.connectionState,
    state => {
        if (state !== 'waiting' && state !== 'creating' && state !== 'connecting') {
            stopTimer()
        }
    }
)

onUnmounted(() => {
    stopTimer()
})

const formattedTime = computed(() => {
    const mins = Math.floor(remainingSeconds.value / 60)
    const secs = remainingSeconds.value % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})

const copyPin = async () => {
    if (!props.pin) return
    try {
        await navigator.clipboard.writeText(props.pin)
        isCopied.value = true
        setTimeout(() => {
            isCopied.value = false
        }, PAIRING_CONFIG.COPY_RESET_TIMEOUT_MS)
    } catch (e) {}
}

const handleCancel = () => {
    stopTimer()
    emit('cancel')
}
</script>

<style lang="scss" scoped>
.host-waiting-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.waiting-header {
    @include flex-center(column, 0.6rem);
    margin-bottom: 1.6rem;
}

.waiting-icon {
    font-size: 3.2rem;
}

.waiting-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: $color-text-primary;
}

.connected-subtitle {
    font-size: 1.3rem;
    color: $color-accent-cyan;
    margin-top: 0.2rem;
}

.declined-subtitle {
    font-size: 1.3rem;
    color: #ef4444;
    margin-top: 0.2rem;
}

.pin-box {
    width: 100%;
    padding: 1.4rem 1.6rem;
    background: rgba(0, 242, 254, 0.06);
    border: 1px solid rgba(0, 242, 254, 0.25);
    border-radius: $radius-lg;
    @include flex-between;
    margin-bottom: 1.2rem;
    box-shadow: $shadow-glow-cyan;
}

.pin-code {
    font-family: $font-family-mono;
    font-size: 2.6rem;
    font-weight: 800;
    letter-spacing: 0.4rem;
    color: $color-accent-cyan;
}

.timer-badge {
    @include flex-center(row, 0.6rem);
    font-size: 1.3rem;
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.2);
    padding: 0.4rem 1.2rem;
    border-radius: $radius-full;
    margin-bottom: 1.8rem;
}

.radar-status {
    @include flex-center(row, 1rem);
    margin-bottom: 2.4rem;
}

.pulse-ring {
    width: 1rem;
    height: 1rem;
    background: $color-accent-cyan;
    border-radius: 50%;
    box-shadow: 0 0 1rem $color-accent-cyan;
}

.status-text {
    font-size: 1.3rem;
    color: $color-text-secondary;
}

.file-summary-box {
    width: 100%;
    padding: 1.4rem 1.6rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: $radius-lg;
    display: flex;
    align-items: center;
    gap: 1.4rem;
    margin-bottom: 2rem;
    text-align: left;
}

.summary-icon {
    font-size: 2.4rem;
}

.summary-details {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.summary-title {
    font-size: 1.4rem;
    font-weight: 600;
    color: $color-text-primary;
}

.summary-sub {
    font-size: 1.25rem;
    color: $color-text-secondary;
}

.waiting-actions,
.connected-actions {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.action-btn {
    width: 100%;
}

.send-btn {
    font-size: 1.5rem;
    font-weight: 600;
}
</style>
