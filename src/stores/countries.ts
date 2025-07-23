import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'

import { type Country } from '@/types/Countries'
import {
  FAVORITE_COUNTRIES_OFFICIAL_NAMES_LOCAL_STORAGE_KEY,
  COUNTRIES_OFFICIAL_NAMES_LOCAL_STORAGE_KEY,
} from '@/keys'
import { setItemWithTTL, getItemWithTTL, removeItem } from '@/utils/localStorageTTL'
import {
  FAVORITE_COUNTRIES_OFFICIAL_NAMES_TTL,
  COUNTRIES_OFFICIAL_NAMES_TTL,
  COUNTRY_OFFICIAL_NAMES_TTL,
} from '@/constants'

import { fetchCountries, fetchCountry } from '@/services/restcountries'

export const useCountriesStore = defineStore('countries', () => {
  const countries = ref<Country[]>([])

  async function getCountries() {
    const favorite_countries_official_names = getFavoritedCountriesOfficialName() || []
    let data = getItemWithTTL(COUNTRIES_OFFICIAL_NAMES_LOCAL_STORAGE_KEY) as Country[]
    if (!data) {
      data = await fetchCountries()
      setItemWithTTL(COUNTRIES_OFFICIAL_NAMES_LOCAL_STORAGE_KEY, data, COUNTRIES_OFFICIAL_NAMES_TTL)
    }

    countries.value = data.map((country: Country) => ({
      ...country,
      isFavorite: favorite_countries_official_names.includes(country.name.official),
    }))
  }

  async function getCountryByCode(code: string) {
    let country = getItemWithTTL(code) as Country
    if (!country) {
      country = await fetchCountry(code)
      setItemWithTTL(code, country, COUNTRY_OFFICIAL_NAMES_TTL)
    }
    return country
  }

  function sortCountriesByPopulation(countries: Country[]) {
    return countries.sort((a: Country, b: Country) => b.population - a.population)
  }

  function sortCountriesByArea(countries: Country[]) {
    return countries.sort((a: Country, b: Country) => b.area - a.area)
  }

  function sortCountriesByPopulationDensity(countries: Country[]) {
    return countries.sort((a: Country, b: Country) => b.population / b.area - a.population / a.area)
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

  function filterCountries(
    nameQuery = '',
    regionQuery = '',
    languageQuery = '',
    countries: Country[] = [],
  ) {
    if (nameQuery) {
      countries = filterCountriesByName(countries, nameQuery)
    }
    if (regionQuery) {
      countries = filterCountriesByRegion(countries, regionQuery)
    }
    if (languageQuery) {
      countries = filterCountriesByLanguage(countries, languageQuery)
    }
    return countries
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

  function getFavoritedCountries() {
    return countries.value.filter((country: Country) => country.isFavorite)
  }

  function getRelationCountriesByLanguages(languages: string[]) {
    return countries.value.filter((country: Country) => {
      for (const key in country.languages) {
        if (languages.includes(country.languages[key])) {
          return true
        }
      }
      return false
    })
  }

  function getRelationCountriesBySubRegion(subRegion: string) {
    return countries.value.filter((country: Country) =>
      country.region.toLowerCase().includes(subRegion.toLowerCase()),
    )
  }

  function getRelationCountries(languages: string[], subRegion: string) {
    return [
      ...getRelationCountriesByLanguages(languages),
      ...getRelationCountriesBySubRegion(subRegion),
    ]
  }

  function getTopCountriesByPopulation(countries: Country[], count: number): Country[] {
    const _countries = [...countries]
    return _countries.sort((a: Country, b: Country) => b.population - a.population).slice(0, count)
  }

  function getTopCountriesByArea(countries: Country[], count: number): Country[] {
    const _countries = [...countries]
    return _countries.sort((a: Country, b: Country) => b.area - a.area).slice(0, count)
  }

  function getTopCountriesByLanguagesCount(countries: Country[], count: number): Country[] {
    const _countries = [...countries]
    return _countries
      .sort(
        (a: Country, b: Country) =>
          Object.keys(b.languages).length - Object.keys(a.languages).length,
      )
      .slice(0, count)
  }

  function getCountryCountByRegions(countries: Country[]) {
    const regions: { [key: string]: number } = {}
    countries.forEach((country: Country) => {
      if (regions[country.region]) {
        regions[country.region]++
      } else {
        regions[country.region] = 1
      }
    })
    return regions
  }

  function getTopLanguages(countries: Country[], topCount: number) {
    const languages: { [key: string]: number } = {}
    countries.forEach((country: Country) => {
      for (const key in country.languages) {
        if (languages[country.languages[key]]) {
          languages[country.languages[key]]++
        } else {
          languages[country.languages[key]] = 1
        }
      }
    })
    return Object.fromEntries(
      Object.entries(languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, topCount),
    )
  }

  return {
    countries: readonly(countries),
    getCountries,
    getCountryByCode,
    sortCountriesByPopulation,
    sortCountriesByArea,
    sortCountriesByPopulationDensity,
    filterCountriesByRegion,
    filterCountriesByLanguage,
    filterCountriesByName,
    getFavoritedCountriesOfficialName,
    getFavoritedCountries,
    addFavoritedCountryOfficialName,
    removeFavoritedCountryOfficialName,
    filterCountries,
    getRelationCountries,
    getTopCountriesByPopulation,
    getTopCountriesByArea,
    getTopCountriesByLanguagesCount,
    getCountryCountByRegions,
    getTopLanguages,
  }
})
