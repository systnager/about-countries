<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCountryStore } from '@/stores/country'
import { onMounted } from 'vue'
import { ref } from 'vue'
import type { Country } from '@/types/Countries'
import { useCountriesStore } from '@/stores/countries'

const route = useRoute()
const { t } = useI18n()
const countryStore = useCountryStore()
const countriesStore = useCountriesStore()
const country = ref({} as Country)
const relationCountries = ref([] as Country[])

onMounted(async () => {
  countriesStore.fetchCountries()
  country.value = await countryStore.fetchCountry(route.params.code as string)
  relationCountries.value = countriesStore.getRelationCountries(
    Object.values(country.value.languages),
    country.value.region,
  )
})
</script>

<template>
  <div class="text-gray dark:text-white px-15 py-10">
    <div class="flex flex-col gap-3">
      <div class="flex justify-between gap-3 bg-gray-200 dark:bg-gray-600 p-5 rounded-md">
        <div class="flex flex-col my-auto">
          <h2>
            {{ t('message.name') }}: <i>{{ country.name?.official }}</i>
          </h2>
          <span
            >{{ t('message.capital') }}: <i>{{ country.capital?.join(', ') }}</i></span
          >
          <span
            >{{ t('message.population') }}: <i>{{ country.population }}</i></span
          >
          <span
            >{{ t('message.area') }}: <i>{{ country.area }}</i></span
          >
        </div>
        <div>
          <img class="max-w-42 max-h-42" :src="country.flags?.png" />
        </div>
      </div>
      <div class="flex justify-between mt-15 bg-gray-200 dark:bg-gray-600 p-5 rounded-md">
        <span
          >{{ t('message.currencies') }}:
          <ul class="pl-5">
            <li v-for="currency in country.currencies" :key="currency.name">
              {{ currency.symbol }} {{ currency.name }}
            </li>
          </ul>
        </span>
        <span
          >{{ t('message.timezones') }}:
          <ul class="pl-5">
            <li v-for="timezone in country.timezones" :key="timezone">{{ timezone }}</li>
          </ul></span
        >
        <span
          >{{ t('message.languages') }}:
          <ul class="pl-5">
            <li v-for="lang in country.languages" :key="lang">{{ lang }}</li>
          </ul></span
        >
      </div>
    </div>
    <div class="mt-15">
      <h2>{{ t('message.related countries') }}:</h2>
      <div class="grid col-auto gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <a
          v-for="relationCountry in relationCountries"
          :key="relationCountry.name?.official"
          class="flex justify-between items-center gap-3 bg-gray-200 dark:bg-gray-600 p-5 rounded-md hover:shadow-xl cursor-pointer transition hover:scale-105 active:scale-95"
          :href="`/country/${relationCountry.ccn3}`"
          ><span>{{ relationCountry.name?.official }}</span>
          <img class="max-w-8 max-h-8" :src="relationCountry.flags?.png"
        /></a>
      </div>
    </div>
    <iframe
      v-if="country.latlng"
      class="mt-15 w-full h-120 rounded-md"
      :src="`https://maps.google.com/maps?q=${country.latlng[0]},${country.latlng[1]}&z=5&output=embed`"
      allowfullscreen="true"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    >
    </iframe>
  </div>
</template>
