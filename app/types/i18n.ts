import type { LOCALES } from '~/constants/app'

export type SupportedLocale = (typeof LOCALES)[keyof typeof LOCALES]
