import { SUPORTED_LANGUAGES } from '@/constants'
import { useI18n } from 'vue-i18n'

export function useLanguage() {
  const { locale } = useI18n()
  function setLocale(lang: string) {
    if (!SUPORTED_LANGUAGES.includes(lang)) {
      lang = 'eng'
    }
    localStorage.setItem('lang', lang)
    locale.value = lang
  }
  return {
    setLocale,
  }
}
