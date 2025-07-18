import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'
import axios from 'axios'

import { type Country } from '@/types/Countries'
import { FAVORITE_COUNTRIES_OFFICIAL_NAMES_LOCAL_STORAGE_KEY } from '@/keys'
import { setItemWithTTL, getItemWithTTL, removeItem } from '@/utils/localStorageTTL'
import { FAVORITE_COUNTRIES_OFFICIAL_NAMES_TTL } from '@/constants'

export const useCountriesStore = defineStore('countries', () => {
  const countries = ref<Country[]>([])

  async function fetchCountries() {
    try {
      const { data } = await axios.get('https://restcountries.com/v3.1/all', {
        params: { fields: 'flags,name,region,population,area,languages' },
      })
      const favorite_countries_official_names = getFavoritedCountriesOfficialName() || []
      countries.value = data.map((country: Country) => ({
        ...country,
        isFavorite: favorite_countries_official_names.includes(country.name.official),
      }))
    } catch (error) {
      console.error(error)
    }
  }

  function sortCountriesByPopulation() {
    countries.value = [...countries.value].sort(
      (a: Country, b: Country) => b.population - a.population,
    )
  }

  function sortCountriesByArea() {
    countries.value = [...countries.value].sort((a: Country, b: Country) => b.area - a.area)
  }

  function sortCountriesByPopulationDensity() {
    countries.value = [...countries.value].sort(
      (a: Country, b: Country) => b.population / b.area - a.population / a.area,
    )
  }

  function filterCountriesByRegion(countries: Country[], region: string) {
    return countries.filter((country: Country) =>
      country.region.toLowerCase().includes(region.toLowerCase()),
    )
  }

  function filterCountriesByLanguage(countries: Country[], language: string) {
    return countries.filter((country: Country) => {
      for (const key in country.languages) {
        if (country.languages[key].toLowerCase().includes(language.toLowerCase())) {
          return true
        }
      }
      return false
    })
  }

  function filterCountriesByName(countries: Country[], name: string) {
    return countries.filter((country: Country) =>
      country.name.official.toLowerCase().includes(name.toLowerCase()),
    )
  }

  function filterCountries(nameQuery = '', regionQuery = '', languageQuery = '') {
    let _countries = countries.value
    if (nameQuery) {
      _countries = filterCountriesByName(_countries, nameQuery)
    }
    if (regionQuery) {
      _countries = filterCountriesByRegion(_countries, regionQuery)
    }
    if (languageQuery) {
      _countries = filterCountriesByLanguage(_countries, languageQuery)
    }
    return _countries
  }

  function getFavoritedCountriesOfficialName() {
    return getItemWithTTL<string[]>(FAVORITE_COUNTRIES_OFFICIAL_NAMES_LOCAL_STORAGE_KEY)
  }

  function addFavoritedCountryOfficialName(name: string) {
    const favoritedCountries = getFavoritedCountriesOfficialName() || []
    favoritedCountries.push(name)
    setItemWithTTL(
      FAVORITE_COUNTRIES_OFFICIAL_NAMES_LOCAL_STORAGE_KEY,
      favoritedCountries,
      FAVORITE_COUNTRIES_OFFICIAL_NAMES_TTL,
    )
    toogleFavoriteCountries(name)
  }

  function removeFavoritedCountryOfficialName(name: string) {
    const favoritedCountries = getFavoritedCountriesOfficialName() || []
    favoritedCountries.splice(favoritedCountries.indexOf(name), 1)
    if (favoritedCountries.length) {
      setItemWithTTL(
        FAVORITE_COUNTRIES_OFFICIAL_NAMES_LOCAL_STORAGE_KEY,
        favoritedCountries,
        FAVORITE_COUNTRIES_OFFICIAL_NAMES_TTL,
      )
    } else {
      removeItem(FAVORITE_COUNTRIES_OFFICIAL_NAMES_LOCAL_STORAGE_KEY)
    }
    toogleFavoriteCountries(name)
  }

  function toogleFavoriteCountries(officialName: string) {
    countries.value.forEach((country: Country) => {
      if (officialName === country.name.official) {
        country.isFavorite = !country.isFavorite
      }
    })
  }

  return {
    countries: readonly(countries),
    fetchCountries,
    sortCountriesByPopulation,
    sortCountriesByArea,
    sortCountriesByPopulationDensity,
    filterCountriesByRegion,
    filterCountriesByLanguage,
    filterCountriesByName,
    getFavoritedCountriesOfficialName,
    addFavoritedCountryOfficialName,
    removeFavoritedCountryOfficialName,
    filterCountries,
  }
})
