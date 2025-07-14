import { createWebHistory, createRouter } from 'vue-router'

import TheCountriesListPage from '@/pages/TheCountriesListPage.vue'
import TheAnalyticsPage from '@/pages/TheAnalyticsPage.vue'
import TheFavoritesPage from '@/pages/TheFavoritesPage.vue'

const routes = [
  { path: '/', component: TheCountriesListPage },
  { path: '/analytics', component: TheAnalyticsPage },
  { path: '/favorites', component: TheFavoritesPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
