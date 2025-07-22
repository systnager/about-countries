import type { Country } from '@/types/Countries'
import axios from 'axios'

export async function fetchCountry(code: string): Promise<Country> {
  try {
    const { data } = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`)
    return data.length > 0 ? data[0] : ({} as Country)
  } catch (error) {
    console.error(error)
    return {} as Country
  }
}

export async function fetchCountries(): Promise<Country[]> {
  try {
    const { data } = await axios.get('https://restcountries.com/v3.1/all', {
      params: { fields: 'flags,name,region,population,area,languages,ccn3,flag' },
    })
    return data.length > 0 ? data : []
  } catch (error) {
    console.error(error)
    return []
  }
}
