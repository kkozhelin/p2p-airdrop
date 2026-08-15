<template>
    <div class="app-shell">
        <header class="app-header">
            <div class="app-header__container">
                <NuxtLink to="/" class="brand-logo" @click="closeMenu">
                    <div class="brand-logo__icon">⚡</div>
                    <span class="brand-logo__text">{{ APP_NAME }}</span>
                </NuxtLink>

                <nav class="nav-links desktop-only">
                    <NuxtLink to="/" class="nav-link"> ⚡ {{ $t('nav.home') }} </NuxtLink>
                    <NuxtLink to="/security" class="nav-link">
                        🛡️ {{ $t('nav.security') }}
                    </NuxtLink>
                </nav>

                <div class="app-header__actions">
                    <a
                        :href="GITHUB_URL"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="github-link desktop-only"
                        title="GitHub kkozhelin"
                    >
                        <svg
                            class="github-icon"
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            fill="currentColor"
                        >
                            <path
                                d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                            />
                        </svg>
                        <span class="github-text">kkozhelin</span>
                    </a>

                    <button class="donate-header-btn desktop-only" @click="isDonateOpen = true">
                        <span>💖</span>
                        <span>{{ $t('nav.donate') }}</span>
                    </button>

                    <LanguageSwitcher />

                    <button
                        class="burger-btn mobile-only"
                        :class="{ 'is-active': isMenuOpen }"
                        :aria-label="isMenuOpen ? 'Закрыть меню' : 'Открыть меню'"
                        @click="isMenuOpen = !isMenuOpen"
                    >
                        <span class="burger-bar"></span>
                        <span class="burger-bar"></span>
                        <span class="burger-bar"></span>
                    </button>
                </div>
            </div>
        </header>

        <Transition name="drawer-fade">
            <div v-if="isMenuOpen" class="mobile-drawer-overlay" @click.self="closeMenu">
                <div class="mobile-drawer">
                    <nav class="mobile-nav-links">
                        <NuxtLink to="/" class="mobile-nav-link" @click="closeMenu">
                            ⚡ {{ $t('nav.home') }}
                        </NuxtLink>
                        <NuxtLink to="/security" class="mobile-nav-link" @click="closeMenu">
                            🛡️ {{ $t('nav.security') }}
                        </NuxtLink>
                    </nav>

                    <div class="mobile-drawer-divider"></div>

                    <div class="mobile-actions">
                        <a
                            :href="GITHUB_URL"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="mobile-action-btn github-mobile"
                            @click="closeMenu"
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path
                                    d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                                />
                            </svg>
                            <span>GitHub kkozhelin</span>
                        </a>

                        <button class="mobile-action-btn donate-mobile" @click="openDonateModal">
                            <span>💖 {{ $t('nav.donate') }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <main class="app-main">
            <div class="app-main__container">
                <slot />
            </div>
        </main>

        <footer class="app-footer">
            <div class="app-footer__container">
                <NuxtLink to="/security" class="footer-badge">
                    {{ $t('footer.security_badge') }}
                </NuxtLink>
                <div class="footer-links">
                    <a
                        :href="GITHUB_URL"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="footer-link"
                    >
                        {{ $t('footer.github_link') }}
                    </a>
                    <span class="footer-dot">•</span>
                    <button class="footer-link-btn" @click="isDonateOpen = true">
                        {{ $t('footer.donate_btn') }}
                    </button>
                </div>
                <span class="footer-copy">{{ $t('footer.copyright') }}</span>
            </div>
        </footer>

        <DonateModal :is-open="isDonateOpen" @close="isDonateOpen = false" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { APP_NAME, GITHUB_URL } from '~/constants/app'
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'
import DonateModal from '~/components/DonateModal.vue'

const route = useRoute()
const isDonateOpen = ref<boolean>(false)
const isMenuOpen = ref<boolean>(false)

const closeMenu = () => {
    isMenuOpen.value = false
}

const openDonateModal = () => {
    closeMenu()
    isDonateOpen.value = true
}

watch(
    () => route.path,
    () => {
        closeMenu()
    }
)
</script>

<style lang="scss" scoped>
.app-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
}

.app-header {
    position: sticky;
    top: 0;
    z-index: $z-header;
    height: 6.4rem;
    background: $color-bg-nav;
    backdrop-filter: blur(2rem);
    -webkit-backdrop-filter: blur(2rem);
    border-bottom: 1px solid $color-border-subtle;

    &__container {
        max-width: 120rem;
        height: 100%;
        margin: 0 auto;
        padding: 0 2.4rem;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;

        @include respond-to(tablet) {
            display: flex;
            justify-content: space-between;
            padding: 0 1.6rem;
        }

        @include respond-to(mobile) {
            padding: 0 1.2rem;
        }
    }

    &__actions {
        justify-self: end;
        @include flex-center(row, 1.2rem);

        @include respond-to(mobile) {
            gap: 0.8rem;
        }
    }
}

.brand-logo {
    justify-self: start;
    @include flex-center(row, 0.8rem);
    text-decoration: none;
    flex-shrink: 0;

    &__icon {
        width: 3.4rem;
        height: 3.4rem;
        border-radius: $radius-md;
        background: linear-gradient(135deg, $color-accent-cyan, $color-accent-blue);
        color: $color-bg-main;
        font-size: 1.6rem;
        font-weight: 800;
        @include flex-center;
        box-shadow: $shadow-glow-cyan;
    }

    &__text {
        font-size: 1.7rem;
        font-weight: 700;
        letter-spacing: -0.03rem;
        color: $color-text-primary;
    }
}

