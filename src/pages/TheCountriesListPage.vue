<script setup lang="ts">
import { onMounted, ref, inject } from 'vue'
import { watchDebounced, useInfiniteScroll } from '@vueuse/core'
import type { Country } from '@/types/Countries'
import type { loaderProvide } from '@/types/Loader'
import { useI18n } from 'vue-i18n'
import CountryCardList from '@/components/CountryCardList.vue'
import {
  useCountries,
  fetchCountries,
  sortCountriesByPopulation,
  sortCountriesByArea,
  sortCountriesByPopulationDensity,
  filterCountries,
  getFilteredCountriesLength,
  getAFilteredCountries,
} from '@/services/CountriesService'

import { LOADER_PROVIDER_KEY } from '@/keys'

const { t } = useI18n()
const { countries } = useCountries()
const { showLoader, hideLoader, isLoading } = <loaderProvide>inject(LOADER_PROVIDER_KEY)

const pageSize = 16
const currentPage = ref(1)
const filteredCountries = ref<Country[]>([])

const filterByNameInput = ref<string>('')
const filterByRegionInput = ref<string>('')
const filterByLanguageInput = ref<string>('')

function showFirstCountriesPage() {
  filteredCountries.value = []
  currentPage.value = 1
  onLoadMore()
}

function onSortCountries(value: string) {
  showLoader()
  if (value === 'byPopulation') {
    sortCountriesByPopulation()
  } else if (value === 'byArea') {
    sortCountriesByArea()
  } else if (value === 'byPopulationDensity') {
    sortCountriesByPopulationDensity()
  }
  filterCountries(filterByNameInput.value, filterByRegionInput.value, filterByLanguageInput.value)
  showFirstCountriesPage()
  hideLoader()
}

function onLoadMore() {
  showLoader()
  const nextPage = currentPage.value + 1
  const nextItems = getAFilteredCountries(0, nextPage * pageSize)
  if (nextItems.length > filteredCountries.value.length) {
    filteredCountries.value = nextItems
    currentPage.value = nextPage
  }
  hideLoader()
}

function canLoadMore(): boolean {
  return filteredCountries.value.length < getFilteredCountriesLength()
}

onMounted(async () => {
  showLoader()
  await fetchCountries()
  if (countries.value.length) {
    filterCountries(filterByNameInput.value, filterByRegionInput.value, filterByLanguageInput.value)
  }
  showFirstCountriesPage()
  hideLoader()
})

watchDebounced(
  [filterByNameInput, filterByRegionInput, filterByLanguageInput],
  () => {
    filterCountries(filterByNameInput.value, filterByRegionInput.value, filterByLanguageInput.value)
    showFirstCountriesPage()
  },
  { debounce: 250 },
)

useInfiniteScroll(
  window,
  () => {
    if (!isLoading.value && canLoadMore()) {
      onLoadMore()
    }
  },
  { distance: 200 },
)
</script>

<template>
  <div>
    <div class="flex justify-between m-5">
      <div class="flex gap-3">
        <select
          class="w-52 h-10 bg-while dark:bg-gray-600 px-5 px-2 rounded-md text-black dark:text-white shadow-md cursor-pointer truncate"
          @change="onSortCountries(($event.target as HTMLSelectElement).value || '')"
        >
          <option value="" disabled selected>{{ t('message.sort by') }}</option>
          <option value="byPopulation">{{ t('message.by population') }}</option>
          <option value="byArea">{{ t('message.by area') }}</option>
          <option value="byPopulationDensity">{{ t('message.by population density') }}</option>
        </select>
        <input
          class="w-52 h-10 bg-while dark:bg-gray-600 px-5 px-2 rounded-md text-black dark:text-white shadow-md"
          :placeholder="t('message.by name')"
          v-model="filterByNameInput"
        />
      </div>
      <div class="flex gap-3">
        <input
          class="w-52 h-10 bg-while dark:bg-gray-600 px-5 px-2 rounded-md text-black dark:text-white shadow-md"
          :placeholder="t('message.by continent')"
          v-model="filterByRegionInput"
        />
        <input
          class="w-52 h-10 bg-while dark:bg-gray-600 px-5 px-2 rounded-md text-black dark:text-white shadow-md"
          :placeholder="t('message.by language')"
          v-model="filterByLanguageInput"
        />
      </div>
    </div>
    <CountryCardList :countries="filteredCountries" />
  </div>
</template>
