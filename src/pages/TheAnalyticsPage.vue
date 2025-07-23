<script setup lang="ts">
import StatisticTable from '@/components/StatisticTable.vue'
import {
  formatTopCountriesByAreaTableData,
  formatTopCountriesByLanguagesCountTableData,
  formatTopCountriesByPopulationTableData,
} from '@/services/countriesStatisticTableFormat'
import { useCountriesStore } from '@/stores/countries'
import type { Country } from '@/types/Countries'
import type { TableData } from '@/types/Table'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LineChart from '@/components/LineChart.vue'
import type { LineChartData } from '@/types/LineChart'

const { t } = useI18n()

const countriesStore = useCountriesStore()
const topCountriesByPopulationTableData = ref<TableData>({
  headers: [],
  data: [{ id: 0, data: [] }],
})
const topCountriesByAreaTableData = ref<TableData>({
  headers: [],
  data: [{ id: 0, data: [] }],
})
const topCountriesByLanguagesCountTableData = ref<TableData>({
  headers: [],
  data: [{ id: 0, data: [] }],
})

const countriesCountOnRegionsGraphData = ref<LineChartData>({
  id: 'countriesCountOnRegionsGraph',
  categories: [],
  series: [],
})

const languageTopCountGraphData = ref<LineChartData>({
  id: 'languageTopCountGraph',
  categories: [],
  series: [],
})

onMounted(async () => {
  await countriesStore.getCountries()
  const CountryCountByRegionsStatisticData = countriesStore.getCountryCountByRegions(
    countriesStore.countries as Country[],
  )

  const languageCountStatisticData = countriesStore.getTopLanguages(
    countriesStore.countries as Country[],
    5,
  )

  topCountriesByPopulationTableData.value = formatTopCountriesByPopulationTableData(
    countriesStore.getTopCountriesByPopulation(countriesStore.countries as Country[], 10),
    ['message.№', 'message.name', 'message.population'],
  )
  topCountriesByAreaTableData.value = formatTopCountriesByAreaTableData(
    countriesStore.getTopCountriesByArea(countriesStore.countries as Country[], 10),
    ['message.№', 'message.name', 'message.area'],
  )
  topCountriesByLanguagesCountTableData.value = formatTopCountriesByLanguagesCountTableData(
    countriesStore.getTopCountriesByLanguagesCount(countriesStore.countries as Country[], 10),
    ['message.№', 'message.name', 'message.languages'],
  )

  countriesCountOnRegionsGraphData.value = {
    id: 'countriesCountOnRegionsGraph',
    categories: Object.keys(CountryCountByRegionsStatisticData),
    series: [
      { name: 'message.countries', data: Object.values(CountryCountByRegionsStatisticData) },
    ],
  }

  languageTopCountGraphData.value = {
    id: 'languageTopCountGraph',
    categories: Object.keys(languageCountStatisticData),
    series: [{ name: 'message.countries', data: Object.values(languageCountStatisticData) }],
  }
})
</script>

<template>
  <div class="text-gray dark:text-white">
    <div class="flex flex-wrap gap-5">
      <div class="flex-1 min-h-[100px] max-h-[300px] min-w-[300px] max-w-full">
        <h4 class="text-xl mt-5 font-bold text-center">{{ t('message.regions top') }}</h4>
        <LineChart :line-chart-data="countriesCountOnRegionsGraphData" />
      </div>
      <div class="flex-1 min-h-[100px] max-h-[300px] min-w-[300px] max-w-full">
        <h4 class="text-xl mt-5 font-bold text-center">{{ t('message.top 5 languages') }}</h4>
        <LineChart :line-chart-data="languageTopCountGraphData" />
      </div>
    </div>
    <div class="flex flex-wrap gap-3 mt-15">
      <div class="min-w-[350px] max-w-full border-collapse mx-1 py-5 flex-1">
        <h3 class="text-xl mb-5 font-bold text-center">
          {{ t('message.top 10 countries') }} {{ t('message.by population') }}
        </h3>
        <StatisticTable
          class="w-full rounded-md overflow-hidden"
          :table-data="topCountriesByPopulationTableData"
        />
      </div>
      <div class="min-w-[350px] max-w-full border-collapse mx-1 py-5 flex-1">
        <h3 class="text-xl mb-5 font-bold text-center">
          {{ t('message.top 10 countries') }} {{ t('message.by area') }}
        </h3>
        <StatisticTable
          class="w-full rounded-md overflow-hidden"
          :table-data="topCountriesByAreaTableData"
        />
      </div>
      <div class="min-w-[350px] max-w-full border-collapse mx-1 py-5 flex-1">
        <h3 class="text-xl mb-5 font-bold text-center">
          {{ t('message.top 10 countries') }} {{ t('message.by languages count') }}
        </h3>
        <StatisticTable
          class="w-full rounded-md overflow-hidden"
          :table-data="topCountriesByLanguagesCountTableData"
        />
      </div>
    </div>
  </div>
</template>
