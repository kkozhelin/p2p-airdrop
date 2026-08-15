<template>
    <UiCard v-if="progress.status !== 'idle'" class="transfer-card" :hoverable="false">
        <div class="transfer-card__header">
            <div class="file-info">
                <span class="file-icon">⚡</span>
                <div class="file-details">
                    <span class="file-name" :title="progress.fileName">{{
                        progress.fileName
                    }}</span>
                    <span class="file-size">{{ formatBytes(progress.fileSize) }}</span>
                </div>
            </div>

            <UiBadge
                :variant="
                    progress.status === 'completed'
                        ? 'success'
                        : progress.status === 'receiving'
                          ? 'cyan'
                          : 'primary'
                "
                size="md"
            >
                {{ statusText }}
            </UiBadge>
        </div>

        <div class="progress-bar-track">
            <div class="progress-bar-fill" :style="{ width: `${progress.percent}%` }"></div>
        </div>

        <div class="transfer-card__footer">
            <span class="percent-text">{{ progress.percent }}%</span>
            <span v-if="progress.status !== 'completed'" class="speed-text">
                🚀 {{ $t('transfer_progress.speed', { speed: progress.speedMbps }) }}
            </span>
            <span v-else class="completed-text"> ✓ {{ $t('transfer_progress.completed') }} </span>
        </div>
    </UiCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TransferProgress } from '~/composables/useWebRTC'
import { formatBytes } from '~/utils/formatters'

interface Props {
    progress: TransferProgress
}

const props = defineProps<Props>()
const { t } = useI18n()

const statusText = computed(() => {
    switch (props.progress.status) {
        case 'sending':
            return t('transfer_progress.sending', { name: '' }).trim()
        case 'receiving':
            return t('transfer_progress.receiving', { name: '' }).trim()
        case 'completed':
            return t('transfer_progress.completed')
        default:
            return ''
    }
})
</script>

<style lang="scss" scoped>
.transfer-card {
    margin-top: 2rem;

    &__header {
        @include flex-between;
        margin-bottom: 1.6rem;
    }

    &__footer {
        @include flex-between;
        margin-top: 1rem;
        font-size: 1.3rem;
    }
}

.file-info {
    @include flex-center(row, 1.2rem);
    min-width: 0;
}

.file-icon {
    font-size: 2.2rem;
}

.file-details {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
}

.file-name {
    font-size: 1.4rem;
    font-weight: 600;
    color: $color-text-primary;
    @include text-ellipsis;
}

.file-size {
    font-size: 1.2rem;
    color: $color-text-secondary;
}

.progress-bar-track {
    width: 100%;
    height: 0.8rem;
    background: rgba(255, 255, 255, 0.08);
    border-radius: $radius-full;
    overflow: hidden;
}

.progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, $color-accent-cyan, $color-accent-blue);
    border-radius: $radius-full;
    transition: width 0.2s ease;
    box-shadow: $shadow-glow-cyan;
}

.percent-text {
    font-weight: 700;
    color: $color-accent-cyan;
}

.speed-text {
    color: $color-text-secondary;
    font-family: $font-family-mono;
}

.completed-text {
    color: $color-accent-green;
    font-weight: 600;
}
</style>
