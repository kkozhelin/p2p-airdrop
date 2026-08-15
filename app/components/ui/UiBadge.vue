<template>
    <span :class="['ui-badge', `ui-badge--${variant}`, `ui-badge--${size}`]">
        <slot />
    </span>
</template>

<script setup lang="ts">
interface Props {
    variant?: 'primary' | 'success' | 'warning' | 'error' | 'cyan'
    size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md'
})
</script>

<style lang="scss" scoped>
.ui-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    border-radius: $radius-sm;
    transition: all $transition-fast;

    &--sm {
        font-size: 1.1rem;
        padding: 0.2rem 0.6rem;
    }
    &--md {
        font-size: 1.2rem;
        padding: 0.4rem 1rem;
    }
    &--lg {
        font-size: 1.4rem;
        padding: 0.6rem 1.4rem;
    }

    &--primary {
        background: rgba(0, 242, 254, 0.1);
        color: $color-accent-cyan;
        border: 1px solid rgba(0, 242, 254, 0.2);
    }
    &--success {
        background: rgba(16, 185, 129, 0.1);
        color: $color-accent-green;
        border: 1px solid rgba(16, 185, 129, 0.2);
    }
    &--warning {
        background: $color-warning-bg;
        color: $color-warning;
        border: 1px solid $color-warning-border;
    }
    &--error {
        background: rgba(239, 68, 68, 0.1);
        color: $color-error;
        border: 1px solid $color-error-border;
    }
    &--cyan {
        font-family: $font-family-mono;
        background: rgba(0, 242, 254, 0.12);
        color: $color-accent-cyan;
        border: 1px solid rgba(0, 242, 254, 0.25);
    }
}
</style>
