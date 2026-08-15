<template>
    <UiCard class="pairing-card">
        <div class="pairing-card__header">
            <span class="pairing-card__icon">📡</span>
            <div class="header-text">
                <h2 class="pairing-card__title">{{ $t('pairing.title') }}</h2>
                <p class="pairing-card__subtitle">
                    {{ $t('pairing.subtitle') }}
                </p>
            </div>
        </div>

        <div class="pairing-card__section mode-section">
            <div class="mode-header">
                <span class="mode-badge sender">{{ $t('pairing.mode_sender') }}</span>
                <div class="pin-hint-slot">
                    <span v-if="hintText" class="pin-hint-badge">{{ hintText }}</span>
                </div>
            </div>

            <div class="pin-display">
                <div class="pin-info">
                    <span class="pin-label">{{ $t('pairing.your_code') }}:</span>
                    <UiBadge variant="cyan" size="lg" class="pin-badge">
                        {{ sessionPin || PIN_EMPTY_PLACEHOLDER }}
                    </UiBadge>
                </div>

                <UiButton
                    v-if="!sessionPin"
                    variant="primary"
                    size="sm"
                    class="action-btn"
                    :disabled="!isFilesSelected"
                    @click="$emit('create-session')"
                >
                    {{ $t('pairing.generate_pin') }}
                </UiButton>

                <UiButton
                    v-else
                    variant="ghost"
                    size="sm"
                    class="action-btn"
                    @click="copyPin(sessionPin)"
                >
                    {{ isCopied ? $t('host_waiting.code_copied') : $t('pairing.copy_btn') }}
                </UiButton>
            </div>
        </div>

        <div class="or-divider">
            <span class="or-line"></span>
            <span class="or-badge">{{ $t('pairing.or_divider') }}</span>
            <span class="or-line"></span>
        </div>

        <div class="pairing-card__section mode-section input-section">
            <div class="mode-header">
                <span class="mode-badge receiver">{{ $t('pairing.mode_receiver') }}</span>
                <label class="section-label">{{ $t('pairing.receiver_label') }}:</label>
            </div>

            <div class="pin-input-group">
                <input
                    :value="inputPin"
                    type="text"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    :maxlength="PAIRING_CONFIG.PIN_LENGTH"
                    placeholder="123456"
                    :class="['pin-input', { 'is-error': connectionState === 'error' }]"
                    @input="handleInput"
                    @paste="handlePaste"
                    @keyup.enter="handleJoin"
                />
                <UiButton
                    variant="primary"
                    size="md"
                    class="connect-btn"
                    :disabled="inputPin.length !== PAIRING_CONFIG.PIN_LENGTH"
                    @click="handleJoin"
                >
                    {{ $t('pairing.connect_btn') }}
                </UiButton>
            </div>

            <div class="pin-error-slot">
                <Transition name="hint-fade">
                    <span v-if="connectionState === 'error' && errorMessage" class="pin-error-text">
                        ⚠️ {{ errorMessage }}
                    </span>
                </Transition>
            </div>
        </div>
    </UiCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCopyToClipboard } from '~/composables/useCopyToClipboard'
import UiCard from '~/components/ui/UiCard.vue'
import UiBadge from '~/components/ui/UiBadge.vue'
import UiButton from '~/components/ui/UiButton.vue'
import { PAIRING_CONFIG, PIN_EMPTY_PLACEHOLDER } from '~/constants/app'

const { t } = useI18n()

interface Props {
    sessionPin?: string
    connectionState?: string
    errorMessage?: string
    isFilesSelected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    sessionPin: '',
    connectionState: 'idle',
    errorMessage: '',
    isFilesSelected: false
})

const emit = defineEmits<{
    (e: 'create-session'): void
    (e: 'join-session', pin: string): void
}>()

const inputPin = ref<string>('')
const { isCopied, copy: copyPin } = useCopyToClipboard()

const hintText = computed(() => {
    if (props.sessionPin) return ''
    if (!props.isFilesSelected) return t('pairing.hint_select_files')
    return t('pairing.hint_files_ready')
})

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    const digitsOnly = target.value.replace(/\D/g, '').slice(0, PAIRING_CONFIG.PIN_LENGTH)
    inputPin.value = digitsOnly
    target.value = digitsOnly
}

