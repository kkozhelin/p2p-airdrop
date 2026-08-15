// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    srcDir: 'app',
    serverDir: 'server',
    devtools: { enabled: true },

    modules: ['@nuxtjs/i18n', '@nuxt/eslint'],

    css: ['modern-normalize/modern-normalize.css', '~/assets/scss/main.scss'],

    app: {
        head: {
            link: [
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
                }
            ]
        }
    },

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData:
                        '@use "~/assets/scss/_variables.scss" as *; @use "~/assets/scss/_mixins.scss" as *; @use "~/assets/scss/_breakpoints.scss" as *;'
                }
            }
        }
    },

    i18n: {
        bundle: {
            optimizeTranslationDirective: false
        },
        locales: [
            { code: 'ru', name: 'Русский', file: 'ru.json' },
            { code: 'en', name: 'English', file: 'en.json' }
        ],
        defaultLocale: 'ru',
        lazy: false,
        langDir: 'locales',
        strategy: 'no_prefix'
    }
})
