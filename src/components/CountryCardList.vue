<script setup lang="ts">
import { type Country } from '@/types/Countries'
import CountryCard from '@/components/CountryCard.vue'
defineProps({
  countries: {
    type: Array<Country>,
    required: true,
  },
})

const emit = defineEmits(['toggleFavoriteCountry'])

function onToggleFavorite(officialName: string) {
  emit('toggleFavoriteCountry', officialName)
}
</script>
<template>
  <div class="grid col-auto gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 m-3">
    <CountryCard
      v-for="country in countries"
      :key="country.name.official"
      :area="country.area"
      :flagUrl="country.flags.png"
      :lang="Object.values(country.languages).join(', ')"
      :name="country.name.official"
      :population="country.population"
      :region="country.region"
      :isFavorite="country.isFavorite"
      :ccn3="country.ccn3"
      @toggle-favorite="onToggleFavorite(country.name.official)"
    />
  </div>
</template>
