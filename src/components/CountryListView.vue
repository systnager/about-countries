<script setup lang="ts">
import { ref, inject, readonly } from 'vue'
import { useI18n } from 'vue-i18n'
import { watchDebounced, useInfiniteScroll } from '@vueuse/core'
import { LOADER_PROVIDER_KEY } from '@/keys'
import { type Country } from '@/types/Countries'
import { type loaderProvide } from '@/types/Loader'
import CountryCardList from '@/components/CountryCardList.vue'

const { t } = useI18n()
const { showLoader, hideLoader, isLoading } = <loaderProvide>inject(LOADER_PROVIDER_KEY)

const filterByNameInput = ref<string>('')
const filterByRegionInput = ref<string>('')
const filterByLanguageInput = ref<string>('')

const props = defineProps<{
  countries: Country[]
  onLoadMore: () => void
  canLoadMore: () => boolean
}>()

const emit = defineEmits<{
  (e: 'sortCountries', value: string): void
  (e: 'filterCountries'): void
  (e: 'toggleFavoriteCountry', officialName: string): void
}>()

defineExpose({
  filterByNameInput: readonly(filterByNameInput),
  filterByRegionInput: readonly(filterByRegionInput),
  filterByLanguageInput: readonly(filterByLanguageInput),
})

function onSortCountries(value: string) {
  showLoader()
  if (value === 'byPopulation') {
    emit('sortCountries', 'byPopulation')
  } else if (value === 'byArea') {
    emit('sortCountries', 'byArea')
  } else if (value === 'byPopulationDensity') {
    emit('sortCountries', 'byPopulationDensity')
  }
  hideLoader()
}

function toggleFavoriteCountry(officialName: string) {
  emit('toggleFavoriteCountry', officialName)
}

useInfiniteScroll(
  window,
  () => {
    if (!isLoading.value && props.canLoadMore()) {
      props.onLoadMore()
    }
  },
  { distance: 200 },
)

watchDebounced(
  [filterByNameInput, filterByRegionInput, filterByLanguageInput],
  () => {
    showLoader()
    emit('filterCountries')
    hideLoader()
  },
  { debounce: 250 },
)
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-center gap-2 p-4 max-w-full mx-auto mt-2">
      <select
        class="flex-grow min-w-[150px] max-w-full h-11 bg-white dark:bg-neutral-700 px-5 rounded-md text-black dark:text-white shadow-md cursor-pointer truncate"
        @change="onSortCountries(($event.target as HTMLSelectElement).value || '')"
      >
        <option value="" disabled selected>{{ t('message.sort by') }}</option>
        <option value="byPopulation">{{ t('message.by population') }}</option>
        <option value="byArea">{{ t('message.by area') }}</option>
        <option value="byPopulationDensity">{{ t('message.by population density') }}</option>
      </select>

      <input
        type="text"
        class="flex-grow min-w-[150px] max-w-full h-11 bg-white dark:bg-neutral-700 px-5 rounded-md text-black dark:text-white shadow-md"
        :placeholder="t('message.by name')"
        v-model="filterByNameInput"
      />

      <input
        type="text"
        class="flex-grow min-w-[150px] max-w-full h-11 bg-white dark:bg-neutral-700 px-5 rounded-md text-black dark:text-white shadow-md"
        :placeholder="t('message.by continent')"
        v-model="filterByRegionInput"
      />

      <input
        type="text"
        class="flex-grow min-w-[150px] max-w-full h-11 bg-white dark:bg-neutral-700 px-5 rounded-md text-black dark:text-white shadow-md"
        :placeholder="t('message.by language')"
        v-model="filterByLanguageInput"
      />
    </div>

    <CountryCardList :countries="countries" @toggle-favorite-country="toggleFavoriteCountry" />
  </div>
</template>
