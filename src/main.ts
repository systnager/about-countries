import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from '@/router/index'

import App from '@/App.vue'
import { i18n } from '@/i18n/main'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')
