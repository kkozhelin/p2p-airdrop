<template>
    <UiModal :is-open="isOpen" :close-on-backdrop="false">
        <div class="received-modal-content">
            <div class="modal-header">
                <span class="modal-icon">🎉</span>
                <div class="header-text">
                    <h3 class="title">{{ $t('received_files.title') }}</h3>
                    <p class="subtitle">
                        {{ $t('received_files.subtitle') }} ({{ formatBytes(totalBytes) }})
                    </p>
                </div>
            </div>

            <div class="files-preview-section">
                <span class="section-title">
                    {{
                        files.length > 1
                            ? $t('received_files.package_title')
                            : $t('received_files.single_title')
                    }}
                </span>
                <ul class="received-file-list">
                    <li v-for="file in files" :key="file.id" class="received-file-item">
                        <div class="file-info">
                            <span class="file-icon">📄</span>
                            <div class="file-details">
                                <span class="file-name" :title="file.name">{{ file.name }}</span>
                                <span class="file-size">{{ formatBytes(file.size) }}</span>
                            </div>
                        </div>

                        <a
                            :href="file.url"
                            :download="file.name"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="download-native-btn"
                        >
                            📥 {{ $t('received_files.download_btn') }}
                        </a>
                    </li>
                </ul>
            </div>

            <div class="modal-actions">
                <UiButton variant="ghost" size="md" class="action-btn" @click="$emit('close')">
                    {{ $t('received_files.close_btn') }}
                </UiButton>
            </div>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ReceivedFileItem } from '~/composables/useWebRTC'
import { formatBytes } from '~/utils/formatters'
import UiModal from '~/components/ui/UiModal.vue'

interface Props {
    files: ReceivedFileItem[]
    isOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    files: () => [],
    isOpen: true
})

defineEmits<{
    (e: 'close'): void
}>()

const totalBytes = computed(() => {
    return props.files.reduce((acc, curr) => acc + curr.size, 0)
})
</script>

<style lang="scss" scoped>
.received-modal-content {
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
        color: $color-accent-cyan;
    }
}

.files-preview-section {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-bottom: 2.2rem;
}

.section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.05rem;
}

.received-file-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    max-height: 22rem;
    overflow-y: auto;
    padding-right: 0.4rem;
}

.received-file-item {
    @include flex-between;
    padding: 1rem 1.4rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: $radius-md;
    font-size: 1.4rem;
    gap: 1rem;
}

.file-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 0;
    flex: 1;
}

.file-icon {
    font-size: 2rem;
}

.file-details {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.file-name {
    font-weight: 500;
    color: $color-text-primary;
    @include text-ellipsis;
}

.file-size {
    font-size: 1.2rem;
    color: $color-text-muted;
    font-family: $font-family-mono;
}

.download-native-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: inherit;
    font-size: 1.3rem;
    font-weight: 600;
    padding: 0.6rem 1.4rem;
    border-radius: $radius-md;
    background: linear-gradient(135deg, $color-accent-cyan, $color-accent-blue);
    color: #000000;
    text-decoration: none;
    white-space: nowrap;
    transition: all $transition-fast;

    &:hover {
        box-shadow: $shadow-glow-cyan;
        transform: translateY(-0.1rem);
    }
}

.modal-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
}

.action-btn {
    width: 100%;
}
</style>
