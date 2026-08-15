<template>
    <UiModal :is-open="isOpen" :close-on-backdrop="true" @close="$emit('close')">
        <div class="donate-modal-content">
            <div class="donate-header">
                <span class="donate-icon">💖</span>
                <h3 class="donate-title">{{ $t('donate.title') }}</h3>
                <p class="donate-subtitle">
                    {{ $t('donate.subtitle') }}
                </p>
            </div>

            <div class="boosty-card">
                <div class="boosty-badge">Boosty</div>

                <a
                    href="https://boosty.to/itgenius/single-payment/donation/818281/target?share=target_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="boosty-btn"
                >
                    🚀 {{ $t('donate.boosty_btn') }}
                </a>
            </div>

            <div class="donate-footer">
                <UiButton variant="ghost" size="md" class="close-btn" @click="$emit('close')">
                    {{ $t('received_files.close_btn') }}
                </UiButton>
            </div>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
import UiModal from '~/components/ui/UiModal.vue'
import UiButton from '~/components/ui/UiButton.vue'

interface Props {
    isOpen?: boolean
}

withDefaults(defineProps<Props>(), {
    isOpen: false
})

defineEmits<{
    (e: 'close'): void
}>()
</script>

<style lang="scss" scoped>
.donate-modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.donate-header {
    @include flex-center(column, 0.6rem);
    margin-bottom: 2.4rem;
}

.donate-icon {
    font-size: 3.6rem;
}

.donate-title {
    font-size: 2rem;
    font-weight: 800;
    color: $color-text-primary;
}

.donate-subtitle {
    font-size: 1.35rem;
    color: $color-text-secondary;
    max-width: 36rem;
    line-height: 1.5;
}

.boosty-card {
    width: 100%;
    padding: 2.4rem 2rem;
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(239, 68, 68, 0.08));
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: $radius-xl;
    @include flex-center(column, 1.2rem);
    margin-bottom: 2rem;
}

.boosty-badge {
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: 0.15rem;
    color: $color-warning;
    background: $color-warning-bg;
    border: 1px solid $color-warning-border;
    padding: 0.3rem 1rem;
    border-radius: $radius-full;
    text-transform: uppercase;
}

.boosty-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    width: 100%;
    font-family: inherit;
    font-size: 1.5rem;
    font-weight: 700;
    padding: 1.2rem 2.4rem;
    border-radius: $radius-lg;
    background: linear-gradient(135deg, $color-warning, $color-error);
    color: #ffffff;
    text-decoration: none;
    transition: all $transition-fast;
    box-shadow: 0 0 1.6rem rgba(245, 158, 11, 0.3);

    &:hover {
        transform: translateY(-0.2rem);
        box-shadow: 0 0 2.4rem rgba(245, 158, 11, 0.5);
    }
}

.donate-footer {
    width: 100%;
}

.close-btn {
    width: 100%;
}
</style>
