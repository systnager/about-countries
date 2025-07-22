import type { Country } from '@/types/Countries'
import type { TableData } from '@/types/Table'

export function formatTopCountriesByPopulationTableData(
  countries: Country[],
  headers: string[],
): TableData {
  const data = countries.map((country: Country, index: number) => {
    return {
      id: index + 1,
      data: [index + 1, `${country.flag}${country.name.official}`, country.population],
    }
  })

  return { headers, data }
}

export function formatTopCountriesByAreaTableData(
  countries: Country[],
  headers: string[],
): TableData {
  const data = countries.map((country: Country, index: number) => {
    return {
      id: index + 1,
      data: [index + 1, `${country.flag}${country.name.official}`, country.area],
    }
  })

  return { headers, data }
}

export function formatTopCountriesByLanguagesCountTableData(
  countries: Country[],
  headers: string[],
): TableData {
  const data = countries.map((country: Country, index: number) => {
    return {
      id: index + 1,
      data: [
        index + 1,
        `${country.flag}${country.name.official}`,
        Object.keys(country.languages).length,
      ],
    }
  })

  return { headers, data }
}