.desktop-only {
    @include respond-to(tablet) {
        display: none !important;
    }
}

.mobile-only {
    display: none !important;

    @include respond-to(tablet) {
        display: flex !important;
    }
}

.nav-links {
    justify-self: center;
    @include flex-center(row, 2.4rem);
}

.nav-link {
    font-size: 1.4rem;
    font-weight: 500;
    color: $color-text-secondary;
    text-decoration: none;
    transition: color $transition-fast;
    white-space: nowrap;

    &:hover,
    &.router-link-exact-active {
        color: $color-accent-cyan;
    }
}

.github-link {
    @include flex-center(row, 0.6rem);
    color: $color-text-secondary;
    text-decoration: none;
    font-size: 1.3rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: $radius-md;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: all $transition-fast;

    &:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.08);
    }
}

.donate-header-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: inherit;
    font-size: 1.3rem;
    font-weight: 600;
    padding: 0.5rem 1.2rem;
    border-radius: $radius-full;
    background: linear-gradient(135deg, $color-error-bg, $color-warning-bg);
    color: $color-error;
    border: 1px solid $color-error-border;
    cursor: pointer;
    transition: all $transition-fast;
    white-space: nowrap;

    &:hover {
        transform: translateY(-0.1rem);
        box-shadow: $color-error-glow;
        color: #ffffff;
    }
}

.burger-btn {
    width: 3.8rem;
    height: 3.8rem;
    border-radius: $radius-md;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.8rem;
    transition: all $transition-fast;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(0, 242, 254, 0.3);
    }

    .burger-bar {
        width: 100%;
        height: 2px;
        background-color: $color-text-primary;
        border-radius: $radius-full;
        transition: all $transition-fast;
    }

    &.is-active {
        .burger-bar:nth-child(1) {
            transform: translateY(6px) rotate(45deg);
            background-color: $color-accent-cyan;
        }
        .burger-bar:nth-child(2) {
            opacity: 0;
        }
        .burger-bar:nth-child(3) {
            transform: translateY(-6px) rotate(-45deg);
            background-color: $color-accent-cyan;
        }
    }
}

.mobile-drawer-overlay {
    position: fixed;
    top: 6.4rem;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: $z-modal;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(1rem);
    -webkit-backdrop-filter: blur(1rem);
    display: flex;
    justify-content: flex-end;
}

.mobile-drawer {
    width: 100%;
    max-width: 30rem;
    height: calc(100vh - 6.4rem);
    background: rgba(15, 18, 26, 0.95);
    border-left: 1px solid $color-border-subtle;
    padding: 2.4rem 2rem;
    display: flex;
    flex-direction: column;
    box-shadow: $shadow-glass;
}

.mobile-nav-links {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

.mobile-nav-link {
    display: flex;
    align-items: center;
    font-size: 1.6rem;
    font-weight: 600;
    padding: 1.2rem 1.4rem;
    border-radius: $radius-lg;
    color: $color-text-primary;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all $transition-fast;

    &:hover,
    &.router-link-exact-active {
        color: $color-accent-cyan;
        background: rgba(0, 242, 254, 0.08);
        border-color: rgba(0, 242, 254, 0.25);
    }
}

.mobile-drawer-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
    margin: 2rem 0;
}

.mobile-actions {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

.mobile-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    font-size: 1.4rem;
    font-weight: 600;
    padding: 1.2rem;
    border-radius: $radius-lg;
    text-decoration: none;
    transition: all $transition-fast;

    &.github-mobile {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: $color-text-primary;

        &:hover {
            background: rgba(255, 255, 255, 0.08);
        }
    }

    &.donate-mobile {
        background: linear-gradient(135deg, $color-error-bg, $color-warning-bg);
        border: 1px solid $color-error-border;
        color: $color-error;

        &:hover {
            color: #ffffff;
            box-shadow: $color-error-glow;
        }
    }
}

.drawer-fade-enter-active,
.drawer-fade-leave-active {
    transition: opacity $transition-fast ease;

    .mobile-drawer {
        transition: transform $transition-fast cubic-bezier(0.16, 1, 0.3, 1);
    }
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
    opacity: 0;

    .mobile-drawer {
        transform: translateX(100%);
    }
}

.app-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    &__container {
        max-width: 120rem;
        width: 100%;
        margin: 0 auto;
        padding: 3.6rem 2.4rem;
        display: flex;
        flex-direction: column;
        align-items: center;

        @include respond-to(tablet) {
            padding: 2.8rem 1.8rem;
        }

        @include respond-to(mobile) {
            padding: 2rem 1.2rem;
        }
    }
}

.app-footer {
    border-top: 1px solid $color-border-subtle;
    padding: 2rem 2.4rem;
    font-size: 1.2rem;
    color: $color-text-muted;

    &__container {
        max-width: 120rem;
        margin: 0 auto;
        @include flex-between;

        @include respond-to(mobile) {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
        }
    }
}

.footer-badge {
    color: $color-text-secondary;
    text-decoration: none;
    transition: color $transition-fast;

    &:hover {
        color: $color-accent-cyan;
    }
}

.footer-links {
    @include flex-center(row, 0.8rem);
}

.footer-link {
    color: $color-text-muted;
    text-decoration: none;
    transition: color $transition-fast;

    &:hover {
        color: $color-text-primary;
    }
}

.footer-link-btn {
    background: none;
    border: none;
    color: $color-text-muted;
    font-family: inherit;
    font-size: 1.2rem;
    cursor: pointer;
    transition: color $transition-fast;

    &:hover {
        color: $color-error;
    }
}

.footer-dot {
    color: rgba(255, 255, 255, 0.2);
}
</style>
