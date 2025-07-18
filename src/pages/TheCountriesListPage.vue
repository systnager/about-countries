<script setup lang="ts">
import { onMounted, ref, inject } from 'vue'
import type { Country } from '@/types/Countries'
import type { loaderProvide } from '@/types/Loader'
import { LOADER_PROVIDER_KEY } from '@/keys'
import CountryListView from '@/components/CountryListView.vue'
import { useCountriesStore } from '@/stores/countries'

const { showLoader, hideLoader } = <loaderProvide>inject(LOADER_PROVIDER_KEY)
const countryListViewRef = ref<typeof CountryListView>()
const countriesStore = useCountriesStore()
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
  const nextItems = countriesStore.getAFilteredCountries(0, nextPage * pageSize)
  if (nextItems.length > countries.value.length) {
    countries.value = nextItems
    currentPage.value = nextPage
  }
  hideLoader()
}

function canLoadMore(): boolean {
  return countries.value.length < countriesStore.getFilteredCountriesLength()
}

function onSortCountries(type: string) {
  if (type === 'byPopulation') {
    countriesStore.sortCountriesByPopulation()
  } else if (type === 'byArea') {
    countriesStore.sortCountriesByArea()
  } else if (type === 'byPopulationDensity') {
    countriesStore.sortCountriesByPopulationDensity()
  }
  _filterCountries()
  showFirstCountriesPage()
}

function onFilterCountries() {
  _filterCountries()
  showFirstCountriesPage()
}

function onToggleFavoriteCountry(officialName: string) {
  if (countriesStore.getFavoritedCountriesOfficialName()?.includes(officialName)) {
    countriesStore.removeFavoritedCountryOfficialName(officialName)
  } else {
    countriesStore.addFavoritedCountryOfficialName(officialName)
  }
}

function _filterCountries() {
  countriesStore.filterCountries(
    countryListViewRef.value?.filterByNameInput,
    countryListViewRef.value?.filterByRegionInput,
    countryListViewRef.value?.filterByLanguageInput,
  )
}

onMounted(async () => {
  showLoader()
  await countriesStore.fetchCountries()
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
