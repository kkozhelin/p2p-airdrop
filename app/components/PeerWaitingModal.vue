<template>
    <UiModal :is-open="isOpen" :close-on-backdrop="false">
        <div class="peer-modal-content">
            <template v-if="connectionState === 'connected'">
                <div class="modal-header">
                    <span class="modal-icon">🎉</span>
                    <div class="header-text">
                        <h3 class="title">{{ $t('peer_waiting.connected_title') }}</h3>
                        <p class="subtitle">{{ $t('peer_waiting.connected_subtitle') }}</p>
                    </div>
                </div>

                <div class="radar-status">
                    <div class="pulse-ring"></div>
                    <span class="status-text"> {{ $t('peer_waiting.waiting_for_files') }} </span>
                </div>

                <div class="modal-actions">
                    <UiButton
                        variant="ghost"
                        size="md"
                        class="action-btn"
                        @click="$emit('disconnect')"
                    >
                        {{ $t('peer_waiting.disconnect_btn') }}
                    </UiButton>
                </div>
            </template>

            <template v-else-if="connectionState === 'pending_approval'">
                <div class="modal-header">
                    <span class="modal-icon">📩</span>
                    <div class="header-text">
                        <h3 class="title">{{ $t('peer_waiting.title') }}</h3>
                        <p class="subtitle">
                            {{
                                $t('peer_waiting.subtitle', {
                                    count: files.length,
                                    size: formatBytes(totalBytes)
                                })
                            }}
                        </p>
                    </div>
                </div>

                <ul class="preview-file-list">
                    <li
                        v-for="(file, index) in files"
                        :key="`${file.name}-${index}`"
                        class="preview-file-item"
                    >
                        <span class="file-name" :title="file.name">{{ file.name }}</span>
                        <span class="file-size">{{ formatBytes(file.size) }}</span>
                    </li>
                </ul>

                <div class="approval-actions">
                    <UiButton
                        variant="danger"
                        size="md"
                        class="action-btn"
                        @click="$emit('decline')"
                    >
                        {{ $t('peer_waiting.decline_btn') }}
                    </UiButton>
                    <UiButton
                        variant="primary"
                        size="md"
                        class="action-btn accept-btn"
                        @click="$emit('accept')"
                    >
                        {{ $t('peer_waiting.accept_btn') }}
                    </UiButton>
                </div>
            </template>

            <template v-else-if="connectionState === 'disconnected'">
                <div class="modal-header">
                    <span class="modal-icon">🔌</span>
                    <div class="header-text">
                        <h3 class="title">{{ $t('peer_waiting.status_disconnected') }}</h3>
                    </div>
                </div>

                <div class="modal-actions">
                    <UiButton
                        variant="primary"
                        size="md"
                        class="action-btn"
                        @click="$emit('disconnect')"
                    >
                        {{ $t('received_files.close_btn') }}
                    </UiButton>
                </div>
            </template>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FileMetaItem } from '~/composables/useWebRTC'
import { formatBytes } from '~/utils/formatters'
import UiModal from '~/components/ui/UiModal.vue'

interface Props {
    files?: FileMetaItem[]
    isOpen?: boolean
    connectionState?: string
}

const props = withDefaults(defineProps<Props>(), {
    files: () => [],
    isOpen: true,
    connectionState: 'connected'
})

defineEmits<{
    (e: 'accept'): void
    (e: 'decline'): void
    (e: 'disconnect'): void
}>()

const totalBytes = computed(() => {
    return props.files.reduce((acc, curr) => acc + curr.size, 0)
})
</script>

<style lang="scss" scoped>
.peer-modal-content {
    display: flex;
    flex-direction: column;
    text-align: left;
}

.modal-header {
    @include flex-center(row, 1.4rem);
    justify-content: flex-start;
    margin-bottom: 1.8rem;
}

.modal-icon {
    font-size: 3.2rem;
}

.header-text {
    display: flex;
    flex-direction: column;

    .title {
        font-size: 1.8rem;
        font-weight: 700;
        color: $color-text-primary;
    }

    .subtitle {
        font-size: 1.3rem;
        color: $color-text-secondary;
    }

    .declined-subtitle {
        font-size: 1.3rem;
        color: #ef4444;
    }
}

.radar-status {
    @include flex-center(row, 1rem);
    justify-content: flex-start;
    padding: 1.2rem 1.6rem;
    background: rgba(0, 242, 254, 0.04);
    border: 1px solid rgba(0, 242, 254, 0.15);
    border-radius: $radius-md;
    margin-bottom: 2.2rem;
}

.pulse-ring {
    width: 1rem;
    height: 1rem;
    background: $color-accent-cyan;
    border-radius: 50%;
    box-shadow: 0 0 1rem $color-accent-cyan;
    animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.status-text {
    font-size: 1.3rem;
    color: $color-text-secondary;
}

.preview-file-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    max-height: 20rem;
    overflow-y: auto;
    margin-bottom: 2.2rem;
    padding-right: 0.4rem;
}

.preview-file-item {
    @include flex-between;
    padding: 1rem 1.4rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: $radius-md;
    font-size: 1.4rem;
}

.file-name {
    font-weight: 500;
    color: $color-text-primary;
    @include text-ellipsis;
    margin-right: 1rem;
}

.file-size {
    color: $color-text-muted;
    font-family: $font-family-mono;
}

.modal-actions,
.approval-actions {
    display: flex;
    gap: 1.2rem;
    width: 100%;

    @include respond-to(mobile) {
        flex-direction: column;
    }
}

.action-btn {
    flex: 1;
    width: 100%;
}

.accept-btn {
    box-shadow: $shadow-glow-cyan;
}
</style>
