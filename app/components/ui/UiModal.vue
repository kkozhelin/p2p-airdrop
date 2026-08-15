<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="isOpen" class="ui-modal-overlay" @click.self="onBackdropClick">
                <div class="ui-modal-dialog">
                    <slot />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from 'vue'

interface Props {
    isOpen?: boolean
    closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    isOpen: false,
    closeOnBackdrop: false
})

const emit = defineEmits<{
    (e: 'close'): void
}>()

const onBackdropClick = () => {
    if (props.closeOnBackdrop) {
        emit('close')
    }
}

watch(
    () => props.isOpen,
    val => {
        if (import.meta.client) {
            document.body.style.overflow = val ? 'hidden' : ''
        }
    },
    { immediate: true }
)

onUnmounted(() => {
    if (import.meta.client) {
        document.body.style.overflow = ''
    }
})
</script>

<style lang="scss" scoped>
.ui-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: $z-modal;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(1.2rem);
    -webkit-backdrop-filter: blur(1.2rem);
    @include flex-center;
    padding: 2rem;
}

.ui-modal-dialog {
    width: 100%;
    max-width: 48rem;
    @include glass-card;
    background: rgba(15, 18, 26, 0.95);
    border: 1px solid rgba(0, 242, 254, 0.4);
    border-radius: $radius-xl;
    padding: 2.8rem;
    box-shadow: $shadow-glow-cyan;
}

/* Анимация плавного появления модального окна */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition:
        opacity $transition-normal,
        transform $transition-normal;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
    transform: scale(0.92);
}
</style>
