import { createWebHistory, createRouter } from 'vue-router'

import TheCountriesListPage from '@/pages/TheCountriesListPage.vue'
import TheAnalyticsPage from '@/pages/TheAnalyticsPage.vue'
import TheFavoritesPage from '@/pages/TheFavoritesPage.vue'
import AboutCountryPage from '@/pages/AboutCountryPage.vue'

const routes = [
  { path: '/', component: TheCountriesListPage },
  { path: '/analytics', component: TheAnalyticsPage },
  { path: '/favorites', component: TheFavoritesPage },
  { path: '/country/:code', component: AboutCountryPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
