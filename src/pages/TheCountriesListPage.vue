<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { watchDebounced, useInfiniteScroll } from '@vueuse/core'
import type { Country } from '@/types/Countries'
import { useI18n } from 'vue-i18n'
import CountryCardList from '@/components/CountryCardList.vue'
import WaitLoader from '@/components/WaitLoader.vue'
import {
  useCountries,
  fetchCountries,
  sortCountriesByPopulation,
  sortCountriesByArea,
  sortCountriesByPopulationDensity,
  filterCountriesByName,
  filterCountriesByRegion,
  filterCountriesByLanguage,
} from '@/services/CountriesService'

const { t } = useI18n()
const { countries } = useCountries()

const pageSize = 16
const currentPage = ref(1)
const isLoading = ref(false)
const filteredCountries = ref<Country[]>([])
const allFilteredCountries = ref<Country[]>([])

const filterByNameInput = ref<string>('')
const filterByRegionInput = ref<string>('')
const filterByLanguageInput = ref<string>('')

function onSortCountries(value: string) {
  showLoader()
  if (value === 'byPopulation') {
    sortCountriesByPopulation()
  } else if (value === 'byArea') {
    sortCountriesByArea()
  } else if (value === 'byPopulationDensity') {
    sortCountriesByPopulationDensity()
  }
  filterCountries()
  hideLoader()
}

function filterCountries() {
  showLoader()
  allFilteredCountries.value = countries.value
  if (filterByNameInput.value) {
    allFilteredCountries.value = filterCountriesByName(
      allFilteredCountries.value,
      filterByNameInput.value,
    )
  }
  if (filterByRegionInput.value) {
    allFilteredCountries.value = filterCountriesByRegion(
      allFilteredCountries.value,
      filterByRegionInput.value,
    )
  }
  if (filterByLanguageInput.value) {
    allFilteredCountries.value = filterCountriesByLanguage(
      allFilteredCountries.value,
      filterByLanguageInput.value,
    )
  }
  currentPage.value = 1
  filteredCountries.value = allFilteredCountries.value.slice(0, pageSize)
  hideLoader()
}

function showLoader() {
  isLoading.value = true
}

function hideLoader() {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}

function onLoadMore() {
  showLoader()
  const nextPage = currentPage.value + 1
  const nextItems = allFilteredCountries.value.slice(0, nextPage * pageSize)
  if (nextItems.length > filteredCountries.value.length) {
    filteredCountries.value = nextItems
    currentPage.value = nextPage
  }
  hideLoader()
}

function canLoadMore(): boolean {
  return filteredCountries.value.length < allFilteredCountries.value.length
}

onMounted(async () => {
  showLoader()
  await fetchCountries()
  if (countries.value.length) {
    filterCountries()
  }
  hideLoader()
})

watchDebounced(
  [filterByNameInput, filterByRegionInput, filterByLanguageInput],
  () => {
    filterCountries()
  },
  { debounce: 500 },
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
    <WaitLoader v-if="isLoading" />
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
    <div>
      <CountryCardList :countries="filteredCountries" />
    </div>
  </div>
</template>
