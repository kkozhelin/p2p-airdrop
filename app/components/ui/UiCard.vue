<template>
    <div :class="['ui-card', { 'is-hoverable': hoverable }]">
        <slot />
    </div>
</template>

<script setup lang="ts">
interface Props {
    hoverable?: boolean
}

withDefaults(defineProps<Props>(), {
    hoverable: true
})
</script>

<style lang="scss" scoped>
.ui-card {
    @include glass-card;
    border-radius: $radius-xl;
    padding: 2.8rem;

    &:not(.is-hoverable) {
        &:hover {
            transform: none;
            background: $color-surface-card;
            border-color: $color-border-subtle;
        }
    }
}
</style>
