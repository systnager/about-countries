import { ref } from 'vue'
import axios from 'axios'

import { type Country } from '@/types/Countries'
import { FAVORITE_COUNTRIES_OFFICIAL_NAMES_LOCAL_STORAGE_KEY } from '@/keys'
import { setItemWithTTL, getItemWithTTL, removeItem } from '@/utils/localStorageTTL'
import { FAVORITE_COUNTRIES_OFFICIAL_NAMES_TTL } from '@/constants'

const countries = ref<Country[]>([])
const allFilteredCountries = ref<Country[]>([])

export function useCountries() {
  return {
    countries,
  }
}

export async function fetchCountries() {
  try {
    const { data } = await axios.get('https://restcountries.com/v3.1/all', {
      params: { fields: 'flags,name,region,population,area,languages' },
    })
    const favorite_countries_official_names = getFavoritedCountriesOfficialName() || []
    countries.value = data.map((country: Country) => ({
      ...country,
      isFavorite: favorite_countries_official_names.includes(country.name.official),
    }))
    console.log(countries.value)
  } catch (error) {
    console.error(error)
  }
}

export function sortCountriesByPopulation() {
  countries.value.sort((a: Country, b: Country) => b.population - a.population)
}

export function sortCountriesByArea() {
  countries.value.sort((a: Country, b: Country) => b.area - a.area)
}

export function sortCountriesByPopulationDensity() {
  countries.value.sort((a: Country, b: Country) => b.population / b.area - a.population / a.area)
}

export function filterCountriesByRegion(countries: Country[], region: string) {
  return countries.filter((country: Country) =>
    country.region.toLowerCase().includes(region.toLowerCase()),
  )
}

export function filterCountriesByLanguage(countries: Country[], language: string) {
  return countries.filter((country: Country) => {
    for (const key in country.languages) {
      if (country.languages[key].toLowerCase().includes(language.toLowerCase())) {
        return true
      }
    }
    return false
  })
}

export function filterCountriesByName(countries: Country[], name: string) {
  return countries.filter((country: Country) =>
    country.name.official.toLowerCase().includes(name.toLowerCase()),
  )
}

export function filterCountries(nameQuery = '', regionQuery = '', languageQuery = '') {
  allFilteredCountries.value = countries.value
  if (nameQuery) {
    allFilteredCountries.value = filterCountriesByName(allFilteredCountries.value, nameQuery)
  }
  if (regionQuery) {
    allFilteredCountries.value = filterCountriesByRegion(allFilteredCountries.value, regionQuery)
  }
  if (languageQuery) {
    allFilteredCountries.value = filterCountriesByLanguage(
      allFilteredCountries.value,
      languageQuery,
    )
  }
}

export function getAFilteredCountries(from = 0, to = 0) {
  return allFilteredCountries.value.slice(from, to)
}

export function getFilteredCountriesLength() {
  return allFilteredCountries.value.length
}

export function getFavoritedCountriesOfficialName() {
  return getItemWithTTL<string[]>(FAVORITE_COUNTRIES_OFFICIAL_NAMES_LOCAL_STORAGE_KEY)
}

export function addFavoritedCountryOfficialName(name: string) {
  const favoritedCountries = getFavoritedCountriesOfficialName() || []
  favoritedCountries.push(name)
  setItemWithTTL(
    FAVORITE_COUNTRIES_OFFICIAL_NAMES_LOCAL_STORAGE_KEY,
    favoritedCountries,
    FAVORITE_COUNTRIES_OFFICIAL_NAMES_TTL,
  )
  toogleFavoriteCountries(name)
  toogleAllFilteredCountriesFavorite(name)
}

export function removeFavoritedCountryOfficialName(name: string) {
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
  toogleAllFilteredCountriesFavorite(name)
}

function toogleFavoriteCountries(officialName: string) {
  countries.value.forEach((country: Country) => {
    if (officialName === country.name.official) {
      country.isFavorite = !country.isFavorite
    }
  })
}

function toogleAllFilteredCountriesFavorite(officialName: string) {
  allFilteredCountries.value.forEach((country: Country) => {
    if (officialName === country.name.official) {
      country.isFavorite = !country.isFavorite
    }
  })
}
