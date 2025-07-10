import { createMemoryHistory, createRouter } from 'vue-router'

import TheCountriesListPage from '@/pages/TheCountriesListPage.vue'

const routes = [{ path: '/', component: TheCountriesListPage }]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
