import { ref } from 'vue'
import type { Country } from '@/types/Countries'

export function useCountryPage(
  showLoader: () => void,
  hideLoader: () => void,
  sortCountriesByPopulation: (countries: Country[]) => Country[],
  sortCountriesByArea: (countries: Country[]) => Country[],
  sortCountriesByPopulationDensity: (countries: Country[]) => Country[],
  filterCountries: (
    name: string | undefined,
    region: string | undefined,
    language: string | undefined,
    countries: Country[],
  ) => Country[],
) {
  let currentPage = 1
  const pageSize = 16
  const countriesList = ref<Country[]>([])
  const showedCountries = ref<Country[]>([])
  const filteredAndSortedCountries = ref<Country[]>([])

  function setCountriesList(countries: Country[]) {
    countriesList.value = countries
    filteredAndSortedCountries.value = countries
  }

  function showFirstCountriesPage() {
    showedCountries.value = []
    currentPage = 1
    onLoadMore()
  }

  function onLoadMore() {
    showLoader()
    const nextPage = currentPage + 1
    const nextItems = filteredAndSortedCountries.value.slice(0, nextPage * pageSize)
    if (nextItems.length > showedCountries.value.length) {
      showedCountries.value = nextItems
      currentPage = nextPage
    }
    hideLoader()
  }

  function canLoadMore(): boolean {
    return showedCountries.value.length < filteredAndSortedCountries.value.length
  }

  function onSortCountries(type: string) {
    showLoader()
    if (type === 'byPopulation') {
      filteredAndSortedCountries.value = sortCountriesByPopulation(filteredAndSortedCountries.value)
    } else if (type === 'byArea') {
      filteredAndSortedCountries.value = sortCountriesByArea(filteredAndSortedCountries.value)
    } else if (type === 'byPopulationDensity') {
      filteredAndSortedCountries.value = sortCountriesByPopulationDensity(
        filteredAndSortedCountries.value,
      )
    }
    showFirstCountriesPage()
    hideLoader()
  }

  function onFilterCountries(
    filterByNameValue?: string,
    filterByRegionValue?: string,
    filterByLanguageValue?: string,
  ) {
    showLoader()
    filteredAndSortedCountries.value = filterCountries(
      filterByNameValue,
      filterByRegionValue,
      filterByLanguageValue,
      countriesList.value,
    )
    showFirstCountriesPage()
    hideLoader()
  }

  return {
    showedCountries,
    showFirstCountriesPage,
    onLoadMore,
    canLoadMore,
    onSortCountries,
    onFilterCountries,
    setCountriesList,
  }
}
