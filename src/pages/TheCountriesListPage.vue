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
const showedCountries = ref<Country[]>([])
const allCountries = ref<Country[]>([])
let currentPage = 1
const pageSize = 16

function showFirstCountriesPage() {
  showedCountries.value = []
  currentPage = 1
  onLoadMore()
}

function onLoadMore() {
  showLoader()
  const nextPage = currentPage + 1
  const nextItems = allCountries.value.slice(0, nextPage * pageSize)
  if (nextItems.length > showedCountries.value.length) {
    showedCountries.value = nextItems
    currentPage = nextPage
  }
  hideLoader()
}

function canLoadMore(): boolean {
  return showedCountries.value.length < allCountries.value.length
}

function onSortCountries(type: string) {
  showLoader()
  onFilterCountries()
  if (type === 'byPopulation') {
    allCountries.value = countriesStore.sortCountriesByPopulation(allCountries.value)
  } else if (type === 'byArea') {
    allCountries.value = countriesStore.sortCountriesByArea(allCountries.value)
  } else if (type === 'byPopulationDensity') {
    allCountries.value = countriesStore.sortCountriesByPopulationDensity(allCountries.value)
  }
  showFirstCountriesPage()
  hideLoader()
}

function onFilterCountries() {
  showLoader()
  allCountries.value = countriesStore.filterCountries(
    countryListViewRef.value?.filterByNameInput,
    countryListViewRef.value?.filterByRegionInput,
    countryListViewRef.value?.filterByLanguageInput,
    [...countriesStore.countries],
  )
  showFirstCountriesPage()
  hideLoader()
}

function onToggleFavoriteCountry(officialName: string) {
  if (countriesStore.getFavoritedCountriesOfficialName()?.includes(officialName)) {
    countriesStore.removeFavoritedCountryOfficialName(officialName)
  } else {
    countriesStore.addFavoritedCountryOfficialName(officialName)
  }
}

onMounted(async () => {
  showLoader()
  await countriesStore.fetchCountries()
  allCountries.value = [...countriesStore.countries]
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
      :countries="showedCountries"
      :can-load-more="canLoadMore"
      :on-load-more="onLoadMore"
    />
  </div>
</template>
