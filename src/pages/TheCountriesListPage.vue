<script setup lang="ts">
import { onMounted } from 'vue'
import CountryCardList from '@/components/CountryCardList.vue'
import { useCountries, fetchCountries } from '@/services/CountriesService'

const { countries } = useCountries()

onMounted(() => {
  fetchCountries()
  console.log(countries)
})
</script>

<template>
  <div>
    <CountryCardList :countries="countries" />
  </div>
</template>
