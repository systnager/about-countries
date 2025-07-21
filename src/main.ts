import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from '@/router/index'
import { createI18n } from 'vue-i18n'
import ukr from '@/i18n/locales/ukr.json'
import eng from '@/i18n/locales/eng.json'

import App from './App.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'ukr',
  fallbackLocate: 'eng',
  messages: {
    ukr,
    eng,
  },
})
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')
