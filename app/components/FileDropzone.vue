<template>
    <div class="dropzone-container">
        <input
            ref="fileInputRef"
            type="file"
            multiple
            class="hidden-file-input"
            @change="handleFileSelect"
        />

        <div
            class="dropzone"
            :class="{ 'is-dragging': isDragActive }"
            @dragenter.prevent="handleDragEnter"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
            @click="triggerFileInput"
        >
            <div class="dropzone__content">
                <div class="dropzone__icon-wrapper">
                    <span class="dropzone__icon">💧</span>
                </div>
                <h3 class="dropzone__title">{{ $t('dropzone.title') }}</h3>
                <p class="dropzone__subtitle">{{ $t('dropzone.subtitle') }}</p>

                <UiBadge variant="primary" size="md">
                    {{ $t('dropzone.hint') }}
                </UiBadge>
            </div>
        </div>

        <SelectedFileList
            v-if="selectedFiles.length > 0"
            :files="selectedFiles"
            @remove="removeFile"
            @clear="clearAllFiles"
        />

        <Transition name="hint-fade">
            <div v-if="hasLargeFiles" class="large-file-warning">
                {{ $t('dropzone.large_file_warning') }}
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { FILE_CONFIG } from '~/constants/app'

const emit = defineEmits<{
    (e: 'files-selected', files: File[]): void
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFiles = ref<File[]>([])
const isDragActive = ref<boolean>(false)

const triggerFileInput = () => {
    fileInputRef.value?.click()
}

const addFiles = (newFiles: FileList | File[]) => {
    selectedFiles.value = [...selectedFiles.value, ...Array.from(newFiles)]
    emit('files-selected', selectedFiles.value)
}

const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        addFiles(target.files)
    }
}

const handleDragEnter = () => {
    isDragActive.value = true
}

const handleDragOver = () => {
    isDragActive.value = true
}

const handleDragLeave = () => {
    isDragActive.value = false
}

const handleDrop = (event: DragEvent) => {
    isDragActive.value = false
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
        addFiles(event.dataTransfer.files)
    }
}

const removeFile = (index: number) => {
    selectedFiles.value.splice(index, 1)
    emit('files-selected', selectedFiles.value)
}

const clearAllFiles = () => {
    selectedFiles.value = []
    emit('files-selected', [])
}

const hasLargeFiles = computed(() =>
    selectedFiles.value.some(f => f.size > FILE_CONFIG.LARGE_FILE_THRESHOLD_BYTES)
)
</script>

<style lang="scss" scoped>
.dropzone-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
}

.hidden-file-input {
    display: none;
}

.dropzone {
    @include glass-card;
    border-radius: $radius-xl;
    padding: 2.8rem 2rem;
    text-align: center;
    cursor: pointer;
    border: 2px dashed rgba(255, 255, 255, 0.15);

    &:hover {
        border-color: rgba(0, 242, 254, 0.5);
        background: rgba(0, 242, 254, 0.04);
    }

    &.is-dragging {
        border-color: $color-accent-cyan;
        background: rgba(0, 242, 254, 0.1);
        transform: scale(1.01);
        box-shadow: $shadow-glow-cyan;
    }

    &__content {
        @include flex-center(column, 0.8rem);
    }

    &__icon-wrapper {
        width: 5.2rem;
        height: 5.2rem;
        border-radius: 50%;
        background: rgba(0, 242, 254, 0.1);
        border: 1px solid rgba(0, 242, 254, 0.25);
        @include flex-center;
        margin-bottom: 0.4rem;
    }

    &__icon {
        font-size: 2.6rem;
    }

    &__title {
        font-size: 1.8rem;
        font-weight: 600;
        color: $color-text-primary;
    }

    &__subtitle {
        font-size: 1.3rem;
        color: $color-text-secondary;
    }
}

.large-file-warning {
    margin-top: 1.2rem;
    padding: 1rem 1.4rem;
    background: $color-warning-bg;
    border: 1px solid $color-warning-border;
    border-radius: $radius-md;
    font-size: 1.25rem;
    color: $color-warning;
    line-height: 1.5;
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
