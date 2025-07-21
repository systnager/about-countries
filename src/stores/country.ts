import { defineStore } from 'pinia'
import axios from 'axios'

export const useCountryStore = defineStore('country', () => {
  async function fetchCountry(code: string) {
    try {
      const { data } = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`)
      return data.length > 0 ? data[0] : {}
    } catch (error) {
      console.error(error)
    }
  }
  return { fetchCountry }
})
