<template>
    <div class="security-page">
        <div class="security-hero">
            <span class="hero-badge">{{ $t('security_page.badge') }}</span>
            <h1 class="hero-title">{{ $t('security_page.hero_title') }}</h1>
            <p class="hero-subtitle">
                {{ $t('security_page.hero_subtitle') }}
            </p>
        </div>

        <div class="pillars-grid">
            <div v-for="pillar in PILLARS" :key="pillar.id" class="pillar-card">
                <div class="pillar-icon">{{ pillar.icon }}</div>
                <h3 class="pillar-title">{{ $t(`security_page.${pillar.id}_title`) }}</h3>
                <p class="pillar-desc">
                    {{ $t(`security_page.${pillar.id}_desc`) }}
                </p>
            </div>
        </div>

        <div class="comparison-section">
            <h2 class="section-title">{{ $t('security_page.comparison_title') }}</h2>
            <div class="table-wrapper">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>{{ $t('security_page.th_param') }}</th>
                            <th class="highlight">{{ $t('security_page.th_p2p') }}</th>
                            <th>{{ $t('security_page.th_cloud') }}</th>
                            <th>{{ $t('security_page.th_messenger') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="rowKey in COMPARISON_ROWS" :key="rowKey">
                            <td class="param-cell">{{ $t(`security_page.${rowKey}_param`) }}</td>
                            <td class="highlight-val text-green">
                                {{ $t(`security_page.${rowKey}_p2p`) }}
                            </td>
                            <td>{{ $t(`security_page.${rowKey}_cloud`) }}</td>
                            <td>{{ $t(`security_page.${rowKey}_messenger`) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="security-cta">
            <h3 class="cta-title">{{ $t('security_page.cta_title') }}</h3>
            <p class="cta-subtitle">{{ $t('security_page.cta_subtitle') }}</p>
            <NuxtLink to="/" class="ui-button ui-button--primary ui-button--lg cta-btn">
                {{ $t('security_page.cta_btn') }}
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const PILLARS = [
    { id: 'pillar1', icon: '🔐' },
    { id: 'pillar2', icon: '⚡' },
    { id: 'pillar3', icon: '🚀' },
    { id: 'pillar4', icon: '🕵️‍♂️' }
] as const

const COMPARISON_ROWS = ['row1', 'row2', 'row3', 'row4', 'row5'] as const

useSeoMeta({
    title: () => t('seo.security_title'),
    description: () => t('seo.security_description'),
    ogTitle: () => t('seo.security_title'),
    ogDescription: () => t('seo.security_description')
})
</script>

<style lang="scss" scoped>
.security-page {
    display: flex;
    flex-direction: column;
    gap: 4rem;
    width: 100%;
    max-width: 90rem;
    margin: 0 auto;

    @include respond-to(mobile) {
        gap: 2.8rem;
    }
}

.security-hero {
    text-align: center;
    max-width: 80rem;
    margin: 0 auto;
    width: 100%;

    .hero-badge {
        font-size: 1.2rem;
        font-weight: 700;
        letter-spacing: 0.15rem;
        color: $color-accent-cyan;
        background: rgba(0, 242, 254, 0.08);
        border: 1px solid rgba(0, 242, 254, 0.2);
        padding: 0.4rem 1.2rem;
        border-radius: $radius-full;
        display: inline-block;
        margin-bottom: 1.6rem;

        @include respond-to(mobile) {
            font-size: 1.1rem;
            letter-spacing: 0.1rem;
            padding: 0.3rem 1rem;
        }
    }

    .hero-title {
        font-size: 3.6rem;
        font-weight: 800;
        color: $color-text-primary;
        line-height: 1.2;
        margin-bottom: 1.6rem;
        overflow-wrap: break-word;
        word-break: break-word;

        @include respond-to(tablet) {
            font-size: 2.8rem;
        }

        @include respond-to(mobile) {
            font-size: 2.2rem;
        }
    }

    .hero-subtitle {
        font-size: 1.6rem;
        color: $color-text-secondary;
        line-height: 1.6;

        @include respond-to(mobile) {
            font-size: 1.4rem;
        }
    }
}

.pillars-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    width: 100%;

    @include respond-to(tablet) {
        grid-template-columns: 1fr;
        gap: 1.4rem;
    }
}

.pillar-card {
    padding: 2.4rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: $radius-lg;
    backdrop-filter: blur(1rem);
    transition: all $transition-normal;
    width: 100%;

    @include respond-to(mobile) {
        padding: 1.8rem 1.4rem;
    }

    &:hover {
        transform: translateY(-0.3rem);
        border-color: rgba(0, 242, 254, 0.3);
        box-shadow: $shadow-glow-cyan;
    }

    .pillar-icon {
        font-size: 3.2rem;
        margin-bottom: 1.4rem;

        @include respond-to(mobile) {
            font-size: 2.6rem;
            margin-bottom: 1rem;
        }
    }

    .pillar-title {
        font-size: 1.8rem;
        font-weight: 700;
        color: $color-text-primary;
        margin-bottom: 1rem;

        @include respond-to(mobile) {
            font-size: 1.6rem;
        }
    }

    .pillar-desc {
        font-size: 1.4rem;
        color: $color-text-muted;
        line-height: 1.6;

        @include respond-to(mobile) {
            font-size: 1.3rem;
        }
    }
}

.comparison-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;

    .section-title {
        font-size: 2.2rem;
        font-weight: 700;
        color: $color-text-primary;
        text-align: center;

        @include respond-to(mobile) {
            font-size: 1.8rem;
        }
    }
}

.table-wrapper {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: $radius-lg;
    padding: 0.8rem;
}

.comparison-table {
    width: 100%;
    min-width: 54rem;
    border-collapse: collapse;
    text-align: left;
    font-size: 1.4rem;

    @include respond-to(mobile) {
        font-size: 1.25rem;
    }

    th,
    td {
        padding: 1.4rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);

        @include respond-to(mobile) {
            padding: 1rem 0.8rem;
        }
    }

    th {
        font-weight: 700;
        color: $color-text-secondary;
        white-space: nowrap;
    }

    .param-cell {
        font-weight: 600;
        color: $color-text-primary;
    }

    .highlight {
        color: $color-accent-cyan;
    }

    .highlight-val {
        font-weight: 700;
        background: rgba(0, 242, 254, 0.03);
    }

    .text-green {
        color: $color-accent-green;
    }
}

.security-cta {
    text-align: center;
    padding: 4rem 2rem;
    background: linear-gradient(135deg, rgba(0, 242, 254, 0.05), rgba(79, 172, 254, 0.05));
    border: 1px solid rgba(0, 242, 254, 0.2);
    border-radius: $radius-xl;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    @include respond-to(mobile) {
        padding: 2.4rem 1.4rem;
    }

    .cta-title {
        font-size: 2.4rem;
        font-weight: 700;
        color: $color-text-primary;
        margin-bottom: 0.8rem;

        @include respond-to(mobile) {
            font-size: 1.9rem;
        }
    }

    .cta-subtitle {
        font-size: 1.4rem;
        color: $color-text-secondary;
        margin-bottom: 2.4rem;

        @include respond-to(mobile) {
            font-size: 1.3rem;
            margin-bottom: 1.8rem;
        }
    }

    .cta-btn {
        text-decoration: none;

        @include respond-to(mobile) {
            width: 100%;
            max-width: 28rem;
        }
    }
}
</style>
