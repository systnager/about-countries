import { ref } from 'vue'
import axios from 'axios'

import { type Country } from '@/types/Countries'

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
    countries.value = data
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
