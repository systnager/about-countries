import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from '@/router/index'
import { createI18n } from 'vue-i18n'
import ukr from '@/locales/ukr.json'
import eng from '@/locales/eng.json'

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

console.log({
  messages: {
    urk: ukr,
    eng: eng,
  },
})

app.use(createPinia())
app.use(router)
app.use(i18n)
app.mount('#app')
