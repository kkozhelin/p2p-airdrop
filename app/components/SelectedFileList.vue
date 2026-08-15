<template>
    <UiCard :hoverable="false" class="file-list-card">
        <div class="file-list__header">
            <span class="file-list__title">
                {{ $t('dropzone.selected_files', { count: files.length }) }}
            </span>
            <UiButton variant="danger" size="sm" type="button" @click="$emit('clear')">
                {{ $t('selected_files.clear_all') }}
            </UiButton>
        </div>

        <ul class="file-items">
            <li v-for="(file, index) in files" :key="`${file.name}-${index}`" class="file-item">
                <div class="file-item__icon">
                    {{ getFileIcon(file) }}
                </div>
                <div class="file-item__info">
                    <span class="file-item__name" :title="file.name">{{ file.name }}</span>
                    <span class="file-item__size">{{ formatBytes(file.size) }}</span>
                </div>
                <UiButton variant="icon" type="button" @click="$emit('remove', index)">
                    ✕
                </UiButton>
            </li>
        </ul>
    </UiCard>
</template>

<script setup lang="ts">
import { formatBytes, getFileIcon } from '~/utils/formatters'

interface Props {
    files: File[]
}

defineProps<Props>()

defineEmits<{
    (e: 'remove', index: number): void
    (e: 'clear'): void
}>()
</script>

<style lang="scss" scoped>
.file-list-card {
    margin-top: 1.6rem;
    min-width: 0;
}

.file-list {
    min-width: 0;

    &__header {
        @include flex-between;
        margin-bottom: 1.2rem;
    }

    &__title {
        font-size: 1.4rem;
        font-weight: 600;
        color: $color-text-secondary;
    }
}

.file-items {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    min-width: 0;
    max-height: 20rem;
    overflow-y: auto;
    padding-right: 0.4rem;
}

.file-item {
    @include flex-between;
    padding: 0.8rem 1.2rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: $radius-md;
    min-width: 0;
    transition: background $transition-fast;

    &:hover {
        background: rgba(255, 255, 255, 0.07);
    }

    &__icon {
        font-size: 1.8rem;
        margin-right: 1rem;
        flex-shrink: 0;
    }

    &__info {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        min-width: 0;
        margin-right: 0.8rem;
    }

    &__name {
        font-size: 1.3rem;
        font-weight: 500;
        color: $color-text-primary;
        @include text-ellipsis;
    }

    &__size {
        font-size: 1.1rem;
        color: $color-text-muted;
    }
}
</style>
