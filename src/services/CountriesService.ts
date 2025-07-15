import { ref } from 'vue'
import axios from 'axios'

const countries = ref([])

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