const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault()
    const text = event.clipboardData?.getData('text') ?? ''
    const digits = text.replace(/\D/g, '').slice(0, PAIRING_CONFIG.PIN_LENGTH)
    inputPin.value = digits
    if (digits.length === PAIRING_CONFIG.PIN_LENGTH) {
        handleJoin()
    }
}

const handleJoin = () => {
    if (inputPin.value.length === PAIRING_CONFIG.PIN_LENGTH) {
        emit('join-session', inputPin.value)
    }
}
</script>

<style lang="scss" scoped>
.pairing-card {
    &__header {
        @include flex-center(row, 1.2rem);
        justify-content: flex-start;
        margin-bottom: 2rem;
    }

    &__icon {
        font-size: 2.6rem;
    }

    &__title {
        font-size: 1.8rem;
        font-weight: 700;
        color: $color-text-primary;
    }

    &__subtitle {
        font-size: 1.25rem;
        color: $color-text-muted;
        margin-top: 0.2rem;
    }
}

.mode-section {
    padding: 1.4rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: $radius-lg;
}

.mode-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.2rem;
    gap: 1rem;

    @include respond-to(mobile) {
        flex-direction: column;
        align-items: flex-start;
    }
}

.mode-badge {
    display: inline-flex;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 700;
    padding: 0.3rem 0.9rem;
    border-radius: $radius-sm;

    &.sender {
        background: rgba(0, 242, 254, 0.1);
        color: $color-accent-cyan;
        border: 1px solid rgba(0, 242, 254, 0.25);
    }

    &.receiver {
        background: rgba(79, 172, 254, 0.1);
        color: $color-accent-blue;
        border: 1px solid rgba(79, 172, 254, 0.25);
    }
}

.section-label {
    font-size: 1.25rem;
    color: $color-text-secondary;
}

.pin-hint-slot {
    min-height: 2.2rem;
    display: flex;
    align-items: center;
}

.pin-hint-badge {
    font-size: 1.15rem;
    font-weight: 500;
    color: $color-warning;
    background: $color-warning-bg;
    border: 1px solid $color-warning-border;
    padding: 0.2rem 0.8rem;
    border-radius: $radius-sm;
    white-space: nowrap;
}

.pin-display {
    @include flex-between;
    padding: 1rem 1.2rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: $radius-md;
    gap: 0.8rem;

    @include respond-to(mobile) {
        gap: 1rem;
        flex-direction: column;
        align-items: stretch;
    }
}

.pin-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.pin-label {
    font-size: 1.25rem;
    color: $color-text-muted;
}

.pin-badge {
    font-size: 1.8rem;
    letter-spacing: 0.2rem;
}

.or-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1.6rem 0;
    gap: 1rem;
}

.or-line {
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
}

.or-badge {
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: 0.15rem;
    color: $color-text-muted;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.3rem 1.2rem;
    border-radius: $radius-full;
}

.pin-input-group {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;

    @include respond-to(mobile) {
        flex-direction: column;
        align-items: stretch;
    }
}

.pin-input {
    flex: 1;
    min-width: 0;
    width: 100%;
    height: 4.8rem;
    padding: 0 1.6rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid $color-border-subtle;
    border-radius: $radius-md;
    font-family: $font-family-mono;
    font-size: 2rem;
    font-weight: 600;
    letter-spacing: 0.35rem;
    text-align: center;
    color: $color-text-primary;
    box-sizing: border-box;
    transition: all $transition-fast;

    &::placeholder {
        color: rgba(255, 255, 255, 0.2);
        letter-spacing: 0.35rem;
    }

    &:focus {
        outline: none;
        border-color: $color-accent-cyan;
        box-shadow: 0 0 1.6rem rgba(0, 242, 254, 0.3);
        background: rgba(0, 242, 254, 0.04);
    }

    &.is-error {
        border-color: $color-error;
        box-shadow: $color-error-glow;
        background: rgba(239, 68, 68, 0.04);
    }
}

.pin-error-slot {
    min-height: 2.2rem;
    display: flex;
    align-items: center;
    margin-top: 0.6rem;
}

.pin-error-text {
    font-size: 1.25rem;
    font-weight: 500;
    color: $color-error;
}

.connect-btn {
    white-space: nowrap;
    height: 4.8rem;
    font-size: 1.5rem;

    @include respond-to(mobile) {
        width: 100%;
    }
}

.hint-fade-enter-active,
.hint-fade-leave-active {
    transition: opacity $transition-normal;
}

.hint-fade-enter-from,
.hint-fade-leave-to {
    opacity: 0;
}
</style>
