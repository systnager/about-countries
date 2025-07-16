<script setup lang="ts">
import { onMounted, ref, inject } from 'vue'
import type { Country } from '@/types/Countries'
import type { loaderProvide } from '@/types/Loader'
import { LOADER_PROVIDER_KEY } from '@/keys'
import CountryListView from '@/components/CountryListView.vue'
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

const { showLoader, hideLoader } = <loaderProvide>inject(LOADER_PROVIDER_KEY)
const countryListViewRef = ref<typeof CountryListView>()
const { countries } = useCountries()

const pageSize = 16
const currentPage = ref(1)
const filteredCountries = ref<Country[]>([])

function showFirstCountriesPage() {
  filteredCountries.value = []
  currentPage.value = 1
  onLoadMore()
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

function onSortCountries(type: string) {
  if (type === 'byPopulation') {
    sortCountriesByPopulation()
  } else if (type === 'byArea') {
    sortCountriesByArea()
  } else if (type === 'byPopulationDensity') {
    sortCountriesByPopulationDensity()
  }
  filterCountries(
    countryListViewRef.value?.filterByNameInput,
    countryListViewRef.value?.filterByRegionInput,
    countryListViewRef.value?.filterByLanguageInput,
  )
  showFirstCountriesPage()
}

function onFilterCountries() {
  filterCountries(
    countryListViewRef.value?.filterByNameInput,
    countryListViewRef.value?.filterByRegionInput,
    countryListViewRef.value?.filterByLanguageInput,
  )
  showFirstCountriesPage()
}

onMounted(async () => {
  showLoader()
  await fetchCountries()
  if (countries.value.length) {
    filterCountries(
      countryListViewRef.value?.filterByNameInput,
      countryListViewRef.value?.filterByRegionInput,
      countryListViewRef.value?.filterByLanguageInput,
    )
  }
  showFirstCountriesPage()
  hideLoader()
})
</script>

<template>
  <div>
    <CountryListView
      ref="countryListViewRef"
      @sort-countries="onSortCountries"
      @filter-countries="onFilterCountries"
      :countries="filteredCountries"
      :can-load-more="canLoadMore"
      :on-load-more="onLoadMore"
    />
  </div>
</template>
