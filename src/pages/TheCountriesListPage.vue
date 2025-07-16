<script setup lang="ts">
import { onMounted, ref, inject } from 'vue'
import type { Country } from '@/types/Countries'
import type { loaderProvide } from '@/types/Loader'
import { LOADER_PROVIDER_KEY } from '@/keys'
import CountryListView from '@/components/CountryListView.vue'
import {
  fetchCountries,
  sortCountriesByPopulation,
  sortCountriesByArea,
  sortCountriesByPopulationDensity,
  filterCountries,
  getFilteredCountriesLength,
  getAFilteredCountries,
  getFavoritedCountriesOfficialName,
  removeFavoritedCountryOfficialName,
  addFavoritedCountryOfficialName,
} from '@/services/CountriesService'

const { showLoader, hideLoader } = <loaderProvide>inject(LOADER_PROVIDER_KEY)
const countryListViewRef = ref<typeof CountryListView>()

const countries = ref<Country[]>([])
const currentPage = ref(1)
const pageSize = 16

function showFirstCountriesPage() {
  countries.value = []
  currentPage.value = 1
  onLoadMore()
}

function onLoadMore() {
  showLoader()
  const nextPage = currentPage.value + 1
  const nextItems = getAFilteredCountries(0, nextPage * pageSize)
  if (nextItems.length > countries.value.length) {
    countries.value = nextItems
    currentPage.value = nextPage
  }
  hideLoader()
}

function canLoadMore(): boolean {
  return countries.value.length < getFilteredCountriesLength()
}

function onSortCountries(type: string) {
  if (type === 'byPopulation') {
    sortCountriesByPopulation()
  } else if (type === 'byArea') {
    sortCountriesByArea()
  } else if (type === 'byPopulationDensity') {
    sortCountriesByPopulationDensity()
  }
  _filterCountries()
  showFirstCountriesPage()
}

function onFilterCountries() {
  _filterCountries()
  showFirstCountriesPage()
}

function onToggleFavoriteCountry(officialName: string) {
  if (getFavoritedCountriesOfficialName()?.includes(officialName)) {
    removeFavoritedCountryOfficialName(officialName)
  } else {
    addFavoritedCountryOfficialName(officialName)
  }
}

function _filterCountries() {
  filterCountries(
    countryListViewRef.value?.filterByNameInput,
    countryListViewRef.value?.filterByRegionInput,
    countryListViewRef.value?.filterByLanguageInput,
  )
}

onMounted(async () => {
  showLoader()
  await fetchCountries()
  _filterCountries()
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
      @toggle-favorite-country="onToggleFavoriteCountry"
      :countries="countries"
      :can-load-more="canLoadMore"
      :on-load-more="onLoadMore"
    />
  </div>
</template>
