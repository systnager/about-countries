<script setup lang="ts">
import ApexCharts from 'apexcharts'
import { computed, onMounted, ref, watch } from 'vue'
import { useTheme } from '@/composables/useTheme'
import type { LineChartData } from '@/types/LineChart'

const props = defineProps<{
  lineChartData: LineChartData
}>()

const { isDark } = useTheme()
const chart = ref<ApexCharts | null>(null)

const options = computed(() => ({
  chart: {
    type: 'bar',
    height: '100%',
    background: 'transparent',
    toolbar: {
      show: false,
    },
  },
  theme: {
    mode: isDark.value ? 'dark' : 'light',
  },
  colors: ['#10b981', '#3b82f6', '#f43f5e', '#fcd34d', '#8b5cf6', '#f472b6'],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '75%',
      borderRadius: 3,
    },
  },
  series: props.lineChartData.series,
  xaxis: {
    categories: props.lineChartData.categories,
    labels: {
      style: {
        fontSize: '14px',
        colors: isDark.value ? '#fff' : '#000',
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        fontSize: '14px',
        colors: isDark.value ? '#fff' : '#000',
      },
    },
  },
  grid: {
    borderColor: isDark.value ? '#fff' : '#000',
    strokeDashArray: 4,
  },
  legend: {
    position: 'top',
    labels: {
      colors: isDark.value ? '#fff' : '#000',
    },
  },
}))

onMounted(() => {
  chart.value = new ApexCharts(
    document.querySelector(`#${props.lineChartData.id}`) as HTMLElement,
    options.value,
  )
  chart.value.render()
})

watch(options, () => {
  chart.value?.render()
  chart.value?.updateOptions(options.value)
})
</script>

<template>
  <div :id="lineChartData.id" class="max-w-full m-auto text-gray dark:text-white"></div>
</template>
