<template>
    <div class="lang-switcher">
        <button
            v-for="localeItem in availableLocales"
            :key="localeItem.code"
            class="lang-btn"
            :class="{ active: currentLocale === localeItem.code }"
            @click="setLanguage(localeItem.code as SupportedLocale)"
        >
            {{ localeItem.name }}
        </button>
    </div>
</template>

<script setup lang="ts">
import type { SupportedLocale } from '~/types/i18n'

const { locale, locales, setLocale } = useI18n()

const currentLocale = computed(() => locale.value)
const availableLocales = computed(() => locales.value)

const setLanguage = (code: SupportedLocale) => {
    setLocale(code)
}
</script>

<style lang="scss" scoped>
.lang-switcher {
    @include flex-center(row, 0.4rem);
    padding: 0.3rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid $color-border-subtle;
    border-radius: $radius-full;
    backdrop-filter: blur(1.2rem);
}

.lang-btn {
    padding: 0.4rem 1.2rem;
    font-size: 1.2rem;
    font-weight: 500;
    color: $color-text-secondary;
    border-radius: $radius-full;
    transition: all $transition-fast;

    &:hover {
        color: $color-text-primary;
        background: rgba(255, 255, 255, 0.08);
    }

    &.active {
        color: $color-bg-main;
        background: $color-accent-cyan;
        font-weight: 600;
        box-shadow: $shadow-glow-cyan;
    }
}
</style>
