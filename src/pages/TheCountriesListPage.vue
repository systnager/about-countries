<script setup lang="ts">
import { onMounted, ref, inject } from 'vue'
import type { loaderProvide } from '@/types/Loader'
import { LOADER_PROVIDER_KEY } from '@/keys'
import CountryListView from '@/components/CountryListView.vue'
import { useCountriesStore } from '@/stores/countries'
import { useCountryPage } from '@/composables/useCountryPage'
import type { Country } from '@/types/Countries'

const { showLoader, hideLoader } = <loaderProvide>inject(LOADER_PROVIDER_KEY)
const countryListViewRef = ref<typeof CountryListView>()
const countriesStore = useCountriesStore()
const {
  showFirstCountriesPage,
  canLoadMore,
  onLoadMore,
  showedCountries,
  onSortCountries,
  onFilterCountries,
  setCountriesList,
} = useCountryPage(
  showLoader,
  hideLoader,
  countriesStore.sortCountriesByPopulation,
  countriesStore.sortCountriesByArea,
  countriesStore.sortCountriesByPopulationDensity,
  countriesStore.filterCountries,
)

function onToggleFavoriteCountry(officialName: string) {
  if (countriesStore.getFavoritedCountriesOfficialName()?.includes(officialName)) {
    countriesStore.removeFavoritedCountryOfficialName(officialName)
  } else {
    countriesStore.addFavoritedCountryOfficialName(officialName)
  }
}

onMounted(async () => {
  showLoader()
  await countriesStore.getCountries()
  setCountriesList(countriesStore.countries as Country[])
  showFirstCountriesPage()
  hideLoader()
})
</script>

<template>
  <div>
    <CountryListView
      ref="countryListViewRef"
      @sort-countries="
        (sortType: string) => {
          onFilterCountries(
            countryListViewRef?.filterByNameInput,
            countryListViewRef?.filterByRegionInput,
            countryListViewRef?.filterByLanguageInput,
          )
          onSortCountries(sortType)
        }
      "
      @filter-countries="
        () =>
          onFilterCountries(
            countryListViewRef?.filterByNameInput,
            countryListViewRef?.filterByRegionInput,
            countryListViewRef?.filterByLanguageInput,
          )
      "
      @toggle-favorite-country="onToggleFavoriteCountry"
      :countries="showedCountries"
      :can-load-more="canLoadMore"
      :on-load-more="onLoadMore"
    />
  </div>
</template>
