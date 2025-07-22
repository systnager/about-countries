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

onMounted(async () => {
  await countriesStore.getCountries()
  topCountriesByPopulationTableData.value = formatTopCountriesByPopulationTableData(
    countriesStore.getTopCountriesByPopulation(countriesStore.countries as Country[], 10),
    ['№', 'Name', 'Population'],
  )
  topCountriesByAreaTableData.value = formatTopCountriesByAreaTableData(
    countriesStore.getTopCountriesByArea(countriesStore.countries as Country[], 10),
    ['№', 'Name', 'Area'],
  )
  topCountriesByLanguagesCountTableData.value = formatTopCountriesByLanguagesCountTableData(
    countriesStore.getTopCountriesByLanguagesCount(countriesStore.countries as Country[], 10),
    ['№', 'Name', 'Languages count'],
  )
})
</script>

<template>
  <div class="text-gray dark:text-white">
    <div>
      <div class="w-full border-collapse px-10 py-5">
        <h3 class="text-xl mb-5 font-bold text-center">Top 10 countries</h3>
        <StatisticTable
          class="w-full rounded-md overflow-hidden"
          :table-data="topCountriesByPopulationTableData"
        />
      </div>
      <div class="w-full border-collapse px-10 py-5">
        <h3 class="text-xl mb-5 font-bold text-center">Top 10 countries</h3>
        <StatisticTable
          class="w-full rounded-md overflow-hidden"
          :table-data="topCountriesByAreaTableData"
        />
      </div>
      <div class="w-full border-collapse px-10 py-5">
        <h3 class="text-xl mb-5 font-bold text-center">Top 10 countries</h3>
        <StatisticTable
          class="w-full rounded-md overflow-hidden"
          :table-data="topCountriesByLanguagesCountTableData"
        />
      </div>
    </div>
  </div>
</template>
