<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { watchDebounced } from '@vueuse/core'
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

const isLoading = ref(false)

const filteredCountries = ref<Country[]>([])

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
  filteredCountries.value = countries.value
  if (filterByNameInput.value) {
    filteredCountries.value = filterCountriesByName(
      filteredCountries.value,
      filterByNameInput.value,
    )
  }
  if (filterByRegionInput.value) {
    filteredCountries.value = filterCountriesByRegion(
      filteredCountries.value,
      filterByRegionInput.value,
    )
  }
  if (filterByLanguageInput.value) {
    filteredCountries.value = filterCountriesByLanguage(
      filteredCountries.value,
      filterByLanguageInput.value,
    )
  }
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

onMounted(async () => {
  showLoader()
  await fetchCountries()
  filteredCountries.value = countries.value
  hideLoader()
})

watchDebounced(
  [filterByNameInput, filterByRegionInput, filterByLanguageInput],
  () => {
    filterCountries()
  },
  { debounce: 500 },
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
    <CountryCardList :countries="filteredCountries" />
  </div>
</template>
