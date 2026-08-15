<template>
    <UiCard class="radar-card">
        <div class="radar-header">
            <span class="radar-title">{{ $t('radar.title') }}</span>
            <span class="radar-status" :class="{ 'is-active': isActive }">
                {{ isActive ? $t('radar.status_scanning') : $t('radar.status_ready') }}
            </span>
        </div>

        <div class="radar-display" :class="{ 'is-active': isActive }">
            <div class="radar-grid"></div>
            <div class="radar-ring ring-1"></div>
            <div class="radar-ring ring-2"></div>
            <div class="radar-ring ring-3"></div>

            <div v-if="isActive" class="radar-sweep"></div>

            <div class="radar-center">
                <div class="device-dot self">
                    <span class="device-icon">💻</span>
                </div>
            </div>
        </div>
    </UiCard>
</template>

<script setup lang="ts">
import UiCard from '~/components/ui/UiCard.vue'

interface Props {
    isActive?: boolean
}

withDefaults(defineProps<Props>(), {
    isActive: false
})
</script>

<style lang="scss" scoped>
.radar-card {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.radar-header {
    @include flex-between;
    width: 100%;
    margin-bottom: 1.6rem;
}

.radar-title {
    font-size: 1.4rem;
    font-weight: 600;
    color: $color-text-secondary;
}

.radar-status {
    font-size: 1.2rem;
    font-weight: 600;
    color: $color-text-muted;
    padding: 0.2rem 0.8rem;
    border-radius: $radius-full;
    background: rgba(255, 255, 255, 0.05);

    &.is-active {
        color: $color-accent-cyan;
        background: rgba(0, 242, 254, 0.1);
        border: 1px solid rgba(0, 242, 254, 0.25);
    }
}

.radar-display {
    position: relative;
    width: 22rem;
    height: 22rem;
    border-radius: 50%;
    background: radial-gradient(
        circle,
        rgba(0, 242, 254, 0.05) 0%,
        rgba(10, 14, 23, 0.8) 70%,
        rgba(10, 14, 23, 1) 100%
    );
    border: 1px solid rgba(0, 242, 254, 0.15);
    box-shadow: inset 0 0 2rem rgba(0, 242, 254, 0.05);
    overflow: hidden;
    @include flex-center;

    &.is-active {
        border-color: rgba(0, 242, 254, 0.4);
        box-shadow:
            inset 0 0 3rem rgba(0, 242, 254, 0.15),
            0 0 2rem rgba(0, 242, 254, 0.1);
    }
}

.radar-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px dashed rgba(0, 242, 254, 0.15);

    &.ring-1 {
        width: 30%;
        height: 30%;
    }

    &.ring-2 {
        width: 60%;
        height: 60%;
    }

    &.ring-3 {
        width: 90%;
        height: 90%;
    }
}

.radar-grid {
    position: absolute;
    width: 100%;
    height: 100%;

    &::before,
    &::after {
        content: '';
        position: absolute;
        background: rgba(0, 242, 254, 0.1);
    }

    &::before {
        top: 50%;
        left: 0;
        width: 100%;
        height: 1px;
    }

    &::after {
        top: 0;
        left: 50%;
        width: 1px;
        height: 100%;
    }
}

.radar-sweep {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: conic-gradient(from 0deg, rgba(0, 242, 254, 0.3) 0deg, transparent 60deg);
    animation: rotate-sweep 3s linear infinite;
    transform-origin: center center;
}

.radar-center {
    position: relative;
    z-index: 2;
}

.device-dot {
    width: 3.6rem;
    height: 3.6rem;
    border-radius: 50%;
    background: linear-gradient(135deg, $color-accent-cyan, $color-accent-blue);
    @include flex-center;
    box-shadow: $shadow-glow-cyan;

    .device-icon {
        font-size: 1.6rem;
    }
}
</style>
