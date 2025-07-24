import { createI18n } from 'vue-i18n'
import ukr from '@/i18n/locales/ukr.json'
import eng from '@/i18n/locales/eng.json'
import { SUPORTED_LANGUAGES } from '@/constants'

export const i18n = createI18n({
  legacy: false,
  locale: getLocale(),
  fallbackLocate: 'eng',
  messages: {
    ukr,
    eng,
  },
})

function getLocale() {
  const lang = localStorage.getItem('lang') || 'eng'
  return SUPORTED_LANGUAGES.includes(lang) ? lang : 'eng'
}
