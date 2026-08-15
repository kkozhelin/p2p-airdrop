<template>
    <button
        :type="type"
        :disabled="disabled"
        :title="title"
        :class="[
            'ui-button',
            `ui-button--${variant}`,
            `ui-button--${size}`,
            { 'is-disabled': disabled }
        ]"
        @click="handleClick"
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
interface Props {
    variant?: 'primary' | 'danger' | 'ghost' | 'icon'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    title?: string
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
    title: undefined
})

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
    if (!props.disabled) {
        emit('click', event)
    }
}
</script>

<style lang="scss" scoped>
.ui-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: inherit;
    font-weight: 500;
    border-radius: $radius-md;
    transition: all $transition-fast;
    user-select: none;

    &.is-disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &--sm {
        font-size: 1.2rem;
        padding: 0.4rem 1rem;
    }
    &--md {
        font-size: 1.4rem;
        padding: 0.8rem 1.6rem;
    }
    &--lg {
        font-size: 1.6rem;
        padding: 1.2rem 2.4rem;
    }

    &--primary {
        background: linear-gradient(135deg, $color-accent-cyan, $color-accent-blue);
        color: #000000;
        font-weight: 600;
        &:hover:not(.is-disabled) {
            box-shadow: $shadow-glow-cyan;
            transform: translateY(-0.1rem);
        }
    }
    &--danger {
        background: $color-error-bg;
        color: $color-error;
        border: 1px solid $color-error-border;
        &:hover:not(.is-disabled) {
            background: rgba(239, 68, 68, 0.25);
        }
    }
    &--ghost {
        background: transparent;
        color: $color-text-secondary;
        &:hover:not(.is-disabled) {
            color: $color-text-primary;
            background: rgba(255, 255, 255, 0.08);
        }
    }
    &--icon {
        padding: 0;
        width: 2.8rem;
        height: 2.8rem;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.06);
        color: $color-text-secondary;
        &:hover:not(.is-disabled) {
            color: $color-text-primary;
            background: rgba(255, 255, 255, 0.12);
        }
    }
}
</style>
